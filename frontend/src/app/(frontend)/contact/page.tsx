import ContactClient from './contactclient'

export const metadata = {
  title: 'Contact — The Prospective Interiors',
  description: 'Get in touch with The Prospective Interiors. Have a project in mind? Let\'s talk.',
}

export const revalidate = 60
export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  const STRAPI = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
  const STRAPI_PUBLIC = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
  const TOKEN = process.env.STRAPI_API_TOKEN || ''
  const headers = { Authorization: `Bearer ${TOKEN}` }

  const getImgUrl = (media: any) => {
    const m = Array.isArray(media) ? media[0] : media
    const url = m?.url ?? m?.data?.attributes?.url ?? ''
    return url.startsWith('http') ? url : url ? `${STRAPI_PUBLIC}${url}` : ''
  }

  let pageContent: Record<string, any> = {}

  try {
    const res = await fetch(
      `${STRAPI}/api/contact-pages?populate[0]=heroImage&populate[1]=studioImage`,
      { headers, next: { revalidate: 60 } }
    )
    if (res.ok) {
      const json = await res.json()
      const data = json?.data?.[0] ?? {}
      pageContent = {
        ...data,
        heroImage: getImgUrl(data.heroImage),
        studioImage: getImgUrl(data.studioImage),
      }
    }
  } catch (error) {
    console.error('Contact page content fetch error (using fallback text):', error)
  }

  return <ContactClient pageContent={pageContent} />
}