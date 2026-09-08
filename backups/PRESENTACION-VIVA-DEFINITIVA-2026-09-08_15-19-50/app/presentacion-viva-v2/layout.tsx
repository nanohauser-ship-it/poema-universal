"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { MasterPlayer } from "./MasterPlayer";

export default function PresentationVivaLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}

      <Link
        href="/poema-universal"
        className="puBackHome"
      >
        ← POEMA UNIVERSAL
      </Link>

      <MasterPlayer />

      <style jsx global>{`
        .puBackHome {
          position: fixed;
          top: 20px;
          right: 22px;
          z-index: 2147483000;

          padding: 11px 16px;

          border:
            1px solid
            rgba(
              223,
              190,
              125,
              .34
            );

          border-radius:
            999px;

          background:
            rgba(
              15,
              13,
              10,
              .82
            );

          color: #ead8b6;
          text-decoration: none;

          font-family:
            Arial,
            sans-serif;

          font-size: 9px;
          letter-spacing:
            .16em;

          backdrop-filter:
            blur(14px);
        }
      `}</style>
    </>
  );
}
