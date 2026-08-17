import { getBootstrap } from "./repository";
import type { EvidenceBundle } from "./types";

export function getEvidenceBundle(claimId: string): EvidenceBundle | null {
  const data = getBootstrap();
  const claim = data.claims.find((item) => item.id === claimId);
  if (!claim) return null;

  const evidence = data.claimEvidence
    .filter((item) => item.claimId === claimId)
    .map((link) => {
      const passage = data.passages.find((item) => item.id === link.passageId);
      const work = passage && data.works.find((item) => item.id === passage.workId);
      const author = work && data.authors.find((item) => item.id === work.authorId);
      const source = work && data.sources.find((item) => item.id === work.sourceId);
      if (!passage || !work || !author || !source) return null;
      return { relation: link.relation, weight: link.weight, note: link.note, passage, work, author, source };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return { claim, evidence };
}
