import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    if (!url) return NextResponse.json({ error: "No URL provided" }, { status: 400 })

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        test: true,
        message: "Test from Admin Panel",
        timestamp: new Date().toISOString(),
      }),
    })

    if (res.ok) return NextResponse.json({ success: true })
    
    const errorText = await res.text().catch(() => "Unknown error")
    console.error("Webhook test failed:", res.status, errorText)
    return NextResponse.json({ error: `Server returned ${res.status}: ${errorText.substring(0, 50)}` }, { status: 500 })
  } catch (e: any) {
    console.error("Webhook connection error:", e.message)
    return NextResponse.json({ error: `Connection failed: ${e.message}` }, { status: 500 })
  }
}
