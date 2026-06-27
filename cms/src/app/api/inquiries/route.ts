import { z } from 'zod'

const InquirySchema = z.object({
  name:        z.string().min(2).max(100).trim(),
  email:       z.string().email().trim(),
  phone:       z.string().optional().or(z.literal('')),
  projectType: z.enum(['Residential','Commercial','Hospitality','Industrial','Healthcare','Other']).optional(),
  message:     z.string().min(10).max(2000).trim(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = InquirySchema.safeParse(body)
    if (!result.success) {
      return Response.json({ success: false, error: 'Validation failed' }, { status: 400 })
    }

    const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
    const TOKEN  = process.env.STRAPI_API_TOKEN || ''

    const strapiRes = await fetch(`${STRAPI}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({
        data: { ...result.data, projectType: result.data.projectType ?? 'Other', submittedAt: new Date().toISOString(), status: 'New' }
      }),
    })

    if (!strapiRes.ok) return Response.json({ success: false, error: 'Failed to save' }, { status: 500 })
    const data = await strapiRes.json()
    return Response.json({ success: true, id: String(data.data?.id) }, { status: 201 })
  } catch {
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
