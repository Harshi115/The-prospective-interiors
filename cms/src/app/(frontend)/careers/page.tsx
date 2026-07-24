import CareerClient from './careersclient'

export const metadata = {
  title: 'Careers — The Prospective Interiors',
}

export const revalidate = 60
export const dynamic = 'force-dynamic'

export default async function CareersPage() {
  const STRAPI = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
  const STRAPI_PUBLIC = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
  const TOKEN = process.env.STRAPI_API_TOKEN || ''
  const headers = { Authorization: `Bearer ${TOKEN}` }

  const getImgUrl = (media: any) => {
    const m = Array.isArray(media) ? media[0] : media
    const url = m?.url ?? m?.data?.attributes?.url ?? ''
    return url.startsWith('http') ? url : url ? `${STRAPI_PUBLIC}${url}` : ''
  }

  let pageContent: Record<string, any> = {
    heroLabel: '',
    heroHeading: '',
    heroSubtext: '',
    heroImage: '',
  }

  try {
    const res = await fetch(`${STRAPI}/api/careers-pages?populate[0]=heroImage`, { headers, next: { revalidate: 60 } })
    if (res.ok) {
      const json = await res.json()
      const data = json?.data?.[0] ?? {}
      pageContent = { ...pageContent, ...data, heroImage: getImgUrl(data.heroImage) || '' }
    }
  } catch (error) {
    console.error('Careers page content fetch error:', error)
  }

  let stats: { label: string; value: string }[] = []
  try {
    const statsRes = await fetch(`${STRAPI}/api/stats?sort=order:asc`, { headers, next: { revalidate: 60 } })
    if (statsRes.ok) {
      const statsJson = await statsRes.json()
      stats = (statsJson?.data ?? []).map((s: any) => ({ label: s.label ?? '', value: s.value ?? '' }))
    }
  } catch (error) {
    console.error('Careers page stats fetch error:', error)
  }

  return <CareerClient pageContent={pageContent} stats={stats} />
}