"use client";

import { useState } from "react";
import GlobalRecorder from "../poema-universal/components/private/GlobalRecorder";

export default function HomeRecorderDot() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir consola de grabación"
          title="Estudio"
          style={{
            position: "fixed",
            right: 22,
            bottom: 22,
            zIndex: 2147483647,
            width: 38,
            height: 38,
            display: "grid",
            placeItems: "center",
            padding: 0,
            border: 0,
            background: "transparent",
            cursor: "pointer",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "rgba(167,125,63,.72)",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,.32), 0 0 14px rgba(167,125,63,.20)",
              transition:
                "transform .35s ease, opacity .35s ease, box-shadow .35s ease",
            }}
          />
        </button>
      )}

      {open && (
        <aside
          aria-label="Consola de grabación"
          style={{
            position: "fixed",
            right: 22,
            bottom: 22,
            zIndex: 2147483647,
            width: "min(330px, calc(100vw - 32px))",
            padding: 16,
            border: "1px solid rgba(216,179,107,.26)",
            borderRadius: 12,
            background: "rgba(5,4,3,.96)",
            boxShadow: "0 24px 70px rgba(0,0,0,.45)",
            color: "#ead9b8",
            backdropFilter: "blur(18px)",
          }}
        >
          <header
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              marginBottom: 14,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 8,
                  letterSpacing: ".18em",
                  color: "#9d7b3d",
                }}
              >
                POEMA UNIVERSAL
              </div>

              <div
                style={{
                  marginTop: 4,
                  fontFamily: "Georgia, serif",
                  fontSize: 15,
                  color: "#ead9b8",
                }}
              >
                Grabación
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar consola de grabación"
              style={{
                width: 28,
                height: 28,
                border: "1px solid rgba(216,179,107,.16)",
                borderRadius: "50%",
                background: "transparent",
                color: "rgba(234,217,184,.62)",
                cursor: "pointer",
                fontSize: 15,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </header>

          <GlobalRecorder />
        </aside>
      )}
    </>
  );
}
