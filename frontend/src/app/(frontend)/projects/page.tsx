import ProjectsClient from './ProjectsClient'
import { getSiteSettings } from '../../../lib/site-settings'

export const metadata = {
  title: 'Projects — The Prospective Interiors',
}

export const revalidate = 60
export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const STRAPI = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
  const STRAPI_PUBLIC = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
  const TOKEN = process.env.STRAPI_API_TOKEN || ''
  const headers = { Authorization: `Bearer ${TOKEN}` }

  let pageContent = {
    portfolioLabel: '',
    portfolioHeading: '',
    portfolioSubtext: '',
    sectorsList: [] as string[],
    heroImage: '',
  }

  // Fetch page content (label/heading/subtext/sectors/heroImage) and the project list IN PARALLEL,
  // server-side, so the page arrives already populated — no client-side loading gap.
  const [pageRes, projectsRes, siteSettings] = await Promise.all([
    fetch(`${STRAPI}/api/projetspages?populate=heroImage`, { headers, next: { revalidate: 60 } }).catch(() => null),
    fetch(`${STRAPI}/api/projects?populate[heroImage]=true&populate[gallery]=true&pagination[limit]=100`, { headers, next: { revalidate: 60 } }).catch(() => null),
    getSiteSettings(),
  ])

  const getImgUrl = (media: any) => {
    if (!media) return ''
    const url = media?.url ?? media?.data?.attributes?.url ?? ''
    return url.startsWith('http') ? url : url ? `${STRAPI_PUBLIC}${url}` : ''
  }

  if (pageRes && pageRes.ok) {
    try {
      const json = await pageRes.json()
      const data = json?.data?.[0] ?? {}
      pageContent = {
        portfolioLabel: data.portfolioLabel ?? '',
        portfolioHeading: data.portfolioheading ?? '',
        portfolioSubtext: data.portfoliosubtext ?? '',
        sectorsList: (data.sectorsList ?? '')
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean),
        heroImage: getImgUrl(data.heroImage),
      }
    } catch (error) {
      console.error('Projects page content parse error (using fallback text):', error)
    }
  }

  let projects: any[] = []
  if (projectsRes && projectsRes.ok) {
    try {
      const json = await projectsRes.json()
      projects = (json?.data ?? []).map((p: any) => ({
        id: String(p.id),
        title: p.title ?? '',
        slug: p.slug ?? String(p.id),
        client: p.client ?? '',
        location: p.location ?? '',
        year: p.year ?? null,
        sector: p.sector ?? '',
        featured: p.featured ?? false,
        area: p.area ?? '',
        description: p.description ?? '',
        heroImage: getImgUrl(p.heroImage),
        gallery: (p.gallery ?? []).map((img: any) => getImgUrl(img)).filter(Boolean),
      }))
    } catch (error) {
      console.error('Projects list fetch error (rendering empty, client-side fetch will retry):', error)
    }
  }

  return <ProjectsClient projects={projects} pageContent={pageContent} logoUrl={siteSettings.logoUrl} logoAlt={siteSettings.logoAlt} />
}