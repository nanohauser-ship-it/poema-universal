"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  GeneratedAlchemicalPlate,
} from "@/lib/asamblea/atlas-alquimico";

import {
  buildAlchemicalPlateSourceKey,
  getStoredAlchemicalPlate,
  saveAlchemicalPlate,
} from "@/lib/bestiario-poetico/libro-alquimico-store";

import styles
  from "./guardar-lamina-button.module.css";

type SaveStatus =
  | "checking"
  | "idle"
  | "saving"
  | "saved"
  | "error";

type Props = {
  plate:
    GeneratedAlchemicalPlate;

  plateTitle: string;

  plateNumber:
    | string
    | number;

  symbol: string;
  secretTitle: string;
  poem: string;
};

export default function
GuardarLaminaButton({
  plate,
  plateTitle,
  plateNumber,
  symbol,
  secretTitle,
  poem,
}: Props) {
  const [status, setStatus] =
    useState<SaveStatus>(
      "checking"
    );

  const sourceKey =
    useMemo(
      () =>
        buildAlchemicalPlateSourceKey(
          secretTitle,
          plate.type,
          poem
        ),
      [
        secretTitle,
        plate.type,
        poem,
      ]
    );

  useEffect(() => {
    let cancelled = false;

    async function checkPlate() {
      try {
        const existing =
          await
            getStoredAlchemicalPlate(
              sourceKey
            );

        if (!cancelled) {
          setStatus(
            existing
              ? "saved"
              : "idle"
          );
        }
      } catch {
        if (!cancelled) {
          setStatus("idle");
        }
      }
    }

    void checkPlate();

    return () => {
      cancelled = true;
    };
  }, [sourceKey]);

  async function preservePlate() {
    if (
      status === "saving"
      || status === "checking"
    ) {
      return;
    }

    setStatus("saving");

    try {
      await saveAlchemicalPlate({
        plate,
        plateTitle,
        plateNumber,
        symbol,
        secretTitle,
        sourcePoem: poem,
      });

      setStatus("saved");
    } catch (error) {
      console.error(
        "No se pudo guardar "
        + "la lámina:",
        error
      );

      setStatus("error");
    }
  }

  const label =
    status === "checking"
      ? "Consultando el libro…"
      : status === "saving"
        ? "Guardando la lámina…"
        : status === "saved"
          ? "Guardada en el Libro Alquímico"
          : status === "error"
            ? "Reintentar el guardado"
            : "Guardar en el Libro Alquímico";

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={
          status === "saved"
            ? styles.savedButton
            : styles.button
        }
        onClick={preservePlate}
        disabled={
          status === "saving"
          || status === "checking"
        }
      >
        <span aria-hidden="true">
          {status === "saved"
            ? "◆"
            : "◇"}
        </span>

        {label}
      </button>

      {status === "error" && (
        <p role="alert">
          La lámina no pudo entrar
          en el libro.
        </p>
      )}
    </div>
  );
}
