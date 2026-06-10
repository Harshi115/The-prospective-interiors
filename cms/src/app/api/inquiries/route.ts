import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const payload = await getPayload({ config })

    const inquiry = await payload.create({
      collection: 'inquiries',
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        projectType: body.projectType,
        message: body.message,
        submittedAt: new Date().toISOString(),
        status: 'New',
      },
    })

    return Response.json({
      success: true,
      inquiry,
    })
  } catch (error) {
    console.error(error)

    return Response.json(
      {
        success: false,
      },
      {
        status: 500,
      },
    )
  }
}