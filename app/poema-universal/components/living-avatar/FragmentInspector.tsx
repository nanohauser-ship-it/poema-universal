'use client';
import { useEffect, useRef } from 'react';
import type { Contribution } from './ceremony';
import styles from '../../cuerpo-vivo/living-avatar.module.css';
export default function FragmentInspector({selected,contributions,onSelect,onClose}:{selected:Contribution|null;contributions:Contribution[];onSelect:(value:Contribution)=>void;onClose:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const node=dialog.current;if(!node)return;if(selected&&!node.open)node.showModal();if(!selected&&node.open)node.close()},[selected]);
 const index=selected?contributions.findIndex(c=>c.id===selected.id):-1;
 return <dialog ref={dialog} className={styles.fragmentDialog} aria-labelledby="memory-title" onCancel={onClose} onClose={onClose}><button className={styles.closeMemory} onClick={onClose} aria-label="Cerrar la huella">Cerrar</button><span id="memory-title">UNA VOZ PERMANECE</span>{selected&&<><blockquote>{selected.text}</blockquote><time dateTime={selected.created_at}>{new Date(selected.created_at).toLocaleDateString('es',{day:'numeric',month:'long',year:'numeric'})}</time><p className={styles.memoryId}>ID · {selected.id}</p><nav aria-label="Recorrer las huellas"><button disabled={index<=0} onClick={()=>onSelect(contributions[index-1])}>Anterior</button><span>{index+1} / {contributions.length}</span><button disabled={index<0||index>=contributions.length-1} onClick={()=>onSelect(contributions[index+1])}>Siguiente</button></nav><small>Guardada en este dispositivo.</small></>}</dialog>;
}
