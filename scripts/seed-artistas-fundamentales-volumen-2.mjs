import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

/* =========================================================
   ENTORNO
========================================================= */

function cargarEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");

  if (!fs.existsSync(envPath)) {
    throw new Error("No existe .env.local en la raíz del proyecto.");
  }

  const contenido = fs.readFileSync(envPath, "utf8");

  for (const lineaOriginal of contenido.split(/\r?\n/)) {
    const linea = lineaOriginal.trim();

    if (!linea || linea.startsWith("#")) continue;

    const separador = linea.indexOf("=");

    if (separador === -1) continue;

    const clave = linea.slice(0, separador).trim();
    let valor = linea.slice(separador + 1).trim();

    if (
      (valor.startsWith('"') && valor.endsWith('"')) ||
      (valor.startsWith("'") && valor.endsWith("'"))
    ) {
      valor = valor.slice(1, -1);
    }

    if (!process.env[clave]) {
      process.env[clave] = valor;
    }
  }
}

cargarEnvLocal();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY."
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/* =========================================================
   SEGUNDO CANON · AU-051 A AU-100
========================================================= */

const artistas = [
  {
    nombre: "Fiódor Dostoyevski",
    disciplina: "Literatura",
    territorio: "Rusia",
    periodo: "1821–1881",
    obra: "Los hermanos Karamázov",
    obras: ["Crimen y castigo", "El idiota", "Memorias del subsuelo"],
    etiquetas: ["culpa", "redención", "fe", "hambre", "conciencia"],
    dedicatoria:
      "Por descender hasta las contradicciones más oscuras del alma sin negar su posibilidad de redención.",
  },
  {
    nombre: "Friedrich Nietzsche",
    disciplina: "Filosofía",
    territorio: "Alemania",
    periodo: "1844–1900",
    obra: "Así habló Zaratustra",
    obras: [
      "La genealogía de la moral",
      "Más allá del bien y del mal",
      "La gaya ciencia",
    ],
    etiquetas: [
      "eterno retorno",
      "voluntad",
      "transformación",
      "abismo",
      "afirmación",
    ],
    dedicatoria:
      "Por convertir la existencia en una prueba radical de afirmación, transformación y responsabilidad.",
  },
  {
    nombre: "Cormac McCarthy",
    disciplina: "Literatura",
    territorio: "Estados Unidos",
    periodo: "1933–2023",
    obra: "La carretera",
    obras: [
      "Meridiano de sangre",
      "Todos los hermosos caballos",
      "El pasajero",
    ],
    etiquetas: ["hambre", "padre", "violencia", "camino", "fuego"],
    dedicatoria:
      "Por conservar una pequeña llama de ternura dentro de los paisajes más devastados.",
  },
  {
    nombre: "W. G. Sebald",
    disciplina: "Literatura · Ensayo",
    territorio: "Alemania · Reino Unido",
    periodo: "1944–2001",
    obra: "Austerlitz",
    obras: ["Los anillos de Saturno", "Los emigrados", "Vértigo"],
    etiquetas: ["memoria", "archivo", "fotografía", "exilio", "ruina"],
    dedicatoria:
      "Por caminar entre fotografías, ruinas y recuerdos como si la historia todavía respirase bajo la superficie.",
  },
  {
    nombre: "Paul Celan",
    disciplina: "Poesía",
    territorio: "Rumanía · Francia",
    periodo: "1920–1970",
    obra: "Amapola y memoria",
    obras: ["Reja de lenguaje", "Cambio de aliento", "Cristal de aliento"],
    etiquetas: ["lenguaje", "ceniza", "memoria", "silencio", "testimonio"],
    dedicatoria:
      "Por reconstruir una lengua poética después de que la historia intentara volver imposible toda palabra.",
  },
  {
    nombre: "Primo Levi",
    disciplina: "Literatura · Testimonio",
    territorio: "Italia",
    periodo: "1919–1987",
    obra: "Si esto es un hombre",
    obras: ["La tregua", "Los hundidos y los salvados", "El sistema periódico"],
    etiquetas: ["testimonio", "dignidad", "memoria", "supervivencia", "ética"],
    dedicatoria:
      "Por defender la precisión, la memoria y la dignidad frente a la maquinaria de la deshumanización.",
  },
  {
    nombre: "Virginia Woolf",
    disciplina: "Literatura · Ensayo",
    territorio: "Reino Unido",
    periodo: "1882–1941",
    obra: "Las olas",
    obras: ["Al faro", "La señora Dalloway", "Una habitación propia"],
    etiquetas: ["conciencia", "tiempo", "agua", "identidad", "memoria"],
    dedicatoria:
      "Por escuchar el movimiento interior de la conciencia y darle una arquitectura semejante al agua.",
  },
  {
    nombre: "Toni Morrison",
    disciplina: "Literatura",
    territorio: "Estados Unidos",
    periodo: "1931–2019",
    obra: "Beloved",
    obras: ["La canción de Salomón", "Ojos azules", "Jazz"],
    etiquetas: ["memoria", "madre", "esclavitud", "fantasma", "comunidad"],
    dedicatoria:
      "Por mostrar que la memoria colectiva puede regresar como un cuerpo que exige ser escuchado.",
  },
  {
    nombre: "Italo Calvino",
    disciplina: "Literatura",
    territorio: "Italia",
    periodo: "1923–1985",
    obra: "Las ciudades invisibles",
    obras: [
      "Si una noche de invierno un viajero",
      "El castillo de los destinos cruzados",
      "El barón rampante",
    ],
    etiquetas: ["ciudad", "laberinto", "ligereza", "estructura", "imaginación"],
    dedicatoria:
      "Por construir ciudades, libros y laberintos capaces de contener muchas realidades simultáneas.",
  },
  {
    nombre: "Kōbō Abe",
    disciplina: "Literatura",
    territorio: "Japón",
    periodo: "1924–1993",
    obra: "La mujer de la arena",
    obras: ["El rostro ajeno", "El hombre caja", "Encuentros secretos"],
    etiquetas: ["identidad", "arena", "encierro", "metamorfosis", "absurdo"],
    dedicatoria:
      "Por convertir el encierro, la arena y la pérdida del rostro en preguntas sobre la identidad.",
  },
  {
    nombre: "Herta Müller",
    disciplina: "Literatura",
    territorio: "Rumanía · Alemania",
    periodo: "1953–",
    obra: "Todo lo que tengo lo llevo conmigo",
    obras: ["La bestia del corazón", "En tierras bajas", "El hombre es un gran faisán"],
    etiquetas: ["dictadura", "hambre", "objeto", "lenguaje", "exilio"],
    dedicatoria:
      "Por revelar cómo el miedo político se instala en los objetos, las casas y el propio cuerpo.",
  },
  {
    nombre: "Yoko Tawada",
    disciplina: "Literatura",
    territorio: "Japón · Alemania",
    periodo: "1960–",
    obra: "Memorias de una osa polar",
    obras: ["El emisario", "Retrato de una lengua", "El ojo desnudo"],
    etiquetas: ["lengua", "frontera", "animal", "metamorfosis", "extrañamiento"],
    dedicatoria:
      "Por atravesar lenguas, especies y territorios hasta volver extraña cualquier identidad estable.",
  },
  {
    nombre: "Mahmoud Darwish",
    disciplina: "Poesía",
    territorio: "Palestina",
    periodo: "1941–2008",
    obra: "Mural",
    obras: [
      "Menos rosas",
      "Estado de sitio",
      "Como la flor del almendro o allende",
    ],
    etiquetas: ["patria", "exilio", "tierra", "memoria", "identidad"],
    dedicatoria:
      "Por hacer de la patria perdida una lengua capaz de acompañar a quienes viven lejos de su casa.",
  },
  {
    nombre: "Nelly Sachs",
    disciplina: "Poesía",
    territorio: "Alemania · Suecia",
    periodo: "1891–1970",
    obra: "En las moradas de la muerte",
    obras: ["Huida y metamorfosis", "Eclipse de estrella", "Signos en la arena"],
    etiquetas: ["duelo", "exilio", "ceniza", "metamorfosis", "memoria"],
    dedicatoria:
      "Por transformar la persecución y la pérdida en una poesía de ceniza, vuelo y metamorfosis.",
  },
  {
    nombre: "Ursula K. Le Guin",
    disciplina: "Literatura",
    territorio: "Estados Unidos",
    periodo: "1929–2018",
    obra: "Los desposeídos",
    obras: [
      "La mano izquierda de la oscuridad",
      "Un mago de Terramar",
      "El nombre del mundo es bosque",
    ],
    etiquetas: ["utopía", "sociedad", "lenguaje", "equilibrio", "alteridad"],
    dedicatoria:
      "Por imaginar otros mundos para interrogar las jerarquías y posibilidades del nuestro.",
  },
  {
    nombre: "Juan Rulfo",
    disciplina: "Literatura · Fotografía",
    territorio: "México",
    periodo: "1917–1986",
    obra: "Pedro Páramo",
    obras: ["El llano en llamas", "El gallo de oro", "México: Juan Rulfo fotógrafo"],
    etiquetas: ["muertos", "tierra", "pueblo", "padre", "silencio"],
    dedicatoria:
      "Por permitir que los muertos hablasen desde una tierra seca donde memoria y presente son inseparables.",
  },
  {
    nombre: "Wole Soyinka",
    disciplina: "Literatura · Teatro",
    territorio: "Nigeria",
    periodo: "1934–",
    obra: "La muerte y el caballero del rey",
    obras: ["Los intérpretes", "El hombre ha muerto", "Aké"],
    etiquetas: ["rito", "poder", "memoria", "tragedia", "resistencia"],
    dedicatoria:
      "Por unir mito, historia y resistencia política en una dramaturgia profundamente humana.",
  },
  {
    nombre: "Ngũgĩ wa Thiong'o",
    disciplina: "Literatura · Ensayo",
    territorio: "Kenia",
    periodo: "1938–",
    obra: "Descolonizar la mente",
    obras: ["Un grano de trigo", "El diablo en la cruz", "Sueños en tiempos de guerra"],
    etiquetas: ["lengua", "colonialismo", "memoria", "pueblo", "resistencia"],
    dedicatoria:
      "Por defender que recuperar una lengua también significa recuperar una forma de existir.",
  },
  {
    nombre: "Rabindranath Tagore",
    disciplina: "Poesía · Música · Pensamiento",
    territorio: "India",
    periodo: "1861–1941",
    obra: "Gitanjali",
    obras: ["El jardinero", "La casa y el mundo", "El cartero del rey"],
    etiquetas: ["naturaleza", "alma", "educación", "libertad", "música"],
    dedicatoria:
      "Por reunir poesía, música, educación y naturaleza dentro de una misma aspiración de libertad.",
  },
  {
    nombre: "Kenzaburō Ōe",
    disciplina: "Literatura",
    territorio: "Japón",
    periodo: "1935–2023",
    obra: "Una cuestión personal",
    obras: ["El grito silencioso", "Arrancad las semillas, fusilad a los niños", "Dinos cómo sobrevivir a nuestra locura"],
    etiquetas: ["hijo", "responsabilidad", "violencia", "aldea", "culpa"],
    dedicatoria:
      "Por enfrentar la responsabilidad, la paternidad y la violencia sin buscar refugio en respuestas fáciles.",
  },
  {
    nombre: "Aimé Césaire",
    disciplina: "Poesía · Pensamiento",
    territorio: "Martinica",
    periodo: "1913–2008",
    obra: "Cuaderno de un retorno al país natal",
    obras: ["Discurso sobre el colonialismo", "Cadáver insepulto", "Y los perros callaban"],
    etiquetas: ["retorno", "colonialismo", "identidad", "tierra", "rebelión"],
    dedicatoria:
      "Por convertir el regreso, la identidad y la rebelión anticolonial en una fuerza poética continental.",
  },

  {
    nombre: "Giorgio de Chirico",
    disciplina: "Pintura",
    territorio: "Italia · Grecia",
    periodo: "1888–1978",
    obra: "El misterio y la melancolía de una calle",
    obras: ["Las musas inquietantes", "La canción de amor", "Héctor y Andrómaca"],
    etiquetas: ["plaza", "sombra", "estatua", "extrañeza", "ciudad"],
    dedicatoria:
      "Por llenar plazas vacías de una inquietud que parece recordar algo ocurrido fuera del tiempo.",
  },
  {
    nombre: "Caspar David Friedrich",
    disciplina: "Pintura",
    territorio: "Alemania",
    periodo: "1774–1840",
    obra: "Caminante sobre el mar de nubes",
    obras: ["Abadía en el robledal", "El monje junto al mar", "Mar de hielo"],
    etiquetas: ["paisaje", "soledad", "ruina", "niebla", "sublime"],
    dedicatoria:
      "Por situar la figura humana ante una naturaleza inmensa que la reduce y, al mismo tiempo, la despierta.",
  },
  {
    nombre: "Edward Hopper",
    disciplina: "Pintura",
    territorio: "Estados Unidos",
    periodo: "1882–1967",
    obra: "Nighthawks",
    obras: ["Morning Sun", "House by the Railroad", "Room in New York"],
    etiquetas: ["soledad", "ventana", "ciudad", "espera", "luz"],
    dedicatoria:
      "Por descubrir la soledad moderna dentro de habitaciones iluminadas, ventanas y ciudades aparentemente quietas.",
  },
  {
    nombre: "Odilon Redon",
    disciplina: "Pintura · Grabado",
    territorio: "Francia",
    periodo: "1840–1916",
    obra: "El ojo, como un globo extraño",
    obras: ["El cíclope", "La araña sonriente", "Ofelia"],
    etiquetas: ["sueño", "ojo", "criatura", "símbolo", "oscuridad"],
    dedicatoria:
      "Por dar forma a criaturas y visiones nacidas en la frontera entre el sueño y la conciencia.",
  },
  {
    nombre: "Leonora Carrington",
    disciplina: "Pintura · Literatura",
    territorio: "Reino Unido · México",
    periodo: "1917–2011",
    obra: "El mundo mágico de los mayas",
    obras: ["Autorretrato", "La giganta", "La trompetilla acústica"],
    etiquetas: ["alquimia", "animal", "mujer", "mitología", "metamorfosis"],
    dedicatoria:
      "Por imaginar una mitología propia donde mujeres, animales y objetos participan de la misma transformación.",
  },
  {
    nombre: "Remedios Varo",
    disciplina: "Pintura",
    territorio: "España · México",
    periodo: "1908–1963",
    obra: "La creación de las aves",
    obras: ["Bordando el manto terrestre", "Papilla estelar", "Exploración de las fuentes del río Orinoco"],
    etiquetas: ["máquina", "alquimia", "viaje", "laberinto", "criatura"],
    dedicatoria:
      "Por construir máquinas poéticas capaces de alimentar estrellas, fabricar aves y atravesar mundos.",
  },
  {
    nombre: "Christian Boltanski",
    disciplina: "Instalación · Fotografía",
    territorio: "Francia",
    periodo: "1944–2021",
    obra: "Monument: Les Enfants de Dijon",
    obras: ["Réserve", "Personnes", "No Man's Land"],
    etiquetas: ["archivo", "fotografía", "ausencia", "ropa", "memoria"],
    dedicatoria:
      "Por convertir fotografías, ropas y objetos anónimos en monumentos para quienes estuvieron a punto de desaparecer.",
  },
  {
    nombre: "Doris Salcedo",
    disciplina: "Escultura · Instalación",
    territorio: "Colombia",
    periodo: "1958–",
    obra: "Shibboleth",
    obras: ["Noviembre 6 y 7", "Plegaria muda", "Atrabiliarios"],
    etiquetas: ["duelo", "violencia", "mueble", "ausencia", "herida"],
    dedicatoria:
      "Por hacer visible la violencia mediante muebles, grietas y espacios que conservan la ausencia de los cuerpos.",
  },
  {
    nombre: "Joseph Beuys",
    disciplina: "Escultura · Performance",
    territorio: "Alemania",
    periodo: "1921–1986",
    obra: "7000 robles",
    obras: ["Cómo explicar los cuadros a una liebre muerta", "I Like America and America Likes Me", "Felt Suit"],
    etiquetas: ["fieltro", "grasa", "animal", "ritual", "transformación"],
    dedicatoria:
      "Por concebir el arte como una energía social capaz de transformar materiales, comunidades y pensamiento.",
  },
  {
    nombre: "Berlinde De Bruyckere",
    disciplina: "Escultura",
    territorio: "Bélgica",
    periodo: "1964–",
    obra: "Kreupelhout",
    obras: ["We Are All Flesh", "The Embalmer", "No Life Lost"],
    etiquetas: ["carne", "caballo", "herida", "árbol", "fragilidad"],
    dedicatoria:
      "Por unir carne, madera, caballo y herida en cuerpos que parecen pedir protección.",
  },

  {
    nombre: "Robert Bresson",
    disciplina: "Cine",
    territorio: "Francia",
    periodo: "1901–1999",
    obra: "Un condenado a muerte se ha escapado",
    obras: ["Al azar de Baltasar", "Pickpocket", "Mouchette"],
    etiquetas: ["gesto", "mano", "animal", "gracia", "austeridad"],
    dedicatoria:
      "Por reducir el cine hasta el gesto esencial y encontrar una forma de gracia en lo aparentemente mínimo.",
  },
  {
    nombre: "Carl Theodor Dreyer",
    disciplina: "Cine",
    territorio: "Dinamarca",
    periodo: "1889–1968",
    obra: "La pasión de Juana de Arco",
    obras: ["Ordet", "Vampyr", "Dies Irae"],
    etiquetas: ["rostro", "fe", "milagro", "silencio", "sacrificio"],
    dedicatoria:
      "Por convertir el rostro, la fe y la espera en acontecimientos cinematográficos absolutos.",
  },
  {
    nombre: "Terrence Malick",
    disciplina: "Cine",
    territorio: "Estados Unidos",
    periodo: "1943–",
    obra: "El árbol de la vida",
    obras: ["La delgada línea roja", "Días del cielo", "Malas tierras"],
    etiquetas: ["naturaleza", "gracia", "infancia", "guerra", "cosmos"],
    dedicatoria:
      "Por hacer dialogar la infancia, la naturaleza, la violencia y el cosmos dentro de una misma plegaria visual.",
  },
  {
    nombre: "David Lynch",
    disciplina: "Cine · Artes visuales",
    territorio: "Estados Unidos",
    periodo: "1946–2025",
    obra: "Mulholland Drive",
    obras: ["Twin Peaks", "Eraserhead", "El hombre elefante"],
    etiquetas: ["doble", "sueño", "ruido", "ciudad", "identidad"],
    dedicatoria:
      "Por revelar el sueño oscuro escondido detrás de las superficies más cotidianas.",
  },
  {
    nombre: "Pedro Costa",
    disciplina: "Cine",
    territorio: "Portugal",
    periodo: "1958–",
    obra: "En el cuarto de Vanda",
    obras: ["Juventud en marcha", "Cavalo Dinheiro", "Vitalina Varela"],
    etiquetas: ["habitación", "migración", "oscuridad", "dignidad", "ruina"],
    dedicatoria:
      "Por filmar cuerpos desplazados y habitaciones precarias con una dignidad monumental.",
  },
  {
    nombre: "Lucrecia Martel",
    disciplina: "Cine",
    territorio: "Argentina",
    periodo: "1966–",
    obra: "La ciénaga",
    obras: ["La niña santa", "La mujer sin cabeza", "Zama"],
    etiquetas: ["sonido", "cuerpo", "familia", "calor", "memoria"],
    dedicatoria:
      "Por construir espacios donde el sonido, el cuerpo y la memoria revelan aquello que nadie quiere nombrar.",
  },
  {
    nombre: "Apichatpong Weerasethakul",
    disciplina: "Cine · Instalación",
    territorio: "Tailandia",
    periodo: "1970–",
    obra: "Uncle Boonmee recuerda sus vidas pasadas",
    obras: ["Tropical Malady", "Cemetery of Splendour", "Memoria"],
    etiquetas: ["selva", "sueño", "fantasma", "memoria", "animal"],
    dedicatoria:
      "Por permitir que vivos, muertos, animales y sueños compartan un mismo territorio sin jerarquías.",
  },
  {
    nombre: "Guillermo del Toro",
    disciplina: "Cine",
    territorio: "México",
    periodo: "1964–",
    obra: "El laberinto del fauno",
    obras: ["La forma del agua", "El espinazo del diablo", "Pinocho"],
    etiquetas: ["monstruo", "infancia", "laberinto", "guerra", "ternura"],
    dedicatoria:
      "Por defender que los monstruos pueden contener más humanidad que quienes se presentan como normales.",
  },

  {
    nombre: "Jóhann Jóhannsson",
    disciplina: "Música",
    territorio: "Islandia",
    periodo: "1969–2018",
    obra: "Orphée",
    obras: ["Fordlandia", "The Miners' Hymns", "Arrival"],
    etiquetas: ["memoria", "máquina", "duelo", "espacio", "repetición"],
    dedicatoria:
      "Por convertir máquinas, paisajes y pérdidas colectivas en una música de memoria lenta.",
  },
  {
    nombre: "Max Richter",
    disciplina: "Música",
    territorio: "Alemania · Reino Unido",
    periodo: "1966–",
    obra: "The Blue Notebooks",
    obras: ["Sleep", "Infra", "Recomposed: Vivaldi"],
    etiquetas: ["sueño", "memoria", "repetición", "tiempo", "intimidad"],
    dedicatoria:
      "Por crear espacios musicales donde el recuerdo, el sueño y el tiempo pueden respirar.",
  },
  {
    nombre: "Philip Glass",
    disciplina: "Música",
    territorio: "Estados Unidos",
    periodo: "1937–",
    obra: "Einstein on the Beach",
    obras: ["Glassworks", "Koyaanisqatsi", "Akhnaten"],
    etiquetas: ["repetición", "estructura", "movimiento", "tiempo", "hipnosis"],
    dedicatoria:
      "Por revelar que la repetición nunca vuelve al mismo lugar y que el tiempo puede transformarse desde dentro.",
  },
  {
    nombre: "György Ligeti",
    disciplina: "Música",
    territorio: "Hungría · Austria",
    periodo: "1923–2006",
    obra: "Atmosphères",
    obras: ["Lux Aeterna", "Requiem", "Lontano"],
    etiquetas: ["masa sonora", "cosmos", "miedo", "micropolifonía", "tiempo"],
    dedicatoria:
      "Por construir masas sonoras que parecen proceder de un cosmos anterior al lenguaje.",
  },
  {
    nombre: "Nina Simone",
    disciplina: "Música",
    territorio: "Estados Unidos",
    periodo: "1933–2003",
    obra: "Pastel Blues",
    obras: ["I Put a Spell on You", "Wild Is the Wind", "Nina Simone Sings the Blues"],
    etiquetas: ["voz", "dignidad", "rabia", "amor", "resistencia"],
    dedicatoria:
      "Por hacer de la voz una fuerza donde la herida, el amor y la resistencia política son inseparables.",
  },
  {
    nombre: "Nick Cave",
    disciplina: "Música · Literatura",
    territorio: "Australia · Reino Unido",
    periodo: "1957–",
    obra: "Ghosteen",
    obras: ["The Boatman's Call", "Skeleton Tree", "Murder Ballads"],
    etiquetas: ["duelo", "amor", "fe", "violencia", "fantasma"],
    dedicatoria:
      "Por transformar el duelo, la violencia y la pérdida en canciones que todavía buscan una forma de fe.",
  },
  {
    nombre: "Meredith Monk",
    disciplina: "Música · Performance",
    territorio: "Estados Unidos",
    periodo: "1942–",
    obra: "Dolmen Music",
    obras: ["Book of Days", "Atlas", "Songs of Ascension"],
    etiquetas: ["voz", "ritual", "cuerpo", "respiración", "comunidad"],
    dedicatoria:
      "Por devolver la voz a un territorio anterior a las palabras, unido al cuerpo y al rito.",
  },

  {
    nombre: "Lina Bo Bardi",
    disciplina: "Arquitectura",
    territorio: "Italia · Brasil",
    periodo: "1914–1992",
    obra: "SESC Pompéia",
    obras: ["Casa de Vidrio", "MASP", "Teatro Oficina"],
    etiquetas: ["comunidad", "estructura", "ruina", "cultura", "hospitalidad"],
    dedicatoria:
      "Por transformar estructuras existentes en lugares vivos para la cultura, la convivencia y la dignidad.",
  },
  {
    nombre: "Carlo Scarpa",
    disciplina: "Arquitectura",
    territorio: "Italia",
    periodo: "1906–1978",
    obra: "Tumba Brion",
    obras: ["Castelvecchio", "Querini Stampalia", "Negozio Olivetti"],
    etiquetas: ["agua", "detalle", "piedra", "memoria", "umbral"],
    dedicatoria:
      "Por construir umbrales donde el agua, la piedra, el metal y la memoria se encuentran con precisión poética.",
  },
  {
    nombre: "Luis Barragán",
    disciplina: "Arquitectura",
    territorio: "México",
    periodo: "1902–1988",
    obra: "Casa Barragán",
    obras: ["Cuadra San Cristóbal", "Capilla de las Capuchinas", "Torres de Satélite"],
    etiquetas: ["muro", "color", "agua", "silencio", "jardín"],
    dedicatoria:
      "Por hacer del muro, el color, el jardín y el agua una arquitectura emocional y contemplativa.",
  },
  {
    nombre: "Josef Koudelka",
    disciplina: "Fotografía",
    territorio: "Checoslovaquia · Francia",
    periodo: "1938–",
    obra: "Exiles",
    obras: ["Gypsies", "Invasion 68: Prague", "Chaos"],
    etiquetas: ["exilio", "frontera", "ruina", "viaje", "desarraigo"],
    dedicatoria:
      "Por fotografiar el exilio, la frontera y la ruina como condiciones físicas de la existencia.",
  },
];

/* =========================================================
   UTILIDADES
========================================================= */

function claveNombre(nombre) {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function prepararRegistro(artista) {
  return {
    nombre: artista.nombre,
    disciplina: artista.disciplina,
    categoria: artista.disciplina,
    pais: artista.territorio,
    territorio: artista.territorio,
    periodo: artista.periodo,
    obra: artista.obra,
    obras_esenciales: artista.obras,
    etiquetas: [
      ...artista.etiquetas,
      "Atlas Fundacional",
      "Segundo círculo",
      "Tríptico",
    ],
    dedicatoria: artista.dedicatoria,
    imagen_url: null,
    foto_url: null,
    visible: true,
    activo: true,
    destacado: true,
  };
}

async function insertarEnLotes(registros, tamano = 10) {
  let insertados = 0;

  for (let i = 0; i < registros.length; i += tamano) {
    const lote = registros.slice(i, i + tamano);

    const { error } = await supabase
      .from("artistas")
      .insert(lote);

    if (error) {
      throw new Error(
        `Error en lote ${i / tamano + 1}: ${error.message}`
      );
    }

    insertados += lote.length;
    console.log(`   ✓ ${insertados}/${registros.length}`);
  }
}

/* =========================================================
   EJECUCIÓN
========================================================= */

async function ejecutar() {
  console.log("");
  console.log("══════════════════════════════════════════════");
  console.log(" ATLAS FUNDAMENTAL · SEGUNDO CÍRCULO");
  console.log("══════════════════════════════════════════════");
  console.log("");

  if (artistas.length !== 50) {
    throw new Error(
      `Se esperaban 50 artistas y hay ${artistas.length}.`
    );
  }

  const { data: existentes, error } = await supabase
    .from("artistas")
    .select("id, nombre");

  if (error) {
    throw new Error(
      `No se pudo leer la tabla artistas: ${error.message}`
    );
  }

  const nombresExistentes = new Set(
    (existentes || []).map((item) =>
      claveNombre(item.nombre)
    )
  );

  const pendientes = artistas.filter(
    (artista) =>
      !nombresExistentes.has(claveNombre(artista.nombre))
  );

  console.log(`Segundo canon: ${artistas.length}`);
  console.log(`Ya existentes: ${artistas.length - pendientes.length}`);
  console.log(`Pendientes: ${pendientes.length}`);
  console.log("");

  if (pendientes.length === 0) {
    console.log("✅ Los cincuenta artistas ya estaban instalados.");
    return;
  }

  await insertarEnLotes(
    pendientes.map(prepararRegistro)
  );

  const { count, error: countError } = await supabase
    .from("artistas")
    .select("*", {
      count: "exact",
      head: true,
    });

  if (countError) {
    console.warn(
      `⚠️ No se pudo comprobar el total: ${countError.message}`
    );
  }

  console.log("");
  console.log("══════════════════════════════════════════════");
  console.log(" ✅ SEGUNDO CÍRCULO INSTALADO");
  console.log(` Añadidos: ${pendientes.length}`);
  console.log(` Total en Supabase: ${count ?? "sin comprobar"}`);
  console.log("══════════════════════════════════════════════");
  console.log("");
}

ejecutar().catch((error) => {
  console.error("");
  console.error("❌ ERROR AL INSTALAR EL SEGUNDO CÍRCULO");
  console.error(error.message);
  console.error("");
  process.exit(1);
});
