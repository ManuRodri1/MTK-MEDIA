'use client';
import {useEffect,useRef,useState} from 'react';
import {copy} from './copy';
import {parseGuestName} from '@/lib/invitation-guest';
export default function Invitation({ initialLanguage }: { initialLanguage: 'es' | 'en' }){
 const [lang,setLang]=useState<'es'|'en'>(initialLanguage); const t=copy[lang];
 const [step,setStep]=useState(0);const [status,setStatus]=useState<'idle'|'saving'|'success'|'error'>('idle');const [error,setError]=useState('');
 const [bringingGuest,setBringingGuest]=useState(false);
 const [guestName,setGuestName]=useState('');
 const guestInput=useRef<HTMLInputElement>(null);
 const [guestError,setGuestError]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null);const section=useRef<HTMLElement>(null);const trigger=useRef<HTMLButtonElement>(null);
 useEffect(()=>{if(step>0)section.current?.focus({preventScroll:true});},[step]);
 function close(){dialog.current?.close();trigger.current?.focus();}
 async function submit(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();
  if(status==='saving')return;
  const data=new FormData(e.currentTarget);
  const name=String(data.get('name')||'').trim();
  const email=String(data.get('email')||'').trim();
  if(name.length<2||name.length>100||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setError(t.invalid);return;}
  const guest=parseGuestName(bringingGuest?guestName:undefined);
  if(!guest.valid){setGuestError(true);guestInput.current?.focus();return;}
  setStatus('saving');setError('');setGuestError(false);
  try{
   const res=await fetch('/api/invitacion/rsvp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,website:data.get('website'),language:lang,...(guest.name===undefined?{}:{guest_name:guest.name})})});
   const body=await res.json() as {ok?:boolean,error?:string};
   if(!res.ok||!body.ok)throw new Error();
   setStatus('success');
  }catch{setStatus('error');setError(t.failed);}
 }

 return <main className="mtk-invitation" lang={lang}>
 <nav className="language-selector" aria-label="Language / Idioma"><button aria-pressed={lang==='es'} onClick={()=>setLang('es')} lang="es">ES</button><span aria-hidden="true">/</span><button aria-pressed={lang==='en'} onClick={()=>setLang('en')} lang="en">EN</button></nav>
 <div className="invitation-shell">
 {step===0?<section className="paper intro-paper" key="intro"><h1 className="sr-only">#SubioLaLibra</h1><img className="original-hashtag" src="/invitacion/subio-la-libra.png" alt=""/><button className="quiet-button open-invitation" onClick={()=>setStep(1)}>{t.open} <span aria-hidden="true">↓</span></button></section>:
 step===1?<section className="paper details-paper bilingual-details" key="details" ref={section} tabIndex={-1}><div className="detail-content"><h1>{t.join}</h1><div className="detail-rule"/><p className="detail-location">{t.place}<br/>{t.unit}<br/><span className="detail-city">San Felipe de Puerto Plata</span></p><div className="detail-rule"/><p className="detail-date">{t.month}<br/>7:00 PM</p><p className="detail-zone">{t.zone} · 2026</p><img className="detail-logo" src="/invitacion/mtk-logo.png" alt="MTK Media Creative Studio"/></div><div className="paper-actions"><button className="quiet-button" onClick={()=>setStep(2)}>{t.confirm} <span aria-hidden="true">→</span></button><button className="back" onClick={()=>setStep(0)}>{t.back}</button></div></section>:
 step===2?<section className="paper choice-paper" key="confirm" ref={section} tabIndex={-1}><p className="spaced">{t.coming}</p><div className="hairline"/><h1 className="question">{t.question}</h1><div className="choices"><button className="quiet-button yes" ref={trigger} onClick={()=>{setStatus('idle');setError('');setGuestError(false);dialog.current?.showModal();}}>{t.yes}</button><button className="quiet-button no" onClick={()=>setStep(3)}>{t.no}</button></div><button className="back" onClick={()=>setStep(1)}>{t.view}</button><img className="paper-logo" src="/invitacion/mtk-logo.png" alt="MTK Media Creative Studio"/></section>:
 <section className="paper declined-paper" key="declined" ref={section} tabIndex={-1}><h1 className="brand-reply"><span>Y TU</span><span>ACOTAO!</span></h1><button className="back change-choice" onClick={()=>setStep(2)}>← {t.change}</button><img className="paper-logo" src="/invitacion/mtk-logo.png" alt="MTK Media Creative Studio"/></section>}
 </div>
 <dialog aria-label={t.confirm} ref={dialog} onCancel={()=>trigger.current?.focus()} onClick={e=>{if(e.target===dialog.current)close();}}><div className="modal"><button className="close" onClick={close} aria-label={t.close}>×</button>{status==='success'?<div className="success" role="status"><div className="check">✓</div><p className="eyebrow">{t.saved}</p><h2>{t.part}</h2><p>{t.success}<br/>{t.see}</p><button className="primary" onClick={close}>{t.there} ↗</button></div>:<><p className="eyebrow">{t.night}</p><h2>{t.signup}</h2><p className="modal-intro">{t.intro}</p><form noValidate onSubmit={submit}><label htmlFor="name">{t.name}</label><input id="name" name="name" autoComplete="name" minLength={2} maxLength={100} placeholder={t.namePlaceholder} required autoFocus/><label htmlFor="email">{t.email}</label><input id="email" name="email" type="email" autoComplete="email" maxLength={254} placeholder={t.emailPlaceholder} required/><div className="guest-option"><label className="guest-toggle" htmlFor="bringing-guest"><input id="bringing-guest" type="checkbox" checked={bringingGuest} aria-controls="guest-name-panel" aria-expanded={bringingGuest} disabled={status==='saving'} onChange={e=>{setBringingGuest(e.target.checked);setGuestError(false);if(!e.target.checked)setGuestName('');}}/><span>{t.bringingGuest}</span></label>{bringingGuest&&<div id="guest-name-panel"><label htmlFor="guest-name">{t.guestName}</label><input ref={guestInput} id="guest-name" name="guest_name" value={guestName} onChange={e=>{setGuestName(e.target.value);setGuestError(false);}} minLength={2} maxLength={100} required disabled={status==='saving'} autoComplete="off" placeholder={t.guestPlaceholder} aria-invalid={guestError} aria-describedby={guestError?'guest-error':undefined}/>{guestError&&<p id="guest-error" className="error" role="alert">{t.guestInvalid}</p>}</div>}</div><div className="honeypot" aria-hidden="true"><label>{t.website}<input name="website" tabIndex={-1} autoComplete="off"/></label></div><p className="privacy">{t.privacy}</p>{error&&<p className="error" role="alert">{error}</p>}<button className="primary" disabled={status==='saving'} type="submit">{status==='saving'?t.saving:t.confirm+' ↗'}</button></form></>}</div></dialog>
 </main>
}