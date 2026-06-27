import HomeClient from './homeclient'

export const metadata = {
  title: 'The Prospective Interiors — Designing Spaces That Shape The Future',
  description: 'Pune-based interior design and architecture firm established in 2004.',
}

export const revalidate = 60

export default async function HomePage() {
  const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
  const TOKEN  = process.env.STRAPI_API_TOKEN || ''
  const headers = { Authorization: `Bearer ${TOKEN}` }

  const [pagesRes, statsRes, servicesRes, teamRes, projectsRes] = await Promise.all([
    fetch(`${STRAPI}/api/pages?pagination[limit]=1&populate=heroImage`, { headers, next: { revalidate: 60 } }),
    fetch(`${STRAPI}/api/stats?sort=order:asc`, { headers, next: { revalidate: 60 } }),
    fetch(`${STRAPI}/api/services?sort=order:asc`, { headers, next: { revalidate: 60 } }),
    fetch(`${STRAPI}/api/team-members?sort=order:asc&populate=photo`, { headers, next: { revalidate: 60 } }),
    fetch(`${STRAPI}/api/projects?filters[featured][$eq]=true&pagination[limit]=3&populate=heroImage`, { headers, next: { revalidate: 60 } }),
  ])

  const [pagesJson, statsJson, servicesJson, teamJson, projectsJson] = await Promise.all([
    pagesRes.json(), statsRes.json(), servicesRes.json(), teamRes.json(), projectsRes.json(),
  ])

  // Strapi v5 — data directly on object, no .attributes needed
  const page = pagesJson?.data?.[0] ?? {}

  const getImgUrl = (media: any) => {
    // Strapi v5 image format
    const url = media?.url ?? media?.data?.attributes?.url ?? ''
    return url.startsWith('http') ? url : url ? `${STRAPI}${url}` : ''
  }

  const data = {
    heroHeadline:   page.heroHeadline   ?? 'Designing Spaces That Shape The Future',
    heroSubtext:    page.heroSubtext    ?? 'A 20-year legacy of transforming spaces across hospitality, healthcare, retail, residential and industrial sectors.',
    philosophyText: page.philosophyText ?? 'Architecture is a dialogue between the human spirit and the space it inhabits — we design for people, not photographs.',
    heroImage:      getImgUrl(page.heroImage),

    stats: (statsJson?.data ?? []).map((s: any) => ({
      label: s.label ?? '',
      value: s.value ?? s.valur ?? '',
    })),

    services: (servicesJson?.data ?? []).map((s: any) => ({
      id:          String(s.id),
      title:       s.title       ?? '',
      description: s.description ?? '',
    })),

    team: (teamJson?.data ?? []).map((m: any) => ({
      id:    String(m.id),
      name:  m.name  ?? '',
      role:  m.role  ?? '',
      bio:   m.bio   ?? '',
      photo: getImgUrl(m.photo),
    })),

    projects: (projectsJson?.data ?? []).map((p: any) => ({
      id:        String(p.id),
      title:     p.title    ?? '',
      slug:      p.slug     ?? String(p.id),
      location:  p.location ?? '',
      year:      p.year     ?? null,
      sector:    p.sector   ?? '',
      client:    p.client   ?? '',
      heroImage: getImgUrl(p.heroImage),
    })),
  }

  return <HomeClient data={data} />
}
