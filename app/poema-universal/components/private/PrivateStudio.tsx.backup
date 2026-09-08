"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import GlobalRecorder from "./GlobalRecorder";

const KEY =
  "poema-universal-admin-secret";

export default function PrivateStudio() {
  const [authorized, setAuthorized] =
    useState(false);

  const [open, setOpen] =
    useState(false);

  useEffect(() => {
    const secret =
      sessionStorage.getItem(KEY);

    if (secret) {
      void verify(secret);
    }
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
      style={{
        position: "fixed",
        right: 22,
        bottom: 22,
        zIndex: 999999,
        width: 330,
        padding: 14,
        border:
          "1px solid rgba(216,179,107,.28)",
        borderRadius: 12,
        background:
          "rgba(5,4,3,.96)",
        boxShadow:
          "0 24px 70px rgba(0,0,0,.65)",
        color: "#ead9b8",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: 14,
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
        </div>

        <button
          onClick={() =>
            setOpen(false)
          }
          style={{
            background:
              "transparent",
            border: 0,
            color: "#cfa85a",
            fontSize: 20,
            cursor: "pointer",
          }}
        >
          −
        </button>
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
