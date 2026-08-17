import type {
  SymbolFamily,
} from "./symbolic-contract";

export type SymbolAtlasEntry = {
  name: string;
  family: SymbolFamily;
  materials: string[];
  actions: string[];
  polarities: string[];
  affinities: string[];
  tensions: string[];
  readingPrinciple: string;
};

export const SYMBOL_ATLAS:
  SymbolAtlasEntry[] = [
  {
    name: "agua",
    family: "element",
    materials: ["líquido", "lluvia", "río", "mar"],
    actions: ["disolver", "reflejar", "arrastrar", "purificar"],
    polarities: ["vida / desaparición", "movimiento / estancamiento"],
    affinities: ["espejo", "luna", "barca", "pez", "memoria"],
    tensions: ["piedra", "sequedad", "fijación"],
    readingPrinciple:
      "Su función depende de si fluye, ahoga, refleja, limpia o permanece inmóvil.",
  },
  {
    name: "árbol",
    family: "plant",
    materials: ["madera", "corteza", "raíz", "rama"],
    actions: ["crecer", "unir", "dar fruto", "arder"],
    polarities: ["cielo / tierra", "vida / tala"],
    affinities: ["semilla", "pájaro", "casa", "genealogía"],
    tensions: ["hacha", "incendio", "desarraigo"],
    readingPrinciple:
      "Debe leerse atendiendo a raíces, heridas, frutos, sequedad y posición en el paisaje.",
  },
  {
    name: "casa",
    family: "house",
    materials: ["muro", "techo", "habitación", "umbral"],
    actions: ["proteger", "encerrar", "recordar", "alojar"],
    polarities: ["refugio / prisión", "interior / exterior"],
    affinities: ["madre", "cuerpo", "ventana", "puerta"],
    tensions: ["ruina", "exilio", "intemperie"],
    readingPrinciple:
      "No equivale siempre a hogar: puede organizar pertenencia, encierro o memoria.",
  },
  {
    name: "espejo",
    family: "object",
    materials: ["vidrio", "metal pulido", "agua"],
    actions: ["reflejar", "duplicar", "invertir", "devolver"],
    polarities: ["identidad / extrañamiento", "verdad / ilusión"],
    affinities: ["ojo", "doble", "agua", "rostro"],
    tensions: ["oscuridad", "rotura", "opacidad"],
    readingPrinciple:
      "Debe observarse qué devuelve, qué deforma y quién evita mirarlo.",
  },
  {
    name: "puerta",
    family: "house",
    materials: ["madera", "piedra", "metal"],
    actions: ["abrir", "cerrar", "atravesar", "impedir"],
    polarities: ["entrada / expulsión", "posibilidad / límite"],
    affinities: ["llave", "camino", "casa", "umbral"],
    tensions: ["muro", "cerrojo", "regreso imposible"],
    readingPrinciple:
      "Importa si se abre, permanece cerrada o transforma a quien la cruza.",
  },
  {
    name: "laberinto",
    family: "journey",
    materials: ["muro", "sendero", "piedra"],
    actions: ["desorientar", "probar", "conducir", "devolver"],
    polarities: ["búsqueda / pérdida", "centro / periferia"],
    affinities: ["hilo", "monstruo", "puerta", "centro"],
    tensions: ["mapa", "línea recta", "salida"],
    readingPrinciple:
      "Su sentido nace del recorrido, el centro y la posibilidad o imposibilidad de retorno.",
  },
  {
    name: "hueso",
    family: "body",
    materials: ["cal", "resto", "estructura"],
    actions: ["sostener", "permanecer", "ser enterrado", "reaparecer"],
    polarities: ["muerte / permanencia", "fragilidad / estructura"],
    affinities: ["tierra", "animal", "memoria", "reliquia"],
    tensions: ["carne", "olvido", "descomposición"],
    readingPrinciple:
      "Puede funcionar como resto, fundamento, memoria corporal o promesa de regreso.",
  },
  {
    name: "sombra",
    family: "spirit",
    materials: ["oscuridad", "silueta", "mancha"],
    actions: ["seguir", "ocultar", "duplicar", "preceder"],
    polarities: ["presencia / ausencia", "protección / amenaza"],
    affinities: ["noche", "doble", "cuerpo", "luz"],
    tensions: ["mediodía", "revelación", "rostro"],
    readingPrinciple:
      "Debe distinguirse entre sombra física, ausencia, doble y contenido rechazado.",
  },
  {
    name: "perro",
    family: "animal",
    materials: ["pelo", "hueso", "aliento"],
    actions: ["acompañar", "guardar", "seguir", "regresar"],
    polarities: ["fidelidad / abandono", "guía / amenaza"],
    affinities: ["camino", "casa", "tumba", "niño"],
    tensions: ["exilio", "cadena", "olvido"],
    readingPrinciple:
      "Puede ser compañero, guardián del umbral, memoria afectiva o criatura abandonada.",
  },
  {
    name: "piedra",
    family: "element",
    materials: ["mineral", "roca", "polvo"],
    actions: ["pesar", "cerrar", "resistir", "marcar"],
    polarities: ["permanencia / esterilidad", "fundamento / obstáculo"],
    affinities: ["montaña", "tumba", "puerta", "círculo"],
    tensions: ["agua", "semilla", "carne"],
    readingPrinciple:
      "Su sentido cambia según funcione como fundamento, carga, tumba, umbral o centro.",
  },
  {
    name: "fuego",
    family: "element",
    materials: ["llama", "humo", "ceniza"],
    actions: ["transformar", "destruir", "purificar", "iluminar"],
    polarities: ["vida / devastación", "revelación / consumo"],
    affinities: ["sol", "hogar", "ceniza", "sacrificio"],
    tensions: ["agua", "hielo", "oscuridad"],
    readingPrinciple:
      "Debe leerse por aquello que consume y por lo que deja después.",
  },
  {
    name: "ventana",
    family: "house",
    materials: ["vidrio", "marco", "luz"],
    actions: ["mirar", "separar", "permitir", "encuadrar"],
    polarities: ["apertura / frontera", "visión / imposibilidad"],
    affinities: ["ojo", "casa", "cielo", "espejo"],
    tensions: ["muro", "cortina", "ceguera"],
    readingPrinciple:
      "Puede permitir contemplar el exterior mientras impide tocarlo.",
  },
];
