export type EntradaDirector = {
  codigo?: string;
  nombre?: string;
  texto: string;
  semilla?: number | string;
  energia?: number;
  complejidad?: number;
};

export type DireccionMusical = {
  documento: string;
  prompt: string;
  lectura: {
    repeticion: number;
    fragmentacion: number;
    vacio: number;
    memoria: number;
    ruptura: number;
    corporalidad: number;
    movimiento: number;
    luz: number;
    negacion: number;
  };
};

type Indices = DireccionMusical["lectura"] & {
  longitud: number;
  respiracion: number;
  persistencia: number;
};

const STOP = new Set([
  "a", "al", "algo", "ante", "aquel", "aquella", "aquello", "con", "como", "de", "del", "desde",
  "donde", "el", "ella", "ellas", "ellos", "en", "entre", "era", "es", "esa", "ese", "esta", "este",
  "esto", "fue", "ha", "hay", "la", "las", "le", "lo", "los", "me", "mi", "mis", "muy", "o", "para",
  "pero", "por", "que", "se", "si", "sin", "sobre", "su", "sus", "te", "tu", "un", "una", "y", "ya",
]);

const CAMPOS = {
  vacio: ["nadie", "nada", "vacio", "vacía", "vacío", "silencio", "ausencia", "solo", "sola", "sin", "apaga", "apagada", "desaparece", "olvido", "lejos"],
  memoria: ["memoria", "recuerda", "recuerdo", "recordar", "vuelve", "volver", "regresa", "regresar", "antes", "después", "todavía", "huella", "marca", "nombre", "resto", "eco"],
  ruptura: ["herida", "herir", "roto", "rota", "rompe", "fractura", "corte", "caer", "cae", "muerte", "muerto", "fuego", "grito", "golpe", "ruina", "sangre", "error"],
  cuerpo: ["cuerpo", "piel", "mano", "manos", "sangre", "hueso", "huesos", "boca", "respira", "respirar", "corazón", "corazon", "latido", "carne", "pie", "pies", "ojos"],
  movimiento: ["cruza", "cruzar", "camina", "caminar", "corre", "correr", "cae", "caer", "entra", "sale", "sube", "baja", "vuelve", "regresa", "mueve", "mover"],
  luz: ["luz", "lámpara", "lampara", "sol", "brillo", "blanco", "blanca", "sombra", "oscuro", "oscura", "noche", "fuego", "enciende", "apaga"],
  negacion: ["no", "nunca", "nadie", "nada", "sin", "jamás", "jamas", "tampoco"],
};

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

function normalizar(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function hash(texto: string): number {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i += 1) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pctHits(tokens: string[], vocab: string[], gain: number, base = 0): number {
  const set = new Set(vocab.map(normalizar));
  const hits = tokens.filter((t) => set.has(t)).length;
  return clamp(base + hits * gain);
}

function analizar(texto: string): Indices {
  const limpio = normalizar(texto);
  const tokens = limpio.match(/[a-zñ]+/g) ?? [];
  const relevantes = tokens.filter((t) => t.length > 2 && !STOP.has(t));
  const lineas = texto.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const longitudes = lineas.map((l) => (normalizar(l).match(/[a-zñ]+/g) ?? []).length);
  const cortas = longitudes.filter((n) => n <= 3).length;
  const puntuacion = (texto.match(/[.!?;:—–…]/g) ?? []).length;

  const freq = new Map<string, number>();
  for (const t of relevantes) freq.set(t, (freq.get(t) ?? 0) + 1);
  const extras = [...freq.values()].reduce((acc, n) => acc + Math.max(0, n - 1), 0);
  const repeticion = clamp((extras / Math.max(1, relevantes.length)) * 190 + (lineas.length ? 8 : 0));

  const fragmentacion = clamp(
    (cortas / Math.max(1, lineas.length)) * 72 +
    (puntuacion / Math.max(1, tokens.length)) * 155,
  );

  const vacioLex = pctHits(tokens, CAMPOS.vacio, 12);
  const memoria = clamp(pctHits(tokens, CAMPOS.memoria, 11) + repeticion * 0.26);
  const ruptura = clamp(pctHits(tokens, CAMPOS.ruptura, 12) + fragmentacion * 0.24);
  const corporalidad = pctHits(tokens, CAMPOS.cuerpo, 11);
  const movimiento = pctHits(tokens, CAMPOS.movimiento, 13);
  const luz = pctHits(tokens, CAMPOS.luz, 10);
  const negacion = pctHits(tokens, CAMPOS.negacion, 12);
  const vacio = clamp(vacioLex + fragmentacion * 0.24 + negacion * 0.27 - repeticion * 0.1);
  const respiracion = clamp(fragmentacion * 0.48 + vacio * 0.33 + (lineas.length > 3 ? 12 : 4));
  const persistencia = clamp(repeticion * 0.62 + memoria * 0.38);

  return {
    repeticion: Math.round(repeticion),
    fragmentacion: Math.round(fragmentacion),
    vacio: Math.round(vacio),
    memoria: Math.round(memoria),
    ruptura: Math.round(ruptura),
    corporalidad: Math.round(corporalidad),
    movimiento: Math.round(movimiento),
    luz: Math.round(luz),
    negacion: Math.round(negacion),
    longitud: tokens.length,
    respiracion: Math.round(respiracion),
    persistencia: Math.round(persistencia),
  };
}

function mayor(indices: Indices): keyof Indices {
  const claves: (keyof Indices)[] = ["memoria", "vacio", "ruptura", "repeticion", "corporalidad", "movimiento", "luz", "respiracion", "persistencia"];
  return claves.reduce((a, b) => (Number(indices[b]) > Number(indices[a]) ? b : a));
}

function tempo(indices: Indices): string {
  const centro = Math.round(clamp(72 + indices.movimiento * 0.18 + indices.repeticion * 0.12 - indices.vacio * 0.2, 58, 112));
  const margen = indices.fragmentacion > 65 ? 5 : 3;
  return `${centro - margen}–${centro + margen} BPM percibidos; no convertir el tempo en protagonista`;
}

function gesto(indices: Indices): string {
  if (indices.memoria >= 62 && indices.repeticion >= 28) return "Una figura mínima reaparece varias veces; cada retorno conserva su identidad pero pierde o desplaza un detalle.";
  if (indices.vacio >= 62) return "La obra nace desde la ausencia: pocos acontecimientos, mucho aire y una revelación tardía de la materia central.";
  if (indices.ruptura >= 62) return "Una continuidad delicada es interrumpida por una herida real; la música posterior conserva la cicatriz y no vuelve intacta.";
  if (indices.corporalidad >= 50) return "El centro es físico y próximo: respiración, fricción, pulso y materia táctil antes que una melodía ornamental.";
  if (indices.movimiento >= 48) return "La pieza avanza por desplazamientos pequeños y continuos; cada movimiento cambia la perspectiva del mismo material.";
  return "Una célula breve de dos a cinco notas se revela con lentitud y gana significado por repetición, espacio y transformación.";
}

function materia(indices: Indices, variante: number): string[] {
  const m: string[] = [];
  if (indices.corporalidad >= 35) m.push("textura humana próxima: respiración, roce o ataque orgánico muy discreto");
  if (indices.vacio >= 45) m.push("una voz instrumental desnuda y cercana, con cola corta y mucho espacio real entre eventos");
  if (indices.memoria >= 45) m.push("una sombra procesada del motivo principal, más lejana y erosionada");
  if (indices.luz >= 35) m.push("un brillo armónico raro y delicado que aparezca solo en momentos decisivos");
  if (indices.movimiento >= 40 || indices.repeticion >= 40) m.push("pulso electrónico fino, seco y contenido, nunca bombo continuo por defecto");
  if (indices.ruptura >= 42) m.push("una materia áspera o metálica de aparición excepcional, utilizada como cicatriz");

  const fallback = [
    "piano preparado o teclado eléctrico íntimo, tratado con mucha economía",
    "sintetizador analógico cálido de ataque definido y sustain corto",
    "cuerda procesada o resonancia acústica difícil de identificar",
  ];
  while (m.length < 3) m.push(fallback[(variante + m.length) % fallback.length]);
  return m.slice(0, 4);
}

function forma(indices: Indices): string[] {
  const partes: string[] = [];
  partes.push(`I · UMBRAL — presentar la identidad con ${indices.vacio >= 55 ? "muy pocos eventos y silencios largos" : "economía extrema, sin revelar aún el cuerpo completo"}.`);
  if (indices.repeticion >= 25) partes.push("II · INSISTENCIA — repetir la célula central sin copiarla mecánicamente; una microvariación por retorno.");
  else partes.push("II · REVELACIÓN — permitir que una segunda relación armónica haga visible el sentido del motivo inicial.");
  if (indices.ruptura >= 38) partes.push("III · HERIDA — retirar o quebrar una continuidad; no compensar inmediatamente la pérdida.");
  else partes.push("III · PRESIÓN — aumentar tensión mediante proximidad, registro y densidad, no mediante volumen ni aceleración.");
  if (indices.memoria >= 35) partes.push("IV · RETORNO — recuperar material anterior transformado: reconocible, incompleto y emocionalmente más cargado.");
  else partes.push("IV · CONTRACCIÓN — quitar capas antes del punto de máxima intensidad para que la ausencia gane peso.");
  partes.push(`V · RESTO — ${indices.negacion >= 30 || indices.vacio >= 55 ? "no resolver del todo; dejar una resonancia o figura suspendida" : "cerrar con una última transformación mínima, evitando una cadencia obvia"}.`);
  return partes;
}

function leyIntensidad(indices: Indices): string {
  if (indices.vacio >= 55) return "La intensidad debe crecer primero por sustracción: retirar antes de revelar. El clímax puede contener menos elementos que la sección anterior.";
  if (indices.repeticion >= 48) return "La intensidad nace de la insistencia y del cambio microscópico. No añadir capas hasta que la repetición haya adquirido significado.";
  if (indices.ruptura >= 50) return "Antes del clímax debe existir una interrupción o contracción inequívoca. La vuelta posterior conserva una cicatriz audible.";
  return "Construir presión por registro, proximidad, contrapunto y densidad selectiva. Evitar que el clímax sea simplemente más fuerte.";
}

function mutacion(variante: number): string {
  if (variante === 1) return "Privilegiar la fragilidad: menos pulso, más proximidad, más respiración y mayor valor del silencio.";
  if (variante === 2) return "Privilegiar la obsesión: un pulso sobrio y tardío puede aparecer, pero debe servir a la repetición literaria y nunca dominarla.";
  return "Privilegiar la memoria: retornos, sombras, materiales erosionados y pequeñas diferencias perceptibles entre una aparición y la siguiente.";
}

function promptIngles(nombre: string, indices: Indices, material: string[], estructura: string[], variante: number): string {
  const dominant = mayor(indices);
  const density = indices.vacio >= 65 ? "very sparse" : indices.vacio >= 40 ? "spacious and restrained" : "gradually layered but never crowded";
  const pulse = indices.repeticion >= 55 || indices.movimiento >= 55
    ? "Introduce a precise, understated electronic pulse only after the musical identity is established."
    : "Percussion is optional; do not introduce a beat unless the form genuinely needs it.";
  const memory = indices.memoria >= 45
    ? "Let the main motif return later in a recognisable but altered form, as if memory had damaged it slightly."
    : "Transform the central motif through register, spacing and harmony rather than replacing it with new ideas.";
  const rupture = indices.ruptura >= 48
    ? "Create one genuine rupture or disappearance; what follows must carry an audible scar."
    : "Use one major contraction before the emotional peak, removing material instead of simply adding more.";

  return [
    `Compose a beautiful, original instrumental piece titled “${nombre || "Untitled Organism"}”.`,
    "Aesthetic identity: hypnotic, nocturnal, elegant, intimate, emotionally deep without sentimentality; electronic but unmistakably human.",
    `The literary reading is dominated by ${String(dominant)}. The musical space should be ${density}.`,
    "Begin with one memorable cell of 2–5 notes. Give it enough silence to become recognisable before introducing secondary material.",
    `Tempo character: ${tempo(indices)}.`,
    `Core gesture: ${gesto(indices)}`,
    `Sound material: ${material.join("; ")}.`,
    pulse,
    memory,
    rupture,
    leyIntensidad(indices),
    "Harmony should be modal and ambiguous, with smooth voice-leading and rare colour tones used as events, not decoration. Avoid obvious major/minor emotional clichés.",
    "Keep the low end controlled and late. Sub-bass should be an event, never a permanent drone.",
    "Preserve small human imperfections, breath, grain, closeness and fragile attacks when they carry emotional truth.",
    "The climax must feel inevitable because of what came before: revelation, return or pressure, not an EDM drop and not merely more volume.",
    `Interpretive mutation: ${mutacion(variante)}`,
    `Formal arc: ${estructura.join(" ")}`,
    "End with residue rather than spectacle. The listener should remember the first idea after the piece stops.",
    "Avoid: generic cinematic pads, trailer crescendos, constant arpeggios, four-on-the-floor by default, EDM drops, heroic chord progressions, random melody, long foghorn-like drones, excessive reverb, overcrowding, and decorative sound-design without structural meaning.",
  ].join(" ");
}

export function crearDireccionMusical(entrada: EntradaDirector): DireccionMusical {
  const texto = entrada.texto.trim();
  const indices = analizar(texto);
  const seed = hash(`${texto}|${entrada.nombre ?? ""}|${String(entrada.semilla ?? "0")}|${Math.round(entrada.energia ?? 0)}|${Math.round(entrada.complejidad ?? 0)}`);
  const variante = seed % 3;
  const material = materia(indices, variante);
  const estructura = forma(indices);
  const nombre = entrada.nombre?.trim() || "Organismo sin título";
  const codigo = entrada.codigo?.trim() || `OE-${String(seed % 100000).padStart(5, "0")}`;
  const prompt = promptIngles(nombre, indices, material, estructura, variante);

  const documento = [
    "EMBRIÓN · DIRECTOR 1.0",
    `${codigo} · ${nombre}`,
    "La literatura es el instrumento. El embrión es el director. La música es la consecuencia.",
    "",
    "LECTURA DEL TEXTO",
    `Repetición ${indices.repeticion} · Fragmentación ${indices.fragmentacion} · Vacío ${indices.vacio}`,
    `Memoria ${indices.memoria} · Ruptura ${indices.ruptura} · Corporalidad ${indices.corporalidad}`,
    `Movimiento ${indices.movimiento} · Luz/sombra ${indices.luz} · Negación ${indices.negacion}`,
    "",
    "GESTO CENTRAL",
    gesto(indices),
    "",
    "PARTITURA GENÉTICA",
    ...estructura,
    "",
    "MATERIA SUGERIDA",
    ...material.map((x, i) => `${i + 1}. ${x}`),
    "",
    "LEY DE INTENSIDAD",
    leyIntensidad(indices),
    "",
    "MUTACIÓN DE ESTA LECTURA",
    mutacion(variante),
    "",
    "PROMPT MUSICAL · LISTO PARA UN MOTOR GENERATIVO",
    prompt,
    "",
    "PROHIBICIONES CANÓNICAS",
    "No pads cinematográficos genéricos · no drop EDM · no bombo obligatorio · no arpegio constante · no crescendo por volumen · no drones de bocina · no melodía aleatoria · no sobrecargar.",
  ].join("\n");

  return {
    documento,
    prompt,
    lectura: {
      repeticion: indices.repeticion,
      fragmentacion: indices.fragmentacion,
      vacio: indices.vacio,
      memoria: indices.memoria,
      ruptura: indices.ruptura,
      corporalidad: indices.corporalidad,
      movimiento: indices.movimiento,
      luz: indices.luz,
      negacion: indices.negacion,
    },
  };
}
