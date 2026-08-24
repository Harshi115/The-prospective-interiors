'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const GOLD = '#D8C3A5'
const GOLD_HOVER = '#E4CCAA'
const DARK = '#111315'

interface Service { id: string; title: string; description: string }
interface Member { id: string; name: string; role: string; bio: string; photo: string }
interface Stat { label: string; value: string }
interface Value { id: string; title: string; description: string }






function FadeIn({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0 })
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(28px)', transition: `opacity .85s ease ${delay}s, transform .85s ease ${delay}s`, ...style }}>{children}</div>
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

interface AboutPageContent {
  heroHeading?: string
  heroSubHeading?: string
  heroImage?: string
  storyLabel?: string
  storyHeading?: string
  storyPara1?: string
  storyPara2?: string
  storyPara3?: string
  storyImage?: string
  philosophyLabel?: string
  philosophyQuote?: string
  philosophyAttribution?: string
  philosophyImage?: string
  valuesLabel?: string
  servicesLabel?: string
  faqLabel?: string
  galleryImage1?: string
  galleryImage2?: string
  galleryImage3?: string
  galleryImage4?: string
  ctaImage?: string
  ctaHeading?: string
}
interface Faq { id?: string; q: string; a: string }

export default function AboutClient({ services, stats, values, pageContent, faqs, logoUrl, logoAlt }: { services: Service[]; team: Member[]; stats: Stat[]; values: Value[]; pageContent?: AboutPageContent; faqs?: Faq[]; logoUrl?: string; logoAlt?: string }) {
  const pc = pageContent || {}
  const faqList = faqs || []
  const dark = false
  const [mounted, setMounted] = useState(false)
  const [, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeVal, setActiveVal] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [hovSvc, setHovSvc] = useState<string | null>(null)
  const valTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  // Dark mode removed — site is light-only for now.
  useEffect(() => {
    setMounted(true)
    // Always start in the premium dark theme regardless of any previously saved preference.
  }, [])
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 60); window.addEventListener('scroll', fn, { passive: true }); return () => window.removeEventListener('scroll', fn) }, [])
  useEffect(() => {
    valTimer.current = setInterval(() => setActiveVal(v => (v + 1) % values.length), 3500)
    return () => { if (valTimer.current) clearInterval(valTimer.current) }
  }, [values.length])

  if (!mounted) return null

  const svcs = services
  const sts = stats

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
        @keyframes valIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        @keyframes scrollLine{0%{transform:translateY(-100%)}100%{transform:translateY(260%)}}
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
        .val-btn{background:none;border:none;border-bottom:1px solid;cursor:pointer;text-align:left;padding:14px 0;width:100%;display:flex;align-items:center;justify-content:space-between;transition:all .3s;font-family:'Inter',sans-serif}
        .svc-card{padding:28px 24px;border:1.5px solid;border-radius:10px;transition:all .32s;cursor:default}
        .svc-card:hover{border-color:${GOLD}!important;transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,.08)}
        .faq-q{width:100%;background:none;border:none;text-align:left;font-family:'Cormorant Garamond',serif;font-size:1.15rem;color:inherit;font-weight:400;padding:20px 0;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:16px;transition:color .2s}
        .faq-q:hover{color:${GOLD}}
        .img-hover{overflow:hidden;border-radius:10px}.img-hover img{transition:transform .8s ease;width:100%;height:100%;object-fit:cover;display:block}.img-hover:hover img{transform:scale(1.05)}
        .btn-gold{display:inline-flex;align-items:center;gap:8px;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;background:${GOLD};color:${DARK};padding:13px 32px;border-radius:6px;border:1px solid ${GOLD};cursor:pointer;transition:opacity .25s,transform .22s,background .25s;text-decoration:none;letter-spacing:.03em}.btn-gold:hover{background:${GOLD_HOVER};border-color:${GOLD_HOVER};transform:translateY(-2px)}
        .ft-link{font-size:13px;color:inherit;opacity:.5;transition:color .2s,opacity .2s;text-decoration:none}.ft-link:hover{opacity:1;color:${GOLD}}
        @media(max-width:900px){.two-col{grid-template-columns:1fr!important}.stats-g{grid-template-columns:repeat(2,1fr)!important;gap:36px!important}.sdiv{display:none!important}.val-g{grid-template-columns:1fr!important}.svc-g{grid-template-columns:1fr 1fr!important}.ft-g{grid-template-columns:1fr 1fr!important}}
        @media(max-width:600px){.svc-g{grid-template-columns:1fr!important}.ft-g{grid-template-columns:1fr!important}.pad{padding-left:24px!important;padding-right:24px!important}}
      `}</style>

      <div style={{ minHeight: '100vh', background: t.bg, color: t.ink, transition: 'background .4s,color .4s' }}>

        {/* NAV */}
        <header style={{ position: 'sticky', top: 0, zIndex: 300, background: t.bg, borderBottom: `1px solid ${t.border}`, padding: '0 56px', height: 68, display: 'flex', alignItems: 'center', gap: 40 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
            {logoUrl ? (
              <img src={logoUrl} alt={logoAlt || 'The Prospective Interiors'} style={{ height: 64, width: 'auto', display: 'block' }} />
            ) : (
              <>
                <div style={{ width: 1, height: 26, background: GOLD, opacity: .5 }} />
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
                <Link key={href} href={href} className="nav-a" style={{ color: href === '/about' ? GOLD : t.muted, fontSize: 13 }}>{label}</Link>
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
            <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} style={{ color: href === '/about' ? GOLD : t.ink }}>{label}</Link>
          ))}
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="btn-gold" style={{ marginTop: 16, textAlign: 'center', padding: '14px 20px', fontSize: 13 }}>Get in Touch</Link>
        </nav>

        {/* HERO — Full screen luxury */}
        <section style={{ position: 'relative', height: '78vh', minHeight: 520, maxHeight: 760, overflow: 'hidden' }}>
          {pc.heroImage && <img src={pc.heroImage} alt="Luxury Interior" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(17,19,21,.25) 0%, rgba(17,19,21,.2) 45%, rgba(17,19,21,.85) 100%)' }} />
          <div className="pad" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 72px 84px', animation: 'fadeUp 1s ease .1s both' }}>
            <p style={{ fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 18, fontWeight: 600 }}>Est. 2004 · Pune, India</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 'clamp(2.2rem,3.8vw,3.6rem)', fontWeight: 400, color: '#fff', lineHeight: 1.15, maxWidth: 680, marginBottom: 20, textShadow: '0 2px 20px rgba(0,0,0,.5)' }}>
              {pc.heroHeading}
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,.72)', lineHeight: 1.85, maxWidth: 440, marginBottom: 36, fontWeight: 300 }}>
              {pc.heroSubHeading}
            </p>
            <Link href="/contact" className="btn-gold">Begin a Conversation →</Link>
          </div>
          <div style={{ position: 'absolute', bottom: 48, right: 72, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 1, height: 56, background: 'rgba(255,255,255,.2)', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: GOLD, animation: 'scrollLine 2s ease-in-out infinite' }} />
            </div>
          </div>
        </section>

        {/* STATS */}
        <div style={{ background: t.subtle, padding: '64px 72px' }}>
          <div className="stats-g" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, auto)', alignItems: 'center', justifyContent: 'center', maxWidth: 900, margin: '0 auto' }}>
            {sts.map((s, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div className="sdiv" style={{ width: 1, height: 48, background: t.border }} />}
                <div style={{ textAlign: 'center', padding: '0 40px' }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.4rem,3.8vw,3.4rem)', color: GOLD, fontWeight: 400, lineHeight: 1, marginBottom: 8 }}>
                    <CountUp value={s.value} visible={true} />
                  </div>
                  <div style={{ fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: t.muted, fontWeight: 600 }}>{s.label}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* STORY — Two col with luxury image */}
        <section className="pad" style={{ padding: '96px 72px', borderBottom: `1px solid ${t.border}` }}>
          <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, maxWidth: 1160, margin: '0 auto', alignItems: 'center' }}>
            <FadeIn>
              <div className="img-hover" style={{ height: 560 }}>
                {pc.storyImage && <img src={pc.storyImage} alt="Luxury Interior Design" />}
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 20, fontWeight: 600 }}>{pc.storyLabel}</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: t.ink, lineHeight: 1.15, marginBottom: 28 }}>{pc.storyHeading}</h2>
              <p style={{ fontSize: 15.5, color: t.muted, lineHeight: 2, marginBottom: 20 }}>{pc.storyPara1}</p>
              <p style={{ fontSize: 15, color: t.muted, lineHeight: 2, marginBottom: 20 }}>{pc.storyPara2}</p>
              <p style={{ fontSize: 15, color: t.muted, lineHeight: 2, marginBottom: 36 }}>{pc.storyPara3}</p>
              <Link href="/projects" style={{ fontSize: 13, fontWeight: 600, color: GOLD, borderBottom: `1px solid ${GOLD}50`, paddingBottom: 2 }}>Explore Our Work →</Link>
            </FadeIn>
          </div>
        </section>

        {/* LUXURY IMAGE GRID */}
        <section style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: '300px 300px', gap: 4 }}>
            <div className="img-hover" style={{ gridRow: '1 / 3' }}>
              {pc.galleryImage1 && <img src={pc.galleryImage1} alt="Interior" style={{ height: '100%' }} />}
            </div>
            <div className="img-hover">
              {pc.galleryImage2 && <img src={pc.galleryImage2} alt="Interior" style={{ height: '100%' }} />}
            </div>
            <div className="img-hover">
              {pc.galleryImage3 && <img src={pc.galleryImage3} alt="Interior" style={{ height: '100%' }} />}
            </div>
            <div className="img-hover">
              {pc.galleryImage4 && <img src={pc.galleryImage4} alt="Interior" style={{ height: '100%' }} />}
            </div>
            <div style={{ background: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, flexDirection: 'column', gap: 12 }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 300, fontStyle: 'italic', color: '#f0ebe3', textAlign: 'center', lineHeight: 1.4 }}>200+ spaces. One standard.</p>
              <div style={{ width: 32, height: 2, background: GOLD }} />
              <p style={{ fontSize: 11, color: GOLD, letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600 }}>Excellence</p>
            </div>
          </div>
        </section>

        {/* PHILOSOPHY */}
        <section className="pad" style={{ padding: '96px 72px', background: t.subtle }}>
          <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, maxWidth: 1160, margin: '0 auto', alignItems: 'center' }}>
            <FadeIn>
              <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 24, fontWeight: 600 }}>{pc.philosophyLabel}</p>
              <blockquote style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 300, fontStyle: 'italic', color: t.ink, lineHeight: 1.55, marginBottom: 28 }}>
                {pc.philosophyQuote}
              </blockquote>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 2, background: GOLD }} />
                <span style={{ fontSize: 12, color: GOLD, letterSpacing: '.06em', fontWeight: 500 }}>{pc.philosophyAttribution}</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="img-hover" style={{ height: 420, borderRadius: 10 }}>
                {pc.philosophyImage && <img src={pc.philosophyImage} alt="Luxury Interior" />}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* CORE VALUES */}
        <section className="pad" style={{ padding: '96px 72px', borderBottom: `1px solid ${t.border}` }}>
          <FadeIn>
            <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 12, fontWeight: 600 }}>{pc.valuesLabel}</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem,3.5vw,3rem)', fontWeight: 400, color: t.ink, marginBottom: 52, lineHeight: 1.1 }}>Our Core Values</h2>
          </FadeIn>
          <div className="val-g" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 32, alignItems: 'start' }}
            onMouseEnter={() => { if (valTimer.current) clearInterval(valTimer.current) }}
            onMouseLeave={() => { valTimer.current = setInterval(() => setActiveVal(v => (v + 1) % values.length), 3500) }}>
            <div>
              {values.map((v, i) => (
                <button key={v.id} className="val-btn" onClick={() => setActiveVal(i)} style={{ borderBottomColor: t.border }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontWeight: 400, color: activeVal === i ? GOLD : t.muted, transition: 'color .3s' }}>{v.title}</span>
                  {activeVal === i && <span style={{ fontSize: 10, color: GOLD, fontWeight: 700 }}>0{i + 1}</span>}
                </button>
              ))}
            </div>
            <div key={activeVal} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: '40px 44px', animation: 'valIn .4s ease both' }}>
              <div style={{ fontSize: 10, letterSpacing: '.16em', color: GOLD, marginBottom: 16, fontWeight: 700 }}>0{activeVal + 1} / {String(values.length).padStart(2, '0')}</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: t.ink, marginBottom: 16, lineHeight: 1.1 }}>{values[activeVal]?.title}</h3>
              <p style={{ fontSize: 15, color: t.muted, lineHeight: 1.9 }}>{values[activeVal]?.description}</p>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="pad" style={{ padding: '96px 72px', background: t.subtle, borderBottom: `1px solid ${t.border}` }}>
          <FadeIn>
            <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 12, fontWeight: 600 }}>{pc.servicesLabel}</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem,3.5vw,3rem)', fontWeight: 400, color: t.ink, marginBottom: 52, lineHeight: 1.1 }}>What We Offer</h2>
          </FadeIn>
          <div className="svc-g" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {svcs.map((s, i) => (
              <FadeIn key={s.id} delay={Math.min(i * 0.04, 0.28)}>
                <div className="svc-card" style={{ borderColor: hovSvc === s.id ? GOLD : t.border, background: t.surface }}
                  onMouseEnter={() => setHovSvc(s.id)} onMouseLeave={() => setHovSvc(null)}>
                  <div style={{ fontSize: 10, color: GOLD, marginBottom: 12, fontWeight: 700, letterSpacing: '.1em' }}>0{i + 1}</div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.15rem', fontWeight: 500, color: t.ink, marginBottom: 10, lineHeight: 1.25 }}>{s.title}</h3>
                  <p style={{ fontSize: 13.5, color: t.muted, lineHeight: 1.8 }}>{s.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="pad" style={{ padding: '96px 72px', borderBottom: `1px solid ${t.border}` }}>
          <div style={{ maxWidth: 780, margin: '0 auto' }}>
            <FadeIn>
              <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 12, fontWeight: 600 }}>{pc.faqLabel}</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem,3.5vw,3rem)', fontWeight: 400, color: t.ink, marginBottom: 48, lineHeight: 1.1 }}>FAQs</h2>
            </FadeIn>
            {faqList.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div style={{ borderTop: `1px solid ${t.border}` }}>
                  <button className="faq-q" style={{ color: t.ink }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{faq.q}</span>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: GOLD, transition: 'transform .25s', transform: openFaq === i ? 'rotate(45deg)' : 'none', flexShrink: 0, lineHeight: 1 }}>+</span>
                  </button>
                  {openFaq === i && <p style={{ fontSize: 14, color: t.muted, lineHeight: 1.85, paddingBottom: 22, animation: 'fadeUp .3s ease' }}>{faq.a}</p>}
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ position: 'relative', height: '60vh', minHeight: 400, overflow: 'hidden' }}>
          {pc.ctaImage && <img src={pc.ctaImage} alt="Luxury Interior" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .9s ease' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'} />}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,12,10,.65)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 56px' }}>
            <FadeIn>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem,4.5vw,4rem)', fontWeight: 400, color: '#f0ebe3', lineHeight: 1.1, marginBottom: 36, maxWidth: 600 }}>
                {pc.ctaHeading}
              </h2>
              <Link href="/contact" className="btn-gold">Start a Conversation →</Link>
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
                  {logoUrl ? (
                    <img src={logoUrl} alt={logoAlt || 'The Prospective Interiors'} style={{ height: 52, width: 'auto', display: 'block' }} />
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