import type {
  ReactNode,
} from "react";

import ReturnToMuseum
  from "./ReturnToMuseum";

type Props = {
  children: ReactNode;
};

export default function ArchivoAparicionesLayout({
  children,
}: Props) {
  return (
    <>
      {children}

      <ReturnToMuseum />
    </>
  );
}
