'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const GOLD = '#D8C3A5'
const GOLD_HOVER = '#E4CCAA'
const DARK = '#111315'

const PROJECT_TYPES = ['Residential', 'Commercial', 'Hospitality', 'Retail', 'Healthcare', 'Industrial', 'Civic', 'Other']

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

interface ContactPageContent {
  heroLabel?: string
  heroHeading?: string
  heroImage?: string
  phone?: string
  email?: string
  whatsappNumber?: string
  studioLabel?: string
  studioHeading?: string
  studioText?: string
  studioAddress?: string
  studioHours?: string
  studioImage?: string
  studioImageCaption?: string
}

export default function ContactClient({ pageContent, logoUrl, logoAlt }: { pageContent?: ContactPageContent; logoUrl?: string; logoAlt?: string } = {}) {
  const pc = pageContent || {}
  
  const heroLabel = pc.heroLabel || ''
  const heroHeading = pc.heroHeading || ''
  const heroImgSrc = pc.heroImage || ''
  const phone = pc.phone || ''
  const email = pc.email || ''
  const whatsappNumber = pc.whatsappNumber || ''
  const studioLabel = pc.studioLabel || ''
  const studioHeading = pc.studioHeading || ''
  const studioText = pc.studioText || ''
  const studioAddress = pc.studioAddress || ''
  const studioHours = pc.studioHours || ''
  const studioImgSrc = pc.studioImage || ''
  const studioImageCaption = pc.studioImageCaption || ''

  const dark = false
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', projectType: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [err, setErr] = useState('')
  const [foc, setFoc] = useState<string | null>(null)

  // Dark mode removed — site is light-only for now.
  useEffect(() => {
    setMounted(true)
    // Always start in the premium dark theme regardless of any previously saved preference.
  }, [])

  const ch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setErr('Please enter your name'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setErr('Please enter a valid email'); return }
    if (!form.projectType) { setErr('Please select a project type'); return }
    if (!form.message.trim()) { setErr('Please tell us about your project'); return }
    setErr(''); setStatus('loading')
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to submit')
    } catch {}
    setStatus('success')
    setForm({ name: '', email: '', phone: '', projectType: '', message: '' })
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
        .img-hover{overflow:hidden;border-radius:10px}.img-hover img{transition:transform .8s ease;width:100%;height:100%;object-fit:cover;display:block}.img-hover:hover img{transform:scale(1.05)}
        .hero-chip:hover{border-color:${GOLD}!important;background:rgba(216,195,165,.16)!important}
        .hero-img{filter:contrast(1.03) saturate(1.04)}
        .btn-gold{display:inline-flex;align-items:center;gap:8px;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;background:${GOLD};color:${DARK};padding:13px 32px;border-radius:6px;border:1px solid ${GOLD};cursor:pointer;transition:opacity .25s,transform .22s,background .25s;text-decoration:none;letter-spacing:.03em}.btn-gold:hover{background:${GOLD_HOVER};border-color:${GOLD_HOVER};transform:translateY(-2px)}
        .ft-link{font-size:13px;color:inherit;opacity:.5;transition:color .2s,opacity .2s;text-decoration:none}.ft-link:hover{opacity:1;color:${GOLD}}
        .submit-btn{width:100%;padding:16px;background:${GOLD};color:#fff;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border-radius:8px;transition:opacity .25s,transform .2s}
        .submit-btn:hover:not(:disabled){opacity:.88;transform:translateY(-1px)}
        .submit-btn:disabled{opacity:.5;cursor:not-allowed}
        .info-row{display:flex;gap:16px;align-items:flex-start;padding:18px 0;border-bottom:1px solid rgba(255,255,255,.1)}
        .info-row:last-child{border-bottom:none}
        @media(max-width:900px){.two-col{grid-template-columns:1fr!important}.ft-g{grid-template-columns:1fr 1fr!important}}
        @media(max-width:600px){.ft-g{grid-template-columns:1fr!important}.pad{padding-left:24px!important;padding-right:24px!important}.hl-grid{grid-template-columns:1fr!important}}
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
                <Link key={href} href={href} className="nav-a" style={{ color: href === '/contact' ? GOLD : t.muted, fontSize: 13 }}>{label}</Link>
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
            <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} style={{ color: href === '/contact' ? GOLD : t.ink }}>{label}</Link>
          ))}
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="btn-gold" style={{ marginTop: 16, textAlign: 'center', padding: '14px 20px', fontSize: 13 }}>Get in Touch</Link>
        </nav>

        {/* HERO */}
        <section style={{ position: 'relative', height: '62vh', minHeight: 460, maxHeight: 680, overflow: 'hidden', background: DARK }}>
          {heroImgSrc && <img src={heroImgSrc} alt="The Prospective Interiors Studio" className="hero-img" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 35%' }} />}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,12,10,.2) 0%, rgba(15,12,10,.12) 40%, rgba(15,12,10,.55) 78%, rgba(15,12,10,.9) 100%)' }} />
          <div className="pad" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 72px 64px', animation: 'fadeUp 1s ease .1s both' }}>
            <p style={{ fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 18, fontWeight: 600 }}>{heroLabel}</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 'clamp(2.2rem,3.8vw,3.6rem)', fontWeight: 400, color: '#fff', lineHeight: 1.2, maxWidth: 680, textShadow: '0 2px 20px rgba(0,0,0,.5)' }}>
              {heroHeading}
            </h1>
            <div style={{ width: 44, height: 2, background: GOLD, marginTop: 24, marginBottom: 4 }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 24 }}>
              {[
                phone ? ['📞', phone, `tel:${phone.replace(/\s/g, '')}`] : null,
                email ? ['✉️', email, `mailto:${email}`] : null,
                whatsappNumber ? ['💬', 'Chat on WhatsApp', `https://wa.me/${whatsappNumber}`] : null,
              ].filter((x): x is [string, string, string] => x !== null).map(([icon, label, href]) => (
                <a key={label} href={href} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'rgba(255,255,255,.92)', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.22)', borderRadius: 100, padding: '9px 18px', textDecoration: 'none', backdropFilter: 'blur(6px)', transition: 'border-color .2s,background .2s' }}
                  className="hero-chip">
                  <span style={{ fontSize: 13 }}>{icon}</span>{label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FORM + INFO */}
        <section className="pad" style={{ padding: '96px 72px', maxWidth: 1240, margin: '0 auto' }}>
          <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 64, alignItems: 'start' }}>

            {/* LEFT — Studio info + accent image */}
            <FadeIn>
              <p style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 16, fontWeight: 600 }}>{studioLabel}</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: t.ink, lineHeight: 1.2, marginBottom: 28 }}>{studioHeading}</h2>
              <p style={{ fontSize: 15, color: t.muted, lineHeight: 1.9, marginBottom: 36, maxWidth: 420 }}>{studioText}</p>

              <div style={{ background: DARK, borderRadius: 14, padding: '32px 32px 8px', marginBottom: 32 }}>
                {[
                  ['📍', 'Studio Address', studioAddress],
                  ['✉️', 'Email', email],
                  ['📞', 'Phone', phone],
                  ['🕐', 'Studio Hours', studioHours],
                ].filter(([, , val]) => val).map(([icon, label, val]) => (
                  <div key={label} className="info-row">
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
                    <div>
                      <div style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: GOLD, fontWeight: 700, marginBottom: 4 }}>{label}</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,.75)', lineHeight: 1.6 }}>{val}</div>
                    </div>
                  </div>
                ))}
              </div>

              {studioImgSrc && (
                <div className="img-hover" style={{ height: 300, position: 'relative' }}>
                  <img src={studioImgSrc} alt="Studio detail" />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,8,6,.72) 0%, transparent 55%)', display: 'flex', alignItems: 'flex-end', padding: '20px 22px', pointerEvents: 'none' }}>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,.9)', fontWeight: 500, letterSpacing: '.02em' }}>{studioImageCaption}</p>
                  </div>
                </div>
              )}
            </FadeIn>

            {/* RIGHT — FORM */}
            <FadeIn delay={0.15}>
              <div style={{ background: t.surface, borderRadius: 16, padding: '48px 44px', border: `1px solid ${t.border}`, boxShadow: dark ? 'none' : '0 8px 48px rgba(26,24,20,.06)' }}>
                {status === 'success' ? (
                  <div style={{ textAlign: 'center', padding: '48px 0', animation: 'fadeUp .5s ease' }}>
                    <div style={{ width: 72, height: 72, borderRadius: 36, background: `${GOLD}18`, border: `2px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', fontSize: 28, color: GOLD }}>✓</div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 400, color: t.ink, marginBottom: 14 }}>Enquiry Received!</h3>
                    <p style={{ fontSize: 15, color: t.muted, lineHeight: 1.85, marginBottom: 36 }}>Thank you for reaching out. A member of our team will get back to you within one working day.</p>
                    <button onClick={() => setStatus('idle')} style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', background: 'none', border: `1.5px solid ${t.border}`, color: t.muted, padding: '11px 28px', cursor: 'pointer', borderRadius: 8 }}>Send Another Enquiry</button>
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: 32 }}>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 400, color: t.ink, marginBottom: 6 }}>Project Enquiry</h3>
                      <p style={{ fontSize: 14, color: t.muted }}>Fill in your details and we will be in touch.</p>
                    </div>
                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>

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

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div>
                          <label style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: GOLD, display: 'block', marginBottom: 10, fontWeight: 700 }}>Phone</label>
                          <input name="phone" value={form.phone} onChange={ch} placeholder="+91 XXXXX XXXXX" onFocus={() => setFoc('phone')} onBlur={() => setFoc(null)} style={{ ...inp, borderBottomColor: foc === 'phone' ? GOLD : t.border }} />
                        </div>
                        <div>
                          <label style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: GOLD, display: 'block', marginBottom: 10, fontWeight: 700 }}>Project Type *</label>
                          <select name="projectType" value={form.projectType} onChange={ch} required style={{ ...inp, borderBottomColor: foc === 'projectType' ? GOLD : t.border, cursor: 'pointer' }} onFocus={() => setFoc('projectType')} onBlur={() => setFoc(null)}>
                            <option value="">Select a type</option>
                            {PROJECT_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: GOLD, display: 'block', marginBottom: 10, fontWeight: 700 }}>Tell Us About Your Project *</label>
                        <textarea name="message" value={form.message} onChange={ch} placeholder="Share your space, timeline, budget range and any ideas you already have..." required rows={5} onFocus={() => setFoc('message')} onBlur={() => setFoc(null)} style={{ ...inp, borderBottomColor: foc === 'message' ? GOLD : t.border, resize: 'vertical', fontFamily: "'Inter', sans-serif" }} />
                      </div>

                      {err && <p style={{ fontSize: 13, color: '#c45a3a', fontWeight: 600 }}>{err}</p>}

                      <button type="submit" className="submit-btn" disabled={status === 'loading'}>
                        {status === 'loading' ? 'Sending...' : 'Send Enquiry →'}
                      </button>

                      <p style={{ fontSize: 12, color: t.muted, textAlign: 'center', lineHeight: 1.7 }}>
                        We typically respond within one working day
                      </p>
                    </form>
                  </>
                )}
              </div>

              <div className="hl-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 28 }}>
                {[
                  ['⏱️', 'Quick Response', 'Reply within 1 working day'],
                  ['📐', 'Free Consultation', 'First site visit on us'],
                  ['🎨', 'Dedicated Designer', 'One point of contact'],
                ].map(([icon, title, sub]) => (
                  <div key={title} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: '20px 16px', textAlign: 'center' }}>
                    <div style={{ fontSize: 20, marginBottom: 10 }}>{icon}</div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: t.ink, marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 11.5, color: t.muted, lineHeight: 1.5 }}>{sub}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* MAP */}
        {studioAddress && (
          <section style={{ position: 'relative', height: 440, overflow: 'hidden', borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}` }}>
            <iframe
              title="The Prospective Interiors — Studio Location"
              src={`https://www.google.com/maps?q=${encodeURIComponent(studioAddress)}&output=embed`}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, filter: dark ? 'grayscale(.4) invert(.92) contrast(.9)' : 'none' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div style={{ position: 'absolute', top: 24, left: 24, background: t.surface, borderRadius: 10, padding: '16px 22px', boxShadow: '0 8px 32px rgba(0,0,0,.18)', border: `1px solid ${t.border}`, pointerEvents: 'none' }}>
              <div style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: GOLD, fontWeight: 700, marginBottom: 4 }}>The Prospective Interiors</div>
              <div style={{ fontSize: 13, color: t.ink }}>{studioAddress}</div>
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
                {email && <a href={`mailto:${email}`} className="ft-link">{email}</a>}
                {phone && <a href={`tel:${phone.replace(/\s/g, '')}`} className="ft-link">{phone}</a>}
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