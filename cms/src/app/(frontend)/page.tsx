import HomeClient from './homeclient'

export const metadata = {
  title: 'The Prospective Interiors — Designing Spaces That Shape The Future',
  description: 'Pune-based interior design and architecture firm established in 2004.',
}

export const revalidate = 60

const FALLBACK_DATA = {
  heroHeadline: 'Designing Spaces That Shape The Future',
  heroSubtext: 'A 20-year legacy of transforming spaces across hospitality, healthcare, retail, residential and industrial sectors.',
  philosophyText: 'Architecture is a dialogue between the human spirit and the space it inhabits — we design for people, not photographs.',
  heroImage: '',
  heroImages: [] as string[],
  stats: [] as { label: string; value: string }[],
  services: [] as { id: string; title: string; description: string }[],
  team: [] as { id: string; name: string; role: string; bio: string; photo: string }[],
  projects: [] as { id: string; title: string; slug: string; location: string; year: number | null; sector: string; client: string; heroImage: string }[],
}

export default async function HomePage() {
  const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
  const TOKEN  = process.env.STRAPI_API_TOKEN || ''
  const headers = { Authorization: `Bearer ${TOKEN}` }

  try {
    const [pagesRes, statsRes, servicesRes, teamRes, projectsRes] = await Promise.all([
      fetch(`${STRAPI}/api/pages?pagination[limit]=1&populate[heroImage]=true`, { headers, next: { revalidate: 60 } }),
      fetch(`${STRAPI}/api/stats?sort=order:asc`, { headers, next: { revalidate: 60 } }),
      fetch(`${STRAPI}/api/services?sort=order:asc`, { headers, next: { revalidate: 60 } }),
      fetch(`${STRAPI}/api/team-members?sort=order:asc&populate=photo`, { headers, next: { revalidate: 60 } }),
      fetch(`${STRAPI}/api/projects?filters[featured][$eq]=true&pagination[limit]=3&populate=heroImage`, { headers, next: { revalidate: 60 } }),
    ])

    const pagesJson    = pagesRes.ok    ? await pagesRes.json()    : { data: [] }
    const statsJson    = statsRes.ok    ? await statsRes.json()    : { data: [] }
    const servicesJson = servicesRes.ok ? await servicesRes.json() : { data: [] }
    const teamJson     = teamRes.ok     ? await teamRes.json()     : { data: [] }
    const projectsJson = projectsRes.ok ? await projectsRes.json() : { data: [] }

    // Strapi v5 — data directly on object, no .attributes needed
    const page = pagesJson?.data?.[0] ?? {}

    const getImgUrl = (media: any) => {
      // Strapi v5 image format
      const url = media?.url ?? media?.data?.attributes?.url ?? ''
      return url.startsWith('http') ? url : url ? `${STRAPI}${url}` : ''
    }

    // "heroImage" may be configured as Single or Multiple media depending on
    // environment — normalize defensively to a plain array of URL strings either way.
    const rawHeroImages = Array.isArray(page.heroImage)
      ? page.heroImage
      : (page.heroImage?.data ?? (page.heroImage ? [page.heroImage] : []))
    const heroImages = rawHeroImages.map((img: any) => getImgUrl(img)).filter(Boolean)

    const data = {
      heroHeadline:   page.heroHeadline   ?? FALLBACK_DATA.heroHeadline,
      heroSubtext:    page.heroSubtext    ?? FALLBACK_DATA.heroSubtext,
      philosophyText: page.philosophyText ?? FALLBACK_DATA.philosophyText,
      heroImage:      heroImages[0] ?? '',
      heroImages,

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
  } catch (error) {
    // If Strapi is temporarily unreachable during build (e.g. cold-starting on
    // a free tier), fall back to safe defaults instead of failing the whole build.
    // ISR will pick up real data automatically once Strapi responds again.
    console.error('Home page error (using fallback data):', error)
    return <HomeClient data={FALLBACK_DATA} />
  }
}