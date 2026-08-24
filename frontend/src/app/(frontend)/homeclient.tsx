'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const GOLD = '#D8C3A5'
const GOLD_HOVER = '#E4CCAA'
const DARK = '#111315'



interface Stat { label: string; value: string }
interface Project { id: string; title: string; slug: string; location: string; year: number | null; sector: string; client: string; heroImage: string; description: string }
interface GalleryItem { src: string }
interface JourneyStep { step: string; desc: string }
interface HomeData { logoUrl?: string; logoAlt?: string; heroHeadline: string; heroSubtext: string; philosophyText: string; heroImage: string; heroImages?: string[]; stats: Stat[]; services: any[]; team: any[]; projects: Project[]; gallery?: GalleryItem[]; heroTagline?: string; ctaLabel?: string; ctaHeading?: string; ctaImage?: string; testimonialImage?: string; testimonialQuote?: string; testimonialAuthor?: string; journeyLabel?: string; journeyHeading?: string; journeySubtext?: string; journeySteps?: JourneyStep[]; journeyImage?: string }



function FadeIn({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0 })
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(32px)', transition: `opacity .9s ease ${delay}s, transform .9s ease ${delay}s`, ...style }}>{children}</div>
}


export default function HomeClient({ data }: { data: HomeData }) {
  const dark = false
  const [mounted, setMounted] = useState(false)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const countsRef = useRef(false)

  // Dark mode removed — site is light-only for now.

  useEffect(() => {
    setMounted(true)
    
  }, [])

  // Counter animation for stats
  const startCounters = () => {
    if (countsRef.current) return
    countsRef.current = true
    data.stats.forEach(stat => {
      const num = parseInt(stat.value.replace(/\D/g, ''))
      if (!num) return
      let start = 0
      const step = Math.ceil(num / 40)
      const timer = setInterval(() => {
        start += step
        if (start >= num) { start = num; clearInterval(timer) }
        setCounts(prev => ({ ...prev, [stat.label]: start }))
      }, 40)
    })
  }

  const statsRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!statsRef.current) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) startCounters() }, { threshold: 0.3 })
    obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [data.stats])

  const heroProjects = data.projects.filter(p => p.heroImage).slice(0, 6)
  // Prefer gallery images from Strapi if provided; fall back to the local curated set.
  const galleryImages = data.gallery ?? []
  const heroImages = (data.heroImages && data.heroImages.length > 0)
    ? data.heroImages
    : (data.heroImage ? [data.heroImage] : (heroProjects.length > 0 ? heroProjects.map(p => p.heroImage) : []))
  const [heroSlide, setHeroSlide] = useState(0)
  useEffect(() => {
    if (heroImages.length < 2) return
    const timer = setInterval(() => setHeroSlide(s => (s + 1) % heroImages.length), 6000)
    return () => clearInterval(timer)
  }, [heroImages.length])

  if (!mounted) return null

  const t = {
    bg: dark ? '#111315' : '#FAF7F1',
    ink: dark ? '#F3F0EA' : DARK,
    muted: dark ? '#C5C1BA' : '#6a6050',
    border: dark ? '#333840' : '#E6DDD0',
    surface: dark ? '#23272C' : '#FFFFFF',
    subtle: dark ? '#1A1D21' : '#F0E9DD',
  }

  const getStatDisplay = (stat: Stat) => {
    const num = parseInt(stat.value.replace(/\D/g, ''))
    const suffix = stat.value.replace(/[0-9]/g, '')
    if (!num) return stat.value
    const current = counts[stat.label]
    if (current === undefined) return stat.value  // show original until counter starts
    return `${current}${suffix}`
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
        @keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:none}}
        @keyframes scrollLine{0%{transform:translateY(-100%)}100%{transform:translateY(260%)}}
        @keyframes iconSpin{from{opacity:0;transform:rotate(-90deg) scale(.5)}to{opacity:1;transform:rotate(0) scale(1)}}
        @keyframes lbFade{from{opacity:0}to{opacity:1}}
        @keyframes lbScaleIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
        .theme-btn:hover{transform:scale(1.08);border-color:${GOLD}!important}
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
        .btn-gold{display:inline-flex;align-items:center;gap:8px;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;background:${GOLD};color:${DARK};padding:14px 36px;border-radius:6px;border:1px solid ${GOLD};cursor:pointer;transition:opacity .25s,transform .22s,background .25s;text-decoration:none;letter-spacing:.04em}
        .btn-gold:hover{background:${GOLD_HOVER};border-color:${GOLD_HOVER};transform:translateY(-2px)}
        .btn-outline{display:inline-flex;align-items:center;gap:8px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;background:transparent;color:#F3F0EA;padding:14px 36px;border-radius:6px;border:1.5px solid rgba(216,195,165,.7);cursor:pointer;transition:all .25s;text-decoration:none;letter-spacing:.04em}
        .btn-outline:hover{border-color:${GOLD};background:rgba(216,195,165,.10)}
        .proj-card{border-radius:20px;overflow:hidden;cursor:pointer;transition:transform .4s,box-shadow .4s,border-color .4s;border:1px solid rgba(216,195,165,.18);box-shadow:0 10px 32px rgba(30,25,15,.08)}
        .proj-card:hover{transform:translateY(-6px);border-color:rgba(216,195,165,.5);box-shadow:0 20px 48px rgba(30,25,15,.14)}
        .proj-img{overflow:hidden;position:relative}
        .proj-img img{transition:transform .8s ease;width:100%;height:100%;object-fit:cover;display:block}
        .proj-card:hover .proj-img img{transform:scale(1.04)}
        .proj-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(17,19,21,.85) 0%,transparent 55%);opacity:0;transition:opacity .4s}
        .proj-card:hover .proj-overlay{opacity:1}
        .ft-link{font-size:13px;color:rgba(255,255,255,.4);transition:color .2s;text-decoration:none}.ft-link:hover{color:${GOLD}}
        .feat-img-wrap img:hover{transform:scale(1.05)}
        .journey-row:hover h3{color:${GOLD}}
        @media (max-width: 900px){.journey-split{grid-template-columns:1fr!important}.journey-img-wrap{position:relative!important;top:0!important;height:320px!important;order:-1;margin-bottom:8px}}
        .bento-card:hover .bento-card-img{transform:scale(1.07)}
        .bento-card:hover .bento-card-arrow{opacity:1!important;transform:translateX(0)!important}
        .palo-card:hover .palo-card-img{transform:scale(1.06)}
        .gallery-item:hover .gallery-item-img{transform:scale(1.06)}
        @media(max-width:900px){.proj-grid{grid-template-columns:1fr 1fr!important}.stats-grid{grid-template-columns:repeat(2,1fr)!important}.ft-g{grid-template-columns:1fr 1fr!important}.stats-wrap{justify-content:center!important}.about-firm{grid-template-columns:1fr!important;gap:40px!important}.services-grid{grid-template-columns:1fr 1fr!important}.process-grid{grid-template-columns:1fr 1fr 1fr!important;row-gap:40px!important}.process-timeline{display:none!important}.feat-spread{grid-template-columns:1fr!important;direction:ltr!important;gap:24px!important}.testi-grid{grid-template-columns:1fr!important}.palo-grid{grid-template-columns:1fr 1fr!important}.bento-grid{grid-template-columns:1fr 1fr!important}.gallery-masonry{column-count:2!important}.stats-combo{grid-template-columns:1fr!important}.stats-combo>div:first-child{height:280px!important}}
        @media(max-width:600px){.palo-grid{grid-template-columns:1fr!important}.process-grid{grid-template-columns:1fr 1fr!important}.bento-grid{grid-template-columns:1fr!important}.bento-grid>div{grid-column:span 1!important}.gallery-masonry{column-count:1!important}}
        @media(max-width:600px){.proj-grid{grid-template-columns:1fr!important}.stats-grid{grid-template-columns:repeat(2,1fr)!important}.pad{padding-left:24px!important;padding-right:24px!important}.ft-g{grid-template-columns:1fr!important}.services-grid{grid-template-columns:1fr!important}.process-grid{grid-template-columns:1fr!important;row-gap:32px!important}}
      `}</style>

      <div style={{ minHeight: '100vh', background: t.bg, color: t.ink, transition: 'background .4s,color .4s' }}>

{/* HEADER */}
        <header style={{ position: 'sticky', top: 0, zIndex: 300, background: t.bg, borderBottom: `1px solid ${t.border}`, padding: '0 56px', height: 68, display: 'flex', alignItems: 'center', gap: 40 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
            {data.logoUrl ? (
              <img src={data.logoUrl} alt={data.logoAlt || 'The Prospective Interiors'} style={{ height: 64, width: 'auto', display: 'block' }} />
            ) : (
              <>
                <div style={{ width: 1, height: 30, background: GOLD, opacity: .5 }} />
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1.5rem', fontWeight: 500, color: t.ink, lineHeight: 1 }}>The Prospective</div>
                  <div style={{ fontSize: 10.5, letterSpacing: '.34em', textTransform: 'uppercase', color: GOLD, fontWeight: 700, marginTop: 5 }}>Interiors</div>
                </div>
              </>
            )}
          </Link>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 32 }}>
            <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              {([['/', 'Home'], ['/projects', 'Projects'], ['/about', 'About'], ['/careers', 'Careers'], ['/contact', 'Contact']] as [string, string][]).map(([href, label]) => (
                <Link key={href} href={href} className="nav-a" style={{ color: href === '/' ? GOLD : t.muted, fontSize: 13 }}>{label}</Link>
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
            <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} style={{ color: href === '/' ? GOLD : t.ink }}>{label}</Link>
          ))}
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="btn-gold" style={{ marginTop: 16, textAlign: 'center', padding: '14px 20px', fontSize: 13 }}>Get in Touch</Link>
        </nav>

        
{/* HERO */}
        <section style={{ position: 'relative', height: '100vh', minHeight: 720, overflow: 'hidden' }}>
          {heroImages.length > 0
            ? heroImages.map((img, i) => (
                <img key={img + i} src={img} alt="Hero" style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center',
                  opacity: i === heroSlide ? 1 : 0,
                  transform: i === heroSlide ? 'scale(1.09)' : 'scale(1)',
                  transition: 'opacity 1.6s ease, transform 7s ease-out',
                }} />
              ))
            : <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, #2a2420 0%, ${DARK} 100%)` }} />
          }
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(17,19,21,.25) 0%, rgba(17,19,21,.30) 40%, rgba(17,19,21,.55) 68%, rgba(17,19,21,.92) 100%)' }} />
          
          <div className="pad" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 72px 110px', animation: 'fadeUp 1.2s ease .2s both' }}>
            <p style={{ fontSize: 12, letterSpacing: '.3em', textTransform: 'uppercase', color: GOLD, marginBottom: 24, fontWeight: 700, textShadow: '0 2px 12px rgba(0,0,0,.7)' }}>{data.heroTagline}</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.8rem,5.5vw,6.2rem)', fontWeight: 500, color: '#fff', lineHeight: 1.03, maxWidth: 960, marginBottom: 28, textShadow: '0 4px 40px rgba(0,0,0,.75), 0 2px 8px rgba(0,0,0,.6)' }}>
              {data.heroHeadline}
            </h1>
            <p style={{ fontSize: 17, color: '#fff', lineHeight: 1.85, maxWidth: 540, marginBottom: 48, fontWeight: 400, textShadow: '0 2px 20px rgba(0,0,0,.75), 0 1px 4px rgba(0,0,0,.6)' }}>
              {data.heroSubtext}
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link href="/projects" className="btn-gold">Explore Our Work →</Link>
              <Link href="/contact" className="btn-outline">Get in Touch</Link>
            </div>
          </div>

          {/* Slide indicators */}
          {heroImages.length > 1 && (
            <div style={{ position: 'absolute', bottom: 48, left: 72, display: 'flex', gap: 8, zIndex: 5 }}>
              {heroImages.map((_, i) => (
                <button key={i} onClick={() => setHeroSlide(i)} aria-label={`Show slide ${i + 1}`} style={{ width: i === heroSlide ? 28 : 8, height: 4, borderRadius: 2, border: 'none', background: i === heroSlide ? GOLD : 'rgba(255,255,255,.35)', cursor: 'pointer', transition: 'all .5s ease', padding: 0 }} />
              ))}
            </div>
          )}
        </section>

        
{/* ABOUT THE FIRM */}
        <section className="pad about-firm" style={{ padding: '100px 72px', borderBottom: `1px solid ${t.border}`, display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 72, alignItems: 'center' }}>
          <FadeIn>
            <p style={{ fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 16, fontWeight: 600 }}>— Who We Are —</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.9rem,3vw,2.8rem)', fontStyle: 'italic', fontWeight: 400, color: t.ink, lineHeight: 1.35, marginBottom: 28 }}>
              {data.philosophyText}
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 24px', marginBottom: 28 }}>
              <span style={{ fontSize: 13, color: t.ink, fontWeight: 600 }}>Est. 2004 · Pune, India</span>
              <span style={{ color: t.border }}>|</span>
              <span style={{ fontSize: 13, color: t.muted }}>Led by Principal Designer <span style={{ color: t.ink, fontWeight: 600 }}>Prashant Bhandiya</span></span>
            </div>
            <Link href="/about" style={{ fontSize: 13, fontWeight: 600, color: GOLD, borderBottom: `1px solid ${GOLD}50`, paddingBottom: 3 }}>Learn About Our Studio →</Link>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div style={{ background: t.subtle, border: `1px solid ${t.border}`, borderRadius: 12, padding: '36px 32px' }}>
              <p style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: t.muted, fontWeight: 700, marginBottom: 20 }}>Sectors We Design For</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {['Hospitality', 'Industrial', 'Healthcare', 'Retail', 'Residential', 'Commercial', 'Civic', 'Educational'].map(sector => (
                  <span key={sector} style={{ fontSize: 12.5, color: t.ink, background: t.surface, border: `1px solid ${t.border}`, padding: '8px 16px', borderRadius: 20 }}>{sector}</span>
                ))}
              </div>
            </div>
          </FadeIn>
        </section>

        
{/* FEATURED PROJECTS */}
        {data.projects.length > 0 && (
          <section className="pad" style={{ padding: '100px 72px', borderBottom: `1px solid ${t.border}` }}>
            <FadeIn>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 60, flexWrap: 'wrap', gap: 24 }}>
                <div>
                  <p style={{ fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 12, fontWeight: 600 }}>— Featured Work —</p>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.4rem,4vw,3.8rem)', fontWeight: 400, color: t.ink, lineHeight: 1.1 }}>Spaces We&apos;re Proud Of</h2>
                  <p style={{ fontSize: 13.5, color: t.muted, maxWidth: 460, lineHeight: 1.7, marginTop: 14 }}>A curated look at our portfolio — favourites pulled from 200+ projects across residential, hospitality and retail sectors.</p>
                </div>
                <Link href="/projects" style={{ fontSize: 13, fontWeight: 600, color: GOLD, borderBottom: `1px solid ${GOLD}50`, paddingBottom: 3, whiteSpace: 'nowrap' }}>View All Projects →</Link>
              </div>
            </FadeIn>

            <div className="bento-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridAutoRows: 340, gap: 20, maxWidth: 1360, margin: '0 auto' }}>
              {data.projects.slice(0, 6).map((p, i) => {
                const big = i === 0 && data.projects.length >= 5
                return (
                  <FadeIn key={p.id} delay={Math.min(i * 0.08, 0.4)} style={{ gridColumn: big ? 'span 2' : 'span 1' }}>
                    <Link href={`/projects/${p.slug}`} className="bento-card" style={{ display: 'block', position: 'relative', height: '100%', minHeight: 340, borderRadius: 6, overflow: 'hidden', textDecoration: 'none', border: `1px solid ${t.border}` }}>
                      {p.heroImage
                        ? <img src={p.heroImage} alt={p.title} loading="lazy" className="bento-card-img" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .8s ease' }} />
                        : <div style={{ position: 'absolute', inset: 0, background: dark ? '#2a2820' : '#e8e0d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '3.4rem', color: GOLD, opacity: .45 }}>{p.title.charAt(0)}</span></div>
                      }
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,12,10,.85) 0%, rgba(15,12,10,.22) 42%, transparent 68%)' }} />
                      <div style={{ position: 'absolute', top: 18, left: 20, fontSize: 10.5, letterSpacing: '.1em', color: 'rgba(255,255,255,.7)', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{String(i + 1).padStart(2, '0')}</div>
                      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '24px 26px' }}>
                        {p.sector && <p style={{ fontSize: 9.5, letterSpacing: '.18em', textTransform: 'uppercase', color: GOLD, fontWeight: 700, marginBottom: 8 }}>{p.sector}</p>}
                        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: big ? 'clamp(1.6rem,2.4vw,2.1rem)' : 'clamp(1.3rem,1.8vw,1.6rem)', fontWeight: 500, color: '#fff', lineHeight: 1.15, marginBottom: 8 }}>{p.title}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                          {p.location && <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,.68)' }}>📍 {p.location}</p>}
                          <span className="bento-card-arrow" style={{ fontSize: 11, color: GOLD, fontWeight: 600, opacity: 0, transform: 'translateX(-6px)', transition: 'opacity .3s ease, transform .3s ease', whiteSpace: 'nowrap' }}>View →</span>
                        </div>
                      </div>
                    </Link>
                  </FadeIn>
                )
              })}
            </div>
          </section>
        )}

        
{/* STATS + CLIENT VOICE */}
        <section className="pad" ref={statsRef} style={{ padding: '0', borderBottom: `1px solid ${t.border}`, background: t.subtle }}>
          <div className="stats-combo" style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', minHeight: 440 }}>
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              {data.testimonialImage && <img src={data.testimonialImage} alt="A recent project" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .8s ease' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'} />}
            </div>
            <div style={{ padding: '68px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(data.stats.length || 1, 4)}, 1fr)`, gap: 0, marginBottom: 48, paddingBottom: 44, borderBottom: `1px solid ${t.border}` }}>
                {data.stats.slice(0, 4).map((stat) => (
                  <div key={stat.label} style={{ textAlign: 'left', paddingRight: 20 }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem,3.4vw,3.2rem)', color: GOLD, fontWeight: 400, lineHeight: 1, marginBottom: 10 }}>
                      {getStatDisplay(stat)}
                    </div>
                    <div style={{ fontSize: 10.5, letterSpacing: '.14em', textTransform: 'uppercase', color: t.muted, fontWeight: 600, lineHeight: 1.5 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
              <FadeIn>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', color: GOLD, lineHeight: .3, marginBottom: 12 }}>&ldquo;</div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(1.3rem,2vw,1.6rem)', color: t.ink, lineHeight: 1.55, marginBottom: 22, maxWidth: 460 }}>
                  {data.testimonialQuote}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 28, height: 1, background: GOLD }} />
                  <span style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: GOLD, fontWeight: 600 }}>{data.testimonialAuthor}</span>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        
{/* DESIGN JOURNEY */}
        <section className="pad" style={{ padding: '120px 72px', borderBottom: `1px solid ${t.border}`, background: t.subtle }}>
          <FadeIn>
            <div style={{ maxWidth: 580, margin: '0 auto 80px' }}>
              <p style={{ fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 14, fontWeight: 600 }}>{data.journeyLabel}</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.4rem,4.2vw,3.8rem)', fontWeight: 400, color: t.ink, lineHeight: 1.08, marginBottom: 18 }}>{data.journeyHeading}</h2>
              <p style={{ fontSize: 14, color: t.muted, lineHeight: 1.75 }}>{data.journeySubtext}</p>
            </div>
          </FadeIn>

          <div className="journey-split" style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 64, alignItems: 'start' }}>
            {/* Side image */}
            <div className="journey-img-wrap" style={{ position: 'sticky', top: 100, borderRadius: 10, overflow: 'hidden', height: 640, background: t.border }}>
              {data.journeyImage ? (
                <img src={data.journeyImage} alt={data.journeyHeading || 'Our design journey'} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              ) : null}
            </div>

            {/* Vertical steps */}
            <div>
              {(() => {
                const journeySteps = data.journeySteps || []
                return journeySteps.map((p, i) => (
                  <FadeIn key={p.step} delay={i * 0.08}>
                    <div
                      className="journey-row"
                      style={{
                        display: 'flex',
                        gap: 28,
                        padding: '34px 0',
                        borderTop: i === 0 ? 'none' : `1px solid ${t.border}`,
                      }}
                    >
                      <div style={{ flexShrink: 0, paddingTop: 6 }}>
                        <div style={{ width: 9, height: 9, borderRadius: '50%', background: GOLD }} />
                      </div>
                      <div>
                        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.65rem', fontWeight: 500, color: t.ink, marginBottom: 10, lineHeight: 1.2, transition: 'color .3s ease' }}>{p.step}</h3>
                        <p style={{ fontSize: 13, color: t.muted, lineHeight: 1.85, maxWidth: 480 }}>{p.desc}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))
              })()}
            </div>
          </div>
        </section>


        
{/* GALLERY */}
        <section className="pad" style={{ padding: '100px 72px', borderBottom: `1px solid ${t.border}` }}>
          <FadeIn>
            <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 56px' }}>
              <p style={{ fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 12, fontWeight: 600 }}>— Our Portfolio —</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem,3.8vw,3.4rem)', fontWeight: 400, color: t.ink, lineHeight: 1.1, marginBottom: 16 }}>A Glimpse Into Our World</h2>
              <p style={{ fontSize: 13.5, color: t.muted, lineHeight: 1.7 }}>Moments from the homes we&apos;ve shaped — texture, light and detail, captured room by room.</p>
            </div>
          </FadeIn>
          <div className="gallery-masonry" style={{ columnCount: 3, columnGap: 18, maxWidth: 1280, margin: '0 auto' }}>
            {galleryImages.map((g, i) => (
              <FadeIn key={g.src} delay={Math.min(i * 0.06, 0.36)} style={{ breakInside: 'avoid', marginBottom: 18 }}>
                <div className="gallery-item" style={{ position: 'relative', borderRadius: 6, overflow: 'hidden' }}>
                  <img src={g.src} alt="" loading="lazy" className="gallery-item-img" style={{ width: '100%', display: 'block', height: i % 3 === 0 ? 420 : i % 3 === 1 ? 300 : 360, objectFit: 'cover', transition: 'transform .7s ease' }} />
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        
{/* CTA BANNER */}
        <section style={{ position: 'relative', height: '55vh', minHeight: 360, overflow: 'hidden', borderBottom: `2px solid ${GOLD}` }}>
          {data.ctaImage || data.projects[2]?.heroImage || data.projects[0]?.heroImage
            ? <img src={data.ctaImage || data.projects[2]?.heroImage || data.projects[0]?.heroImage} alt="Interior design" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, #2a2420 0%, ${DARK} 100%)` }} />
          }
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(17,19,21,.62)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 56px' }}>
            <FadeIn>
              <p style={{ fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 20, fontWeight: 600 }}>{data.ctaLabel}</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.4rem,5vw,4.5rem)', fontWeight: 400, color: '#fff', lineHeight: 1.1, marginBottom: 36, maxWidth: 700 }}>
                {data.ctaHeading}
              </h2>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/contact" className="btn-gold">Start a Conversation →</Link>
                <Link href="/projects" className="btn-outline">View All Projects</Link>
              </div>
            </FadeIn>
          </div>
        </section>

        
{/* FOOTER */}
        <footer style={{ background: DARK, color: '#f0ebe3', padding: '64px 72px 28px', borderTop: `2px solid ${GOLD}` }}>
          <div className="ft-g" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', gap: 48, marginBottom: 44, alignItems: 'start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 1, height: 30, background: GOLD, opacity: .6 }} />
                <div>
                  {data.logoUrl ? (
                    <img src={data.logoUrl} alt={data.logoAlt || 'The Prospective Interiors'} style={{ height: 52, width: 'auto', display: 'block' }} />
                  ) : (
                    <>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1.4rem', color: '#f0ebe3', lineHeight: 1 }}>The Prospective</div>
                      <div style={{ fontSize: 10, letterSpacing: '.32em', textTransform: 'uppercase', color: GOLD, fontWeight: 700, marginTop: 5 }}>Interiors</div>
                    </>
                  )}
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