#!/usr/bin/env bash
set -euo pipefail

cd "${HOME}/poema-universal"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " VERSO → TECHNO V3 · DRAMATURGIA SONORA"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ ! -f package.json ]]; then
  echo "❌ No encuentro package.json en ~/poema-universal"
  exit 1
fi

if [[ -d app/laboratorio/verso-tecno ]]; then
  TARGET="app/laboratorio/verso-tecno"
elif [[ -d src/app/laboratorio/verso-tecno ]]; then
  TARGET="src/app/laboratorio/verso-tecno"
else
  echo "❌ No encuentro la herramienta Verso → Techno."
  echo "   Ruta esperada: app/laboratorio/verso-tecno"
  exit 1
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="${TARGET}.before-dramaturgia-v3-${STAMP}"
cp -R "${TARGET}" "${BACKUP}"

echo "✅ Copia de seguridad:"
echo "   ${BACKUP}"

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

export type TipoEscena =
  | "aparicion"
  | "invocacion"
  | "cuerpo"
  | "ruptura"
  | "retorno"
  | "climax"
  | "desaparicion";

export type EventoLiterario = {
  palabra: string;
  familia: FamiliaSimbolica;
  nota: string;
};

export type EscenaLiteraria = {
  id: number;
  verso: string;
  funcion: TipoEscena;
  ciclos: number;
  tension: number;
  oscuridad: number;
  luminosidad: number;
  pausas: number;
  palabraReliquia: string;
  familiaDominante: FamiliaSimbolica;
  notas: string[];
  acciones: string[];
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
  escenas: EscenaLiteraria[];
  palabraReliquia: string;
  ciclosTotales: number;
};

type Metricas = {
  palabrasCrudas: string[];
  palabrasNormalizadas: string[];
  pausas: number;
  repeticiones: number;
  tension: number;
  oscuridad: number;
  luminosidad: number;
  familias: Map<FamiliaSimbolica, number>;
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

const NOMBRE_FUNCION: Record<TipoEscena, string> = {
  aparicion: "Aparición",
  invocacion: "Invocación",
  cuerpo: "Cuerpo",
  ruptura: "Ruptura",
  retorno: "Retorno",
  climax: "Clímax",
  desaparicion: "Desaparición",
};

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

function extraerPalabras(texto: string): string[] {
  return (
    texto.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:['’-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*/g) ??
    []
  );
}

function palabrasRelevantes(texto: string): string[] {
  return extraerPalabras(texto).filter((palabra) => {
    const limpia = normalizar(palabra);
    return limpia.length > 2 && !STOP.has(limpia);
  });
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
  if (/(muer|vaci|ausen|olvid|silenc|sombra|desapare)/.test(limpia)) {
    return "ausencia";
  }
  if (/(cuerp|piel|sangr|hues|corazon|mano|pulso)/.test(limpia)) {
    return "cuerpo";
  }
  if (/(maquin|motor|metal|codigo|ciudad|reloj|fabrica)/.test(limpia)) {
    return "maquina";
  }
  if (/(hamb|pan|comer|sed|deseo|migaj)/.test(limpia)) return "hambre";

  return "neutra";
}

function contarSilabasAproximadas(palabra: string): number {
  const grupos = normalizar(palabra).match(/[aeiouy]+/g);
  return Math.max(1, grupos?.length ?? 1);
}

function elegirNota(
  palabra: string,
  familia: FamiliaSimbolica,
  variacion = 0,
): string {
  const notas = NOTAS[familia];
  return notas[(hash(palabra) + variacion) % notas.length];
}

function calcularMetricas(texto: string): Metricas {
  const palabrasCrudas = extraerPalabras(texto);
  const palabrasNormalizadas = palabrasCrudas.map(normalizar);
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

  const familias = new Map<FamiliaSimbolica, number>();
  for (const palabra of palabrasCrudas) {
    const familia = familiaDe(palabra);
    familias.set(familia, (familias.get(familia) ?? 0) + 1);
  }

  const oscuras =
    (familias.get("ausencia") ?? 0) +
    (familias.get("hambre") ?? 0) +
    (familias.get("maquina") ?? 0) * 0.55;

  const luminosas =
    (familias.get("fuego") ?? 0) * 0.75 +
    (familias.get("aire") ?? 0) +
    (familias.get("agua") ?? 0) * 0.35;

  const total = Math.max(1, palabrasCrudas.length);
  const oscuridad = limitar(22 + (oscuras / total) * 260 + repeticiones * 2.5);
  const luminosidad = limitar(
    20 + (luminosas / total) * 245 + Math.max(0, 12 - oscuridad * 0.08),
  );

  const tension = limitar(
    24 +
      pausas * 5 +
      repeticiones * 5 +
      Math.max(0, palabrasCrudas.length - 6) * 1.3 +
      oscuridad * 0.28,
  );

  return {
    palabrasCrudas,
    palabrasNormalizadas,
    pausas,
    repeticiones,
    tension,
    oscuridad,
    luminosidad,
    familias,
  };
}

function palabraReliquiaDe(texto: string): string {
  const palabras = palabrasRelevantes(texto);
  if (!palabras.length) return "silencio";

  const frecuencia = new Map<string, { palabra: string; cantidad: number }>();

  for (const palabra of palabras) {
    const clave = normalizar(palabra);
    const actual = frecuencia.get(clave);
    frecuencia.set(clave, {
      palabra: actual?.palabra ?? palabra,
      cantidad: (actual?.cantidad ?? 0) + 1,
    });
  }

  return [...frecuencia.values()]
    .sort((a, b) => {
      const familiaA = familiaDe(a.palabra);
      const familiaB = familiaDe(b.palabra);
      const pesoA =
        a.cantidad * 10 +
        (familiaA === "neutra" ? 0 : 5) +
        Math.min(8, a.palabra.length);
      const pesoB =
        b.cantidad * 10 +
        (familiaB === "neutra" ? 0 : 5) +
        Math.min(8, b.palabra.length);

      return pesoB - pesoA || hash(a.palabra) - hash(b.palabra);
    })[0].palabra;
}

function familiaDominanteDe(metricas: Metricas): FamiliaSimbolica {
  const ordenadas = [...metricas.familias.entries()]
    .filter(([familia]) => familia !== "neutra")
    .sort((a, b) => b[1] - a[1]);

  return ordenadas[0]?.[0] ?? "neutra";
}

function accionesDe(
  funcion: TipoEscena,
  familia: FamiliaSimbolica,
): string[] {
  const porFuncion: Record<TipoEscena, string> = {
    aparicion: "Abrir el espacio antes de afirmar el pulso",
    invocacion: "Introducir el motivo sin revelar toda la batería",
    cuerpo: "Consolidar bombo, bajo y repetición física",
    ruptura: "Vaciar una capa y fracturar la métrica",
    retorno: "Recuperar un motivo anterior transformado",
    climax: "Elevar densidad, registro y presión rítmica",
    desaparicion: "Retirar el cuerpo y conservar la huella",
  };

  const porFamilia: Record<FamiliaSimbolica, string> = {
    tierra: "Graves secos y resonancia mineral",
    agua: "Delay fluido y desplazamiento lateral",
    fuego: "Saturación y apertura del filtro",
    aire: "Registro alto, respiración y espacio",
    memoria: "Eco, reaparición y repetición degradada",
    ausencia: "Silencio estructural y colas espectrales",
    cuerpo: "Subgrave, pulso y cercanía",
    maquina: "Secuencia metálica y precisión mecánica",
    hambre: "Insistencia, tensión y motivo incompleto",
    neutra: "Materia sonora abierta",
  };

  return [porFuncion[funcion], porFamilia[familia]];
}

function notasDelVerso(verso: string): string[] {
  const palabras = palabrasRelevantes(verso);
  const vistas = new Set<string>();
  const notas: string[] = [];

  for (const palabra of palabras) {
    const clave = normalizar(palabra);
    if (vistas.has(clave)) continue;
    vistas.add(clave);
    notas.push(elegirNota(palabra, familiaDe(palabra)));
    if (notas.length === 5) break;
  }

  return notas.length ? notas : ["c2", "eb2", "g2"];
}

function ciclosDe(
  funcion: TipoEscena,
  palabras: number,
  pausas: number,
): number {
  const base: Record<TipoEscena, number> = {
    aparicion: 8,
    invocacion: 8,
    cuerpo: 12,
    ruptura: 8,
    retorno: 8,
    climax: 16,
    desaparicion: 8,
  };

  const extraPalabras = palabras >= 14 ? 4 : palabras >= 9 ? 2 : 0;
  const extraPausas = pausas >= 3 ? 2 : 0;
  return Math.min(20, base[funcion] + extraPalabras + extraPausas);
}

function crearEscenas(texto: string): EscenaLiteraria[] {
  const versos = texto
    .split(/\n+/)
    .map((verso) => verso.trim())
    .filter(Boolean);

  const unidades = versos.length ? versos : [texto.trim() || "Silencio"];
  const metricas = unidades.map(calcularMetricas);

  const candidatosInternos = metricas
    .map((valor, indice) => ({ indice, valor }))
    .filter(({ indice }) => indice > 0 && indice < unidades.length - 1);

  const indiceClimax =
    candidatosInternos
      .slice()
      .sort((a, b) => b.valor.tension - a.valor.tension)[0]?.indice ??
    Math.max(0, unidades.length - 2);

  const indiceRuptura =
    candidatosInternos
      .filter(({ indice }) => indice !== indiceClimax)
      .map(({ indice, valor }) => ({
        indice,
        puntuacion:
          valor.pausas * 4 +
          (/[!?;—]/.test(unidades[indice]) ? 8 : 0) +
          valor.oscuridad * 0.12,
      }))
      .sort((a, b) => b.puntuacion - a.puntuacion)[0]?.indice ?? -1;

  const vistas = new Set<string>();

  return unidades.map((verso, indice) => {
    const datos = metricas[indice];
    const palabras = palabrasRelevantes(verso).map(normalizar);
    const tieneRetorno =
      palabras.some((palabra) => vistas.has(palabra)) ||
      /\b(volver|vuelve|regresa|retorna|otra vez|de nuevo)\b/i.test(verso);

    palabras.forEach((palabra) => vistas.add(palabra));

    const familiaDominante = familiaDominanteDe(datos);
    let funcion: TipoEscena;

    if (indice === 0) {
      funcion = "aparicion";
    } else if (indice === unidades.length - 1) {
      funcion = "desaparicion";
    } else if (indice === indiceClimax) {
      funcion = "climax";
    } else if (indice === indiceRuptura) {
      funcion = "ruptura";
    } else if (tieneRetorno) {
      funcion = "retorno";
    } else if (
      ["cuerpo", "hambre", "maquina", "fuego"].includes(familiaDominante)
    ) {
      funcion = "cuerpo";
    } else {
      funcion = "invocacion";
    }

    return {
      id: indice,
      verso,
      funcion,
      ciclos: ciclosDe(
        funcion,
        datos.palabrasCrudas.length,
        datos.pausas,
      ),
      tension: datos.tension,
      oscuridad: datos.oscuridad,
      luminosidad: datos.luminosidad,
      pausas: datos.pausas,
      palabraReliquia: palabraReliquiaDe(verso),
      familiaDominante,
      notas: notasDelVerso(verso),
      acciones: accionesDe(funcion, familiaDominante),
    };
  });
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
  const datos = calcularMetricas(texto);
  const versos = Math.max(
    1,
    texto
      .split(/\n+/)
      .map((linea) => linea.trim())
      .filter(Boolean).length,
  );

  const silabas =
    datos.palabrasCrudas.reduce(
      (suma, palabra) => suma + contarSilabasAproximadas(palabra),
      0,
    ) / Math.max(1, datos.palabrasCrudas.length);

  const baseModo: Record<ModoTransmutacion, number> = {
    huella: 118,
    ritual: 126,
    club: 134,
  };

  const bpm = limitar(
    baseModo[modo] +
      Math.round((silabas - 2) * 3) +
      Math.min(8, datos.repeticiones) +
      Math.min(6, Math.floor(datos.pausas / 3)),
    108,
    148,
  );

  const tonalidades =
    datos.oscuridad >= datos.luminosidad
      ? TONALIDADES_OSCURAS
      : TONALIDADES_LUMINOSAS;

  const tonalidad =
    tonalidades[hash(texto || modo) % tonalidades.length];

  const familias = [...datos.familias.entries()]
    .filter(([familia, cantidad]) => familia !== "neutra" && cantidad > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([familia, cantidad]) => ({ familia, cantidad }));

  const escenas = crearEscenas(texto);

  return {
    bpm,
    tonalidad,
    palabras: datos.palabrasCrudas.length,
    versos,
    pausas: datos.pausas,
    repeticiones: datos.repeticiones,
    tension: datos.tension,
    oscuridad: datos.oscuridad,
    luminosidad: datos.luminosidad,
    familias,
    eventos: construirEventos(datos.palabrasCrudas),
    escenas,
    palabraReliquia: palabraReliquiaDe(texto),
    ciclosTotales: escenas.reduce(
      (total, escena) => total + escena.ciclos,
      0,
    ),
  };
}

function escaparComentario(texto: string): string {
  return texto.replace(/\*\//g, "* /").slice(0, 1800);
}

function rotar<T>(valores: T[], cantidad: number): T[] {
  if (!valores.length) return valores;
  const giro = ((cantidad % valores.length) + valores.length) % valores.length;
  return [...valores.slice(giro), ...valores.slice(0, giro)];
}

function patronDeEscena(
  escena: EscenaLiteraria,
  modo: ModoTransmutacion,
  variacion: number,
): string {
  const giro = variacion + escena.id;
  const notas = rotar(escena.notas, giro).join(" ");
  const notaReliquia = elegirNota(
    escena.palabraReliquia,
    escena.familiaDominante,
    giro,
  );

  const gananciaModo: Record<ModoTransmutacion, number> = {
    huella: 0.72,
    ritual: 0.86,
    club: 1,
  };

  const filtro =
    380 +
    escena.luminosidad * 9 +
    escena.tension * 3 +
    (modo === "club" ? 240 : 0);

  const patrones: Record<
    TipoEscena,
    {
      kick: string;
      clap: string;
      hats: string;
      bajoGain: number;
      room: number;
      delay: number;
    }
  > = {
    aparicion: {
      kick: "bd ~ ~ ~",
      clap: "~ ~ ~ ~",
      hats: "~ hh ~ ~",
      bajoGain: 0.22,
      room: 0.72,
      delay: 0.4,
    },
    invocacion: {
      kick: "bd ~ bd ~",
      clap: "~ cp ~ ~",
      hats: "~ hh ~ hh",
      bajoGain: 0.34,
      room: 0.48,
      delay: 0.28,
    },
    cuerpo: {
      kick: "bd*4",
      clap: "~ cp ~ cp",
      hats: "hh*8",
      bajoGain: 0.54,
      room: 0.22,
      delay: 0.12,
    },
    ruptura: {
      kick: "bd(3,8)",
      clap: "~ ~ cp ~",
      hats: "[~ hh]*4",
      bajoGain: 0.42,
      room: 0.62,
      delay: 0.46,
    },
    retorno: {
      kick: "bd*4",
      clap: "~ cp ~ cp",
      hats: "hh*8",
      bajoGain: 0.48,
      room: 0.38,
      delay: 0.3,
    },
    climax: {
      kick: "bd*4",
      clap: "~ cp ~ cp",
      hats: "hh*16",
      bajoGain: 0.66,
      room: 0.3,
      delay: 0.18,
    },
    desaparicion: {
      kick: "bd ~ ~ ~",
      clap: "~ ~ ~ cp",
      hats: "~ hh ~ ~",
      bajoGain: 0.2,
      room: 0.84,
      delay: 0.56,
    },
  };

  const patron = patrones[escena.funcion];
  const kickGain = (0.78 * gananciaModo[modo]).toFixed(2);
  const bajoGain = (patron.bajoGain * gananciaModo[modo]).toFixed(2);

  const capaClimax =
    escena.funcion === "climax"
      ? `,
  s("oh(3,8)")
    .gain(0.22)
    .room(0.38)`
      : "";

  const capaRuptura =
    escena.funcion === "ruptura"
      ? `,
  s("rim*2")
    .gain(0.14)
    .delay(0.35)`
      : "";

  return `stack(
  s("${patron.kick}")
    .gain(${kickGain}),

  s("${patron.clap}")
    .gain(0.48)
    .room(${patron.room}),

  s("${patron.hats}")
    .gain(0.24)
    .hpf(5200),

  note("<${notas}>")
    .s("sawtooth")
    .lpf(${Math.round(filtro)})
    .lpq(7)
    .gain(${bajoGain}),

  note("<${notaReliquia} ~ ${notaReliquia} ~>")
    .s("triangle")
    .slow(2)
    .gain(0.18)
    .room(${patron.room})
    .delay(${patron.delay})${capaClimax}${capaRuptura}
)`;
}

export function generarCodigoStrudel(
  titulo: string,
  texto: string,
  modo: ModoTransmutacion,
  analisis: AnalisisLiterario,
  variacionGlobal = 0,
  mutaciones: Record<number, number> = {},
): string {
  const definiciones = analisis.escenas
    .map((escena) => {
      const numero = String(escena.id + 1).padStart(2, "0");
      const variacion = variacionGlobal + (mutaciones[escena.id] ?? 0);

      return `// ${numero} · ${NOMBRE_FUNCION[escena.funcion]}
// "${escaparComentario(escena.verso)}"
const escena${numero} = ${patronDeEscena(
        escena,
        modo,
        variacion,
      )}`;
    })
    .join("\n\n");

  const arreglo = analisis.escenas
    .map((escena) => {
      const numero = String(escena.id + 1).padStart(2, "0");
      return `  [${escena.ciclos}, escena${numero}]`;
    })
    .join(",\n");

  return `/*
VERSO → TECHNO V3
Motor de Dramaturgia Sonora

Obra: ${escaparComentario(titulo || "Sin título")}
Modo: ${modo}
BPM: ${analisis.bpm}
Tonalidad: ${analisis.tonalidad}
Palabra reliquia: ${escaparComentario(analisis.palabraReliquia)}
Escenas: ${analisis.escenas.length}
Ciclos totales: ${analisis.ciclosTotales}

El poema gobierna la evolución temporal de la pieza.
*/

setcpm(${analisis.bpm}/4)

${definiciones}

arrange(
${arreglo}
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

cat > "${TARGET}/VersoTecno.tsx" <<'EOF'
"use client";

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import {
  analizarLiteratura,
  crearUrlStrudel,
  generarCodigoStrudel,
  type EscenaLiteraria,
  type ModoTransmutacion,
  type TipoEscena,
} from "./motor";
import styles from "./verso-tecno.module.css";

const TEXTO_INICIAL = `No dejes que desaparezcamos.
Todavía queda fuego bajo la tierra.
La ciudad respira el nombre que olvidamos.
Pero el silencio vuelve con otra forma.
Y al final solo queda una luz respirando.`;

const NOMBRE_FAMILIA: Record<string, string> = {
  tierra: "Tierra",
  agua: "Agua",
  fuego: "Fuego",
  aire: "Aire",
  memoria: "Memoria",
  ausencia: "Ausencia",
  cuerpo: "Cuerpo",
  maquina: "Máquina",
  hambre: "Hambre",
  neutra: "Materia",
};

const NOMBRE_ESCENA: Record<TipoEscena, string> = {
  aparicion: "Aparición",
  invocacion: "Invocación",
  cuerpo: "Cuerpo",
  ruptura: "Ruptura",
  retorno: "Retorno",
  climax: "Clímax",
  desaparicion: "Desaparición",
};

const CODIGO_ESCENA: Record<TipoEscena, string> = {
  aparicion: "A",
  invocacion: "I",
  cuerpo: "C",
  ruptura: "R",
  retorno: "RT",
  climax: "CL",
  desaparicion: "D",
};

const MODOS: Array<{
  id: ModoTransmutacion;
  nombre: string;
  codigo: string;
  descripcion: string;
}> = [
  {
    id: "huella",
    nombre: "Huella",
    codigo: "H01",
    descripcion: "La métrica y la estructura dominan.",
  },
  {
    id: "ritual",
    nombre: "Ritual",
    codigo: "R02",
    descripcion: "Equilibrio entre símbolo, atmósfera y pulso.",
  },
  {
    id: "club",
    nombre: "Cuerpo",
    codigo: "C03",
    descripcion: "Más presión, repetición y materia física.",
  },
];

export default function VersoTecno() {
  const [titulo, setTitulo] = useState("No dejes que desaparezcamos");
  const [texto, setTexto] = useState(TEXTO_INICIAL);
  const [modo, setModo] = useState<ModoTransmutacion>("ritual");
  const [revision, setRevision] = useState(0);
  const [mutaciones, setMutaciones] = useState<Record<number, number>>({});
  const [escenaSeleccionada, setEscenaSeleccionada] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [motorVisible, setMotorVisible] = useState(true);

  useEffect(() => {
    try {
      const guardado =
        window.localStorage.getItem("verso-techno-v3") ??
        window.localStorage.getItem("verso-techno-v2");

      if (!guardado) return;

      const estado = JSON.parse(guardado) as {
        titulo?: string;
        texto?: string;
        modo?: ModoTransmutacion;
      };

      if (estado.titulo) setTitulo(estado.titulo);
      if (estado.texto) setTexto(estado.texto);
      if (estado.modo) setModo(estado.modo);
    } catch {
      // La consola permanece operativa sin persistencia.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "verso-techno-v3",
        JSON.stringify({ titulo, texto, modo }),
      );
    } catch {
      // No interrumpimos el proceso creativo.
    }
  }, [titulo, texto, modo]);

  const analisis = useMemo(
    () => analizarLiteratura(texto, modo),
    [texto, modo],
  );

  useEffect(() => {
    setEscenaSeleccionada((actual) =>
      Math.min(actual, Math.max(0, analisis.escenas.length - 1)),
    );
  }, [analisis.escenas.length]);

  const codigo = useMemo(
    () =>
      generarCodigoStrudel(
        titulo,
        texto,
        modo,
        analisis,
        revision,
        mutaciones,
      ),
    [titulo, texto, modo, analisis, revision, mutaciones],
  );

  const urlStrudel = useMemo(() => crearUrlStrudel(codigo), [codigo]);

  const palabrasActivas = analisis.eventos.slice(0, 10);
  const modoActual = MODOS.find((item) => item.id === modo) ?? MODOS[1];
  const escenaActiva =
    analisis.escenas[escenaSeleccionada] ?? analisis.escenas[0];

  function notificar(textoMensaje: string) {
    setMensaje(textoMensaje);
    window.setTimeout(() => setMensaje(""), 2300);
  }

  async function copiarCodigo() {
    try {
      await navigator.clipboard.writeText(codigo);
      notificar("Partitura dramatúrgica copiada.");
    } catch {
      notificar("No se pudo copiar automáticamente.");
    }
  }

  function transmutar() {
    setRevision((valor) => valor + 1);
    setMotorVisible(true);
    notificar("La obra completa ha sido transmutada de nuevo.");
  }

  function mutarEscena() {
    if (!escenaActiva) return;

    setMutaciones((actual) => ({
      ...actual,
      [escenaActiva.id]: (actual[escenaActiva.id] ?? 0) + 1,
    }));
    setMotorVisible(true);
    notificar(
      `${NOMBRE_ESCENA[escenaActiva.funcion]} ha mutado sin alterar las demás escenas.`,
    );
  }

  function limpiar() {
    setTitulo("");
    setTexto("");
    setMutaciones({});
    setRevision(0);
    notificar("La cámara de escritura ha quedado vacía.");
  }

  return (
    <main className={`${styles.page} ${styles[`mode_${modo}`]}`}>
      <div className={styles.noise} aria-hidden="true" />
      <div className={styles.scanline} aria-hidden="true" />

      <header className={styles.topbar}>
        <div className={styles.identity}>
          <span className={styles.mark}>V/T</span>
          <div>
            <p>POEMA UNIVERSAL · DRAMATURGIA SONORA V3</p>
            <h1>VERSO → TECHNO</h1>
          </div>
        </div>

        <div className={styles.status}>
          <span className={styles.statusDot} />
          <div>
            <small>MOTOR VERSO A VERSO</small>
            <strong>
              ACTIVO · {analisis.escenas.length} ESCENAS · {modoActual.codigo}
            </strong>
          </div>
        </div>
      </header>

      <section className={styles.console}>
        <aside className={`${styles.module} ${styles.writer}`}>
          <ModuleHeader index="01" title="Cámara de escritura" tag="ORIGEN" />

          <label className={styles.titleField}>
            <span>Nombre de la transmutación</span>
            <input
              value={titulo}
              onChange={(event) => setTitulo(event.target.value)}
              placeholder="Obra sin título"
              maxLength={90}
            />
          </label>

          <label className={styles.textField}>
            <div>
              <span>Un salto de línea = una escena potencial</span>
              <b>{texto.length}/5000</b>
            </div>
            <textarea
              value={texto}
              onChange={(event) => {
                setTexto(event.target.value.slice(0, 5000));
                setMutaciones({});
              }}
              placeholder="Escribe cada verso o unidad dramática en una línea…"
            />
          </label>

          <div className={styles.modeSelector}>
            <p>Régimen de transmutación</p>
            {MODOS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={modo === item.id ? styles.modeActive : styles.mode}
                onClick={() => setModo(item.id)}
              >
                <span>{item.codigo}</span>
                <div>
                  <strong>{item.nombre}</strong>
                  <small>{item.descripcion}</small>
                </div>
              </button>
            ))}
          </div>

          <div className={styles.writerActions}>
            <button type="button" onClick={limpiar}>
              Vaciar
            </button>
            <button
              type="button"
              className={styles.primaryAction}
              onClick={transmutar}
              disabled={!texto.trim()}
            >
              TRANSMUTAR OBRA
              <span>↗</span>
            </button>
          </div>
        </aside>

        <section className={`${styles.module} ${styles.reactor}`}>
          <ModuleHeader index="02" title="Núcleo dramatúrgico" tag="VIVO" />

          <div className={styles.reactorStage}>
            <div className={styles.coordinate}>
              X {analisis.palabras}.04
            </div>
            <div className={styles.coordinateRight}>
              Y {analisis.ciclosTotales}.V3
            </div>

            <div
              className={styles.orbitOuter}
              style={{
                animationDuration: `${Math.max(
                  8,
                  19 - analisis.tension / 8,
                )}s`,
              }}
            >
              {palabrasActivas.slice(0, 6).map((evento, indice) => (
                <span
                  key={`${evento.palabra}-${indice}`}
                  style={
                    {
                      "--i": indice,
                      "--total": Math.max(
                        1,
                        Math.min(6, palabrasActivas.length),
                      ),
                    } as CSSProperties
                  }
                >
                  {evento.palabra}
                </span>
              ))}
            </div>

            <div
              className={styles.orbitInner}
              style={{
                transform: `rotate(${revision * 17 + analisis.oscuridad}deg)`,
              }}
            />

            <div className={styles.core}>
              <small>TEMPO</small>
              <strong>{analisis.bpm}</strong>
              <span>BPM</span>
            </div>

            <div className={styles.pulseRing} />
            <div className={styles.axisHorizontal} />
            <div className={styles.axisVertical} />
          </div>

          <div className={styles.reactorReadout}>
            <div>
              <span>Tonalidad</span>
              <strong>{analisis.tonalidad}</strong>
            </div>
            <div>
              <span>Escenas</span>
              <strong>
                {analisis.escenas.length.toString().padStart(2, "0")}
              </strong>
            </div>
            <div>
              <span>Ciclos</span>
              <strong>{analisis.ciclosTotales}</strong>
            </div>
            <div>
              <span>Modo</span>
              <strong>{modoActual.nombre}</strong>
            </div>
          </div>

          <div className={styles.relicCard}>
            <span>PALABRA RELIQUIA</span>
            <strong>{analisis.palabraReliquia}</strong>
            <p>
              Reaparece transformada a lo largo de la composición y conserva
              la memoria sonora de la obra.
            </p>
          </div>
        </section>

        <aside className={`${styles.module} ${styles.decoder}`}>
          <ModuleHeader index="03" title="Decodificador simbólico" tag="MAPA" />

          <div className={styles.pressure}>
            <Pressure label="Oscuridad" value={analisis.oscuridad} />
            <Pressure label="Tensión" value={analisis.tension} />
            <Pressure label="Luminosidad" value={analisis.luminosidad} />
          </div>

          <div className={styles.families}>
            <p>Campos detectados</p>
            <div>
              {analisis.familias.length ? (
                analisis.familias.map(({ familia, cantidad }) => (
                  <span key={familia}>
                    {NOMBRE_FAMILIA[familia]}
                    <b>{cantidad.toString().padStart(2, "0")}</b>
                  </span>
                ))
              ) : (
                <span>
                  Materia indeterminada <b>00</b>
                </span>
              )}
            </div>
          </div>

          <div className={styles.translation}>
            <div className={styles.translationHead}>
              <p>Genealogía de señal</p>
              <span>PALABRA / CAMPO / NOTA</span>
            </div>
            <div className={styles.translationRows}>
              {palabrasActivas.map((evento, indice) => (
                <div key={`${evento.palabra}-${indice}`}>
                  <i>{String(indice + 1).padStart(2, "0")}</i>
                  <strong>{evento.palabra}</strong>
                  <span>{NOMBRE_FAMILIA[evento.familia]}</span>
                  <b>{evento.nota}</b>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className={`${styles.module} ${styles.sequence}`}>
        <div className={styles.sequenceHeading}>
          <ModuleHeader
            index="04"
            title="Arquitectura temporal real"
            tag={`${analisis.ciclosTotales} CICLOS`}
          />
          <p>
            Cada bloque procede de un verso. Pulsa una escena para leer sus
            decisiones sonoras.
          </p>
        </div>

        <div className={styles.timeline}>
          {analisis.escenas.map((escena) => (
            <button
              key={escena.id}
              type="button"
              className={
                escenaSeleccionada === escena.id
                  ? styles.sceneSelected
                  : undefined
              }
              style={{ flexGrow: escena.ciclos }}
              onClick={() => setEscenaSeleccionada(escena.id)}
            >
              <span>{CODIGO_ESCENA[escena.funcion]}</span>
              <strong>{NOMBRE_ESCENA[escena.funcion]}</strong>
              <small>{escena.ciclos} C</small>
              <i style={{ height: `${Math.max(8, escena.tension)}%` }} />
            </button>
          ))}
        </div>

        {escenaActiva ? (
          <SceneInspector
            escena={escenaActiva}
            mutationCount={mutaciones[escenaActiva.id] ?? 0}
            onMutate={mutarEscena}
          />
        ) : null}
      </section>

      <section className={`${styles.module} ${styles.soundEngine}`}>
        <div className={styles.engineHead}>
          <ModuleHeader
            index="05"
            title={titulo || "Transmutación sin título"}
            tag="OBRA SECUENCIADA"
          />
          <div className={styles.engineActions}>
            <button type="button" onClick={copiarCodigo}>
              Copiar código
            </button>
            <button
              type="button"
              onClick={() => setMotorVisible((visible) => !visible)}
            >
              {motorVisible ? "Cerrar motor" : "Abrir motor"}
            </button>
            <a href={urlStrudel} target="_blank" rel="noreferrer">
              Strudel ↗
            </a>
          </div>
        </div>

        {motorVisible ? (
          <div className={styles.player}>
            <div className={styles.playerGuide}>
              <span>01</span>
              <p>
                Pulsa reproducción dentro del motor. Ahora cada escena ocupa
                sus propios ciclos y la pieza evoluciona con el poema.
              </p>
            </div>
            <iframe
              key={urlStrudel}
              src={urlStrudel}
              title={`Instrumento Strudel: ${titulo}`}
              allow="autoplay; microphone; midi"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        ) : null}
      </section>

      <details className={`${styles.module} ${styles.source}`}>
        <summary>
          <span>06</span>
          Ver la partitura dramatúrgica generada
          <b>ARRANGE / ESCENAS / LIVE CODE</b>
        </summary>
        <pre>{codigo}</pre>
      </details>

      <footer className={styles.footer}>
        <p>VERSO → TECHNO · MOTOR DE DRAMATURGIA SONORA · V3</p>
        <p>El poema decide cuándo nace, se rompe, retorna y desaparece.</p>
      </footer>

      {mensaje ? <div className={styles.toast}>{mensaje}</div> : null}
    </main>
  );
}

function ModuleHeader({
  index,
  title,
  tag,
}: {
  index: string;
  title: string;
  tag: string;
}) {
  return (
    <div className={styles.moduleHead}>
      <div>
        <span>{index}</span>
        <h2>{title}</h2>
      </div>
      <small>{tag}</small>
    </div>
  );
}

function Pressure({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.pressureItem}>
      <div>
        <span>{label}</span>
        <b>{value}%</b>
      </div>
      <i>
        <span style={{ width: `${value}%` }} />
      </i>
    </div>
  );
}

function SceneInspector({
  escena,
  mutationCount,
  onMutate,
}: {
  escena: EscenaLiteraria;
  mutationCount: number;
  onMutate: () => void;
}) {
  return (
    <article className={styles.sceneInspector}>
      <div className={styles.sceneIdentity}>
        <span>
          ESCENA {String(escena.id + 1).padStart(2, "0")}
        </span>
        <strong>{NOMBRE_ESCENA[escena.funcion]}</strong>
        <p>“{escena.verso}”</p>
      </div>

      <div className={styles.sceneMetrics}>
        <div>
          <span>Reliquia</span>
          <strong>{escena.palabraReliquia}</strong>
        </div>
        <div>
          <span>Campo</span>
          <strong>{NOMBRE_FAMILIA[escena.familiaDominante]}</strong>
        </div>
        <div>
          <span>Tensión</span>
          <strong>{escena.tension}%</strong>
        </div>
        <div>
          <span>Duración</span>
          <strong>{escena.ciclos} ciclos</strong>
        </div>
      </div>

      <div className={styles.sceneDecisions}>
        {escena.acciones.map((accion) => (
          <span key={accion}>{accion}</span>
        ))}
      </div>

      <button
        type="button"
        className={styles.mutateScene}
        onClick={onMutate}
      >
        MUTAR SOLO ESTA ESCENA
        <span>VARIACIÓN {String(mutationCount).padStart(2, "0")}</span>
      </button>
    </article>
  );
}
EOF

python3 - "${TARGET}/verso-tecno.module.css" <<'PY'
from pathlib import Path
import sys

path = Path(sys.argv[1])
if not path.exists():
    raise SystemExit(f"❌ No encuentro {path}")

text = path.read_text(encoding="utf-8")
marker = "/* ===== V3 · DRAMATURGIA SONORA ===== */"

if marker in text:
    text = text.split(marker, 1)[0].rstrip() + "\n\n"

addition = r'''
*(=====, V3, ·, DRAMATURGIA, SONORA, =====, */)

.relicCard {
  margin-top: 16px;
  padding: 18px;
  border: 1px solid var(--line);
  background:
    radial-gradient(circle at 100% 0%, var(--acid-soft), transparent 48%),
    #080a0b;
}

.relicCard > span {
  display: block;
  color: var(--acid);
  font-size: 7px;
  font-weight: 800;
  letter-spacing: 0.2em;
}

.relicCard > strong {
  display: block;
  overflow: hidden;
  margin-top: 9px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(25px, 3vw, 43px);
  font-weight: 400;
  font-style: italic;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.relicCard > p {
  max-width: 520px;
  margin: 11px 0 0;
  color: var(--muted);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 11px;
  line-height: 1.55;
}

.sequenceHeading > p {
  margin: 12px 0 0;
  color: var(--muted);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 11px;
  font-style: italic;
}

.timeline > button {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-width: 88px;
  min-height: 104px;
  overflow: hidden;
  padding: 12px;
  border: 0;
  border-right: 1px solid var(--line);
  border-radius: 0;
  outline: 0;
  background:
    linear-gradient(to top, var(--acid-soft), transparent 72%);
  color: var(--ink);
  text-align: left;
  cursor: pointer;
  transition:
    background 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}

.timeline > button:last-child {
  border-right: 0;
}

.timeline > button::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 24px;
  height: 1px;
  background: var(--line);
}

.timeline > button:hover {
  background:
    linear-gradient(to top, var(--signal-soft), transparent 82%);
}

.timeline > button > span {
  position: absolute;
  top: 9px;
  left: 10px;
  z-index: 2;
  color: var(--muted);
  font-size: 7px;
  font-style: normal;
}

.timeline > button > strong {
  position: relative;
  z-index: 2;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 11px;
  font-weight: 400;
}

.timeline > button > small {
  position: relative;
  z-index: 2;
  margin-top: 4px;
  color: var(--muted);
  font-size: 7px;
  letter-spacing: 0.1em;
}

.timeline > button > i {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 3px;
  max-height: 100%;
  background: linear-gradient(to top, var(--signal), var(--acid));
  opacity: 0.74;
}

.timeline > button.sceneSelected {
  background:
    linear-gradient(to top, var(--signal-soft), var(--acid-soft) 68%, transparent);
  box-shadow:
    inset 0 0 0 1px var(--acid),
    inset 0 -32px 65px var(--acid-soft);
}

.timeline > button.sceneSelected > span,
.timeline > button.sceneSelected > strong {
  color: var(--acid);
}

.sceneInspector {
  display: grid;
  grid-template-columns: minmax(240px, 1.25fr) minmax(280px, 1fr);
  gap: 18px 24px;
  margin-top: 12px;
  padding: 19px;
  border: 1px solid var(--line);
  background:
    linear-gradient(135deg, var(--signal-soft), transparent 36%),
    #080a0b;
}

.sceneIdentity > span {
  color: var(--acid);
  font-size: 7px;
  font-weight: 800;
  letter-spacing: 0.19em;
}

.sceneIdentity > strong {
  display: block;
  margin-top: 7px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 25px;
  font-weight: 400;
}

.sceneIdentity > p {
  max-width: 680px;
  margin: 10px 0 0;
  color: #d4d2ca;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 14px;
  font-style: italic;
  line-height: 1.55;
}

.sceneMetrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 1px solid var(--line);
}

.sceneMetrics > div {
  min-width: 0;
  padding: 11px;
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.sceneMetrics > div:nth-child(2n) {
  border-right: 0;
}

.sceneMetrics > div:nth-last-child(-n + 2) {
  border-bottom: 0;
}

.sceneMetrics span,
.sceneMetrics strong {
  display: block;
}

.sceneMetrics span {
  color: var(--muted);
  font-size: 7px;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.sceneMetrics strong {
  overflow: hidden;
  margin-top: 5px;
  font-size: 9px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sceneDecisions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px;
}

.sceneDecisions > span {
  padding: 8px 10px;
  border: 1px solid var(--line);
  color: #c9cdc7;
  font-size: 8px;
  line-height: 1.35;
}

.mutateScene {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 42px;
  padding: 0 14px;
  border: 1px solid var(--acid);
  border-radius: 0;
  background: transparent;
  color: var(--ink);
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.12em;
  cursor: pointer;
}

.mutateScene:hover {
  background: var(--acid);
  color: #080a0b;
}

.mutateScene > span {
  color: var(--muted);
  font-size: 7px;
}

.mutateScene:hover > span {
  color: inherit;
}

@media (max-width: 900px) {
  .sceneInspector {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .timeline > button {
    flex: 0 0 110px;
  }

  .sceneMetrics {
    grid-template-columns: 1fr;
  }

  .sceneMetrics > div,
  .sceneMetrics > div:nth-child(2n),
  .sceneMetrics > div:nth-last-child(-n + 2) {
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }

  .sceneMetrics > div:last-child {
    border-bottom: 0;
  }

  .mutateScene {
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    padding: 10px 12px;
  }
}
'''

path.write_text(text + marker + "\n" + addition, encoding="utf-8")
print("✅ Estilos V3 integrados.")
PY

cat > "${TARGET}/README-VERSO-TECHNO-V3.md" <<'EOF'
# Verso → Techno V3

## Motor de Dramaturgia Sonora

Cada salto de línea se analiza como una unidad dramática. El sistema asigna:

- función narrativa;
- duración en ciclos;
- tensión;
- oscuridad;
- luminosidad;
- palabra reliquia;
- familia simbólica dominante;
- notas;
- decisiones musicales.

## Funciones de escena

- Aparición
- Invocación
- Cuerpo
- Ruptura
- Retorno
- Clímax
- Desaparición

## Cambios principales

1. La línea temporal ya procede del texto real.
2. Cada verso genera un patrón independiente.
3. Strudel organiza la pieza mediante `arrange`.
4. La palabra reliquia reaparece como motivo.
5. Es posible mutar una escena sin regenerar las demás.
6. Se conserva la copia de seguridad de V2.

## Próximo desarrollo

- Cámara de voces poéticas.
- Grabación y carga de voz.
- Distribución vocal por escenas.
- Exportación WAV.
- Guardado de proyectos.
EOF

rm -rf .next

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ VERSO → TECHNO V3 INSTALADO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Motor verso a verso"
echo "✅ Línea temporal real"
echo "✅ Palabra reliquia"
echo "✅ Clímax y ruptura calculados"
echo "✅ Mutación independiente de escenas"
echo "✅ Partitura Strudel organizada con arrange"
echo ""
echo "Arranca la web:"
echo "  npm run dev -- --webpack"
echo ""
echo "Abre:"
echo "  http://localhost:3000/laboratorio/verso-tecno"
echo ""
