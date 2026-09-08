"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";
import GlobalRecorder from "./GlobalRecorder";

const KEY =
  "poema-universal-admin-secret";

const POSITION_KEY =
  "poema-universal-private-studio-position";

const PANEL_WIDTH = 360;
const EDGE = 12;

type Position = {
  x: number;
  y: number;
};

export default function PrivateStudio() {
  const [authorized, setAuthorized] =
    useState(false);

  const [open, setOpen] =
    useState(false);

  const [position, setPosition] =
    useState<Position>({
      x: 20,
      y: 100,
    });

  const [dragging, setDragging] =
    useState(false);

  const panelRef =
    useRef<HTMLElement | null>(null);

  const dragOffset =
    useRef({
      x: 0,
      y: 0,
    });

  useEffect(() => {
    const secret =
      sessionStorage.getItem(KEY);

    if (secret) {
      void verify(secret);
    }
  }, []);

  useEffect(() => {
    const saved =
      sessionStorage.getItem(
        POSITION_KEY,
      );

    if (saved) {
      try {
        const parsed =
          JSON.parse(saved) as Position;

        setPosition(parsed);
        return;
      } catch {
        // Ignorar posición inválida.
      }
    }

    setPosition({
      x: Math.max(
        EDGE,
        window.innerWidth -
          PANEL_WIDTH -
          22,
      ),
      y: Math.max(
        EDGE,
        window.innerHeight -
          520,
      ),
    });
  }, []);

  useEffect(() => {
    function keepInsideWindow() {
      if (!panelRef.current) {
        return;
      }

      const rect =
        panelRef.current.getBoundingClientRect();

      setPosition((current) => {
        const next = {
          x: Math.max(
            EDGE,
            Math.min(
              current.x,
              window.innerWidth -
                rect.width -
                EDGE,
            ),
          ),
          y: Math.max(
            EDGE,
            Math.min(
              current.y,
              window.innerHeight -
                rect.height -
                EDGE,
            ),
          ),
        };

        return next;
      });
    }

    window.addEventListener(
      "resize",
      keepInsideWindow,
    );

    return () => {
      window.removeEventListener(
        "resize",
        keepInsideWindow,
      );
    };
  }, []);

  async function verify(
    secret: string,
  ) {
    const response =
      await fetch(
        "/api/poema-universal/admin/verify",
        {
          method: "POST",
          headers: {
            "x-admin-secret":
              secret,
          },
          cache: "no-store",
        },
      );

    if (!response.ok) {
      sessionStorage.removeItem(KEY);
      setAuthorized(false);
      return false;
    }

    sessionStorage.setItem(
      KEY,
      secret,
    );

    setAuthorized(true);
    setOpen(true);

    return true;
  }

  async function login() {
    const secret =
      window.prompt(
        "Clave privada de Poema Universal",
      );

    if (!secret) return;

    const ok =
      await verify(
        secret.trim(),
      );

    if (!ok) {
      window.alert(
        "Clave incorrecta.",
      );
    }
  }

  function startDrag(
    event: React.PointerEvent<HTMLElement>,
  ) {
    if (
      event.button !== 0 ||
      !panelRef.current
    ) {
      return;
    }

    const target =
      event.target as HTMLElement;

    if (
      target.closest(
        "button, a, input, textarea, select",
      )
    ) {
      return;
    }

    const rect =
      panelRef.current.getBoundingClientRect();

    dragOffset.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    setDragging(true);

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );
  }

  function moveDrag(
    event: React.PointerEvent<HTMLElement>,
  ) {
    if (
      !dragging ||
      !panelRef.current
    ) {
      return;
    }

    const rect =
      panelRef.current.getBoundingClientRect();

    const maxX =
      window.innerWidth -
      rect.width -
      EDGE;

    const maxY =
      window.innerHeight -
      rect.height -
      EDGE;

    const nextX =
      event.clientX -
      dragOffset.current.x;

    const nextY =
      event.clientY -
      dragOffset.current.y;

    setPosition({
      x: Math.max(
        EDGE,
        Math.min(maxX, nextX),
      ),
      y: Math.max(
        EDGE,
        Math.min(maxY, nextY),
      ),
    });
  }

  function stopDrag(
    event: React.PointerEvent<HTMLElement>,
  ) {
    if (!dragging) {
      return;
    }

    setDragging(false);

    try {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    } catch {
      // El pointer capture ya pudo liberarse.
    }

    sessionStorage.setItem(
      POSITION_KEY,
      JSON.stringify(position),
    );
  }

  function resetPosition() {
    if (!panelRef.current) {
      return;
    }

    const rect =
      panelRef.current.getBoundingClientRect();

    const next = {
      x: Math.max(
        EDGE,
        window.innerWidth -
          rect.width -
          22,
      ),
      y: Math.max(
        EDGE,
        window.innerHeight -
          rect.height -
          22,
      ),
    };

    setPosition(next);

    sessionStorage.setItem(
      POSITION_KEY,
      JSON.stringify(next),
    );
  }

  if (!authorized) {
    return (
      <button
        onClick={login}
        style={{
          position: "fixed",
          right: 22,
          bottom: 22,
          zIndex: 999999,
          padding:
            "13px 18px",
          border:
            "1px solid rgba(216,179,107,.55)",
          borderRadius: 999,
          background: "#080705",
          color: "#e0b65e",
          cursor: "pointer",
          fontSize: 10,
          letterSpacing: ".12em",
        }}
      >
        ◉ ESTUDIO PRIVADO
      </button>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() =>
          setOpen(true)
        }
        style={{
          position: "fixed",
          right: 22,
          bottom: 22,
          zIndex: 999999,
          width: 44,
          height: 44,
          borderRadius: "50%",
          border:
            "1px solid rgba(216,179,107,.45)",
          background: "#080705",
          color: "#e0b65e",
          cursor: "pointer",
        }}
      >
        ◉
      </button>
    );
  }

  return (
    <aside
      ref={panelRef}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        zIndex: 999999,
        width: 330,
        padding: 14,
        border:
          "1px solid rgba(216,179,107,.28)",
        borderRadius: 12,
        background:
          "rgba(5,4,3,.96)",
        boxShadow:
          dragging
            ? "0 30px 90px rgba(0,0,0,.82)"
            : "0 24px 70px rgba(0,0,0,.65)",
        color: "#ead9b8",
        userSelect:
          dragging
            ? "none"
            : "auto",
      }}
    >
      <header
        onPointerDown={
          startDrag
        }
        onPointerMove={
          moveDrag
        }
        onPointerUp={
          stopDrag
        }
        onPointerCancel={
          stopDrag
        }
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: 14,
          cursor:
            dragging
              ? "grabbing"
              : "grab",
          touchAction: "none",
          userSelect: "none",
        }}
      >
        <div>
          <small
            style={{
              color: "#9d7b3d",
              letterSpacing:
                ".14em",
            }}
          >
            POEMA UNIVERSAL
          </small>

          <div
            style={{
              marginTop: 4,
              fontFamily:
                "Georgia,serif",
              fontSize: 17,
            }}
          >
            Estudio privado
          </div>

          <div
            style={{
              marginTop: 3,
              color:
                "rgba(224,182,94,.42)",
              fontSize: 8,
              letterSpacing:
                ".10em",
            }}
          >
            ARRASTRAR PARA MOVER
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 4,
            alignItems: "center",
          }}
        >
          <button
            onClick={
              resetPosition
            }
            title="Volver a la esquina"
            style={{
              width: 28,
              height: 28,
              display: "grid",
              placeItems:
                "center",
              background:
                "transparent",
              border: 0,
              color:
                "rgba(207,168,90,.6)",
              fontSize: 13,
              cursor:
                "pointer",
            }}
          >
            ↘
          </button>

          <button
            onClick={() =>
              setOpen(false)
            }
            title="Minimizar"
            style={{
              width: 28,
              height: 28,
              display: "grid",
              placeItems:
                "center",
              background:
                "transparent",
              border: 0,
              color: "#cfa85a",
              fontSize: 20,
              cursor:
                "pointer",
            }}
          >
            −
          </button>
        </div>
      </header>

      <GlobalRecorder />

      <Link
        href="/poema-universal/director"
        style={{
          marginTop: 12,
          minHeight: 46,
          display: "grid",
          placeItems: "center",
          border:
            "1px solid rgba(216,179,107,.20)",
          borderRadius: 7,
          color: "#ddb663",
          textDecoration:
            "none",
          fontSize: 9,
          letterSpacing: ".10em",
        }}
      >
        ◉ CONSOLA DEL DIRECTOR →
      </Link>
    </aside>
  );
}
