import { z } from 'zod'

const InquirySchema = z.object({
  name:    z.string().min(2).max(100).trim(),
  email:   z.string().email().trim(),
  phone:   z.string().optional().or(z.literal('')),
  message: z.string().min(10).max(2000).trim(),
})

async function sendWhatsAppNotification(data: { name: string; email: string; phone: string; message: string }) {
  const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
  const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN
  const OWNER_WHATSAPP_NUMBER = process.env.OWNER_WHATSAPP_NUMBER // e.g. "919876543210" (no +, no spaces)

  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN || !OWNER_WHATSAPP_NUMBER) {
    console.warn('WhatsApp notification skipped: missing env vars')
    return
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: OWNER_WHATSAPP_NUMBER,
        type: 'template',
        template: {
          name: 'new_inquiry',
          language: { code: 'en' },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: data.name },
                { type: 'text', text: data.email },
                { type: 'text', text: data.phone || 'Not provided' },
                { type: 'text', text: data.message },
              ],
            },
          ],
        },
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('WhatsApp send error:', errText)
    }
  } catch (err) {
    console.error('WhatsApp notification error:', err)
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = InquirySchema.safeParse(body)
    if (!result.success) {
      return Response.json({ success: false, error: 'Validation failed' }, { status: 400 })
    }

    const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
    const TOKEN  = process.env.STRAPI_API_TOKEN || ''
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (TOKEN) headers['Authorization'] = `Bearer ${TOKEN}`

    const strapiRes = await fetch(`${STRAPI}/api/inquiries`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        data: {
          name:    result.data.name,
          email:   result.data.email,
          phone:   result.data.phone || '',
          message: result.data.message,
        }
      }),
    })

    if (!strapiRes.ok) {
      const errText = await strapiRes.text()
      console.error('Strapi error:', errText)
      return Response.json({ success: false, error: 'Failed to save' }, { status: 500 })
    }

    const data = await strapiRes.json()

    // Fire-and-forget: don't block the response on WhatsApp send succeeding
    sendWhatsAppNotification({
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone || '',
      message: result.data.message,
    })

    return Response.json({ success: true, id: String(data.data?.id) }, { status: 201 })
  } catch (err) {
    console.error('Inquiry error:', err)
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}