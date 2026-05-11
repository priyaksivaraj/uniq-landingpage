import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { name, phone, degree, looking } = data

    // Basic server-side validation
    if (!name || !phone || !degree || !looking) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 })
    }

    // 1. Send data to n8n Webhook (Try both Production and Test URLs)
    const n8nBase = "https://n8n-0zzt.srv1353277.hstgr.cloud"
    const webhookId = "bd0476d5-48cb-4ee1-83dc-e040c2122ce8"
    
    const payload = {
      ...data,
      source: "UniqJobs Landing Page",
      timestamp: new Date().toISOString(),
      sheetId: "1fNUOr1qDTARinbde4BXp7WEuY8GcZKmvV22uzecA2ks"
    }

    const tryWebhook = async (path: string) => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)
        await fetch(`${n8nBase}/${path}/${webhookId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal
        })
        clearTimeout(timeoutId)
      } catch (e) {
        console.error(`n8n ${path} failed`)
      }
    }

    // Fire both production and test webhooks for maximum reliability
    await Promise.all([
      tryWebhook("webhook"),
      tryWebhook("webhook-test")
    ])

    // 2. Send Email Backup (using existing logic)
    const emailUser = process.env.EMAIL_USER?.trim()
    const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, "").trim()

    if (emailUser && emailPass) {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user: emailUser, pass: emailPass },
      })

      await transporter.sendMail({
        from: `"UniqJobs Leads" <${emailUser}>`,
        to: "shaninfozub@gmail.com",
        subject: `New Lead: ${name} (${looking})`,
        html: `
          <div style="font-family: sans-serif; background: #f9f9f9; padding: 20px;">
            <h2>New Lead Received</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Degree:</strong> ${degree}</p>
            <p><strong>Interest:</strong> ${looking}</p>
            <hr />
            <p style="font-size: 12px; color: #666;">Sent to n8n and logged.</p>
          </div>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Form error:", error)
    return NextResponse.json({ error: "Submission failed" }, { status: 500 })
  }
}
