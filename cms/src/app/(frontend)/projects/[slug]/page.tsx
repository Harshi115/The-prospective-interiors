import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import ProjectDetailClient from './ProjectDetailClient'

export const revalidate = 60

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const projects = await payload.find({ collection: 'projects', limit: 100 })
  return projects.docs.map((p: any) => ({ slug: p.slug ?? String(p.id) }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const p = result.docs[0] as any
  if (!p) return { title: 'Project Not Found' }
  return {
    title: `${p.title} — The Prospective Interiors`,
    description: `${p.sector} interior design project in ${p.location} by The Prospective Interiors.`,
  }
}

function richToPlain(val: any): string {
  if (!val) return ''

  // Plain string
  if (typeof val === 'string') {
    // Try to parse if it's a JSON string
    try {
      const parsed = JSON.parse(val)
      return richToPlain(parsed)
    } catch {
      return val
    }
  }

  // Lexical JSON object
  if (val?.root?.children) {
    return val.root.children
      .map((node: any) =>
        node.children?.map((c: any) => c.text ?? '').join('') ?? ''
      )
      .filter(Boolean)
      .join('\n\n')
  }

  return ''
}

function imgUrl(val: any): string {
  if (typeof val === 'object' && val !== null) return val.url ?? ''
  if (typeof val === 'string') return val
  return ''
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (!result.docs[0]) notFound()

  const p = result.docs[0] as any

  const project = {
    id:          String(p.id),
    title:       p.title    ?? '',
    slug:        p.slug     ?? String(p.id),
    client:      p.client   ?? '',
    location:    p.location ?? '',
    year:        p.year     ?? null,
    sector:      p.sector   ?? '',
    area:        p.area     ?? '',
    featured:    p.featured ?? false,
    description: richToPlain(p.description),
    heroImage:   imgUrl(p.heroImage),
    gallery: Array.isArray(p.gallery)
      ? p.gallery.map((img: any) => imgUrl(img)).filter(Boolean)
      : [],
  }

  const related = await payload.find({
    collection: 'projects',
    where: {
      and: [
        { sector: { equals:     p.sector } },
        { slug:   { not_equals: slug     } },
      ],
    },
    limit: 3,
  })

  const relatedProjects = related.docs.map((r: any) => ({
    id:        String(r.id),
    title:     r.title    ?? '',
    slug:      r.slug     ?? String(r.id),
    location:  r.location ?? '',
    year:      r.year     ?? null,
    sector:    r.sector   ?? '',
    heroImage: imgUrl(r.heroImage),
  }))

  return <ProjectDetailClient project={project} related={relatedProjects} />
}
