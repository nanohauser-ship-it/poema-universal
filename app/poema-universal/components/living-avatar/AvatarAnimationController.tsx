'use client';
import { useEffect,useMemo,useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AnimationClip, AnimationMixer, Bone, LoopOnce, QuaternionKeyframeTrack, VectorKeyframeTrack } from 'three';
import type { AnimationAction, Object3D, KeyframeTrack } from 'three';
import { AVATAR_SOURCE_FILES, animationUrl, CROSS_FADE_SECONDS } from './config';
import { assertCompatible, chooseUsefulClip, inspectClips, loadAnimationClips, prepareClip } from './avatarAnimationRegistry';
import { CHOREOGRAPHY, CHOREOGRAPHY_RETURN } from './ceremony';
import type { PlaybackReport, PlaybackRequest } from './types';
export default function AvatarAnimationController({root,baseClips,request,paused,onReport}:{root:Object3D;baseClips:AnimationClip[];request:PlaybackRequest|null;paused:boolean;onReport:(report:PlaybackReport)=>void}){
 const setup=useMemo(()=>{const tracks:KeyframeTrack[]=[];root.traverse(node=>{if(node instanceof Bone)tracks.push(new VectorKeyframeTrack(`${node.name}.position`,[0],node.position.toArray()),new QuaternionKeyframeTrack(`${node.name}.quaternion`,[0],node.quaternion.toArray()),new VectorKeyframeTrack(`${node.name}.scale`,[0],node.scale.toArray()))});return {mixer:new AnimationMixer(root),rest:new AnimationClip('__bind_rest',1,tracks)}},[root]);
 const cache=useRef(new Map<number,AnimationClip>());
 const runtime=useRef({elapsed:0,index:-1,running:false,returning:false,active:null as AnimationAction|null,retiring:[] as {action:AnimationAction;until:number}[]});
 useEffect(()=>{const r=runtime.current,clips=cache.current;setup.mixer.clipAction(setup.rest).play();return()=>{r.running=false;r.active=null;r.retiring=[];setup.mixer.stopAllAction();setup.mixer.uncacheRoot(root);clips.clear()}},[setup,root]);
 useEffect(()=>{
  const abort=new AbortController();const r=runtime.current;
  if(!request)return()=>abort.abort();
  r.running=false;onReport({state:'LOADING',message:'Preparando la coreografía.'});
  void(async()=>{try{
   // Load clips only. One rig and one mixer remain visible throughout the ceremony.
   for(const {source} of CHOREOGRAPHY){if(cache.current.has(source))continue;const clips=source===0?baseClips:await loadAnimationClips(animationUrl(AVATAR_SOURCE_FILES[source]),abort.signal);if(abort.signal.aborted)return;const selected=chooseUsefulClip(inspectClips(AVATAR_SOURCE_FILES[source],clips));if(!selected)throw new Error('Movimiento sin tracks útiles');assertCompatible(root,selected.clip);cache.current.set(source,prepareClip(selected.clip,true))}
   if(abort.signal.aborted)return;
   r.elapsed=0;r.index=-1;r.returning=false;r.running=true;
   onReport({state:'PLAYING',message:'El cuerpo recibe tu voz.'});
  }catch(error){if(!abort.signal.aborted)onReport({state:'ERROR',message:error instanceof Error?error.message:'No se pudo preparar la coreografía.'})}})();
  return()=>abort.abort();
 },[request,root,baseClips,onReport]);
 useFrame((_,dt)=>{
  const r=runtime.current;if(paused||document.hidden)return;const delta=Math.min(dt,.05);
  if(r.running){
   r.elapsed+=delta;
   const cue=CHOREOGRAPHY[r.index+1];
   if(cue&&r.elapsed>=cue.at){
    const next=setup.mixer.clipAction(cache.current.get(cue.source)!);next.reset().setLoop(LoopOnce,1).setEffectiveWeight(cue.source===0?1:.38).play();next.clampWhenFinished=true;
    const idle=setup.mixer.clipAction(setup.rest);idle.setEffectiveWeight(1).play();if(cue.source===0)idle.fadeOut(CROSS_FADE_SECONDS);else idle.fadeIn(CROSS_FADE_SECONDS);
    const previous=r.active;if(previous&&previous!==idle){previous.crossFadeTo(next,CROSS_FADE_SECONDS,false);r.retiring.push({action:previous,until:r.elapsed+CROSS_FADE_SECONDS})}else next.fadeIn(CROSS_FADE_SECONDS);r.active=next;r.index++;
   }
   if(!r.returning&&r.elapsed>=CHOREOGRAPHY_RETURN){const idle=setup.mixer.clipAction(setup.rest);idle.reset().setEffectiveWeight(1).play();if(r.active){r.active.crossFadeTo(idle,1.1,false);r.retiring.push({action:r.active,until:r.elapsed+1.1})}r.active=idle;r.returning=true}
   for(let i=r.retiring.length-1;i>=0;i--)if(r.elapsed>=r.retiring[i].until){r.retiring[i].action.stop();r.retiring.splice(i,1)}
   if(r.returning&&r.retiring.length===0){r.running=false;onReport({state:'IDLE',message:'La presencia espera.'})}
  }
  setup.mixer.update(delta);
 });
 return null;
}
