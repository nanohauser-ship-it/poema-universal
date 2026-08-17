import type { GenealogyEdge, GenealogyNode, GenomeVector, Period, Work } from "./types";

const clamp = (value: number) => Math.max(0, Math.min(1, value));

export function buildGenome(
  conceptId: string,
  period: Period,
  works: Work[],
  nodes: GenealogyNode[],
  edges: GenealogyEdge[],
): GenomeVector {
  const periodWorks = works.filter((work) => work.periodId === period.id);
  const periodNodes = nodes.filter((node) => node.periodId === period.id);
  const nodeIds = new Set(periodNodes.map((node) => node.id));
  const relatedEdges = edges.filter((edge) => nodeIds.has(edge.from) || nodeIds.has(edge.to));
  const tags = new Set(periodWorks.flatMap((work) => work.curatorialTags));
  const sourceCount = new Set(periodWorks.map((work) => work.sourceId)).size;
  const meanIntensity = periodNodes.length
    ? periodNodes.reduce((sum, node) => sum + node.intensity, 0) / periodNodes.length
    : 0;
  const transformationCount = relatedEdges.filter((edge) => edge.relation === "transformation" || edge.relation === "rupture" || edge.relation === "reappearance").length;

  return {
    conceptId,
    periodId: period.id,
    presence: clamp(periodWorks.length / 2),
    recurrence: clamp(periodWorks.length / 3),
    semanticDiversity: clamp(tags.size / 7),
    intensity: clamp(meanIntensity),
    dispersion: clamp(sourceCount / 3),
    persistence: clamp(relatedEdges.filter((edge) => edge.relation === "persistence" || edge.relation === "reappearance").length / 3),
    transformation: clamp(transformationCount / 4),
    connections: clamp(relatedEdges.length / 5),
    stability: clamp(1 - transformationCount / Math.max(relatedEdges.length + 1, 1)),
    evidenceCoverage: periodWorks.length === 0 ? 0 : clamp(periodWorks.filter((work) => work.textStatus !== "metadata_only").length / Math.max(periodWorks.length, 1)),
    sampleSize: periodWorks.length,
  };
}

export function stableSeed(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}
