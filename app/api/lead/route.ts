import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { appendLead } from "@/lib/leads"
import { getClientIp } from "@/lib/client-ip"
import { checkLeadRateLimit } from "@/lib/rate-limit"
import { isTurnstileRequired, verifyTurnstileToken } from "@/lib/turnstile"

function smtpConfig() {
  const user = process.env.EMAIL_USER || ""
  const pass = process.env.EMAIL_PASS || ""
  if (!user || !pass) return null
  const host = process.env.SMTP_HOST || "smtp.gmail.com"
  const port = parseInt(process.env.SMTP_PORT || "465", 10)
  const to = process.env.SMTP_TO || user
  return { host, port, user, pass, to }
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req)
    const rl = checkLeadRateLimit(`lead:${ip}`)
    if (!rl.ok) {
      return NextResponse.json(
        { error: `Too many submissions. Please try again in ${rl.retryAfterSec} seconds.` },
        { status: 429 },
      )
    }

    let data: Record<string, unknown>
    try {
      data = await req.json()
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
    }

    const { name, phone, degree, looking, turnstileToken } = data as {
      name?: unknown
      phone?: unknown
      degree?: unknown
      looking?: unknown
      turnstileToken?: unknown
    }

    if (isTurnstileRequired()) {
      const ok = await verifyTurnstileToken(
        typeof turnstileToken === "string" ? turnstileToken : undefined,
        ip,
      )
      if (!ok) {
        return NextResponse.json(
          { error: "Could not verify anti-bot challenge. Refresh the page and try again." },
          { status: 400 },
        )
      }
    }

    if (!name || !phone || !degree || !looking) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 })
    }

    let stored
    try {
      stored = appendLead({
        name: String(name),
        phone: String(phone),
        degree: String(degree),
        looking: String(looking),
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      console.error("[api/lead] appendLead:", e)
      return NextResponse.json(
        {
          error:
            "We could not save your details on the server (storage error). Ask your host to allow file writes or set LEADS_DATA_DIR to a folder the Node app can write to.",
          code: "STORAGE_ERROR",
          details: msg.slice(0, 600),
        },
        { status: 503 },
      )
    }

    try {
      const { appendLeadToGoogleSheet } = await import("@/lib/google-sheets")
      await appendLeadToGoogleSheet(stored)
    } catch (e) {
      console.error("Google Sheets append failed:", e)
    }

    const smtp = smtpConfig()
    if (smtp) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtp.host,
          port: smtp.port,
          secure: smtp.port === 465,
          auth: {
            user: smtp.user,
            pass: smtp.pass,
          },
        })

        await transporter.sendMail({
          from: `"UniqJobs Leads" <${smtp.user}>`,
          to: smtp.to,
          subject: `New Lead: ${name} (${looking})`,
          html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>New Lead Received</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Degree:</strong> ${degree}</p>
            <p><strong>Interest:</strong> ${looking}</p>
          </div>
        `,
        })
      } catch (e) {
        console.error("SMTP backup failed:", e)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Form error:", error)
    const expose =
      process.env.NODE_ENV !== "production" || process.env.EXPOSE_SERVER_ERRORS === "true"
    const message = expose && error instanceof Error ? error.message : "Submission failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
