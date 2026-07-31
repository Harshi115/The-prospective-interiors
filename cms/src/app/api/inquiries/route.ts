import { z } from 'zod'
import nodemailer from 'nodemailer'

const InquirySchema = z.object({
  name:    z.string().min(2).max(100).trim(),
  email:   z.string().email().trim(),
  phone:   z.string().optional().or(z.literal('')),
  message: z.string().min(10).max(2000).trim(),
})

async function syncToHubSpot(data: { name: string; email: string; phone: string; message: string }) {
  const HUBSPOT_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN
  if (!HUBSPOT_TOKEN) {
    console.warn('HubSpot sync skipped: missing env var')
    return
  }
  try {
    const [firstname, ...rest] = data.name.trim().split(' ')
    const lastname = rest.join(' ')

    const res = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HUBSPOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          email: data.email,
          firstname,
          lastname: lastname || '',
          phone: data.phone || '',
          message: data.message,
        },
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      // HubSpot returns 409 if a contact with this email already exists —
      // that's expected on repeat inquiries, not a real failure.
      if (res.status === 409) {
        console.log('HubSpot contact already exists for this email, skipping create.')
      } else {
        console.error('HubSpot sync error:', errText)
      }
    }
  } catch (err) {
    console.error('HubSpot sync error:', err)
  }
}


function normalizeIndianPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 10) return `91${digits}`
  if (digits.length === 12 && digits.startsWith('91')) return digits
  if (digits.length === 11 && digits.startsWith('0')) return `91${digits.slice(1)}`
  return digits
}

async function sendOwnerWhatsAppNotification(data: { name: string; email: string; phone: string; message: string }) {
  const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
  const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN
  const OWNER_WHATSAPP_NUMBER = process.env.OWNER_WHATSAPP_NUMBER
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN || !OWNER_WHATSAPP_NUMBER) {
    console.warn('Owner WhatsApp notification skipped: missing env vars')
    return
  }
  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: OWNER_WHATSAPP_NUMBER,
        type: 'template',
        template: {
          name: 'new_inquiry',
          language: { code: 'en' },
          components: [{
            type: 'body',
            parameters: [
              { type: 'text', text: data.name },
              { type: 'text', text: data.email },
              { type: 'text', text: data.phone || 'Not provided' },
              { type: 'text', text: data.message },
            ],
          }],
        },
      }),
    })
    if (!res.ok) console.error('Owner WhatsApp send error:', await res.text())
  } catch (err) {
    console.error('Owner WhatsApp notification error:', err)
  }
}

async function sendCustomerWhatsAppNotification(data: { name: string; phone: string }) {
  const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
  const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    console.warn('Customer WhatsApp confirmation skipped: missing env vars')
    return
  }
  if (!data.phone) {
    // No phone number was provided on the form — nothing to send to.
    return
  }
  const normalizedPhone = normalizeIndianPhone(data.phone)
  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: normalizedPhone,
        type: 'template',
        template: {
          name: 'inquiry_confirmation',
          language: { code: 'en' },
          components: [{
            type: 'body',
            parameters: [
              { type: 'text', text: data.name },
            ],
          }],
        },
      }),
    })
    if (!res.ok) console.error('Customer WhatsApp send error:', await res.text())
  } catch (err) {
    console.error('Customer WhatsApp notification error:', err)
  }
}

async function sendCustomerEmailConfirmation(data: { name: string; email: string }) {
  const GMAIL_USER = process.env.GMAIL_USER
  const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.warn('Customer email confirmation skipped: missing env vars')
    return
  }
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
    })
    await transporter.sendMail({
      from: `"The Prospective Interiors" <${GMAIL_USER}>`,
      to: data.email,
      subject: 'We received your message — The Prospective Interiors',
      text: `Hi ${data.name},\n\nThank you for reaching out to The Prospective Interiors! We've received your message and our team will get in touch with you shortly.\n\nWarm regards,\nThe Prospective Interiors Team`,
      html: `<p>Hi ${data.name},</p><p>Thank you for reaching out to <strong>The Prospective Interiors</strong>! We've received your message and our team will get in touch with you shortly.</p><p>Warm regards,<br/>The Prospective Interiors Team</p>`,
    })
  } catch (err) {
    console.error('Customer email confirmation error:', err)
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

    // Run all notifications in PARALLEL (not sequential) to stay well under Vercel's timeout.
    await Promise.all([
      sendOwnerWhatsAppNotification({
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone || '',
        message: result.data.message,
      }),
      sendCustomerEmailConfirmation({ name: result.data.name, email: result.data.email }),
      sendCustomerWhatsAppNotification({ name: result.data.name, phone: result.data.phone || '' }),
      syncToHubSpot({
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone || '',
        message: result.data.message,
      }),
    ])

    return Response.json({ success: true, id: String(data.data?.id) }, { status: 201 })
  } catch (err) {
    console.error('Inquiry error:', err)
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}