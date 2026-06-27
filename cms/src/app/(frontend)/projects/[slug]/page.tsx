import { notFound } from 'next/navigation'
import ProjectDetailClient from './ProjectDetailClient'

export const dynamic = 'force-dynamic'

const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'

const getImgUrl = (media: any) => {
  if (!media) return ''
  const url = media?.url ?? ''
  return url.startsWith('http') ? url : url ? `${STRAPI}${url}` : ''
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const res = await fetch(`${STRAPI}/api/projects?filters[slug][$eq]=${slug}&fields=title,sector,location`, { cache: 'no-store' })
    const json = await res.json()
    const p = json?.data?.[0]
    if (!p) return { title: 'Project Not Found' }
    return {
      title: `${p.title} — The Prospective Interiors`,
      description: `${p.sector} interior design project in ${p.location}.`,
    }
  } catch {
    return { title: 'The Prospective Interiors' }
  }
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    const res = await fetch(
      `${STRAPI}/api/projects?filters[slug][$eq]=${slug}&populate[heroImage]=true&populate[gallery]=true`,
      { cache: 'no-store' }
    )
    const json = await res.json()
    const raw = json?.data?.[0]
    if (!raw) notFound()

    const project = {
      id:          String(raw.id),
      title:       raw.title       ?? '',
      slug:        raw.slug        ?? String(raw.id),
      client:      raw.client      ?? '',
      location:    raw.location    ?? '',
      year:        raw.year        ?? null,
      sector:      raw.sector      ?? '',
      area:        raw.area        ?? '',
      featured:    raw.featured    ?? false,
      description: raw.description ?? '',
      heroImage:   getImgUrl(raw.heroImage),
      gallery: (raw.gallery ?? [])
        .map((img: any) => {
          const url = img?.url ?? ''
          return url.startsWith('http') ? url : url ? `${STRAPI}${url}` : ''
        })
        .filter(Boolean),
    }

    // Related projects — same sector
    const relRes = await fetch(
      `${STRAPI}/api/projects?filters[sector][$eq]=${raw.sector}&filters[slug][$ne]=${slug}&pagination[limit]=3&populate[heroImage]=true`,
      { cache: 'no-store' }
    )
    const relJson = await relRes.json()
    const related = (relJson?.data ?? []).map((r: any) => ({
      id:        String(r.id),
      title:     r.title    ?? '',
      slug:      r.slug     ?? String(r.id),
      location:  r.location ?? '',
      year:      r.year     ?? null,
      sector:    r.sector   ?? '',
      heroImage: getImgUrl(r.heroImage),
    }))

    return <ProjectDetailClient project={project} related={related} />
  } catch (error) {
    console.error('Project detail error:', error)
    notFound()
  }
}
