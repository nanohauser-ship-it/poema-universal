'use client';
import Link from 'next/link';
import { useEffect,useRef } from 'react';
import SuspendedStudy from './SuspendedStudy';
import styles from './threshold.module.css';
export default function Threshold(){
 const root=useRef<HTMLElement>(null);
 useEffect(()=>{
  const node=root.current;if(!node)return;
  const preference=matchMedia('(prefers-reduced-motion: reduce)');let frame=0,x=0,y=0,tx=0,ty=0,progress=0;
  const draw=()=>{frame=0;x+=(tx-x)*.055;y+=(ty-y)*.055;node.style.setProperty('--px',`${x.toFixed(3)}px`);node.style.setProperty('--py',`${y.toFixed(3)}px`);node.style.setProperty('--scroll',String(progress));if(Math.abs(tx-x)+Math.abs(ty-y)>.025)frame=requestAnimationFrame(draw)};
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(draw)};
  const scroll=()=>{progress=preference.matches?0:Math.min(1,Math.max(0,-node.getBoundingClientRect().top/innerHeight));schedule()};
  const pointer=(e:PointerEvent)=>{if(preference.matches||e.pointerType!=='mouse')return;tx=(e.clientX/innerWidth-.5)*8;ty=(e.clientY/innerHeight-.5)*6;schedule()};
  const reset=()=>{tx=ty=0;schedule()};const change=()=>{if(preference.matches){x=y=tx=ty=progress=0}scroll()};
  window.addEventListener('pointermove',pointer,{passive:true});window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',scroll);document.addEventListener('pointerleave',reset);preference.addEventListener('change',change);scroll();
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('pointermove',pointer);window.removeEventListener('scroll',scroll);window.removeEventListener('resize',scroll);document.removeEventListener('pointerleave',reset);preference.removeEventListener('change',change)};
 },[]);
 return <main ref={root} className={styles.experience}><section className={styles.stage} aria-label="Primer acto: el umbral"><header className={styles.header}><span className={styles.edition}>POEMA UNIVERSAL<br/>EDICIÓN — 2026</span><nav aria-label="Recorrido de Poema Universal"><Link href="/poema-universal/antologia-viva">VOCES</Link><Link href="/poema-universal">OBRA</Link><Link href="/poema-universal/sala-corazon-vivo">CORAZÓN</Link><Link href="/poema-universal/atlas-interior">ATLAS</Link></nav><span className={styles.act}>ACTO I / EL UMBRAL</span></header><h1 className={styles.semantic}>Poema Universal</h1><div className={styles.backTitle} aria-hidden="true"><span>POEMA</span></div><div className={styles.objectPosition}><figure className={styles.object}><SuspendedStudy/><figcaption>ESTUDIO DE TERRITORIO · MAQUETA PROVISIONAL</figcaption></figure></div><div className={styles.fragments} aria-hidden="true"><i/><i/><i/></div><div className={styles.frontTitle} aria-hidden="true"><span>UNIVERSAL</span></div><aside className={styles.manifesto}>UNA OBRA<br/>COLECTIVA<br/>MUNDIAL<span>2026</span></aside><p className={styles.common}>SESENTA DESCONOCIDOS.<br/>UNA VOZ COMÚN.</p><footer className={styles.footer}><p>60 VOCES<br/>INFINITAS POSIBILIDADES<br/>UN SOLO AÑO</p><span className={styles.scrollCue}>DESPLAZA PARA ESCUCHAR EL SILENCIO <span aria-hidden="true">↓</span></span><Link className={styles.enter} href="/poema-universal/cuerpo-vivo">ENTRAR <span aria-hidden="true">↗</span></Link></footer></section></main>
}
