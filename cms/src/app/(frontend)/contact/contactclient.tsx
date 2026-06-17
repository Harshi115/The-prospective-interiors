'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const AC='#c8935a'
const INT={living:'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1800&q=95'}
const TYPES=['Residential','Commercial','Hospitality','Industrial','Healthcare','Retail','Educational','Other']

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

export default function ContactClient(){
  const[dark,setDarkSt]=useState(false)
  const[mounted,setMt]=useState(false)
  const[form,setForm]=useState({name:'',email:'',phone:'',projectType:'',message:''})
  const[status,setStat]=useState<'idle'|'loading'|'success'|'error'>('idle')
  const[err,setErr]=useState('')
  const[foc,setFoc]=useState<string|null>(null)

  const setDark=(v:boolean)=>{setDarkSt(v);try{localStorage.setItem('tpi-theme',v?'dark':'light')}catch{}}
  useEffect(()=>{setMt(true);try{if(localStorage.getItem('tpi-theme')==='dark')setDarkSt(true)}catch{}},[])

  const ch=(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>setForm(p=>({...p,[e.target.name]:e.target.value}))

  async function submit(e:React.FormEvent){
    e.preventDefault()
    if(!form.name.trim()){setErr('Please enter your name');return}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)){setErr('Please enter a valid email');return}
    if(!form.message.trim()||form.message.trim().length<10){setErr('Message must be at least 10 characters');return}
    setErr('');setStat('loading')
    try{
      const res=await fetch('/api/inquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,status:'New',submittedAt:new Date().toISOString().split('T')[0]})})
      const data=await res.json()
      if(!res.ok)throw new Error(data?.error||`Error ${res.status}`)
      setStat('success');setForm({name:'',email:'',phone:'',projectType:'',message:''})
    }catch(e:any){setStat('error');setErr(e.message||'Something went wrong')}
  }

  const t=tk(dark)
  const fld=(n:string):React.CSSProperties=>({width:'100%',padding:'13px 16px',border:`1.5px solid ${foc===n?AC:t.border}`,borderRadius:4,background:foc===n?(dark?'#222120':'#fff'):t.subtle,color:t.ink,fontSize:14,fontFamily:"'DM Sans',sans-serif",outline:'none',transition:'border-color .18s,background .18s'})

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}html,body{font-family:'DM Sans',sans-serif;font-size:14px;line-height:1.7}a{text-decoration:none}
        .cna{transition:color .2s}.cna:hover{color:${AC}!important}
        .cthm{transition:all .2s}.cthm:hover{transform:rotate(18deg) scale(1.1)}
        .csub{transition:opacity .18s,transform .12s}.csub:hover:not(:disabled){opacity:.85}.csub:active:not(:disabled){transform:scale(.98)}
        .cib img{transition:transform .5s ease}.cib:hover img{transform:scale(1.04)}
        ::placeholder{color:${t.muted};opacity:.6}
        select option{background:${t.surface};color:${t.ink}}
        @media(max-width:900px){.clayout{grid-template-columns:1fr!important}.cinfo-grid{grid-template-columns:1fr 1fr!important}}
        @media(max-width:600px){.clayout{grid-template-columns:1fr!important}.cinfo-grid{grid-template-columns:1fr!important}.cnav,.cft{padding-left:20px!important;padding-right:20px!important}.cftg{grid-template-columns:1fr!important;gap:28px!important}}
      `}</style>

      <div style={{minHeight:'100vh',background:t.paper,color:t.ink,transition:'background .32s,color .32s'}}>

        {/* NAV */}
        <nav className="cnav" style={{position:'sticky',top:0,zIndex:100,background:dark?'rgba(17,16,16,.97)':'rgba(250,249,247,.97)',borderBottom:`1px solid ${t.border}`,height:68,display:'flex',alignItems:'center',padding:'0 56px',gap:36,backdropFilter:'blur(18px)'}}>
          <Link href="/" style={{textDecoration:'none',flexShrink:0}}><Logo dark={dark}/></Link>
          <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:32}}>
            {([['/', 'Home'],['/projects','Projects'],['/about','About'],['/contact','Contact']] as [string,string][]).map(([href,label])=>(
              <Link key={href} href={href} className="cna" style={{fontSize:11,fontWeight:600,letterSpacing:'.14em',textTransform:'uppercase',color:href==='/contact'?t.ink:t.muted,borderBottom:href==='/contact'?`2px solid ${AC}`:'2px solid transparent',paddingBottom:2}}>{label}</Link>
            ))}
            <button className="cthm" onClick={()=>setDark(!dark)} style={{width:36,height:36,borderRadius:18,border:`1.5px solid ${t.border}`,background:dark?'#2a2825':'#f0ede8',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15}}>{dark?'☀️':'🌙'}</button>
          </div>
        </nav>

        {/* HERO */}
        <section style={{position:'relative',height:'52vh',minHeight:380,overflow:'hidden'}}>
          <img src={INT.living} alt="Contact" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,.55) 0%,rgba(0,0,0,.22) 45%,rgba(0,0,0,.72) 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'0 40px'}}>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.32em',textTransform:'uppercase',color:'rgba(255,255,255,.55)',marginBottom:22}}>— Let's Connect —</p>
            <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:'clamp(2.4rem,5vw,4rem)',lineHeight:1.05,color:'#fff',fontWeight:400,maxWidth:760,textShadow:'0 4px 32px rgba(0,0,0,.4)'}}>
              Let's create something<br/><em style={{fontStyle:'italic',color:AC}}>extraordinary together</em>
            </h1>
          </div>
        </section>

        {/* ══ MAIN — Form + Info ══ */}
        <div className="clayout" style={{display:'grid',gridTemplateColumns:'1fr 1fr',minHeight:'70vh'}}>

          {/* LEFT — FULL FORM */}
          <div style={{padding:'64px 56px',borderRight:`1px solid ${t.border}`}}>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.24em',textTransform:'uppercase',color:AC,marginBottom:12}}>— Project Inquiry —</p>
            <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'2.2rem',color:t.ink,marginBottom:8,fontWeight:400,lineHeight:1.15}}>Tell Us About Your Project</h2>
            <p style={{fontSize:14.5,color:t.muted,lineHeight:1.8,marginBottom:36}}>Fill in the form below and we will get back to you within 24 hours</p>

            {status==='success'?(
              <div style={{background:dark?'rgba(200,147,90,.12)':'rgba(200,147,90,.08)',border:`1.5px solid ${AC}`,borderRadius:8,padding:'36px',textAlign:'center'}}>
                <div style={{width:64,height:64,borderRadius:32,background:AC,display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,margin:'0 auto 20px',color:'#fff'}}>✓</div>
                <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:'1.6rem',color:t.ink,marginBottom:8,fontWeight:400}}>Inquiry Received!</h3>
                <p style={{color:t.muted,fontSize:14,lineHeight:1.75,marginBottom:24}}>Thank you for reaching out. We will be in touch within 24 hours</p>
                <button onClick={()=>setStat('idle')} style={{padding:'11px 28px',background:AC,border:'none',borderRadius:4,color:'#fff',fontSize:11,fontWeight:700,cursor:'pointer',letterSpacing:'.14em',textTransform:'uppercase',fontFamily:"'DM Sans',sans-serif"}}>Send Another →</button>
              </div>
            ):(
              <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:18}}>
                {/* Name + Email */}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                  <div>
                    <label style={{display:'block',fontSize:11,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:t.muted,marginBottom:8}}>Full Name *</label>
                    <input name="name" type="text" placeholder="Your full name" value={form.name} onChange={ch} onFocus={()=>setFoc('name')} onBlur={()=>setFoc(null)} style={fld('name')} required/>
                  </div>
                  <div>
                    <label style={{display:'block',fontSize:11,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:t.muted,marginBottom:8}}>Email *</label>
                    <input name="email" type="email" placeholder="your@email.com" value={form.email} onChange={ch} onFocus={()=>setFoc('email')} onBlur={()=>setFoc(null)} style={fld('email')} required/>
                  </div>
                </div>

                {/* Phone + Project Type */}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                  <div>
                    <label style={{display:'block',fontSize:11,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:t.muted,marginBottom:8}}>Phone</label>
                    <input name="phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={ch} onFocus={()=>setFoc('phone')} onBlur={()=>setFoc(null)} style={fld('phone')}/>
                  </div>
                  <div>
                    <label style={{display:'block',fontSize:11,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:t.muted,marginBottom:8}}>Project Type</label>
                    <div style={{position:'relative'}}>
                      <select name="projectType" value={form.projectType} onChange={ch} onFocus={()=>setFoc('projectType')} onBlur={()=>setFoc(null)} style={{...fld('projectType'),appearance:'none',cursor:'pointer'}}>
                        <option value="">Select type...</option>
                        {TYPES.map(ty=><option key={ty} value={ty}>{ty}</option>)}
                      </select>
                      <span style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:t.muted,fontSize:12}}>▾</span>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label style={{display:'block',fontSize:11,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:t.muted,marginBottom:8}}>Message *</label>
                  <textarea name="message" rows={6} placeholder="Describe your project — location, size, style, timeline and budget..." value={form.message} onChange={ch} onFocus={()=>setFoc('message')} onBlur={()=>setFoc(null)} style={{...fld('message'),resize:'vertical',lineHeight:1.65}} required/>
                </div>

                {/* Error */}
                {(err||status==='error')&&(
                  <div style={{background:dark?'rgba(201,48,48,.15)':'#fce8e8',border:'1px solid #c93030',borderRadius:4,padding:'11px 16px',color:'#c93030',fontSize:13}}>⚠ {err||'Something went wrong — please try again'}</div>
                )}

                {/* Submit */}
                <button type="submit" className="csub" disabled={status==='loading'} style={{padding:'15px',background:AC,border:'none',borderRadius:4,color:'#fff',fontSize:11,fontWeight:700,cursor:status==='loading'?'not-allowed':'pointer',opacity:status==='loading'?.7:1,letterSpacing:'.16em',textTransform:'uppercase',fontFamily:"'DM Sans',sans-serif",display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                  {status==='loading'?<>⏳ Sending Inquiry…</>:<>Submit Inquiry →</>}
                </button>

                <p style={{fontSize:11.5,color:t.muted,textAlign:'center'}}>We respond within 24 hours · Your information is private</p>
              </form>
            )}
          </div>

          {/* RIGHT — Info + Map */}
          <div style={{background:t.subtle}}>
            {/* Office Info */}
            <div style={{padding:'64px 56px 40px'}}>
              <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.24em',textTransform:'uppercase',color:AC,marginBottom:20}}>— Find Us —</p>
              <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:'2rem',color:t.ink,marginBottom:32,fontWeight:400,lineHeight:1.2}}>Our Studio</h2>

              <div className="cinfo-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:0}}>
                {[
                  {icon:'📍',label:'Address',lines:['101, Design House','Baner Road, Pune','Maharashtra 411045'],href:null},
                  {icon:'✉',label:'Email',lines:['info@prospectiveinteriors.com'],href:'mailto:info@prospectiveinteriors.com'},
                  {icon:'📞',label:'Phone',lines:['+91 98765 43210'],href:'tel:+919876543210'},
                  {icon:'🕐',label:'Studio Hours',lines:['Mon – Sat','9:00 AM – 7:00 PM'],href:null},
                ].map(item=>(
                  <div key={item.label} style={{padding:'20px 0',borderBottom:`1px solid ${t.border}`,paddingRight:20}}>
                    <div style={{display:'flex',alignItems:'flex-start',gap:12}}>
                      <div style={{width:38,height:38,borderRadius:19,background:dark?'rgba(200,147,90,.15)':'rgba(200,147,90,.1)',border:`1px solid ${AC}33`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>{item.icon}</div>
                      <div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:'.14em',textTransform:'uppercase',color:t.muted,marginBottom:5}}>{item.label}</div>
                        {item.href
                          ?<a href={item.href} style={{fontSize:13.5,color:t.ink,lineHeight:1.6,transition:'color .2s'}} onMouseEnter={e=>(e.currentTarget.style.color=AC)} onMouseLeave={e=>(e.currentTarget.style.color=t.ink)}>{item.lines[0]}</a>
                          :item.lines.map((l,i)=><div key={i} style={{fontSize:13.5,color:t.ink,lineHeight:1.6}}>{l}</div>)
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ══ GOOGLE MAP EMBED — Baner, Pune ══ */}
            <div style={{margin:'0 56px 56px',borderRadius:8,overflow:'hidden',border:`1px solid ${t.border}`,boxShadow:`0 4px 24px rgba(0,0,0,${dark?'.3':'.07'})`}}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.7649859854785!2d73.77667!3d18.5590!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9d9ee343!2sBaner%2C%20Pune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1624000000000!5m2!1sen!2sin"
                width="100%"
                height="320"
                style={{border:0,display:'block',filter:dark?'invert(90%) hue-rotate(180deg)':'none',transition:'filter .32s'}}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="The Prospective Interiors — Baner, Pune"
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="cft" style={{background:dark?'#0a0908':'#0f0e0d',color:'#f0ede8',padding:'60px 56px 40px'}}>
          <div className="cftg" style={{display:'grid',gridTemplateColumns:'1.5fr 1fr 1fr 1fr',gap:40,marginBottom:52}}>
            <div><Logo dark={false}/><p style={{fontSize:13.5,color:'#7a7570',lineHeight:1.8,margin:'20px 0 0',maxWidth:280}}>A multi-disciplinary interior design firm creating meaningful spaces across India since 2004</p></div>
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
