'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface Project { id:string;title:string;slug:string;location:string;year:number|null;sector:string;client:string;heroImage:string;description?:string;gallery?:string[];area?:string }
interface Stat { label:string;value:string }
interface HomeData { heroHeadline:string;heroSubtext:string;philosophyText:string;heroImage:string;stats:Stat[];services:any[];team:any[];projects:Project[] }

const AC = '#c8935a'
const HERO = 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1800&q=95'
const FB:Record<string,string> = {
  Hospitality:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=90',
  Healthcare:'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=90',
  Retail:'https://images.unsplash.com/photo-1567958451986-2de427a4a0be?w=900&q=90',
  Residential:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=90',
  Industrial:'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=90',
  Commercial:'https://images.unsplash.com/photo-1497366754035-f200581374c7?w=900&q=90',
  default:'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=900&q=90',
}
const gI = (p:Project) => p.heroImage || FB[p.sector] || FB.default
const DS = [
  {label:'Projects Delivered',value:'200+'},
  {label:'Years of Excellence',value:'20+'},
  {label:'Design Awards',value:'12'},
  {label:'Sectors Served',value:'8'},
]

function tk(d:boolean){return{ink:d?'#f0ede8':'#0f0e0d',paper:d?'#111010':'#faf9f7',surface:d?'#1c1b1a':'#ffffff',muted:d?'#7a756f':'#6b6560',border:d?'#2e2b28':'#e4e0da',subtle:d?'#161514':'#f4f1ec'}}

function Logo({dark,onImg=false}:{dark:boolean;onImg?:boolean}){
  return(
    <div style={{display:'flex',alignItems:'center'}}>
      <img
        src="/api/media/file/logo.png"
        alt="The Prospective Interiors"
        style={{
          height:56,
          width:'auto',
          display:'block',
          filter: onImg || dark
            ? 'invert(1) sepia(1) saturate(0) brightness(2)'
            : 'invert(0)',
          transition:'filter .3s',
        }}
      />
    </div>
  )
}

function SC({v,vis}:{v:string;vis:boolean}){
  const[d,setD]=useState('0')
  useEffect(()=>{
    if(!vis)return
    const n=parseInt(v.replace(/\D/g,''))
    if(!n){setD(v);return}
    const s=v.replace(/\d/g,'');let c=0;const st=Math.ceil(n/40)
    const t=setInterval(()=>{c=Math.min(c+st,n);setD(c+s);if(c>=n)clearInterval(t)},30)
    return()=>clearInterval(t)
  },[vis,v])
  return<>{d}</>
}

export default function HomeClient({data}:{data:HomeData}){
  const[dark,setDarkSt]=useState(false)
  const[mounted,setMt]=useState(false)
  const[scrolled,setSc]=useState(false)
  const[sv,setSv]=useState(false)
  const[hov,setHov]=useState<string|null>(null)
  const sRef=useRef<HTMLDivElement>(null)
  const setDark=(v:boolean)=>{setDarkSt(v);try{localStorage.setItem('tpi-theme',v?'dark':'light')}catch{}}
  useEffect(()=>{setMt(true);try{if(localStorage.getItem('tpi-theme')==='dark')setDarkSt(true)}catch{}},[])
  useEffect(()=>{const fn=()=>setSc(window.scrollY>60);window.addEventListener('scroll',fn,{passive:true});return()=>window.removeEventListener('scroll',fn)},[])
  useEffect(()=>{if(!sRef.current)return;const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setSv(true)},{threshold:.3});o.observe(sRef.current);return()=>o.disconnect()},[])
  const t=tk(dark)
  const stats=data.stats.length?data.stats:DS
  const projects=data.projects.slice(0,3)

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}body{font-family:'DM Sans',sans-serif;font-size:14px;line-height:1.7}a{text-decoration:none}
        .hna:hover{color:${AC}!important}
        .hthm{transition:all .2s}.hthm:hover{transform:rotate(18deg) scale(1.1)}
        .hscr{animation:hS 2.2s ease-in-out infinite}
        @keyframes hS{0%,100%{opacity:.4;transform:translateY(0)}50%{opacity:.85;transform:translateY(8px)}}
        .hfd{animation:hF 1s cubic-bezier(.4,0,.2,1) both}
        @keyframes hF{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:none}}
        .hpc{cursor:pointer;overflow:hidden;border-radius:4px;transition:transform .3s cubic-bezier(.4,0,.2,1),box-shadow .3s}
        .hpc:hover{transform:translateY(-6px);box-shadow:0 20px 52px rgba(0,0,0,${dark?'.5':'.12'})}
        .hpc img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .7s cubic-bezier(.4,0,.2,1)}
        .hpc:hover img{transform:scale(1.07)}
        .hpc .ov{position:absolute;inset:0;background:rgba(0,0,0,0);transition:background .3s}
        .hpc:hover .ov{background:rgba(0,0,0,.35)}
        .hpc .ovt{position:absolute;bottom:0;left:0;right:0;padding:24px 20px;transform:translateY(6px);opacity:0;transition:all .3s}
        .hpc:hover .ovt{transform:translateY(0);opacity:1}
        .hcta{display:inline-flex;align-items:center;gap:8px;transition:opacity .2s,transform .2s}
        .hcta:hover{opacity:.88;transform:translateY(-2px)}
        @media(max-width:900px){.hpg{grid-template-columns:repeat(2,1fr)!important}.hph{grid-template-columns:1fr!important}}
        @media(max-width:600px){.hpg{grid-template-columns:1fr!important}.hnav{padding:0 20px!important}.hsec{padding-left:24px!important;padding-right:24px!important}.hstg{grid-template-columns:repeat(2,1fr)!important}.hftg{grid-template-columns:1fr!important;gap:24px!important}h1.hh1{font-size:3rem!important}}
      `}</style>

      <div style={{minHeight:'100vh',background:t.paper,color:t.ink,transition:'background .32s,color .32s'}}>

        {/* ══ NAV ══ */}
        <nav className="hnav" style={{position:'fixed',top:0,left:0,right:0,zIndex:200,height:68,display:'flex',alignItems:'center',padding:'0 56px',gap:36,background:scrolled?(dark?'rgba(17,16,16,.97)':'rgba(250,249,247,.97)'):'transparent',backdropFilter:scrolled?'blur(18px)':'none',borderBottom:scrolled?`1px solid ${t.border}`:'none',transition:'background .35s,border-color .35s'}}>
          <Link href="/" style={{textDecoration:'none',flexShrink:0}}><Logo dark={dark} onImg={!scrolled}/></Link>
          <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:32}}>
            {([['/', 'Home'],['/projects','Projects'],['/about','About'],['/contact','Contact']] as [string,string][]).map(([href,label])=>(
              <Link key={href} href={href} className="hna" style={{fontSize:11,fontWeight:600,letterSpacing:'.14em',textTransform:'uppercase',color:href==='/'?(!scrolled?'#fff':t.ink):(!scrolled?'rgba(255,255,255,.65)':t.muted),borderBottom:href==='/'?`2px solid ${AC}`:'2px solid transparent',paddingBottom:2,transition:'color .2s'}}>{label}</Link>
            ))}
            <button className="hthm" onClick={()=>setDark(!dark)} style={{width:36,height:36,borderRadius:18,border:`1.5px solid ${!scrolled?'rgba(255,255,255,.35)':t.border}`,background:!scrolled?'rgba(255,255,255,.1)':(dark?'#2a2825':'#f0ede8'),cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15}}>{dark?'☀️':'🌙'}</button>
          </div>
        </nav>

        {/* ══ 1. HERO — full bleed ══ */}
        <section style={{position:'relative',width:'100%',height:'100vh',minHeight:680,overflow:'hidden'}}>
          <img
            src={data.heroImage||HERO}
            alt="The Prospective Interiors"
            style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center',display:'block'}}
          />
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,.5) 0%,rgba(0,0,0,.18) 45%,rgba(0,0,0,.68) 100%)'}}/>

          <div className="hfd" style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'68px 40px 0'}}>
            <h1 className="hh1" style={{fontFamily:"'DM Serif Display',serif",fontSize:'5rem',lineHeight:1.06,color:'#fff',fontWeight:400,maxWidth:820,marginBottom:28,textShadow:'0 4px 40px rgba(0,0,0,.4)',letterSpacing:'-.02em'}}>
              {data.heroHeadline||'Where Vision\nBecomes Space'}
            </h1>
            <p style={{fontSize:16.5,color:'rgba(255,255,255,.72)',maxWidth:460,lineHeight:1.9,marginBottom:52,fontWeight:300,letterSpacing:'.01em',textShadow:'0 2px 12px rgba(0,0,0,.35)'}}>
              {data.heroSubtext||'Two decades of crafting extraordinary interiors for discerning clients across India'}
            </p>
            <div style={{display:'flex',gap:14,flexWrap:'wrap',justifyContent:'center'}}>
              <Link href="/projects" className="hcta" style={{background:AC,color:'#fff',padding:'15px 38px',borderRadius:4,fontWeight:700,fontSize:11,letterSpacing:'.16em',textTransform:'uppercase'}}>
                Explore Our Work →
              </Link>
              <Link href="/contact" style={{display:'inline-flex',alignItems:'center',color:'#fff',border:'1.5px solid rgba(255,255,255,.45)',padding:'14px 30px',borderRadius:4,fontWeight:600,fontSize:11,letterSpacing:'.16em',textTransform:'uppercase',backdropFilter:'blur(8px)',background:'rgba(255,255,255,.07)',transition:'background .2s'}}
                onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,.16)')}
                onMouseLeave={e=>(e.currentTarget.style.background='rgba(255,255,255,.07)')}>
                Get In Touch
              </Link>
            </div>
          </div>

          <div className="hscr" style={{position:'absolute',bottom:32,left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:'.28em',textTransform:'uppercase',color:'rgba(255,255,255,.4)'}}>Scroll</span>
            <span style={{color:'rgba(255,255,255,.4)',fontSize:22}}>↓</span>
          </div>
        </section>

        {/* ══ 2. STATS BAR ══ */}
        <div ref={sRef} style={{background:dark?'#0a0908':'#0f0e0d',padding:'48px 56px'}}>
          <div className="hstg" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',maxWidth:960,margin:'0 auto'}}>
            {stats.map((s,i)=>(
              <React.Fragment key={i}>
                {i>0&&<div style={{width:'1px',background:'rgba(255,255,255,.08)'}}/>}
                <div style={{textAlign:'center',padding:'0 24px'}}>
                  <div style={{fontFamily:"'DM Serif Display',serif",fontSize:'3rem',color:AC,lineHeight:1,marginBottom:8}}>
                    <SC v={s.value} vis={sv}/>
                  </div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:'.16em',textTransform:'uppercase',color:'rgba(255,255,255,.38)'}}>{s.label}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ══ 3. FEATURED PROJECTS — 3 cards ══ */}
        {projects.length>0&&(
          <section className="hsec" style={{padding:'88px 56px',borderBottom:`1px solid ${t.border}`}}>
            <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:52}}>
              <div>
                <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.26em',textTransform:'uppercase',color:AC,marginBottom:14}}>— Selected Work —</p>
                <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'2.6rem',color:t.ink,lineHeight:1.1,fontWeight:400}}>Featured Projects</h2>
              </div>
              <Link href="/projects" style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,letterSpacing:'.14em',textTransform:'uppercase',color:t.muted,borderBottom:`1px solid ${t.border}`,paddingBottom:2,transition:'color .2s,border-color .2s'}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color=AC;(e.currentTarget as HTMLElement).style.borderColor=AC}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color=t.muted;(e.currentTarget as HTMLElement).style.borderColor=t.border}}>
                View All →
              </Link>
            </div>
            <div className="hpg" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
              {projects.map((p,i)=>(
                <Link key={p.id} href={`/projects/${p.slug}`} className="hpc"
                  style={{background:t.border,display:'block',height:400,position:'relative'}}
                  onMouseEnter={()=>setHov(p.id)} onMouseLeave={()=>setHov(null)}>
                  <img src={gI(p)} alt={p.title} loading="lazy"/>
                  <div className="ov"/>
                  {/* Always visible bottom gradient + info */}
                  <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(0,0,0,.82) 0%,transparent 55%)'}}/>
                  <div className="ovt">
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:'.14em',textTransform:'uppercase',color:AC,marginBottom:6}}>{p.sector}</div>
                    <div style={{fontFamily:"'DM Serif Display',serif",fontSize:'1.1rem',color:'#fff',lineHeight:1.25,marginBottom:4}}>{p.title}</div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'rgba(255,255,255,.5)'}}>{p.location}{p.year?` · ${p.year}`:''}</div>
                  </div>
                  {/* Always visible sector badge */}
                  <div style={{position:'absolute',top:14,left:14,background:AC,color:'#fff',fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:'.12em',textTransform:'uppercase',padding:'3px 9px',borderRadius:3}}>{p.sector}</div>
                  {/* Permanent title at bottom */}
                  <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'20px'}}>
                    <div style={{fontFamily:"'DM Serif Display',serif",fontSize:'1.05rem',color:'#fff',lineHeight:1.25,marginBottom:3}}>{p.title}</div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(255,255,255,.5)'}}>{p.location}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ══ 4. PHILOSOPHY ══ */}
        <section style={{background:dark?'#0a0908':'#0f0e0d',padding:'96px 56px'}}>
          <div style={{maxWidth:800,margin:'0 auto',textAlign:'center'}}>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.28em',textTransform:'uppercase',color:AC,marginBottom:24}}>— Our Philosophy —</p>
            <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'clamp(1.6rem,3vw,2.2rem)',lineHeight:1.55,color:'#f0ede8',fontWeight:400,fontStyle:'italic',marginBottom:36}}>
              "{data.philosophyText||'Architecture is a dialogue between the human spirit and the space it inhabits — we design for the people, not just the photograph'}"
            </h2>
            <div style={{width:52,height:2,background:AC,margin:'0 auto 36px'}}/>
            <p style={{fontSize:15,color:'rgba(255,255,255,.45)',lineHeight:1.85,maxWidth:560,margin:'0 auto 36px'}}>
              For over twenty years, The Prospective Interiors has believed that great design begins with deep listening — understanding how people live, work and feel before a single line is drawn
            </p>
            <Link href="/about" style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,letterSpacing:'.18em',textTransform:'uppercase',color:AC,borderBottom:`1px solid ${AC}`,paddingBottom:3,transition:'opacity .2s'}} onMouseEnter={e=>(e.currentTarget.style.opacity='.7')} onMouseLeave={e=>(e.currentTarget.style.opacity='1')}>
              Our Story →
            </Link>
          </div>
        </section>

        {/* ══ 5. CTA → PROJECTS ══ */}
        <section style={{background:AC,padding:'96px 56px',textAlign:'center'}}>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.28em',textTransform:'uppercase',color:'rgba(255,255,255,.65)',marginBottom:18}}>— Ready to Begin —</p>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'clamp(2rem,4vw,3rem)',color:'#fff',marginBottom:16,lineHeight:1.1,fontWeight:400}}>
            Have a space in mind?
          </h2>
          <p style={{fontSize:15.5,color:'rgba(255,255,255,.8)',marginBottom:44,maxWidth:440,margin:'0 auto 44px',lineHeight:1.8}}>
            Let us create something extraordinary together
          </p>
          <div style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/projects" className="hcta" style={{background:'#fff',color:AC,padding:'15px 38px',borderRadius:4,fontWeight:700,fontSize:11,letterSpacing:'.16em',textTransform:'uppercase'}}>
              View All Projects →
            </Link>
            <Link href="/contact" style={{display:'inline-flex',alignItems:'center',color:'#fff',border:'1.5px solid rgba(255,255,255,.5)',padding:'14px 28px',borderRadius:4,fontWeight:600,fontSize:11,letterSpacing:'.16em',textTransform:'uppercase',transition:'background .2s'}}
              onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,.12)')}
              onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
              Contact Us
            </Link>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer style={{background:dark?'#0a0908':'#0f0e0d',color:'#f0ede8',padding:'60px 56px 40px'}}>
          <div className="hftg" style={{display:'grid',gridTemplateColumns:'1.5fr 1fr 1fr 1fr',gap:40,marginBottom:52}}>
            <div>
              <Logo dark={false}/>
              <p style={{fontSize:13.5,color:'#7a7570',lineHeight:1.82,margin:'20px 0 0',maxWidth:280}}>A multi-disciplinary interior design firm creating meaningful spaces across India since 2004</p>
            </div>
            <div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.18em',textTransform:'uppercase',color:'#4a4845',marginBottom:18}}>Navigate</div>
              <div style={{display:'flex',flexDirection:'column',gap:11}}>
                {([['/', 'Home'],['/projects','Projects'],['/about','About'],['/contact','Contact']] as [string,string][]).map(([href,label])=>(
                  <Link key={href} href={href} style={{fontSize:13.5,color:'#7a7570',transition:'color .2s'}} onMouseEnter={e=>(e.currentTarget.style.color=AC)} onMouseLeave={e=>(e.currentTarget.style.color='#7a7570')}>{label}</Link>
                ))}
              </div>
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
    </>
  )
}
  
              