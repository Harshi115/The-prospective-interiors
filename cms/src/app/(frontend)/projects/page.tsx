 import { getPayload } from 'payload'
import config from '@/payload.config'
import ProjectsClient from './ProjectsClient'

export const metadata = {
  title: 'Projects — The Prospective Interiors',
  description: 'Explore our portfolio across hospitality, healthcare, residential, retail and more.',
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
    title:       p.title     ?? '',
    slug:        p.slug      ?? String(p.id),
    client:      p.client    ?? '',
    location:    p.location  ?? '',
    year:        p.year      ?? null,
    sector:      p.sector    ?? '',
    featured:    p.featured  ?? false,
    description: typeof p.description === 'string' ? p.description : '',
    area:        p.area      ?? '',
    heroImage:
      typeof p.heroImage === 'object' && p.heroImage !== null
        ? (p.heroImage as any).url ?? ''
        : typeof p.heroImage === 'string' ? p.heroImage : '',
    gallery: Array.isArray(p.gallery)
      ? p.gallery.map((img: any) =>
          typeof img === 'object' && img !== null ? img.url ?? '' : ''
        ).filter(Boolean)
      : [],
  }))

  return <ProjectsClient projects={projects} />
}