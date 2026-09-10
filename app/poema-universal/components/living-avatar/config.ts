export const AVATAR_SOURCE_FILES = [
  'Meshy_AI_Gilded_Apotheosis_biped_Animation_01a08b9c-c56b-716d-896e-45367ceafe0f_withSkin.glb',
  'Meshy_AI_Gilded_Apotheosis_biped_Animation_01a08b9e-8770-75db-a188-d4c16774a1d3_withSkin.glb',
  'Meshy_AI_Gilded_Apotheosis_biped_Animation_01a08ba7-b021-7442-b133-a4c4c34e1453_withSkin.glb',
  'Meshy_AI_Gilded_Apotheosis_biped_Animation_01a08bb5-e62f-70bf-a1f4-4979b1d240c4_withSkin.glb',
  'Meshy_AI_Gilded_Apotheosis_biped_Animation_01a08bb8-468c-7416-94b7-8b551e7074f4_withSkin.glb',
  'Meshy_AI_Gilded_Apotheosis_biped_Animation_01a08bbb-85e5-765f-a858-362b8e7316f7_withSkin.glb',
  'Meshy_AI_Gilded_Apotheosis_biped_Animation_01a08bbf-d589-711a-8c19-149b40117699_withSkin.glb',
  'Meshy_AI_Gilded_Apotheosis_biped_Animation_01a08bc7-4986-7304-92f9-588cc56f082c_withSkin.glb',
  'Meshy_AI_Gilded_Apotheosis_biped_Animation_Walking_withSkin.glb',
  'Meshy_AI_Gilded_Apotheosis_biped_Animation_Running_withSkin.glb',
] as const;
export const animationUrl = (file: string) => `/poema-universal/gran-avatar/animations/${file}`;
export const MASTER_AVATAR_URL = animationUrl(AVATAR_SOURCE_FILES[0]);
export const AVATAR_CAMERA = { position: [0, 1.05, 4.8] as [number, number, number], target: [0, .88, 0] as [number, number, number], fov: 34, near: .05, far: 35 };
// Semantic mappings deliberately remain unassigned until the actions are observed.
export const AVATAR_ANIMATIONS = {
 idle: null, sense: null, capture: null, absorb: null,
 impact: null, open: null, offer: null, awaken: null,
} satisfies Record<string, {source:number;clipName:string}|null>;
export const CROSS_FADE_SECONDS = .65;
