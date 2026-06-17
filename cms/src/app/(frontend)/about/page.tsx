import { getPayload } from 'payload'
import config from '@/payload.config'
import Navbar from '@/components/navbar'
import Footer from '@/components/Footer'

export default async function AboutPage() {
  const payload = await getPayload({ config })

  const pagesData = await payload.find({
    collection: 'pages',
    limit: 1,
  })

  const statsData = await payload.find({
    collection: 'stats',
    sort: 'order',
  })

  const teamData = await payload.find({
    collection: 'team-members',
    sort: 'order',
  })

  const page = pagesData.docs[0]

  return (
    <main className="about-page">

<Navbar />

  <section className="about-hero">
  <div className="about-overlay">
    <h1>About Us</h1>
    <p>{page?.philosophyText}</p>
  </div>
</section>

      <section className="about-stats">
        <h2>Our Impact</h2>

        <div className="stats-grid">
          {statsData.docs.map((stat) => (
            <div key={stat.id} className="stat-card">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-team">
        <h2>Our Team</h2>

        <div className="team-grid">
          {teamData.docs.map((member) => (
            <div key={member.id} className="team-card">
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              <p>{member.bio}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  )
}