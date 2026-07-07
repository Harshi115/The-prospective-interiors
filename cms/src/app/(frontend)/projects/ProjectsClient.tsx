'use client'
import React, { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'

const GOLD = '#b89a6e'
const CREAM = '#f7f4ef'
const DARK = '#1a1814'
const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
interface Project { id:string;title:string;slug:string;client:string;location:string;year:number|null;sector:string;featured:boolean;description:string;heroImage:string;gallery:string[];area:string }

const SECTORS = ['All','Hospitality','Healthcare','Retail','Residential','Industrial','Commercial','Civic','Educational']
const PER = 9

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

export default function ProjectsClient({ projects: initialProjects }: { projects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [dark, setDarkSt] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [sector, setSector] = useState('All')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Project | null>(null)
  const [imgIdx, setImgIdx] = useState(0)
  const [compareList, setCompareList] = useState<Project[]>([])
  const [showCompare, setShowCompare] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [loading, setLoading] = useState(true)

  const setDark = (v: boolean) => { setDarkSt(v); try { localStorage.setItem('tpi-theme', v ? 'dark' : 'light') } catch {} }

  useEffect(() => {
    setMounted(true)
    try { if (localStorage.getItem('tpi-theme') === 'dark') setDarkSt(true) } catch {}

    fetch(`${STRAPI}/api/projects?populate[heroImage]=true&populate[gallery]=true&pagination[limit]=100`)
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
  const allImgs = (p: Project) => [p.heroImage, ...(p.gallery || [])].filter(Boolean)

  useEffect(() => {
    if (!selected) return
    setImgIdx(0)
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
      if (e.key === 'ArrowRight') setImgIdx(i => Math.min(i + 1, allImgs(selected).length - 1))
      if (e.key === 'ArrowLeft') setImgIdx(i => Math.max(i - 1, 0))
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', fn)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', fn) }
  }, [selected?.id])

  useEffect(() => {
    if (!showCompare) return
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowCompare(false) }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', fn)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', fn) }
  }, [showCompare])

  const toggleCompare = (p: Project) => {
    setCompareList(prev => {
      if (prev.find(x => x.id === p.id)) return prev.filter(x => x.id !== p.id)
      if (prev.length >= 2) return [prev[1], p]
      return [...prev, p]
    })
  }
  const inCompare = (p: Project) => compareList.some(x => x.id === p.id)

  if (!mounted) return null

  const t = {
    bg: dark ? '#111009' : CREAM,
    ink: dark ? '#f0ebe3' : DARK,
    muted: dark ? 'rgba(255,255,255,.45)' : '#6a6050',
    border: dark ? 'rgba(255,255,255,.1)' : '#ddd5c5',
    surface: dark ? '#1c1a14' : '#fff',
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
        .tog{width:44px;height:24px;border-radius:12px;cursor:pointer;position:relative;display:flex;align-items:center;padding:3px;transition:background .3s;border:1.5px solid;flex-shrink:0}
        .tok-k{width:16px;height:16px;border-radius:8px;transition:transform .3s}
        .filt{font-family:'Inter',sans-serif;font-size:12px;font-weight:500;background:none;border:1.5px solid;padding:7px 16px;cursor:pointer;border-radius:100px;transition:all .22s}
        .filt:hover{border-color:${GOLD}!important;color:${GOLD}!important}
        .filt.on{border-color:${GOLD}!important;background:${GOLD}!important;color:#fff!important}
        .proj-card{border-radius:10px;overflow:hidden;cursor:pointer;transition:transform .4s,box-shadow .4s}
        .proj-card:hover{transform:translateY(-6px);box-shadow:0 20px 56px rgba(0,0,0,.13)}
        .proj-img{overflow:hidden;position:relative}
        .proj-img img{transition:transform .8s ease;width:100%;height:100%;object-fit:cover;display:block}
        .proj-card:hover .proj-img img{transform:scale(1.06)}
        .cmp-chk{position:absolute;top:12px;right:12px;z-index:10;width:30px;height:30px;border-radius:15px;background:rgba(26,24,20,.65);border:1.5px solid rgba(255,255,255,.4);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .22s;backdrop-filter:blur(4px)}
        .cmp-chk.on{background:${GOLD};border-color:${GOLD}}
        .lb-arr{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);width:48px;height:48px;border-radius:24px;cursor:pointer;color:#fff;font-size:24px;display:flex;align-items:center;justify-content:center;transition:background .2s;flex-shrink:0}
        .lb-arr:hover{background:rgba(255,255,255,.2)}
        .btn-gold{display:inline-flex;align-items:center;gap:8px;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;background:${GOLD};color:#fff;padding:12px 28px;border-radius:6px;border:none;cursor:pointer;transition:opacity .25s,transform .22s;text-decoration:none}.btn-gold:hover{opacity:.88;transform:translateY(-2px)}
        .ft-link{font-size:13px;color:rgba(255,255,255,.4);transition:color .2s;text-decoration:none}.ft-link:hover{color:${GOLD}}
        @media(max-width:900px){.pgrid{grid-template-columns:1fr 1fr!important}.ft-g{grid-template-columns:1fr 1fr!important}}
        @media(max-width:600px){.pgrid{grid-template-columns:1fr!important}.pad{padding-left:24px!important;padding-right:24px!important}.ft-g{grid-template-columns:1fr!important}}
      `}</style>

      <div style={{ minHeight: '100vh', background: t.bg, color: t.ink, transition: 'background .4s,color .4s' }}>

        {/* NAV */}
        <nav style={{ position: 'sticky', top: 0, zIndex: 200, height: 68, display: 'flex', alignItems: 'center', padding: '0 56px', gap: 36, background: dark ? 'rgba(17,16,9,.97)' : 'rgba(247,244,239,.97)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${t.border}` }}>
          <Link href="/"><Logo onDark={dark} /></Link>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 32 }}>
            {([['/', 'Home'],['/projects','Projects'],['/about','About'],['/contact','Contact']] as [string,string][]).map(([href,label]) => (
              <Link key={href} href={href} className="nav-a" style={{ color: href === '/projects' ? GOLD : t.muted }}>{label}</Link>
            ))}
            <button className="tog" onClick={() => setDark(!dark)} style={{ background: dark ? GOLD : '#ddd5c5', borderColor: dark ? GOLD : '#ccc4b4' }} aria-label="Toggle theme">
              <div className="tok-k" style={{ background: dark ? DARK : '#fff', transform: dark ? 'translateX(20px)' : 'none' }} />
            </button>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ position: 'relative', height: '44vh', minHeight: 280, overflow: 'hidden', background: DARK }}>
          <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&q=95" alt="Projects" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: .6 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,12,10,.65)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 72px 52px' }}>
            <p style={{ fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: GOLD, marginBottom: 14, fontWeight: 600, textShadow: '0 2px 8px rgba(0,0,0,.5)' }}>— Our Portfolio —</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.6rem,5vw,4.8rem)', fontWeight: 400, color: '#fff', lineHeight: 1.05, textShadow: '0 2px 20px rgba(0,0,0,.6)' }}>
              {projects.length > 0 ? `${projects.length} Projects · 8 Sectors` : 'Our Work'}
            </h1>
          </div>
        </section>

        {/* FILTERS */}
        <div className="pad" style={{ padding: '24px 72px', borderBottom: `1px solid ${t.border}`, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', background: t.bg, position: 'sticky', top: 68, zIndex: 100, backdropFilter: 'blur(16px)' }}>
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
            <button onClick={() => setCompareMode(v => !v)} style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, background: compareMode ? GOLD : 'none', border: `1.5px solid ${compareMode ? GOLD : t.border}`, color: compareMode ? '#fff' : t.muted, padding: '7px 16px', cursor: 'pointer', borderRadius: 100, transition: 'all .25s' }}>
              {compareMode ? '✓ Comparing' : '⊞ Compare'}
            </button>
          </div>
        </div>

        {compareMode && (
          <div style={{ background: `${GOLD}15`, borderBottom: `1px solid ${GOLD}30`, padding: '10px 72px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 13, color: GOLD, fontWeight: 500 }}>Select 2 projects · {compareList.length}/2</span>
            {compareList.length === 2 && <button className="btn-gold" style={{ padding: '7px 18px', fontSize: 12 }} onClick={() => setShowCompare(true)}>Compare →</button>}
            {compareList.length > 0 && <button onClick={() => setCompareList([])} style={{ fontSize: 12, background: 'none', border: 'none', color: t.muted, cursor: 'pointer' }}>Clear</button>}
          </div>
        )}

        {/* GRID */}
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
            <div className="pgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
              {paginated.map((p, i) => (
                <FadeIn key={p.id} delay={Math.min((i % 9) * 0.06, 0.36)}>
                  <div style={{ position: 'relative' }}>
                    <div className="proj-card" style={{ background: t.surface }} onClick={() => { if (!compareMode) setSelected(p) }}>
                      <div className="proj-img" style={{ height: 240 }}>
                        {p.heroImage
                          ? <img src={p.heroImage} alt={p.title} loading="lazy" />
                          : <div style={{ height: '100%', background: dark ? '#2a2820' : '#e8e0d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '3rem', color: GOLD, opacity: .4 }}>{p.title.charAt(0)}</span></div>
                        }
                        {compareMode && (
                          <button className={`cmp-chk${inCompare(p) ? ' on' : ''}`} onClick={e => { e.stopPropagation(); toggleCompare(p) }}>
                            {inCompare(p) ? <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>✓</span> : <span style={{ color: 'rgba(255,255,255,.7)', fontSize: 18 }}>+</span>}
                          </button>
                        )}
                      </div>
                      <div style={{ padding: '18px 20px 22px', background: t.surface }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: GOLD }}>{p.sector}</span>
                          {p.year && <><span style={{ color: t.border }}>·</span><span style={{ fontSize: 11, color: t.muted }}>{p.year}</span></>}
                          {p.area && <><span style={{ color: t.border }}>·</span><span style={{ fontSize: 11, color: t.muted }}>{p.area}</span></>}
                        </div>
                        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', fontWeight: 500, color: t.ink, marginBottom: 6, lineHeight: 1.25 }}>{p.title}</h3>
                        {p.location && <p style={{ fontSize: 12, color: t.muted, marginBottom: 8 }}>📍 {p.location}</p>}
                        {p.description && <p style={{ fontSize: 13, color: t.muted, lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</p>}
                        <div style={{ marginTop: 12, fontSize: 12, fontWeight: 600, color: GOLD }}>View Project →</div>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}
          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: 48 }}>
              <button style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, background: 'none', border: `1.5px solid ${t.border}`, color: t.muted, padding: '12px 40px', cursor: 'pointer', borderRadius: 100 }} onClick={() => setPage(p => p + 1)}>Load More</button>
            </div>
          )}
        </section>

        {/* LIGHTBOX */}
        {selected && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(15,14,10,.97)', display: 'flex', flexDirection: 'column', animation: 'fadeUp .25s ease' }}>
            <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 40px', borderBottom: '1px solid rgba(255,255,255,.08)', flexShrink: 0 }}>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.5)', cursor: 'pointer', fontSize: 14, padding: 0 }}>← Back</button>
              <Link href={`/projects/${selected.slug}`} style={{ marginLeft: 'auto', fontSize: 13, color: GOLD, borderBottom: `1px solid ${GOLD}40`, paddingBottom: 2 }}>Full Page →</Link>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '0 60px' }}>
              {allImgs(selected)[imgIdx] && <img src={allImgs(selected)[imgIdx]} alt={selected.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }} />}
              {allImgs(selected).length > 1 && <>
                <button className="lb-arr" onClick={() => setImgIdx(i => Math.max(i-1,0))} style={{ position: 'absolute', left: 16, opacity: imgIdx===0?.3:1 }}>‹</button>
                <button className="lb-arr" onClick={() => setImgIdx(i => Math.min(i+1,allImgs(selected).length-1))} style={{ position: 'absolute', right: 16, opacity: imgIdx===allImgs(selected).length-1?.3:1 }}>›</button>
                <div style={{ position: 'absolute', top: 16, right: 72, fontSize: 12, color: 'rgba(255,255,255,.35)' }}>{imgIdx+1} / {allImgs(selected).length}</div>
              </>}
            </div>
            <div style={{ padding: '16px 40px', borderTop: '1px solid rgba(255,255,255,.07)', display: 'flex', alignItems: 'center', gap: 40, flexShrink: 0, flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: GOLD, display: 'block', marginBottom: 4 }}>{selected.sector}</span>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', fontWeight: 400, color: '#f0ebe3' }}>{selected.title}</h3>
              </div>
              {selected.location && <div><div style={{ fontSize: 10, color: 'rgba(255,255,255,.28)', letterSpacing: '.12em', marginBottom: 3 }}>LOCATION</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)' }}>{selected.location}</div></div>}
              {selected.year && <div><div style={{ fontSize: 10, color: 'rgba(255,255,255,.28)', letterSpacing: '.12em', marginBottom: 3 }}>YEAR</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)' }}>{selected.year}</div></div>}
              {selected.client && <div><div style={{ fontSize: 10, color: 'rgba(255,255,255,.28)', letterSpacing: '.12em', marginBottom: 3 }}>CLIENT</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)' }}>{selected.client}</div></div>}
              {selected.area && <div><div style={{ fontSize: 10, color: 'rgba(255,255,255,.28)', letterSpacing: '.12em', marginBottom: 3 }}>AREA</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)' }}>{selected.area}</div></div>}
            </div>
            {allImgs(selected).length > 1 && (
              <div style={{ display: 'flex', gap: 6, padding: '8px 40px 16px', overflowX: 'auto', flexShrink: 0, borderTop: '1px solid rgba(255,255,255,.05)' }}>
                {allImgs(selected).map((src, i) => (
                  <div key={i} onClick={() => setImgIdx(i)} style={{ width: 60, height: 44, flexShrink: 0, borderRadius: 4, overflow: 'hidden', cursor: 'pointer', border: `2px solid ${i===imgIdx?GOLD:'transparent'}`, opacity: i===imgIdx?1:.4, transition: 'all .2s' }}>
                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* COMPARE MODAL */}
        {showCompare && compareList.length === 2 && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(15,14,10,.97)', display: 'flex', flexDirection: 'column', animation: 'fadeUp .25s ease' }}>
            <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 40px', borderBottom: '1px solid rgba(255,255,255,.08)', flexShrink: 0 }}>
              <button onClick={() => setShowCompare(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.5)', cursor: 'pointer', fontSize: 14, padding: 0 }}>← Back</button>
              <div style={{ margin: '0 auto', fontSize: 13, letterSpacing: '.16em', textTransform: 'uppercase', color: GOLD, fontWeight: 500 }}>Project Comparison</div>
              <button onClick={() => { setCompareList([]); setShowCompare(false); setCompareMode(false) }} style={{ fontSize: 12, background: 'none', border: '1px solid rgba(255,255,255,.2)', color: 'rgba(255,255,255,.5)', padding: '6px 16px', cursor: 'pointer', borderRadius: 100 }}>Clear</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '42vh', minHeight: 260 }}>
                {compareList.map(p => (
                  <div key={p.id} style={{ position: 'relative', overflow: 'hidden' }}>
                    {p.heroImage ? <img src={p.heroImage} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : <div style={{ width: '100%', height: '100%', background: '#2a2820' }} />}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,14,10,.92) 0%, transparent 50%)' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 28px' }}>
                      <span style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: GOLD, display: 'block', marginBottom: 6 }}>{p.sector}</span>
                      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.6rem', fontWeight: 400, color: '#fff', lineHeight: 1.15 }}>{p.title}</h2>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr', padding: '40px', gap: 0, maxWidth: 900, margin: '0 auto' }}>
                {[{label:'Client',key:'client'},{label:'Location',key:'location'},{label:'Year',key:'year'},{label:'Sector',key:'sector'},{label:'Area',key:'area'},{label:'Description',key:'description'}].map(({label,key}) => (
                  <React.Fragment key={key}>
                    <div style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: GOLD, padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,.07)', paddingRight: 20, fontWeight: 600 }}>{label}</div>
                    {compareList.map(p => (
                      <div key={p.id} style={{ fontSize: 14, color: 'rgba(255,255,255,.65)', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,.07)', lineHeight: 1.6, borderLeft: '1px solid rgba(255,255,255,.04)' }}>{String((p as any)[key]||'—')}</div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr', padding: '20px 40px 56px', maxWidth: 900, margin: '0 auto' }}>
                <div />
                {compareList.map(p => (
                  <div key={p.id} style={{ padding: '0 20px' }}>
                    <Link href={`/projects/${p.slug}`} style={{ fontSize: 13, color: GOLD, borderBottom: `1px solid ${GOLD}40`, paddingBottom: 2 }}>View Full Project →</Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer style={{ background: dark ? '#0a0908' : DARK, color: '#f0ebe3', padding: '72px 72px 48px' }}>
          <div className="ft-g" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr', gap: 48, marginBottom: 56 }}>
            <div><Logo onDark /><p style={{ fontSize: 13, color: 'rgba(255,255,255,.3)', lineHeight: 1.85, maxWidth: 300, marginTop: 20 }}>A multi-disciplinary interior design firm creating meaningful spaces across India since 2004.</p></div>
            {[
              {t:'Navigate',items:[['/', 'Home'],['/projects','Projects'],['/about','About'],['/contact','Contact']] as [string,string][]},
              {t:'Studio',items:[['#','101, Design House'],['#','Baner Road, Pune'],['#','Maharashtra 411045']] as [string,string][]},
              {t:'Connect',items:[['mailto:info@prospectiveinteriors.com','info@prospectiveinteriors.com'],['tel:+919876543210','+91 98765 43210']] as [string,string][]},
            ].map(col => (
              <div key={col.t}>
                <div style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.28)', marginBottom: 20, fontWeight: 700 }}>{col.t}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{col.items.map(([href,label]) => <a key={label} href={href} className="ft-link">{label}</a>)}</div>
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
