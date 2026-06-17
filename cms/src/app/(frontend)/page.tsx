import { getPayload } from 'payload'
import config from '@/payload.config'
import HomeClient from './homeclient'

export const metadata = {
  title: 'The Prospective Interiors — Designing Spaces That Shape The Future',
  description: 'Pune-based interior design and architecture firm established in 2004. 20+ years of excellence across hospitality, healthcare, residential, retail and commercial sectors.',
}

export default async function HomePage() {
  const payload = await getPayload({ config })

  const [pagesData, statsData, servicesData, teamData, projectsData] = await Promise.all([
    payload.find({ collection: 'pages', limit: 1 }),
    payload.find({ collection: 'stats', sort: 'order' }),
    payload.find({ collection: 'services' }),
    payload.find({ collection: 'team-members', sort: 'order' }),
    payload.find({
      collection: 'projects',
      where: { featured: { equals: true } },
      limit: 3,
    }),
  ])

  const page = pagesData.docs[0] as any

  const data = {
    heroHeadline:   page?.heroHeadline   ?? 'Designing Spaces That Shape The Future',
    heroSubtext:    page?.heroSubtext    ?? '20+ Years of Excellence in Interior Design across Maharashtra and pan-India.',
    philosophyText: page?.philosophyText ?? 'We believe that every space has a story. Our designs are a dialogue between functionality, aesthetics and the people who inhabit them.',
    heroImage:
      typeof page?.heroImage === 'object' && page?.heroImage !== null
        ? page.heroImage.url
        : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=90',
    stats: statsData.docs.map((s: any) => ({
      label: s.label ?? '', value: s.value ?? '',
    })),
    services: servicesData.docs.map((s: any) => ({
      id: String(s.id), title: s.title ?? '', description: s.description ?? '',
    })),
    team: teamData.docs.map((m: any) => ({
      id: String(m.id), name: m.name ?? '', role: m.role ?? '', bio: m.bio ?? '',
      photo: typeof m.photo === 'object' && m.photo !== null ? m.photo.url : '',
    })),
    projects: projectsData.docs.map((p: any) => ({
      id: String(p.id), title: p.title ?? '', slug: p.slug ?? String(p.id),
      location: p.location ?? '', year: p.year ?? null, sector: p.sector ?? '',
      client: p.client ?? '',
      heroImage:
        typeof p.heroImage === 'object' && p.heroImage !== null
          ? p.heroImage.url
          : typeof p.heroImage === 'string' ? p.heroImage : '',
    })),
  }

  return <HomeClient data={data} />
}
