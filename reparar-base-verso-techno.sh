#!/usr/bin/env bash
set -euo pipefail

cd "${HOME}/poema-universal"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " REPARADOR BASE · VERSO → TECHNO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ ! -f package.json ]]; then
  echo "❌ No encuentro package.json en ~/poema-universal"
  exit 1
fi

# El instalador V2 del usuario seleccionó app/, así que reconstruimos ahí.
APP_ROOT="app"
TARGET="${APP_ROOT}/laboratorio/verso-tecno"
STAMP="$(date +%Y%m%d-%H%M%S)"

if [[ -d "${TARGET}" ]]; then
  cp -R "${TARGET}" "${TARGET}.before-base-repair-${STAMP}"
  echo "✅ Copia de seguridad creada."
fi

mkdir -p "${TARGET}"

cat > "${TARGET}/motor.ts" <<'EOF'
export type ModoTransmutacion = "huella" | "ritual" | "club";

export type FamiliaSimbolica =
  | "tierra"
  | "agua"
  | "fuego"
  | "aire"
  | "memoria"
  | "ausencia"
  | "cuerpo"
  | "maquina"
  | "hambre"
  | "neutra";

export type EventoLiterario = {
  palabra: string;
  familia: FamiliaSimbolica;
  nota: string;
};

export type AnalisisLiterario = {
  bpm: number;
  tonalidad: string;
  palabras: number;
  versos: number;
  pausas: number;
  repeticiones: number;
  tension: number;
  oscuridad: number;
  luminosidad: number;
  familias: Array<{
    familia: FamiliaSimbolica;
    cantidad: number;
  }>;
  eventos: EventoLiterario[];
};

const CAMPOS: Record<Exclude<FamiliaSimbolica, "neutra">, string[]> = {
  tierra: [
    "tierra", "raíz", "raiz", "piedra", "barro", "bosque", "árbol", "arbol",
    "polvo", "semilla", "montaña", "montana", "suelo", "rama", "hoja",
  ],
  agua: [
    "agua", "mar", "río", "rio", "lluvia", "océano", "oceano", "ola", "lágrima",
    "lagrima", "nave", "puerto", "nadar", "húmedo", "humedo",
  ],
  fuego: [
    "fuego", "llama", "arder", "incendio", "ceniza", "brasa", "sol", "rojo",
    "calor", "quemar", "luz", "relámpago", "relampago",
  ],
  aire: [
    "aire", "viento", "cielo", "nube", "vuelo", "respirar", "aliento", "pájaro",
    "pajaro", "ala", "tormenta", "silbo",
  ],
  memoria: [
    "memoria", "recuerdo", "nombre", "ayer", "antes", "infancia", "abuelo",
    "madre", "padre", "fotografía", "fotografia", "cuaderno", "historia",
  ],
  ausencia: [
    "ausencia", "vacío", "vacio", "nunca", "nadie", "desaparecer", "olvido",
    "silencio", "muerto", "muerte", "sombra", "solo", "soledad", "perdido",
  ],
  cuerpo: [
    "cuerpo", "piel", "mano", "sangre", "boca", "hueso", "corazón", "corazon",
    "pie", "rostro", "ojo", "carne", "pulso", "vientre",
  ],
  maquina: [
    "máquina", "maquina", "motor", "hierro", "metal", "código", "codigo",
    "cable", "ciudad", "fábrica", "fabrica", "ruido", "tren", "reloj",
  ],
  hambre: [
    "hambre", "comer", "pan", "boca", "vacío", "vacio", "animal", "deseo",
    "necesidad", "mesa", "resto", "migaja", "sed",
  ],
};

const NOTAS: Record<FamiliaSimbolica, string[]> = {
  tierra: ["c2", "g2", "eb2", "bb1"],
  agua: ["d3", "a3", "e4", "b3"],
  fuego: ["f2", "c3", "ab2", "eb3"],
  aire: ["g4", "d5", "a4", "e5"],
  memoria: ["eb3", "g3", "bb3", "d4"],
  ausencia: ["db2", "ab2", "eb3", "bb1"],
  cuerpo: ["c3", "eb3", "g3", "bb2"],
  maquina: ["f#2", "c#3", "g#2", "d#3"],
  hambre: ["d2", "f2", "a2", "c3"],
  neutra: ["c3", "g3", "eb3", "bb2"],
};

const STOP = new Set([
  "a", "al", "algo", "ante", "bajo", "como", "con", "contra", "cuando", "de",
  "del", "desde", "donde", "el", "ella", "en", "entre", "era", "es", "esta",
  "este", "fue", "ha", "hasta", "hay", "la", "las", "lo", "los", "más", "mas",
  "me", "mi", "muy", "no", "nos", "o", "para", "pero", "por", "que", "se",
  "sin", "sobre", "su", "sus", "te", "todavía", "todavia", "tu", "un", "una",
  "y", "ya",
]);

const TONALIDADES_OSCURAS = ["C menor", "D menor", "Eb menor", "F menor"];
const TONALIDADES_LUMINOSAS = ["C dórico", "D dórico", "F lidio", "G mixolidio"];

function normalizar(valor: string): string {
  return valor
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function limitar(valor: number, minimo = 0, maximo = 100): number {
  return Math.max(minimo, Math.min(maximo, Math.round(valor)));
}

function hash(texto: string): number {
  let resultado = 2166136261;

  for (let indice = 0; indice < texto.length; indice += 1) {
    resultado ^= texto.charCodeAt(indice);
    resultado = Math.imul(resultado, 16777619);
  }

  return Math.abs(resultado >>> 0);
}

function familiaDe(palabra: string): FamiliaSimbolica {
  const limpia = normalizar(palabra);

  for (const [familia, vocabulario] of Object.entries(CAMPOS)) {
    if (vocabulario.some((entrada) => normalizar(entrada) === limpia)) {
      return familia as FamiliaSimbolica;
    }
  }

  if (/(mar|agua|rio|lluv|ola)/.test(limpia)) return "agua";
  if (/(fueg|ard|luz|sol|ceniz)/.test(limpia)) return "fuego";
  if (/(tierr|piedr|arbol|raiz|polv)/.test(limpia)) return "tierra";
  if (/(vient|aire|ciel|respir|ala)/.test(limpia)) return "aire";
  if (/(record|memori|nombre|ayer|histori)/.test(limpia)) return "memoria";
  if (/(muer|vaci|ausen|olvid|silenc|sombra)/.test(limpia)) return "ausencia";
  if (/(cuerp|piel|sangr|hues|corazon|mano)/.test(limpia)) return "cuerpo";
  if (/(maquin|motor|metal|codigo|ciudad|reloj)/.test(limpia)) return "maquina";
  if (/(hamb|pan|comer|sed|deseo|migaj)/.test(limpia)) return "hambre";

  return "neutra";
}

function extraerPalabras(texto: string): string[] {
  return (
    texto.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:['’-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*/g) ??
    []
  );
}

function contarSilabasAproximadas(palabra: string): number {
  const grupos = normalizar(palabra).match(/[aeiouy]+/g);
  return Math.max(1, grupos?.length ?? 1);
}

function elegirNota(palabra: string, familia: FamiliaSimbolica): string {
  const notas = NOTAS[familia];
  return notas[hash(palabra) % notas.length];
}

function construirEventos(palabras: string[]): EventoLiterario[] {
  const relevantes = palabras.filter((palabra) => {
    const limpia = normalizar(palabra);
    return limpia.length > 2 && !STOP.has(limpia);
  });

  const unicas: string[] = [];
  const vistas = new Set<string>();

  for (const palabra of relevantes) {
    const clave = normalizar(palabra);
    if (vistas.has(clave)) continue;
    vistas.add(clave);
    unicas.push(palabra);
  }

  return unicas.slice(0, 16).map((palabra) => {
    const familia = familiaDe(palabra);
    return {
      palabra,
      familia,
      nota: elegirNota(palabra, familia),
    };
  });
}

export function analizarLiteratura(
  texto: string,
  modo: ModoTransmutacion,
): AnalisisLiterario {
  const palabrasCrudas = extraerPalabras(texto);
  const palabrasNormalizadas = palabrasCrudas.map(normalizar);
  const versos = Math.max(
    1,
    texto
      .split(/\n+/)
      .map((linea) => linea.trim())
      .filter(Boolean).length,
  );
  const pausas = (texto.match(/[,.…;:!?—-]/g) ?? []).length;

  const frecuencia = new Map<string, number>();
  for (const palabra of palabrasNormalizadas) {
    if (palabra.length <= 2 || STOP.has(palabra)) continue;
    frecuencia.set(palabra, (frecuencia.get(palabra) ?? 0) + 1);
  }

  const repeticiones = [...frecuencia.values()].reduce(
    (total, cantidad) => total + Math.max(0, cantidad - 1),
    0,
  );

  const conteoFamilias = new Map<FamiliaSimbolica, number>();
  for (const palabra of palabrasCrudas) {
    const familia = familiaDe(palabra);
    conteoFamilias.set(familia, (conteoFamilias.get(familia) ?? 0) + 1);
  }

  const oscuras =
    (conteoFamilias.get("ausencia") ?? 0) +
    (conteoFamilias.get("hambre") ?? 0) +
    (conteoFamilias.get("maquina") ?? 0) * 0.55;

  const luminosas =
    (conteoFamilias.get("fuego") ?? 0) * 0.75 +
    (conteoFamilias.get("aire") ?? 0) +
    (conteoFamilias.get("agua") ?? 0) * 0.35;

  const total = Math.max(1, palabrasCrudas.length);
  const oscuridad = limitar(22 + (oscuras / total) * 260 + repeticiones * 2.5);
  const luminosidad = limitar(
    20 + (luminosas / total) * 245 + Math.max(0, 12 - oscuridad * 0.08),
  );

  const silabas =
    palabrasCrudas.reduce(
      (suma, palabra) => suma + contarSilabasAproximadas(palabra),
      0,
    ) / Math.max(1, palabrasCrudas.length);

  const tension = limitar(
    24 +
      pausas * 2.3 +
      repeticiones * 4 +
      Math.max(0, palabrasCrudas.length - versos * 5) * 0.42 +
      oscuridad * 0.25,
  );

  const baseModo: Record<ModoTransmutacion, number> = {
    huella: 118,
    ritual: 126,
    club: 134,
  };

  const bpm = limitar(
    baseModo[modo] +
      Math.round((silabas - 2) * 3) +
      Math.min(8, repeticiones) +
      Math.min(6, Math.floor(pausas / 3)),
    108,
    148,
  );

  const tonalidades =
    oscuridad >= luminosidad ? TONALIDADES_OSCURAS : TONALIDADES_LUMINOSAS;
  const tonalidad = tonalidades[hash(texto || modo) % tonalidades.length];

  const familias = [...conteoFamilias.entries()]
    .filter(([familia, cantidad]) => familia !== "neutra" && cantidad > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([familia, cantidad]) => ({ familia, cantidad }));

  return {
    bpm,
    tonalidad,
    palabras: palabrasCrudas.length,
    versos,
    pausas,
    repeticiones,
    tension,
    oscuridad,
    luminosidad,
    familias,
    eventos: construirEventos(palabrasCrudas),
  };
}

function notasDeEventos(analisis: AnalisisLiterario): string {
  const notas = analisis.eventos.map((evento) => evento.nota).slice(0, 8);
  return notas.length ? notas.join(" ") : "c2 eb2 g2 bb1";
}

function escaparComentario(texto: string): string {
  return texto.replace(/\*\//g, "* /").slice(0, 1200);
}

export function generarCodigoStrudel(
  titulo: string,
  texto: string,
  modo: ModoTransmutacion,
  analisis: AnalisisLiterario,
): string {
  const notas = notasDeEventos(analisis);
  const gananciaKick = modo === "club" ? 1 : modo === "ritual" ? 0.9 : 0.78;
  const filtro = Math.round(
    420 + analisis.luminosidad * 8 + analisis.tension * 3,
  );
  const ambiente =
    modo === "huella" ? 0.58 : modo === "ritual" ? 0.72 : 0.42;

  return `/*
VERSO → TECHNO
Obra: ${escaparComentario(titulo || "Sin título")}
Modo: ${modo}
BPM: ${analisis.bpm}
Tonalidad: ${analisis.tonalidad}

Texto de origen:
${escaparComentario(texto)}
*/

setcpm(${analisis.bpm}/4)

stack(
  s("bd*4")
    .gain(${gananciaKick}),

  s("~ cp ~ cp")
    .gain(0.55)
    .room(0.18),

  s("[~ hh]*4")
    .gain(0.34)
    .hpf(5200),

  note("<${notas}>")
    .s("sawtooth")
    .lpf(${filtro})
    .lpq(8)
    .gain(0.54)
    .sometimesBy(0.22, x => x.add(note(12))),

  note("<${notas}>")
    .s("triangle")
    .slow(4)
    .gain(0.22)
    .room(${ambiente})
    .delay(0.36)
)
`;
}

function base64Utf8(texto: string): string {
  const bytes = new TextEncoder().encode(texto);
  const tabla =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let salida = "";

  for (let indice = 0; indice < bytes.length; indice += 3) {
    const a = bytes[indice] ?? 0;
    const b = bytes[indice + 1] ?? 0;
    const c = bytes[indice + 2] ?? 0;
    const bloque = (a << 16) | (b << 8) | c;

    salida += tabla[(bloque >> 18) & 63];
    salida += tabla[(bloque >> 12) & 63];
    salida += indice + 1 < bytes.length ? tabla[(bloque >> 6) & 63] : "=";
    salida += indice + 2 < bytes.length ? tabla[bloque & 63] : "=";
  }

  return salida;
}

export function crearUrlStrudel(codigo: string): string {
  return `https://strudel.cc/#${base64Utf8(codigo)}`;
}
EOF

cat > "${TARGET}/page.tsx" <<'EOF'
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verso → Techno",
};

export default function ReparacionVersoTecno() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#090b0c",
        color: "#f2eee4",
        fontFamily: "Georgia, serif",
        padding: 32,
        textAlign: "center",
      }}
    >
      <div>
        <p style={{ letterSpacing: "0.22em", fontSize: 11, opacity: 0.58 }}>
          BASE RECONSTRUIDA
        </p>
        <h1 style={{ fontSize: "clamp(42px, 8vw, 96px)", fontWeight: 400 }}>
          Verso → Techno
        </h1>
        <p style={{ maxWidth: 620, lineHeight: 1.7, opacity: 0.72 }}>
          El motor literario ha sido restaurado. Ejecuta ahora el instalador de
          la consola V2 para completar la interfaz.
        </p>
      </div>
    </main>
  );
}
EOF

echo ""
echo "✅ Base V1 reconstruida en:"
echo "   ${TARGET}"
echo "✅ motor.ts creado."
echo "✅ Ruta provisional creada."
echo ""
echo "SIGUIENTE PASO:"
echo "  bash instalar-verso-techno-consola-v2.sh"
