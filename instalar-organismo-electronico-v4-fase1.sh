#!/usr/bin/env bash
set -euo pipefail

cd "${HOME}/poema-universal"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " ORGANISMO V4 · FASE I"
echo " LITERATURA ELECTRÓNICA VIVA"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ ! -f package.json ]]; then
  echo "❌ No encuentro package.json en ~/poema-universal"
  exit 1
fi

if [[ -d app/laboratorio/verso-tecno ]]; then
  TARGET="app/laboratorio/verso-tecno"
elif [[ -d src/app/laboratorio/verso-tecno ]]; then
  TARGET="src/app/laboratorio/verso-tecno"
else
  echo "❌ No encuentro la sala /laboratorio/verso-tecno"
  exit 1
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="${TARGET}.before-organismo-v4-${STAMP}"
cp -R "${TARGET}" "${BACKUP}"
mkdir -p "${TARGET}/organismo"

echo "✅ Copia de seguridad: ${BACKUP}"

cat > "${TARGET}/page.tsx" <<'EOF'
import type { Metadata } from "next";
import VersoTecno from "./VersoTecno";

export const metadata: Metadata = {
  title: "Organismo · Literatura electrónica viva",
  description:
    "Un poema incubado como organismo electrónico que crece, recuerda y muta.",
};

export default function OrganismoPage() {
  return <VersoTecno />;
}
EOF

cat > "${TARGET}/organismo/motor.ts" <<'EOF'
export type Habitat =
  | "deriva"
  | "pulso"
  | "fractura"
  | "espectral"
  | "maquina"
  | "memoria";

export type Etapa =
  | "embrion"
  | "germinacion"
  | "formacion"
  | "cuerpo"
  | "mutacion"
  | "madurez"
  | "latencia";

export type EntradaVital = {
  id: string;
  dia: number;
  fecha: string;
  titulo: string;
  texto: string;
  habitat: Habitat;
};

export type Organismo = {
  version: 4;
  id: string;
  codigo: string;
  nombre: string;
  poema: string;
  nacimiento: string;
  ultimaEvolucion: string;
  ultimaInteraccion: string;
  edad: number;
  etapa: Etapa;
  semilla: number;
  reliquia: string;
  bpmBase: number;
  tonalidad: string;
  habitats: Record<Habitat, number>;
  energia: number;
  estabilidad: number;
  memoriaVital: number;
  complejidad: number;
  notas: string[];
  diario: EntradaVital[];
  injertos: string[];
};

export const HABITATS: Habitat[] = [
  "deriva",
  "pulso",
  "fractura",
  "espectral",
  "maquina",
  "memoria",
];

const STOP = new Set([
  "a", "al", "ante", "bajo", "como", "con", "de", "del", "desde", "el",
  "ella", "en", "entre", "era", "es", "esta", "fue", "ha", "hasta", "la",
  "las", "lo", "los", "más", "mas", "me", "mi", "muy", "no", "nos", "o",
  "para", "pero", "por", "que", "se", "sin", "sobre", "su", "sus", "te",
  "tu", "un", "una", "y", "ya",
]);

const VOCABULARIO: Record<Habitat, string[]> = {
  deriva: [
    "agua", "mar", "rio", "lluvia", "aire", "viento", "nube", "niebla",
    "sueño", "sueno", "flotar", "lejos", "noche", "lento",
  ],
  pulso: [
    "cuerpo", "piel", "sangre", "corazon", "latido", "hambre", "carne",
    "mano", "pie", "boca", "deseo", "golpe", "ritmo",
  ],
  fractura: [
    "roto", "corte", "caer", "grito", "herida", "fragmento", "ruina",
    "nunca", "partir", "fractura", "error", "vacio",
  ],
  espectral: [
    "sombra", "fantasma", "muerte", "muerto", "silencio", "ausencia",
    "nadie", "desaparecer", "olvido", "eco", "voz", "alma",
  ],
  maquina: [
    "maquina", "motor", "hierro", "metal", "codigo", "cable", "ciudad",
    "fabrica", "tren", "reloj", "ruido",
  ],
  memoria: [
    "memoria", "recuerdo", "nombre", "ayer", "antes", "infancia", "madre",
    "padre", "fotografia", "cuaderno", "historia", "volver", "regresar",
  ],
};

const ESCALAS = [
  ["c2", "eb2", "g2", "bb2", "d3", "f3"],
  ["d2", "f2", "a2", "c3", "e3", "g3"],
  ["eb2", "gb2", "bb2", "db3", "f3", "ab3"],
  ["f2", "ab2", "c3", "eb3", "g3", "bb3"],
];

const TONALIDADES = ["C menor", "D dórico", "Eb menor", "F lidio"];

const MUTACIONES: Record<Habitat, string[]> = {
  deriva: [
    "Una corriente desplazó la armonía",
    "La membrana comenzó a flotar",
    "El espacio se volvió más profundo",
  ],
  pulso: [
    "Apareció un nuevo latido",
    "El subgrave adquirió cuerpo",
    "La respiración encontró una cadencia",
  ],
  fractura: [
    "La métrica desarrolló una cicatriz",
    "Un motivo se partió en fragmentos",
    "El silencio cortó la secuencia",
  ],
  espectral: [
    "La palabra reliquia dejó una sombra",
    "Una presencia atravesó el núcleo",
    "Nació una cola espectral",
  ],
  maquina: [
    "Apareció una estructura metálica",
    "El reloj interno ganó precisión",
    "Una secuencia mecánica ocupó el borde",
  ],
  memoria: [
    "Regresó una forma del primer día",
    "El organismo recordó una nota perdida",
    "Un eco antiguo volvió transformado",
  ],
};

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function hashTexto(texto: string): number {
  let resultado = 2166136261;
  for (let i = 0; i < texto.length; i += 1) {
    resultado ^= texto.charCodeAt(i);
    resultado = Math.imul(resultado, 16777619);
  }
  return Math.abs(resultado >>> 0);
}

function azar(semilla: number, indice: number): number {
  const valor = Math.sin(semilla * 0.000017 + indice * 71.923) * 43758.5453;
  return valor - Math.floor(valor);
}

function limitar(valor: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(valor)));
}

function palabras(texto: string): string[] {
  return (
    texto.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:['’-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*/g) ??
    []
  );
}

function relevantes(texto: string): string[] {
  return palabras(texto).filter((palabra) => {
    const limpia = normalizar(palabra);
    return limpia.length > 2 && !STOP.has(limpia);
  });
}

function reliquiaDe(texto: string): string {
  const lista = relevantes(texto);
  if (!lista.length) return "silencio";

  const frecuencia = new Map<string, { original: string; n: number }>();
  lista.forEach((palabra) => {
    const clave = normalizar(palabra);
    const anterior = frecuencia.get(clave);
    frecuencia.set(clave, {
      original: anterior?.original ?? palabra,
      n: (anterior?.n ?? 0) + 1,
    });
  });

  return [...frecuencia.values()].sort(
    (a, b) =>
      b.n * 10 +
      b.original.length -
      (a.n * 10 + a.original.length),
  )[0].original;
}

function etapaPorEdad(edad: number): Etapa {
  if (edad <= 0) return "embrion";
  if (edad <= 3) return "germinacion";
  if (edad <= 7) return "formacion";
  if (edad <= 14) return "cuerpo";
  if (edad <= 30) return "mutacion";
  return "madurez";
}

function fechaHoy(): string {
  return new Date().toISOString().slice(0, 10);
}

function diasEntre(desde: string, hasta: string): number {
  const a = new Date(`${desde}T00:00:00`).getTime();
  const b = new Date(`${hasta}T00:00:00`).getTime();
  return Math.max(0, Math.floor((b - a) / 86400000));
}

export function analizarPoema(texto: string) {
  const lista = relevantes(texto);
  const semilla = hashTexto(texto || "silencio");
  const signos = (texto.match(/[,.…;:!?—-]/g) ?? []).length;
  const lineas = Math.max(
    1,
    texto.split(/\n+/).map((x) => x.trim()).filter(Boolean).length,
  );

  const habitats = {} as Record<Habitat, number>;

  HABITATS.forEach((habitat, indice) => {
    const diccionario = new Set(VOCABULARIO[habitat].map(normalizar));
    const coincidencias = lista.filter((p) =>
      diccionario.has(normalizar(p)),
    ).length;

    habitats[habitat] = limitar(
      18 +
        coincidencias * 14 +
        azar(semilla, indice + 1) * 18 +
        (habitat === "fractura" ? signos * 2 : 0) +
        (habitat === "deriva" ? lineas * 2 : 0),
      7,
      96,
    );
  });

  const escala = ESCALAS[semilla % ESCALAS.length];
  const notas = [...new Set(lista.map((p) => escala[hashTexto(p) % escala.length]))]
    .slice(0, 7);

  return {
    semilla,
    reliquia: reliquiaDe(texto),
    habitats,
    notas: notas.length ? notas : escala.slice(0, 4),
    bpmBase: limitar(
      65 + habitats.pulso * 0.55 + habitats.maquina * 0.16 -
        habitats.deriva * 0.18,
      45,
      145,
    ),
    tonalidad: TONALIDADES[semilla % TONALIDADES.length],
  };
}

export function incubar(nombre: string, poema: string): Organismo {
  const fecha = fechaHoy();
  const analisis = analizarPoema(poema);
  const semilla = hashTexto(`${poema}|${nombre}|${Date.now()}`);
  const codigo = `OE-${String(semilla % 100000).padStart(5, "0")}`;

  return {
    version: 4,
    id: `${codigo}-${Date.now()}`,
    codigo,
    nombre: nombre.trim() || analisis.reliquia,
    poema,
    nacimiento: fecha,
    ultimaEvolucion: fecha,
    ultimaInteraccion: fecha,
    edad: 0,
    etapa: "embrion",
    semilla,
    reliquia: analisis.reliquia,
    bpmBase: analisis.bpmBase,
    tonalidad: analisis.tonalidad,
    habitats: analisis.habitats,
    energia: limitar(28 + analisis.habitats.pulso * 0.25),
    estabilidad: limitar(
      52 + analisis.habitats.memoria * 0.15 -
        analisis.habitats.fractura * 0.12,
    ),
    memoriaVital: limitar(18 + analisis.habitats.memoria * 0.35),
    complejidad: 14,
    notas: analisis.notas,
    injertos: [],
    diario: [
      {
        id: `nacimiento-${semilla}`,
        dia: 0,
        fecha,
        titulo: "El poema fue incubado",
        texto:
          `${codigo} nació alrededor de la palabra «${analisis.reliquia}». ` +
          "Todavía no posee una forma musical cerrada.",
        habitat: "memoria",
      },
    ],
  };
}

function habitatDominante(
  organismo: Organismo,
  dia: number,
): Habitat {
  return HABITATS.map((habitat, indice) => ({
    habitat,
    valor:
      organismo.habitats[habitat] +
      azar(organismo.semilla, dia * 13 + indice) * 42,
  })).sort((a, b) => b.valor - a.valor)[0].habitat;
}

function evolucionarDia(
  organismo: Organismo,
  dia: number,
  fecha: string,
): Organismo {
  const habitat = habitatDominante(organismo, dia);
  const opciones = MUTACIONES[habitat];
  const titulo =
    opciones[
      Math.floor(azar(organismo.semilla, dia * 29) * opciones.length) %
        opciones.length
    ];

  const entrada: EntradaVital = {
    id: `dia-${dia}-${organismo.semilla}`,
    dia,
    fecha,
    titulo,
    habitat,
    texto:
      `${titulo}. El hábitat ${habitat} modificó su densidad, ` +
      "su memoria o su respiración electrónica.",
  };

  return {
    ...organismo,
    edad: dia,
    etapa: etapaPorEdad(dia),
    ultimaEvolucion: fecha,
    energia: limitar(
      organismo.energia + (habitat === "pulso" ? 5 : 2) -
        (habitat === "deriva" ? 1 : 0),
    ),
    estabilidad: limitar(
      organismo.estabilidad + (habitat === "memoria" ? 3 : 0) -
        (habitat === "fractura" ? 4 : 1),
    ),
    memoriaVital: limitar(
      organismo.memoriaVital + (habitat === "memoria" ? 6 : 2),
    ),
    complejidad: limitar(organismo.complejidad + 3),
    diario: [...organismo.diario, entrada].slice(-160),
  };
}

export function evolucionarHastaHoy(organismo: Organismo): {
  organismo: Organismo;
  ciclos: number;
} {
  const hoy = fechaHoy();
  const ciclos = diasEntre(organismo.ultimaEvolucion, hoy);
  let actual = organismo;

  for (let i = 1; i <= ciclos; i += 1) {
    const fecha = new Date(`${organismo.ultimaEvolucion}T12:00:00`);
    fecha.setDate(fecha.getDate() + i);
    actual = evolucionarDia(
      actual,
      organismo.edad + i,
      fecha.toISOString().slice(0, 10),
    );
  }

  if (diasEntre(actual.ultimaInteraccion, hoy) >= 14) {
    actual = {
      ...actual,
      etapa: "latencia",
      energia: limitar(actual.energia - 14),
    };
  }

  return { organismo: actual, ciclos };
}

export function mutarAhora(organismo: Organismo): Organismo {
  const indice = organismo.diario.length + 700;
  const habitat = habitatDominante(organismo, indice);
  const opciones = MUTACIONES[habitat];
  const titulo =
    opciones[Math.floor(azar(organismo.semilla, indice) * opciones.length)];

  return {
    ...organismo,
    ultimaInteraccion: fechaHoy(),
    complejidad: limitar(organismo.complejidad + 3),
    estabilidad: limitar(
      organismo.estabilidad - (habitat === "fractura" ? 4 : 1),
    ),
    diario: [
      ...organismo.diario,
      {
        id: `lab-${indice}-${Date.now()}`,
        dia: organismo.edad,
        fecha: fechaHoy(),
        titulo,
        habitat,
        texto:
          `${titulo}. Fue una mutación inducida y no alteró su edad cronológica.`,
      },
    ].slice(-160),
  };
}

export function despertar(organismo: Organismo): Organismo {
  return {
    ...organismo,
    etapa: etapaPorEdad(organismo.edad),
    energia: limitar(organismo.energia + 12),
    ultimaInteraccion: fechaHoy(),
  };
}

export function injertar(
  organismo: Organismo,
  verso: string,
): Organismo {
  const limpio = verso.trim();
  if (!limpio) return organismo;

  const habitat = HABITATS[hashTexto(limpio) % HABITATS.length];

  return {
    ...organismo,
    ultimaInteraccion: fechaHoy(),
    energia: limitar(organismo.energia + 5),
    complejidad: limitar(organismo.complejidad + 5),
    memoriaVital: limitar(organismo.memoriaVital + 3),
    injertos: [...organismo.injertos, limpio].slice(-50),
    diario: [
      ...organismo.diario,
      {
        id: `injerto-${Date.now()}`,
        dia: organismo.edad,
        fecha: fechaHoy(),
        titulo: "El organismo recibió un injerto",
        habitat,
        texto:
          `«${limpio.slice(0, 120)}» entró en su genealogía y activó ` +
          `el hábitat ${habitat}.`,
      },
    ].slice(-160),
  };
}

function rotar<T>(lista: T[], n: number): T[] {
  const giro = ((n % lista.length) + lista.length) % lista.length;
  return [...lista.slice(giro), ...lista.slice(0, giro)];
}

function decimal(n: number): string {
  return Math.max(0, n).toFixed(2);
}

export function bpmActual(organismo: Organismo): number {
  return limitar(
    organismo.bpmBase +
      organismo.complejidad * 0.05 +
      organismo.habitats.pulso * 0.04 -
      organismo.habitats.deriva * 0.035,
    42,
    154,
  );
}

export function codigoStrudel(organismo: Organismo): string {
  const notas = rotar(
    organismo.notas,
    organismo.edad + organismo.diario.length,
  );
  const motivo = notas.slice(0, 5).join(" ");
  const reliquia = notas[hashTexto(organismo.reliquia) % notas.length];
  const h = organismo.habitats;
  const capas: string[] = [];

  capas.push(`note("<${motivo}>")
    .s("sine")
    .slow(${Math.max(3, Math.round(5 + h.deriva / 13))})
    .gain(${decimal(0.12 + h.deriva / 430)})
    .room(${decimal(0.45 + h.deriva / 210)})
    .delay(${decimal(0.12 + h.memoria / 260)})`);

  capas.push(`note("<${reliquia} ~ ${reliquia} ~>")
    .s("triangle")
    .slow(${Math.max(3, Math.round(4 + h.memoria / 18))})
    .gain(${decimal(0.09 + h.memoria / 480)})
    .room(${decimal(0.42 + h.espectral / 200)})
    .lpf(${Math.round(900 + organismo.memoriaVital * 16)})`);

  if (
    organismo.etapa !== "embrion" &&
    organismo.etapa !== "latencia" &&
    h.pulso >= 25
  ) {
    const patron =
      h.pulso >= 72 ? "bd*4" : h.fractura >= 58 ? "bd(3,8)" : "bd ~ bd ~";
    capas.push(`s("${patron}")
    .gain(${decimal(0.24 + h.pulso / 210)})`);
  }

  if (organismo.edad >= 4 && h.fractura >= 30) {
    capas.push(`s("[~ hh]*4")
    .gain(${decimal(0.07 + h.fractura / 520)})
    .hpf(${Math.round(4300 + h.fractura * 24)})
    .delay(${decimal(0.08 + h.fractura / 350)})`);
  }

  if (organismo.edad >= 7 && h.maquina >= 28) {
    capas.push(`note("<${notas.slice(1, 5).join(" ")}>")
    .s("sawtooth")
    .slow(2)
    .gain(${decimal(0.06 + h.maquina / 520)})
    .lpf(${Math.round(600 + h.maquina * 19)})
    .lpq(7)`);
  }

  if (h.espectral >= 25) {
    capas.push(`note("<${reliquia} ${notas[notas.length - 1]}>")
    .s("sine")
    .slow(${Math.max(6, Math.round(8 + h.espectral / 12))})
    .gain(${decimal(0.04 + h.espectral / 650)})
    .room(${decimal(0.65 + h.espectral / 330)})
    .delay(${decimal(0.26 + h.espectral / 270)})`);
  }

  return `/*
ORGANISMO · LITERATURA ELECTRÓNICA VIVA
${organismo.codigo} · ${organismo.nombre}
Día ${organismo.edad} · ${organismo.etapa}
Núcleo: ${organismo.reliquia}
No pertenece a un género fijo.
*/

setcpm(${bpmActual(organismo)}/4)

stack(
  ${capas.join(",\n\n  ")}
)
`;
}

function base64Utf8(texto: string): string {
  const bytes = new TextEncoder().encode(texto);
  const tabla =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let salida = "";

  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i] ?? 0;
    const b = bytes[i + 1] ?? 0;
    const c = bytes[i + 2] ?? 0;
    const bloque = (a << 16) | (b << 8) | c;

    salida += tabla[(bloque >> 18) & 63];
    salida += tabla[(bloque >> 12) & 63];
    salida += i + 1 < bytes.length ? tabla[(bloque >> 6) & 63] : "=";
    salida += i + 2 < bytes.length ? tabla[bloque & 63] : "=";
  }

  return salida;
}

export function urlStrudel(codigo: string): string {
  return `https://strudel.cc/#${base64Utf8(codigo)}`;
}
EOF

cat > "${TARGET}/organismo/OrganismoVisual.tsx" <<'EOF'
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
EOF

cat > "${TARGET}/VersoTecno.tsx" <<'EOF'
"use client";

import { useEffect, useMemo, useState } from "react";
import OrganismoVisual from "./organismo/OrganismoVisual";
import {
  HABITATS,
  analizarPoema,
  bpmActual,
  codigoStrudel,
  despertar,
  evolucionarHastaHoy,
  incubar,
  injertar,
  mutarAhora,
  urlStrudel,
  type Habitat,
  type Organismo,
} from "./organismo/motor";
import styles from "./verso-tecno.module.css";

const STORAGE = "organismo-electronico-v4";

const POEMA = `No dejes que desaparezcamos.
Todavía queda fuego bajo la tierra.
La ciudad respira el nombre que olvidamos.
Pero el silencio vuelve con otra forma.
Y al final solo queda una luz respirando.`;

const NOMBRES: Record<Habitat, string> = {
  deriva: "Deriva",
  pulso: "Pulso",
  fractura: "Fractura",
  espectral: "Espectral",
  maquina: "Máquina",
  memoria: "Memoria",
};

const DESCRIPCIONES: Record<Habitat, string> = {
  deriva: "Ambient, drone y profundidad espacial.",
  pulso: "Latido, subgrave y energía física.",
  fractura: "Glitch, cortes y ritmos irregulares.",
  espectral: "Presencia, resonancia y voz fantasma.",
  maquina: "Metal, secuencia y precisión algorítmica.",
  memoria: "Motivos que regresan y se degradan.",
};

const ETAPAS: Record<string, string> = {
  embrion: "Embrión",
  germinacion: "Germinación",
  formacion: "Formación",
  cuerpo: "Cuerpo",
  mutacion: "Mutación",
  madurez: "Madurez",
  latencia: "Latencia",
};

export default function VersoTecno() {
  const [nombre, setNombre] = useState("La luz que permanece");
  const [poema, setPoema] = useState(POEMA);
  const [organismo, setOrganismo] = useState<Organismo | null>(null);
  const [injerto, setInjerto] = useState("");
  const [cargando, setCargando] = useState(true);
  const [sonido, setSonido] = useState(true);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(STORAGE);
      if (guardado) {
        const evolucion = evolucionarHastaHoy(
          JSON.parse(guardado) as Organismo,
        );
        setOrganismo(evolucion.organismo);
        window.localStorage.setItem(
          STORAGE,
          JSON.stringify(evolucion.organismo),
        );

        if (evolucion.ciclos > 0) {
          aviso(
            `Completó ${evolucion.ciclos} ciclos vitales mientras no estabas.`,
          );
        }
      }
    } catch {
      window.localStorage.removeItem(STORAGE);
    }

    setCargando(false);
  }, []);

  const previo = useMemo(() => analizarPoema(poema), [poema]);
  const codigo = useMemo(
    () => (organismo ? codigoStrudel(organismo) : ""),
    [organismo],
  );
  const url = useMemo(() => (codigo ? urlStrudel(codigo) : ""), [codigo]);

  function aviso(texto: string) {
    setMensaje(texto);
    window.setTimeout(() => setMensaje(""), 2500);
  }

  function guardar(nuevo: Organismo) {
    setOrganismo(nuevo);
    window.localStorage.setItem(STORAGE, JSON.stringify(nuevo));
  }

  function crear() {
    if (poema.trim().length < 12) {
      aviso("El organismo necesita más materia literaria.");
      return;
    }

    const nuevo = incubar(nombre, poema);
    guardar(nuevo);
    aviso(`${nuevo.codigo} ha nacido alrededor de «${nuevo.reliquia}».`);
  }

  function mutar() {
    if (!organismo) return;
    guardar(mutarAhora(organismo));
    setSonido(true);
    aviso("Mutación inducida sin alterar su edad.");
  }

  function alimentar() {
    if (!organismo || !injerto.trim()) return;
    guardar(injertar(organismo, injerto));
    setInjerto("");
    setSonido(true);
    aviso("El verso entró en su genealogía.");
  }

  function despertarAhora() {
    if (!organismo) return;
    guardar(despertar(organismo));
    aviso("El organismo salió de la latencia.");
  }

  function liberar() {
    if (!window.confirm("¿Eliminar este organismo y su diario local?")) return;
    window.localStorage.removeItem(STORAGE);
    setOrganismo(null);
    setPoema(POEMA);
    setNombre("La luz que permanece");
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigo);
      aviso("Código electrónico copiado.");
    } catch {
      aviso("No se pudo copiar automáticamente.");
    }
  }

  if (cargando) {
    return (
      <main className={styles.page}>
        <div className={styles.loading}>Buscando vida sonora…</div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.grid} aria-hidden="true" />

      <header className={styles.topbar}>
        <div className={styles.brand}>
          <span>O/E</span>
          <div>
            <small>POEMA UNIVERSAL · LABORATORIO 02</small>
            <h1>ORGANISMO</h1>
          </div>
        </div>
        <p><i /> Literatura electrónica viva</p>
      </header>

      {!organismo ? (
        <section className={styles.birthLayout}>
          <article className={styles.panel}>
            <Header n="01" title="Cámara de incubación" tag="NACIMIENTO" />

            <label className={styles.field}>
              <span>Nombre provisional</span>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                maxLength={80}
              />
            </label>

            <label className={styles.field}>
              <span>Poema · ADN fundacional</span>
              <textarea
                value={poema}
                onChange={(e) => setPoema(e.target.value.slice(0, 5000))}
              />
            </label>

            <blockquote>
              El poema no producirá una canción cerrada. Creará una edad, una
              memoria y una fisiología electrónica.
            </blockquote>

            <button className={styles.primary} onClick={crear}>
              INCUBAR POEMA <b>ENGENDRAR PRESENCIA ↗</b>
            </button>
          </article>

          <aside className={styles.panel}>
            <Header n="02" title="Lectura genética" tag="PREVISIÓN" />

            <div className={styles.relicPreview}>
              <small>PALABRA RELIQUIA</small>
              <strong>{previo.reliquia}</strong>
              <span>{previo.bpmBase} BPM potenciales · {previo.tonalidad}</span>
            </div>

            <Habitats valores={previo.habitats} />
          </aside>
        </section>
      ) : (
        <>
          <section className={styles.organismLayout}>
            <article className={styles.panel}>
              <Header n="01" title="Cámara vital" tag={organismo.codigo} />
              <OrganismoVisual organismo={organismo} />
              <div className={styles.organismTitle}>
                <div>
                  <small>ORGANISMO ACTUAL</small>
                  <h2>{organismo.nombre}</h2>
                </div>
                <strong>{organismo.edad}<span>DÍAS</span></strong>
              </div>
            </article>

            <article className={styles.panel}>
              <Header
                n="02"
                title="Estado fisiológico"
                tag={ETAPAS[organismo.etapa]}
              />

              <div className={styles.vitalHero}>
                <small>ETAPA VITAL</small>
                <strong>{ETAPAS[organismo.etapa]}</strong>
                <span>
                  «{organismo.reliquia}» · {bpmActual(organismo)} BPM ·{" "}
                  {organismo.tonalidad}
                </span>
              </div>

              <div className={styles.metrics}>
                <Metric label="Energía" value={organismo.energia} />
                <Metric label="Estabilidad" value={organismo.estabilidad} />
                <Metric label="Memoria" value={organismo.memoriaVital} />
                <Metric label="Complejidad" value={organismo.complejidad} />
              </div>

              <Habitats valores={organismo.habitats} />

              <div className={styles.actions}>
                <button
                  onClick={
                    organismo.etapa === "latencia"
                      ? despertarAhora
                      : mutar
                  }
                >
                  {organismo.etapa === "latencia"
                    ? "DESPERTAR"
                    : "INDUCIR MUTACIÓN"}
                </button>
                <button onClick={() => setSonido((v) => !v)}>
                  {sonido ? "CERRAR SONIDO" : "ESCUCHAR"}
                </button>
              </div>
            </article>

            <aside className={styles.panel}>
              <Header
                n="03"
                title="Alimentación"
                tag={`${organismo.injertos.length} INJERTOS`}
              />

              <p className={styles.help}>
                El ADN fundacional permanece intacto. Todo nuevo verso se
                registra como una intervención posterior.
              </p>

              <label className={styles.field}>
                <span>Nuevo verso</span>
                <textarea
                  className={styles.graft}
                  value={injerto}
                  onChange={(e) => setInjerto(e.target.value.slice(0, 500))}
                  placeholder="Entrégale una frase que todavía no conoce…"
                />
              </label>

              <button
                className={styles.primary}
                onClick={alimentar}
                disabled={!injerto.trim()}
              >
                INJERTAR VERSO
              </button>

              <div className={styles.origin}>
                <small>ADN FUNDACIONAL</small>
                <p>{organismo.poema}</p>
              </div>

              <button className={styles.release} onClick={liberar}>
                LIBERAR ORGANISMO
              </button>
            </aside>
          </section>

          <section className={`${styles.panel} ${styles.sound}`}>
            <div className={styles.soundHead}>
              <Header
                n="04"
                title="Manifestación electrónica actual"
                tag={`DÍA ${organismo.edad}`}
              />
              <div>
                <button onClick={copiar}>COPIAR CÓDIGO</button>
                <a href={url} target="_blank" rel="noreferrer">
                  STRUDEL ↗
                </a>
              </div>
            </div>

            <p>
              No pertenece a un género fijo. La forma emerge de sus hábitats,
              su edad, sus injertos y sus mutaciones.
            </p>

            {sonido ? (
              <iframe
                key={url}
                src={url}
                title={`Organismo ${organismo.nombre}`}
                allow="autoplay; microphone; midi"
              />
            ) : null}
          </section>

          <section className={`${styles.panel} ${styles.diary}`}>
            <Header
              n="05"
              title="Diario vital"
              tag={`${organismo.diario.length} REGISTROS`}
            />

            <div>
              {organismo.diario
                .slice()
                .reverse()
                .map((entrada) => (
                  <article key={entrada.id}>
                    <span>DÍA {String(entrada.dia).padStart(2, "0")}</span>
                    <div>
                      <h3>{entrada.titulo}</h3>
                      <p>{entrada.texto}</p>
                    </div>
                    <time>{entrada.fecha}</time>
                  </article>
                ))}
            </div>
          </section>

          <details className={`${styles.panel} ${styles.source}`}>
            <summary>Ver código de la manifestación actual</summary>
            <pre>{codigo}</pre>
          </details>
        </>
      )}

      <footer className={styles.footer}>
        <span>ORGANISMO · V4 · FASE I</span>
        <span>El poema engendra una presencia.</span>
      </footer>

      {mensaje ? <div className={styles.toast}>{mensaje}</div> : null}
    </main>
  );
}

function Header({
  n,
  title,
  tag,
}: {
  n: string;
  title: string;
  tag: string;
}) {
  return (
    <div className={styles.header}>
      <div><span>{n}</span><h2>{title}</h2></div>
      <small>{tag}</small>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.metric}>
      <div><span>{label}</span><b>{value}%</b></div>
      <i><span style={{ width: `${value}%` }} /></i>
    </div>
  );
}

function Habitats({ valores }: { valores: Record<Habitat, number> }) {
  return (
    <div className={styles.habitats}>
      <div className={styles.habitatHead}>
        <span>HÁBITATS ELECTRÓNICOS</span>
        <small>NO SON GÉNEROS CERRADOS</small>
      </div>

      {HABITATS.slice()
        .sort((a, b) => valores[b] - valores[a])
        .map((habitat) => (
          <div className={styles.habitat} key={habitat}>
            <div>
              <strong>{NOMBRES[habitat]}</strong>
              <small>{DESCRIPCIONES[habitat]}</small>
            </div>
            <i><span style={{ width: `${valores[habitat]}%` }} /></i>
            <b>{valores[habitat]}%</b>
          </div>
        ))}
    </div>
  );
}
EOF

cat > "${TARGET}/verso-tecno.module.css" <<'EOF'
.page {
  --bg:#060809; --panel:rgba(12,15,16,.95); --line:rgba(239,237,226,.12);
  --ink:#efede2; --muted:#858d89; --acid:#d9ff59; --signal:#ef7145;
  position:relative; min-height:100vh; overflow:hidden;
  padding:20px clamp(8px,2vw,32px) 40px;
  background:
    radial-gradient(circle at 50% -10%,rgba(239,113,69,.13),transparent 35%),
    linear-gradient(#0a0c0d,var(--bg));
  color:var(--ink); font-family:Arial,Helvetica,sans-serif;
}
.grid {position:fixed;inset:0;pointer-events:none;opacity:.2;
  background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),
  linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px);
  background-size:34px 34px;mask-image:linear-gradient(black,transparent 94%)}
.topbar,.birthLayout,.organismLayout,.sound,.diary,.source,.footer{
  position:relative;z-index:1;width:min(1760px,100%);margin-inline:auto}
.topbar{display:flex;justify-content:space-between;align-items:stretch;min-height:74px;
  margin-bottom:12px;border:1px solid var(--line);background:rgba(6,8,9,.8)}
.brand{display:flex}.brand>span{display:grid;place-items:center;width:72px;border-right:1px solid var(--line);
  color:var(--acid);font:italic 20px Georgia}
.brand>div{display:flex;flex-direction:column;justify-content:center;padding:0 20px}
.brand small{color:var(--muted);font-size:7px;letter-spacing:.2em}
.brand h1{margin:6px 0 0;font:400 clamp(23px,2.5vw,38px) Georgia;letter-spacing:.07em}
.topbar>p{display:flex;align-items:center;gap:10px;margin:0;padding:0 22px;border-left:1px solid var(--line);
  font:italic 12px Georgia}.topbar>p i{width:7px;height:7px;border-radius:50%;background:var(--acid);
  box-shadow:0 0 18px var(--acid)}
.panel{border:1px solid var(--line);background:linear-gradient(135deg,rgba(255,255,255,.025),transparent 40%),var(--panel);
  padding:20px;box-shadow:0 25px 70px rgba(0,0,0,.25)}
.birthLayout{display:grid;grid-template-columns:1.05fr .95fr;gap:12px}
.birthLayout>.panel{min-height:690px}
.organismLayout{display:grid;grid-template-columns:1.05fr .9fr .72fr;gap:12px}
.organismLayout>.panel{min-height:660px}
.header{display:flex;justify-content:space-between;gap:18px;padding-bottom:14px;border-bottom:1px solid var(--line)}
.header>div{display:flex;align-items:baseline;gap:11px}.header span{color:var(--acid);font:italic 10px Georgia}
.header h2{margin:0;font:400 18px Georgia}.header>small{color:var(--muted);font-size:7px;letter-spacing:.17em}
.field{display:block;margin-top:20px}.field>span{color:var(--muted);font-size:8px;font-weight:700;letter-spacing:.16em}
.field input,.field textarea{width:100%;box-sizing:border-box;margin-top:9px;border:1px solid var(--line);
  border-radius:0;outline:0;background:#080a0b;color:var(--ink);font:15px Georgia}
.field input{padding:13px}.field textarea{min-height:330px;padding:16px;resize:vertical;font-size:17px;line-height:1.7}
.field input:focus,.field textarea:focus{border-color:var(--acid)}
blockquote{margin:18px 0 0;padding:16px 0 0;border-top:1px solid var(--line);color:#c8cbc4;
  font:italic 12px/1.55 Georgia}
.primary{display:flex;justify-content:space-between;align-items:center;width:100%;min-height:52px;margin-top:18px;
  padding:0 15px;border:1px solid var(--acid);border-radius:0;background:var(--acid);color:#070909;
  font-size:8px;font-weight:800;letter-spacing:.12em;cursor:pointer}
.primary b{font-weight:500}.primary:disabled{opacity:.3;cursor:not-allowed}
.relicPreview{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:210px;margin-top:16px;
  border:1px solid var(--line);background:radial-gradient(circle,rgba(217,255,89,.12),transparent 58%),#080a0b}
.relicPreview small{color:var(--muted);font-size:7px;letter-spacing:.18em}
.relicPreview strong{max-width:90%;overflow:hidden;margin-top:12px;color:var(--acid);font:italic 400 clamp(32px,4vw,58px) Georgia;
  text-overflow:ellipsis;white-space:nowrap}.relicPreview span{margin-top:12px;color:var(--muted);font-size:8px}
.habitats{margin-top:20px}.habitatHead{display:flex;justify-content:space-between;margin-bottom:8px}
.habitatHead span,.habitatHead small{color:var(--muted);font-size:7px;letter-spacing:.15em}
.habitat{display:grid;grid-template-columns:1.2fr 1fr 38px;align-items:center;gap:12px;min-height:50px;border-top:1px solid var(--line)}
.habitat:last-child{border-bottom:1px solid var(--line)}.habitat>div{display:flex;flex-direction:column;gap:3px}
.habitat strong{font:400 12px Georgia}.habitat small{color:var(--muted);font-size:7px}
.habitat>i,.metric>i{display:block;height:4px;background:rgba(255,255,255,.07);overflow:hidden}
.habitat>i span,.metric>i span{display:block;height:100%;background:linear-gradient(90deg,var(--signal),var(--acid))}
.habitat>b{color:var(--acid);font-size:8px;text-align:right}
.organismVisual{position:relative;display:grid;place-items:center;min-height:500px;margin-top:15px;overflow:hidden;
  border:1px solid var(--line);background:
  linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px),
  radial-gradient(circle,rgba(217,255,89,.1),transparent 55%),#07090a;background-size:45px 45px,45px 45px,auto,auto}
.organismVisual svg{width:min(100%,550px)}.orbit,.orbit2{fill:none;stroke:rgba(239,237,226,.17);stroke-width:1;
  stroke-dasharray:3 8;transform-origin:300px 300px;animation:spin 26s linear infinite}.orbit2{stroke:rgba(217,255,89,.23);
  animation-direction:reverse;animation-duration:18s}
.filaments path{fill:none;stroke:rgba(217,255,89,.38);stroke-width:1.1;stroke-dasharray:3 6;
  animation:breathe 4.5s ease-in-out infinite}.scar{stroke:var(--signal);stroke-width:1.3;opacity:.7}
.coreAura{fill:rgba(239,113,69,.13);animation:aura 3s ease-in-out infinite;transform-origin:300px 300px}
.core{fill:#080a0b;stroke:var(--acid);stroke-width:1.2;animation:aura 2.4s ease-in-out infinite;transform-origin:300px 300px}
.coreWord,.coreDay{text-anchor:middle;fill:var(--ink)}.coreWord{font:italic 17px Georgia}.coreDay{fill:var(--acid);font-size:7px;letter-spacing:.17em}
.visualFooter{position:absolute;left:12px;right:12px;bottom:10px;display:flex;justify-content:space-between;
  color:var(--muted);font-size:7px;letter-spacing:.14em}
.organismTitle{display:flex;justify-content:space-between;align-items:center;padding-top:15px}
.organismTitle small{color:var(--muted);font-size:7px;letter-spacing:.16em}.organismTitle h2{margin:6px 0 0;font:400 24px Georgia}
.organismTitle>strong{display:flex;align-items:baseline;gap:5px;font:400 27px Georgia}.organismTitle>strong span{color:var(--acid);font:7px Arial}
.vitalHero{margin-top:15px;padding:19px;border:1px solid var(--line);background:radial-gradient(circle at 100% 0%,rgba(217,255,89,.12),transparent 50%),#080a0b}
.vitalHero small{color:var(--acid);font-size:7px;letter-spacing:.17em}.vitalHero strong{display:block;margin-top:12px;font:400 clamp(30px,4vw,50px) Georgia}
.vitalHero span{display:block;margin-top:13px;color:var(--muted);font-size:8px}
.metrics{display:grid;grid-template-columns:1fr 1fr;gap:13px 18px;margin-top:20px}
.metric>div{display:flex;justify-content:space-between;margin-bottom:7px}.metric span,.metric b{font-size:7px;letter-spacing:.1em}
.metric span{color:var(--muted)}.metric b{color:var(--acid)}
.actions{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:20px}
.actions button,.soundHead button,.soundHead a{min-height:41px;border:1px solid var(--acid);border-radius:0;background:transparent;
  color:var(--ink);font-size:7px;font-weight:800;letter-spacing:.11em;cursor:pointer;text-decoration:none}
.help{margin:18px 0 0;color:#c8cbc4;font:italic 11px/1.55 Georgia}.field .graft{min-height:130px;font-size:14px}
.origin{margin-top:20px;padding-top:17px;border-top:1px solid var(--line)}.origin small{color:var(--muted);font-size:7px;letter-spacing:.16em}
.origin p{max-height:200px;overflow:auto;color:#c8cbc4;font:12px/1.6 Georgia;white-space:pre-line}
.release{width:100%;min-height:38px;margin-top:17px;border:1px solid var(--line);border-radius:0;background:transparent;color:var(--muted);
  font-size:7px;letter-spacing:.12em;cursor:pointer}
.sound{margin-top:12px}.soundHead{display:flex;justify-content:space-between;gap:18px}.soundHead>.header{flex:1}
.soundHead>div{display:flex;gap:7px}.soundHead button,.soundHead a{display:grid;place-items:center;min-width:115px;padding:0 12px}
.sound>p{max-width:850px;color:var(--muted);font:italic 11px/1.5 Georgia}
.sound iframe{display:block;width:100%;height:590px;margin-top:15px;border:1px solid var(--line);filter:saturate(.78)}
.diary{margin-top:12px}.diary>div:last-child{max-height:580px;overflow:auto;margin-top:12px}
.diary article{display:grid;grid-template-columns:75px 1fr auto;gap:16px;padding:14px 0;border-bottom:1px solid var(--line)}
.diary article>span{color:var(--acid);font-size:7px;letter-spacing:.13em}.diary h3{margin:0;font:400 14px Georgia}
.diary p{margin:5px 0 0;color:var(--muted);font-size:9px;line-height:1.5}.diary time{color:var(--muted);font-size:7px}
.source{margin-top:12px;padding:0}.source summary{padding:20px;cursor:pointer;font:14px Georgia}.source pre{max-height:600px;overflow:auto;
  margin:0;padding:20px;border-top:1px solid var(--line);background:#050606;color:#d5dcd3;font-size:10px;line-height:1.6;white-space:pre-wrap}
.footer{display:flex;justify-content:space-between;padding-top:19px;color:var(--muted);font-size:7px;letter-spacing:.13em}
.toast{position:fixed;right:20px;bottom:20px;z-index:50;max-width:360px;padding:13px 16px;border:1px solid var(--acid);
  background:#080a0b;font-size:9px}.loading{display:grid;place-items:center;min-height:90vh;color:var(--muted);font:italic 13px Georgia}
@keyframes spin{to{transform:rotate(360deg)}}@keyframes breathe{50%{opacity:.35;stroke-dashoffset:18}}
@keyframes aura{50%{transform:scale(1.05);opacity:.7}}
@media(max-width:1180px){.organismLayout{grid-template-columns:1fr 1fr}.organismLayout>.panel:last-child{grid-column:1/-1;min-height:auto}}
@media(max-width:900px){.birthLayout,.organismLayout{grid-template-columns:1fr}.organismLayout>.panel:last-child{grid-column:auto}.birthLayout>.panel,.organismLayout>.panel{min-height:auto}}
@media(max-width:620px){.page{padding:8px 6px 28px}.topbar{flex-direction:column}.topbar>p{min-height:45px;border-top:1px solid var(--line);border-left:0}
  .brand small{display:none}.panel{padding:15px}.habitat{grid-template-columns:1fr 65px 34px}.habitat small{display:none}
  .metrics,.actions{grid-template-columns:1fr}.organismVisual{min-height:390px}.soundHead{flex-direction:column}.soundHead>div{flex-direction:column}
  .sound iframe{height:520px}.diary article{grid-template-columns:1fr}.footer{flex-direction:column;gap:7px}}
EOF

cat > "${TARGET}/README-ORGANISMO-V4.md" <<'EOF'
# Organismo V4 · Fase I

Esta fase incorpora:

- Incubación de un poema.
- Palabra reliquia.
- Seis hábitats electrónicos: deriva, pulso, fractura, espectral, máquina y memoria.
- Música electrónica no limitada al techno.
- Edad real y etapas vitales.
- Evolución determinista al volver a la web.
- Mutaciones inducidas.
- Injertos de nuevos versos.
- Diario vital.
- Persistencia local.
- Representación orgánica generativa.
- Manifestación sonora mediante Strudel.

Siguiente fase:

- Instantáneas históricas escuchables.
- IndexedDB y archivo de varios organismos.
- Voz poética.
- Exportación WAV.
EOF

rm -rf .next

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ORGANISMO V4 · FASE I INSTALADA"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Copia de seguridad conservada"
echo "✅ Incubación y crecimiento"
echo "✅ Música electrónica abierta"
echo "✅ Mutaciones, injertos y diario"
echo "✅ Persistencia local"
echo ""
echo "Arranca:"
echo "  npm run dev -- --webpack"
echo ""
echo "Abre:"
echo "  http://localhost:3000/laboratorio/verso-tecno"
