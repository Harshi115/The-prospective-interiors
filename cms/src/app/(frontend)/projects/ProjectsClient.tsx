'use client'
import React, { useState, useMemo, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface Project { id:string;title:string;slug:string;client:string;location:string;year:number|null;sector:string;featured:boolean;description:string;heroImage:string;gallery:string[];area:string }

const AC='#c8935a'
const SECTORS=['All','Hospitality','Healthcare','Retail','Residential','Industrial','Commercial','Civic']
const PER_PAGE=9
const INT={lobby:'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&q=90',dining:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=90',living:'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=90',office:'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=90',hotel:'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=1200&q=90',clinic:'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=90',retail:'https://images.unsplash.com/photo-1567958451986-2de427a4a0be?w=1200&q=90',bedroom:'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=90',kitchen:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=90'}
const FB:Record<string,string>={Hospitality:INT.dining,Healthcare:INT.clinic,Retail:INT.retail,Residential:INT.living,Industrial:INT.office,Commercial:INT.office,Civic:INT.lobby,default:INT.lobby}
const FG:Record<string,string[]>={Hospitality:[INT.hotel,INT.dining],Residential:[INT.living,INT.bedroom],Commercial:[INT.office,INT.lobby],default:[INT.lobby,INT.kitchen]}
const gI=(p:Project)=>p.heroImage||FB[p.sector]||FB.default
const gG=(p:Project)=>{const g=(p.gallery||[]).filter(Boolean);return g.length?g:(FG[p.sector]||FG.default)}
function tk(d:boolean){return{ink:d?'#f0ede8':'#0f0e0d',paper:d?'#111010':'#faf9f7',surface:d?'#1c1b1a':'#ffffff',muted:d?'#7a756f':'#6b6560',border:d?'#2e2b28':'#e4e0da',subtle:d?'#161514':'#f4f1ec'}}

function Logo({dark}:{dark:boolean}){
  return(
    <div style={{display:'flex',alignItems:'center'}}>
      <img
        src="/api/media/file/logo.png"
        alt="The Prospective Interiors"
        style={{
          height:52,
          width:'auto',
          display:'block',
          filter: dark ? 'invert(1) sepia(1) saturate(0) brightness(2)' : 'none',
          transition:'filter .3s',
        }}
      />
    </div>
  )
}

/* ── FULL SCREEN PROJECT DETAIL ── */
function ProjectDetail({p,onClose,dark,onPrev,onNext,hasPrev,hasNext}:{p:Project;onClose:()=>void;dark:boolean;onPrev:()=>void;onNext:()=>void;hasPrev:boolean;hasNext:boolean}){
  const[ai,setAi]=useState(0)
  const g=gG(p);const all=[gI(p),...g]
  const t=tk(dark)
  useEffect(()=>{
    setAi(0)
    const fn=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose();if(e.key==='ArrowRight')setAi(i=>Math.min(i+1,all.length-1));if(e.key==='ArrowLeft')setAi(i=>Math.max(i-1,0))}
    window.addEventListener('keydown',fn);document.body.style.overflow='hidden'
    return()=>{window.removeEventListener('keydown',fn);document.body.style.overflow=''}
  },[p.id])

  return(
    <div style={{position:'fixed',inset:0,zIndex:600,background:t.paper,display:'flex',flexDirection:'column',animation:'pdIn .3s ease'}}>
      <style>{`
        @keyframes pdIn{from{opacity:0}to{opacity:1}}
        .pdth{cursor:pointer;transition:all .2s;opacity:.45}.pdth:hover,.pdth.on{opacity:1}
        .pdar{transition:all .18s;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15)}.pdar:hover{background:rgba(255,255,255,.18)}
        .pdgi{overflow:hidden;cursor:pointer;border-radius:4px}.pdgi img{transition:transform .5s ease;width:100%;height:100%;object-fit:cover;display:block}.pdgi:hover img{transform:scale(1.05)}
        .pdib img{transition:transform .6s ease}.pdib:hover img{transform:scale(1.04)}
      `}</style>

      {/* TOP BAR */}
      <div style={{height:64,display:'flex',alignItems:'center',padding:'0 48px',borderBottom:`1px solid ${t.border}`,flexShrink:0,background:dark?'rgba(17,16,16,.97)':'rgba(250,249,247,.97)',backdropFilter:'blur(18px)',position:'sticky',top:0,zIndex:10}}>
        <button onClick={onClose} style={{display:'flex',alignItems:'center',gap:10,background:'none',border:'none',color:t.muted,cursor:'pointer',fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.16em',textTransform:'uppercase',padding:0,transition:'color .2s'}} onMouseEnter={e=>(e.currentTarget.style.color=t.ink)} onMouseLeave={e=>(e.currentTarget.style.color=t.muted)}>
          ← Back to Projects
        </button>
        <div style={{display:'flex',alignItems:'center',gap:10,marginLeft:'auto'}}>
          {hasPrev&&<button onClick={onPrev} className="pdar" style={{width:36,height:36,borderRadius:18,cursor:'pointer',color:t.muted,fontSize:18,display:'flex',alignItems:'center',justifyContent:'center'}}>‹</button>}
          {hasNext&&<button onClick={onNext} className="pdar" style={{width:36,height:36,borderRadius:18,cursor:'pointer',color:t.muted,fontSize:18,display:'flex',alignItems:'center',justifyContent:'center'}}>›</button>}
          <Link href={`/projects/${p.slug}`} style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.14em',textTransform:'uppercase',color:AC,borderBottom:`1px solid ${AC}`,paddingBottom:2,textDecoration:'none',transition:'opacity .2s'}} onMouseEnter={e=>(e.currentTarget.style.opacity='.7')} onMouseLeave={e=>(e.currentTarget.style.opacity='1')}>Full Page →</Link>
        </div>
      </div>

      {/* SCROLLABLE */}
      <div style={{flex:1,overflowY:'auto'}}>

        {/* HERO IMAGE */}
        <div style={{position:'relative',width:'100%',height:'72vh',minHeight:500,background:'#111'}}>
          <img src={all[ai]} alt={p.title} style={{width:'100%',height:'100%',objectFit:'cover',display:'block',transition:'opacity .3s',opacity:.92}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,.15) 0%,transparent 40%,rgba(0,0,0,.78) 100%)'}}/>
          {all.length>1&&<>
            <button className="pdar" onClick={()=>setAi(i=>Math.max(i-1,0))} style={{position:'absolute',left:24,top:'50%',transform:'translateY(-50%)',width:52,height:52,borderRadius:26,cursor:'pointer',color:'#fff',fontSize:26,display:'flex',alignItems:'center',justifyContent:'center',opacity:ai===0?.3:1}}>‹</button>
            <button className="pdar" onClick={()=>setAi(i=>Math.min(i+1,all.length-1))} style={{position:'absolute',right:24,top:'50%',transform:'translateY(-50%)',width:52,height:52,borderRadius:26,cursor:'pointer',color:'#fff',fontSize:26,display:'flex',alignItems:'center',justifyContent:'center',opacity:ai===all.length-1?.3:1}}>›</button>
          </>}
          {all.length>1&&<div style={{position:'absolute',top:24,right:24,background:'rgba(0,0,0,.55)',color:'rgba(255,255,255,.75)',fontFamily:"'DM Mono',monospace",fontSize:10,padding:'5px 12px',borderRadius:3,backdropFilter:'blur(4px)'}}>{ai+1} / {all.length}</div>}
          {/* Title overlay */}
          <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'48px 56px 44px'}}>
            <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:20,flexWrap:'wrap'}}>
              <div>
                <span style={{display:'inline-block',fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.18em',textTransform:'uppercase',color:AC,background:`${AC}25`,border:`1px solid ${AC}55`,padding:'4px 12px',borderRadius:3,marginBottom:14}}>{p.sector}</span>
                <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:'3rem',color:'#fff',fontWeight:400,lineHeight:1.06,textShadow:'0 4px 28px rgba(0,0,0,.4)',maxWidth:700}}>{p.title}</h1>
              </div>
              <div style={{display:'flex',gap:28,flexShrink:0}}>
                {p.location&&<div style={{textAlign:'right'}}><div style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:'.14em',textTransform:'uppercase',color:'rgba(255,255,255,.45)',marginBottom:4}}>Location</div><div style={{fontSize:14,color:'rgba(255,255,255,.85)',fontWeight:500}}>{p.location}</div></div>}
                {p.year&&<div style={{textAlign:'right'}}><div style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:'.14em',textTransform:'uppercase',color:'rgba(255,255,255,.45)',marginBottom:4}}>Year</div><div style={{fontSize:14,color:'rgba(255,255,255,.85)',fontWeight:500}}>{p.year}</div></div>}
              </div>
            </div>
          </div>
        </div>

        {/* THUMBNAILS */}
        {all.length>1&&(
          <div style={{display:'flex',gap:8,padding:'16px 56px',overflowX:'auto',background:dark?'#0d0c0b':'#f0ede8',borderBottom:`1px solid ${t.border}`}}>
            {all.map((src,i)=>(
              <div key={i} className={`pdth${i===ai?' on':''}`} onClick={()=>setAi(i)}
                style={{width:96,height:66,borderRadius:3,overflow:'hidden',flexShrink:0,border:`2px solid ${i===ai?AC:'transparent'}`,transition:'all .2s'}}>
                <img src={src} alt="" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
              </div>
            ))}
          </div>
        )}

        {/* DESCRIPTION + META */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:0}}>
          <div style={{padding:'60px 56px',borderRight:`1px solid ${t.border}`}}>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.2em',textTransform:'uppercase',color:AC,marginBottom:20}}>— About This Project —</p>
            {p.description?(
              <div style={{fontSize:15.5,color:t.muted,lineHeight:1.9}}>
                {p.description.split('\n\n').map((para,i)=>(
                  <p key={i} style={{marginBottom:20,color:i===0?t.ink:t.muted,fontSize:i===0?16:15.5}}>{para}</p>
                ))}
              </div>
            ):(
              <p style={{fontSize:15.5,color:t.muted,lineHeight:1.9}}>A beautifully designed {p.sector?.toLowerCase()} space by The Prospective Interiors, crafted with premium materials and meticulous attention to detail that defines the firm's two-decade legacy of design excellence.</p>
            )}
            <div style={{display:'flex',gap:12,marginTop:40}}>
              <Link href={`/projects/${p.slug}`} style={{display:'inline-flex',alignItems:'center',gap:8,background:AC,color:'#fff',padding:'14px 32px',borderRadius:4,fontSize:11,fontWeight:700,textDecoration:'none',letterSpacing:'.14em',textTransform:'uppercase',transition:'opacity .2s'}} onMouseEnter={e=>(e.currentTarget.style.opacity='.85')} onMouseLeave={e=>(e.currentTarget.style.opacity='1')}>View Full Project →</Link>
              <Link href="/contact" style={{display:'inline-flex',alignItems:'center',gap:8,color:t.muted,border:`1.5px solid ${t.border}`,padding:'13px 24px',borderRadius:4,fontSize:11,fontWeight:600,textDecoration:'none',letterSpacing:'.14em',textTransform:'uppercase',transition:'all .2s'}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=AC;(e.currentTarget as HTMLElement).style.color=AC}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=t.border;(e.currentTarget as HTMLElement).style.color=t.muted}}>Start Similar Project</Link>
            </div>
          </div>
          <div style={{padding:'60px 40px',background:t.subtle}}>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.2em',textTransform:'uppercase',color:AC,marginBottom:28}}>— Project Details —</p>
            {([['📍','Location',p.location],['📅','Year',p.year],['👤','Client',p.client],['🏗','Sector',p.sector],['📐','Area',p.area]] as [string,string,any][]).map(([ic,lb,vl])=>vl?(
              <div key={lb} style={{display:'flex',gap:14,paddingBottom:20,marginBottom:20,borderBottom:`1px solid ${t.border}`}}>
                <span style={{fontSize:16,flexShrink:0,opacity:.7}}>{ic}</span>
                <div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:'.14em',textTransform:'uppercase',color:t.muted,marginBottom:4}}>{lb}</div>
                  <div style={{fontSize:14,color:t.ink,fontWeight:500}}>{vl}</div>
                </div>
              </div>
            ):null)}
            <Link href="/contact" style={{display:'block',textAlign:'center',background:AC,color:'#fff',padding:'13px',borderRadius:4,fontSize:11,fontWeight:700,textDecoration:'none',letterSpacing:'.12em',textTransform:'uppercase',marginTop:8,transition:'opacity .2s'}} onMouseEnter={e=>(e.currentTarget.style.opacity='.85')} onMouseLeave={e=>(e.currentTarget.style.opacity='1')}>Start a Project →</Link>
          </div>
        </div>

        {/* GALLERY GRID */}
        {g.length>0&&(
          <div style={{padding:'0 56px 80px',borderTop:`1px solid ${t.border}`,paddingTop:60}}>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.2em',textTransform:'uppercase',color:AC,marginBottom:48}}>— Project Gallery —</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
              {all.map((src,i)=>(
                <div key={i} className="pdgi" onClick={()=>setAi(i)}
                  style={{height:i===0?380:240,border:`2px solid ${i===ai?AC:'transparent'}`,transition:'border-color .2s',gridColumn:i===0?'1/span 2':'auto'}}>
                  <img src={src} alt={`${p.title} — View ${i+1}`}/>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div style={{background:dark?'#0a0908':'#0f0e0d',padding:'40px 56px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <Logo dark={false}/>
          <div style={{display:'flex',gap:24}}>
            {[['/', 'Home'],['/projects','Projects'],['/about','About'],['/contact','Contact']].map(([href,label])=><Link key={href} href={href} style={{fontSize:12,color:'#7a7570',textDecoration:'none',fontFamily:"'DM Mono',monospace",letterSpacing:'.06em',transition:'color .2s'}} onMouseEnter={e=>(e.currentTarget.style.color=AC)} onMouseLeave={e=>(e.currentTarget.style.color='#7a7570')}>{label}</Link>)}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══ MAIN PROJECTS PAGE ══ */
export default function ProjectsClient({projects}:{projects:Project[]}){
  const[dark,setDarkSt]=useState(false)
  const[mounted,setM]=useState(false)
  const[filter,setFilter]=useState('All')
  const[search,setSearch]=useState('')
  const[sort,setSort]=useState<'default'|'year-desc'|'year-asc'|'name'>('default')
  const[view,setView]=useState<'grid'|'list'>('grid')
  const[page,setPage]=useState(1)
  const[compare,setCompare]=useState(false)
  const[sel,setSel]=useState<string[]>([])
  const[panel,setPanel]=useState(false)
  const[hov,setHov]=useState<string|null>(null)
  const[open,setOpen]=useState<Project|null>(null)
  const[openIdx,setOpenIdx]=useState(-1)

  const setDark=(v:boolean)=>{setDarkSt(v);try{localStorage.setItem('tpi-theme',v?'dark':'light')}catch{}}
  useEffect(()=>{setM(true);try{if(localStorage.getItem('tpi-theme')==='dark')setDarkSt(true)}catch{}},[])
  useEffect(()=>{if(sel.length===2)setPanel(true);else setPanel(false)},[sel])

  const filtered=useMemo(()=>{
    let l=filter==='All'?projects:projects.filter(p=>p.sector?.toLowerCase()===filter.toLowerCase())
    if(search.trim()){const q=search.toLowerCase();l=l.filter(p=>p.title.toLowerCase().includes(q)||p.location.toLowerCase().includes(q)||p.client.toLowerCase().includes(q)||p.sector.toLowerCase().includes(q))}
    if(sort==='year-desc')l=[...l].sort((a,b)=>(b.year??0)-(a.year??0))
    else if(sort==='year-asc')l=[...l].sort((a,b)=>(a.year??0)-(b.year??0))
    else if(sort==='name')l=[...l].sort((a,b)=>a.title.localeCompare(b.title))
    return l
  },[projects,filter,search,sort])

  const total=Math.ceil(filtered.length/PER_PAGE)
  const items=filtered.slice((page-1)*PER_PAGE,page*PER_PAGE)
  const chgF=(s:string)=>{setFilter(s);setPage(1);setSel([]);setPanel(false);setSearch('')}
  const togSel=(id:string)=>setSel(prev=>{if(prev.includes(id))return prev.filter(x=>x!==id);if(prev.length>=2)return[prev[1],id];return[...prev,id]})
  const exitCmp=()=>{setCompare(false);setSel([]);setPanel(false)}
  const cmpProjs=sel.map(id=>projects.find(p=>p.id===id)).filter(Boolean) as Project[]

  const openP=useCallback((p:Project)=>{
    if(compare){togSel(p.id);return}
    const idx=filtered.findIndex(x=>x.id===p.id)
    setOpen(p);setOpenIdx(idx)
  },[compare,sel,filtered])

  const navP=(dir:1|-1)=>{const ni=openIdx+dir;if(ni>=0&&ni<filtered.length){setOpen(filtered[ni]);setOpenIdx(ni)}}

  const t=tk(dark)

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}html,body{font-family:'DM Sans',sans-serif;font-size:14px;line-height:1.7}a{text-decoration:none}
        .pna{transition:color .2s}.pna:hover{color:${AC}!important}
        .pthm{transition:all .2s}.pthm:hover{transform:rotate(18deg) scale(1.1)}
        .ppill{cursor:pointer;transition:all .18s;border:none;font-family:'DM Sans',sans-serif}.ppill:hover{color:${t.ink}!important;border-color:${t.border}!important}
        .pcard{cursor:pointer;position:relative;overflow:hidden;border-radius:4px;transition:transform .3s cubic-bezier(.4,0,.2,1),box-shadow .3s}
        .pcard:hover{transform:translateY(-6px);box-shadow:0 20px 52px rgba(0,0,0,${dark?'.5':'.13'})}
        .pcard img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .7s cubic-bezier(.4,0,.2,1)}
        .pcard:hover img{transform:scale(1.08)}
        .pov{position:absolute;inset:0;background:rgba(0,0,0,0);transition:background .3s;display:flex;align-items:center;justify-content:center}
        .pcard:hover .pov{background:rgba(0,0,0,.42)}
        .pov span{opacity:0;transition:opacity .3s;color:#fff;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.18em;text-transform:uppercase;border:1.5px solid rgba(255,255,255,.65);padding:10px 24px;border-radius:3px}
        .pcard:hover .pov span{opacity:1}
        .plcard{transition:border-color .22s,background .22s;cursor:pointer}.plcard:hover{border-color:${AC}!important;background:${t.subtle}!important}
        .pcpanel{animation:cpUp .35s cubic-bezier(.4,0,.2,1)}@keyframes cpUp{from{transform:translateY(100%);opacity:0}to{transform:none;opacity:1}}
        .ppg{transition:all .15s}.ppg:hover:not(:disabled){border-color:${AC}!important;color:${AC}!important}
        @media(max-width:900px){.pgrid{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:600px){.pgrid{grid-template-columns:1fr!important}.pnav,.pmain{padding-left:20px!important;padding-right:20px!important}.pcpi{flex-direction:column!important}.pftg{grid-template-columns:1fr!important;gap:24px!important}}
      `}</style>

      <div style={{minHeight:'100vh',background:t.paper,color:t.ink,transition:'background .32s,color .32s'}}>

        {/* NAV */}
        <nav className="pnav" style={{position:'sticky',top:0,zIndex:100,background:dark?'rgba(17,16,16,.97)':'rgba(250,249,247,.97)',borderBottom:`1px solid ${t.border}`,height:68,display:'flex',alignItems:'center',padding:'0 56px',gap:36,backdropFilter:'blur(18px)',transition:'background .32s'}}>
          <Link href="/" style={{textDecoration:'none',flexShrink:0}}><Logo dark={dark}/></Link>
          <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:32}}>
            {([['/', 'Home'],['/projects','Projects'],['/about','About'],['/contact','Contact']] as [string,string][]).map(([href,label])=>(
              <Link key={href} href={href} className="pna" style={{fontSize:11,fontWeight:600,letterSpacing:'.14em',textTransform:'uppercase',color:href==='/projects'?t.ink:t.muted,borderBottom:href==='/projects'?`2px solid ${AC}`:'2px solid transparent',paddingBottom:2}}>{label}</Link>
            ))}
            <button className="pthm" onClick={()=>setDark(!dark)} style={{width:36,height:36,borderRadius:18,border:`1.5px solid ${t.border}`,background:dark?'#2a2825':'#f0ede8',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,transition:'all .2s'}}>{dark?'☀️':'🌙'}</button>
          </div>
        </nav>

        {/* HERO — interior image */}
        <section style={{position:'relative',height:'52vh',minHeight:380,overflow:'hidden'}}>
          <img src={INT.lobby} alt="Our Work" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,.55) 0%,rgba(0,0,0,.22) 45%,rgba(0,0,0,.72) 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'0 40px'}}>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.32em',textTransform:'uppercase',color:'rgba(255,255,255,.5)',marginBottom:20}}>— Our Portfolio —</p>
            <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:'4rem',color:'#fff',fontWeight:400,lineHeight:1.05,textShadow:'0 4px 28px rgba(0,0,0,.4)'}}>Our Work</h1>
            <p style={{fontSize:14,color:'rgba(255,255,255,.6)',marginTop:14,fontFamily:"'DM Mono',monospace",letterSpacing:'.06em'}}>{projects.length} projects · {new Set(projects.map(p=>p.sector)).size} sectors</p>
          </div>
        </section>

        {/* FILTERS + CONTROLS */}
        <div className="pmain" style={{padding:'28px 56px 0',borderBottom:`1px solid ${t.border}`,background:t.subtle}}>
          <div style={{display:'flex',alignItems:'center',flexWrap:'wrap',gap:8,marginBottom:16}}>
            {SECTORS.map(s=>{
              const act=filter===s
              return<button key={s} className="ppill" onClick={()=>chgF(s)} style={{padding:'7px 18px',border:`1.5px solid ${act?t.ink:t.border}`,borderRadius:100,fontSize:11,fontWeight:act?600:400,background:act?t.ink:'transparent',color:act?t.paper:t.muted,whiteSpace:'nowrap',transition:'all .18s'}}>{s}</button>
            })}
            <button onClick={()=>{setCompare(!compare);if(compare)exitCmp()}} style={{marginLeft:'auto',padding:'7px 18px',border:`1.5px solid ${compare?AC:t.border}`,borderRadius:6,fontSize:10,fontWeight:500,fontFamily:"'DM Mono',monospace",letterSpacing:'.08em',textTransform:'uppercase',background:compare?`${AC}18`:'transparent',color:compare?AC:t.muted,cursor:'pointer',flexShrink:0,transition:'all .2s',display:'flex',alignItems:'center',gap:7}}>
              <span style={{fontSize:14}}>⊞</span>Compare{compare&&sel.length>0?` (${sel.length}/2)`:''}
            </button>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap',paddingBottom:20}}>
            <div style={{position:'relative',flex:1,minWidth:200}}>
              <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',fontSize:14,color:t.muted,pointerEvents:'none'}}>🔍</span>
              <input type="text" placeholder="Search projects..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} style={{width:'100%',padding:'9px 12px 9px 36px',border:`1.5px solid ${t.border}`,borderRadius:4,background:t.surface,color:t.ink,fontSize:12.5,fontFamily:"'DM Sans',sans-serif",outline:'none',transition:'border-color .18s'}} onFocus={e=>(e.target.style.borderColor=AC)} onBlur={e=>(e.target.style.borderColor=t.border)}/>
              {search&&<button onClick={()=>setSearch('')} style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:t.muted,cursor:'pointer',fontSize:16}}>✕</button>}
            </div>
            <div style={{position:'relative',flexShrink:0}}>
              <select value={sort} onChange={e=>setSort(e.target.value as any)} style={{padding:'9px 32px 9px 12px',border:`1.5px solid ${t.border}`,borderRadius:4,background:t.surface,color:t.muted,fontSize:11,fontFamily:"'DM Mono',monospace",cursor:'pointer',outline:'none',appearance:'none'}}>
                <option value="default">Sort: Default</option>
                <option value="year-desc">Newest First</option>
                <option value="year-asc">Oldest First</option>
                <option value="name">Name A–Z</option>
              </select>
              <span style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:t.muted,fontSize:11}}>▾</span>
            </div>
            <div style={{display:'flex',border:`1.5px solid ${t.border}`,borderRadius:4,overflow:'hidden',flexShrink:0}}>
              {(['grid','list'] as const).map(v=><button key={v} onClick={()=>setView(v)} style={{padding:'8px 14px',border:'none',cursor:'pointer',fontSize:15,background:view===v?t.ink:'transparent',color:view===v?t.paper:t.muted,transition:'all .15s'}}>{v==='grid'?'⊞':'☰'}</button>)}
            </div>
          </div>
        </div>

        {/* COMPARE HINT */}
        {compare&&(
          <div style={{margin:'0',background:`${AC}0e`,border:`none`,borderBottom:`1px solid ${AC}33`,padding:'12px 56px',display:'flex',alignItems:'center',gap:10,fontSize:12.5,color:AC}}>
            <span>⊞</span>
            <span style={{flex:1}}>{sel.length===0&&'Click 2 projects to compare'}{sel.length===1&&<><strong>1 of 2</strong> — select one more</>}{sel.length===2&&<><strong>2 selected</strong> — compare panel below ↓</>}</span>
            {sel.length>0&&<button onClick={()=>setSel([])} style={{background:'none',border:`1px solid ${AC}66`,borderRadius:3,color:AC,padding:'2px 10px',fontSize:10,cursor:'pointer'}}>Clear</button>}
            <button onClick={exitCmp} style={{background:'none',border:'none',color:t.muted,fontSize:18,cursor:'pointer',lineHeight:1}}>✕</button>
          </div>
        )}
        {search&&<div style={{padding:'8px 56px 0',fontSize:12,color:t.muted,fontFamily:"'DM Mono',monospace"}}>{filtered.length} result{filtered.length!==1?'s':''} for "<span style={{color:AC}}>{search}</span>"</div>}

        {/* GRID / LIST */}
        <div className="pmain" style={{padding:'32px 56px 80px'}}>
          {items.length===0?(
            <div style={{textAlign:'center',padding:'80px 20px',color:t.muted}}>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:'1.5rem',color:t.ink,marginBottom:8}}>No projects found</div>
              <p style={{fontSize:13}}>Try a different filter or add more projects in Payload CMS.</p>
            </div>
          ):view==='list'?(
            <div style={{display:'flex',flexDirection:'column',gap:1}}>
              {items.map(p=>{
                const isSel=sel.includes(p.id)
                return(
                  <div key={p.id} className="plcard" style={{display:'flex',border:`1px solid ${isSel?AC:t.border}`,borderRadius:3,overflow:'hidden',background:isSel?`${AC}08`:t.surface}} onClick={()=>openP(p)}>
                    <div style={{width:200,flexShrink:0,overflow:'hidden',position:'relative',height:140}}>
                      <img src={gI(p)} alt={p.title} style={{width:'100%',height:'100%',objectFit:'cover',display:'block',transition:'transform .4s',transform:hov===p.id?'scale(1.06)':'scale(1)'}}/>
                    </div>
                    <div style={{padding:'20px 24px',flex:1,display:'flex',flexDirection:'column',justifyContent:'center'}} onMouseEnter={()=>setHov(p.id)} onMouseLeave={()=>setHov(null)}>
                      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                        <span style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:'.12em',textTransform:'uppercase',color:AC,border:`1px solid ${AC}44`,padding:'2px 8px',borderRadius:3}}>{p.sector}</span>
                        {p.year&&<span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:t.muted}}>· {p.year}</span>}
                      </div>
                      <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:'1.2rem',color:t.ink,marginBottom:6,lineHeight:1.25}}>{p.title}</h3>
                      <div style={{fontSize:12.5,color:t.muted}}>📍 {p.location}</div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',padding:'0 24px',flexShrink:0}}>
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:hov===p.id?AC:t.border,transition:'color .2s'}}>{compare?(isSel?'✓':'+'):'→'}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          ):(
            <div className="pgrid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
              {items.map((p,i)=>{
                const isSel=sel.includes(p.id)
                return(
                  <div key={p.id} className="pcard" style={{height:360,border:`2px solid ${isSel?AC:'transparent'}`,animationFillMode:'both',background:t.border}}
                    onMouseEnter={()=>setHov(p.id)} onMouseLeave={()=>setHov(null)} onClick={()=>openP(p)}>
                    <img src={gI(p)} alt={p.title} loading="lazy"/>
                    <div className="pov"><span>{compare?(isSel?'✓ Selected':'+ Select'):'View Project'}</span></div>
                    {p.featured&&<div style={{position:'absolute',top:14,left:14,background:AC,color:'#fff',fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:'.12em',textTransform:'uppercase',padding:'3px 9px',borderRadius:3}}>Featured</div>}
                    {isSel&&<div style={{position:'absolute',top:14,right:14,width:28,height:28,borderRadius:14,background:AC,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700}}>✓</div>}
                    <div style={{position:'absolute',bottom:0,left:0,right:0,background:'linear-gradient(to top,rgba(0,0,0,.88) 0%,transparent 100%)',padding:'36px 20px 20px'}}>
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:'.14em',textTransform:'uppercase',color:AC,marginBottom:6}}>{p.sector}</div>
                      <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:'1.1rem',color:'#fff',lineHeight:1.25,marginBottom:4}}>{p.title}</h3>
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'rgba(255,255,255,.45)'}}>{p.location}{p.year?` · ${p.year}`:''}</div>
                    </div>
                    {compare&&!isSel&&sel.length===2&&<div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.45)'}}/>}
                  </div>
                )
              })}
            </div>
          )}

          {/* PAGINATION */}
          {total>1&&(
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,paddingTop:52}}>
              <button className="ppg" onClick={()=>setPage(p=>p-1)} disabled={page===1} style={{padding:'8px 18px',border:`1px solid ${t.border}`,borderRadius:3,background:'transparent',color:t.muted,fontSize:12,cursor:page===1?'not-allowed':'pointer',opacity:page===1?.4:1}}>‹ Prev</button>
              {Array.from({length:total},(_,i)=>i+1).map(n=><button key={n} className="ppg" onClick={()=>setPage(n)} style={{width:36,height:36,border:`1px solid ${n===page?t.ink:t.border}`,borderRadius:3,fontSize:12,cursor:'pointer',background:n===page?t.ink:'transparent',color:n===page?t.paper:t.muted,transition:'all .15s'}}>{n}</button>)}
              <button className="ppg" onClick={()=>setPage(p=>p+1)} disabled={page===total} style={{padding:'8px 18px',border:`1px solid ${t.border}`,borderRadius:3,background:'transparent',color:t.muted,fontSize:12,cursor:page===total?'not-allowed':'pointer',opacity:page===total?.4:1}}>Next ›</button>
            </div>
          )}
        </div>

        {/* COMPARE PANEL */}
        {panel&&cmpProjs.length===2&&(
          <div className="pcpanel" style={{position:'fixed',bottom:0,left:0,right:0,background:dark?'rgba(17,16,16,.98)':'rgba(250,249,247,.98)',borderTop:`2px solid ${AC}`,zIndex:200,padding:'20px 56px 28px',boxShadow:`0 -10px 50px rgba(0,0,0,${dark?'.6':'.14'})`,backdropFilter:'blur(20px)'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:'.18em',textTransform:'uppercase',color:AC}}>Comparing Projects</span>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>setSel([])} style={{fontSize:10,padding:'4px 12px',border:`1px solid ${t.border}`,borderRadius:3,background:'transparent',color:t.muted,cursor:'pointer',fontFamily:"'DM Mono',monospace"}}>Clear</button>
                <button onClick={exitCmp} style={{fontSize:10,padding:'4px 12px',border:`1px solid ${t.border}`,borderRadius:3,background:'transparent',color:t.muted,cursor:'pointer',fontFamily:"'DM Mono',monospace"}}>Exit</button>
                <button onClick={()=>setPanel(false)} style={{width:26,height:26,borderRadius:13,border:`1px solid ${t.border}`,background:'transparent',color:t.muted,fontSize:15,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
              </div>
            </div>
            <div className="pcpi" style={{display:'flex',gap:16}}>
              {cmpProjs.map((p,i)=>(
                <React.Fragment key={p.id}>
                  {i===1&&<div style={{display:'flex',alignItems:'center',flexShrink:0,fontFamily:"'DM Serif Display',serif",fontSize:'1.5rem',color:AC,padding:'0 8px',fontStyle:'italic'}}>vs</div>}
                  <div style={{flex:1,display:'flex',background:t.subtle,border:`1px solid ${t.border}`,borderRadius:4,overflow:'hidden',minHeight:120}}>
                    <div style={{width:140,flexShrink:0,overflow:'hidden'}}><img src={gI(p)} alt={p.title} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/></div>
                    <div style={{padding:'14px 16px',flex:1}}>
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:'.14em',textTransform:'uppercase',color:AC,marginBottom:6}}>{p.sector}</div>
                      <div style={{fontFamily:"'DM Serif Display',serif",fontSize:'1rem',color:t.ink,marginBottom:10,lineHeight:1.3}}>{p.title}</div>
                      {([['📍',p.location],['📅',p.year],['👤',p.client],['📐',p.area]] as [string,any][]).map(([ic,vl])=>vl?<div key={ic} style={{display:'flex',gap:8,marginBottom:4,fontSize:12,alignItems:'center'}}><span>{ic}</span><span style={{color:t.muted}}>{vl}</span></div>:null)}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer style={{background:dark?'#0a0908':'#0f0e0d',color:'#f0ede8',padding:'60px 56px 40px',marginBottom:panel?200:0,transition:'margin .32s ease'}}>
          <div className="pftg" style={{display:'grid',gridTemplateColumns:'1.5fr 1fr 1fr 1fr',gap:40,marginBottom:52}}>
            <div><Logo dark={false}/><p style={{fontSize:13.5,color:'#7a7570',lineHeight:1.8,margin:'20px 0 0',maxWidth:280}}>A multi-disciplinary interior design firm creating meaningful spaces across India since 2004.</p></div>
            <div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.18em',textTransform:'uppercase',color:'#4a4845',marginBottom:18}}>Navigate</div>
              <div style={{display:'flex',flexDirection:'column',gap:11}}>{([['/', 'Home'],['/projects','Projects'],['/about','About'],['/contact','Contact']] as [string,string][]).map(([href,label])=><Link key={href} href={href} style={{fontSize:13.5,color:'#7a7570',transition:'color .2s'}} onMouseEnter={e=>(e.currentTarget.style.color=AC)} onMouseLeave={e=>(e.currentTarget.style.color='#7a7570')}>{label}</Link>)}</div>
            </div>
            <div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.18em',textTransform:'uppercase',color:'#4a4845',marginBottom:18}}>Studio</div>
              <div style={{fontSize:13.5,color:'#7a7570',lineHeight:1.9}}><div>101, Design House</div><div>Baner Road, Pune</div><div>Maharashtra 411045</div></div>
            </div>
            <div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.18em',textTransform:'uppercase',color:'#4a4845',marginBottom:18}}>Connect</div>
              <div style={{fontSize:13.5,color:'#7a7570',lineHeight:1.9}}><div>info@prospectiveinteriors.com</div><div>+91 98765 43210</div></div>
            </div>
          </div>
          <div style={{borderTop:'1px solid #1e1c19',paddingTop:22,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontSize:11.5,color:'#3a3835'}}>© 2026 The Prospective Interiors · All rights reserved</span>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.1em',textTransform:'uppercase',color:'#2e2c28'}}>Designed by Prashant Bhandiya</span>
          </div>
        </footer>
      </div>

      {open&&<ProjectDetail p={open} onClose={()=>setOpen(null)} dark={dark} onPrev={()=>navP(-1)} onNext={()=>navP(1)} hasPrev={openIdx>0} hasNext={openIdx<filtered.length-1}/>}
    </>
  )
}
