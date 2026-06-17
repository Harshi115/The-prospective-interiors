import { getPayload } from 'payload'
import config from '@/payload.config'
import { z } from 'zod'

const InquirySchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be under 100 characters')
    .trim(),

  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address')
    .trim(),

  phone: z.string().optional().or(z.literal('')),

  projectType: z
    .enum(['Residential','Commercial','Hospitality','Industrial','Healthcare','Retail','Educational','Other'])
    .optional(),

  message: z
    .string({ required_error: 'Message is required' })
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be under 2000 characters')
    .trim(),
})

export async function POST(req: Request) {
  try {
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return Response.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    const result = InquirySchema.safeParse(body)

    if (!result.success) {
      return Response.json(
        {
          success: false,
          error: 'Validation failed',
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const validated = result.data
    const payload = await getPayload({ config })

    const inquiry = await payload.create({
      collection: 'inquiries',
      data: {
        name:        validated.name,
        email:       validated.email,
        phone:       validated.phone ?? '',
        projectType: validated.projectType ?? 'Other',
        message:     validated.message,
        submittedAt: new Date().toISOString(),
        status:      'New',
      },
    })

    return Response.json(
      { success: true, message: 'Inquiry submitted successfully', id: String(inquiry.id) },
      { status: 201 }
    )

  } catch (error) {
    console.error('[POST /api/inquiries] Error:', error)
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
