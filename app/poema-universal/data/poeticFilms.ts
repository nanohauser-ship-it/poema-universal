export type PoeticFilmPoem = {
  id?: string;
  poetName: string;
  title: string;
};

export type PoeticFilm = {
  id: string;
  frames: string[];
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

const EL_HUERTO: PoeticFilm = {
  id: "el-huerto",
  frames: [
    "/poema-universal/films/el-huerto/01-abrazo.png",
    "/poema-universal/films/el-huerto/02-se-va.png",
    "/poema-universal/films/el-huerto/03-entierro.png",
    "/poema-universal/films/el-huerto/04-memoria-enterrada.png",
    "/poema-universal/films/el-huerto/05-huesos-emergen.png",
    "/poema-universal/films/el-huerto/06-huesos-revelados.png",
    "/poema-universal/films/el-huerto/07-vuelve-a-cubrir.png",
    "/poema-universal/films/el-huerto/08-arbol-joven.png",
    "/poema-universal/films/el-huerto/09-arbol-memoria.png",
  ],
};


const LA_LUZ_REGRESA_DESCALZA: PoeticFilm = {
  id: "la-luz-regresa-descalza",
  frames: [
    "/poema-universal/films/la-luz-regresa-descalza/01-paisaje.png",
    "/poema-universal/films/la-luz-regresa-descalza/02-eso-dices.png",
    "/poema-universal/films/la-luz-regresa-descalza/03-vias-rigidas.png",
    "/poema-universal/films/la-luz-regresa-descalza/04-interior-del-planeta.png",
    "/poema-universal/films/la-luz-regresa-descalza/05-nacimiento-del-poema.png",
    "/poema-universal/films/la-luz-regresa-descalza/06-petalos-sobre-el-lomo.png",
    "/poema-universal/films/la-luz-regresa-descalza/07-portadilla-paisaje.png",
    "/poema-universal/films/la-luz-regresa-descalza/08-pies-regresan-de-la-luz.png",
  ],
};


const HABITACION_BLANCA: PoeticFilm = {
  id: "habitacion-blanca",
  frames: [
    "/poema-universal/films/habitacion-blanca/01-habitacion-blanca.png",
    "/poema-universal/films/habitacion-blanca/02-una-dosis-mas.png",
    "/poema-universal/films/habitacion-blanca/03-la-ansiedad-llega-primero.png",
    "/poema-universal/films/habitacion-blanca/04-el-jardin.png",
    "/poema-universal/films/habitacion-blanca/05-el-silencio-responde.png",
    "/poema-universal/films/habitacion-blanca/06-otros-ojos.png",
    "/poema-universal/films/habitacion-blanca/07-perdoname-vida-mia.png",
    "/poema-universal/films/habitacion-blanca/08-todavia-es-posible-cuidarnos.png",
  ],
};

const FALLBACK_IMAGES = [
  "/antologia/campo.jpg",
  "/antologia/elcarrodepaja.JPG",
  "/antologia/icaro%201.JPG",
  "/museo/coleccion/no-desaparezcamos/el-arbol-blanco.webp",
  "/museo/coleccion/bielka/la-memoria-bajo-el-agua.webp",
  "/museo/coleccion/no-desaparezcamos/la-promesa.webp",
  "/museo/coleccion/bielka/el-corazon-de-dos-mitades.webp",
  "/museo/coleccion/no-desaparezcamos/el-exiliado.webp",
  "/museo/coleccion/jerarquia/la-cadena-rota.webp",
  "/museo/coleccion/bielka/la-entrada-al-laberinto.webp",
];

export function getPoeticFilm(
  poem: PoeticFilmPoem,
  index: number
): PoeticFilm {
  const poet = normalize(poem.poetName);
  const title = normalize(poem.title);

  if (poet === "jose naveiro" && title === "el huerto") {
    return EL_HUERTO;
  }

  if (poet === "asataka" && title === "la luz regresa descalza") {
    return LA_LUZ_REGRESA_DESCALZA;
  }

  if (title === "habitacion blanca") {
    return HABITACION_BLANCA;
  }

  const image = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

  return {
    id: `fallback-${index}`,
    frames: [image],
  };
}
