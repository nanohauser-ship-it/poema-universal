import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { AnimationMixer, Box3, Vector3, SkinnedMesh } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
const root=process.cwd();
const source=fs.readFileSync(new URL('../avatarAnimationRegistry.ts',import.meta.url),'utf8');
let code=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
code=code.replace(/from 'three'/g,`from '${pathToFileURL(path.join(root,'node_modules/three/build/three.module.js'))}'`).replace(/from 'three\/examples\/jsm\/loaders\/GLTFLoader.js'/g,`from '${pathToFileURL(path.join(root,'node_modules/three/examples/jsm/loaders/GLTFLoader.js'))}'`);
const registry=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const dir=path.join(root,'public/poema-universal/gran-avatar/animations');
const files=fs.readdirSync(dir).filter(f=>f.endsWith('.glb')).sort();
function geometryOnlyGLB(raw){const length=raw.readUInt32LE(12);const json=JSON.parse(raw.subarray(20,20+length).toString());delete json.images;delete json.textures;delete json.materials;for(const mesh of json.meshes)for(const primitive of mesh.primitives)delete primitive.material;const text=Buffer.from(JSON.stringify(json));const padded=Buffer.concat([text,Buffer.alloc((4-text.length%4)%4,32)]);const tail=raw.subarray(20+length);const header=Buffer.alloc(20);header.writeUInt32LE(0x46546c67,0);header.writeUInt32LE(2,4);header.writeUInt32LE(20+padded.length+tail.length,8);header.writeUInt32LE(padded.length,12);header.writeUInt32LE(0x4e4f534a,16);const result=Buffer.concat([header,padded,tail]);return result.buffer.slice(result.byteOffset,result.byteOffset+result.byteLength)}
const master=await new GLTFLoader().parseAsync(geometryOnlyGLB(fs.readFileSync(path.join(dir,files[0]))),'');
for(const file of files){test(`One rig / useful clip / finite deformation: ${file}`,async()=>{
 const clips=await registry.loadAnimationClips('data:application/octet-stream;base64,'+fs.readFileSync(path.join(dir,file)).toString('base64'),new AbortController().signal);
 const entries=registry.inspectClips(file,clips);const chosen=registry.chooseUsefulClip(entries);assert.ok(chosen);assert.equal(chosen.tracks,72);
 if(!/Walking|Running/.test(file)){assert.equal(chosen.name,'rigify_clip');assert.equal(entries.find(e=>e.name.includes('baselayer')).useful,false)}
 const avatar=clone(master.scene);registry.assertCompatible(avatar,chosen.clip);let bodies=0;avatar.traverse(n=>{if(n instanceof SkinnedMesh)bodies++});assert.equal(bodies,1);
 const before=chosen.clip.tracks.map(t=>Array.from(t.values));const clip=registry.prepareClip(chosen.clip,true);assert.deepEqual(chosen.clip.tracks.map(t=>Array.from(t.values)),before,'source clip must not change');
 const mixer=new AnimationMixer(avatar);const action=mixer.clipAction(clip).play();const left=avatar.getObjectByName('LeftHand');assert.ok(left);const points=[];
 for(let i=0;i<12;i++){mixer.setTime(clip.duration*i/12);avatar.updateMatrixWorld(true);avatar.traverse(n=>{if(n instanceof SkinnedMesh)n.skeleton.update()});const p=left.getWorldPosition(new Vector3());assert.ok(p.toArray().every(Number.isFinite));points.push(p.toArray())}
 assert.ok(points.some(p=>p.some((v,i)=>Math.abs(v-points[0][i])>1e-5)),'a real bone must move');
 const next=mixer.clipAction(clip.clone()).play();action.crossFadeTo(next,.65,false);for(let i=0;i<40;i++)mixer.update(1/60);assert.ok(next.getEffectiveWeight()>.99);
 mixer.stopAllAction();mixer.uncacheRoot(avatar);assert.equal(mixer.stats.actions.inUse,0);assert.equal(mixer.stats.bindings.inUse,0);
})}
test('cancelled loads do not yield a clip',async()=>{const abort=new AbortController();abort.abort();await assert.rejects(registry.loadAnimationClips('data:application/octet-stream;base64,AA==',abort.signal))});
