export type Habitat =
  | "deriva"
  | "pulso"
  | "fractura"
  | "espectral"
  | "maquina"
  | "memoria";

export type Metabolismo = "contemplativo" | "vivo" | "intensivo";

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
  metabolismo: Metabolismo;
  ciclosVitales: number;
  biomasaVerbal: number;
  palabrasIntegradas: number;
  alimentaciones: number;
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
    metabolismo: "contemplativo",
    ciclosVitales: 0,
    biomasaVerbal: palabras(poema).length,
    palabrasIntegradas: palabras(poema).length,
    alimentaciones: 0,
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
    ciclosVitales: organismo.ciclosVitales + 1,
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


export function migrarOrganismo(
  valor: Organismo | Record<string, unknown>,
): Organismo {
  const source = valor as Partial<Organismo>;
  const poema = typeof source.poema === "string" ? source.poema : "";
  const nombre =
    typeof source.nombre === "string" && source.nombre.trim()
      ? source.nombre
      : "Organismo sin nombre";
  const analisis = analizarPoema(poema);
  const injertos = Array.isArray(source.injertos)
    ? source.injertos.filter((item): item is string => typeof item === "string")
    : [];
  const textoTotal = [poema, ...injertos].filter(Boolean).join("\n");
  const totalPalabras = palabras(textoTotal).length;
  const fecha = fechaHoy();
  const codigo =
    typeof source.codigo === "string" && source.codigo
      ? source.codigo
      : `OE-${String(hashTexto(`${poema}|${nombre}`) % 100000).padStart(5, "0")}`;

  const habitats = {} as Record<Habitat, number>;
  HABITATS.forEach((habitat) => {
    const valorHabitat = source.habitats?.[habitat];
    habitats[habitat] = limitar(
      typeof valorHabitat === "number"
        ? valorHabitat
        : analisis.habitats[habitat],
      0,
      100,
    );
  });

  const diario = Array.isArray(source.diario)
    ? source.diario.filter(
        (entrada): entrada is EntradaVital =>
          Boolean(entrada) && typeof entrada === "object",
      )
    : [];

  return {
    version: 4,
    id:
      typeof source.id === "string" && source.id
        ? source.id
        : `${codigo}-${Date.now()}`,
    codigo,
    nombre,
    poema,
    nacimiento:
      typeof source.nacimiento === "string" ? source.nacimiento : fecha,
    ultimaEvolucion:
      typeof source.ultimaEvolucion === "string"
        ? source.ultimaEvolucion
        : fecha,
    ultimaInteraccion:
      typeof source.ultimaInteraccion === "string"
        ? source.ultimaInteraccion
        : fecha,
    edad: typeof source.edad === "number" ? Math.max(0, source.edad) : 0,
    etapa: source.etapa ?? "embrion",
    semilla:
      typeof source.semilla === "number"
        ? source.semilla
        : hashTexto(`${poema}|${nombre}`),
    reliquia:
      typeof source.reliquia === "string" && source.reliquia
        ? source.reliquia
        : analisis.reliquia,
    bpmBase:
      typeof source.bpmBase === "number"
        ? source.bpmBase
        : analisis.bpmBase,
    tonalidad:
      typeof source.tonalidad === "string"
        ? source.tonalidad
        : analisis.tonalidad,
    habitats,
    energia:
      typeof source.energia === "number" ? limitar(source.energia) : 42,
    estabilidad:
      typeof source.estabilidad === "number"
        ? limitar(source.estabilidad)
        : 58,
    memoriaVital:
      typeof source.memoriaVital === "number"
        ? limitar(source.memoriaVital)
        : 30,
    complejidad:
      typeof source.complejidad === "number"
        ? limitar(source.complejidad)
        : 14,
    notas:
      Array.isArray(source.notas) && source.notas.length
        ? source.notas.filter((nota): nota is string => typeof nota === "string")
        : analisis.notas,
    diario,
    injertos,
    metabolismo:
      source.metabolismo === "vivo" || source.metabolismo === "intensivo"
        ? source.metabolismo
        : "contemplativo",
    ciclosVitales:
      typeof source.ciclosVitales === "number"
        ? Math.max(0, Math.round(source.ciclosVitales))
        : typeof source.edad === "number"
          ? Math.max(0, Math.round(source.edad))
          : 0,
    biomasaVerbal:
      typeof source.biomasaVerbal === "number"
        ? Math.max(totalPalabras, Math.round(source.biomasaVerbal))
        : totalPalabras,
    palabrasIntegradas:
      typeof source.palabrasIntegradas === "number"
        ? Math.max(totalPalabras, Math.round(source.palabrasIntegradas))
        : totalPalabras,
    alimentaciones:
      typeof source.alimentaciones === "number"
        ? Math.max(0, Math.round(source.alimentaciones))
        : injertos.length,
  };
}

export function evolucionarHastaAhora(organismo: Organismo): {
  organismo: Organismo;
  ciclos: number;
} {
  return evolucionarHastaHoy(migrarOrganismo(organismo));
}

export function cambiarMetabolismo(
  organismo: Organismo,
  metabolismo: Metabolismo,
): Organismo {
  return {
    ...organismo,
    metabolismo,
    ultimaInteraccion: fechaHoy(),
  };
}

export function evolucionarHastaHoy(organismo: Organismo): {
  organismo: Organismo;
  ciclos: number;
} {
  const base = migrarOrganismo(organismo);
  const hoy = fechaHoy();
  const ciclos = diasEntre(base.ultimaEvolucion, hoy);
  let actual = base;

  for (let i = 1; i <= ciclos; i += 1) {
    const fecha = new Date(`${base.ultimaEvolucion}T12:00:00`);
    fecha.setDate(fecha.getDate() + i);
    actual = evolucionarDia(
      actual,
      base.edad + i,
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

  const nuevasPalabras = palabras(limpio).length;
  const textoTotal = [organismo.poema, ...organismo.injertos, limpio]
    .filter(Boolean)
    .join("\n");
  const analisis = analizarPoema(textoTotal);
  const habitat = HABITATS.slice().sort(
    (a, b) => analisis.habitats[b] - analisis.habitats[a],
  )[0];
  const habitats = {} as Record<Habitat, number>;

  HABITATS.forEach((item) => {
    const impulso = item === habitat ? 0.28 : 0.16;
    habitats[item] = limitar(
      organismo.habitats[item] * (1 - impulso) +
        analisis.habitats[item] * impulso,
      0,
      100,
    );
  });

  return {
    ...organismo,
    ultimaInteraccion: fechaHoy(),
    energia: limitar(
      organismo.energia + 3 + Math.min(8, nuevasPalabras * 0.35),
    ),
    estabilidad: limitar(
      organismo.estabilidad +
        (habitat === "memoria" ? 3 : 0) -
        (habitat === "fractura" ? 2 : 0),
    ),
    complejidad: limitar(
      organismo.complejidad + 3 + Math.min(8, nuevasPalabras * 0.24),
    ),
    memoriaVital: limitar(
      organismo.memoriaVital + 2 + (habitat === "memoria" ? 4 : 0),
    ),
    reliquia: analisis.reliquia,
    bpmBase: limitar(organismo.bpmBase * 0.72 + analisis.bpmBase * 0.28, 45, 145),
    tonalidad: analisis.tonalidad,
    notas: analisis.notas,
    habitats,
    ciclosVitales: organismo.ciclosVitales + 1,
    biomasaVerbal: organismo.biomasaVerbal + nuevasPalabras,
    palabrasIntegradas: organismo.palabrasIntegradas + nuevasPalabras,
    alimentaciones: organismo.alimentaciones + 1,
    injertos: [...organismo.injertos, limpio].slice(-50),
    diario: [
      ...organismo.diario,
      {
        id: `injerto-${Date.now()}`,
        dia: organismo.edad,
        fecha: fechaHoy(),
        titulo: "El organismo digirió materia verbal",
        habitat,
        texto:
          `«${limpio.slice(0, 160)}» fue absorbido como materia viva. ` +
          `${nuevasPalabras} palabras aumentaron su biomasa y activaron ` +
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

export function duracionComposicionMinutos(
  organismo: Organismo,
): number {
  return Math.round(
    (CICLOS_COMPOSICION * 4 * 10) / bpmActual(organismo),
  ) / 10;
}

export function codigoStrudel(organismo: Organismo): string {
  const notas = rotar(
    organismo.notas,
    organismo.edad + organismo.diario.length + organismo.injertos.length,
  );
  const motivoA = notas.slice(0, 5).join(" ");
  const motivoB = rotar(notas, 2).slice(0, 5).join(" ");
  const motivoC = rotar(notas, 4).slice(0, 5).join(" ");
  const reliquia = notas[hashTexto(organismo.reliquia) % notas.length];
  const finalNote = notas[notas.length - 1] ?? reliquia;
  const h = organismo.habitats;
  const bpm = bpmActual(organismo);

  const incubacion = `stack(
  note("<${motivoA}>")
    .s("sine")
    .slow(10)
    .gain(${decimal(0.1 + h.deriva / 650)})
    .room(${decimal(0.72 + h.deriva / 390)})
    .delay(${decimal(0.28 + h.memoria / 420)}),

  note("<${reliquia} ~ ${reliquia} ~>")
    .s("triangle")
    .slow(8)
    .gain(${decimal(0.07 + h.memoria / 650)})
    .room(${decimal(0.6 + h.espectral / 430)})
)`;

  const germinacion = `stack(
  note("<${motivoA}>")
    .s("sine")
    .slow(7)
    .gain(${decimal(0.12 + h.deriva / 580)})
    .room(${decimal(0.62 + h.deriva / 470)}),

  note("<${reliquia} ~ ${finalNote} ~>")
    .s("triangle")
    .slow(6)
    .gain(${decimal(0.08 + h.memoria / 610)})
    .room(${decimal(0.54 + h.espectral / 480)}),

  s("bd ~ ~ ~")
    .gain(${decimal(0.1 + h.pulso / 760)})
)`;

  const formacion = `stack(
  note("<${motivoB}>")
    .s("sine")
    .slow(5)
    .gain(${decimal(0.13 + h.deriva / 560)})
    .room(${decimal(0.5 + h.deriva / 520)}),

  note("<${reliquia} ~ ${finalNote} ~>")
    .s("triangle")
    .slow(5)
    .gain(${decimal(0.09 + h.memoria / 590)})
    .lpf(${Math.round(900 + organismo.memoriaVital * 17)}),

  s("${h.fractura >= 58 ? "bd(3,8)" : "bd ~ bd ~"}")
    .gain(${decimal(0.18 + h.pulso / 450)}),

  s("[~ hh]*4")
    .gain(${decimal(0.04 + h.fractura / 760)})
    .hpf(${Math.round(4300 + h.fractura * 22)})
)`;

  const cuerpo = `stack(
  note("<${motivoB}>")
    .s("sawtooth")
    .slow(2)
    .gain(${decimal(0.1 + h.maquina / 570)})
    .lpf(${Math.round(650 + h.maquina * 20)})
    .lpq(7),

  note("<${motivoA}>")
    .s("sine")
    .slow(4)
    .gain(${decimal(0.1 + h.deriva / 660)})
    .room(0.42),

  s("${h.pulso >= 68 ? "bd*4" : "bd(3,8)"}")
    .gain(${decimal(0.28 + h.pulso / 280)}),

  s("~ cp ~ cp")
    .gain(${decimal(0.08 + h.pulso / 720)})
    .room(0.16),

  s("hh*8")
    .gain(${decimal(0.05 + h.fractura / 720)})
    .hpf(5200)
)`;

  const fractura = `stack(
  note("<${motivoC}>")
    .s("triangle")
    .slow(3)
    .gain(${decimal(0.11 + h.espectral / 650)})
    .room(${decimal(0.55 + h.espectral / 360)}),

  s("bd(3,8)")
    .gain(${decimal(0.2 + h.fractura / 430)}),

  s("[~ hh]*8")
    .gain(${decimal(0.05 + h.fractura / 650)})
    .hpf(${Math.round(5000 + h.fractura * 18)})
    .delay(${decimal(0.1 + h.fractura / 500)})
)`;

  const expansion = `stack(
  note("<${motivoC}>")
    .s("sine")
    .slow(4)
    .gain(${decimal(0.14 + h.deriva / 540)})
    .room(${decimal(0.48 + h.deriva / 510)}),

  note("<${motivoB}>")
    .s("sawtooth")
    .slow(2)
    .gain(${decimal(0.13 + h.maquina / 510)})
    .lpf(${Math.round(850 + h.maquina * 24)})
    .lpq(8),

  s("bd*4")
    .gain(${decimal(0.31 + h.pulso / 250)}),

  s("~ cp ~ cp")
    .gain(${decimal(0.11 + h.pulso / 640)})
    .room(0.2),

  s("hh*16")
    .gain(${decimal(0.05 + h.fractura / 680)})
    .hpf(5700),

  note("<${reliquia} ${finalNote}>")
    .s("triangle")
    .slow(6)
    .gain(${decimal(0.05 + h.espectral / 740)})
    .room(${decimal(0.66 + h.espectral / 390)})
)`;

  const memoria = `stack(
  note("<${motivoA}>")
    .s("sine")
    .slow(9)
    .gain(${decimal(0.09 + h.deriva / 690)})
    .room(${decimal(0.75 + h.deriva / 430)})
    .delay(${decimal(0.3 + h.memoria / 440)}),

  note("<${reliquia} ~ ${finalNote} ~>")
    .s("triangle")
    .slow(7)
    .gain(${decimal(0.06 + h.memoria / 650)})
    .room(${decimal(0.7 + h.espectral / 430)}),

  s("bd ~ ~ ~")
    .gain(${decimal(0.06 + h.pulso / 950)})
)`;

  return `/*
ORGANISMO · LITERATURA ELECTRÓNICA VIVA
${organismo.codigo} · ${organismo.nombre}
Día ${organismo.edad} · ${organismo.etapa}
Núcleo: ${organismo.reliquia}
Duración estimada: ${duracionComposicionMinutos(organismo)} minutos

La canción madura durante una sola reproducción.
El organismo continúa evolucionando con los días.
*/

setcpm(${bpm}/4)

const incubacion = ${incubacion}

const germinacion = ${germinacion}

const formacion = ${formacion}

const cuerpo = ${cuerpo}

const fractura = ${fractura}

const expansion = ${expansion}

const memoria = ${memoria}

arrange(
  [4, incubacion],
  [6, germinacion],
  [8, formacion],
  [10, cuerpo],
  [6, fractura],
  [12, expansion],
  [10, memoria]
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
