import { getPayload } from 'payload'
import config from '@/payload.config'
import './styles.css'

export default async function HomePage() {
  const payload = await getPayload({ config })

  const pagesData = await payload.find({
    collection: 'pages',
    limit: 1,
  })

  const statsData = await payload.find({
    
    collection: 'stats',
    sort: 'order',
  })
  const servicesData = await payload.find({
  collection: 'services',
})
const teamData = await payload.find({
  collection: 'team-members',
  sort: 'order',
})
  const projectsData = await payload.find({
    collection: 'projects',
    where: {
      featured: {
        equals: true,
      },
    },
    limit: 3,
  })

  const page = pagesData.docs[0]

  return (
    <main className="homepage">
      <nav className="navbar">
  <div className="logo">The Prospective Interiors</div>

  <div className="nav-links">
    <a href="/">Home</a>
    <a href="/projects">Projects</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </div>
</nav>
      {/* Hero Section */}
      <section className="hero">
        <h1>{page?.heroHeadline}</h1>
        <p>{page?.heroSubtext}</p>
      </section>

      {/* Stats Section */}
      <section className="stats">
        {statsData.docs.map((stat) => (
          <div key={stat.id} className="stat-card">
            <h2>{stat.value}</h2>
            <p>{stat.label}</p>
          </div>
        ))}
      </section>
<section className="services">
  <h2>Our Services</h2>

  <div className="services-grid">
    {servicesData.docs.map((service) => (
      <div key={service.id} className="service-card">
        <h3>{service.title}</h3>
      </div>
    ))}
  </div>
</section>
      {/* Featured Projects */}
      <section className="projects">
        <h2>Featured Projects</h2>

        <div className="project-grid">
          {projectsData.docs.map((project) => (
  <div key={project.id} className="project-card">
  <h3>{project.title}</h3>

  {project.sector && <p>Sector: {project.sector}</p>}

  {project.location && <p>Location: {project.location}</p>}

  {project.client && <p>Client: {project.client}</p>}
</div>
          ))}
        </div>
      </section>
{/* Team Section */}
<section className="team">
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
      {/* Philosophy */}
      <section className="philosophy">
        <h2>Our Philosophy</h2>
        <p>{page?.philosophyText}</p>
      </section>

      {/* CTA */}
      <section className="cta">
        <a href="/projects">View Projects</a>
      </section>
      <footer className="footer">
  <h3>The Prospective Interiors</h3>

  <div className="footer-links">
    <a href="/">Home</a>
    <a href="/projects">Projects</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </div>

  <p>© 2026 The Prospective Interiors</p>
</footer>
    </main>
  )

}
