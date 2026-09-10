import type { CeremonyProps } from './ContributionCeremony';
import type { AnimationClip } from 'three';
export type AvatarPlaybackState = 'DORMANT'|'IDLE'|'LOADING'|'PLAYING'|'RETURNING'|'ERROR';
export type PlaybackRequest = { source: number; serial: number; inPlace: boolean };
export type ClipInspection = { id: string; source: string; name: string; duration: number; tracks: number; movingTracks: number; useful: boolean; clip: AnimationClip };
export type PlaybackReport = { state: AvatarPlaybackState; message: string; clips?: Omit<ClipInspection,'clip'>[]; selectedClip?: string };
export type SceneProps = CeremonyProps & { request: PlaybackRequest|null; paused: boolean; onReady:()=>void; onReport:(report:PlaybackReport)=>void };
