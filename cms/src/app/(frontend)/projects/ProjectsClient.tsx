'use client'

import React, { useState, useMemo, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface Project {
  id: string; title: string; slug: string; client: string
  location: string; year: number | null; sector: string
  featured: boolean; description: string; heroImage: string
  gallery: string[]; area: string
}

const SECTORS = ['All','Hospitality','Healthcare','Retail','Residential','Industrial','Commercial','Civic']
const PER_PAGE = 9

const FALLBACK: Record<string,string> = {
  Hospitality: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=85',
  Healthcare:  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=900&q=85',
  Retail:      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=900&q=85',
  Residential: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=85',
  Industrial:  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=85',
  Commercial:  'https://images.unsplash.com/photo-1577412647305-991150c7d163?w=900&q=85',
  Civic:       'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=900&q=85',
  default:     'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=900&q=85',
}

const GALLERY_FALLBACKS: Record<string, string[]> = {
  Hospitality: [
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80',
    'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=80',
  ],
  Healthcare: [
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
    'https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=800&q=80',
    'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80',
  ],
  Retail: [
    'https://images.unsplash.com/photo-1567958451986-2de427a4a0be?w=800&q=80',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  ],
  Residential: [
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80',
    'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&q=80',
    'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&q=80',
  ],
  Industrial: [
    'https://images.unsplash.com/photo-1497366754035-f200581374c7?w=800&q=80',
    'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&q=80',
    'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80',
  ],
  Commercial: [
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    'https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=800&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
    'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80',
  ],
}

const getImg   = (p: Project) => p.heroImage || FALLBACK[p.sector] || FALLBACK.default
const getGallery = (p: Project) => {
  const imgs = p.gallery?.filter(Boolean) ?? []
  if (imgs.length > 0) return imgs
  return GALLERY_FALLBACKS[p.sector] ?? GALLERY_FALLBACKS.default
}

const DESCRIPTIONS: Record<string, string> = {
  Hospitality: 'A vibrant dining destination blending contemporary aesthetics with warm hospitality. The design integrates local materials, curated lighting, and fluid spatial planning to create an inviting ambiance that celebrates the spirit of the brand.',
  Healthcare:  'A patient-centric environment designed to reduce anxiety through calming palettes, intuitive wayfinding, and biophilic elements. The interiors balance clinical precision with warmth, ensuring comfort for patients and efficiency for staff.',
  Retail:      'A bold retail environment crafted to maximize brand impact and customer dwell time. Strategic display zoning, immersive lighting design, and tactile material choices create a compelling shopping experience.',
  Residential: 'A thoughtfully curated home interior that balances functionality with refined aesthetics. Every room is designed around the lifestyle of its inhabitants, blending comfort, elegance, and personal expression.',
  Industrial:  'A modern workspace designed to foster collaboration and focus. The layout integrates open collaboration zones, quiet focus areas, and brand touchpoints that reflect the company\'s culture and values.',
  Commercial:  'A landmark commercial interior that embodies corporate sophistication. Premium finishes, efficient spatial planning, and strong visual identity create an environment that impresses clients and inspires teams.',
  Civic:       'A public institution reimagined with civic pride and inclusivity at its core. The design prioritizes accessibility, durability, and a welcoming atmosphere that serves the community effectively.',
}

/* ── SVG LOGO ICON ────────────────────────────────────────── */
function TPILogo({ accent }: { accent: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="28" height="28" rx="6" fill={accent}/>
      <rect x="6" y="8" width="16" height="2" rx="1" fill="white"/>
      <rect x="11" y="8" width="2" height="12" rx="1" fill="white"/>
      <rect x="6" y="17" width="7" height="2" rx="1" fill="white" opacity="0.6"/>
      <rect x="16" y="13" width="6" height="2" rx="1" fill="white" opacity="0.8"/>
      <rect x="16" y="17" width="4" height="2" rx="1" fill="white" opacity="0.6"/>
    </svg>
  )
}

/* ══════════════════════════════════════════════════════════════
   PROJECT DETAIL MODAL
══════════════════════════════════════════════════════════════ */
function ProjectModal({
  project, onClose, dark,
}: { project: Project; onClose: () => void; dark: boolean }) {
  const [activeImg, setActiveImg] = useState(0)
  const [imgHovered, setImgHovered] = useState<number|null>(null)

  const D       = dark
  const ink     = D ? '#f0ede8' : '#0f0e0d'
  const paper   = D ? '#111010' : '#faf8f4'
  const surface = D ? '#1a1917' : '#ffffff'
  const accent  = D ? '#d4924e' : '#b5763a'
  const muted   = D ? '#7a756f' : '#6b6560'
  const border  = D ? '#2a2825' : '#e8e4de'

  const allImgs = [getImg(project), ...getGallery(project)]
  const desc    = project.description || DESCRIPTIONS[project.sector] || DESCRIPTIONS.Hospitality

  // close on escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const prev = () => setActiveImg(i => (i - 1 + allImgs.length) % allImgs.length)
  const next = () => setActiveImg(i => (i + 1) % allImgs.length)

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position:'fixed', inset:0, zIndex:500,
        background:'rgba(0,0,0,.72)',
        backdropFilter:'blur(6px)',
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:'20px',
        animation:'modalBgIn .25s ease',
      }}
    >
      <style>{`
        @keyframes modalBgIn { from{opacity:0} to{opacity:1} }
        @keyframes modalIn { from{opacity:0;transform:translateY(24px) scale(.97)} to{opacity:1;transform:none} }
        .modal-thumb { transition: transform .2s ease, border-color .2s ease; cursor: pointer; }
        .modal-thumb:hover { transform: scale(1.04); }
        .modal-arrow { transition: background .18s, transform .18s; }
        .modal-arrow:hover { background: rgba(255,255,255,.25) !important; transform: scale(1.08); }
      `}</style>

      <div style={{
        background: surface,
        borderRadius:14, overflow:'hidden',
        width:'100%', maxWidth:920,
        maxHeight:'90vh', display:'flex', flexDirection:'column',
        animation:'modalIn .3s cubic-bezier(.4,0,.2,1)',
        border:`1px solid ${border}`,
      }}>

        {/* ── MODAL HEADER ─────────────────────────────────── */}
        <div style={{
          padding:'16px 24px',
          borderBottom:`1px solid ${border}`,
          display:'flex', alignItems:'center', justifyContent:'space-between',
          background: surface, flexShrink:0,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{
              fontFamily:"'DM Mono',monospace", fontSize:8,
              letterSpacing:'.16em', textTransform:'uppercase',
              color:accent, border:`1px solid ${accent}44`,
              padding:'3px 9px', borderRadius:2,
            }}>{project.sector}</div>
            <h2 style={{
              fontFamily:"'DM Serif Display',serif",
              fontSize:'1.2rem', color:ink, lineHeight:1.2,
            }}>{project.title}</h2>
          </div>
          <button onClick={onClose} style={{
            width:32, height:32, borderRadius:16,
            border:`1px solid ${border}`, background:'transparent',
            color:muted, fontSize:18, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            flexShrink:0,
          }}>✕</button>
        </div>

        {/* ── SCROLLABLE BODY ──────────────────────────────── */}
        <div style={{ overflow:'auto', flex:1 }}>

          {/* Hero image with nav arrows */}
          <div style={{ position:'relative', height:380, background:'#000', flexShrink:0 }}>
            <img
              src={allImgs[activeImg]}
              alt={project.title}
              style={{
                width:'100%', height:'100%', objectFit:'cover',
                display:'block', opacity:.92,
                transition:'opacity .3s',
              }}
            />
            {/* image counter */}
            <div style={{
              position:'absolute', bottom:14, right:16,
              background:'rgba(0,0,0,.6)', color:'#fff',
              fontFamily:"'DM Mono',monospace", fontSize:11,
              padding:'4px 10px', borderRadius:4,
              letterSpacing:'.06em',
            }}>{activeImg + 1} / {allImgs.length}</div>

            {/* arrows */}
            {allImgs.length > 1 && (
              <>
                <button className="modal-arrow" onClick={prev} style={{
                  position:'absolute', left:14, top:'50%', transform:'translateY(-50%)',
                  width:40, height:40, borderRadius:20,
                  background:'rgba(0,0,0,.45)', border:'1px solid rgba(255,255,255,.2)',
                  color:'#fff', fontSize:20, cursor:'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>‹</button>
                <button className="modal-arrow" onClick={next} style={{
                  position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
                  width:40, height:40, borderRadius:20,
                  background:'rgba(0,0,0,.45)', border:'1px solid rgba(255,255,255,.2)',
                  color:'#fff', fontSize:20, cursor:'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>›</button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {allImgs.length > 1 && (
            <div style={{
              display:'flex', gap:8, padding:'14px 24px',
              overflowX:'auto', background: D ? '#141312' : '#f4f0ea',
              borderBottom:`1px solid ${border}`,
            }}>
              {allImgs.map((src, i) => (
                <div
                  key={i}
                  className="modal-thumb"
                  onClick={() => setActiveImg(i)}
                  style={{
                    width:72, height:52, borderRadius:6,
                    overflow:'hidden', flexShrink:0,
                    border:`2px solid ${i === activeImg ? accent : 'transparent'}`,
                    opacity: i === activeImg ? 1 : .65,
                  }}
                >
                  <img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>
                </div>
              ))}
            </div>
          )}

          {/* Content: description + meta */}
          <div style={{ padding:'28px 24px 32px', display:'grid', gridTemplateColumns:'1fr auto', gap:32, alignItems:'start' }}>

            {/* Left: description */}
            <div>
              <p style={{
                fontFamily:"'DM Mono',monospace", fontSize:9,
                letterSpacing:'.16em', textTransform:'uppercase',
                color:accent, marginBottom:12,
              }}>About This Project</p>
              <p style={{
                fontSize:14, color:muted, lineHeight:1.8,
                maxWidth:520,
              }}>{desc}</p>
            </div>

            {/* Right: meta card */}
            <div style={{
              background: D ? '#141312' : '#f8f5f0',
              border:`1px solid ${border}`,
              borderRadius:10, padding:'18px 20px',
              minWidth:200, flexShrink:0,
            }}>
              {([
                ['📍','Location', project.location || 'India'],
                ['📅','Year',     project.year],
                ['👤','Client',   project.client],
                ['🏗','Sector',   project.sector],
                ['📐','Area',     project.area],
              ] as [string,string,any][]).map(([icon,label,val]) => val ? (
                <div key={label} style={{
                  display:'flex', alignItems:'flex-start', gap:10,
                  paddingBottom:12, marginBottom:12,
                  borderBottom:`1px solid ${border}`,
                }}>
                  <span style={{ fontSize:14, flexShrink:0, marginTop:1 }}>{icon}</span>
                  <div>
                    <div style={{
                      fontFamily:"'DM Mono',monospace", fontSize:9,
                      letterSpacing:'.12em', textTransform:'uppercase',
                      color:muted, marginBottom:2,
                    }}>{label}</div>
                    <div style={{ fontSize:13, color:ink, fontWeight:500 }}>{val}</div>
                  </div>
                </div>
              ) : null)}
            </div>
          </div>

          {/* Gallery grid */}
          <div style={{ padding:'0 24px 32px' }}>
            <p style={{
              fontFamily:"'DM Mono',monospace", fontSize:9,
              letterSpacing:'.16em', textTransform:'uppercase',
              color:accent, marginBottom:14,
            }}>Gallery</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              {allImgs.map((src, i) => (
                <div
                  key={i}
                  className="modal-thumb"
                  onClick={() => { setActiveImg(i); window.scrollTo({top:0}) }}
                  style={{
                    height:120, borderRadius:8, overflow:'hidden',
                    border:`2px solid ${i === activeImg ? accent : 'transparent'}`,
                  }}
                >
                  <img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const [dark, setDark]           = useState(false)
  const [filter, setFilter]       = useState('All')
  const [page, setPage]           = useState(1)
  const [compareMode, setCompare] = useState(false)
  const [selected, setSelected]   = useState<string[]>([])
  const [panelOpen, setPanel]     = useState(false)
  const [hovered, setHovered]     = useState<string|null>(null)
  const [mounted, setMounted]     = useState(false)
  const [openProject, setOpen]    = useState<Project|null>(null)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('tpi-theme')
    if (saved === 'dark') setDark(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('tpi-theme', dark ? 'dark' : 'light')
  }, [dark, mounted])

  useEffect(() => {
    if (selected.length === 2) setPanel(true)
    else setPanel(false)
  }, [selected])

  const filtered = useMemo(() => {
    if (filter === 'All') return projects
    return projects.filter(p => p.sector?.toLowerCase() === filter.toLowerCase())
  }, [projects, filter])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const pageItems  = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE)

  const changeFilter = (s: string) => { setFilter(s); setPage(1); setSelected([]); setPanel(false) }
  const toggleSelect = (id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= 2)  return [prev[1], id]
      return [...prev, id]
    })
  }
  const exitCompare = () => { setCompare(false); setSelected([]); setPanel(false) }

  const compareProjects = selected.map(id => projects.find(p => p.id === id)).filter(Boolean) as Project[]

  const D       = dark
  const ink     = D ? '#f0ede8' : '#0f0e0d'
  const paper   = D ? '#0e0d0c' : '#faf8f4'
  const surface = D ? '#1a1917' : '#ffffff'
  const accent  = D ? '#d4924e' : '#b5763a'
  const muted   = D ? '#7a756f' : '#6b6560'
  const border  = D ? '#2a2825' : '#e8e4de'

  const handleCardClick = useCallback((p: Project) => {
    if (compareMode) { toggleSelect(p.id); return }
    setOpen(p)
  }, [compareMode, selected])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box }
        html, body { font-family:'DM Sans',sans-serif; }

        .tpi-pill { transition: all .16s ease; cursor:pointer; }
        .tpi-pill:hover { border-color: ${accent} !important; color: ${accent} !important; }

        .tpi-card { transition: transform .26s cubic-bezier(.4,0,.2,1), box-shadow .26s ease, border-color .22s ease; cursor:pointer; }
        .tpi-card:hover { transform: translateY(-5px); }
        .tpi-card .c-img img { transition: transform .5s cubic-bezier(.4,0,.2,1); }
        .tpi-card:hover .c-img img { transform: scale(1.07); }
        .tpi-card .c-overlay { transition: opacity .24s ease; opacity:0; }
        .tpi-card:hover .c-overlay { opacity:1; }

        .tpi-theme-btn { transition: all .2s ease; }
        .tpi-theme-btn:hover { transform: rotate(18deg) scale(1.12); }

        .tpi-compare-panel { animation: cpSlideUp .32s cubic-bezier(.4,0,.2,1) forwards; }
        @keyframes cpSlideUp { from{transform:translateY(100%);opacity:0} to{transform:none;opacity:1} }

        .tpi-card-in { animation: cIn .38s ease both; }
        @keyframes cIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }

        .tpi-nav-a:hover { color: ${accent} !important; }
        .tpi-pg:hover:not(:disabled) { border-color:${accent} !important; color:${accent} !important; }

        @media(max-width:900px){ .tpi-grid{grid-template-columns:repeat(2,1fr)!important} }
        @media(max-width:600px){
          .tpi-grid{grid-template-columns:1fr!important}
          .tpi-nav,.tpi-main{padding-left:18px!important;padding-right:18px!important}
          .tpi-cp-inner{flex-direction:column!important}
          .tpi-footer{padding:36px 18px 24px!important}
          .modal-content-grid{grid-template-columns:1fr!important}
          .modal-gallery-grid{grid-template-columns:repeat(2,1fr)!important}
        }
      `}</style>

      <div style={{ minHeight:'100vh', background:paper, color:ink, transition:'background .32s, color .32s', fontSize:14 }}>

        {/* ══ NAV ═══════════════════════════════════════════ */}
        <nav className="tpi-nav" style={{
          position:'sticky', top:0, zIndex:100,
          background: D ? 'rgba(14,13,12,.95)' : 'rgba(255,255,255,.96)',
          borderBottom:`1px solid ${border}`,
          height:58, display:'flex', alignItems:'center',
          padding:'0 52px', gap:28,
          backdropFilter:'blur(14px)',
          transition:'background .32s, border-color .32s',
        }}>
          {/* LOGO */}
          <Link href="/" style={{ textDecoration:'none', flexShrink:0, display:'flex', alignItems:'center', gap:9 }}>
            <TPILogo accent={accent}/>
            <div style={{ lineHeight:1.15 }}>
              <div style={{
                fontFamily:"'DM Serif Display',serif",
                fontSize:'.9rem', color:ink, fontWeight:400,
              }}>The Prospective</div>
              <div style={{
                fontFamily:"'DM Mono',monospace",
                fontSize:'6.5px', letterSpacing:'.2em',
                textTransform:'uppercase', color:accent,
              }}>Interiors</div>
            </div>
          </Link>

          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:22 }}>
            {([['/', 'Home'],['/projects','Projects'],['/about','About'],['/contact','Contact']] as [string,string][]).map(([href,label]) => (
              <Link key={href} href={href} className="tpi-nav-a" style={{
                fontSize:12.5, fontWeight:500, textDecoration:'none',
                color: href==='/projects' ? ink : muted,
                borderBottom: href==='/projects' ? `2px solid ${accent}` : '2px solid transparent',
                paddingBottom:2, transition:'color .2s', letterSpacing:'.01em',
              }}>{label}</Link>
            ))}
            <button
              className="tpi-theme-btn"
              onClick={() => setDark(!dark)}
              aria-label="Toggle theme"
              style={{
                width:36, height:36, borderRadius:18,
                border:`1.5px solid ${border}`,
                background: D ? '#2a2825' : '#f0ede8',
                cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:16,
              }}
            >{D ? '☀️' : '🌙'}</button>
          </div>
        </nav>

        {/* ══ BREADCRUMB ════════════════════════════════════ */}
        <div style={{
          padding:'10px 52px',
          fontFamily:"'DM Mono',monospace", fontSize:10.5,
          color:muted, letterSpacing:'.05em',
          borderBottom:`1px solid ${border}`,
          display:'flex', alignItems:'center', gap:8,
        }}>
          <Link href="/" style={{ color:muted, textDecoration:'none' }}>Home</Link>
          <span style={{ color:border }}>/</span>
          <span style={{ color:accent }}>Projects</span>
        </div>

        {/* ══ HEADER ════════════════════════════════════════ */}
        <div className="tpi-main" style={{
          padding:'36px 52px 0',
          display:'flex', alignItems:'flex-end',
          justifyContent:'space-between', gap:12,
        }}>
          <div>
            <p style={{
              fontFamily:"'DM Mono',monospace", fontSize:9,
              letterSpacing:'.18em', textTransform:'uppercase',
              color:accent, marginBottom:8,
            }}>02 — Our Work</p>
            <h1 style={{
              fontFamily:"'DM Serif Display',serif",
              fontSize:'2.1rem', lineHeight:1.1, color:ink,
            }}>Projects</h1>
          </div>
          <div style={{ textAlign:'right', flexShrink:0 }}>
            <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:'2rem', color:accent, lineHeight:1 }}>{filtered.length}</div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8.5, letterSpacing:'.14em', textTransform:'uppercase', color:muted, marginTop:3 }}>Shown</div>
          </div>
        </div>

        {/* ══ FILTERS ═══════════════════════════════════════ */}
        <div className="tpi-main" style={{
          padding:'22px 52px 0',
          display:'flex', alignItems:'center',
          flexWrap:'wrap', gap:8,
        }}>
          {SECTORS.map(s => {
            const active = filter === s
            return (
              <button key={s} className="tpi-pill"
                onClick={() => changeFilter(s)}
                style={{
                  padding:'6px 16px',
                  border:`1.5px solid ${active ? ink : border}`,
                  borderRadius:100, fontSize:11.5, fontWeight:500,
                  fontFamily:"'DM Sans',sans-serif",
                  background: active ? ink : 'transparent',
                  color: active ? paper : muted,
                  whiteSpace:'nowrap',
                }}
              >{s}</button>
            )
          })}

          <button
            onClick={() => { setCompare(!compareMode); if(compareMode) exitCompare() }}
            style={{
              marginLeft:'auto', padding:'6px 18px',
              border:`1.5px solid ${compareMode ? accent : border}`,
              borderRadius:6, fontSize:11, fontWeight:500,
              fontFamily:"'DM Mono',monospace",
              letterSpacing:'.07em', textTransform:'uppercase',
              background: compareMode ? accent : 'transparent',
              color: compareMode ? '#fff' : muted,
              cursor:'pointer', flexShrink:0, transition:'all .2s',
              display:'flex', alignItems:'center', gap:7,
            }}
          >
            <span style={{ fontSize:14 }}>⊞</span>
            Compare{compareMode && selected.length > 0 ? ` (${selected.length}/2)` : ''}
          </button>
        </div>

        {/* compare hint */}
        {compareMode && (
          <div style={{
            margin:'12px 52px 0',
            background: D ? '#1c190f' : '#fef9f2',
            border:`1px solid ${accent}55`, borderRadius:7,
            padding:'10px 16px', display:'flex', alignItems:'center', gap:10, fontSize:12.5, color:accent,
          }}>
            <span>🔍</span>
            <span style={{ flex:1 }}>
              {selected.length === 0 && 'Click any 2 cards to compare side by side'}
              {selected.length === 1 && <><strong>1 of 2</strong> — click one more</>}
              {selected.length === 2 && <><strong>2 selected!</strong> See comparison below ↓</>}
            </span>
            {selected.length > 0 && (
              <button onClick={()=>setSelected([])} style={{ background:'none', border:`1px solid ${accent}77`, borderRadius:4, color:accent, padding:'2px 10px', fontSize:10.5, cursor:'pointer' }}>Clear</button>
            )}
            <button onClick={exitCompare} style={{ background:'none', border:'none', color:muted, fontSize:17, cursor:'pointer', lineHeight:1 }}>✕</button>
          </div>
        )}

        {/* ══ GRID ══════════════════════════════════════════ */}
        <div className="tpi-main" style={{ padding:'28px 52px 64px' }}>
          {pageItems.length === 0 ? (
            <div style={{ textAlign:'center', padding:'72px 20px', color:muted }}>
              <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:'1.3rem', color:ink, marginBottom:8 }}>No projects found</div>
              <p style={{ fontSize:13 }}>Try a different filter or add more projects in Payload CMS.</p>
            </div>
          ) : (
            <div className="tpi-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:22 }}>
              {pageItems.map((p, i) => {
                const isSel = selected.includes(p.id)
                const isHov = hovered === p.id
                return (
                  <article
                    key={p.id}
                    className="tpi-card tpi-card-in"
                    style={{
                      background: surface, borderRadius:9, overflow:'hidden',
                      border: isSel
                        ? `2px solid ${accent}`
                        : `1px solid ${isHov ? accent+'77' : border}`,
                      boxShadow: isHov
                        ? `0 14px 44px rgba(0,0,0,${D?'.5':'.1'})`
                        : `0 2px 6px rgba(0,0,0,${D?'.25':'.04'})`,
                      position:'relative',
                      animationDelay:`${i * 0.045}s`,
                      animationFillMode:'both',
                    }}
                    onMouseEnter={() => setHovered(p.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => handleCardClick(p)}
                  >
                    {/* image */}
                    <div className="c-img" style={{ height:204, overflow:'hidden', background:border, position:'relative' }}>
                      <img src={getImg(p)} alt={p.title} loading="lazy"
                        style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>

                      {/* overlay */}
                      <div className="c-overlay" style={{
                        position:'absolute', inset:0,
                        background:'linear-gradient(to top,rgba(0,0,0,.74) 0%,rgba(0,0,0,.08) 55%,transparent 100%)',
                        display:'flex', alignItems:'flex-end', padding:'14px 16px',
                      }}>
                        <span style={{
                          color:'#fff', fontSize:10.5,
                          fontFamily:"'DM Mono',monospace",
                          letterSpacing:'.1em', textTransform:'uppercase',
                        }}>
                          {compareMode ? (isSel ? '✓ Selected' : '+ Select') : 'View Project →'}
                        </span>
                      </div>

                      {p.featured && (
                        <div style={{
                          position:'absolute', top:10, left:10,
                          background:accent, color:'#fff',
                          fontFamily:"'DM Mono',monospace",
                          fontSize:7.5, letterSpacing:'.12em', textTransform:'uppercase',
                          padding:'3px 8px', borderRadius:2,
                        }}>Featured</div>
                      )}
                      {compareMode && isSel && (
                        <div style={{
                          position:'absolute', top:10, right:10,
                          width:27, height:27, borderRadius:14,
                          background:accent, color:'#fff',
                          display:'flex', alignItems:'center', justifyContent:'center',
                          fontSize:14, fontWeight:700,
                        }}>✓</div>
                      )}
                      {compareMode && !isSel && selected.length === 2 && (
                        <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.42)' }}/>
                      )}
                    </div>

                    {/* body */}
                    <div style={{ padding:'14px 16px 18px' }}>
                      <div style={{
                        display:'inline-block',
                        fontFamily:"'DM Mono',monospace", fontSize:8.5,
                        letterSpacing:'.14em', textTransform:'uppercase',
                        color:accent, border:`1px solid ${accent}44`,
                        borderRadius:2, padding:'2px 7px', marginBottom:9,
                      }}>{p.sector || 'Design'}</div>

                      <h3 style={{
                        fontFamily:"'DM Serif Display',serif",
                        fontSize:'1rem', color:ink, marginBottom:7, lineHeight:1.3,
                      }}>{p.title}</h3>

                      <div style={{
                        display:'flex', alignItems:'center', flexWrap:'wrap', gap:5,
                        fontFamily:"'DM Mono',monospace", fontSize:10, color:muted,
                      }}>
                        {p.location && <span>📍 {p.location}</span>}
                        {p.location && p.year && <span style={{ width:3, height:3, borderRadius:'50%', background:border, display:'inline-block' }}/>}
                        {p.year && <span>📅 {p.year}</span>}
                      </div>
                      {p.client && (
                        <div style={{ fontSize:11.5, color: D?'#5a5550':'#9a9490', marginTop:5, fontStyle:'italic' }}>{p.client}</div>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          {/* pagination */}
          {totalPages > 1 && (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, paddingTop:40 }}>
              <button className="tpi-pg" onClick={()=>setPage(p=>p-1)} disabled={page===1}
                style={{ padding:'7px 16px', border:`1px solid ${border}`, borderRadius:6, background:'transparent', color:muted, fontSize:12.5, cursor:page===1?'not-allowed':'pointer', opacity:page===1?.4:1 }}>‹ Prev</button>
              {Array.from({length:totalPages},(_,i)=>i+1).map(n=>(
                <button key={n} className="tpi-pg" onClick={()=>setPage(n)}
                  style={{ width:34, height:34, border:`1px solid ${n===page?ink:border}`, borderRadius:6, fontSize:12.5, cursor:'pointer', background:n===page?ink:'transparent', color:n===page?paper:muted }}>
                  {n}
                </button>
              ))}
              <button className="tpi-pg" onClick={()=>setPage(p=>p+1)} disabled={page===totalPages}
                style={{ padding:'7px 16px', border:`1px solid ${border}`, borderRadius:6, background:'transparent', color:muted, fontSize:12.5, cursor:page===totalPages?'not-allowed':'pointer', opacity:page===totalPages?.4:1 }}>Next ›</button>
            </div>
          )}
        </div>

        {/* ══ COMPARE PANEL ═════════════════════════════════ */}
        {panelOpen && compareProjects.length === 2 && (
          <div className="tpi-compare-panel" style={{
            position:'fixed', bottom:0, left:0, right:0,
            background: D ? '#0f0e0d' : '#fff',
            borderTop:`2px solid ${ink}`,
            zIndex:200, padding:'18px 52px 24px',
            boxShadow:`0 -10px 50px rgba(0,0,0,${D?'.6':'.13'})`,
          }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8.5, letterSpacing:'.18em', textTransform:'uppercase', color:accent }}>Comparing Projects</span>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={()=>setSelected([])} style={{ fontSize:10.5, padding:'4px 12px', border:`1px solid ${border}`, borderRadius:4, background:'transparent', color:muted, cursor:'pointer' }}>Clear</button>
                <button onClick={exitCompare} style={{ fontSize:10.5, padding:'4px 12px', border:`1px solid ${border}`, borderRadius:4, background:'transparent', color:muted, cursor:'pointer' }}>Exit</button>
                <button onClick={()=>setPanel(false)} style={{ width:26, height:26, borderRadius:13, border:`1px solid ${border}`, background:'transparent', color:muted, fontSize:15, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
              </div>
            </div>

            <div className="tpi-cp-inner" style={{ display:'flex', gap:18 }}>
              {compareProjects.map((p, i) => (
                <React.Fragment key={p.id}>
                  {i===1 && (
                    <div style={{ display:'flex', alignItems:'center', flexShrink:0, fontFamily:"'DM Serif Display',serif", fontSize:'1.6rem', color:accent, padding:'0 4px' }}>vs</div>
                  )}
                  <div style={{
                    flex:1, display:'flex', gap:0,
                    background: D?'#1a1917':'#f8f5f0',
                    border:`1px solid ${border}`, borderRadius:9, overflow:'hidden', minHeight:130,
                  }}>
                    <div style={{ width:130, flexShrink:0 }}>
                      <img src={getImg(p)} alt={p.title} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>
                    </div>
                    <div style={{ padding:'12px 14px', flex:1 }}>
                      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:7.5, letterSpacing:'.14em', textTransform:'uppercase', color:accent, border:`1px solid ${accent}44`, display:'inline-block', padding:'2px 6px', borderRadius:2, marginBottom:6 }}>{p.sector}</div>
                      <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:'.95rem', color:ink, marginBottom:8, lineHeight:1.3 }}>{p.title}</div>
                      {([['📍','Location',p.location],['📅','Year',p.year],['👤','Client',p.client],['📐','Area',p.area]] as [string,string,any][]).map(([icon,label,val])=>val?(
                        <div key={label} style={{ display:'flex', gap:7, marginBottom:4, fontSize:11.5, alignItems:'center' }}>
                          <span>{icon}</span>
                          <span style={{ color:muted, width:50, flexShrink:0, fontFamily:"'DM Mono',monospace", fontSize:9.5 }}>{label}</span>
                          <span style={{ color:ink, fontWeight:500 }}>{val}</span>
                        </div>
                      ):null)}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* ══ FOOTER ════════════════════════════════════════ */}
        <footer className="tpi-footer" style={{
          background: D?'#0a0908':'#0f0e0d', color:'#f0ede8',
          padding:'48px 52px 32px',
          marginBottom: panelOpen ? 210 : 0, transition:'margin .32s ease',
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:40 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <TPILogo accent="#b5763a"/>
              <div>
                <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:'1.1rem', marginBottom:3 }}>The Prospective Interiors</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8, letterSpacing:'.18em', textTransform:'uppercase', color:'#b5763a' }}>Est. 2004 · Pune, Maharashtra</div>
              </div>
            </div>
            <div style={{ display:'flex', gap:28 }}>
              {([['/', 'Home'],['/projects','Projects'],['/about','About'],['/contact','Contact']] as [string,string][]).map(([href,label])=>(
                <Link key={href} href={href} style={{ fontSize:12.5, color:'#8a857f', textDecoration:'none' }}>{label}</Link>
              ))}
            </div>
          </div>
          <div style={{ borderTop:'1px solid #1e1c19', paddingTop:20, display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontSize:11.5, color:'#5a5752' }}>© 2026 The Prospective Interiors · All rights reserved</span>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8.5, letterSpacing:'.12em', textTransform:'uppercase', color:'#2e2c28' }}>Designed by Prashant Bhandiya</span>
          </div>
        </footer>
      </div>

      {/* ══ PROJECT DETAIL MODAL ══════════════════════════ */}
      {openProject && (
        <ProjectModal
          project={openProject}
          onClose={() => setOpen(null)}
          dark={dark}
        />
      )}
    </>
  )
}

