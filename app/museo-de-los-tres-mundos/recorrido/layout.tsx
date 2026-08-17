import type {
  ReactNode,
} from "react";

import ArchivoAparicionesDoor
  from "./ArchivoAparicionesDoor";

type Props = {
  children: ReactNode;
};

export default function RecorridoMuseumLayout({
  children,
}: Props) {
  return (
    <>
      {children}

      <ArchivoAparicionesDoor />
    </>
  );
}
