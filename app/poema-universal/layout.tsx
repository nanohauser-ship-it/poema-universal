import type {
  ReactNode,
} from "react";

import PrivateStudio from "./components/private/PrivateStudio";

export default function PoemaUniversalLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
      <PrivateStudio />
    </>
  );
}
