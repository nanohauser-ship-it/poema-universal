import type {
  Metadata,
} from "next";

import {
  PresentacionViva,
} from "./PresentacionViva";

export const metadata:
  Metadata = {
  title:
    "Poema Universal · Presentación Viva",
  description:
    "Una obra común construida por voces de todo el mundo.",
};

export default function Page() {
  return (
    <PresentacionViva />
  );
}
