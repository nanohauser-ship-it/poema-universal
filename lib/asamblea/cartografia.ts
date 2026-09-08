export type SymbolicAxis =
  | "memory"
  | "desire"
  | "wound"
  | "matter";

export type CartographyNode = {
  id: string;
  label: string;
  axis: SymbolicAxis;
  meaning: string;
  evidence: string[];
  intensity: number;
  x: number;
  y: number;
  glyph: string;
};

export type CartographyLink = {
  id: string;
  from: string;
  to: string;
  relation: string;
  strength: number;
};

export type CartographyZone = {
  id: string;
  name: string;
  meaning: string;
  shape:
    | "circle"
    | "ring"
    | "fortress"
    | "triangle";
  x: number;
  y: number;
  radius: number;
};

export type SymbolicCartography = {
  secretTitle: string;
  centralSymbol: string;
  nucleus: string;
  oraclePhrase: string;
  relic: string;
  finalGesture: string;
  dominantAxis: SymbolicAxis;
  nodes: CartographyNode[];
  links: CartographyLink[];
  zones: CartographyZone[];
};


/* ============================================================
   CARTÓGRAFO LOCAL
   ------------------------------------------------------------
   Mantiene viva la Cartografía Simbólica cuando la capa IA
   no está disponible.

   No sustituye al cartógrafo remoto: actúa como fallback.
   ============================================================ */

const LOCAL_STOPWORDS = new Set([
  "para",
  "pero",
  "porque",
  "como",
  "cuando",
  "donde",
  "desde",
  "hasta",
  "entre",
  "sobre",
  "tras",
  "ante",
  "bajo",
  "contra",
  "hacia",
  "este",
  "esta",
  "estos",
  "estas",
  "esto",
  "ese",
  "esa",
  "esos",
  "esas",
  "aquel",
  "aquella",
  "aquellos",
  "aquellas",
  "algo",
  "nada",
  "todo",
  "todos",
  "toda",
  "todas",
  "otro",
  "otra",
  "otros",
  "otras",
  "mismo",
  "misma",
  "muy",
  "más",
  "menos",
  "también",
  "aunque",
  "entonces",
  "mientras",
  "quien",
  "quienes",
  "cual",
  "cuales",
  "qué",
  "que",
  "del",
  "las",
  "los",
  "una",
  "uno",
  "unos",
  "unas",
  "con",
  "sin",
  "por",
  "ser",
  "estar",
  "era",
  "eran",
  "fue",
  "han",
  "hay",
  "soy",
  "eres",
  "somos",
  "son",
  "mis",
  "tus",
  "sus",
  "nos",
  "me",
  "te",
  "se",
  "lo",
  "la",
  "le",
  "les",
  "al",
  "y",
  "o",
  "e",
  "u",
  "de",
  "en",
  "un",
  "a",
]);

const AXIS_WORDS: Record<
  SymbolicAxis,
  string[]
> = {
  memory: [
    "memoria",
    "recuerdo",
    "recordar",
    "olvido",
    "ayer",
    "antes",
    "infancia",
    "niño",
    "niña",
    "abuelo",
    "abuela",
    "madre",
    "padre",
    "nombre",
    "regreso",
    "volver",
    "vuelve",
    "pasado",
    "tiempo",
    "ausencia",
    "casa",
  ],

  desire: [
    "deseo",
    "quiero",
    "quiere",
    "buscar",
    "busco",
    "hambre",
    "amor",
    "amar",
    "camino",
    "viaje",
    "huir",
    "espera",
    "esperar",
    "alcanzar",
    "venir",
    "ir",
    "futuro",
    "sed",
    "llamada",
  ],

  wound: [
    "herida",
    "dolor",
    "miedo",
    "silencio",
    "roto",
    "rota",
    "romper",
    "pérdida",
    "perder",
    "vacío",
    "vacía",
    "soledad",
    "llanto",
    "llorar",
    "sangre",
    "muerte",
    "muerto",
    "muerta",
    "nunca",
    "culpa",
  ],

  matter: [
    "cuerpo",
    "mano",
    "manos",
    "piel",
    "piedra",
    "agua",
    "fuego",
    "luz",
    "sombra",
    "tierra",
    "barro",
    "árbol",
    "animal",
    "perro",
    "pájaro",
    "mar",
    "noche",
    "frío",
    "calor",
    "puerta",
    "ventana",
    "habitación",
    "casa",
    "hueso",
  ],
};

const AXIS_GLYPHS: Record<
  SymbolicAxis,
  string
> = {
  memory: "☾",
  desire: "△",
  wound: "◇",
  matter: "○",
};

const LOCAL_POSITIONS = [
  { x: 18, y: 24 },
  { x: 39, y: 17 },
  { x: 70, y: 22 },
  { x: 83, y: 41 },
  { x: 77, y: 69 },
  { x: 58, y: 82 },
  { x: 30, y: 78 },
  { x: 16, y: 58 },
];

function normalizeLocalWord(
  value: string
) {
  return value
    .toLocaleLowerCase("es")
    .replace(
      /[^a-záéíóúüñ0-9-]/gi,
      ""
    );
}

function localFragments(
  poem: string
) {
  return poem
    .split(/[\n.!?;:]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function axisScoreForText(
  text: string,
  axis: SymbolicAxis
) {
  const lower =
    text.toLocaleLowerCase("es");

  return AXIS_WORDS[axis].reduce(
    (score, word) => {
      return (
        score +
        (
          lower.includes(word)
            ? 1
            : 0
        )
      );
    },
    0
  );
}

function axisForText(
  text: string
): SymbolicAxis {
  const axes: SymbolicAxis[] = [
    "memory",
    "desire",
    "wound",
    "matter",
  ];

  return [...axes].sort(
    (a, b) =>
      axisScoreForText(text, b) -
      axisScoreForText(text, a)
  )[0];
}

function capitalizeLocal(
  value: string
) {
  return value.length
    ? value[0].toUpperCase() +
        value.slice(1)
    : value;
}

function nodeMeaning(
  word: string,
  axis: SymbolicAxis
) {
  const meanings: Record<
    SymbolicAxis,
    string
  > = {
    memory:
      `«${word}» actúa como un punto de retorno: una forma del texto que conserva tiempo y permanencia.`,

    desire:
      `«${word}» introduce dirección y movimiento: algo en el escrito avanza hacia esa presencia.`,

    wound:
      `«${word}» señala una zona de tensión, pérdida o resistencia dentro de la voz.`,

    matter:
      `«${word}» da cuerpo al territorio: convierte la experiencia del poema en materia sensible.`,
  };

  return meanings[axis];
}

function oracleForAxis(
  axis: SymbolicAxis
) {
  const values: Record<
    SymbolicAxis,
    string
  > = {
    memory:
      "Aquello que regresa no siempre desea ser recordado: a veces sólo busca una forma donde permanecer.",

    desire:
      "El territorio se abre en la dirección de aquello que todavía no ha sido alcanzado.",

    wound:
      "La grieta no interrumpe el mapa: es una de sus formas de orientación.",

    matter:
      "Lo que la voz no puede retener termina buscando refugio en las cosas.",
  };

  return values[axis];
}

function gestureForAxis(
  axis: SymbolicAxis
) {
  const values: Record<
    SymbolicAxis,
    string
  > = {
    memory:
      "Volver la cabeza una sola vez antes de abandonar el lugar.",

    desire:
      "Extender una mano hacia aquello que todavía queda fuera del mapa.",

    wound:
      "Dejar abierta la grieta sin intentar cubrirla.",

    matter:
      "Depositar una piedra en el centro y alejarse en silencio.",
  };

  return values[axis];
}

export function buildLocalCartography(
  poem: string
): SymbolicCartography {
  const fragments =
    localFragments(poem);

  const words =
    poem.match(
      /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{3,}/g
    ) ?? [];

  const frequencies =
    new Map<string, number>();

  for (const raw of words) {
    const word =
      normalizeLocalWord(raw);

    if (
      word.length < 4 ||
      LOCAL_STOPWORDS.has(word)
    ) {
      continue;
    }

    frequencies.set(
      word,
      (frequencies.get(word) ?? 0) + 1
    );
  }

  let candidates =
    [...frequencies.entries()]
      .sort(
        (a, b) =>
          b[1] - a[1] ||
          a[0].localeCompare(b[0])
      )
      .map(([word]) => word);

  if (candidates.length < 8) {
    for (const raw of words) {
      const word =
        normalizeLocalWord(raw);

      if (
        word.length < 3 ||
        LOCAL_STOPWORDS.has(word) ||
        candidates.includes(word)
      ) {
        continue;
      }

      candidates.push(word);

      if (candidates.length >= 8) {
        break;
      }
    }
  }

  const selected =
    candidates.slice(0, 8);

  const axes: SymbolicAxis[] = [
    "memory",
    "desire",
    "wound",
    "matter",
  ];

  const axisTotals =
    Object.fromEntries(
      axes.map((axis) => [
        axis,
        axisScoreForText(
          poem,
          axis
        ),
      ])
    ) as Record<
      SymbolicAxis,
      number
    >;

  const dominantAxis =
    [...axes].sort(
      (a, b) =>
        axisTotals[b] -
        axisTotals[a]
    )[0];

  const nodes: CartographyNode[] =
    selected.map(
      (word, index) => {
        const evidence =
          fragments.find(
            (fragment) =>
              fragment
                .toLocaleLowerCase("es")
                .includes(word)
          ) ??
          poem.slice(0, 140).trim();

        const axis =
          axisForText(evidence);

        const frequency =
          frequencies.get(word) ?? 1;

        const position =
          LOCAL_POSITIONS[
            index %
              LOCAL_POSITIONS.length
          ];

        return {
          id: `node-${index + 1}`,
          label:
            capitalizeLocal(word),
          axis,
          meaning:
            nodeMeaning(
              word,
              axis
            ),
          evidence: [evidence],
          intensity:
            Math.min(
              10,
              4 + frequency
            ),
          x: position.x,
          y: position.y,
          glyph:
            AXIS_GLYPHS[axis],
        };
      }
    );

  while (nodes.length < 6) {
    const index =
      nodes.length;

    const axis =
      axes[
        index %
          axes.length
      ];

    const evidence =
      fragments[
        index %
          Math.max(
            fragments.length,
            1
          )
      ] ??
      poem.slice(0, 120).trim();

    nodes.push({
      id: `node-${index + 1}`,
      label:
        [
          "Eco",
          "Umbral",
          "Rastro",
          "Pulso",
          "Retorno",
          "Materia",
        ][index] ??
        `Signo ${index + 1}`,
      axis,
      meaning:
        `Una concentración simbólica surgida de este fragmento del escrito.`,
      evidence: [evidence],
      intensity: 5,
      x:
        LOCAL_POSITIONS[
          index
        ].x,
      y:
        LOCAL_POSITIONS[
          index
        ].y,
      glyph:
        AXIS_GLYPHS[axis],
    });
  }

  const links: CartographyLink[] =
    [];

  for (
    let index = 0;
    index < nodes.length;
    index++
  ) {
    const next =
      (index + 1) %
      nodes.length;

    links.push({
      id: `route-${index + 1}`,
      from:
        nodes[index].id,
      to:
        nodes[next].id,
      relation:
        nodes[index].axis ===
        nodes[next].axis
          ? "resonancia"
          : "transición",
      strength:
        Math.max(
          3,
          Math.min(
            10,
            Math.round(
              (
                nodes[index]
                  .intensity +
                nodes[next]
                  .intensity
              ) /
                2
            )
          )
        ),
    });
  }

  if (nodes.length >= 6) {
    links.push(
      {
        id: "route-cross-1",
        from: nodes[0].id,
        to: nodes[3].id,
        relation:
          "tensión interior",
        strength: 7,
      },
      {
        id: "route-cross-2",
        from: nodes[1].id,
        to: nodes[5].id,
        relation:
          "eco subterráneo",
        strength: 6,
      }
    );
  }

  const zones: CartographyZone[] =
    [
      {
        id: "zone-memory",
        name:
          "Territorio de la memoria",
        meaning:
          "Zona donde el escrito conserva regresos, nombres y restos de tiempo.",
        shape: "ring",
        x: 27,
        y: 29,
        radius: 18,
      },
      {
        id: "zone-desire",
        name:
          "Territorio del deseo",
        meaning:
          "Zona de desplazamiento, búsqueda y llamada.",
        shape: "triangle",
        x: 70,
        y: 28,
        radius: 17,
      },
      {
        id: "zone-wound",
        name:
          "Territorio de la herida",
        meaning:
          "Zona donde la voz encuentra resistencia, ausencia o fractura.",
        shape: "fortress",
        x: 30,
        y: 70,
        radius: 16,
      },
      {
        id: "zone-matter",
        name:
          "Territorio de la materia",
        meaning:
          "Zona donde cuerpo, objetos y paisaje sostienen el sentido.",
        shape: "circle",
        x: 71,
        y: 69,
        radius: 18,
      },
    ];

  const centralNode =
    nodes
      .slice()
      .sort(
        (a, b) =>
          b.intensity -
          a.intensity
      )[0];

  const nucleus =
    centralNode?.evidence[0] ??
    fragments[0] ??
    poem.slice(0, 160);

  const secretBase =
    centralNode?.label ??
    "territorio";

  const matterNode =
    nodes.find(
      (node) =>
        node.axis === "matter"
    );

  return {
    secretTitle:
      `Cartografía de ${secretBase}`,
    centralSymbol:
      centralNode?.glyph ?? "✦",
    nucleus,
    oraclePhrase:
      oracleForAxis(
        dominantAxis
      ),
    relic:
      matterNode
        ? `Una forma de ${matterNode.label.toLocaleLowerCase("es")} conservada como reliquia del mapa.`
        : "Una piedra pequeña que conserva una palabra del escrito.",
    finalGesture:
      gestureForAxis(
        dominantAxis
      ),
    dominantAxis,
    nodes,
    links,
    zones,
  };
}
