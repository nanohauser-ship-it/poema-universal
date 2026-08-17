import { getBootstrap } from "./repository";
import type { ComparisonObservation, ComparisonResult, QuestionAnswer } from "./types";

export function comparePeriods(leftId: string, rightId: string): ComparisonResult | null {
  const data = getBootstrap();
  const left = data.periods.find((period) => period.id === leftId);
  const right = data.periods.find((period) => period.id === rightId);
  if (!left || !right || left.id === right.id) return null;

  const leftClaim = data.claims.find((claim) => claim.periodId === left.id && claim.conceptId === "muerte");
  const rightClaim = data.claims.find((claim) => claim.periodId === right.id && claim.conceptId === "muerte");
  const leftNodes = data.genealogyNodes.filter((node) => node.periodId === left.id);
  const rightNodes = data.genealogyNodes.filter((node) => node.periodId === right.id);
  const connectingEdges = data.genealogyEdges.filter((edge) =>
    leftNodes.some((node) => node.id === edge.from || node.id === edge.to)
    && rightNodes.some((node) => node.id === edge.from || node.id === edge.to));

  const observations: ComparisonObservation[] = [];
  if (leftClaim && rightClaim) {
    observations.push({ id: `difference-${left.id}-${right.id}`, category: "difference", label: "Dos configuraciones", statement: `${leftClaim.title}: ${leftClaim.statement} ${rightClaim.title}: ${rightClaim.statement}`, claimIds: [leftClaim.id, rightClaim.id] });
  }
  for (const edge of connectingEdges.slice(0, 3)) {
    const from = data.genealogyNodes.find((node) => node.id === edge.from);
    const to = data.genealogyNodes.find((node) => node.id === edge.to);
    if (!from || !to) continue;
    const category = edge.relation === "rupture" ? "rupture" : edge.relation === "persistence" || edge.relation === "reappearance" ? "continuity" : "transformation";
    observations.push({ id: edge.id, category, label: `${from.label} → ${to.label}`, statement: `La anotación genealógica propone una relación de ${edge.relation} (confianza ${Math.round(edge.confidence * 100)}% dentro del piloto).`, claimIds: [edge.claimId, ...(leftClaim ? [leftClaim.id] : [])] });
  }
  if (observations.length === 0) {
    observations.push({ id: `gap-${left.id}-${right.id}`, category: "relation", label: "Relación aún no modelada", statement: "El corpus piloto no contiene una arista genealógica directa entre estos dos momentos.", claimIds: [leftClaim?.id, rightClaim?.id].filter((id): id is string => Boolean(id)) });
  }

  return {
    left,
    right,
    observations,
    limitation: "Comparación exploratoria sobre un corpus piloto pequeño. Las categorías describen evidencia disponible; no agotan ninguno de los periodos.",
  };
}

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function answerFromCorpus(question: string): QuestionAnswer {
  const data = getBootstrap();
  const q = normalize(question);
  const selectedClaims = data.claims.filter((claim) => {
    const period = data.periods.find((item) => item.id === claim.periodId);
    return q.includes(normalize(period?.shortLabel ?? ""))
      || q.includes(normalize(period?.label ?? ""))
      || q.includes(normalize(claim.title.split(" ")[0] ?? ""));
  });
  const authorMatches = data.authors.filter((author) => q.includes(normalize(author.name.split(" ").at(-1) ?? author.name)));
  const authorPeriodIds = data.works.filter((work) => authorMatches.some((author) => author.id === work.authorId)).map((work) => work.periodId);
  const claimsByAuthor = data.claims.filter((claim) => authorPeriodIds.includes(claim.periodId));
  const chosen = Array.from(new Map([...selectedClaims, ...claimsByAuthor].map((claim) => [claim.id, claim])).values());
  const fallback = chosen.length ? chosen : data.claims.filter((claim) => !["enlightenment", "postwar_contemporary"].includes(claim.periodId));
  const ordered = fallback.sort((a, b) => data.periods.findIndex((p) => p.id === a.periodId) - data.periods.findIndex((p) => p.id === b.periodId)).slice(0, 6);
  const answer = ordered.map((claim) => `${data.periods.find((p) => p.id === claim.periodId)?.shortLabel}: ${claim.statement}`).join(" ");
  const claimIds = ordered.map((claim) => claim.id);
  const passageIds = data.claimEvidence.filter((link) => claimIds.includes(link.claimId)).map((link) => link.passageId);
  const workIds = data.passages.filter((passage) => passageIds.includes(passage.id)).map((passage) => passage.workId);

  return {
    question,
    answer: `${answer} Esta lectura no es una conclusión definitiva: expresa patrones anotados en la muestra actual.`,
    claimIds,
    workIds: [...new Set(workIds)],
    mode: "corpus_template",
    limitations: ["Corpus piloto de 11 obras y fragmentos breves.", "Ilustración y posguerra/contemporaneidad no tienen muestra textual.", "No detectar un motivo equivale a «no detectado en el corpus disponible», nunca a ausencia histórica."],
  };
}
