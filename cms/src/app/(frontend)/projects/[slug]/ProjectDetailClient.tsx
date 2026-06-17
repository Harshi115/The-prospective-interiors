'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface Project {
  id: string; title: string; slug: string; client: string
  location: string; year: number|null; sector: string
  area: string; featured: boolean; description: string
  heroImage: string; gallery: string[]
}
interface RelatedProject {
  id: string; title: string; slug: string
  location: string; year: number|null; sector: string; heroImage: string
}

function Logo({ a }:{ a:string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="6" fill={a}/>
      <rect x="6" y="8" width="16" height="2" rx="1" fill="white"/>
      <rect x="11" y="8" width="2" height="12" rx="1" fill="white"/>
      <rect x="6" y="17" width="7" height="2" rx="1" fill="white" opacity=".6"/>
      <rect x="16" y="13" width="6" height="2" rx="1" fill="white" opacity=".8"/>
      <rect x="16" y="17" width="4" height="2" rx="1" fill="white" opacity=".6"/>
    </svg>
  )
}

// Only hero fallback — no gallery fallback, CMS only
const FALLBACK: Record<string,string> = {
  Hospitality: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&q=90',
  Healthcare:  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1400&q=90',
  Retail:      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1400&q=90',
  Residential: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=90',
  Industrial:  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=90',
  Commercial:  'https://images.unsplash.com/photo-1577412647305-991150c7d163?w=1400&q=90',
  Civic:       'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1400&q=90',
  default:     'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1400&q=90',
}
const getHero   = (p: Project)        => p.heroImage || FALLBACK[p.sector] || FALLBACK.default
const getRelImg = (p: RelatedProject) => p.heroImage || FALLBACK[p.sector] || FALLBACK.default

export default function ProjectDetailClient({ project, related }: { project: Project; related: RelatedProject[] }) {
  const [dark, setDark]         = useState(false)
  const [mounted, setMounted]   = useState(false)
  const [activeImg, setActiveImg] = useState(0)
  const [lightbox, setLightbox] = useState<number|null>(null)
  const [hovRel, setHovRel]     = useState<string|null>(null)

  // All images — hero + gallery from CMS only
  const gallery  = (project.gallery || []).filter(Boolean)
  const allImgs  = gallery.length > 0 ? [getHero(project), ...gallery] : [getHero(project)]

  useEffect(() => {
    setMounted(true)
    const s = localStorage.getItem('tpi-theme')
    if (s === 'dark') setDark(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('tpi-theme', dark ? 'dark' : 'light')
  }, [dark, mounted])

  // Lightbox keyboard nav
  useEffect(() => {
    if (lightbox === null) return
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') setLightbox(i => i !== null ? Math.min(i+1, allImgs.length-1) : 0)
      if (e.key === 'ArrowLeft')  setLightbox(i => i !== null ? Math.max(i-1, 0) : 0)
    }
    window.addEventListener('keydown', fn)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', fn); document.body.style.overflow = '' }
  }, [lightbox, allImgs.length])

  const D       = dark
  const ink     = D ? '#f0ede8' : '#0f0e0d'
  const paper   = D ? '#0e0d0c' : '#faf8f4'
  const surface = D ? '#1a1917' : '#ffffff'
  const accent  = D ? '#d4924e' : '#b5763a'
  const muted   = D ? '#7a756f' : '#6b6560'
  const border  = D ? '#2a2825' : '#e8e4de'
  const NAV:[string,string][] = [['/', 'Home'],['/projects','Projects'],['/about','About'],['/contact','Contact']]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        html,body{font-family:'DM Sans',sans-serif;font-size:14px;line-height:1.7}

        .dna{transition:color .2s}.dna:hover{color:${accent}!important}
        .dthm{transition:all .2s}.dthm:hover{transform:rotate(18deg) scale(1.1)}

        .dthumb{transition:all .2s;cursor:pointer}
        .dthumb:hover{opacity:1!important;transform:scale(1.04)}

        .darrow{transition:background .18s,transform .18s}
        .darrow:hover{background:rgba(255,255,255,.28)!important;transform:scale(1.08)}

        .drel-card{transition:transform .25s ease,border-color .25s,box-shadow .25s;cursor:pointer;text-decoration:none;color:inherit;display:block}
        .drel-card:hover{transform:translateY(-5px)}
        .drel-card .dri img{transition:transform .45s ease}
        .drel-card:hover .dri img{transform:scale(1.06)}
        .drel-card .drov{transition:opacity .24s;opacity:0}
        .drel-card:hover .drov{opacity:1}

        .dgal-img{transition:transform .35s ease,box-shadow .25s;cursor:pointer;overflow:hidden;border-radius:8px}
        .dgal-img:hover img{transform:scale(1.05)}
        .dgal-img:hover{box-shadow:0 8px 28px rgba(0,0,0,${D?'.5':'.12'})}

        .dfade{animation:dFade .5s ease both}
        @keyframes dFade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}

        @media(max-width:900px){.ddet-grid{grid-template-columns:1fr!important}.dgal-grid{grid-template-columns:repeat(2,1fr)!important}.drel-grid{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:600px){
          .ddet-grid{grid-template-columns:1fr!important}
          .dgal-grid{grid-template-columns:1fr!important}
          .drel-grid{grid-template-columns:1fr!important}
          .dnav,.dsec{padding-left:20px!important;padding-right:20px!important}
          .dftg{grid-template-columns:1fr!important;gap:28px!important}
        }
      `}</style>

      <div style={{minHeight:'100vh',background:paper,color:ink,transition:'background .32s,color .32s'}}>

        {/* ══ NAV ══ */}
        <nav className="dnav" style={{position:'sticky',top:0,zIndex:100,background:D?'rgba(14,13,12,.95)':'rgba(255,255,255,.96)',borderBottom:`1px solid ${border}`,height:60,display:'flex',alignItems:'center',padding:'0 56px',gap:28,backdropFilter:'blur(14px)',transition:'background .32s'}}>
          <Link href="/" style={{textDecoration:'none',flexShrink:0,display:'flex',alignItems:'center',gap:9}}>
            <Logo a={accent}/>
            <div style={{lineHeight:1.15}}>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:'.88rem',color:ink}}>The Prospective</div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:'6.5px',letterSpacing:'.2em',textTransform:'uppercase',color:accent}}>Interiors</div>
            </div>
          </Link>
          <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:22}}>
            {NAV.map(([href,label])=>(
              <Link key={href} href={href} className="dna" style={{fontSize:12.5,fontWeight:500,textDecoration:'none',color:muted,borderBottom:'2px solid transparent',paddingBottom:2}}>{label}</Link>
            ))}
            <button className="dthm" onClick={()=>setDark(!dark)} style={{width:36,height:36,borderRadius:18,border:`1.5px solid ${border}`,background:D?'#2a2825':'#f0ede8',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15}}>
              {D?'☀️':'🌙'}
            </button>
          </div>
        </nav>

        {/* ══ BREADCRUMB ══ */}
        <div style={{padding:'10px 56px',fontFamily:"'DM Mono',monospace",fontSize:10.5,color:muted,letterSpacing:'.05em',borderBottom:`1px solid ${border}`,display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
          <Link href="/" style={{color:muted,textDecoration:'none'}}>Home</Link>
          <span style={{color:border}}>/</span>
          <Link href="/projects" style={{color:muted,textDecoration:'none'}}>Projects</Link>
          <span style={{color:border}}>/</span>
          <span style={{color:accent}}>{project.title}</span>
        </div>

        {/* ══ HERO IMAGE — full width, large ══ */}
        <div style={{position:'relative',height:'70vh',minHeight:480,overflow:'hidden',background:'#0a0908'}}>
          <img
            src={allImgs[activeImg]}
            alt={project.title}
            style={{width:'100%',height:'100%',objectFit:'cover',display:'block',opacity:.88,transition:'opacity .4s'}}
          />
          {/* Dark gradient overlay */}
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,.1) 0%,rgba(0,0,0,.15) 40%,rgba(0,0,0,.72) 100%)'}}/>

          {/* Project title overlay on hero */}
          <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'40px 56px'}}>
            <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
              <div>
                <span style={{display:'inline-block',fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.16em',textTransform:'uppercase',color:'rgba(255,255,255,.8)',background:accent,padding:'4px 12px',borderRadius:2,marginBottom:14}}>
                  {project.sector}
                </span>
                <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:'2.8rem',lineHeight:1.1,color:'#fff',fontWeight:400,maxWidth:700}}>
                  {project.title}
                </h1>
              </div>
              <div style={{display:'flex',gap:24,flexWrap:'wrap'}}>
                {project.location && <div style={{textAlign:'right'}}>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(255,255,255,.5)',marginBottom:3}}>Location</div>
                  <div style={{fontSize:13.5,color:'#fff',fontWeight:500}}>📍 {project.location}</div>
                </div>}
                {project.year && <div style={{textAlign:'right'}}>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(255,255,255,.5)',marginBottom:3}}>Year</div>
                  <div style={{fontSize:13.5,color:'#fff',fontWeight:500}}>📅 {project.year}</div>
                </div>}
              </div>
            </div>
          </div>

          {/* Image counter */}
          {allImgs.length > 1 && (
            <div style={{position:'absolute',top:20,right:56,background:'rgba(0,0,0,.55)',color:'#fff',fontFamily:"'DM Mono',monospace",fontSize:11,padding:'5px 12px',borderRadius:4,backdropFilter:'blur(4px)'}}>
              {activeImg+1} / {allImgs.length}
            </div>
          )}

          {/* Arrows */}
          {allImgs.length > 1 && <>
            <button className="darrow" onClick={()=>setActiveImg(i=>(i-1+allImgs.length)%allImgs.length)}
              style={{position:'absolute',left:20,top:'50%',transform:'translateY(-50%)',width:46,height:46,borderRadius:23,background:'rgba(0,0,0,.45)',border:'1px solid rgba(255,255,255,.2)',color:'#fff',fontSize:24,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>‹</button>
            <button className="darrow" onClick={()=>setActiveImg(i=>(i+1)%allImgs.length)}
              style={{position:'absolute',right:20,top:'50%',transform:'translateY(-50%)',width:46,height:46,borderRadius:23,background:'rgba(0,0,0,.45)',border:'1px solid rgba(255,255,255,.2)',color:'#fff',fontSize:24,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>›</button>
          </>}

          {/* Fullscreen button */}
          <button onClick={()=>setLightbox(activeImg)}
            style={{position:'absolute',bottom:40,right:56,background:'rgba(0,0,0,.5)',border:'1px solid rgba(255,255,255,.25)',color:'#fff',padding:'7px 16px',borderRadius:5,fontSize:11,cursor:'pointer',fontFamily:"'DM Mono',monospace",letterSpacing:'.06em',backdropFilter:'blur(4px)'}}>
            ⛶ Fullscreen
          </button>
        </div>

        {/* ══ THUMBNAIL STRIP — CMS gallery only ══ */}
        {allImgs.length > 1 && (
          <div style={{display:'flex',gap:8,padding:'14px 56px',overflowX:'auto',background:D?'#141312':'#f0ede8',borderBottom:`1px solid ${border}`}}>
            {allImgs.map((src,i)=>(
              <div key={i} className="dthumb" onClick={()=>setActiveImg(i)}
                style={{width:88,height:62,borderRadius:6,overflow:'hidden',flexShrink:0,border:`2px solid ${i===activeImg?accent:'transparent'}`,opacity:i===activeImg?1:.5,transition:'all .2s'}}>
                <img src={src} alt="" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
              </div>
            ))}
          </div>
        )}

        {/* ══ MAIN CONTENT ══ */}
        <div className="dsec" style={{padding:'52px 56px'}}>
          <div className="ddet-grid" style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:52,alignItems:'start'}}>

            {/* LEFT — Description (rich text from CMS) */}
            <div className="dfade">
              <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.18em',textTransform:'uppercase',color:accent,marginBottom:14}}>About This Project</p>

              {project.description ? (
                <div style={{fontSize:15,color:muted,lineHeight:1.9}}>
                  {project.description.split('\n\n').map((para,i)=>(
                    <p key={i} style={{marginBottom:20,color: i===0 ? ink : muted,fontSize: i===0 ? 15.5 : 14.5,fontWeight: i===0 ? 400 : 300}}>{para}</p>
                  ))}
                </div>
              ) : (
                <p style={{fontSize:15,color:muted,lineHeight:1.9}}>
                  A beautifully designed {project.sector?.toLowerCase()} space by The Prospective Interiors, crafted with attention to detail, premium materials, and a deep understanding of how people experience space.
                </p>
              )}

              {/* Tags */}
              <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:28}}>
                {[project.sector, project.location?.split(',')[1]?.trim(), project.year?.toString()].filter(Boolean).map((tag,i)=>(
                  <span key={i} style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:'.08em',padding:'5px 14px',border:`1px solid ${border}`,borderRadius:20,color:muted}}>{tag}</span>
                ))}
              </div>
            </div>

            {/* RIGHT — Meta card (sticky) */}
            <div style={{position:'sticky',top:80}}>
              <div style={{background:surface,border:`1px solid ${border}`,borderRadius:12,overflow:'hidden',boxShadow:`0 4px 24px rgba(0,0,0,${D?'.3':'.06'})`}}>
                {/* Card header */}
                <div style={{background:accent,padding:'16px 20px'}}>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:'.14em',textTransform:'uppercase',color:'rgba(255,255,255,.7)',marginBottom:4}}>Project Details</div>
                  <div style={{fontFamily:"'DM Serif Display',serif",fontSize:'1.1rem',color:'#fff',lineHeight:1.2}}>{project.title}</div>
                </div>
                {/* Meta items */}
                <div style={{padding:'20px'}}>
                  {([
                    ['📍','Location', project.location],
                    ['📅','Year',     project.year],
                    ['👤','Client',   project.client],
                    ['🏗','Sector',   project.sector],
                    ['📐','Area',     project.area],
                  ] as [string,string,any][]).map(([icon,label,val])=>val?(
                    <div key={label} style={{display:'flex',alignItems:'flex-start',gap:12,paddingBottom:14,marginBottom:14,borderBottom:`1px solid ${border}`}}>
                      <span style={{fontSize:15,flexShrink:0,marginTop:1}}>{icon}</span>
                      <div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.12em',textTransform:'uppercase',color:muted,marginBottom:3}}>{label}</div>
                        <div style={{fontSize:13.5,color:ink,fontWeight:500}}>{val}</div>
                      </div>
                    </div>
                  ):null)}

                  {/* CTA */}
                  <Link href="/contact"
                    style={{display:'block',textAlign:'center',background:accent,color:'#fff',padding:'12px',borderRadius:7,fontSize:13.5,fontWeight:600,textDecoration:'none',marginTop:4,transition:'background .18s'}}
                    onMouseEnter={e=>(e.currentTarget.style.background='#9d6330')}
                    onMouseLeave={e=>(e.currentTarget.style.background=accent)}>
                    Start a Similar Project →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ GALLERY — CMS images only ══ */}
        {gallery.length > 0 && (
          <section className="dsec" style={{padding:'0 56px 64px'}}>
            <div style={{borderTop:`1px solid ${border}`,paddingTop:48}}>
              <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.18em',textTransform:'uppercase',color:accent,marginBottom:8}}>Gallery</p>
              <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'1.6rem',color:ink,marginBottom:28}}>Project Images</h2>

              <div className="dgal-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
                {allImgs.map((src,i)=>(
                  <div key={i} className="dgal-img"
                    onClick={()=>{setActiveImg(i);setLightbox(i)}}
                    style={{height: i===0 ? 320 : 220, background:border, gridColumn: i===0 ? '1 / span 2' : 'auto'}}>
                    <img src={src} alt={`${project.title} — Image ${i+1}`}
                      style={{width:'100%',height:'100%',objectFit:'cover',display:'block',transition:'transform .35s ease'}}/>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══ RELATED PROJECTS ══ */}
        {related.length > 0 && (
          <section className="dsec" style={{padding:'0 56px 64px',borderTop:`1px solid ${border}`,paddingTop:52}}>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.18em',textTransform:'uppercase',color:accent,marginBottom:8}}>More {project.sector} Projects</p>
            <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'1.6rem',color:ink,marginBottom:28}}>Related Work</h2>
            <div className="drel-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
              {related.map(r=>(
                <Link key={r.id} href={`/projects/${r.slug}`} className="drel-card"
                  style={{background:surface,border:`1px solid ${hovRel===r.id?accent+'77':border}`,borderRadius:9,overflow:'hidden',boxShadow:hovRel===r.id?`0 10px 32px rgba(0,0,0,${D?'.45':'.09'})`:'none',transition:'all .25s'}}
                  onMouseEnter={()=>setHovRel(r.id)} onMouseLeave={()=>setHovRel(null)}>
                  <div className="dri" style={{height:180,overflow:'hidden',background:border,position:'relative'}}>
                    <img src={getRelImg(r)} alt={r.title} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
                    <div className="drov" style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(0,0,0,.7) 0%,transparent 55%)',display:'flex',alignItems:'flex-end',padding:'14px 16px'}}>
                      <span style={{color:'#fff',fontSize:10.5,fontFamily:"'DM Mono',monospace",letterSpacing:'.1em',textTransform:'uppercase'}}>View Project →</span>
                    </div>
                  </div>
                  <div style={{padding:'14px 16px 16px'}}>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:'.12em',textTransform:'uppercase',color:accent,border:`1px solid ${accent}44`,display:'inline-block',padding:'2px 6px',borderRadius:2,marginBottom:7}}>{r.sector}</div>
                    <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:'1rem',color:ink,marginBottom:5,lineHeight:1.3}}>{r.title}</h3>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:muted}}>📍 {r.location}{r.year?` · 📅 ${r.year}`:''}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ══ CTA ══ */}
        <section style={{background:D?'#0a0908':'#0f0e0d',padding:'60px 56px',textAlign:'center'}}>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.18em',textTransform:'uppercase',color:accent,marginBottom:12}}>Start Your Project</p>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'2rem',color:'#f0ede8',marginBottom:12}}>Inspired by this work?</h2>
          <p style={{fontSize:14,color:'rgba(255,255,255,.6)',marginBottom:28,maxWidth:420,margin:'0 auto 28px'}}>Let's create something extraordinary for your space.</p>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:12,flexWrap:'wrap'}}>
            <Link href="/contact" style={{display:'inline-flex',alignItems:'center',gap:8,background:accent,color:'#fff',padding:'13px 28px',borderRadius:6,fontWeight:600,fontSize:13.5,textDecoration:'none'}}>Get In Touch →</Link>
            <Link href="/projects" style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(255,255,255,.08)',color:'#fff',border:'1.5px solid rgba(255,255,255,.2)',padding:'12px 24px',borderRadius:6,fontSize:13.5,textDecoration:'none'}}>View All Projects</Link>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer style={{background:D?'#050504':'#0f0e0d',color:'#f0ede8',padding:'48px 56px 32px'}}>
          <div className="dftg" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:40,marginBottom:48}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
                <Logo a="#b5763a"/>
                <div><div style={{fontFamily:"'DM Serif Display',serif",fontSize:'1.05rem',marginBottom:2}}>The Prospective Interiors</div><div style={{fontFamily:"'DM Mono',monospace",fontSize:'7px',letterSpacing:'.18em',textTransform:'uppercase',color:'#b5763a'}}>Est. 2004 · Pune</div></div>
              </div>
              <p style={{fontSize:12.5,color:'#8a857f',lineHeight:1.7,margin:0}}>A multi-disciplinary design firm creating meaningful spaces across India.</p>
            </div>
            <div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.14em',textTransform:'uppercase',color:'#5a5752',marginBottom:16}}>Navigation</div>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {NAV.map(([href,label])=><Link key={href} href={href} style={{fontSize:13,color:'#8a857f',textDecoration:'none'}}>{label}</Link>)}
              </div>
            </div>
            <div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.14em',textTransform:'uppercase',color:'#5a5752',marginBottom:16}}>Contact</div>
              <div style={{fontSize:12.5,color:'#8a857f',lineHeight:1.8}}>
                <div>info@prospectiveinteriors.com</div><div>+91 98765 43210</div>
                <div style={{marginTop:8}}>101, Design House, Baner Road<br/>Pune, Maharashtra 411045</div>
              </div>
            </div>
          </div>
          <div style={{borderTop:'1px solid #1e1c19',paddingTop:22,display:'flex',justifyContent:'space-between'}}>
            <span style={{fontSize:11.5,color:'#5a5752'}}>© 2026 The Prospective Interiors · All rights reserved</span>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:'.12em',textTransform:'uppercase',color:'#2e2c28'}}>Designed by Prashant Bhandiya</span>
          </div>
        </footer>
      </div>

      {/* ══ LIGHTBOX ══ */}
      {lightbox !== null && (
        <div onClick={e=>{if(e.target===e.currentTarget) setLightbox(null)}}
          style={{position:'fixed',inset:0,background:'rgba(0,0,0,.94)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center',padding:20,animation:'lbIn .25s ease'}}
        >
          <style>{`@keyframes lbIn{from{opacity:0}to{opacity:1}}`}</style>

          <button onClick={()=>setLightbox(null)}
            style={{position:'absolute',top:20,right:24,width:40,height:40,borderRadius:20,background:'rgba(255,255,255,.12)',border:'1px solid rgba(255,255,255,.2)',color:'#fff',fontSize:20,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>

          {lightbox > 0 && (
            <button className="darrow" onClick={()=>setLightbox(i=>i!==null?i-1:0)}
              style={{position:'absolute',left:20,top:'50%',transform:'translateY(-50%)',width:50,height:50,borderRadius:25,background:'rgba(255,255,255,.12)',border:'1px solid rgba(255,255,255,.2)',color:'#fff',fontSize:26,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>‹</button>
          )}
          {lightbox < allImgs.length-1 && (
            <button className="darrow" onClick={()=>setLightbox(i=>i!==null?i+1:0)}
              style={{position:'absolute',right:20,top:'50%',transform:'translateY(-50%)',width:50,height:50,borderRadius:25,background:'rgba(255,255,255,.12)',border:'1px solid rgba(255,255,255,.2)',color:'#fff',fontSize:26,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>›</button>
          )}

          <img src={allImgs[lightbox]} alt="" style={{maxWidth:'90vw',maxHeight:'88vh',objectFit:'contain',borderRadius:8,display:'block'}}/>

          <div style={{position:'absolute',bottom:24,left:'50%',transform:'translateX(-50%)',fontFamily:"'DM Mono',monospace",fontSize:11,color:'rgba(255,255,255,.5)',letterSpacing:'.06em'}}>
            {lightbox+1} / {allImgs.length} · ESC to close
          </div>
        </div>
      )}
    </>
  )
}