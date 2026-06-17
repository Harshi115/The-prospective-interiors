 import { getPayload } from 'payload'
import config from '@/payload.config'
import ProjectsClient from './ProjectsClient'

export const metadata = {
  title: 'Projects — The Prospective Interiors',
  description: 'Explore our portfolio across hospitality, healthcare, residential, retail and more.',
}

function richToPlain(val: any): string {
  if (typeof val === 'string') return val
  if (!val?.root?.children) return ''
  return val.root.children
    .map((node: any) => node.children?.map((c: any) => c.text ?? '').join('') ?? '')
    .filter(Boolean)
    .join('\n\n')
}

function imgUrl(val: any): string {
  if (typeof val === 'object' && val !== null) return val.url ?? ''
  if (typeof val === 'string') return val
  return ''
}

export default async function ProjectsPage() {
  const payload = await getPayload({ config })

  const projectsData = await payload.find({
    collection: 'projects',
    limit: 100,
    sort: '-year',
  })

  const projects = projectsData.docs.map((p: any) => ({
    id:          String(p.id),
    title:       p.title    ?? '',
    slug:        p.slug     ?? String(p.id),
    client:      p.client   ?? '',
    location:    p.location ?? '',
    year:        p.year     ?? null,
    sector:      p.sector   ?? '',
    featured:    p.featured ?? false,
    area:        p.area     ?? '',
    description: richToPlain(p.description),
    heroImage:   imgUrl(p.heroImage),
    gallery: Array.isArray(p.gallery)
      ? p.gallery.map((img: any) => imgUrl(img)).filter(Boolean)
      : [],
  }))

  return <ProjectsClient projects={projects} />
}