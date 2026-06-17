import { getPayload } from 'payload'
import config from '@/payload.config'
import AboutClient from './AboutClient'

export const metadata = {
  title: 'About — The Prospective Interiors',
  description: 'Learn about The Prospective Interiors — established 2004, led by Prashant Bhandiya.',
}

export default async function AboutPage() {
  const payload = await getPayload({ config })
  const [servicesData, teamData, statsData] = await Promise.all([
    payload.find({ collection: 'services', sort: 'order', limit: 20 }),
    payload.find({ collection: 'team-members', sort: 'order' }),
    payload.find({ collection: 'stats', sort: 'order' }),
  ])
  const services = servicesData.docs.map((s: any) => ({ id: String(s.id), title: s.title ?? '', description: s.description ?? '' }))
  const team     = teamData.docs.map((m: any) => ({ id: String(m.id), name: m.name ?? '', role: m.role ?? '', bio: m.bio ?? '', photo: typeof m.photo === 'object' && m.photo !== null ? m.photo.url : '' }))
  const stats    = statsData.docs.map((s: any) => ({ label: s.label ?? '', value: s.value ?? '' }))
  return <AboutClient services={services} team={team} stats={stats} />
}
