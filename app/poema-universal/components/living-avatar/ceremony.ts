export const PHASES = [ ['SENSING',3],['ATTRACTING',4.4],['CAPTURING',3.1],['ABSORBING',3],['PULSE',3],['INCORPORATING',3],['REVEAL',7],['RETURNING',2] ] as const;
export type CeremonyState='DORMANT'|'IDLE'|typeof PHASES[number][0];
export function phaseAt(seconds:number):{state:CeremonyState;progress:number}{let start=0;for(const [state,duration] of PHASES){if(seconds<start+duration)return {state,progress:Math.max(0,(seconds-start)/duration)};start+=duration}return {state:'IDLE',progress:1}}
export type Contribution={id:string;text:string;created_at:string;position_seed:number};
const KEY='poema-universal-cuerpo-vivo-demo-v1';
export const demoRepository={
 getRecentContributions():Contribution[]{const raw=localStorage.getItem(KEY);if(!raw)return [];const entries:unknown=JSON.parse(raw);if(!Array.isArray(entries))throw new Error('Archivo local inválido');return entries.filter((v):v is Contribution=>typeof v?.id==='string'&&typeof v?.text==='string'&&typeof v?.created_at==='string'&&typeof v?.position_seed==='number')},
 getContribution(id:string){return this.getRecentContributions().find(v=>v.id===id)},
 createContribution(text:string){const trimmed=text.trim();if(!trimmed||Array.from(trimmed).length>160)throw new Error('Escribe entre 1 y 160 caracteres.');const entry={id:crypto.randomUUID(),text:trimmed,created_at:new Date().toISOString(),position_seed:Math.random()};const entries=this.getRecentContributions();localStorage.setItem(KEY,JSON.stringify([...entries,entry]));return entry}
};

// Continuous envelopes keep the arrival and the heartbeat connected across phase boundaries.
export const ease = (t:number) => {const x=Math.max(0,Math.min(1,t));return x*x*(3-2*x)};
export function ceremonyMotion(state:CeremonyState,progress:number){
 const p=ease(progress);
 const path=state==='ATTRACTING'?.5*p:state==='CAPTURING'?.5+.3*p:state==='ABSORBING'?.8+.2*p:0;
 const energy=state==='ABSORBING'?.45*p:state==='PULSE'?(progress<.28?.45+.55*ease(progress/.28):1-ease((progress-.28)/.72)):0;
 return {path,energy,scale:state==='SENSING'? .85+.15*p:state==='ABSORBING'?1-p:1};
}

// Sources are explicit file indices, not guessed semantic names for Meshy UUIDs.
// The approved receiving gesture (0) begins at CAPTURING.
export const CHOREOGRAPHY = [
 {at:0,source:1},{at:3,source:2},{at:6,source:8},
 {at:7.4,source:0},{at:10.5,source:4},{at:13.5,source:6},
 {at:16.5,source:3},{at:19.5,source:5},{at:22.5,source:9},
 {at:23.5,source:7},
] as const;
export const CHOREOGRAPHY_RETURN=26.8;
