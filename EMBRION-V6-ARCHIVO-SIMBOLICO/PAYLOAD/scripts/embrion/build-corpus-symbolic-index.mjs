import fs from "node:fs";
import path from "node:path";

const inputRoot = path.resolve(process.argv[2] ?? "tmp/corpus_text");
const outputFile = path.resolve(
  process.argv[3] ?? "lib/embrion/corpus-symbolic-index.ts",
);

const SOURCES = [
  { id: "chevalier", file: "pdf-1.txt", kind: "teoria", weight: 0.8 },
  { id: "cirlot", file: "pdf-2.txt", kind: "teoria", weight: 1.2 },
  { id: "casares", file: "pdf-3.txt", kind: "teoria", weight: 0.9 },
  { id: "bachelard", file: "pdf-4.txt", kind: "teoria", weight: 1.15 },
  { id: "mitos", file: "pdf-5.txt", kind: "teoria", weight: 1.0 },
  { id: "jerarquia", file: "pdf-6.txt", kind: "literatura", weight: 1.05 },
  { id: "rodari", file: "pdf-7.txt", kind: "operador", weight: 1.0 },
  { id: "bielka", file: "docx-1.txt", kind: "literatura", weight: 1.05 },
  { id: "mariposas", file: "docx-2.txt", kind: "literatura", weight: 1.0 },
  { id: "no_dejes", file: "docx-3.txt", kind: "literatura", weight: 1.05 },
];

const STOPWORDS = new Set(`
aber acerca ahi ahora al algo algun alguna algunas alguno algunos alla alli ambos ante antes aquel aquella aquellas aquello aquellos aqui asi aun aunque bajo bastante bien cada casi como con contra cual cuales cualquier cuando cuanto cuya cuyo de del desde donde dos durante e el ella ellas ello ellos en entre era erais eran eras eres es esa esas ese eso esos esta estaba estaban estado estamos estan estar estas este esto estos fue fuera fueron ha habia habian haber hace hacia hay he hemos hizo hoy la las le les lo los mas me mi mientras muy nada ni no nos nosotros nunca o otra otras otro otros para pero poco por porque que quien quienes se sea sean ser si sido siempre sin sobre solo son su sus tal tambien tan tanto te tenia tienen toda todas todo todos tras tu un una unas uno unos usted ustedes ya yo
dijo dicen decir dijo habia había habia hace hacer hicieron puede pueden podia podía querer quiere quiso sabe sabia sabía ver vio visto dar dio dado ir iba fueron venir vino llegar llego llegó pasar paso pasó quedar quedo quedó tener tenia tenía tomar tomo tomó poner puso parecer parecia parecía encontrar encontro encontró dejar dejo dejó volver volvio volvió sentir sintio sintió mirar miro miró hablar hablo habló pensar penso pensó saber supo seguir siguio siguió comenzar comenzo comenzó empezar empezo empezó llamar llamo llamó llevar llevo llevó quedar entonces despues después mismo misma mismos mismas mucho mucha muchos muchas menos mayor mejor vez veces manera forma parte lugar momento dia día noche hombre mujer personas persona cosa cosas mundo vida tiempo
capitulo capítulo prologo prólogo epilogo epílogo pagina página editorial edicion edición copyright isbn libro obra autor autores traduccion traducción
abierto abrió acercó adán alguien alrededor ano años aparece apareció apoyó atrás atención cayó cerca cierto claro com común continuó cuatro cuenta debajo debe delante demasiado detrás días dice dicho entró existe expresión falta fin final fondo frente general gran grande gritó hacerlo han has hasta hecho hombres igual incluso intentó joven juego junto lado lejos levantó lleva llevaba mal manos mañana medio nadie ningún ninguna niña niños nombres nuestro nuevo objetos parece pecho pequeña pequeño podemos pregunta preguntó primer primera primero puedo pues puesto punto queda quería quiero quizá razón regresó relación respuesta salir seguía según segunda segundo será siendo siete significa significado sigue siguiente silla sim sino sola tarde tampoco tengo tiene tienes tocó todavía trabajo varias varios vista voces
`.trim().split(/\s+/).map(normalize));

const SEEDS = `
agua mar río lluvia pozo fuente lago isla orilla marea ola naufragio barco barca faro sal espuma
fuego llama incendio humo ceniza carbón rescoldo luz sombra oscuridad noche amanecer sol luna estrella
tierra barro piedra montaña bosque árbol raíz rama hoja semilla flor jardín campo cueva abismo cielo aire viento nube niebla
cuerpo carne piel sangre hueso corazón boca ojo mano pie rostro vientre herida cicatriz respiración hambre sed deseo miedo dolor placer sueño
madre padre hijo hija hermano familia niño infancia nacimiento muerte duelo cadáver tumba ausencia desaparición memoria olvido recuerdo nombre voz silencio grito eco
casa habitación puerta ventana llave muro techo escalera pasillo corredor umbral frontera puente camino carretera viaje exilio regreso huida deriva
ciudad calle plaza edificio metro estación ruina máquina motor hierro metal vidrio reloj código laberinto mapa centro periferia
animal perro lobo pájaro caballo pez serpiente toro minotauro mariposa insecto ala pluma huella rastro
papel libro cuaderno carta tinta palabra poema frase lengua idioma signo símbolo espejo máscara doble hilo tela vestido pan harina leche cocina mesa cuchillo
amor soledad intimidad identidad patria guerra violencia poder sacrificio culpa perdón fe dios alma espíritu ritual mito leyenda destino azar secreto verdad mentira
transformación metamorfosis nacimiento germen crisálida materia forma color blanco negro rojo verde azul oro plata círculo espiral cruz torre corona
profundidad superficie reflejo transparencia disolución corriente inmersión purificación fertilidad origen retorno tránsito eternidad instante duración repetición ruptura
archivo reliquia testigo resto polvo fragmento marca señal grieta costura nudo red constelación genealogía jerarquía hambre bielka atlas mara iván lev nadir maría alejandro
`.trim().split(/\s+/).map(normalize);

const MATERIALS = new Set(`
agua sal espuma limo barro tierra arcilla arena grava piedra roca cal polvo ceniza carbón hollín humo fuego cera madera corteza resina savia papel tinta hilo tela seda lana fieltro vidrio cristal hierro metal cobre plomo oro plata óxido aceite sangre piel carne hueso pelo saliva leche harina pan miel nieve hielo vaho aire niebla lluvia alga musgo polen pluma escama
`.trim().split(/\s+/).map(normalize));

const SYMBOLS = new Set(`
agua mar pozo fuente isla barca barco faro fuego llama sol luna estrella árbol bosque raíz rama semilla flor montaña cueva abismo cielo nube viento tierra piedra cuerpo corazón ojo mano boca sangre hueso madre padre niño casa habitación puerta ventana llave muro escalera umbral frontera puente camino ciudad torre laberinto mapa centro círculo espiral cruz corona animal perro lobo pájaro caballo pez serpiente toro minotauro mariposa ala espejo máscara doble sombra luz reloj rueda anillo libro cuaderno carta hilo nudo red pan mesa cuchillo tumba cadáver fantasma alma dios ritual sacrificio jardín río lluvia
`.trim().split(/\s+/).map(normalize));

const ABSTRACTS = new Set(`
amor muerte memoria olvido ausencia presencia hambre deseo miedo dolor placer soledad intimidad identidad patria guerra violencia poder culpa perdón fe destino azar secreto verdad mentira origen retorno tránsito eternidad tiempo instante duración repetición ruptura transformación metamorfosis libertad obediencia cuidado pérdida exilio silencio voz sueño vigilia realidad imaginación historia futuro pasado fragilidad permanencia desaparición pertenencia distancia espera
`.trim().split(/\s+/).map(normalize));

const ADDITIONAL_NODES = new Set(`
brazo cabeza criatura espacio figura fuerza idea imagen objeto pared pecho plano pregunta razón relación respuesta sentido sonido suelo valor
color blanco negro rojo verde azul línea punto fondo final principio orden caos frío calor exposición prohibición alimento obediencia cuidado permanencia fragilidad multitud individuo
`.trim().split(/\s+/).map(normalize));

const HABITAT_SEEDS = {
  deriva: new Set("agua mar río lluvia pozo lago isla orilla marea ola barco barca faro aire viento nube niebla camino viaje exilio huida deriva distancia frontera".split(" ").map(normalize)),
  pulso: new Set("cuerpo carne piel sangre hueso corazón boca ojo mano pie vientre herida hambre sed deseo madre padre hijo niño animal perro caballo placer respiración".split(" ").map(normalize)),
  fractura: new Set("fuego incendio humo ceniza carbón herida cicatriz ruptura guerra violencia miedo dolor ruina grieta cuchillo sacrificio culpa desaparición".split(" ").map(normalize)),
  espectral: new Set("muerte duelo cadáver tumba ausencia sombra oscuridad noche luz estrella alma espíritu fantasma voz silencio grito eco sueño olvido".split(" ").map(normalize)),
  maquina: new Set("ciudad calle edificio metro estación máquina motor hierro metal vidrio reloj código sistema red jerarquía repetición".split(" ").map(normalize)),
  memoria: new Set("memoria recuerdo nombre casa habitación puerta llave tierra árbol raíz libro cuaderno carta papel tinta archivo reliquia testigo origen tiempo".split(" ").map(normalize)),
};

const OPPOSITIONS = `
vida|muerte
presencia|ausencia
memoria|olvido
luz|sombra
fuego|agua
superficie|profundidad
origen|exilio
regreso|pérdida
cuerpo|espíritu
carne|fantasma
voz|silencio
hambre|alimento
deseo|prohibición
cuidado|violencia
refugio|trampa
dentro|fuera
centro|periferia
camino|laberinto
movimiento|inmovilidad
fragilidad|permanencia
individuo|multitud
intimidad|exposición
verdad|mentira
fe|duda
culpa|perdón
nacimiento|desaparición
libertad|obediencia
azar|destino
realidad|imaginación
pasado|futuro
humano|animal
naturaleza|máquina
calor|frío
blanco|negro
orden|caos
palabra|materia
forma|disolución
`.trim().split("\n").map((line) => line.split("|").map(normalize));

function normalize(value) {
  return value
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zñ]/g, "")
    .trim();
}

function tokenize(text) {
  return text.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{3,}/g) ?? [];
}

function isUseful(token) {
  const key = normalize(token);
  if (!key || key.length < 3 || key.length > 24) return false;
  if (STOPWORDS.has(key)) return false;
  if (/^(.)\1{2,}/.test(key)) return false;
  return true;
}

function topEntries(map, limit) {
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

function union(values) {
  return [...new Set(values)];
}

function displayTerm(key, displayMaps) {
  const candidates = new Map();
  for (const displayMap of displayMaps) {
    const local = displayMap.get(key);
    if (!local) continue;
    for (const [value, count] of local) {
      candidates.set(value, (candidates.get(value) ?? 0) + count);
    }
  }
  return topEntries(candidates, 1)[0]?.[0] ?? key;
}

function sourceList(bySource, limit = 3) {
  return topEntries(bySource, limit).map(([id]) => id);
}

function relationConfidence(count, diversity) {
  return Math.min(0.94, 0.42 + Math.log1p(count) * 0.075 + diversity * 0.045);
}

const corpora = SOURCES.map((source) => {
  const filePath = path.join(inputRoot, source.file);
  if (!fs.existsSync(filePath)) throw new Error(`Falta la fuente extraída: ${filePath}`);
  const raw = fs.readFileSync(filePath, "utf8");
  const originalTokens = tokenize(raw);
  const tokens = [];
  const counts = new Map();
  const displays = new Map();

  for (const original of originalTokens) {
    if (!isUseful(original)) continue;
    const key = normalize(original);
    tokens.push(key);
    counts.set(key, (counts.get(key) ?? 0) + 1);
    if (!displays.has(key)) displays.set(key, new Map());
    const lower = original.toLocaleLowerCase("es");
    displays.get(key).set(lower, (displays.get(key).get(lower) ?? 0) + 1);
  }

  return { ...source, rawWordCount: originalTokens.length, tokens, counts, displays };
});

const globalCounts = new Map();
const sourcePresence = new Map();
for (const corpus of corpora) {
  for (const [token, count] of corpus.counts) {
    globalCounts.set(token, (globalCounts.get(token) ?? 0) + count);
    sourcePresence.set(token, (sourcePresence.get(token) ?? 0) + 1);
  }
}

const seedSet = new Set(SEEDS);
const rankedVocabulary = [...globalCounts.keys()]
  .filter((token) => {
    const count = globalCounts.get(token) ?? 0;
    const diversity = sourcePresence.get(token) ?? 0;
    return seedSet.has(token) || count >= 12 || diversity >= 3;
  })
  .map((token) => {
    const count = globalCounts.get(token) ?? 0;
    const diversity = sourcePresence.get(token) ?? 0;
    const symbolicBonus = seedSet.has(token) ? 17 : 0;
    const classBonus = MATERIALS.has(token) || SYMBOLS.has(token) || ABSTRACTS.has(token) ? 6 : 0;
    return {
      token,
      score: Math.log1p(count) * (1 + diversity * 0.16) + symbolicBonus + classBonus,
    };
  })
  .sort((a, b) => b.score - a.score);

const GRAPH_TERMS = 650;
const TARGET_NODES = 360;
const vocabulary = new Set(rankedVocabulary.slice(0, GRAPH_TERMS).map((item) => item.token));

function singularCandidate(token) {
  if (token.endsWith("ces") && token.length > 5) return `${token.slice(0, -3)}z`;
  if (token.endsWith("es") && token.length > 6) return token.slice(0, -2);
  if (token.endsWith("s") && token.length > 4) return token.slice(0, -1);
  return token;
}

function isNarrativeVerb(token) {
  if (SEEDS.includes(token) || ADDITIONAL_NODES.has(token)) return false;
  return /(?:aba|abas|aban|aron|ieron|ando|iendo|ado|ido|aste|iste|emos|amos|ías|ian|ían|ara|iera|ó)$/.test(token);
}

const preferredNodeTokens = rankedVocabulary
  .map((item) => item.token)
  .filter((token) => vocabulary.has(token))
  .filter((token) => {
    const classified =
      seedSet.has(token) ||
      MATERIALS.has(token) ||
      SYMBOLS.has(token) ||
      ABSTRACTS.has(token) ||
      ADDITIONAL_NODES.has(token);
    return classified && !isNarrativeVerb(token);
  });

const nodeTokens = [];
const nodeTokenSet = new Set();
for (const token of preferredNodeTokens) {
  const singular = singularCandidate(token);
  if (singular !== token && vocabulary.has(singular)) continue;
  if (nodeTokenSet.has(token)) continue;
  nodeTokenSet.add(token);
  nodeTokens.push(token);
  if (nodeTokens.length >= TARGET_NODES) break;
}

const nodeSources = new Map();
const pairGraph = new Map();
for (const token of vocabulary) {
  nodeSources.set(token, new Map());
  pairGraph.set(token, new Map());
}

for (const corpus of corpora) {
  for (const token of vocabulary) {
    const count = corpus.counts.get(token) ?? 0;
    if (count) nodeSources.get(token).set(corpus.id, count);
  }

  const filtered = corpus.tokens.filter((token) => vocabulary.has(token));
  for (let index = 0; index < filtered.length; index += 1) {
    const left = filtered[index];
    const seen = new Set();
    for (let offset = 1; offset <= 9 && index + offset < filtered.length; offset += 1) {
      const right = filtered[index + offset];
      if (left === right || seen.has(right)) continue;
      seen.add(right);
      const increment = corpus.weight / Math.sqrt(offset);

      for (const [from, to] of [[left, right], [right, left]]) {
        const graph = pairGraph.get(from);
        if (!graph.has(to)) graph.set(to, { score: 0, count: 0, bySource: new Map() });
        const edge = graph.get(to);
        edge.score += increment;
        edge.count += 1;
        edge.bySource.set(corpus.id, (edge.bySource.get(corpus.id) ?? 0) + 1);
      }
    }
  }
}

function topRelated(token, predicate, limit, excluded = new Set()) {
  const graph = pairGraph.get(token) ?? new Map();
  return [...graph.entries()]
    .filter(([candidate]) => candidate !== token && !excluded.has(candidate) && predicate(candidate))
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, limit);
}

function relationRecord(value, kind, edge, extraSourceIds = []) {
  const ids = union([...sourceList(edge?.bySource ?? new Map()), ...extraSourceIds]).slice(0, 4);
  const count = edge?.count ?? 1;
  return {
    value,
    kind,
    sourceIds: ids,
    count,
    confidence: Number(relationConfidence(count, ids.length).toFixed(2)),
  };
}

function habitatFor(token) {
  for (const [habitat, terms] of Object.entries(HABITAT_SEEDS)) {
    if (terms.has(token)) return habitat;
  }

  const scores = Object.fromEntries(Object.keys(HABITAT_SEEDS).map((key) => [key, 0]));
  for (const [candidate, edge] of topRelated(token, () => true, 24)) {
    for (const [habitat, terms] of Object.entries(HABITAT_SEEDS)) {
      if (terms.has(candidate)) scores[habitat] += edge.score;
    }
  }
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "memoria";
}

const displayMaps = corpora.map((corpus) => corpus.displays);
const nodes = [];
for (const token of nodeTokens) {
  const excluded = new Set([token]);
  const general = topRelated(
    token,
    (candidate) =>
      nodeTokenSet.has(candidate) &&
      !MATERIALS.has(candidate) &&
      !/(?:ar|er|ir)$/.test(candidate) &&
      !isNarrativeVerb(candidate),
    12,
    excluded,
  );
  const symbols = topRelated(token, (candidate) => SYMBOLS.has(candidate), 8, excluded);
  const materials = topRelated(token, (candidate) => MATERIALS.has(candidate), 8, excluded);
  const verbs = topRelated(token, (candidate) => /(?:ar|er|ir)$/.test(candidate), 8, excluded);
  const abstract = topRelated(token, (candidate) => ABSTRACTS.has(candidate), 12, excluded);

  const relations = [];
  general.slice(0, 8).forEach(([candidate, edge]) => {
    relations.push(relationRecord(displayTerm(candidate, displayMaps), "palabra", edge));
  });
  symbols.slice(0, 7).forEach(([candidate, edge]) => {
    relations.push(relationRecord(displayTerm(candidate, displayMaps), "símbolo", edge));
  });
  materials.slice(0, 7).forEach(([candidate, edge]) => {
    relations.push(relationRecord(displayTerm(candidate, displayMaps), "materia", edge));
  });
  verbs.slice(0, 7).forEach(([candidate, edge]) => {
    relations.push(relationRecord(displayTerm(candidate, displayMaps), "verbo", edge));
  });

  const imageCandidates = [];
  const seenImageTerms = new Set();
  for (const pair of [...symbols, ...abstract, ...general]) {
    if (seenImageTerms.has(pair[0])) continue;
    seenImageTerms.add(pair[0]);
    imageCandidates.push(pair);
    if (imageCandidates.length >= 6) break;
  }
  imageCandidates.forEach(([candidate, edge], index) => {
    const material = materials
      .map(([value]) => value)
      .find((value, candidateIndex) =>
        candidateIndex >= index % Math.max(1, materials.length) &&
        value !== candidate &&
        value !== token,
      ) ?? materials.map(([value]) => value).find((value) => value !== candidate && value !== token);
    const symbol = symbols
      .map(([value]) => value)
      .find((value) => value !== candidate && value !== token);
    const candidateDisplay = displayTerm(candidate, displayMaps);
    const secondDisplay = displayTerm(material ?? symbol ?? token, displayMaps);
    const templates = [
      `${candidateDisplay} bajo ${secondDisplay}`,
      `${candidateDisplay} dentro de ${secondDisplay}`,
      `la sombra de ${candidateDisplay} sobre ${secondDisplay}`,
      `${secondDisplay} alrededor de ${candidateDisplay}`,
      `${candidateDisplay} atravesando ${secondDisplay}`,
      `${candidateDisplay} después de ${secondDisplay}`,
    ];
    const extraEdge = pairGraph.get(token)?.get(material ?? symbol ?? token);
    relations.push(
      relationRecord(
        templates[index % templates.length],
        "imagen",
        edge,
        sourceList(extraEdge?.bySource ?? new Map()),
      ),
    );
  });

  const tensionScores = OPPOSITIONS.map(([left, right]) => {
    const leftEdge = pairGraph.get(token)?.get(left);
    const rightEdge = pairGraph.get(token)?.get(right);
    return {
      left,
      right,
      score: (leftEdge?.score ?? 0) + (rightEdge?.score ?? 0),
      count: (leftEdge?.count ?? 0) + (rightEdge?.count ?? 0),
      bySource: new Map([
        ...[...(leftEdge?.bySource ?? new Map())],
        ...[...(rightEdge?.bySource ?? new Map())],
      ]),
    };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  tensionScores.forEach((item) => {
    relations.push(
      relationRecord(
        `${displayTerm(item.left, displayMaps)} / ${displayTerm(item.right, displayMaps)}`,
        "tensión",
        item,
      ),
    );
  });

  if (tensionScores.length < 4) {
    for (let index = tensionScores.length; index < 4; index += 1) {
      const left = abstract[index % Math.max(1, abstract.length)];
      const right = abstract[(index + 3) % Math.max(1, abstract.length)];
      if (!left || !right || left[0] === right[0]) continue;
      relations.push(
        relationRecord(
          `${displayTerm(left[0], displayMaps)} / ${displayTerm(right[0], displayMaps)}`,
          "tensión",
          left[1],
          sourceList(right[1].bySource),
        ),
      );
    }
  }

  const uniqueRelations = [];
  const seenRelations = new Set();
  for (const relation of relations) {
    const key = `${relation.kind}:${normalize(relation.value)}`;
    if (seenRelations.has(key) || !relation.value.trim()) continue;
    seenRelations.add(key);
    uniqueRelations.push(relation);
  }

  const related = topRelated(token, (candidate) => nodeTokenSet.has(candidate), 10)
    .map(([candidate]) => candidate);
  const sourceIds = sourceList(nodeSources.get(token), 6);
  nodes.push({
    id: token,
    label: displayTerm(token, displayMaps),
    habitat: habitatFor(token),
    sourceIds,
    related,
    relations: uniqueRelations,
  });
}

nodes.sort((a, b) => a.label.localeCompare(b.label, "es"));

const sourceRelationCoverage = Object.fromEntries(
  SOURCES.map((source) => [
    source.id,
    nodes.reduce(
      (total, node) =>
        total +
        node.relations.filter((relation) =>
          relation.sourceIds.includes(source.id),
        ).length,
      0,
    ),
  ]),
);

const stats = {
  sourceCount: SOURCES.length,
  rawWordCount: corpora.reduce((total, corpus) => total + corpus.rawWordCount, 0),
  indexedWordCount: corpora.reduce((total, corpus) => total + corpus.tokens.length, 0),
  nodeCount: nodes.length,
  relationCount: nodes.reduce((total, node) => total + node.relations.length, 0),
  sourceRelationCoverage,
  generatedAt: new Date().toISOString(),
  method: "coaparición ponderada en ventana de nueve términos; imágenes y tensiones marcadas como síntesis computacional",
};

const sourceStats = SOURCES.map((source) => {
  const corpus = corpora.find((item) => item.id === source.id);
  return {
    id: source.id,
    kind: source.kind,
    rawWordCount: corpus?.rawWordCount ?? 0,
    indexedWordCount: corpus?.tokens.length ?? 0,
  };
});

const output = `/* Archivo generado por scripts/embrion/build-corpus-symbolic-index.mjs.\n * No contiene citas ni textos fuente: solo relaciones derivadas y procedencia. */\n\nexport type CorpusRelationKind = "palabra" | "símbolo" | "imagen" | "materia" | "verbo" | "tensión";\nexport type CorpusRelation = { value: string; kind: CorpusRelationKind; sourceIds: string[]; count: number; confidence: number };\nexport type CorpusSymbolicNode = { id: string; label: string; habitat: "deriva" | "pulso" | "fractura" | "espectral" | "maquina" | "memoria"; sourceIds: string[]; related: string[]; relations: CorpusRelation[] };\n\nexport const CORPUS_INDEX_STATS = ${JSON.stringify(stats, null, 2)} as const;\n\nexport const CORPUS_SOURCE_STATS = ${JSON.stringify(sourceStats, null, 2)} as const;\n\nexport const CORPUS_SYMBOLIC_NODES: CorpusSymbolicNode[] = ${JSON.stringify(nodes)};\n`;

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, output, "utf8");
console.log(JSON.stringify(stats, null, 2));
