import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { getSettings } from "@/lib/settings"

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { name, phone, degree, looking } = data
    const settings = getSettings()

    // Basic server-side validation
    if (!name || !phone || !degree || !looking) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 })
    }

    // 1. Send data to n8n Webhook (Dynamic URL from Admin)
    const webhookUrl = settings.webhookUrl
    
    if (webhookUrl) {
      const payload = {
        ...data,
        source: "UniqJobs Landing Page",
        timestamp: new Date().toISOString(),
      }

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal
        })
        clearTimeout(timeoutId)
      } catch (e) {
        console.error("n8n Webhook failed")
      }
    }

    // 2. Send Email Backup (Dynamic SMTP from Admin)
    if (settings.smtpUser && settings.smtpPass) {
      const transporter = nodemailer.createTransport({
        host: settings.smtpHost,
        port: settings.smtpPort,
        secure: settings.smtpPort === 465,
        auth: { 
          user: settings.smtpUser, 
          pass: settings.smtpPass 
        },
      })

      await transporter.sendMail({
        from: `"UniqJobs Leads" <${settings.smtpUser}>`,
        to: settings.smtpTo,
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
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Form error:", error)
    return NextResponse.json({ error: "Submission failed" }, { status: 500 })
  }
}
