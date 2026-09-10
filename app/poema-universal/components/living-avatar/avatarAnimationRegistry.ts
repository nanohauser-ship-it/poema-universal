import { AnimationClip, PropertyBinding } from 'three';
import type { Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { ClipInspection } from './types';

export function inspectClips(source:string, clips:AnimationClip[]):ClipInspection[]{
 return clips.map((clip,index)=>{
  const movingTracks=clip.tracks.filter(track=>{const stride=track.getValueSize();for(let i=stride;i<track.values.length;i++)if(Math.abs(track.values[i]-track.values[i%stride])>1e-5)return true;return false}).length;
  return {id:`${source}#${index}`,source,name:clip.name,duration:clip.duration,tracks:clip.tracks.length,movingTracks,useful:Number.isFinite(clip.duration)&&clip.duration>.15&&movingTracks>0,clip};
 });
}
export function chooseUsefulClip(entries:ClipInspection[]){return entries.find(c=>c.useful&&c.name.toLowerCase().includes('baselayer'))??entries.find(c=>c.useful)}
export function assertCompatible(root:Object3D,clip:AnimationClip){
 const missing=clip.tracks.filter(t=>!PropertyBinding.findNode(root,PropertyBinding.parseTrackName(t.name).nodeName));
 if(missing.length)throw new Error(`El clip no es compatible con el rig: ${missing.length} destinos ausentes.`);
}
/** Decode clips without instantiating the other nine meshes, materials or textures. */
export async function loadAnimationClips(url:string,signal:AbortSignal):Promise<AnimationClip[]>{
 const response=await fetch(url,{signal});if(!response.ok)throw new Error(`No se pudo cargar el movimiento (${response.status}).`);
 const raw=await response.arrayBuffer();if(signal.aborted)throw new DOMException('Cancelado','AbortError');
 const view=new DataView(raw);if(view.byteLength<20||view.getUint32(0,true)!==0x46546c67||view.getUint32(4,true)!==2)throw new Error('El archivo no es un GLB 2 válido.');
 const length=view.getUint32(12,true);const json=JSON.parse(new TextDecoder().decode(new Uint8Array(raw,20,length)));
 delete json.meshes;delete json.skins;delete json.materials;delete json.textures;delete json.images;delete json.extensions;delete json.extensionsUsed;delete json.extensionsRequired;
 for(const node of json.nodes??[]){delete node.mesh;delete node.skin;delete node.extensions;}
 const text=new TextEncoder().encode(JSON.stringify(json));const padded=Math.ceil(text.length/4)*4;const remainder=new Uint8Array(raw,20+length);const output=new Uint8Array(20+padded+remainder.length);output.fill(32,20,20+padded);output.set(text,20);output.set(remainder,20+padded);
 const header=new DataView(output.buffer);header.setUint32(0,0x46546c67,true);header.setUint32(4,2,true);header.setUint32(8,output.length,true);header.setUint32(12,padded,true);header.setUint32(16,0x4e4f534a,true);
 const gltf=await new GLTFLoader().parseAsync(output.buffer,'');if(signal.aborted)throw new DOMException('Cancelado','AbortError');return gltf.animations;
}
/** In-place is explicit: preserve vertical motion and all rotations, fix horizontal Hips travel. */
export function prepareClip(source:AnimationClip,inPlace:boolean){const clip=source.clone();if(inPlace){for(const track of clip.tracks){const path=PropertyBinding.parseTrackName(track.name);if(path.nodeName==='Hips'&&path.propertyName==='position'){const x=track.values[0],z=track.values[2];for(let i=0;i<track.values.length;i+=3){track.values[i]=x;track.values[i+2]=z;}}}}return clip}
