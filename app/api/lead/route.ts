import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const { name, phone, degree, looking } = await req.json()

    // Basic server-side validation
    if (!name || !phone || !degree || !looking) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 })
    }

    const emailUser = process.env.EMAIL_USER?.trim()
    const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, "").trim()

    if (!emailUser || !emailPass) {
      console.error("[v0] EMAIL_USER or EMAIL_PASS env vars are missing")
      return NextResponse.json({ error: "Email service not configured." }, { status: 500 })
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    })

    await transporter.sendMail({
      from: `"UniqJobs Leads" <${process.env.EMAIL_USER}>`,
      to: "shaninfozub@gmail.com",
      subject: "New Lead from UniqJobs Landing Page",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; border-radius: 12px; overflow: hidden;">
          <div style="background: #cc0000; padding: 24px 32px;">
            <h1 style="margin: 0; font-size: 22px; color: #ffffff;">New Lead Received</h1>
            <p style="margin: 4px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">UniqJobs Landing Page Enquiry</p>
          </div>
          <div style="padding: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                <td style="padding: 14px 0; color: rgba(255,255,255,0.5); font-size: 13px; width: 140px;">Full Name</td>
                <td style="padding: 14px 0; color: #ffffff; font-weight: 600; font-size: 15px;">${name}</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                <td style="padding: 14px 0; color: rgba(255,255,255,0.5); font-size: 13px;">Contact Number</td>
                <td style="padding: 14px 0; color: #ffffff; font-weight: 600; font-size: 15px;">${phone}</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                <td style="padding: 14px 0; color: rgba(255,255,255,0.5); font-size: 13px;">Degree</td>
                <td style="padding: 14px 0; color: #ffffff; font-weight: 600; font-size: 15px;">${degree}</td>
              </tr>
              <tr>
                <td style="padding: 14px 0; color: rgba(255,255,255,0.5); font-size: 13px;">Looking For</td>
                <td style="padding: 14px 0; color: #cc0000; font-weight: 700; font-size: 15px;">${looking}</td>
              </tr>
            </table>
            <div style="margin-top: 28px; padding: 16px; background: rgba(204,0,0,0.1); border-left: 3px solid #cc0000; border-radius: 4px;">
              <p style="margin: 0; color: rgba(255,255,255,0.6); font-size: 13px;">
                Submitted on: <strong style="color: #ffffff;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</strong>
              </p>
            </div>
          </div>
          <div style="padding: 20px 32px; background: rgba(255,255,255,0.03); text-align: center;">
            <p style="margin: 0; color: rgba(255,255,255,0.3); font-size: 12px;">UniqJobs — Software Training &amp; Placement Institute, Chennai</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error("[v0] Lead email error:", msg)
    return NextResponse.json({ error: `Email failed: ${msg}` }, { status: 500 })
  }
}
