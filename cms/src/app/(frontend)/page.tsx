import { getPayload } from 'payload'
import config from '@/payload.config'
import './styles.css'
import Navbar from '@/components/navbar'
import Footer from '@/components/Footer'

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
   <Navbar />



      {/* Hero Section */}
      <section className="hero">
  <div className="hero-content">

  <p className="hero-small">
    THE PROSPECTIVE INTERIORS
  </p>

  <p className="hero-tagline">
    Interior Design • Project Management • Execution
  </p>

    <h1>{page?.heroHeadline}</h1>

    <p>{page?.heroSubtext}</p>

    <div className="hero-buttons">
      <a href="/projects" className="primary-btn">
        View Projects
      </a>

      <a href="/contact" className="secondary-btn">
        Contact Us
      </a>
    </div>
  </div>
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

{/* Process Section */}
<section className="process">
  <h2>Our Process</h2>

  <div className="process-grid">
    <div className="process-card">
      <span>01</span>
      <h3>Discovery</h3>
      <p>Understanding client goals, requirements and vision.</p>
    </div>

    <div className="process-card">
      <span>02</span>
      <h3>Concept Design</h3>
      <p>Developing layouts, concepts and design direction.</p>
    </div>

    <div className="process-card">
      <span>03</span>
      <h3>Planning</h3>
      <p>Detailed planning, budgeting and material selection.</p>
    </div>

    <div className="process-card">
      <span>04</span>
      <h3>Execution</h3>
      <p>Coordinating teams and delivering quality workmanship.</p>
    </div>

    <div className="process-card">
      <span>05</span>
      <h3>Delivery</h3>
      <p>Final handover with complete project satisfaction.</p>
    </div>
  </div>
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
 <div className="section-heading">
  <p>OUR WORK</p>
  <h2>Featured Projects</h2>
</div>

  <div className="project-grid">
    <div className="project-card">
      <img src="/projects/building-night.jpg" alt="Project" />
      <h3>Luxury Apartments</h3>
      <p>Residential Development</p>
    </div>

    <div className="project-card">
      <img src="/projects/living-room.jpg" alt="Project" />
      <h3>Premium Interiors</h3>
      <p>Interior Design & Execution</p>
    </div>

    <div className="project-card">
      <img src="/projects/villa-section.jpg" alt="Project" />
      <h3>Luxury Villas</h3>
      <p>Architecture & Planning</p>
    </div>
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
