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
  projects: [] as { id: string; title: string; slug: string; location: string; year: number | null; sector: string; client: string; heroImage: string; description: string }[],
}

export default async function HomePage() {
  const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
  const TOKEN  = process.env.STRAPI_API_TOKEN || ''
  const headers = { Authorization: `Bearer ${TOKEN}` }

  try {
    const [pagesRes, statsRes, servicesRes, teamRes, allProjectsRes, featuredRes] = await Promise.all([
      fetch(`${STRAPI}/api/pages?pagination[limit]=1`, { headers, next: { revalidate: 60 } }),
      fetch(`${STRAPI}/api/stats?sort=order:asc`, { headers, next: { revalidate: 60 } }),
      fetch(`${STRAPI}/api/services?sort=order:asc`, { headers, next: { revalidate: 60 } }),
      fetch(`${STRAPI}/api/team-members?sort=order:asc&populate=photo`, { headers, next: { revalidate: 60 } }),
      // ALL projects (no featured filter) — their photos become the hero slideshow.
      fetch(`${STRAPI}/api/projects?pagination[limit]=10&populate=heroImage`, { headers, next: { revalidate: 60 } }),
      // Still fetch featured ones separately for the "Featured Work" section further down the page.
      fetch(`${STRAPI}/api/projects?filters[featured][$eq]=true&pagination[limit]=3&populate=heroImage`, { headers, next: { revalidate: 60 } }),
    ])

    const pagesJson    = pagesRes.ok    ? await pagesRes.json()    : { data: [] }
    const statsJson    = statsRes.ok    ? await statsRes.json()    : { data: [] }
    const servicesJson = servicesRes.ok ? await servicesRes.json() : { data: [] }
    const teamJson     = teamRes.ok     ? await teamRes.json()     : { data: [] }
    const allProjectsJson = allProjectsRes.ok ? await allProjectsRes.json() : { data: [] }
    const featuredJson    = featuredRes.ok    ? await featuredRes.json()    : { data: [] }

    // Strapi v5 — data directly on object, no .attributes needed
    const page = pagesJson?.data?.[0] ?? {}

    const getImgUrl = (media: any) => {
      // Strapi v5 image format
      const url = media?.url ?? media?.data?.attributes?.url ?? ''
      return url.startsWith('http') ? url : url ? `${STRAPI}${url}` : ''
    }

    const mapProject = (p: any) => ({
      id:          String(p.id),
      title:       p.title       ?? '',
      slug:        p.slug        ?? String(p.id),
      location:    p.location    ?? '',
      year:        p.year        ?? null,
      sector:      p.sector      ?? '',
      client:      p.client      ?? '',
      heroImage:   getImgUrl(p.heroImage),
      description: p.description ?? '',
    })

    const allProjects = (allProjectsJson?.data ?? []).map(mapProject)
    const featuredProjects = (featuredJson?.data ?? []).map(mapProject)
    // Fall back to all projects for the Featured Work section too, if none are marked featured.
    const projects = featuredProjects.length > 0 ? featuredProjects : allProjects.slice(0, 3)

    // Hero slideshow — every project's photo, no caption/link shown (just clean images).
    const heroImages = allProjects.map((p: ReturnType<typeof mapProject>) => p.heroImage).filter(Boolean)

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

      projects,
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