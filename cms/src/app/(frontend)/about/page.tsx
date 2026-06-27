
import AboutClient from './AboutClient'

export const metadata = {
  title: 'About — The Prospective Interiors',
  description: 'Learn about The Prospective Interiors — established 2004, led by Prashant Bhandiya.',
}

export const revalidate = 60

export default async function AboutPage() {
  const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
  const TOKEN  = process.env.STRAPI_API_TOKEN || ''
  const headers = { Authorization: `Bearer ${TOKEN}` }

  const [servicesRes, teamRes, statsRes] = await Promise.all([
    fetch(`${STRAPI}/api/services?sort=order:asc`, { headers, next: { revalidate: 60 } }),
    fetch(`${STRAPI}/api/team-members?sort=order:asc&populate=photo`, { headers, next: { revalidate: 60 } }),
    fetch(`${STRAPI}/api/stats?sort=order:asc`, { headers, next: { revalidate: 60 } }),
  ])

  const [servicesJson, teamJson, statsJson] = await Promise.all([
    servicesRes.json(), teamRes.json(), statsRes.json(),
  ])

  const getImgUrl = (media: any) => {
    const url = media?.url ?? media?.data?.attributes?.url ?? ''
    return url.startsWith('http') ? url : url ? `${STRAPI}${url}` : ''
  }

  const services = (servicesJson?.data ?? []).map((s: any) => ({
    id:          String(s.id),
    title:       s.title       ?? '',
    description: s.description ?? '',
  }))

  const team = (teamJson?.data ?? []).map((m: any) => ({
    id:    String(m.id),
    name:  m.name  ?? '',
    role:  m.role  ?? '',
    bio:   m.bio   ?? '',
    photo: getImgUrl(m.photo),
  }))

  const stats = (statsJson?.data ?? []).map((s: any) => ({
    label: s.label ?? '',
    value: s.value ?? s.valur ?? '',
  }))

  return <AboutClient services={services} team={team} stats={stats} />
}