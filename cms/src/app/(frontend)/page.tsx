import HomeClient from './homeclient'

export const metadata = {
  title: 'The Prospective Interiors — Designing Spaces That Shape The Future',
  description: 'Pune-based interior design and architecture firm established in 2004.',
}

export const revalidate = 60
export const dynamic = 'force-dynamic'

// Empty defaults only used if Strapi is completely unreachable — everything
// on the page is meant to come from the CMS, nothing is hardcoded here.
const FALLBACK_DATA = {
  heroTagline: '',
  heroHeadline: '',
  heroSubtext: '',
  philosophyText: '',
  ctaLabel: '',
  ctaHeading: '',
  ctaImage: '',
  testimonialImage: '',
  testimonialQuote: '',
  testimonialAuthor: '',
  journeyLabel: '',
  journeyHeading: '',
  journeySubtext: '',
  journeySteps: [] as { step: string; desc: string }[],
  heroImage: '',
  heroImages: [] as string[],
  stats: [] as { label: string; value: string }[],
  services: [] as { id: string; title: string; description: string }[],
  team: [] as { id: string; name: string; role: string; bio: string; photo: string }[],
  projects: [] as { id: string; title: string; slug: string; location: string; year: number | null; sector: string; client: string; heroImage: string; description: string }[],
  gallery: [] as { src: string }[],
}

export default async function HomePage() {
  // STRAPI = internal Docker network address, used for server-side fetches (container-to-container).
  // STRAPI_PUBLIC = browser-facing address, used when building <img> src URLs so the browser can load them.
  const STRAPI = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
  const STRAPI_PUBLIC = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
  const TOKEN  = process.env.STRAPI_API_TOKEN || ''
  const headers = { Authorization: `Bearer ${TOKEN}` }

  try {
    const [pagesRes, statsRes, servicesRes, teamRes, allProjectsRes, featuredRes, galleryRes, journeyRes] = await Promise.all([
      fetch(`${STRAPI}/api/pages?pagination[limit]=1&populate[0]=testimonialImage&populate[1]=ctaimage&populate[2]=heroImages`, { headers, next: { revalidate: 60 } }),
      fetch(`${STRAPI}/api/stats?sort=order:asc`, { headers, next: { revalidate: 60 } }),
      fetch(`${STRAPI}/api/services?sort=order:asc`, { headers, next: { revalidate: 60 } }),
      fetch(`${STRAPI}/api/team-members?sort=order:asc&populate=photo`, { headers, next: { revalidate: 60 } }),
      // ALL projects (no featured filter) — their photos become the hero slideshow.
      fetch(`${STRAPI}/api/projects?pagination[limit]=10&populate=heroImage`, { headers, next: { revalidate: 60 } }),
      // Still fetch featured ones separately for the "Featured Work" section further down the page.
      fetch(`${STRAPI}/api/projects?filters[featured][$eq]=true&pagination[limit]=3&populate=heroImage`, { headers, next: { revalidate: 60 } }),
      // Gallery images collection (managed separately in Strapi).
      fetch(`${STRAPI}/api/galleries?populate=*`, { headers, next: { revalidate: 60 } }),
      // Design journey steps (5 cards under "Our Design Journey").
      fetch(`${STRAPI}/api/journey-steps?sort=order:asc`, { headers, next: { revalidate: 60 } }),
    ])

    const pagesJson    = pagesRes.ok    ? await pagesRes.json()    : { data: [] }
    const statsJson    = statsRes.ok    ? await statsRes.json()    : { data: [] }
    const servicesJson = servicesRes.ok ? await servicesRes.json() : { data: [] }
    const teamJson     = teamRes.ok     ? await teamRes.json()     : { data: [] }
    const allProjectsJson = allProjectsRes.ok ? await allProjectsRes.json() : { data: [] }
    const featuredJson    = featuredRes.ok    ? await featuredRes.json()    : { data: [] }
    const galleryJson     = galleryRes.ok     ? await galleryRes.json()     : { data: [] }
    const journeyJson     = journeyRes.ok     ? await journeyRes.json()     : { data: [] }

    // Strapi v5 — data directly on object, no .attributes needed
    const page = pagesJson?.data?.[0] ?? {}

    const getImgUrl = (media: any) => {
      // Strapi v5 image format — uses STRAPI_PUBLIC so the browser can actually load the image.
      const url = media?.url ?? media?.data?.attributes?.url ?? ''
      return url.startsWith('http') ? url : url ? `${STRAPI_PUBLIC}${url}` : ''
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

    // Everything below reads straight from Strapi with '' as the only fallback —
    // if a field is empty in the CMS, it will render empty on the page (no hardcoded text).
    const data = {
      heroTagline:    page.heroTagline    ?? '',
      heroHeadline:   page.heroHeadline   ?? '',
      heroSubtext:    page.heroSubtext    ?? '',
      philosophyText: page.philosophyText ?? '',
      ctaLabel:       page.ctalabel       ?? '',
      ctaHeading:     page.ctaHeading     ?? '',
      ctaImage:       getImgUrl(page.ctaimage),

      testimonialImage:  getImgUrl(page.testimonialImage),
      testimonialQuote:  page.testimonialQuote  ?? '',
      testimonialAuthor: page.testimonialAuthor ?? '',

      journeyLabel:    page.journeyLabel    ?? '',
      journeyHeading:  page.journeyHeading  ?? '',
      journeySubtext:  page.journeySubtext  ?? '',
      journeySteps: (journeyJson?.data ?? []).map((j: any) => ({
        step: j.step ?? j.title ?? '',
        desc: j.description ?? j.desc ?? '',
      })),
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

      gallery: (galleryJson?.data ?? []).map((g: any) => ({
        src: getImgUrl(g.image),
      })).filter((g: { src: string }) => g.src),
    }

    return <HomeClient data={data} />
  } catch (error) {
    // If Strapi is completely unreachable (e.g. cold-starting on a free tier),
    // render with empty fields rather than crashing the whole build.
    console.error('Home page error (Strapi unreachable, rendering empty):', error)
    return <HomeClient data={FALLBACK_DATA} />
  }
}