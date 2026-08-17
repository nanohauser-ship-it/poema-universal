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
