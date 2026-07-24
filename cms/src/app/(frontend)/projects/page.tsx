import ProjectsClient from './ProjectsClient'

export const metadata = {
  title: 'Projects — The Prospective Interiors',
}

export const revalidate = 60
export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const STRAPI = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
  const TOKEN = process.env.STRAPI_API_TOKEN || ''
  const headers = { Authorization: `Bearer ${TOKEN}` }

  let pageContent = {
    portfolioLabel: '',
    portfolioHeading: '',
    portfolioSubtext: '',
    sectorsList: [] as string[],
  }

  try {
    const res = await fetch(`${STRAPI}/api/projetspages`, { headers, next: { revalidate: 60 } })
    if (res.ok) {
      const json = await res.json()
      const data = json?.data?.[0] ?? {}
      pageContent = {
        portfolioLabel: data.portfolioLabel ?? '',
        portfolioHeading: data.portfolioheading ?? '',
        portfolioSubtext: data.portfoliosubtext ?? '',
        sectorsList: (data.sectorsList ?? '')
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean),
      }
    }
  } catch (error) {
    // If Strapi is unreachable, ProjectsClient falls back to its own default text.
    console.error('Projects page content fetch error (using fallback text):', error)
  }

  return <ProjectsClient projects={[]} pageContent={pageContent} />
}