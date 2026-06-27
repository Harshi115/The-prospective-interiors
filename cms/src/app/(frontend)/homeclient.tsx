'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const GOLD = '#b89a6e'
const CREAM = '#f7f4ef'
const DARK = '#1a1814'

interface Project { id:string;title:string;slug:string;location:string;year:number|null;sector:string;client:string;heroImage:string;description:string }
interface Stat { label:string;value:string }
interface HomeData { heroHeadline:string;heroSubtext:string;philosophyText:string;heroImage:string;stats:Stat[];services:any[];team:any[];projects:Project[] }

const DS:Stat[] = [
  {label:'Years of Excellence',value:'20+'},
  {label:'Projects Delivered',value:'200+'},
  {label:'Sectors Served',value:'8'},
  {label:'Design Awards',value:'12'},
]

const SERVICES_DEFAULT = [
  'Network Design','Project Execution','Project Management','Material Selection',
  'Conceptualization & Design','Value Engineering','3D Visualisation','Lighting Design',
  'Façade Design','Interior Styling','Turnkey Delivery','Post-Occupancy Review',
]

const VALUES = [
  {v:'Honesty',d:'We are transparent about every decision — from budgets to timelines. Our clients always know exactly where things stand.'},
  {v:'Transparency',d:'No hidden costs, no surprises. Every project is documented and communicated clearly at every stage.'},
  {v:'Timeliness',d:'A delayed space costs real money. Our record of on-time delivery across 200+ projects is something we are genuinely proud of.'},
  {v:'Innovation',d:'Every project gives us a reason to think differently. We push creative and technical boundaries while keeping practicality central.'},
  {v:'Passion',d:'Design is not just a profession for us — it is how we see the world. That passion shows in every detail we obsess over.'},
  {v:'Attention to Detail',d:'The details most people never consciously notice are the ones we obsess over. Every junction, material and finish is a considered decision.'},
  {v:'Value-Add',d:'Great design should always deliver more than it costs. We measure success by how much we improve every rupee our clients invest.'},
]

// LOGO — Option A: Two squares + text
function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {/* Icon */}
      <div style={{ position: 'relative', width: 36, height: 36, flexShrink: 0 }}>
        <div style={{ position: 'absolute', inset: 0, border: `2.2px solid ${onDark ? '#f0ebe3' : DARK}`, borderRadius: 4 }} />
        <div style={{ position: 'absolute', right: 0, bottom: 0, width: 22, height: 22, background: GOLD, borderRadius: 2 }} />
      </div>
      {/* Text */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700, color: onDark ? '#f0ebe3' : DARK, letterSpacing: '0.08em', textTransform: 'uppercase' }}>THE PROSPECTIVE</span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 400, color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase' }}>INTERIORS</span>
      </div>
    </div>
  )
}

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

function CountUp({ value, visible }: { value: string; visible: boolean }) {
  const [d, setD] = useState(value)
  useEffect(() => {
    if (!visible) return
    const n = parseInt(value.replace(/\D/g, ''))
    const s = value.replace(/\d/g, '')
    if (!n) { setD(value); return }
    let c = 0; const step = Math.ceil(n / 40)
    const t = setInterval(() => { c = Math.min(c + step, n); setD(c + s); if (c >= n) clearInterval(t) }, 30)
    return () => clearInterval(t)
  }, [visible, value])
  return <>{d}</>
}

export default function HomeClient({ data }: { data: HomeData }) {
  const [dark, setDarkSt] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeVal, setActiveVal] = useState(0)
  const [hovSector, setHovSector] = useState<string | null>(null)
  const valTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  const setDark = (v: boolean) => { setDarkSt(v); try { localStorage.setItem('tpi-theme', v ? 'dark' : 'light') } catch {} }
  useEffect(() => {
    setMounted(true)
    try { if (localStorage.getItem('tpi-theme') === 'dark') setDarkSt(true) } catch {}
  }, [])
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 60); window.addEventListener('scroll', fn, { passive: true }); return () => window.removeEventListener('scroll', fn) }, [])
  useEffect(() => {
    valTimer.current = setInterval(() => setActiveVal(v => (v + 1) % VALUES.length), 3500)
    return () => { if (valTimer.current) clearInterval(valTimer.current) }
  }, [])

  if (!mounted) return null

  const t = {
    bg: dark ? '#111009' : CREAM,
    ink: dark ? '#f0ebe3' : DARK,
    muted: dark ? 'rgba(255,255,255,.45)' : '#6a6050',
    border: dark ? 'rgba(255,255,255,.1)' : '#ddd5c5',
    surface: dark ? '#1c1a14' : '#fff',
    subtle: dark ? '#161410' : '#f0ebe3',
  }

  const stats = data.stats.length ? data.stats : DS
  const projects = data.projects.slice(0, 3)
  const services = data.services.length ? data.services.map((s: any) => s.title || s) : SERVICES_DEFAULT

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
        @keyframes scrollLine{0%{transform:translateY(-100%)}100%{transform:translateY(260%)}}
        @keyframes valIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        .nav-a{font-size:13px;font-weight:500;letter-spacing:.04em;transition:color .25s;text-decoration:none}
        .nav-a:hover{color:${GOLD}!important}
        .tog{width:44px;height:24px;border-radius:12px;cursor:pointer;position:relative;display:flex;align-items:center;padding:3px;transition:background .3s;border:1.5px solid;flex-shrink:0}
        .tok-k{width:16px;height:16px;border-radius:8px;transition:transform .3s}
        .proj-card{border-radius:10px;overflow:hidden;transition:transform .4s,box-shadow .4s;display:block}
        .proj-card:hover{transform:translateY(-6px);box-shadow:0 20px 56px rgba(0,0,0,.13)}
        .proj-img{overflow:hidden}
        .proj-img img{transition:transform .8s ease;width:100%;display:block;object-fit:cover}
        .proj-card:hover .proj-img img{transform:scale(1.05)}
        .val-btn{background:none;border:none;border-bottom:1px solid;cursor:pointer;text-align:left;padding:14px 0;width:100%;display:flex;align-items:center;justify-content:space-between;transition:all .3s;font-family:'Inter',sans-serif}
        .sector-row{padding:16px 0;border-bottom:1px solid;display:flex;align-items:center;justify-content:space-between;transition:all .3s;cursor:default}
        .svc-tag{padding:10px 18px;border:1.5px solid;border-radius:100px;font-size:13px;transition:all .25s;cursor:default;white-space:nowrap}
        .svc-tag:hover{border-color:${GOLD}!important;color:${GOLD}!important}
        .btn-gold{display:inline-flex;align-items:center;gap:8px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;background:${GOLD};color:#fff;padding:13px 32px;border-radius:6px;border:none;cursor:pointer;transition:opacity .25s,transform .22s;text-decoration:none;letter-spacing:.03em}
        .btn-gold:hover{opacity:.88;transform:translateY(-2px)}
        .btn-outline{display:inline-flex;align-items:center;font-family:'Inter',sans-serif;font-size:13px;font-weight:500;border:1.5px solid rgba(255,255,255,.4);color:rgba(255,255,255,.85);padding:12px 28px;border-radius:6px;transition:all .25s;text-decoration:none}
        .btn-outline:hover{border-color:#fff;color:#fff}
        .ft-link{font-size:13px;color:rgba(255,255,255,.4);transition:color .2s;text-decoration:none}
        .ft-link:hover{color:${GOLD}}
        @media(max-width:900px){.proj-g{grid-template-columns:1fr 1fr!important}.stats-g{grid-template-columns:repeat(2,1fr)!important;gap:36px!important}.sdiv{display:none!important}.phil-g{grid-template-columns:1fr!important}.val-g{grid-template-columns:1fr!important}.ft-g{grid-template-columns:1fr 1fr!important}}
        @media(max-width:600px){.proj-g{grid-template-columns:1fr!important}.ft-g{grid-template-columns:1fr!important}.pad{padding-left:24px!important;padding-right:24px!important}}
      `}</style>

      <div style={{ minHeight: '100vh', background: t.bg, color: t.ink, transition: 'background .4s,color .4s' }}>

        {/* NAV */}
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300, height: 68, display: 'flex', alignItems: 'center', padding: '0 56px', gap: 40, background: scrolled ? (dark ? 'rgba(17,16,9,.97)' : 'rgba(247,244,239,.97)') : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? `1px solid ${t.border}` : 'none', transition: 'background .4s,border-color .4s' }}>
          <Link href="/"><Logo onDark={!scrolled || dark} /></Link>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 32 }}>
            {([['/', 'Home'], ['/projects', 'Projects'], ['/about', 'About'], ['/contact', 'Contact']] as [string, string][]).map(([href, label]) => (
              <Link key={href} href={href} className="nav-a"
                style={{ color: scrolled ? (href === '/' ? GOLD : t.muted) : (href === '/' ? '#fff' : 'rgba(255,255,255,.65)') }}>
                {label}
              </Link>
            ))}
            <button className="tog" onClick={() => setDark(!dark)} style={{ background: dark ? GOLD : '#ddd5c5', borderColor: dark ? GOLD : '#ccc4b4' }} aria-label="Toggle theme">
              <div className="tok-k" style={{ background: dark ? DARK : '#fff', transform: dark ? 'translateX(20px)' : 'none' }} />
            </button>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ position: 'relative', height: '100vh', minHeight: 640, overflow: 'hidden' }}>
          {data.heroImage
            ? <img src={data.heroImage} alt="Hero" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
            : <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, #2a2420 0%, ${DARK} 100%)` }} />
          }
          {/* Strong overlay for text visibility */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,12,10,.88) 0%, rgba(15,12,10,.45) 45%, rgba(15,12,10,.3) 100%)' }} />
          <div className="pad" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 72px 96px', animation: 'fadeUp 1s ease .1s both' }}>
            <p style={{ fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 20, fontWeight: 600 }}>Est. 2004 · Pune, India</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.8rem,5.5vw,5.8rem)', fontWeight: 400, color: '#fff', lineHeight: 1.08, maxWidth: 820, marginBottom: 20, letterSpacing: '-.01em' }}>
              {data.heroHeadline || 'Designing Spaces That Shape the Future'}
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,.72)', lineHeight: 1.85, maxWidth: 460, marginBottom: 44, fontWeight: 300 }}>
              {data.heroSubtext || 'A 20-year legacy of transforming spaces across Maharashtra and pan-India.'}
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <Link href="/projects" className="btn-gold">Explore Our Work →</Link>
              <Link href="/contact" className="btn-outline">Get in Touch</Link>
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: 48, right: 72, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 1, height: 56, background: 'rgba(255,255,255,.2)', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: GOLD, animation: 'scrollLine 2s ease-in-out infinite' }} />
            </div>
          </div>
        </section>

        {/* STATS */}
        <div style={{ background: dark ? '#0d0c08' : DARK, padding: '64px 72px' }}>
          <div className="stats-g" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, auto)', alignItems: 'center', justifyContent: 'center', maxWidth: 900, margin: '0 auto' }}>
            {stats.map((s, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div className="sdiv" style={{ width: 1, height: 48, background: 'rgba(255,255,255,.1)' }} />}
                <div style={{ textAlign: 'center', padding: '0 40px' }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.4rem,3.8vw,3.4rem)', color: GOLD, fontWeight: 400, lineHeight: 1, marginBottom: 8 }}>
                    <CountUp value={s.value} visible={true} />
                  </div>
                  <div style={{ fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', fontWeight: 600 }}>{s.label}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* FEATURED PROJECTS */}
        {projects.length > 0 && (
          <section className="pad" style={{ padding: '96px 72px', background: t.bg }}>
            <FadeIn>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 56, flexWrap: 'wrap', gap: 20 }}>
                <div>
                  <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 12, fontWeight: 600 }}>— Selected Work —</p>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: t.ink, lineHeight: 1.1 }}>Featured Projects</h2>
                </div>
                <Link href="/projects" style={{ fontSize: 13, fontWeight: 600, color: GOLD, borderBottom: `1px solid ${GOLD}50`, paddingBottom: 2, transition: 'border-color .3s' }} onMouseEnter={e => e.currentTarget.style.borderColor = GOLD} onMouseLeave={e => e.currentTarget.style.borderColor = `${GOLD}50`}>View All →</Link>
              </div>
            </FadeIn>
            <div className="proj-g" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {projects.map((p, i) => (
                <FadeIn key={p.id} delay={i * 0.12}>
                  <Link href={`/projects/${p.slug}`} className="proj-card" style={{ background: t.surface }}>
                    <div className="proj-img" style={{ height: 240 }}>
                      {p.heroImage
                        ? <img src={p.heroImage} alt={p.title} loading="lazy" style={{ height: '100%' }} />
                        : <div style={{ height: '100%', background: dark ? '#2a2820' : '#e8e0d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '3rem', color: GOLD, opacity: .4 }}>{p.title.charAt(0)}</span></div>
                      }
                    </div>
                    <div style={{ padding: '20px 22px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: GOLD }}>{p.sector}</span>
                        {p.year && <><span style={{ color: t.border }}>·</span><span style={{ fontSize: 11, color: t.muted }}>{p.year}</span></>}
                      </div>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.35rem', fontWeight: 500, color: t.ink, marginBottom: 8, lineHeight: 1.25 }}>{p.title}</h3>
                      {p.location && <p style={{ fontSize: 12, color: t.muted, marginBottom: 10 }}>📍 {p.location}</p>}
                      {p.description && <p style={{ fontSize: 13, color: t.muted, lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</p>}
                      <div style={{ marginTop: 14, fontSize: 12, fontWeight: 600, color: GOLD }}>View Project →</div>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </section>
        )}

        {/* FULL BLEED IMAGE */}
        <div style={{ height: '60vh', minHeight: 360, overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1800&q=95" alt="Interior" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .9s ease' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'} />
        </div>

        {/* PHILOSOPHY */}
        <section className="pad" style={{ padding: '96px 72px', background: dark ? '#0d0c08' : DARK }}>
          <div className="phil-g" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, maxWidth: 1160, margin: '0 auto', alignItems: 'center' }}>
            <FadeIn>
              <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 24, fontWeight: 600 }}>— Our Philosophy —</p>
              <blockquote style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 300, fontStyle: 'italic', color: '#f0ebe3', lineHeight: 1.55, marginBottom: 28 }}>
                "{data.philosophyText || 'Architecture is a dialogue between the human spirit and the space it inhabits — we design for people, not photographs.'}"
              </blockquote>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 2, background: GOLD }} />
                <span style={{ fontSize: 12, color: GOLD, letterSpacing: '.06em', fontWeight: 500 }}>Prashant Bhandiya · Principal Designer</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p style={{ fontSize: 15.5, color: 'rgba(255,255,255,.45)', lineHeight: 2, marginBottom: 20 }}>Founded in 2004, The Prospective Interiors has built its reputation on honest design, transparent delivery and genuine passion for every space we touch.</p>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,.32)', lineHeight: 2, marginBottom: 36 }}>Over two decades and 200+ projects, we have designed restaurants that become destinations, hospitals that feel like sanctuaries, and homes that their owners never want to leave.</p>
              <Link href="/about" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: GOLD, border: `1.5px solid ${GOLD}50`, padding: '12px 28px', borderRadius: 6, transition: 'border-color .3s,background .3s', textDecoration: 'none' }} onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.background = `${GOLD}14` }} onMouseLeave={e => { e.currentTarget.style.borderColor = `${GOLD}50`; e.currentTarget.style.background = 'transparent' }}>Our Full Story →</Link>
            </FadeIn>
          </div>
        </section>

        {/* VALUES */}
        <section className="pad" style={{ padding: '96px 72px', borderBottom: `1px solid ${t.border}` }}>
          <FadeIn>
            <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 12, fontWeight: 600 }}>— The 7 Pillars —</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem,3.5vw,3rem)', fontWeight: 400, color: t.ink, marginBottom: 52, lineHeight: 1.1 }}>Our Core Values</h2>
          </FadeIn>
          <div className="val-g" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 32, alignItems: 'start' }}
            onMouseEnter={() => { if (valTimer.current) clearInterval(valTimer.current) }}
            onMouseLeave={() => { valTimer.current = setInterval(() => setActiveVal(v => (v + 1) % VALUES.length), 3500) }}>
            <div>
              {VALUES.map((v, i) => (
                <button key={v.v} className="val-btn" onClick={() => setActiveVal(i)} style={{ borderBottomColor: t.border }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontWeight: 400, color: activeVal === i ? GOLD : t.muted, transition: 'color .3s' }}>{v.v}</span>
                  {activeVal === i && <span style={{ fontSize: 10, color: GOLD, fontWeight: 700 }}>0{i + 1}</span>}
                </button>
              ))}
            </div>
            <div key={activeVal} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: '40px 44px', animation: 'valIn .4s ease both' }}>
              <div style={{ fontSize: 10, letterSpacing: '.16em', color: GOLD, marginBottom: 16, fontWeight: 700 }}>0{activeVal + 1} / 07</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: t.ink, marginBottom: 16, lineHeight: 1.1 }}>{VALUES[activeVal].v}</h3>
              <p style={{ fontSize: 15, color: t.muted, lineHeight: 1.9 }}>{VALUES[activeVal].d}</p>
            </div>
          </div>
        </section>

        {/* SECTORS */}
        <section className="pad" style={{ padding: '80px 72px', background: t.subtle, borderBottom: `1px solid ${t.border}` }}>
          <FadeIn>
            <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 44, textAlign: 'center', fontWeight: 600 }}>— Sectors We Serve —</p>
            <div style={{ borderTop: `1px solid ${t.border}`, maxWidth: 800, margin: '0 auto' }}>
              {[
                { s: 'Hospitality & Restaurants', eg: 'e.g. Spice Nation Restaurant, Pune' },
                { s: 'Industrial & Tech Campuses', eg: 'e.g. Silicon Meadows, Hinjewadi' },
                { s: 'Hospitals & Healthcare', eg: "e.g. Disha's Eye Hospital, Nashik" },
                { s: 'Showrooms & Retail', eg: 'e.g. Shoe Box Flagship, FC Road' },
                { s: 'Residential', eg: 'e.g. Mr Poonawala Residence, Koregaon Park' },
                { s: 'Commercial & Corporate', eg: 'e.g. Meridian Corporate Hub, Baner' },
                { s: 'Educational', eg: 'Schools, colleges & institutions' },
                { s: 'Civic & Recreational', eg: 'Public & community spaces' },
              ].map(({ s, eg }) => (
                <div key={s} className="sector-row" style={{ borderBottomColor: hovSector === s ? GOLD : t.border, color: hovSector === s ? GOLD : t.ink, paddingLeft: hovSector === s ? 12 : 0 }}
                  onMouseEnter={() => setHovSector(s)} onMouseLeave={() => setHovSector(null)}>
                  <div>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', fontWeight: 400 }}>{s}</span>
                    <span style={{ fontSize: 12, color: t.muted, marginLeft: 16, opacity: hovSector === s ? 1 : 0, transition: 'opacity .3s' }}>{eg}</span>
                  </div>
                  <span style={{ fontSize: 13, color: GOLD, opacity: hovSector === s ? 1 : 0, transition: 'opacity .3s' }}>→</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* SERVICES */}
        <section className="pad" style={{ padding: '96px 72px', borderBottom: `1px solid ${t.border}` }}>
          <FadeIn>
            <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 12, fontWeight: 600 }}>— 12 Core Services —</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem,3.5vw,3rem)', fontWeight: 400, color: t.ink, marginBottom: 44, lineHeight: 1.1 }}>What We Offer</h2>
          </FadeIn>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {services.slice(0, 12).map((s: string, i: number) => (
              <FadeIn key={i} delay={Math.min(i * 0.04, 0.24)}>
                <div className="svc-tag" style={{ borderColor: t.border, color: t.muted, background: t.surface }}>{s}</div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ position: 'relative', height: '60vh', minHeight: 400, overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1800&q=95" alt="CTA" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .9s ease' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,12,10,.65)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 56px' }}>
            <FadeIn>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem,4.5vw,4rem)', fontWeight: 400, color: '#f0ebe3', lineHeight: 1.1, marginBottom: 36, maxWidth: 600 }}>
                Let's create something extraordinary together
              </h2>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/contact" className="btn-gold">Start a Conversation →</Link>
                <Link href="/projects" className="btn-outline">View All Projects</Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: dark ? '#0a0908' : DARK, color: '#f0ebe3', padding: '72px 72px 48px' }}>
          <div className="ft-g" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr', gap: 48, marginBottom: 56 }}>
            <div>
              <Logo onDark />
              <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,.32)', lineHeight: 1.85, maxWidth: 300, marginTop: 20 }}>A multi-disciplinary interior design and architecture firm creating meaningful spaces across India since 2004.</p>
            </div>
            {[
              { t: 'Navigate', items: [['/', 'Home'], ['/projects', 'Projects'], ['/about', 'About'], ['/contact', 'Contact']] as [string, string][] },
              { t: 'Studio', items: [['#', '101, Design House'], ['#', 'Baner Road, Pune'], ['#', 'Maharashtra 411045'], ['#', 'Mon–Sat · 9am–6pm']] as [string, string][] },
              { t: 'Connect', items: [['mailto:info@prospectiveinteriors.com', 'info@prospectiveinteriors.com'], ['tel:+919876543210', '+91 98765 43210']] as [string, string][] },
            ].map(col => (
              <div key={col.t}>
                <div style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.28)', marginBottom: 20, fontWeight: 700 }}>{col.t}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {col.items.map(([href, label]) => <a key={label} href={href} className="ft-link">{label}</a>)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,.22)' }}>© 2026 The Prospective Interiors · All rights reserved</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,.16)', letterSpacing: '.04em' }}>Designed by Prashant Bhandiya · Est. Pune 2004</span>
          </div>
        </footer>
      </div>
    </>
  )
}
