import AboutClient from './AboutClient'

export const metadata = {
  title: 'About — The Prospective Interiors',
  description: 'Learn about The Prospective Interiors — a Pune-based interior design firm established in 2004.',
}

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'

  try {
    const [servicesRes, teamRes, statsRes, valuesRes] = await Promise.all([
      fetch(`${STRAPI}/api/services?sort=order:asc`, { cache: 'no-store' }),
      fetch(`${STRAPI}/api/team-members?sort=order:asc&populate=photo`, { cache: 'no-store' }),
      fetch(`${STRAPI}/api/stats?sort=order:asc`, { cache: 'no-store' }),
      fetch(`${STRAPI}/api/values?sort=order:asc`, { cache: 'no-store' }),
    ])

    const getImgUrl = (media: any) => {
      if (!media) return ''
      const url = media?.url ?? ''
      return url.startsWith('http') ? url : url ? `${STRAPI}${url}` : ''
    }

    const servicesJson = servicesRes.ok ? await servicesRes.json() : { data: [] }
    const teamJson = teamRes.ok ? await teamRes.json() : { data: [] }
    const statsJson = statsRes.ok ? await statsRes.json() : { data: [] }
    const valuesJson = valuesRes.ok ? await valuesRes.json() : { data: [] }

    // Debug logging — check your terminal after loading /about. Remove once confirmed working.
    console.log('VALUES API status:', valuesRes.status, valuesRes.ok)
    console.log('VALUES raw response:', JSON.stringify(valuesJson))

    const services = (servicesJson?.data ?? []).map((s: any) => ({
      id: String(s.id),
      title: s.title ?? '',
      description: s.description ?? '',
    }))

    const team = (teamJson?.data ?? []).map((m: any) => ({
      id: String(m.id),
      name: m.name ?? '',
      role: m.role ?? '',
      bio: m.bio ?? '',
      photo: getImgUrl(m.photo),
    }))

    const stats = (statsJson?.data ?? []).map((s: any) => ({
      label: s.label ?? '',
      value: s.value ?? '',
    }))

    const values = (valuesJson?.data ?? []).map((v: any) => ({
      id: String(v.id),
      title: v.title ?? '',
      description: v.description ?? '',
      order: v.order ?? 0,
    }))

    console.log('VALUES mapped for component:', values)

    return <AboutClient services={services} team={team} stats={stats} values={values} />
  } catch (error) {
    console.error('About page error:', error)
    return <AboutClient services={[]} team={[]} stats={[]} values={[]} />
  }
}