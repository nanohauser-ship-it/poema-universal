"use client";

import { useState } from "react";

import { BestiaryInvocation } from "./BestiaryInvocation";
import AsambleaPoema from "../asamblea/components/AsambleaPoema";
import LibroAlquimicoPortal from "./LibroAlquimicoPortal";

type Room =
  | "invocacion"
  | "alquimia"
  | "libro";

export function BestiaryHall() {
  const [room, setRoom] =
    useState<Room>("invocacion");

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#070605",
      }}
    >
      <nav
        aria-label="Salas del Bestiario Poético"
        style={{
          position: "fixed",
          top: 18,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: 6,
          border:
            "1px solid rgba(220,190,135,.28)",
          borderRadius: 999,
          background:
            "rgba(9,7,5,.88)",
          backdropFilter: "blur(18px)",
          boxShadow:
            "0 15px 45px rgba(0,0,0,.38)",
        }}
      >
        <button
          type="button"
          onClick={() =>
            setRoom("invocacion")
          }
          style={buttonStyle(
            room === "invocacion"
          )}
        >
          I · INVOCACIÓN
        </button>

        <button
          type="button"
          onClick={() =>
            setRoom("alquimia")
          }
          style={buttonStyle(
            room === "alquimia"
          )}
        >
          II · MAQUINARIA ALQUÍMICA
        </button>

        <button
          type="button"
          onClick={() =>
            setRoom("libro")
          }
          style={buttonStyle(
            room === "libro"
          )}
        >
          III · LIBRO ALQUÍMICO
        </button>
      </nav>

      {room === "invocacion" && (
        <BestiaryInvocation />
      )}

      {room === "alquimia" && (
        <AsambleaPoema />
      )}

      {room === "libro" && (
        <LibroAlquimicoPortal />
      )}
    </div>
  );
}

function buttonStyle(
  active: boolean
): React.CSSProperties {
  return {
    appearance: "none",
    border: "none",
    borderRadius: 999,
    padding: "10px 15px",
    cursor: "pointer",
    fontSize: 10,
    letterSpacing: ".13em",
    whiteSpace: "nowrap",
    transition:
      "background .2s ease, color .2s ease",
    background: active
      ? "rgba(213,177,109,.18)"
      : "transparent",
    color: active
      ? "#ead8b7"
      : "rgba(234,216,183,.55)",
  };
}
