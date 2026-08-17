"use client";

import { useMemo } from "react";
import type { Organismo } from "./motor";
import styles from "../verso-tecno.module.css";

function pseudo(semilla: number, indice: number): number {
  const x = Math.sin(semilla * 0.000019 + indice * 43.17) * 19341.73;
  return x - Math.floor(x);
}

export default function OrganismoVisual({
  organismo,
}: {
  organismo: Organismo;
}) {
  const filamentos = useMemo(() => {
    const cantidad = Math.round(8 + organismo.complejidad / 6);

    return Array.from({ length: cantidad }, (_, i) => {
      const angulo = (Math.PI * 2 * i) / cantidad;
      const radio = 130 + pseudo(organismo.semilla, i) * 90;
      const curva = 70 + pseudo(organismo.semilla, i + 50) * 80;
      return {
        d: `M300 300 Q${
          300 + Math.cos(angulo - 0.45) * curva
        } ${300 + Math.sin(angulo - 0.45) * curva} ${
          300 + Math.cos(angulo) * radio
        } ${300 + Math.sin(angulo) * radio}`,
        delay: `${-(i * 0.31).toFixed(2)}s`,
      };
    });
  }, [organismo]);

  const radio = 46 + organismo.complejidad * 0.34;

  return (
    <div className={styles.organismVisual}>
      <svg viewBox="0 0 600 600" aria-label={organismo.nombre}>
        <circle className={styles.orbit} cx="300" cy="300" r="190" />
        <circle className={styles.orbit2} cx="300" cy="300" r="135" />

        <g className={styles.filaments}>
          {filamentos.map((filamento, i) => (
            <path
              key={i}
              d={filamento.d}
              style={{ animationDelay: filamento.delay }}
            />
          ))}
        </g>

        {organismo.diario.slice(-16).map((entrada, i) => {
          const angulo =
            pseudo(organismo.semilla, i + entrada.dia + 300) * Math.PI * 2;
          return (
            <line
              className={styles.scar}
              key={entrada.id}
              x1={300 + Math.cos(angulo) * (radio + 6)}
              y1={300 + Math.sin(angulo) * (radio + 6)}
              x2={300 + Math.cos(angulo + 0.2) * (radio + 54)}
              y2={300 + Math.sin(angulo + 0.2) * (radio + 54)}
            />
          );
        })}

        <circle
          className={styles.coreAura}
          cx="300"
          cy="300"
          r={radio + 36}
        />
        <circle
          className={styles.core}
          cx="300"
          cy="300"
          r={radio}
        />
        <text className={styles.coreWord} x="300" y="296">
          {organismo.reliquia}
        </text>
        <text className={styles.coreDay} x="300" y="321">
          DÍA {String(organismo.edad).padStart(2, "0")}
        </text>
      </svg>

      <div className={styles.visualFooter}>
        <span>{organismo.codigo}</span>
        <span>{organismo.etapa.toUpperCase()}</span>
      </div>
    </div>
  );
}
