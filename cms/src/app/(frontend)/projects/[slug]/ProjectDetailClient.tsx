'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const GOLD = '#b89a6e'
const CREAM = '#f7f4ef'
const DARK = '#1a1814'
const STRAPI = 'http://localhost:1337'

interface Project {
  id: string; title: string; slug: string; client: string; location: string;
  year: number | null; sector: string; area: string; featured: boolean;
  description: string; heroImage: string; gallery: string[]
}
interface Related { id: string; title: string; slug: string; location: string; year: number | null; sector: string; heroImage: string }

function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ position: 'relative', width: 36, height: 36, flexShrink: 0 }}>
        <div style={{ position: 'absolute', inset: 0, border: `2.2px solid ${onDark ? '#f0ebe3' : DARK}`, borderRadius: 4 }} />
        <div style={{ position: 'absolute', right: 0, bottom: 0, width: 22, height: 22, background: GOLD, borderRadius: 2 }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700, color: onDark ? '#f0ebe3' : DARK, letterSpacing: '0.08em', textTransform: 'uppercase' }}>THE PROSPECTIVE</span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 400, color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase' }}>INTERIORS</span>
      </div>
    </div>
  )
}

export default function ProjectDetailClient({ project: initialProject, related }: { project: Project; related: Related[] }) {
  const [project, setProject] = useState<Project>(initialProject)
  const [dark, setDarkSt] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const setDark = (v: boolean) => { setDarkSt(v); try { localStorage.setItem('tpi-theme', v ? 'dark' : 'light') } catch {} }

  useEffect(() => {
    setMounted(true)
    try { if (localStorage.getItem('tpi-theme') === 'dark') setDarkSt(true) } catch {}

    // Refetch with gallery
    fetch(`${STRAPI}/api/projects?filters[slug][$eq]=${initialProject.slug}&populate[heroImage]=true&populate[gallery]=true`)
      .then(r => r.json())
      .then(json => {
        const raw = json?.data?.[0]
        if (!raw) return
        const getImgUrl = (media: any) => {
          if (!media) return ''
          const url = media?.url ?? ''
          return url.startsWith('http') ? url : url ? `${STRAPI}${url}` : ''
        }
        setProject({
          ...project,
          heroImage: getImgUrl(raw.heroImage),
          gallery: (raw.gallery ?? []).map((img: any) => {
            const url = img?.url ?? ''
            return url.startsWith('http') ? url : url ? `${STRAPI}${url}` : ''
          }).filter(Boolean),
        })
      })
      .catch(() => {})
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

  const allImgs = [project.heroImage, ...project.gallery].filter(Boolean)

  const t = {
    bg: dark ? '#111009' : CREAM,
    ink: dark ? '#f0ebe3' : DARK,
    muted: dark ? 'rgba(255,255,255,.45)' : '#6a6050',
    border: dark ? 'rgba(255,255,255,.1)' : '#ddd5c5',
    surface: dark ? '#1c1a14' : '#fff',
    subtle: dark ? '#161410' : '#f0ebe3',
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:'Inter',sans-serif;transition:background .4s,color .4s}a{text-decoration:none;color:inherit}::selection{background:${GOLD}40}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
        .nav-a{font-size:13px;font-weight:500;letter-spacing:.04em;transition:color .25s;text-decoration:none}.nav-a:hover{color:${GOLD}!important}
        .tog{width:44px;height:24px;border-radius:12px;cursor:pointer;position:relative;display:flex;align-items:center;padding:3px;transition:background .3s;border:1.5px solid;flex-shrink:0}
        .tok-k{width:16px;height:16px;border-radius:8px;transition:transform .3s}
        .gallery-img{overflow:hidden;border-radius:8px;cursor:pointer;transition:transform .4s,box-shadow .4s}
        .gallery-img:hover{transform:scale(1.02);box-shadow:0 12px 40px rgba(0,0,0,.15)}
        .gallery-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s ease}
        .gallery-img:hover img{transform:scale(1.05)}
        .lb-arr{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);width:48px;height:48px;border-radius:24px;cursor:pointer;color:#fff;font-size:24px;display:flex;align-items:center;justify-content:center;transition:background .2s;flex-shrink:0}
        .lb-arr:hover{background:rgba(255,255,255,.2)}
        .rel-card{border-radius:8px;overflow:hidden;cursor:pointer;transition:transform .4s,box-shadow .4s;display:block;text-decoration:none}
        .rel-card:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(0,0,0,.12)}
        .rel-img{overflow:hidden;height:200px}
        .rel-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s ease}
        .rel-card:hover .rel-img img{transform:scale(1.06)}
        .ft-link{font-size:13px;color:rgba(255,255,255,.4);transition:color .2s;text-decoration:none}.ft-link:hover{color:${GOLD}}
        @media(max-width:900px){.gallery-grid{grid-template-columns:1fr 1fr!important}.meta-grid{grid-template-columns:repeat(2,1fr)!important}.rel-grid{grid-template-columns:1fr 1fr!important}.ft-g{grid-template-columns:1fr 1fr!important}}
        @media(max-width:600px){.gallery-grid{grid-template-columns:1fr!important}.meta-grid{grid-template-columns:1fr 1fr!important}.rel-grid{grid-template-columns:1fr!important}.pad{padding-left:24px!important;padding-right:24px!important}.ft-g{grid-template-columns:1fr!important}}
      `}</style>

      <div style={{ minHeight: '100vh', background: t.bg, color: t.ink, transition: 'background .4s,color .4s' }}>

        {/* NAV */}
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300, height: 68, display: 'flex', alignItems: 'center', padding: '0 56px', gap: 40, background: scrolled ? (dark ? 'rgba(17,16,9,.97)' : 'rgba(247,244,239,.97)') : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? `1px solid ${t.border}` : 'none', transition: 'background .4s' }}>
          <Link href="/"><Logo onDark={!scrolled || dark} /></Link>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 32 }}>
            {([['/', 'Home'], ['/projects', 'Projects'], ['/about', 'About'], ['/contact', 'Contact']] as [string, string][]).map(([href, label]) => (
              <Link key={href} href={href} className="nav-a" style={{ color: scrolled ? (href === '/projects' ? GOLD : t.muted) : 'rgba(255,255,255,.65)' }}>{label}</Link>
            ))}
            <button className="tog" onClick={() => setDark(!dark)} style={{ background: dark ? GOLD : '#ddd5c5', borderColor: dark ? GOLD : '#ccc4b4' }} aria-label="Toggle theme">
              <div className="tok-k" style={{ background: dark ? DARK : '#fff', transform: dark ? 'translateX(20px)' : 'none' }} />
            </button>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ position: 'relative', height: '100vh', minHeight: 640, overflow: 'hidden' }}>
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
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.8rem,5.5vw,5.5rem)', fontWeight: 400, color: '#fff', lineHeight: 1.06, maxWidth: 820, marginBottom: 32, textShadow: '0 2px 20px rgba(0,0,0,.5)' }}>
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
          <section className="pad" style={{ padding: '80px 72px', borderBottom: `1px solid ${t.border}` }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 20, fontWeight: 600 }}>— About This Project —</p>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.1rem,2vw,1.35rem)', fontWeight: 300, color: t.ink, lineHeight: 1.9, whiteSpace: 'pre-line' }}>
                {project.description}
              </div>
            </div>
          </section>
        )}

        {/* GALLERY */}
        {allImgs.length > 1 && (
          <section className="pad" style={{ padding: '80px 72px', background: t.subtle, borderBottom: `1px solid ${t.border}` }}>
            <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 36, fontWeight: 600 }}>— Project Gallery —</p>
            <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {allImgs.map((src, i) => (
                <div key={i} className="gallery-img" style={{ height: i === 0 ? 480 : 280, gridColumn: i === 0 ? 'span 2' : 'auto' }} onClick={() => setLightboxIdx(i)}>
                  <img src={src} alt={`${project.title} — ${i + 1}`} loading={i === 0 ? 'eager' : 'lazy'} />
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: t.muted, marginTop: 16, textAlign: 'center' }}>Click any image to view full screen</p>
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
            <div><Logo onDark /><p style={{ fontSize: 13, color: 'rgba(255,255,255,.3)', lineHeight: 1.85, maxWidth: 300, marginTop: 20 }}>A multi-disciplinary interior design firm creating meaningful spaces across India since 2004.</p></div>
            {[
              { t: 'Navigate', items: [['/', 'Home'], ['/projects', 'Projects'], ['/about', 'About'], ['/contact', 'Contact']] as [string, string][] },
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
