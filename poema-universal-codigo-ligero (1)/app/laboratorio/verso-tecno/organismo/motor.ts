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

export const CICLOS_COMPOSICION = 56;

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

// === EMBRION V5 · PERFIL COMPOSITIVO ===
type PerfilCompositivoV5 = {
  repeticion: number;
  fragmentacion: number;
  suspension: number;
  cuerpo: number;
  densidad: number;
  vacio: number;
  pulso: "suspendido" | "intermitente" | "roto" | "estable";
};

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function perfilCompositivoV5(texto: string): PerfilCompositivoV5 {
  const lista = relevantes(texto).map(normalizar);
  const todas = palabras(texto);
  const lineas = texto.split(/\n+/).map(x => x.trim()).filter(Boolean);
  const freq = new Map<string, number>();
  lista.forEach(p => freq.set(p, (freq.get(p) ?? 0) + 1));
  const extras = [...freq.values()].reduce((n, v) => n + Math.max(0, v - 1), 0);
  const repeticion = clamp01(lista.length ? extras / lista.length : 0);
  const breves = lineas.filter(l => palabras(l).length <= 3).length;
  const signos = (texto.match(/[,.…;:!?—-]/g) ?? []).length;
  const fragmentacion = clamp01(
    (lineas.length ? breves / lineas.length : 0) * 0.55 +
    (todas.length ? signos / todas.length : 0) * 1.45
  );
  const a = analizarPoema(texto);
  const cuerpo = clamp01((a.habitats.pulso * 0.52 + a.habitats.maquina * 0.30) / 100 + repeticion * 0.30);
  const suspension = clamp01((a.habitats.deriva * 0.48 + a.habitats.espectral * 0.28) / 100 + fragmentacion * 0.20 - cuerpo * 0.18);
  const densidad = clamp01(0.14 + Math.min(0.42, todas.length / 90) + cuerpo * 0.25 + repeticion * 0.35 - suspension * 0.10);
  const vacio = clamp01(0.82 - densidad * 0.72 + suspension * 0.28 - repeticion * 0.20);

  let pulso: PerfilCompositivoV5['pulso'];
  if (repeticion >= 0.15) pulso = 'estable';
  else if (suspension >= 0.56) pulso = 'suspendido';
  else if (fragmentacion >= 0.58) pulso = 'roto';
  else pulso = 'intermitente';

  return { repeticion, fragmentacion, suspension, cuerpo, densidad, vacio, pulso };
}
// === FIN EMBRION V5 · PERFIL COMPOSITIVO ===

export function bpmActual(organismo: Organismo): number {
  const texto = [organismo.poema, ...organismo.injertos].filter(Boolean).join("\n");
  const p = perfilCompositivoV5(texto);
  return limitar(
    organismo.bpmBase +
      p.repeticion * 34 +
      p.cuerpo * 10 +
      p.fragmentacion * 5 -
      p.suspension * 24 -
      p.vacio * 8,
    48,
    150,
  );
}

export function duracionComposicionMinutos(
  organismo: Organismo,
): number {
  return Math.round(
    (CICLOS_COMPOSICION * 4 * 10) / bpmActual(organismo),
  ) / 10;
}


// === EMBRION V6 · GRAMATICA DE OPERADORES ===

type OperadorV6 =
  | "RESPIRAR"
  | "PERMANECER"
  | "RETORNAR"
  | "VACIAR"
  | "CONTRAER"
  | "DESPOJAR"
  | "RECORDAR"
  | "EROSIONAR"
  | "EXPANDIR"
  | "NO_RESOLVER"
  | "HERIR";

type LecturaOperadoresV6 = {
  operadores: OperadorV6[];
  repeticion: number;
  fragmentacion: number;
  suspension: number;
  vacio: number;
  cuerpo: number;
  memoria: number;
  pulso: "suspendido" | "intermitente" | "roto" | "estable";
  noResuelto: boolean;
};

function clamp01V6(valor: number): number {
  return Math.max(0, Math.min(1, valor));
}

function rotarSeguroV6<T>(items: T[], desplazamiento: number): T[] {
  if (!items.length) return [];
  const n = ((desplazamiento % items.length) + items.length) % items.length;
  return [...items.slice(n), ...items.slice(0, n)];
}

function lecturaOperadoresV6(texto: string): LecturaOperadoresV6 {
  const analisis = analizarPoema(texto);
  const h = analisis.habitats;
  const lista = relevantes(texto).map(normalizar);
  const todas = palabras(texto);
  const normal = normalizar(texto);

  const lineas = texto
    .split(/\n+/)
    .map((linea) => linea.trim())
    .filter(Boolean);

  const frecuencia = new Map<string, number>();
  lista.forEach((palabra) => {
    frecuencia.set(palabra, (frecuencia.get(palabra) ?? 0) + 1);
  });

  const repetidas = [...frecuencia.values()].reduce(
    (total, cantidad) => total + Math.max(0, cantidad - 1),
    0,
  );

  const repeticion = clamp01V6(
    lista.length ? repetidas / lista.length : 0,
  );

  const signos = (texto.match(/[,.…;:!?—-]/g) ?? []).length;
  const breves = lineas.filter((linea) => palabras(linea).length <= 3).length;
  const proporcionBreves = lineas.length ? breves / lineas.length : 0;
  const densidadSignos = todas.length ? signos / todas.length : 0;
  const blancos = (texto.match(/\n\s*\n/g) ?? []).length;

  const fragmentacion = clamp01V6(
    proporcionBreves * 0.58 + densidadSignos * 2.7,
  );

  const cuerpo = clamp01V6(
    (h.pulso * 0.5 + h.maquina * 0.28) / 100 + repeticion * 0.26,
  );

  const memoria = clamp01V6(
    (h.memoria * 0.52 + h.espectral * 0.28) / 100 +
      repeticion * 0.24 +
      (/memoria|recuerda|recordar|olvido|vuelve|regresa|retorna/.test(normal) ? 0.18 : 0),
  );

  const suspension = clamp01V6(
    (h.deriva * 0.38 + h.espectral * 0.28) / 100 +
      proporcionBreves * 0.24 +
      (/espera|silencio|nadie|nunca|quiet|permanece|queda/.test(normal) ? 0.20 : 0) -
      cuerpo * 0.16,
  );

  const vacio = clamp01V6(
    0.30 +
      blancos * 0.055 +
      suspension * 0.38 +
      proporcionBreves * 0.20 -
      cuerpo * 0.20,
  );

  const ultimaLinea = normalizar(lineas[lineas.length - 1] ?? "");
  const noResuelto =
    /nadie|nunca|espera|queda|permanece|sin|pero|no |no$|olvido|ausencia/.test(ultimaLinea) ||
    /\?$/.test(texto.trim());

  let pulso: LecturaOperadoresV6["pulso"];
  if (suspension >= 0.58 && cuerpo < 0.58) pulso = "suspendido";
  else if (fragmentacion >= 0.58) pulso = "roto";
  else if (repeticion >= 0.16 || cuerpo >= 0.58) pulso = "estable";
  else pulso = "intermitente";

  const operadores: OperadorV6[] = [];
  const add = (operador: OperadorV6) => {
    if (operadores[operadores.length - 1] !== operador) operadores.push(operador);
  };

  if (vacio >= 0.60) add("VACIAR");
  else if (suspension >= 0.42) add("RESPIRAR");
  else add("PERMANECER");

  const vistas = new Map<string, number>();

  lineas.forEach((linea) => {
    const limpia = normalizar(linea);
    const nPalabras = palabras(linea).length;
    const veces = (vistas.get(limpia) ?? 0) + 1;
    vistas.set(limpia, veces);

    if (/respira|respirar|aire|aliento/.test(limpia)) add("RESPIRAR");
    if (/permanece|queda|espera|todavia|sigue|quiet/.test(limpia)) add("PERMANECER");
    if (/vuelve|regresa|retorna|otra vez/.test(limpia) || veces > 1) add("RETORNAR");
    if (/apaga|desaparece|silencio|ausencia|nadie|vacio|borra/.test(limpia)) add("VACIAR");
    if (/recuerda|memoria|recordar|olvido|eco/.test(limpia)) add("RECORDAR");
    if (/herida|roto|rompe|corte|marca|cicatriz|fractura/.test(limpia)) add("HERIR");

    if (nPalabras <= 2) add("CONTRAER");
    if (nPalabras >= 10 && suspension < 0.68) add("EXPANDIR");
  });

  if (fragmentacion >= 0.55) add("EROSIONAR");
  if (repeticion >= 0.16) add("RETORNAR");
  if (vacio >= 0.58) add("DESPOJAR");
  if (cuerpo >= 0.62 && vacio < 0.58) add("EXPANDIR");
  if (memoria >= 0.55) add("RECORDAR");
  if (noResuelto) add("NO_RESOLVER");

  const compactos = operadores.filter((operador, index) =>
    index === 0 || operador !== operadores[index - 1],
  );

  const final = compactos.slice(0, 9);
  if (!final.length) final.push("RESPIRAR", "PERMANECER", "RECORDAR");

  return {
    operadores: final,
    repeticion,
    fragmentacion,
    suspension,
    vacio,
    cuerpo,
    memoria,
    pulso,
    noResuelto,
  };
}

// === FIN EMBRION V6 · GRAMATICA DE OPERADORES ===





// === EMBRION V7 · NUCLEO NUMERICO ===

type ADNNumericoV7 = {
  firma: string;
  tempo: number;
  vacio: number;
  pulso: number;
  densidad: number;
  ruptura: number;
  retorno: number;
  memoria: number;
  tension: number;
  simetria: number;
  persistencia: number;
  centroMidi: number;
  duraciones: number[];
  ataques: number[];
  intervalos: number[];
  presion: number[];
  erosion: number[];
  registros: number[];
  retornos: Array<[number, number]>;
  noResuelto: boolean;
};

type EscenaNumericaV7 = {
  duracion: number;
  patronMidi: number[];
  ataques: number[];
  presion: number;
  vacio: number;
  erosion: number;
  registro: number;
  retornoDe: number | null;
};

type PartituraNumericaV7 = {
  escenas: EscenaNumericaV7[];
  osciladorPrimario: "sine" | "triangle" | "sawtooth" | "square";
  osciladorSombra: "sine" | "triangle" | "sawtooth" | "square";
  usaPercusion: boolean;
  usaSubgrave: boolean;
  usaSombra: boolean;
};

function clamp01V7(valor: number): number {
  return Math.max(0, Math.min(1, valor));
}

function clampV7(valor: number, minimo: number, maximo: number): number {
  return Math.max(minimo, Math.min(maximo, valor));
}

function mediaV7(valores: number[]): number {
  if (!valores.length) return 0;
  return valores.reduce((a, b) => a + b, 0) / valores.length;
}

function desviacionV7(valores: number[]): number {
  if (valores.length < 2) return 0;
  const m = mediaV7(valores);
  return Math.sqrt(mediaV7(valores.map((v) => (v - m) ** 2)));
}

function porcentajeV7(valor: number): number {
  return Math.round(clamp01V7(valor) * 100);
}

function midiANotaV7(midi: number): string {
  const nombres = ["c", "cs", "d", "ds", "e", "f", "fs", "g", "gs", "a", "as", "b"];
  const m = Math.round(clampV7(midi, 24, 96));
  const nombre = nombres[((m % 12) + 12) % 12];
  const octava = Math.floor(m / 12) - 1;
  return `${nombre}${octava}`;
}

function numeroDesdeLineaV7(linea: string, modulo: number, minimo = 0): number {
  const base = Math.abs(hashTexto(normalizar(linea) || "silencio"));
  return minimo + (base % Math.max(1, modulo));
}

function extraerADNNumericoV7(texto: string): ADNNumericoV7 {
  const limpio = texto.trim() || "silencio";
  const analisis = analizarPoema(limpio);
  const lineas = limpio
    .split(/\n+/)
    .map((linea) => linea.trim())
    .filter(Boolean);

  const lineasSeguras = lineas.length ? lineas : ["silencio"];
  const longitudes = lineasSeguras.map((linea) => Math.max(1, palabras(linea).length));
  const totalPalabras = Math.max(1, palabras(limpio).length);
  const tokens = relevantes(limpio).map(normalizar).filter(Boolean);
  const frecuencia = new Map<string, number>();

  tokens.forEach((token) => {
    frecuencia.set(token, (frecuencia.get(token) ?? 0) + 1);
  });

  const repetidas = [...frecuencia.values()].reduce(
    (total, cantidad) => total + Math.max(0, cantidad - 1),
    0,
  );

  const repeticion = clamp01V7(tokens.length ? repetidas / tokens.length : 0);
  const signosFuertes = (limpio.match(/[.!?…—]/g) ?? []).length;
  const signosTodos = (limpio.match(/[,.!?;:…—-]/g) ?? []).length;
  const blancos = (limpio.match(/\n\s*\n/g) ?? []).length;
  const breves = longitudes.filter((n) => n <= 3).length / lineasSeguras.length;
  const variacion = clamp01V7(desviacionV7(longitudes) / Math.max(2, mediaV7(longitudes)));
  const normal = normalizar(limpio);

  const memoriaSemantica = /memoria|recuerda|recordar|olvido|eco|antes|ayer|huella|resto/.test(normal) ? 1 : 0;
  const retornoSemantico = /vuelve|volver|regresa|regresar|retorna|retornar|otra vez|de nuevo/.test(normal) ? 1 : 0;
  const rupturaSemantica = /rompe|roto|fractura|herida|corte|marca|cicatriz|cae|apaga|desaparece/.test(normal) ? 1 : 0;
  const negacion = (normal.match(/\bno\b|\bnadie\b|\bnunca\b|\bsin\b/g) ?? []).length;

  const densidad = clamp01V7(
    0.18 +
      Math.min(1, totalPalabras / 110) * 0.38 +
      (1 - breves) * 0.20 +
      repeticion * 0.16 +
      analisis.habitats.pulso / 100 * 0.08,
  );

  const vacio = clamp01V7(
    0.18 +
      blancos * 0.055 +
      breves * 0.34 +
      negacion / totalPalabras * 2.2 +
      analisis.habitats.espectral / 100 * 0.18 -
      densidad * 0.20,
  );

  const ruptura = clamp01V7(
    signosFuertes / totalPalabras * 2.5 +
      breves * 0.26 +
      variacion * 0.28 +
      rupturaSemantica * 0.22,
  );

  const retorno = clamp01V7(
    repeticion * 0.58 + retornoSemantico * 0.30 + memoriaSemantica * 0.12,
  );

  const memoria = clamp01V7(
    analisis.habitats.memoria / 100 * 0.34 +
      analisis.habitats.espectral / 100 * 0.16 +
      repeticion * 0.26 +
      memoriaSemantica * 0.24,
  );

  const pulso = clamp01V7(
    analisis.habitats.pulso / 100 * 0.40 +
      analisis.habitats.maquina / 100 * 0.18 +
      repeticion * 0.25 +
      (1 - vacio) * 0.17,
  );

  const tension = clamp01V7(
    ruptura * 0.34 +
      negacion / totalPalabras * 2.0 +
      variacion * 0.22 +
      retorno * 0.18 +
      analisis.habitats.fractura / 100 * 0.18,
  );

  const simetria = clamp01V7(1 - variacion * 0.72 - ruptura * 0.24 + repeticion * 0.20);
  const persistencia = clamp01V7(0.22 + repeticion * 0.38 + memoria * 0.24 + retorno * 0.16);

  const tempo = Math.round(clampV7(
    50 + pulso * 58 + densidad * 18 + tension * 12 - vacio * 24,
    44,
    138,
  ));

  const semilla = Math.abs(hashTexto(limpio));
  const centroMidi = 43 + (semilla % 13); // G2..G#3, sin escalas predefinidas.

  const maxEscenas = Math.min(9, Math.max(4, Math.round(lineasSeguras.length / 2)));
  const paso = Math.max(1, Math.ceil(lineasSeguras.length / maxEscenas));
  const grupos: string[][] = [];

  for (let i = 0; i < lineasSeguras.length; i += paso) {
    grupos.push(lineasSeguras.slice(i, i + paso));
  }

  const duraciones = grupos.map((grupo) => {
    const palabrasGrupo = grupo.reduce((n, linea) => n + palabras(linea).length, 0);
    return Math.round(clampV7(3 + palabrasGrupo * 0.72 + grupo.length * 0.6, 3, 13));
  });

  const ataquesBase = Math.max(8, Math.min(24, lineasSeguras.length + 6));
  const ataques = Array.from({ length: ataquesBase }, (_, i) => {
    const linea = lineasSeguras[i % lineasSeguras.length];
    const fuerte = /[.!?…—]$/.test(linea) ? 1 : 0;
    const repetida = (frecuencia.get(normalizar(palabras(linea)[0] ?? "")) ?? 0) > 1 ? 1 : 0;
    const numero = numeroDesdeLineaV7(`${linea}|${i}`, 100);
    const umbral = 22 + densidad * 38 + pulso * 20 + fuerte * 12 + repetida * 10 - vacio * 28;
    return numero < umbral ? 1 : 0;
  });

  if (!ataques.some(Boolean)) ataques[0] = 1;

  const intervalos: number[] = [];
  for (let i = 0; i < lineasSeguras.length; i++) {
    const actual = longitudes[i];
    const anterior = i === 0 ? longitudes[0] : longitudes[i - 1];
    const diferencia = actual - anterior;
    const linea = normalizar(lineasSeguras[i]);

    let intervalo = clampV7(Math.round(diferencia / 2), -5, 5);
    if (/no |nadie|nunca|sin /.test(linea)) intervalo -= 2;
    if (/vuelve|regresa|retorna|recuerda/.test(linea)) intervalo = i > 1 ? -intervalos[Math.max(0, i - 2)] : 0;
    if (/\?$/.test(lineasSeguras[i])) intervalo += 2;
    if (/!$/.test(lineasSeguras[i])) intervalo += intervalo >= 0 ? 2 : -2;

    intervalo = Math.round(clampV7(intervalo, -7, 7));

    // Ley estética: un salto grande obliga a compensación posterior.
    if (intervalos.length && Math.abs(intervalos[intervalos.length - 1]) >= 6 && Math.sign(intervalo) === Math.sign(intervalos[intervalos.length - 1])) {
      intervalo = -Math.sign(intervalo || 1) * Math.min(3, Math.abs(intervalo));
    }

    intervalos.push(intervalo);
  }

  if (intervalos.every((n) => Math.abs(n) < 0.001)) {
    intervalos[Math.min(1, intervalos.length - 1)] = 2;
    intervalos[Math.min(2, intervalos.length - 1)] = -3;
  }

  const presion = grupos.map((grupo, i) => {
    const longitud = grupo.reduce((n, linea) => n + palabras(linea).length, 0);
    const signos = grupo.join(" ").match(/[.!?…—]/g)?.length ?? 0;
    const repet = grupo.reduce((n, linea) => {
      const primera = normalizar(palabras(linea)[0] ?? "");
      return n + ((frecuencia.get(primera) ?? 0) > 1 ? 1 : 0);
    }, 0);
    const curva = grupos.length <= 1 ? 0.5 : i / (grupos.length - 1);
    return Math.round(clampV7(
      12 + longitud * 2.0 + signos * 6 + repet * 8 + tension * 24 + curva * persistencia * 22 - vacio * 16,
      4,
      96,
    ));
  });

  // Suaviza saltos para evitar crescendos arbitrarios y conserva respiración.
  for (let i = 1; i < presion.length; i++) {
    const maxSalto = 24;
    presion[i] = Math.round(clampV7(presion[i], presion[i - 1] - maxSalto, presion[i - 1] + maxSalto));
  }

  const erosion = grupos.map((grupo, i) => {
    const linea = normalizar(grupo.join(" "));
    const sem = /borra|apaga|desaparece|olvido|pierde|erosiona|cae|resto/.test(linea) ? 22 : 0;
    return Math.round(clampV7(100 - i * (6 + ruptura * 7) - sem - vacio * 12, 14, 100));
  });

  const registros = grupos.map((grupo, i) => {
    const base = numeroDesdeLineaV7(grupo.join("|") + i, 5, 0);
    return Math.round(clampV7(base + (presion[i] > 68 ? 1 : 0) - (vacio > 0.7 ? 1 : 0), 0, 5));
  });

  const vistos = new Map<string, number>();
  const retornos: Array<[number, number]> = [];
  lineasSeguras.forEach((linea, i) => {
    const clave = normalizar(linea);
    if (!clave) return;
    const anterior = vistos.get(clave);
    if (anterior !== undefined && anterior !== i) retornos.push([anterior, i]);
    else vistos.set(clave, i);
  });

  if (!retornos.length && retorno > 0.48 && grupos.length >= 4) {
    retornos.push([0, grupos.length - 2]);
  }

  const ultima = normalizar(lineasSeguras[lineasSeguras.length - 1]);
  const noResuelto = /\bno\b|nadie|nunca|sin |espera|queda|permanece|pero|ausencia/.test(ultima) || /\?$/.test(limpio);

  const firma = `OE-${String(semilla % 100000).padStart(5, "0")}`;

  return {
    firma,
    tempo,
    vacio: porcentajeV7(vacio),
    pulso: porcentajeV7(pulso),
    densidad: porcentajeV7(densidad),
    ruptura: porcentajeV7(ruptura),
    retorno: porcentajeV7(retorno),
    memoria: porcentajeV7(memoria),
    tension: porcentajeV7(tension),
    simetria: porcentajeV7(simetria),
    persistencia: porcentajeV7(persistencia),
    centroMidi,
    duraciones,
    ataques,
    intervalos,
    presion,
    erosion,
    registros,
    retornos,
    noResuelto,
  };
}

function construirPartituraNumericaV7(adn: ADNNumericoV7): PartituraNumericaV7 {
  const cantidad = adn.duraciones.length;
  const escenas: EscenaNumericaV7[] = [];
  const pitchPool: number[] = [adn.centroMidi];

  for (let i = 0; i < Math.max(8, adn.intervalos.length * 2); i++) {
    const intervalo = adn.intervalos[i % adn.intervalos.length] ?? 0;
    let siguiente = pitchPool[pitchPool.length - 1] + intervalo;

    // Ley estética: rango compacto, con memoria de centro.
    if (siguiente > adn.centroMidi + 14) siguiente -= 12;
    if (siguiente < adn.centroMidi - 9) siguiente += 12;

    pitchPool.push(Math.round(siguiente));
  }

  for (let i = 0; i < cantidad; i++) {
    const longitudMotivo = clampV7(
      2 + Math.round(adn.densidad / 34) + (adn.presion[i] > 70 ? 1 : 0) - (adn.vacio > 70 ? 1 : 0),
      1,
      5,
    );

    const inicio = (i * 2 + adn.registros[i]) % Math.max(1, pitchPool.length - longitudMotivo);
    let patronMidi = pitchPool.slice(inicio, inicio + longitudMotivo);

    // Retorno: recupera material anterior, pero nunca idéntico si ya hubo transformación.
    let retornoDe: number | null = null;
    const relacion = adn.retornos.find(([, destino]) => destino === i || destino % cantidad === i);
    if (relacion && escenas.length) {
      retornoDe = Math.min(escenas.length - 1, relacion[0] % escenas.length);
      const origen = escenas[retornoDe].patronMidi;
      const alteracion = Math.max(1, Math.round((100 - adn.erosion[i]) / 24));
      patronMidi = origen.map((nota, j) =>
        j === origen.length - 1
          ? nota + (adn.noResuelto ? alteracion : (j % 2 === 0 ? alteracion : -alteracion))
          : nota,
      );
    }

    const ataquesEscena = Array.from({ length: 8 }, (_, j) =>
      adn.ataques[(i * 5 + j) % adn.ataques.length] ?? 0,
    );

    // Vacio alto: fuerza respiraciones reales.
    if (adn.vacio > 68) {
      for (let j = 1; j < ataquesEscena.length; j += 2) ataquesEscena[j] = 0;
    }
    if (!ataquesEscena.some(Boolean)) ataquesEscena[0] = 1;

    escenas.push({
      duracion: adn.duraciones[i],
      patronMidi,
      ataques: ataquesEscena,
      presion: adn.presion[i],
      vacio: Math.round(clampV7(adn.vacio + (i % 3 === 1 ? 8 : -4), 0, 100)),
      erosion: adn.erosion[i],
      registro: adn.registros[i],
      retornoDe,
    });
  }

  const osciladores = ["sine", "triangle", "sawtooth", "square"] as const;
  const firmaNumero = Math.abs(hashTexto(adn.firma));
  const osciladorPrimario = osciladores[firmaNumero % osciladores.length];
  let osciladorSombra = osciladores[Math.floor(firmaNumero / 7) % osciladores.length];
  if (osciladorSombra === osciladorPrimario) {
    osciladorSombra = osciladores[(osciladores.indexOf(osciladorPrimario) + 1) % osciladores.length];
  }

  return {
    escenas,
    osciladorPrimario,
    osciladorSombra,
    usaPercusion: adn.pulso >= 47 && adn.vacio < 76,
    usaSubgrave: adn.densidad >= 44 && adn.vacio < 82,
    usaSombra: adn.memoria >= 38 || adn.retorno >= 40,
  };
}

function patronNotasV7(notas: number[], ataques: number[]): string {
  if (!notas.length) return "~";
  const eventos: string[] = [];
  let cursor = 0;

  for (let i = 0; i < ataques.length; i++) {
    if (ataques[i]) {
      eventos.push(midiANotaV7(notas[cursor % notas.length]));
      cursor += 1;
    } else {
      eventos.push("~");
    }
  }

  return eventos.join(" ");
}

function desplazarNotasV7(notas: number[], semitonos: number): number[] {
  return notas.map((nota) => Math.round(clampV7(nota + semitonos, 24, 96)));
}

function patronPercusionV7(ataques: number[], ruptura: number, presion: number): string {
  const activos = ataques.reduce((n, a) => n + a, 0);
  if (activos <= 1) return "bd ~ ~ ~";
  if (ruptura >= 65) return presion >= 70 ? "bd(5,12)" : "bd(3,8)";
  if (presion >= 72) return "bd*4";
  if (activos >= 5) return "bd ~ bd ~";
  return "bd ~ ~ bd";
}

// === FIN EMBRION V7 · NUCLEO NUMERICO ===

export function codigoStrudel(organismo: Organismo): string {
  const textoVivo = [organismo.poema, ...organismo.injertos]
    .filter(Boolean)
    .join("\n");

  const adn = extraerADNNumericoV7(textoVivo);
  const partitura = construirPartituraNumericaV7(adn);

  const declaraciones = partitura.escenas.map((escena, indice) => {
    const presion01 = escena.presion / 100;
    const vacio01 = escena.vacio / 100;
    const erosion01 = escena.erosion / 100;

    const patronPrincipal = patronNotasV7(escena.patronMidi, escena.ataques);
    const sombraAtaques = escena.ataques.map((a, i) => (i % 2 === 0 ? a : 0));
    const patronSombra = patronNotasV7(
      desplazarNotasV7(escena.patronMidi, adn.memoria >= 58 ? 12 : 7),
      sombraAtaques,
    );

    const capas: string[] = [];

    // Voz principal: el ritmo nace de la matriz de ataques del texto.
    capas.push(`note("${patronPrincipal}")
      .s("${partitura.osciladorPrimario}")
      .slow(${Math.max(1, Math.round(6 - presion01 * 3 + vacio01 * 3))})
      .gain(${decimal(0.07 + presion01 * 0.17 - vacio01 * 0.035)})
      .room(${decimal(0.28 + vacio01 * 0.58)})
      .delay(${decimal(0.03 + adn.memoria / 100 * 0.22)})
      .lpf(${Math.round(520 + erosion01 * 2900 + presion01 * 900)})`);

    // Sombra/memoria: aparece solo cuando el texto contiene retorno o memoria suficiente.
    if (partitura.usaSombra && escena.vacio < 88) {
      capas.push(`note("${patronSombra}")
        .s("${partitura.osciladorSombra}")
        .slow(${Math.max(2, Math.round(9 - adn.retorno / 100 * 3))})
        .gain(${decimal(0.025 + adn.memoria / 100 * 0.08)})
        .room(${decimal(0.56 + adn.memoria / 100 * 0.30)})
        .delay(${decimal(0.08 + adn.retorno / 100 * 0.24)})`);
    }

    // Subgrave: no es obligatorio; sigue centro y presión, no un patrón fijo de canción.
    if (partitura.usaSubgrave && escena.presion >= 38 && escena.vacio < 78) {
      const raiz = midiANotaV7(escena.patronMidi[0] - 12);
      const segunda = midiANotaV7((escena.patronMidi[1] ?? escena.patronMidi[0]) - 12);
      const patronSub = escena.presion >= 68 ? `${raiz} ~ ${segunda} ~` : `${raiz} ~ ~ ~`;
      capas.push(`note("${patronSub}")
        .s("sine")
        .slow(${escena.presion >= 68 ? 2 : 4})
        .gain(${decimal(0.045 + presion01 * 0.16)})
        .lpf(${Math.round(360 + presion01 * 760)})`);
    }

    // Percusión: puede no existir. El vacío alto la elimina por completo.
    if (partitura.usaPercusion && escena.presion >= 46 && escena.vacio < 68) {
      const patronBd = patronPercusionV7(escena.ataques, adn.ruptura, escena.presion);
      capas.push(`s("${patronBd}").gain(${decimal(0.07 + presion01 * 0.20)})`);

      if (escena.presion >= 64 && adn.densidad >= 52) {
        const hat = adn.ruptura >= 60 ? "[~ hh]*8" : escena.presion >= 82 ? "hh*8" : "~ hh ~ hh";
        capas.push(`s("${hat}")
          .gain(${decimal(0.025 + presion01 * 0.055)})
          .hpf(${Math.round(4300 + adn.ruptura * 22)})`);
      }
    }

    // Vacío extremo: desnuda la escena a una sola capa, aunque la presión sea alta.
    const capasFinales = escena.vacio >= 82 ? capas.slice(0, 1) : capas;

    return `const escena${indice} = stack(\n${capasFinales.join(",\n")}\n)`;
  }).join("\n\n");

  const arreglo = partitura.escenas
    .map((escena, indice) => `  [${escena.duracion}, escena${indice}]`)
    .join(",\n");

  const retornosTexto = adn.retornos.length
    ? adn.retornos.map(([a, b]) => `${a}→${b}`).join(" · ")
    : "—";

  return `/*
EMBRIÓN V7 · NÚCLEO NUMÉRICO 1.0
${adn.firma} · ${organismo.nombre}

ADN LITERARIO
TEMPO        ${adn.tempo}
VACÍO        ${adn.vacio}
PULSO        ${adn.pulso}
DENSIDAD     ${adn.densidad}
RUPTURA      ${adn.ruptura}
RETORNO      ${adn.retorno}
MEMORIA      ${adn.memoria}
TENSIÓN      ${adn.tension}
SIMETRÍA     ${adn.simetria}
PERSISTENCIA ${adn.persistencia}

PARTITURA NUMÉRICA
DURACIONES [${adn.duraciones.join(", ")}]
ATAQUES    [${adn.ataques.join(",")}]
INTERVALOS [${adn.intervalos.join(", ")}]
PRESIÓN    [${adn.presion.join(", ")}]
EROSIÓN    [${adn.erosion.join(", ")}]
REGISTRO   [${adn.registros.join(", ")}]
RETORNOS   ${retornosTexto}

GRAMÁTICA ESTÉTICA
idea mínima · transformación · respiración · memoria · presión sin saturación
percusión opcional · retorno alterado · rango armónico limitado · no-resolución textual
*/

setcpm(${adn.tempo}/4)

${declaraciones}

arrange(
${arreglo}
)
`;
}


function base64Utf8(texto: string): string {
  const bytes = new TextEncoder().encode(texto);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return globalThis.btoa(binary);
}

export function urlStrudel(codigo: string): string {
  return `https://strudel.cc/#${base64Utf8(codigo)}`;
}
