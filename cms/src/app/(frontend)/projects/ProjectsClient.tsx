'use client'
import React, { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'

const GOLD = '#D8C3A5'
const GOLD_HOVER = '#E4CCAA'
const SECONDARY_ACCENT = '#A8794D'
const CREAM = '#FAF7F1'
const DARK = '#111315'
const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'

interface Project { id:string;title:string;slug:string;client:string;location:string;year:number|null;sector:string;featured:boolean;description:string;heroImage:string;gallery:string[];area:string }

const PER = 9

function FadeIn({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0 })
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(24px)', transition: `opacity .8s ease ${delay}s, transform .8s ease ${delay}s`, ...style }}>{children}</div>
}

export default function ProjectsClient({ projects: initialProjects, pageContent }: { projects: Project[]; pageContent?: { portfolioLabel?: string; portfolioHeading?: string; portfolioSubtext?: string; sectorsList?: string[]; heroImage?: string } }) {
  const portfolioLabel = pageContent?.portfolioLabel
  const portfolioHeading = pageContent?.portfolioHeading
  const portfolioSubtext = pageContent?.portfolioSubtext
  // CMS-managed hero image, with the previous hardcoded photo as a safety fallback
  // in case the field hasn't been filled in on the Strapi side yet.
  // Fully CMS-driven — no hardcoded fallback image.
  const heroImageSrc = pageContent?.heroImage || ''
  const SECTORS = ['All', ...(pageContent?.sectorsList ?? [])]
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const dark = false
  const [mounted, setMounted] = useState(false)
  const [sector, setSector] = useState('All')
  const [page, setPage] = useState(1)
  // If the server already sent projects (SSR), there's nothing to wait for —
  // skip the loading spinner entirely and render immediately.
  const [loading, setLoading] = useState(initialProjects.length === 0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Only hit Strapi from the browser as a fallback when the server render
    // came back empty (e.g. Strapi was briefly unreachable at request time).
    if (initialProjects.length > 0) return

    fetch(`${STRAPI}/api/projects?populate[heroImage]=true&populate[gallery]=true&pagination[limit]=100`, { cache: 'no-store' })
      .then(r => r.json())
      .then(json => {
        const getImgUrl = (media: any) => {
          if (!media) return ''
          const url = media?.url ?? ''
          return url.startsWith('http') ? url : url ? `${STRAPI}${url}` : ''
        }
        const mapped = (json?.data ?? []).map((p: any) => ({
          id: String(p.id),
          title: p.title ?? '',
          slug: p.slug ?? String(p.id),
          client: p.client ?? '',
          location: p.location ?? '',
          year: p.year ?? null,
          sector: p.sector ?? '',
          featured: p.featured ?? false,
          area: p.area ?? '',
          description: p.description ?? '',
          heroImage: getImgUrl(p.heroImage),
          gallery: (p.gallery ?? []).map((img: any) => {
            const url = img?.url ?? ''
            return url.startsWith('http') ? url : url ? `${STRAPI}${url}` : ''
          }).filter(Boolean),
        }))
        if (mapped.length > 0) setProjects(mapped)
        setLoading(false)
      })
      .catch(err => { console.error('Failed:', err); setLoading(false) })
  }, [])

  const filtered = useMemo(() => sector === 'All' ? projects : projects.filter(p => p.sector === sector), [projects, sector])
  const paginated = useMemo(() => filtered.slice(0, page * PER), [filtered, page])
  const hasMore = paginated.length < filtered.length

  if (!mounted) return null

  const t = {
    bg: dark ? '#111315' : '#FAF7F1',
    ink: dark ? '#F3F0EA' : DARK,
    muted: dark ? '#C5C1BA' : '#6a6050',
    border: dark ? '#333840' : '#E6DDD0',
    surface: dark ? '#23272C' : '#FFFFFF',
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{font-family:'Inter',sans-serif;transition:background .4s,color .4s}
        a{text-decoration:none;color:inherit}
        ::selection{background:${GOLD}40}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .nav-a{font-size:13px;font-weight:500;letter-spacing:.04em;transition:color .25s;text-decoration:none}.nav-a:hover{color:${GOLD}!important}
        .hamburger-btn{display:none}
        .header-cta{display:inline-flex}
        .mobile-menu{display:none}
        @media(max-width:860px){
          header{padding:0 20px!important}
          .nav-links{display:none!important}
          .header-cta{display:none!important}
          .hamburger-btn{display:flex!important}
          .mobile-menu.open{display:flex!important}
        }
        .mobile-menu{position:fixed;top:68px;left:0;right:0;bottom:0;background:${t.bg};z-index:299;flex-direction:column;padding:32px 24px;gap:4px;overflow-y:auto}
        .mobile-menu a{padding:16px 4px;font-size:16px;font-weight:500;text-decoration:none;border-bottom:1px solid ${t.border}}
        .filt{font-family:'Inter',sans-serif;font-size:12px;font-weight:500;background:none;border:1.5px solid;padding:7px 16px;cursor:pointer;border-radius:100px;transition:all .22s}
        .filt:hover{border-color:${GOLD}!important;color:${GOLD}!important}
        .filt.on{border-color:${GOLD}!important;background:${GOLD}!important;color:#fff!important}
        .btn-gold{display:inline-flex;align-items:center;gap:8px;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;background:${GOLD};color:${DARK};padding:12px 28px;border-radius:6px;border:1px solid ${GOLD};cursor:pointer;transition:opacity .25s,transform .22s,background .25s;text-decoration:none}.btn-gold:hover{background:${GOLD_HOVER};border-color:${GOLD_HOVER};transform:translateY(-2px)}
        .ft-link{font-size:13px;color:inherit;opacity:.5;transition:color .2s,opacity .2s;text-decoration:none}.ft-link:hover{opacity:1;color:${GOLD}}
        .hero-img{filter:contrast(1.02) saturate(1.03)}
        .bento-card{transition:box-shadow .35s ease, border-color .35s ease, transform .35s ease}
        .bento-card:hover{border-color:${GOLD}80;box-shadow:0 24px 48px -16px rgba(20,15,8,.35);transform:translateY(-3px)}
        .bento-card-img{filter:grayscale(28%);transition:transform 1s ease, filter 1s ease}
        .bento-card:hover .bento-card-img{transform:scale(1.06);filter:grayscale(0%)}
        .bento-card:hover .bento-card-overlay{opacity:1!important}
        .bento-card:hover .bento-card-title{transform:translateY(0)!important;opacity:1!important}
        .bento-card:hover .bento-card-meta{opacity:1!important;transform:translateY(0)!important}
        .bento-tag{font-size:10.5px;letter-spacing:.09em;text-transform:uppercase;color:#fff;background:rgba(15,12,10,.4);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.35);padding:6px 13px;border-radius:100px;font-weight:600;display:inline-block}
        @media(max-width:900px){.ft-g{grid-template-columns:1fr 1fr!important}.bento-grid{grid-template-columns:1fr!important}.hero-split{grid-template-columns:1fr!important}}
        @media(max-width:600px){.pad{padding-left:24px!important;padding-right:24px!important}.ft-g{grid-template-columns:1fr!important}}
      `}</style>

      <div style={{ minHeight: '100vh', background: t.bg, color: t.ink, transition: 'background .4s,color .4s' }}>

        {/* NAV */}
        <header style={{ position: 'sticky', top: 0, zIndex: 300, background: t.bg, borderBottom: `1px solid ${t.border}`, padding: '0 56px', height: 68, display: 'flex', alignItems: 'center', gap: 40 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 1, height: 26, background: GOLD, opacity: .5 }} />
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1.5rem', fontWeight: 500, color: t.ink, lineHeight: 1 }}>The Prospective</div>
              <div style={{ fontSize: 10.5, letterSpacing: '.34em', textTransform: 'uppercase', color: GOLD, fontWeight: 700, marginTop: 5 }}>Interiors</div>
            </div>
          </Link>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 32 }}>
            <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              {([['/', 'Home'],['/projects','Projects'],['/about','About'],['/careers','Careers'],['/contact','Contact']] as [string,string][]).map(([href,label]) => (
                <Link key={href} href={href} className="nav-a" style={{ color: href === '/projects' ? GOLD : t.muted, fontSize: 13 }}>{label}</Link>
              ))}
            </div>
            <Link href="/contact" className="btn-gold header-cta" style={{ padding: '8px 20px', fontSize: 11.5 }}>Get in Touch</Link>
          </div>

          <button
            className="hamburger-btn"
            onClick={() => setMobileMenuOpen(o => !o)}
            aria-label="Toggle menu"
            style={{ marginLeft: 'auto', width: 32, height: 32, background: 'none', border: 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 5, cursor: 'pointer', padding: 0 }}
          >
            <span style={{ display: 'block', width: 22, height: 2, background: t.ink, transition: 'transform .25s', transform: mobileMenuOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
            <span style={{ display: 'block', width: 22, height: 2, background: t.ink, opacity: mobileMenuOpen ? 0 : 1, transition: 'opacity .25s' }} />
            <span style={{ display: 'block', width: 22, height: 2, background: t.ink, transition: 'transform .25s', transform: mobileMenuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
          </button>
        </header>

        <nav className={`mobile-menu${mobileMenuOpen ? ' open' : ''}`}>
          {([['/', 'Home'],['/projects','Projects'],['/about','About'],['/careers','Careers'],['/contact','Contact']] as [string,string][]).map(([href,label]) => (
            <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} style={{ color: href === '/projects' ? GOLD : t.ink }}>{label}</Link>
          ))}
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="btn-gold" style={{ marginTop: 16, textAlign: 'center', padding: '14px 20px', fontSize: 13 }}>Get in Touch</Link>
        </nav>

        {/* HERO — simplified: one image, one quote beside it */}
        <section className="hero-full" style={{ position: 'relative', height: '78vh', minHeight: 520, maxHeight: 760, overflow: 'hidden', borderBottom: `1px solid ${t.border}` }}>
          {heroImageSrc
            ? <img src={heroImageSrc} alt="Our Portfolio" className="hero-img" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 35%' }} />
            : <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${DARK}, #2a2318)` }} />
          }
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(12,10,8,.15) 0%, rgba(12,10,8,.1) 40%, rgba(12,10,8,.55) 75%, rgba(12,10,8,.9) 100%)' }} />
          <div className="pad" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 72px 0', animation: 'fadeUp 1s ease .1s both' }}>
            <p style={{ fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 18, fontWeight: 600 }}>{portfolioLabel}</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 'clamp(2.2rem,3.8vw,3.6rem)', fontWeight: 400, color: '#fff', lineHeight: 1.2, maxWidth: 680, marginBottom: 20, textShadow: '0 2px 20px rgba(0,0,0,.5)' }}>
              {portfolioHeading}
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,.78)', lineHeight: 1.85, maxWidth: 460, marginBottom: 32, fontWeight: 300 }}>{portfolioSubtext}</p>
            <a href="#portfolio-grid" className="btn-gold" style={{ alignSelf: 'flex-start', marginBottom: 64 }}>Explore Our Work →</a>
          </div>
        </section>

        {/* FILTERS */}
        <div id="portfolio-grid" className="pad" style={{ padding: '24px 72px', borderBottom: `1px solid ${t.border}`, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', background: t.bg, position: 'sticky', top: 68, zIndex: 100, backdropFilter: 'blur(16px)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, flex: 1 }}>
            {SECTORS.map(s => (
              <button key={s} className={`filt${sector === s ? ' on' : ''}`}
                style={{ borderColor: sector === s ? GOLD : t.border, color: sector === s ? '#fff' : t.muted }}
                onClick={() => { setSector(s); setPage(1) }}>
                {s}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <span style={{ fontSize: 13, color: t.muted }}>{filtered.length} project{filtered.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* GRID — bigger cards, name only on hover */}
        <section className="pad" style={{ padding: '48px 72px 80px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ width: 36, height: 36, border: `3px solid ${t.border}`, borderTopColor: GOLD, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
              <p style={{ fontSize: 14, color: t.muted }}>Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.8rem', fontWeight: 300, color: t.muted, marginBottom: 12 }}>No projects yet</p>
              <p style={{ fontSize: 14, color: t.muted }}>Add projects in Strapi CMS to see them here.</p>
            </div>
          ) : paginated.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.8rem', fontWeight: 300, color: t.muted }}>No projects in this sector.</p>
            </div>
          ) : (
            <div className="bento-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridAutoRows: 420, gap: 24, maxWidth: 1360, margin: '0 auto' }}>
              {paginated.map((p, i) => {
                return (
                  <FadeIn key={p.id} delay={Math.min((i % 9) * 0.06, 0.36)}>
                    <Link href={`/projects/${p.slug}`} className="bento-card" style={{ display: 'block', position: 'relative', height: '100%', width: '100%', borderRadius: 10, overflow: 'hidden', textDecoration: 'none', border: `1px solid ${t.border}` }}>
                      {p.heroImage
                        ? <img src={p.heroImage} alt={p.title} loading="lazy" className="bento-card-img" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ position: 'absolute', inset: 0, background: dark ? '#2a2820' : '#e8e0d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '3.4rem', color: GOLD, opacity: .45 }}>{p.title.charAt(0)}</span></div>
                      }
                      {/* Overlay + name only appear on hover */}
                      <div className="bento-card-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,12,10,.86) 0%, rgba(15,12,10,.15) 48%, transparent 72%)', opacity: 0, transition: 'opacity .4s ease' }} />

                      {p.sector && (
                        <div style={{ position: 'absolute', top: 18, left: 18 }}>
                          <span className="bento-tag">{p.sector}</span>
                        </div>
                      )}

                      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '26px 28px' }}>
                        <h3 className="bento-card-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.4rem,1.9vw,1.8rem)', fontWeight: 500, color: '#fff', lineHeight: 1.15, opacity: 0, transform: 'translateY(8px)', transition: 'opacity .4s ease, transform .4s ease' }}>{p.title}</h3>
                        <div className="bento-card-meta" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 9, fontSize: 12.5, color: 'rgba(255,255,255,.78)', letterSpacing: '.01em', opacity: 0, transform: 'translateY(6px)', transition: 'opacity .4s ease .05s, transform .4s ease .05s' }}>
                          {p.location && <span>{p.location}</span>}
                          {p.location && p.year && <span style={{ color: GOLD }}>·</span>}
                          {p.year && <span>{p.year}</span>}
                        </div>
                      </div>
                    </Link>
                  </FadeIn>
                )
              })}
            </div>
          )}
          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: 48 }}>
              <button style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, background: 'none', border: `1.5px solid ${t.border}`, color: t.muted, padding: '12px 40px', cursor: 'pointer', borderRadius: 100 }} onClick={() => setPage(p => p + 1)}>Load More</button>
            </div>
          )}
        </section>

        {/* FOOTER */}
        <footer style={{ background: DARK, color: '#f0ebe3', padding: '64px 72px 28px', borderTop: `2px solid ${GOLD}` }}>
          <div className="ft-g" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', gap: 48, marginBottom: 44, alignItems: 'start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 1, height: 30, background: GOLD, opacity: .6 }} />
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1.4rem', color: '#f0ebe3', lineHeight: 1 }}>The Prospective</div>
                  <div style={{ fontSize: 10, letterSpacing: '.32em', textTransform: 'uppercase', color: GOLD, fontWeight: 700, marginTop: 5 }}>Interiors</div>
                </div>
              </div>
              <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,.4)', lineHeight: 1.75, maxWidth: 300 }}>A multi-disciplinary interior design and architecture firm creating meaningful spaces across India since 2004.</p>
            </div>
            <div>
              <div style={{ fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginBottom: 18, fontWeight: 700 }}>Explore</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[['/', 'Home'], ['/projects', 'Projects'], ['/about', 'About'], ['/careers', 'Careers'], ['/contact', 'Contact']].map(([href, label]) => <a key={label} href={href} className="ft-link">{label}</a>)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginBottom: 18, fontWeight: 700 }}>Connect</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                <a href="mailto:info@prospectiveinteriors.com" className="ft-link">info@prospectiveinteriors.com</a>
                <a href="tel:+919876543210" className="ft-link">+91 98765 43210</a>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {['Instagram', 'Pinterest'].map(s => (
                  <a key={s} href="#" style={{ fontSize: 10.5, letterSpacing: '.06em', color: 'rgba(255,255,255,.5)', border: '1px solid rgba(255,255,255,.18)', borderRadius: 16, padding: '6px 14px', textDecoration: 'none', transition: 'all .25s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.18)'; e.currentTarget.style.color = 'rgba(255,255,255,.5)' }}>{s}</a>
                ))}
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,.25)' }}>© 2026 The Prospective Interiors · All rights reserved</span>
            <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,.18)', letterSpacing: '.04em' }}>Pune, India · Est. 2004</span>
          </div>
        </footer>
      </div>
    </>
  )
}