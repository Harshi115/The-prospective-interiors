'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface Service { id:string;title:string;description:string }
interface Member { id:string;name:string;role:string;bio:string;photo:string }
interface Stat { label:string;value:string }

const AC='#c8935a'
const INT={
  lobby:'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&q=95',
  office:'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=90',
  hotel:'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=1800&q=95',
  living:'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1800&q=95',
  dining:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=95',
  bedroom:'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1800&q=95',
}

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

const VALUES=[
  {v:'Honesty',i:'◎',d:'We believe that honest communication builds the strongest design partnerships — our clients always know exactly where their project stands'},
  {v:'Transparency',i:'◈',d:'From budgets to timelines, we keep everything open and clear — there are no surprises in how we work or what we charge'},
  {v:'Timeliness',i:'◷',d:'We understand that a delayed space costs real money — our record of on-time delivery is something we are genuinely proud of'},
  {v:'Innovation',i:'◆',d:'Every project gives us a chance to think differently — we push creative and technical boundaries while keeping practicality at the centre'},
  {v:'Passion',i:'◉',d:'Interior design is not just our profession — it is what we love — and that passion is visible in the quality and care we bring to every space'},
  {v:'Attention to Detail',i:'◑',d:'The most memorable spaces are defined by details most people never consciously notice — we obsess over every junction, material, and finish'},
  {v:'Value-Add',i:'◧',d:'We consistently deliver more than our brief asks for — not because we have to, but because that is simply how we approach our craft'},
]

const SECTORS=[
  {icon:'🍽',label:'Hospitality',desc:'Hotels, restaurants and leisure destinations'},
  {icon:'🏠',label:'Residential',desc:'Private homes, apartments and villas'},
  {icon:'⚙️',label:'Commercial',desc:'Offices, co-working and corporate spaces'},
  {icon:'🏥',label:'Healthcare',desc:'Clinics, hospitals and wellness centres'},
  {icon:'🛍',label:'Retail',desc:'Stores, showrooms and brand environments'},
  {icon:'🏭',label:'Industrial',desc:'Factories, warehouses and tech campuses'},
  {icon:'🎓',label:'Educational',desc:'Schools, colleges and learning centres'},
  {icon:'🏛',label:'Civic',desc:'Government, cultural and public institutions'},
]

const MATERIALS=[
  {name:'Natural Stone',desc:'Marble, granite and sandstone — each slab chosen by hand for its veining, colour and character'},
  {name:'Solid Timber',desc:'Teak, walnut and white oak crafted into custom millwork and joinery that ages beautifully'},
  {name:'Metalwork',desc:'Brass, bronze and blackened steel shaped into bespoke fixtures, frames and decorative elements'},
  {name:'Textiles',desc:'Linen, velvet and leather layered thoughtfully to create warmth, texture and tactile richness'},
  {name:'Glass & Mirror',desc:'Fluted, smoked and antiqued glass used to manipulate light, depth and spatial perception'},
  {name:'Terrazzo & Tile',desc:'Hand-cut and pattern-laid across floors and walls — often custom-coloured to suit each project'},
]

const DS=[{label:'Years of Excellence',value:'20+'},{label:'Projects Delivered',value:'200+'},{label:'Sectors',value:'8'},{label:'Expert Team',value:'50+'}]

const DSVCS=[
  {id:'1',title:'Conceptualization & Design',description:'We translate your brief into a cohesive design concept that balances aesthetics, function and your budget — presented through drawings, mood boards and 3D renders'},
  {id:'2',title:'Project Management',description:'From procurement to contractor coordination, we manage every moving part so you can focus on your business while we deliver your space on time'},
  {id:'3',title:'Material Selection',description:'We source and specify finishes, fixtures and furniture from trusted suppliers — always balancing quality, durability and cost-effectiveness'},
  {id:'4',title:'Network Design',description:'Every space we design is spatially planned from the ground up — optimising flow, natural light, acoustics and the way people actually move through a room'},
  {id:'5',title:'Project Execution',description:'Our on-site supervisors are present throughout execution — ensuring every detail is built exactly as designed and every trade delivers to our standards'},
  {id:'6',title:'Turnkey Solutions',description:'For clients who want complete peace of mind, we deliver the entire interior from concept through to handover — with nothing left to chase'},
  {id:'7',title:'3D Visualisation',description:'Before a single wall is touched, you will see your space in photorealistic detail — allowing you to refine decisions with confidence and clarity'},
  {id:'8',title:'Lighting Design',description:'We layer ambient, task and accent lighting to create environments that look and feel extraordinary at every hour of the day'},
  {id:'9',title:'Façade Design',description:'First impressions are set before anyone walks through the door — we design exteriors that create anticipation and establish brand identity'},
  {id:'10',title:'Furniture Sourcing',description:'We source and specify custom and curated furniture — from statement pieces to everyday functional items — that complete the design narrative'},
  {id:'11',title:'Execution Supervision',description:'Dedicated site supervisors ensure that workmanship quality and material specifications are maintained from start to handover'},
  {id:'12',title:'Post-Handover Support',description:'Our relationship does not end at handover — we remain available for snagging, modifications and future phases of your space'},
]

export default function AboutClient({services,team,stats}:{services:Service[];team:Member[];stats:Stat[]}){
  const[dark,setDarkSt]=useState(false)
  const[mounted,setMt]=useState(false)
  const[av,setAv]=useState(0)
  const[of,setOf]=useState<number|null>(null)
  const intRef=useRef<ReturnType<typeof setInterval>|null>(null)
  const svcs=services.length?services:DSVCS
  const sts=stats.length?stats:DS
  const setDark=(v:boolean)=>{setDarkSt(v);try{localStorage.setItem('tpi-theme',v?'dark':'light')}catch{}}
  useEffect(()=>{setMt(true);try{if(localStorage.getItem('tpi-theme')==='dark')setDarkSt(true)}catch{}},[])
  const startCycle=()=>{intRef.current=setInterval(()=>setAv(v=>(v+1)%VALUES.length),3500)}
  const stopCycle=()=>{if(intRef.current)clearInterval(intRef.current)}
  useEffect(()=>{startCycle();return()=>stopCycle()},[])
  const t=tk(dark)

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}html,body{font-family:'DM Sans',sans-serif;font-size:14px;line-height:1.7}a{text-decoration:none}
        .ana{transition:color .2s}.ana:hover{color:${AC}!important}
        .athm{transition:all .2s}.athm:hover{transform:rotate(18deg) scale(1.1)}
        .avc{cursor:pointer;border:none;font-family:'DM Sans',sans-serif;text-align:left;transition:all .2s}
        .avd{animation:avF .35s ease both}@keyframes avF{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        .afq{cursor:pointer;transition:border-color .2s}.afq:hover{border-color:${AC}!important}
        .aib img{transition:transform .7s ease}.aib:hover img{transform:scale(1.04)}
        .asvc{transition:background .2s}
        .asec-card{transition:all .2s}.asec-card:hover{transform:translateY(-4px);border-color:${AC}!important}
        .amat{transition:border-color .2s}.amat:hover{border-top-color:${AC}!important}
        @media(max-width:900px){.asg{grid-template-columns:repeat(2,1fr)!important}.asecg{grid-template-columns:repeat(3,1fr)!important}.avg{grid-template-columns:1fr!important}.apd{grid-template-columns:1fr!important}.asts{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:600px){.asg,.asecg,.amtg{grid-template-columns:1fr!important}.ahg{grid-template-columns:1fr!important}.aftg{grid-template-columns:1fr!important;gap:28px!important}.anav,.asec{padding-left:20px!important;padding-right:20px!important}}
      `}</style>

      <div style={{minHeight:'100vh',background:t.paper,color:t.ink,transition:'background .32s,color .32s'}}>

        {/* NAV */}
        <nav className="anav" style={{position:'sticky',top:0,zIndex:100,background:dark?'rgba(17,16,16,.97)':'rgba(250,249,247,.97)',borderBottom:`1px solid ${t.border}`,height:68,display:'flex',alignItems:'center',padding:'0 56px',gap:36,backdropFilter:'blur(18px)',transition:'background .32s'}}>
          <Link href="/" style={{textDecoration:'none',flexShrink:0}}><Logo dark={dark}/></Link>
          <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:32}}>
            {([['/', 'Home'],['/projects','Projects'],['/about','About'],['/contact','Contact']] as [string,string][]).map(([href,label])=>(
              <Link key={href} href={href} className="ana" style={{fontSize:11,fontWeight:600,letterSpacing:'.14em',textTransform:'uppercase',color:href==='/about'?t.ink:t.muted,borderBottom:href==='/about'?`2px solid ${AC}`:'2px solid transparent',paddingBottom:2}}>{label}</Link>
            ))}
            <button className="athm" onClick={()=>setDark(!dark)} style={{width:36,height:36,borderRadius:18,border:`1.5px solid ${t.border}`,background:dark?'#2a2825':'#f0ede8',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,transition:'all .2s'}}>{dark?'☀️':'🌙'}</button>
          </div>
        </nav>

        {/* HERO — grand hotel lobby */}
        <section style={{position:'relative',height:'72vh',minHeight:520,overflow:'hidden'}}>
          <img src='https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&q=95' alt="The Prospective Interiors" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center',display:'block'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,.52) 0%,rgba(0,0,0,.18) 45%,rgba(0,0,0,.75) 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'0 40px'}}>
                        <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:'clamp(2.8rem,5vw,4.4rem)',lineHeight:1.06,color:'#fff',fontWeight:400,maxWidth:820,textShadow:'0 4px 32px rgba(0,0,0,.4)'}}>
              Small enough to care.<br/>
              <em style={{fontStyle:'italic',color:AC}}>Experienced enough to deliver.</em>
            </h1>
          </div>
        </section>

        {/* STATS */}
        <div style={{background:dark?'#0a0908':'#0f0e0d',padding:'40px 56px'}}>
          <div className="asts" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:0,maxWidth:960,margin:'0 auto'}}>
            {sts.map((s,i)=>(
              <React.Fragment key={i}>
                {i>0&&<div style={{width:'1px',background:'rgba(255,255,255,.08)'}}/>}
                <div style={{textAlign:'center',padding:'0 28px'}}>
                  <div style={{fontFamily:"'DM Serif Display',serif",fontSize:'2.6rem',color:AC,lineHeight:1,marginBottom:6}}>{s.value}</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:'.16em',textTransform:'uppercase',color:'rgba(255,255,255,.35)'}}>{s.label}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* FIRM STORY */}
        <section className="asec" style={{padding:'88px 56px',borderBottom:`1px solid ${t.border}`}}>
          <div className="ahg" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:72,alignItems:'center',maxWidth:1200,margin:'0 auto'}}>
            <div>
              <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.26em',textTransform:'uppercase',color:AC,marginBottom:22}}>— Our Story —</p>
              <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'2.8rem',lineHeight:1.1,color:t.ink,fontWeight:400,marginBottom:28}}>
                Twenty years of designing spaces people love to inhabit
              </h2>
              <p style={{fontSize:16,color:t.muted,lineHeight:1.95,marginBottom:24}}>
                In 2004, Prashant Bhandiya opened The Prospective Interiors in Pune with a single conviction — that a well-designed space has the power to change how people feel every single day. What began as a small residential practice in Baner has grown, one project at a time, into one of Maharashtra's most trusted design studios
              </p>
              <p style={{fontSize:15,color:t.muted,lineHeight:1.95,marginBottom:24,opacity:.88}}>
                Over two decades and 200+ projects, we have designed homes that feel like sanctuaries, restaurants that become destinations, offices that people genuinely enjoy coming to, and healthcare spaces that put patients at ease — all while staying true to the same values we started with
              </p>
              <p style={{fontSize:15,color:t.muted,lineHeight:1.95,opacity:.75}}>
                We are small enough to give every project our full attention, and experienced enough to deliver at the highest level — that is the promise we make to every client, every time
              </p>
            </div>
            <div className="aib" style={{height:480,borderRadius:6,overflow:'hidden',background:t.border}}>
              <img src='https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1400&q=90' alt="Interior Design Studio" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
            </div>
          </div>
        </section>

        {/* CORE VALUES */}
        <section className="asec" style={{padding:'88px 56px',background:dark?'#0a0908':'#0f0e0d',borderBottom:'1px solid rgba(255,255,255,.06)'}}>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.28em',textTransform:'uppercase',color:AC,marginBottom:14,textAlign:'center'}}>— What We Stand For —</p>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'2.8rem',color:'#f0ede8',marginBottom:52,fontWeight:400,textAlign:'center'}}>The 7 Core Values</h2>
          <div className="avg" style={{display:'grid',gridTemplateColumns:'280px 1fr',gap:24,alignItems:'start',maxWidth:1060,margin:'0 auto'}}>
            <div style={{display:'flex',flexDirection:'column',gap:5}} onMouseEnter={stopCycle} onMouseLeave={startCycle}>
              {VALUES.map((v,i)=>(
                <button key={v.v} className="avc" onClick={()=>setAv(i)}
                  style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',borderRadius:4,background:av===i?AC:'rgba(255,255,255,.04)',color:av===i?'#fff':'rgba(255,255,255,.48)',fontSize:13,fontWeight:500,border:`1px solid ${av===i?AC:'rgba(255,255,255,.07)'}`}}>
                  <span style={{fontSize:15,opacity:.75,flexShrink:0}}>{v.i}</span>
                  <span>{v.v}</span>
                  {av===i&&<span style={{marginLeft:'auto',fontSize:14}}>→</span>}
                </button>
              ))}
            </div>
            <div className="avd" key={av} style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:6,padding:'44px 52px',minHeight:240}}>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.16em',textTransform:'uppercase',color:AC,marginBottom:16}}>{String(av+1).padStart(2,'0')} of 07</div>
              <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:'2.4rem',color:'#f0ede8',marginBottom:20,lineHeight:1.12}}>{VALUES[av].v}</h3>
              <p style={{fontSize:15.5,color:'rgba(255,255,255,.55)',lineHeight:1.88,margin:0}}>{VALUES[av].d}</p>
            </div>
          </div>
        </section>

        {/* PRINCIPAL DESIGNER */}
        <section className="asec" style={{padding:'88px 56px',borderBottom:`1px solid ${t.border}`}}>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.28em',textTransform:'uppercase',color:AC,marginBottom:14,textAlign:'center'}}>— The Founder —</p>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'2.8rem',color:t.ink,marginBottom:52,fontWeight:400,textAlign:'center'}}>Present in every project from day one</h2>
          <div className="apd" style={{display:'grid',gridTemplateColumns:'380px 1fr',gap:64,alignItems:'start',maxWidth:1100,margin:'0 auto'}}>
            <div style={{height:520,borderRadius:6,background:dark?'#1a1917':'#f4f1ec',border:`1px solid ${t.border}`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:24}}>
              <div style={{width:110,height:110,borderRadius:55,background:'#c8935a',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'DM Serif Display',serif",fontSize:'2.8rem',color:'#fff',fontWeight:400,lineHeight:1,boxShadow:'0 8px 32px rgba(200,147,90,.35)'}}>PB</div>
              <div style={{textAlign:'center'}}>
                <div style={{fontFamily:"'DM Serif Display',serif",fontSize:'1.4rem',color:t.ink,marginBottom:8,lineHeight:1.2}}>Prashant Bhandiya</div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:'.16em',textTransform:'uppercase',color:'#c8935a'}}>Founder · Principal Designer</div>
              </div>
              <div style={{width:48,height:1.5,background:'rgba(200,147,90,.4)'}}/>
              <div style={{display:'flex',flexDirection:'column',gap:10,textAlign:'center'}}>
                {[['20+ Years','Experience'],['200+ Projects','Delivered'],['8 Sectors','Served'],['Pune','Maharashtra']].map(([val,label])=>(
                  <div key={label} style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.08em',color:t.muted}}>
                    <span style={{color:t.ink,fontWeight:600}}>{val}</span> {label}
                  </div>
                ))}
              </div>
            </div>
            <div style={{paddingTop:8}}>
              <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:'2.4rem',color:t.ink,marginBottom:8,fontWeight:400,lineHeight:1.1}}>Prashant Bhandiya</h3>
              <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.14em',textTransform:'uppercase',color:AC,marginBottom:32}}>Founder · Principal Designer</p>
              <p style={{fontSize:15.5,color:t.muted,lineHeight:1.92,marginBottom:18}}>
                Prashant started The Prospective Interiors in 2004 with a vision that has never wavered — to create spaces so well-considered that the people inside them barely notice the design, they simply feel at home, productive or inspired
              </p>
              <p style={{fontSize:15,color:t.muted,lineHeight:1.92,marginBottom:18,opacity:.88}}>
                Over two decades, he has led more than 200 projects across 8 sectors — always with the same level of personal involvement that defined the studio's earliest commissions. For Prashant, handing off a project to a junior team is never an option
              </p>
              <p style={{fontSize:15,color:t.muted,lineHeight:1.92,marginBottom:36,opacity:.75}}>
                His design philosophy is rooted in restraint — using only what is necessary, choosing materials that reward close inspection, and always allowing the client's personality to lead the brief rather than the designer's ego
              </p>
              <Link href="/contact" style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,letterSpacing:'.16em',textTransform:'uppercase',color:AC,borderBottom:`1px solid ${AC}`,paddingBottom:2,transition:'opacity .2s'}} onMouseEnter={e=>(e.currentTarget.style.opacity='.7')} onMouseLeave={e=>(e.currentTarget.style.opacity='1')}>Work With Prashant →</Link>
            </div>
          </div>
        </section>

        {/* FULL BLEED — dining room */}
        <section style={{position:'relative',height:'56vh',minHeight:380,overflow:'hidden'}}>
          <img src='https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1800&q=95' alt="Luxury Living Interior" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,.5) 0%,rgba(0,0,0,.2) 45%,rgba(0,0,0,.72) 100%)',display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'0 40px'}}>
            <div>
              <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'clamp(2rem,4vw,3rem)',color:'#fff',fontWeight:400,lineHeight:1.12,textShadow:'0 2px 20px rgba(0,0,0,.4)',marginBottom:20}}>
                Design is a conversation<br/>between space and the people who use it
              </h2>
              <Link href="/projects" style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(255,255,255,.78)',borderBottom:'1px solid rgba(255,255,255,.4)',paddingBottom:3,transition:'color .2s'}} onMouseEnter={e=>(e.currentTarget.style.color='#fff')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,.78)')}>See Our Work →</Link>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="asec" style={{padding:'88px 56px',borderBottom:`1px solid ${t.border}`}}>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.28em',textTransform:'uppercase',color:AC,marginBottom:14}}>— What We Offer —</p>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'2.8rem',color:t.ink,marginBottom:12,fontWeight:400}}>Our Services</h2>
          <p style={{fontSize:15,color:t.muted,lineHeight:1.85,maxWidth:560,marginBottom:52}}>We offer a complete range of interior design and project management services — from the first sketch to the final handover</p>
          <div className="asg" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:1,background:t.border}}>
            {svcs.map((s,i)=>(
              <div key={s.id} className="asvc" style={{background:t.surface,padding:'26px 24px 30px',cursor:'default'}}
                onMouseEnter={e=>(e.currentTarget.style.background=dark?'#222120':'#f6f3ef')}
                onMouseLeave={e=>(e.currentTarget.style.background=t.surface)}>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:AC,marginBottom:10,letterSpacing:'.08em'}}>{String(i+1).padStart(2,'0')}</div>
                <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:'1.05rem',color:t.ink,marginBottom:10,lineHeight:1.3}}>{s.title}</h3>
                <p style={{fontSize:13,color:t.muted,lineHeight:1.7,margin:0}}>{s.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTORS */}
        <section className="asec" style={{padding:'88px 56px',borderBottom:`1px solid ${t.border}`,background:t.subtle}}>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.28em',textTransform:'uppercase',color:AC,marginBottom:14}}>— Where We Work —</p>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'2.8rem',color:t.ink,marginBottom:12,fontWeight:400}}>Sectors We Serve</h2>
          <p style={{fontSize:15,color:t.muted,lineHeight:1.85,maxWidth:520,marginBottom:52}}>From luxury hospitality to civic institutions — we bring the same rigour and care to every sector we work in</p>
          <div className="asecg" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
            {SECTORS.map((s,i)=>(
              <div key={s.label} className="asec-card" style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:5,padding:'26px 22px 28px',cursor:'default',transition:'all .2s'}}>
                <div style={{fontSize:28,marginBottom:14}}>{s.icon}</div>
                <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:'1.05rem',color:t.ink,marginBottom:7,lineHeight:1.25}}>{s.label}</h3>
                <p style={{fontSize:12,color:t.muted,lineHeight:1.6,margin:0}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MATERIALS */}
        <section className="asec" style={{padding:'88px 56px',borderBottom:`1px solid ${t.border}`}}>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.28em',textTransform:'uppercase',color:AC,marginBottom:14}}>— How We Build —</p>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'2.8rem',color:t.ink,marginBottom:12,fontWeight:400}}>Materials & Finishes</h2>
          <p style={{fontSize:15,color:t.muted,lineHeight:1.85,maxWidth:520,marginBottom:52}}>The materials we specify define how a space feels as much as how it looks — we treat every selection as a considered design decision</p>
          <div className="amtg" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:0}}>
            {MATERIALS.map((m,i)=>(
              <div key={i} className="amat" style={{borderTop:`1px solid ${t.border}`,paddingTop:26,paddingBottom:26,paddingRight:36}}>
                <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:'1.1rem',color:t.ink,marginBottom:10}}>{m.name}</h3>
                <p style={{fontSize:13,color:t.muted,lineHeight:1.72}}>{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TEAM */}
        {team.length>0&&(
          <section className="asec" style={{padding:'88px 56px',borderBottom:`1px solid ${t.border}`,background:t.subtle}}>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.28em',textTransform:'uppercase',color:AC,marginBottom:14}}>— The People —</p>
            <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'2.8rem',color:t.ink,marginBottom:52,fontWeight:400}}>Our Team</h2>
            <div style={{display:'grid',gridTemplateColumns:`repeat(${Math.min(team.length,3)},1fr)`,gap:16}}>
              {team.map((m:Member)=>(
                <div key={m.id} className="aib" style={{borderRadius:5,overflow:'hidden',border:`1px solid ${t.border}`,background:t.surface,transition:'border-color .25s'}} onMouseEnter={e=>(e.currentTarget.style.borderColor=AC)} onMouseLeave={e=>(e.currentTarget.style.borderColor=t.border)}>
                  <div style={{height:300,background:t.border,overflow:'hidden'}}>
                    {m.photo?<img src={m.photo} alt={m.name} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>:<div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'DM Serif Display',serif",fontSize:'3.5rem',color:t.muted}}>{m.name.charAt(0)}</div>}
                  </div>
                  <div style={{padding:'18px 20px 22px'}}>
                    <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:'1.1rem',color:t.ink,marginBottom:4}}>{m.name}</h3>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:'.12em',textTransform:'uppercase',color:AC,marginBottom:10}}>{m.role}</div>
                    {m.bio&&<p style={{fontSize:12.5,color:t.muted,lineHeight:1.68}}>{m.bio}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="asec" style={{padding:'88px 56px',borderBottom:`1px solid ${t.border}`}}>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.28em',textTransform:'uppercase',color:AC,marginBottom:14}}>— Common Questions —</p>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'2.8rem',color:t.ink,marginBottom:52,fontWeight:400}}>FAQs</h2>
          <div style={{maxWidth:780,display:'flex',flexDirection:'column',gap:0}}>
            {[
              {q:'How long does a typical interior design project take?',a:'It depends on the scale and complexity of the brief. A residential apartment typically takes 3 to 6 months from concept to handover, while a larger commercial or hospitality project can range from 6 to 14 months. We provide a detailed project timeline at the start of every engagement so there are no surprises along the way'},
              {q:'Do you work on projects outside Pune?',a:'Absolutely — we have completed projects across Maharashtra and across India including Mumbai, Delhi NCR, Hyderabad, Bangalore and Ahmedabad, among others. The majority of our project management and site coordination work is handled by our dedicated execution team regardless of location'},
              {q:'Can we see a 3D visualisation before any work begins?',a:'Yes, always. 3D visualisation is a standard deliverable in our design process — you will see your space in photorealistic detail before a single wall is touched or a rupee committed to execution. This helps you refine decisions confidently and eliminates costly on-site changes'},
              {q:'What is your minimum project size?',a:'We work on projects of varying scales and do not have a fixed minimum. We are happy to have an initial conversation about your brief and assess whether we are the right fit for each other — reach out through our contact page and we will get back to you within 24 hours'},
            ].map((faq,i)=>(
              <div key={i} className="afq" style={{borderTop:`1px solid ${t.border}`}} onClick={()=>setOf(of===i?null:i)}>
                <div style={{padding:'20px 0',display:'flex',alignItems:'center',justifyContent:'space-between',gap:16}}>
                  <span style={{fontSize:15,fontWeight:500,color:t.ink,lineHeight:1.4}}>{faq.q}</span>
                  <span style={{fontSize:22,color:AC,flexShrink:0,transition:'transform .22s',transform:of===i?'rotate(45deg)':'rotate(0)',lineHeight:1}}>+</span>
                </div>
                {of===i&&(
                  <div style={{paddingBottom:22}}>
                    <p style={{fontSize:14.5,color:t.muted,lineHeight:1.88,margin:0}}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA — bedroom */}
        <section style={{position:'relative',height:'60vh',minHeight:420,overflow:'hidden'}}>
          <img src={INT.bedroom} alt="Luxury Bedroom Interior" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,.5) 0%,rgba(0,0,0,.2) 42%,rgba(0,0,0,.76) 100%)',display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'0 40px',flexDirection:'column'}}>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.28em',textTransform:'uppercase',color:'rgba(255,255,255,.55)',marginBottom:18}}>— Ready to Begin? —</p>
            <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'clamp(2rem,4vw,3.2rem)',color:'#fff',fontWeight:400,lineHeight:1.08,marginBottom:24,textShadow:'0 2px 20px rgba(0,0,0,.4)'}}>Let's create something extraordinary together</h2>
            <Link href="/contact" style={{display:'inline-flex',alignItems:'center',gap:8,background:AC,color:'#fff',padding:'15px 40px',borderRadius:4,fontWeight:700,fontSize:11,letterSpacing:'.16em',textTransform:'uppercase',transition:'opacity .2s'}} onMouseEnter={e=>(e.currentTarget.style.opacity='.85')} onMouseLeave={e=>(e.currentTarget.style.opacity='1')}>Start a Project →</Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{background:dark?'#0a0908':'#0f0e0d',color:'#f0ede8',padding:'60px 56px 40px'}}>
          <div className="aftg" style={{display:'grid',gridTemplateColumns:'1.5fr 1fr 1fr 1fr',gap:40,marginBottom:52}}>
            <div><Logo dark={false}/><p style={{fontSize:13.5,color:'#7a7570',lineHeight:1.82,margin:'20px 0 0',maxWidth:280}}>A multi-disciplinary interior design firm creating meaningful spaces across India since 2004</p></div>
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
    </>
  )
}
