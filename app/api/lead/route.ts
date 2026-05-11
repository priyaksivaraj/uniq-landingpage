import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { appendLead } from "@/lib/leads"
import { appendLeadToGoogleSheet } from "@/lib/google-sheets"
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

    const data = (await req.json()) as Record<string, unknown>
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

    const stored = appendLead({
      name: String(name),
      phone: String(phone),
      degree: String(degree),
      looking: String(looking),
    })

    try {
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
    return NextResponse.json({ error: "Submission failed" }, { status: 500 })
  }
}
