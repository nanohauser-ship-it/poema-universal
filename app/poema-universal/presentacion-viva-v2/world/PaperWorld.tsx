"use client";

import { PoemaNarrativeWorld } from "./panda-poema/PoemaNarrativeWorld";

type Props = {
  filmMode?: boolean;
};

export function PaperWorld({ filmMode = false }: Props) {
  return <PoemaNarrativeWorld filmMode={filmMode} />;
}
