'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const GOLD = '#D8C3A5'
const GOLD_HOVER = '#E4CCAA'
const DARK = '#111315'

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



interface CareersPageContent {
  heroLabel?: string
  heroHeading?: string
  heroSubtext?: string
  heroImage?: string
  sideImage?: string
  ctaHeading?: string
  ctaImage?: string
  contactEmail?: string
  contactPhone?: string
  contactHours?: string
}

export default function CareerClient({ pageContent, stats = [], logoUrl, logoAlt }: { pageContent?: CareersPageContent; stats?: { label: string; value: string }[]; logoUrl?: string; logoAlt?: string } = {}) {
  const pc = pageContent || {}
  const contactEmail = pc.contactEmail || ''
  const contactPhone = pc.contactPhone || ''
  const contactHours = pc.contactHours || ''
  const dark = false
  const [mounted, setMounted] = useState(false)
  const [openings, setOpenings] = useState<{ id: number; title: string; type: string; location: string; experience: string; department: string }[]>([])
  const [values, setValues] = useState<{ icon: string; title: string; desc: string }[]>([])
  const [selected, setSelected] = useState<{ id: number; title: string; type: string; location: string; experience: string; department: string } | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', position: '', experience: '', message: '', portfolio: null as File | null })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [err, setErr] = useState('')
  const [foc, setFoc] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  // Dark mode removed — site is light-only for now.
  useEffect(() => {
    setMounted(true)
    // Always start in the premium dark theme regardless of any previously saved preference.
    
    // Fetch from Strapi
    const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
    
    // Fetch job openings
    fetch(`${STRAPI}/api/job-openings?sort=order:asc`, { cache: 'no-store' })
      .then(r => r.json())
      .then(json => {
        const jobs = (json?.data ?? []).map((j: any) => ({
          id: j.id,
          title: j.title ?? '',
          type: j.type ?? 'Full Time',
          location: j.location ?? '',
          experience: j.experience ?? '',
          department: j.department ?? '',
        }))
        if (jobs.length > 0) setOpenings(jobs)
      })
      .catch(() => {})

    // Fetch career values
    fetch(`${STRAPI}/api/career-values?sort=order:asc`, { cache: 'no-store' })
      .then(r => r.json())
      .then(json => {
        const vals = (json?.data ?? []).map((v: any) => ({
          icon: v.icon ?? '⭐',
          title: v.title ?? '',
          desc: v.description ?? '',
        }))
        if (vals.length > 0) setValues(vals)
      })
      .catch(() => {})
  }, [])

  const ch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setForm(p => ({ ...p, portfolio: file }))
      setFileName(file.name)
    }
  }

  const applyFor = (job: { id: number; title: string; type: string; location: string; experience: string; department: string }) => {
    setSelected(job)
    setForm(p => ({ ...p, position: job.title }))
    setTimeout(() => {
      document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setErr('Please enter your name'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setErr('Please enter a valid email'); return }
    if (!form.position) { setErr('Please select a position'); return }
    if (!form.message.trim()) { setErr('Please tell us about yourself'); return }
    setErr(''); setStatus('loading')
    try {
      const body = new FormData()
      body.append('name', form.name)
      body.append('email', form.email)
      body.append('phone', form.phone)
      body.append('position', form.position)
      body.append('experience', form.experience)
      body.append('message', form.message)
      if (form.portfolio) body.append('portfolio', form.portfolio)

      const res = await fetch('/api/applications', { method: 'POST', body })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || 'Submission failed')

      setStatus('success')
      setForm({ name: '', email: '', phone: '', position: '', experience: '', message: '', portfolio: null })
      setFileName('')
      setSelected(null)
    } catch (error) {
      console.error('Application submit error:', error)
      setErr('Something went wrong submitting your application. Please try again.')
      setStatus('idle')
    }
  }

  if (!mounted) return null

  const t = {
    bg: dark ? '#111315' : '#FAF7F1',
    ink: dark ? '#F3F0EA' : DARK,
    muted: dark ? '#C5C1BA' : '#6a6050',
    border: dark ? '#333840' : '#E6DDD0',
    surface: dark ? '#23272C' : '#FFFFFF',
    subtle: dark ? '#1A1D21' : '#F0E9DD',
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '13px 0', border: 'none',
    borderBottom: `1.5px solid ${t.border}`,
    background: 'transparent', color: t.ink, fontSize: 15,
    fontFamily: "'Inter', sans-serif", outline: 'none',
    transition: 'border-color .25s',
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:'Inter',sans-serif;transition:background .4s,color .4s}a{text-decoration:none;color:inherit}::selection{background:${GOLD}40}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
        @keyframes iconSpin{from{opacity:0;transform:rotate(-90deg) scale(.5)}to{opacity:1;transform:rotate(0) scale(1)}}
        .theme-btn:hover{transform:scale(1.08);border-color:${GOLD}!important}
        .btn-gold{display:inline-flex;align-items:center;gap:8px;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;background:${GOLD};color:${DARK};padding:14px 36px;border-radius:6px;border:1px solid ${GOLD};cursor:pointer;transition:opacity .25s,transform .22s,background .25s;text-decoration:none;letter-spacing:.04em}
        .btn-gold:hover{background:${GOLD_HOVER};border-color:${GOLD_HOVER};transform:translateY(-2px)}
        .btn-outline{display:inline-flex;align-items:center;gap:8px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;background:transparent;color:#F3F0EA;padding:14px 36px;border-radius:6px;border:1.5px solid rgba(216,195,165,.7);cursor:pointer;transition:all .25s;text-decoration:none;letter-spacing:.04em}
        .btn-outline:hover{border-color:${GOLD};background:rgba(216,195,165,.10)}
        @keyframes scrollLine{0%{transform:translateY(-100%)}100%{transform:translateY(260%)}}
        .nav-a{font-size:13px;font-weight:500;letter-spacing:.04em;transition:color .25s;text-decoration:none}.nav-a:hover{color:${GOLD}!important}
        .tog{width:44px;height:24px;border-radius:12px;cursor:pointer;position:relative;display:flex;align-items:center;padding:3px;transition:background .3s;border:1.5px solid;flex-shrink:0}
        .tok-k{width:16px;height:16px;border-radius:8px;transition:transform .3s}
        ::placeholder{color:#c5b8a8;font-size:14px}
        .job-card{border:1.5px solid;border-radius:10px;padding:24px 28px;transition:all .3s;cursor:pointer}
        .job-card:hover{border-color:${GOLD}!important;transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,.08)}
        .job-card.selected{border-color:${GOLD}!important;background:${GOLD}08}
        .val-card{border:1.5px solid;border-radius:10px;padding:28px 24px;transition:all .3s}
        .val-card:hover{border-color:${GOLD}!important;transform:translateY(-3px)}
        .submit-btn{width:100%;padding:16px;background:${GOLD};color:#fff;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border-radius:8px;transition:opacity .25s,transform .2s}
        .submit-btn:hover:not(:disabled){opacity:.88;transform:translateY(-1px)}
        .submit-btn:disabled{opacity:.5;cursor:not-allowed}
        .upload-btn{display:flex;align-items:center;gap:10px;padding:12px 20px;border:1.5px dashed;border-radius:8px;cursor:pointer;transition:all .25s;font-family:'Inter',sans-serif;font-size:13px;background:none;width:100%}
        .upload-btn:hover{border-color:${GOLD}!important;color:${GOLD}!important}
        .ft-link{font-size:13px;color:inherit;opacity:.5;transition:color .2s,opacity .2s;text-decoration:none}.ft-link:hover{opacity:1;color:${GOLD}}
        @media(max-width:900px){.grid-2{grid-template-columns:1fr!important}.grid-3{grid-template-columns:1fr 1fr!important}.ft-g{grid-template-columns:1fr 1fr!important}}
        @media(max-width:600px){.grid-3{grid-template-columns:1fr!important}.pad{padding-left:24px!important;padding-right:24px!important}.ft-g{grid-template-columns:1fr!important}}
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
            {([['/', 'Home'], ['/projects', 'Projects'], ['/about', 'About'], ['/careers', 'Careers'], ['/contact', 'Contact']] as [string, string][]).map(([href, label]) => (
              <Link key={href} href={href} className="nav-a" style={{ color: href === '/careers' ? GOLD : t.muted, fontSize: 13 }}>{label}</Link>
            ))}
            <Link href="/contact" className="btn-gold" style={{ padding: '8px 20px', fontSize: 11.5 }}>Get in Touch</Link>
          </div>
        </header>

        {/* HERO */}
        <section style={{ position: 'relative', height: '85vh', minHeight: 560, overflow: 'hidden' }}>
          {pc.heroImage && <img src={pc.heroImage} alt="Careers" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,12,10,.92) 0%, rgba(15,12,10,.45) 55%, rgba(15,12,10,.3) 100%)' }} />
          <div className="pad" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 72px 100px', animation: 'fadeUp 1s ease .1s both' }}>
            <p style={{ fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 20, fontWeight: 600 }}>{pc.heroLabel}</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.8rem,5.5vw,5.8rem)', fontWeight: 400, color: '#fff', lineHeight: 1.08, maxWidth: 820, marginBottom: 24, textShadow: '0 2px 20px rgba(0,0,0,.5)' }}>
              {pc.heroHeading}
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,.72)', lineHeight: 1.85, maxWidth: 480, marginBottom: 44, fontWeight: 300 }}>
              {pc.heroSubtext}
            </p>
            <a href="#openings" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 700, background: GOLD, color: '#fff', padding: '13px 32px', borderRadius: 6, textDecoration: 'none', transition: 'opacity .25s', letterSpacing: '.03em' }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '.88'} onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}>
              View Openings →
            </a>
          </div>
          <div style={{ position: 'absolute', bottom: 48, right: 72, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 1, height: 56, background: 'rgba(255,255,255,.2)', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: GOLD, animation: 'scrollLine 2s ease-in-out infinite' }} />
            </div>
          </div>
        </section>

        {/* WHY JOIN US */}
        <section className="pad" style={{ padding: '96px 72px', borderBottom: `1px solid ${t.border}` }}>
          <FadeIn>
            <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 12, fontWeight: 600 }}>— Why Join Us —</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: t.ink, marginBottom: 52, lineHeight: 1.1 }}>A place where great design lives</h2>
          </FadeIn>
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {values.map((v, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="val-card" style={{ borderColor: t.border, background: t.surface }}>
                  <div style={{ fontSize: 32, marginBottom: 16 }}>{v.icon}</div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 500, color: t.ink, marginBottom: 10 }}>{v.title}</h3>
                  <p style={{ fontSize: 13.5, color: t.muted, lineHeight: 1.8 }}>{v.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>



        {/* STATS */}
        <div style={{ background: t.subtle, padding: '56px 72px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 80, flexWrap: 'wrap', maxWidth: 800, margin: '0 auto' }}>
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.4rem,3.8vw,3.4rem)', color: GOLD, fontWeight: 400, lineHeight: 1, marginBottom: 8 }}>{s.value}</div>
                <div style={{ fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: t.muted, fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* JOB OPENINGS */}
        <section id="openings" className="pad" style={{ padding: '96px 72px', background: t.subtle, borderBottom: `1px solid ${t.border}` }}>
          <FadeIn>
            <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 12, fontWeight: 600 }}>— Current Openings —</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: t.ink, marginBottom: 52, lineHeight: 1.1 }}>Open Positions</h2>
          </FadeIn>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {openings.map((job, i) => (
              <FadeIn key={job.id} delay={i * 0.06}>
                <div className={`job-card${selected?.id === job.id ? ' selected' : ''}`} style={{ borderColor: selected?.id === job.id ? GOLD : t.border, background: t.surface, padding: '14px 20px' }} onClick={() => applyFor(job)}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.15rem', fontWeight: 500, color: t.ink }}>{job.title}</h3>
                    <button onClick={(e) => { e.stopPropagation(); applyFor(job) }} style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', background: selected?.id === job.id ? GOLD : 'none', border: `1.5px solid ${selected?.id === job.id ? GOLD : t.border}`, color: selected?.id === job.id ? '#fff' : t.muted, padding: '8px 18px', cursor: 'pointer', borderRadius: 6, transition: 'all .25s', flexShrink: 0 }} onMouseEnter={e => { if (selected?.id !== job.id) { (e.currentTarget as HTMLElement).style.borderColor = GOLD; (e.currentTarget as HTMLElement).style.color = GOLD } }} onMouseLeave={e => { if (selected?.id !== job.id) { (e.currentTarget as HTMLElement).style.borderColor = t.border; (e.currentTarget as HTMLElement).style.color = t.muted } }}>
                      {selected?.id === job.id ? '✓ Selected' : 'Apply Now'}
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* APPLICATION FORM */}
        <section id="apply-form" className="pad" style={{ padding: '96px 72px', borderBottom: `1px solid ${t.border}` }}>
          <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 80, alignItems: 'start' }}>

            {/* LEFT */}
            <FadeIn>
              <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 12, fontWeight: 600 }}>— Apply Now —</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: t.ink, marginBottom: 24, lineHeight: 1.1 }}>Start your journey with us</h2>
              <p style={{ fontSize: 15, color: t.muted, lineHeight: 1.9, marginBottom: 36 }}>
                Select a position from above and fill in your details. We review every application and respond within 5 working days.
              </p>
              {selected && (
                <div style={{ background: `${GOLD}10`, border: `1.5px solid ${GOLD}40`, borderRadius: 10, padding: '20px 24px' }}>
                  <div style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: GOLD, fontWeight: 700, marginBottom: 6 }}>Applying for</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 500, color: t.ink }}>{selected.title}</div>
                  <div style={{ fontSize: 13, color: t.muted, marginTop: 4 }}>{selected.location} · {selected.type}</div>
                </div>
              )}
              <div style={{ marginTop: 36, marginBottom: pc.sideImage ? 36 : 0 }}>
                {[['📧', contactEmail], ['📞', contactPhone], ['🕐', contactHours]].filter(([, text]) => text).map(([icon, text]) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, fontSize: 14, color: t.muted }}>
                    <span>{icon}</span><span>{text}</span>
                  </div>
                ))}
              </div>
              {/* Fully CMS-driven — no hardcoded fallback. Renders only once an image */}
              {/* is uploaded + published in Strapi's Careers Page > sideImage field. */}
              {pc.sideImage && (
                <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', aspectRatio: '4 / 5', border: `1px solid ${t.border}` }}>
                  <img src={pc.sideImage} alt="Life at The Prospective Interiors" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </FadeIn>

            {/* RIGHT — FORM */}
            <FadeIn delay={0.15}>
              <div style={{ background: t.surface, borderRadius: 16, padding: '48px 44px', border: `1px solid ${t.border}`, boxShadow: dark ? 'none' : '0 8px 48px rgba(26,24,20,.06)' }}>
                {status === 'success' ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', animation: 'fadeUp .5s ease' }}>
                    <div style={{ width: 72, height: 72, borderRadius: 36, background: `${GOLD}18`, border: `2px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', fontSize: 28 }}>✓</div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 400, color: t.ink, marginBottom: 14 }}>Application Received!</h3>
                    <p style={{ fontSize: 15, color: t.muted, lineHeight: 1.85, marginBottom: 36 }}>Thank you for your interest. We will review your application and get back to you within 5 working days.</p>
                    <button onClick={() => setStatus('idle')} style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', background: 'none', border: `1.5px solid ${t.border}`, color: t.muted, padding: '11px 28px', cursor: 'pointer', borderRadius: 8 }}>Apply for Another Position</button>
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: 32 }}>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 400, color: t.ink, marginBottom: 6 }}>Your Application</h3>
                      <p style={{ fontSize: 14, color: t.muted }}>Fill in your details and we will be in touch.</p>
                    </div>
                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>

                      {/* Name + Email */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div>
                          <label style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: GOLD, display: 'block', marginBottom: 10, fontWeight: 700 }}>Full Name *</label>
                          <input name="name" value={form.name} onChange={ch} placeholder="Your full name" required onFocus={() => setFoc('name')} onBlur={() => setFoc(null)} style={{ ...inp, borderBottomColor: foc === 'name' ? GOLD : t.border }} />
                        </div>
                        <div>
                          <label style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: GOLD, display: 'block', marginBottom: 10, fontWeight: 700 }}>Email *</label>
                          <input name="email" type="email" value={form.email} onChange={ch} placeholder="your@email.com" required onFocus={() => setFoc('email')} onBlur={() => setFoc(null)} style={{ ...inp, borderBottomColor: foc === 'email' ? GOLD : t.border }} />
                        </div>
                      </div>

                      {/* Phone + Experience */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div>
                          <label style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: GOLD, display: 'block', marginBottom: 10, fontWeight: 700 }}>Phone</label>
                          <input name="phone" value={form.phone} onChange={ch} placeholder="+91 XXXXX XXXXX" onFocus={() => setFoc('phone')} onBlur={() => setFoc(null)} style={{ ...inp, borderBottomColor: foc === 'phone' ? GOLD : t.border }} />
                        </div>
                        <div>
                          <label style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: GOLD, display: 'block', marginBottom: 10, fontWeight: 700 }}>Years of Experience</label>
                          <input name="experience" value={form.experience} onChange={ch} placeholder="e.g. 3 years" onFocus={() => setFoc('experience')} onBlur={() => setFoc(null)} style={{ ...inp, borderBottomColor: foc === 'experience' ? GOLD : t.border }} />
                        </div>
                      </div>

                      {/* Position */}
                      <div>
                        <label style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: GOLD, display: 'block', marginBottom: 10, fontWeight: 700 }}>Position *</label>
                        <select name="position" value={form.position} onChange={ch} required style={{ ...inp, borderBottomColor: foc === 'position' ? GOLD : t.border, cursor: 'pointer' }} onFocus={() => setFoc('position')} onBlur={() => setFoc(null)}>
                          <option value="">Select a position</option>
                          {openings.map(j => <option key={j.id} value={j.title}>{j.title}</option>)}
                          <option value="Other">Other / General Application</option>
                        </select>
                      </div>

                      {/* About yourself */}
                      <div>
                        <label style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: GOLD, display: 'block', marginBottom: 10, fontWeight: 700 }}>About Yourself *</label>
                        <textarea name="message" value={form.message} onChange={ch} placeholder="Tell us about your experience, skills, and why you want to join The Prospective Interiors..." required rows={5} onFocus={() => setFoc('message')} onBlur={() => setFoc(null)} style={{ ...inp, resize: 'vertical', minHeight: 120, borderBottomColor: foc === 'message' ? GOLD : t.border }} />
                      </div>

                      {/* Portfolio Upload */}
                      <div>
                        <label style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: GOLD, display: 'block', marginBottom: 10, fontWeight: 700 }}>Portfolio / Resume</label>
                        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.zip,.jpg,.png" onChange={handleFile} style={{ display: 'none' }} />
                        <button type="button" className="upload-btn" style={{ borderColor: fileName ? GOLD : t.border, color: fileName ? GOLD : t.muted }} onClick={() => fileRef.current?.click()}>
                          <span style={{ fontSize: 18 }}>{fileName ? '📎' : '⬆️'}</span>
                          <span>{fileName || 'Upload Portfolio / Resume'}</span>
                        </button>
                        <p style={{ fontSize: 12, color: t.muted, marginTop: 8 }}>PDF, DOC, ZIP, JPG accepted · Max 10MB</p>
                      </div>

                      {err && <p style={{ fontSize: 13, color: '#c45a3a', fontWeight: 600 }}>{err}</p>}

                      <button type="submit" className="submit-btn" disabled={status === 'loading'}>
                        {status === 'loading' ? 'Submitting...' : 'Submit Application →'}
                      </button>

                      <p style={{ fontSize: 12, color: t.muted, textAlign: 'center', lineHeight: 1.7 }}>
                        We review every application and respond within 5 working days
                      </p>
                    </form>
                  </>
                )}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* CTA */}
        {(pc.ctaImage || pc.ctaHeading) && (
          <section style={{ position: 'relative', height: '50vh', minHeight: 320, overflow: 'hidden' }}>
            {pc.ctaImage && <img src={pc.ctaImage} alt="Studio" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,12,10,.65)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 56px' }}>
              <FadeIn>
                {pc.ctaHeading && (
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 400, color: '#f0ebe3', lineHeight: 1.1, marginBottom: 28, maxWidth: 540 }}>
                    {pc.ctaHeading}
                  </h2>
                )}
                {contactEmail && (
                  <a href={`mailto:${contactEmail}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 700, background: GOLD, color: '#fff', padding: '13px 32px', borderRadius: 6, textDecoration: 'none' }}>
                    {contactEmail} →
                  </a>
                )}
              </FadeIn>
            </div>
          </section>
        )}

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