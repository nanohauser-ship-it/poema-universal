import {
  authors,
  claimEvidence,
  claims,
  genealogyEdges,
  genealogyNodes,
  passages,
  periods,
  sources,
  works,
} from "./pilot-corpus";
import { buildGenome } from "./genome";
import type { BootstrapData } from "./types";

export function getBootstrap(): BootstrapData {
  return {
    project: {
      title: "EMBRIÓN",
      subtitle: "Atlas histórico de la sensibilidad poética",
      conceptId: "muerte",
      conceptLabel: "MUERTE",
      corpusLabel: "Corpus piloto · poesía de España · 1400–1936",
      analysisVersion: "muerte-pilot-1.0",
    },
    periods,
    authors,
    works,
    passages,
    sources,
    claims,
    claimEvidence,
    genealogyNodes,
    genealogyEdges,
    genomes: periods.map((period) => buildGenome("muerte", period, works, genealogyNodes, genealogyEdges)),
  };
}
