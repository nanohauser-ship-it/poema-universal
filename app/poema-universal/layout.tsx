import type {
  ReactNode,
} from "react";

import GlobalRecorder from "./components/private/GlobalRecorder";

export default function PoemaUniversalLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}

      {/* Grabadora global mínima */}
      <GlobalRecorder />
    </>
  );
}
