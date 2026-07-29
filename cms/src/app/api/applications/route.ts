import { z } from 'zod'
import nodemailer from 'nodemailer'

const ApplicationSchema = z.object({
  name:       z.string().min(2).max(100).trim(),
  email:      z.string().email().trim(),
  phone:      z.string().optional().or(z.literal('')),
  position:   z.string().min(1),
  experience: z.string().optional().or(z.literal('')),
  message:    z.string().min(10).max(2000).trim(),
})

function normalizeIndianPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 10) return `91${digits}`
  if (digits.length === 12 && digits.startsWith('91')) return digits
  if (digits.length === 11 && digits.startsWith('0')) return `91${digits.slice(1)}`
  return digits
}

async function sendOwnerWhatsAppNotification(data: { name: string; email: string; phone: string; position: string }) {
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
          // NOTE: This template must exist and be APPROVED in Meta WhatsApp Manager
          // before this will work — same process as 'new_inquiry' was approved.
          name: 'new_application',
          language: { code: 'en' },
          components: [{
            type: 'body',
            parameters: [
              { type: 'text', text: data.name },
              { type: 'text', text: data.position },
              { type: 'text', text: data.email },
              { type: 'text', text: data.phone || 'Not provided' },
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

async function sendApplicantEmailConfirmation(data: { name: string; email: string; position: string }) {
  const GMAIL_USER = process.env.GMAIL_USER
  const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.warn('Applicant email confirmation skipped: missing env vars')
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
      subject: 'We received your application — The Prospective Interiors',
      text: `Hi ${data.name},\n\nThank you for applying for the ${data.position} position at The Prospective Interiors! We've received your application and our team will review it and get back to you within 5 working days.\n\nWarm regards,\nThe Prospective Interiors Team`,
      html: `<p>Hi ${data.name},</p><p>Thank you for applying for the <strong>${data.position}</strong> position at <strong>The Prospective Interiors</strong>! We've received your application and our team will review it and get back to you within 5 working days.</p><p>Warm regards,<br/>The Prospective Interiors Team</p>`,
    })
  } catch (err) {
    console.error('Applicant email confirmation error:', err)
  }
}

async function sendApplicantWhatsAppConfirmation(data: { name: string; phone: string; position: string }) {
  const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
  const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    console.warn('Applicant WhatsApp confirmation skipped: missing env vars')
    return
  }
  if (!data.phone) return
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
          // NOTE: Needs its own approved template in Meta WhatsApp Manager,
          // e.g. named 'application_confirmation'.
          name: 'application_confirmation',
          language: { code: 'en' },
          components: [{
            type: 'body',
            parameters: [
              { type: 'text', text: data.name },
              { type: 'text', text: data.position },
            ],
          }],
        },
      }),
    })
    if (!res.ok) console.error('Applicant WhatsApp send error:', await res.text())
  } catch (err) {
    console.error('Applicant WhatsApp confirmation error:', err)
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const result = ApplicationSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone') || '',
      position: formData.get('position'),
      experience: formData.get('experience') || '',
      message: formData.get('message'),
    })

    if (!result.success) {
      return Response.json({ success: false, error: 'Validation failed' }, { status: 400 })
    }

    const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
    const TOKEN  = process.env.STRAPI_API_TOKEN || ''
    const authHeaders: Record<string, string> = {}
    if (TOKEN) authHeaders['Authorization'] = `Bearer ${TOKEN}`

    // 1. Upload the resume/portfolio file to Strapi's Media Library, if one was attached.
    let resumeFileId: number | null = null
    const resumeFile = formData.get('portfolio') as File | null
    if (resumeFile && resumeFile.size > 0) {
      const uploadForm = new FormData()
      uploadForm.append('files', resumeFile, resumeFile.name)
      const uploadRes = await fetch(`${STRAPI}/api/upload`, {
        method: 'POST',
        headers: authHeaders, // do NOT set Content-Type — browser/fetch sets the multipart boundary
        body: uploadForm,
      })
      if (uploadRes.ok) {
        const uploaded = await uploadRes.json()
        resumeFileId = uploaded?.[0]?.id ?? null
      } else {
        console.error('Resume upload to Strapi failed:', await uploadRes.text())
      }
    }

    // 2. Create the application entry in Strapi.
    const strapiRes = await fetch(`${STRAPI}/api/applications`, {
      method: 'POST',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          name:       result.data.name,
          email:      result.data.email,
          phone:      result.data.phone || '',
          position:   result.data.position,
          experience: result.data.experience || '',
          message:    result.data.message,
          ...(resumeFileId ? { resume: resumeFileId } : {}),
        }
      }),
    })

    if (!strapiRes.ok) {
      const errText = await strapiRes.text()
      console.error('Strapi error:', errText)
      return Response.json({ success: false, error: 'Failed to save' }, { status: 500 })
    }

    const data = await strapiRes.json()

    // 3. Notifications — run in parallel to stay well under Vercel's timeout.
    await Promise.all([
      sendOwnerWhatsAppNotification({
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone || '',
        position: result.data.position,
      }),
      sendApplicantEmailConfirmation({
        name: result.data.name,
        email: result.data.email,
        position: result.data.position,
      }),
      sendApplicantWhatsAppConfirmation({
        name: result.data.name,
        phone: result.data.phone || '',
        position: result.data.position,
      }),
    ])

    return Response.json({ success: true, id: String(data.data?.id) }, { status: 201 })
  } catch (err) {
    console.error('Application error:', err)
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}