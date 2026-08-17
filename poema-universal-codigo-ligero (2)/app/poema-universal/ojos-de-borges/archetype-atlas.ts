import type {
  ArchetypeKey,
} from "./symbolic-contract";

export type ArchetypeAtlasEntry = {
  key: ArchetypeKey;
  name: string;
  centralFunction: string;
  luminousPole: string;
  shadowPole: string;
  frequentImages: string[];
  ethicalCaution: string;
};

export const ARCHETYPE_ATLAS:
  ArchetypeAtlasEntry[] = [
  {
    key: "shadow",
    name: "Sombra",
    centralFunction:
      "Aquello rechazado, proyectado o todavía no reconocido como propio.",
    luminousPole:
      "Vitalidad recuperada, verdad reprimida, ampliación de la conciencia.",
    shadowPole:
      "Persecución, demonización del otro, repetición inconsciente.",
    frequentImages: [
      "oscuridad",
      "doble",
      "animal temido",
      "sótano",
      "figura sin rostro",
      "mancha",
    ],
    ethicalCaution:
      "No debe confundirse con maldad ni convertirse en diagnóstico del autor.",
  },
  {
    key: "persona",
    name: "Persona",
    centralFunction:
      "La identidad social, el papel, la máscara y la forma de presentarse ante el mundo.",
    luminousPole:
      "Adaptación, lenguaje compartido, pertenencia.",
    shadowPole:
      "Rigidez, impostura, identificación total con el papel.",
    frequentImages: [
      "máscara",
      "uniforme",
      "nombre",
      "escenario",
      "rostro",
      "ropa",
    ],
    ethicalCaution:
      "Debe leerse como función literaria, no como falsedad personal.",
  },
  {
    key: "child",
    name: "Niño",
    centralFunction:
      "Potencial vulnerable, comienzo, futuro todavía no realizado.",
    luminousPole:
      "Renovación, juego, posibilidad, nacimiento.",
    shadowPole:
      "Desamparo, regresión, impotencia o idealización.",
    frequentImages: [
      "semilla",
      "animal pequeño",
      "juguete",
      "nombre olvidado",
      "luz mínima",
      "recién nacido",
    ],
    ethicalCaution:
      "No debe reducirse a infancia biográfica.",
  },
  {
    key: "mother",
    name: "Madre",
    centralFunction:
      "Origen, matriz, alimento, tierra, refugio y retorno.",
    luminousPole:
      "Cuidado, fertilidad, pertenencia, cobijo.",
    shadowPole:
      "Absorción, encierro, dependencia o devoración.",
    frequentImages: [
      "casa",
      "cueva",
      "mar",
      "tierra",
      "jardín",
      "recipiente",
    ],
    ethicalCaution:
      "No equivale automáticamente a la madre real del autor.",
  },
  {
    key: "hero",
    name: "Héroe",
    centralFunction:
      "La conciencia que abandona un estado conocido y atraviesa una prueba transformadora.",
    luminousPole:
      "Coraje, diferenciación, responsabilidad.",
    shadowPole:
      "Inflación, conquista, violencia o incapacidad para regresar.",
    frequentImages: [
      "camino",
      "prueba",
      "herida",
      "arma",
      "montaña",
      "regreso",
    ],
    ethicalCaution:
      "No debe convertir todo conflicto en victoria.",
  },
  {
    key: "wise-elder",
    name: "Anciano sabio",
    centralFunction:
      "Orientación, transmisión, pregunta justa y conocimiento de los ciclos.",
    luminousPole:
      "Discernimiento, memoria, consejo.",
    shadowPole:
      "Dogma, petrificación o autoridad sin vida.",
    frequentImages: [
      "libro",
      "lámpara",
      "llave",
      "ermitaño",
      "biblioteca",
      "voz antigua",
    ],
    ethicalCaution:
      "La sabiduría puede presentarse también como silencio o duda.",
  },
  {
    key: "anima-animus",
    name: "Ánima / Ánimus",
    centralFunction:
      "Figura mediadora entre conciencia e inconsciente, deseo e imaginación.",
    luminousPole:
      "Relación interior, inspiración, sensibilidad y mediación.",
    shadowPole:
      "Fascinación, proyección, idealización o posesión.",
    frequentImages: [
      "guía",
      "desconocido amado",
      "músico",
      "figura acuática",
      "mensajero",
      "voz interior",
    ],
    ethicalCaution:
      "No debe imponerse una lectura binaria de género.",
  },
  {
    key: "trickster",
    name: "Trickster",
    centralFunction:
      "La fuerza que desordena, invierte y abre posibilidades inesperadas.",
    luminousPole:
      "Creatividad, humor, ruptura de sistemas rígidos.",
    shadowPole:
      "Engaño, caos estéril, irresponsabilidad.",
    frequentImages: [
      "ladrón",
      "bufón",
      "zorro",
      "accidente",
      "error",
      "inversión",
    ],
    ethicalCaution:
      "No todo desorden es transformación.",
  },
  {
    key: "self",
    name: "Sí-mismo",
    centralFunction:
      "La imagen reguladora de una totalidad que intenta reunir contrarios.",
    luminousPole:
      "Integración, centro, relación entre partes opuestas.",
    shadowPole:
      "Grandiosidad, falsa totalidad o cierre prematuro.",
    frequentImages: [
      "mandala",
      "círculo",
      "piedra",
      "árbol central",
      "cuatro direcciones",
      "ciudad cuadrada",
    ],
    ethicalCaution:
      "No significa que el conflicto esté resuelto.",
  },
];

export function getArchetype(
  key: ArchetypeKey
) {
  return ARCHETYPE_ATLAS.find(
    (entry) => entry.key === key
  );
}
