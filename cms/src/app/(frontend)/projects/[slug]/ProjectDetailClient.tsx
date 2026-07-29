'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'

const GOLD = '#D8C3A5'
const GOLD_HOVER = '#E4CCAA'
const DARK = '#111315'

interface Project {
  id: string; title: string; slug: string; client: string; location: string;
  year: number | null; sector: string; area: string; featured: boolean;
  description: string; heroImage: string; gallery: string[]
}
interface Related { id: string; title: string; slug: string; location: string; year: number | null; sector: string; heroImage: string }



export default function ProjectDetailClient({ project: initialProject, related }: { project: Project; related: Related[] }) {
  const [project] = useState<Project>(initialProject)
  const dark = false
  const [mounted, setMounted] = useState(false)
  const [, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  // Dark mode removed — site is light-only for now.

  const allImgs = [project.heroImage, ...project.gallery].filter(Boolean)

  useEffect(() => {
    setMounted(true)
    // Always start in the premium dark theme regardless of any previously saved preference.
  }, [])

  useEffect(() => { const fn = () => setScrolled(window.scrollY > 60); window.addEventListener('scroll', fn, { passive: true }); return () => window.removeEventListener('scroll', fn) }, [])

  useEffect(() => {
    if (lightboxIdx === null) return
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIdx(null)
      if (e.key === 'ArrowRight') setLightboxIdx(i => i !== null ? Math.min(i + 1, allImgs.length - 1) : null)
      if (e.key === 'ArrowLeft') setLightboxIdx(i => i !== null ? Math.max(i - 1, 0) : null)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', fn)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', fn) }
  }, [lightboxIdx])

  if (!mounted) return null

  const t = {
    bg: dark ? '#111315' : '#FAF7F1',
    ink: dark ? '#F3F0EA' : DARK,
    muted: dark ? '#C5C1BA' : '#6a6050',
    border: dark ? '#333840' : '#E6DDD0',
    surface: dark ? '#23272C' : '#FFFFFF',
    subtle: dark ? '#1A1D21' : '#F0E9DD',
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:'Inter',sans-serif;transition:background .4s,color .4s}a{text-decoration:none;color:inherit}::selection{background:${GOLD}40}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
        @keyframes iconSpin{from{opacity:0;transform:rotate(-90deg) scale(.5)}to{opacity:1;transform:rotate(0) scale(1)}}
        .theme-btn:hover{transform:scale(1.08);border-color:${GOLD}!important}
        .btn-gold{display:inline-flex;align-items:center;gap:8px;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;background:${GOLD};color:${DARK};padding:13px 32px;border-radius:6px;border:1px solid ${GOLD};cursor:pointer;transition:opacity .25s,transform .22s,background .25s;text-decoration:none;letter-spacing:.03em}
        .btn-gold:hover{background:${GOLD_HOVER};border-color:${GOLD_HOVER};transform:translateY(-2px)}
        .btn-gold:hover{opacity:.88;transform:translateY(-2px)}
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
        .tog{width:44px;height:24px;border-radius:12px;cursor:pointer;position:relative;display:flex;align-items:center;padding:3px;transition:background .3s;border:1.5px solid;flex-shrink:0}
        .tok-k{width:16px;height:16px;border-radius:8px;transition:transform .3s}
        .gallery-img{overflow:hidden;border-radius:8px;cursor:pointer;transition:transform .4s,box-shadow .4s}
        .gallery-img:hover{transform:scale(1.02);box-shadow:0 12px 40px rgba(0,0,0,.15)}
        .gallery-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s ease}
        .gallery-img:hover img{transform:scale(1.05)}
        .gallery-img:hover .gallery-img-overlay,.gallery-img:hover .gallery-img-caption{opacity:1}
        .lb-arr{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);width:48px;height:48px;border-radius:24px;cursor:pointer;color:#fff;font-size:24px;display:flex;align-items:center;justify-content:center;transition:background .2s;flex-shrink:0}
        .lb-arr:hover{background:rgba(255,255,255,.2)}
        .rel-card{border-radius:20px;overflow:hidden;cursor:pointer;transition:transform .4s,box-shadow .4s,border-color .4s;display:block;text-decoration:none;border:1px solid rgba(216,195,165,.18);box-shadow:0 10px 32px rgba(30,25,15,.08)}
        .rel-card:hover{transform:translateY(-6px);border-color:rgba(216,195,165,.5);box-shadow:0 20px 48px rgba(30,25,15,.14)}
        .rel-img{overflow:hidden;height:200px}
        .rel-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s ease}
        .rel-card:hover .rel-img img{transform:scale(1.04)}
        .ft-link{font-size:13px;color:rgba(255,255,255,.4);transition:color .2s;text-decoration:none}.ft-link:hover{color:${GOLD}}
        @media(max-width:900px){.gallery-grid{grid-template-columns:1fr 1fr!important}.meta-grid{grid-template-columns:repeat(2,1fr)!important}.rel-grid{grid-template-columns:1fr 1fr!important}.ft-g{grid-template-columns:1fr 1fr!important}}
        @media(max-width:600px){.gallery-grid{grid-template-columns:1fr!important}.meta-grid{grid-template-columns:1fr 1fr!important}.rel-grid{grid-template-columns:1fr!important}.pad{padding-left:24px!important;padding-right:24px!important}.ft-g{grid-template-columns:1fr!important}}
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
              {([['/', 'Home'], ['/projects', 'Projects'], ['/about', 'About'], ['/careers', 'Careers'], ['/contact', 'Contact']] as [string, string][]).map(([href, label]) => (
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
          {([['/', 'Home'], ['/projects', 'Projects'], ['/about', 'About'], ['/careers', 'Careers'], ['/contact', 'Contact']] as [string, string][]).map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} style={{ color: href === '/projects' ? GOLD : t.ink }}>{label}</Link>
          ))}
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="btn-gold" style={{ marginTop: 16, textAlign: 'center', padding: '14px 20px', fontSize: 13 }}>Get in Touch</Link>
        </nav>

        {/* HERO */}
        <section style={{ position: 'relative', height: '85vh', minHeight: 560, overflow: 'hidden' }}>
          {project.heroImage
            ? <img src={project.heroImage} alt={project.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
            : <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, #2a2420, ${DARK})` }} />
          }
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,12,10,.92) 0%, rgba(15,12,10,.35) 55%, rgba(15,12,10,.2) 100%)' }} />
          <div className="pad" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 72px 80px', animation: 'fadeUp 1s ease .1s both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <Link href="/projects" style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', fontWeight: 500, transition: 'color .2s' }} onMouseEnter={e => e.currentTarget.style.color = GOLD} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.5)'}>← All Projects</Link>
              <span style={{ color: 'rgba(255,255,255,.3)' }}>·</span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: GOLD }}>{project.sector}</span>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem,4.2vw,4.2rem)', fontWeight: 400, color: '#fff', lineHeight: 1.1, maxWidth: 780, marginBottom: 28, textShadow: '0 2px 20px rgba(0,0,0,.5)' }}>
              {project.title}
            </h1>
            {/* Meta pills */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[
                project.client && { label: 'Client', value: project.client },
                project.location && { label: 'Location', value: project.location },
                project.year && { label: 'Year', value: String(project.year) },
                project.area && { label: 'Area', value: project.area },
              ].filter(Boolean).map((item: any) => (
                <div key={item.label} style={{ background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 6, padding: '8px 16px' }}>
                  <div style={{ fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: GOLD, fontWeight: 700, marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Gallery count badge */}
          {allImgs.length > 1 && (
            <div style={{ position: 'absolute', bottom: 80, right: 72, background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }} onClick={() => setLightboxIdx(0)}>
              <span style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>📷 {allImgs.length} Photos</span>
            </div>
          )}
        </section>

        {/* DESCRIPTION */}
        {project.description && (
          <section className="pad" style={{ padding: '88px 72px', borderBottom: `1px solid ${t.border}` }}>
            <div style={{ maxWidth: 820, margin: '0 auto', position: 'relative' }}>
              <span aria-hidden style={{ position: 'absolute', top: -36, left: -8, fontFamily: "'Cormorant Garamond', serif", fontSize: '5.5rem', lineHeight: 1, color: GOLD, opacity: .25, userSelect: 'none' }}>&ldquo;</span>
              <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 22, fontWeight: 600, position: 'relative' }}>— About This Project —</p>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.2rem,2.1vw,1.5rem)', fontWeight: 300, color: t.ink, lineHeight: 1.95, whiteSpace: 'pre-line', position: 'relative' }}>
                {project.description}
              </div>
            </div>
          </section>
        )}

        {/* GALLERY */}
        {allImgs.length > 1 && (
          <section className="pad" style={{ padding: '88px 72px', background: t.subtle, borderBottom: `1px solid ${t.border}` }}>
            <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 40, fontWeight: 600 }}>— Project Gallery —</p>
            <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 1400, margin: '0 auto' }}>
              {allImgs.map((src, i) => (
                <div key={i} className="gallery-img" style={{ position: 'relative', aspectRatio: '4 / 5' }} onClick={() => setLightboxIdx(i)}>
                  <img src={src} alt={`${project.title} — ${i + 1}`} loading={i === 0 ? 'eager' : 'lazy'} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,12,10,.55) 0%, transparent 45%)', opacity: 0, transition: 'opacity .35s ease' }} className="gallery-img-overlay" />
                  <span style={{ position: 'absolute', bottom: 14, left: 16, fontSize: 12, color: '#fff', fontWeight: 600, letterSpacing: '.04em', opacity: 0, transition: 'opacity .35s ease' }} className="gallery-img-caption">{String(i + 1).padStart(2, '0')} / {String(allImgs.length).padStart(2, '0')}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: t.muted, marginTop: 20, textAlign: 'center' }}>Click any image to view full screen</p>
          </section>
        )}

        {/* PROJECT META */}
        <section className="pad" style={{ padding: '72px 72px', borderBottom: `1px solid ${t.border}` }}>
          <div className="meta-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, maxWidth: 900 }}>
            {[
              { label: 'Client', value: project.client },
              { label: 'Location', value: project.location },
              { label: 'Year', value: project.year ? String(project.year) : null },
              { label: 'Area', value: project.area },
              { label: 'Sector', value: project.sector },
              { label: 'Project Type', value: project.featured ? 'Featured' : 'Standard' },
            ].filter(item => item.value).map(item => (
              <div key={item.label} style={{ padding: '20px 0', borderTop: `1px solid ${t.border}` }}>
                <div style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: GOLD, fontWeight: 700, marginBottom: 8 }}>{item.label}</div>
                <div style={{ fontSize: 15, color: t.ink, fontWeight: 500 }}>{item.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* RELATED PROJECTS */}
        {related.length > 0 && (
          <section className="pad" style={{ padding: '80px 72px', borderBottom: `1px solid ${t.border}` }}>
            <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 16, fontWeight: 600 }}>— More {project.sector} Projects —</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: t.ink, marginBottom: 40, lineHeight: 1.1 }}>Related Work</h2>
            <div className="rel-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {related.map(r => (
                <Link key={r.id} href={`/projects/${r.slug}`} className="rel-card" style={{ background: t.surface }}>
                  <div className="rel-img">
                    {r.heroImage
                      ? <img src={r.heroImage} alt={r.title} loading="lazy" />
                      : <div style={{ height: '100%', background: dark ? '#2a2820' : '#e8e0d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem', color: GOLD, opacity: .4 }}>{r.title.charAt(0)}</span></div>
                    }
                  </div>
                  <div style={{ padding: '16px 18px 20px' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: GOLD }}>{r.sector}</span>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 500, color: t.ink, margin: '6px 0 4px', lineHeight: 1.25 }}>{r.title}</h3>
                    <p style={{ fontSize: 12, color: t.muted }}>📍 {r.location}{r.year ? ` · ${r.year}` : ''}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section style={{ position: 'relative', height: '50vh', minHeight: 320, overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1800&q=95" alt="CTA" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,12,10,.65)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 56px' }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 400, color: '#f0ebe3', lineHeight: 1.1, marginBottom: 28, maxWidth: 540 }}>Ready to start your project?</h2>
            <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 700, background: GOLD, color: '#fff', padding: '13px 32px', borderRadius: 6, transition: 'opacity .25s,transform .22s', textDecoration: 'none' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '.88'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'none' }}>
              Start a Conversation →
            </Link>
          </div>
        </section>

        {/* LIGHTBOX */}
        {lightboxIdx !== null && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(15,14,10,.97)', display: 'flex', flexDirection: 'column', animation: 'fadeUp .25s ease' }}>
            <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 40px', borderBottom: '1px solid rgba(255,255,255,.08)', flexShrink: 0 }}>
              <button onClick={() => setLightboxIdx(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.5)', cursor: 'pointer', fontSize: 14, padding: 0 }}>← Close</button>
              <div style={{ margin: '0 auto', fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', color: '#f0ebe3' }}>{project.title}</div>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>{lightboxIdx + 1} / {allImgs.length}</span>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '0 60px' }}>
              <img src={allImgs[lightboxIdx]} alt={project.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }} />
              {lightboxIdx > 0 && <button className="lb-arr" onClick={() => setLightboxIdx(i => i !== null ? i - 1 : null)} style={{ position: 'absolute', left: 16 }}>‹</button>}
              {lightboxIdx < allImgs.length - 1 && <button className="lb-arr" onClick={() => setLightboxIdx(i => i !== null ? i + 1 : null)} style={{ position: 'absolute', right: 16 }}>›</button>}
            </div>
            <div style={{ display: 'flex', gap: 6, padding: '10px 40px 16px', overflowX: 'auto', flexShrink: 0, borderTop: '1px solid rgba(255,255,255,.05)' }}>
              {allImgs.map((src, i) => (
                <div key={i} onClick={() => setLightboxIdx(i)} style={{ width: 64, height: 48, flexShrink: 0, borderRadius: 4, overflow: 'hidden', cursor: 'pointer', border: `2px solid ${i === lightboxIdx ? GOLD : 'transparent'}`, opacity: i === lightboxIdx ? 1 : .4, transition: 'all .2s' }}>
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer style={{ background: dark ? '#0a0908' : DARK, color: '#f0ebe3', padding: '72px 72px 48px' }}>
          <div className="ft-g" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr', gap: 48, marginBottom: 56 }}>
            <div><div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}><div style={{ width: 1, height: 30, background: GOLD, opacity: .6 }} /><div><div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1.4rem', color: '#f0ebe3', lineHeight: 1 }}>The Prospective</div><div style={{ fontSize: 10, letterSpacing: '.32em', textTransform: 'uppercase', color: GOLD, fontWeight: 700, marginTop: 5 }}>Interiors</div></div></div><p style={{ fontSize: 13, color: 'rgba(255,255,255,.3)', lineHeight: 1.85, maxWidth: 300, marginTop: 20 }}>A multi-disciplinary interior design firm creating meaningful spaces across India since 2004.</p></div>
            {[
              { t: 'Navigate', items: [['/', 'Home'], ['/projects', 'Projects'], ['/about', 'About'], ['/careers', 'Careers'], ['/contact', 'Contact']] as [string, string][] },
              { t: 'Studio', items: [['#', '101, Design House'], ['#', 'Baner Road, Pune'], ['#', 'Maharashtra 411045']] as [string, string][] },
              { t: 'Connect', items: [['mailto:info@prospectiveinteriors.com', 'info@prospectiveinteriors.com'], ['tel:+919876543210', '+91 98765 43210']] as [string, string][] },
            ].map(col => (
              <div key={col.t}>
                <div style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.28)', marginBottom: 20, fontWeight: 700 }}>{col.t}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{col.items.map(([href, label]) => <a key={label} href={href} className="ft-link">{label}</a>)}</div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,.22)' }}>© 2026 The Prospective Interiors · All rights reserved</span>
          </div>
        </footer>
      </div>
    </>
  )
}