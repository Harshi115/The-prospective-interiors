import HomeClient from './homeclient'
import { getSiteSettings } from '../../lib/site-settings'

export const metadata = {
  title: 'The Prospective Interiors — Designing Spaces That Shape The Future',
  description: 'Pune-based interior design and architecture firm established in 2004.',
}

export const revalidate = 60
export const dynamic = 'force-dynamic'


const FALLBACK_DATA = {
  logoUrl: '',
  logoAlt: 'The Prospective Interiors',
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
  journeyImage: '',
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
    const siteSettings = await getSiteSettings()

    const [pagesRes, statsRes, servicesRes, teamRes, allProjectsRes, featuredRes, galleryRes, journeyRes] = await Promise.all([
      fetch(`${STRAPI}/api/pages?pagination[limit]=1&populate[0]=testimonialImage&populate[1]=ctaimage&populate[2]=heroImages&populate[3]=journeyImage`, { headers, next: { revalidate: 60 } }),
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

   
    const page = pagesJson?.data?.[0] ?? {}

    const getImgUrl = (media: any) => {
      
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
    
    const projects = featuredProjects.length > 0 ? featuredProjects : allProjects.slice(0, 3)

    const heroImages = allProjects.map((p: ReturnType<typeof mapProject>) => p.heroImage).filter(Boolean)

    
    const data = {
      logoUrl: siteSettings.logoUrl,
      logoAlt: siteSettings.logoAlt,
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
      journeyImage:    getImgUrl(Array.isArray(page.journeyImage) ? page.journeyImage[0] : page.journeyImage),
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
    

    console.error('Home page error (Strapi unreachable, rendering empty):', error)
    return <HomeClient data={FALLBACK_DATA} />
  }
}