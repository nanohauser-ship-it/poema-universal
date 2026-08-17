import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

/* =========================================================
   CARGA SEGURA DE .env.local
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
    "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local."
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/* =========================================================
   CANON FUNDACIONAL
========================================================= */

const artistas = [
  {
    nombre: "Albert Camus",
    disciplina: "Literatura · Filosofía",
    pais: "Argelia · Francia",
    periodo: "1913–1960",
    obra: "El mito de Sísifo",
    obras: ["El extranjero", "La peste", "El hombre rebelde"],
    etiquetas: ["absurdo", "dignidad", "rebelión", "medida", "solidaridad"],
    dedicatoria:
      "Por enseñarnos que la lucidez no impide amar el mundo y que la dignidad también puede existir frente al absurdo.",
  },
  {
    nombre: "Jorge Luis Borges",
    disciplina: "Literatura",
    pais: "Argentina",
    periodo: "1899–1986",
    obra: "Ficciones",
    obras: ["El Aleph", "El libro de arena", "Otras inquisiciones"],
    etiquetas: ["laberinto", "infinito", "memoria", "espejo", "identidad"],
    dedicatoria:
      "Por convertir el laberinto, la biblioteca y el infinito en formas esenciales de la conciencia humana.",
  },
  {
    nombre: "Franz Kafka",
    disciplina: "Literatura",
    pais: "Praga · Imperio austrohúngaro",
    periodo: "1883–1924",
    obra: "El proceso",
    obras: ["La metamorfosis", "El castillo", "Carta al padre"],
    etiquetas: ["culpa", "poder", "metamorfosis", "burocracia", "extrañeza"],
    dedicatoria:
      "Por revelar la maquinaria invisible que puede convertir al ser humano en extranjero dentro de su propia vida.",
  },
  {
    nombre: "José Saramago",
    disciplina: "Literatura",
    pais: "Portugal",
    periodo: "1922–2010",
    obra: "Ensayo sobre la ceguera",
    obras: [
      "El evangelio según Jesucristo",
      "Todos los nombres",
      "Las intermitencias de la muerte",
    ],
    etiquetas: ["alegoría", "comunidad", "ceguera", "ética", "responsabilidad"],
    dedicatoria:
      "Por mirar la fragilidad colectiva sin renunciar a la compasión, la ironía ni la responsabilidad.",
  },
  {
    nombre: "Simone Weil",
    disciplina: "Filosofía · Ensayo",
    pais: "Francia",
    periodo: "1909–1943",
    obra: "La gravedad y la gracia",
    obras: ["Echar raíces", "La condición obrera", "A la espera de Dios"],
    etiquetas: ["atención", "desarraigo", "gracia", "justicia", "sufrimiento"],
    dedicatoria:
      "Por hacer de la atención una forma radical de justicia hacia quienes sufren.",
  },
  {
    nombre: "María Zambrano",
    disciplina: "Filosofía · Ensayo",
    pais: "España",
    periodo: "1904–1991",
    obra: "Claros del bosque",
    obras: ["Filosofía y poesía", "El hombre y lo divino", "Delirio y destino"],
    etiquetas: ["razón poética", "exilio", "revelación", "bosque", "memoria"],
    dedicatoria:
      "Por abrir una razón poética capaz de pensar sin expulsar el misterio, el sueño ni la herida.",
  },
  {
    nombre: "Samuel Beckett",
    disciplina: "Literatura · Teatro",
    pais: "Irlanda · Francia",
    periodo: "1906–1989",
    obra: "Esperando a Godot",
    obras: ["Molloy", "Malone muere", "El innombrable"],
    etiquetas: ["espera", "silencio", "agotamiento", "despojo", "persistencia"],
    dedicatoria:
      "Por demostrar que, cuando casi todo ha desaparecido, todavía queda una voz que intenta continuar.",
  },
  {
    nombre: "Clarice Lispector",
    disciplina: "Literatura",
    pais: "Brasil",
    periodo: "1920–1977",
    obra: "La pasión según G. H.",
    obras: ["La hora de la estrella", "Agua viva", "Cerca del corazón salvaje"],
    etiquetas: ["conciencia", "cuerpo", "lenguaje", "revelación", "interioridad"],
    dedicatoria:
      "Por llevar el lenguaje hasta el instante en que la conciencia descubre que también es materia y abismo.",
  },
  {
    nombre: "Fernando Pessoa",
    disciplina: "Literatura",
    pais: "Portugal",
    periodo: "1888–1935",
    obra: "Libro del desasosiego",
    obras: ["Mensaje", "Poemas de Álvaro de Campos", "Odas de Ricardo Reis"],
    etiquetas: ["identidad", "heterónimos", "desasosiego", "ciudad", "multiplicidad"],
    dedicatoria:
      "Por mostrar que una sola persona puede contener una multitud de vidas, voces y ausencias.",
  },
  {
    nombre: "Julio Cortázar",
    disciplina: "Literatura",
    pais: "Argentina · Francia",
    periodo: "1914–1984",
    obra: "Rayuela",
    obras: ["Bestiario", "Final del juego", "Los reyes"],
    etiquetas: ["juego", "umbral", "laberinto", "extrañeza", "minotauro"],
    dedicatoria:
      "Por abrir pasadizos entre lo cotidiano y lo imposible, y devolver al laberinto una voz inesperada.",
  },
  {
    nombre: "Olga Tokarczuk",
    disciplina: "Literatura",
    pais: "Polonia",
    periodo: "1962–",
    obra: "Los errantes",
    obras: [
      "Sobre los huesos de los muertos",
      "Los libros de Jacob",
      "Un lugar llamado Antaño",
    ],
    etiquetas: ["fragmento", "viaje", "cuerpo", "mitología", "frontera"],
    dedicatoria:
      "Por construir mundos fragmentarios donde cada criatura conserva una parte secreta del relato.",
  },
  {
    nombre: "Jon Fosse",
    disciplina: "Literatura · Teatro",
    pais: "Noruega",
    periodo: "1959–",
    obra: "Septología",
    obras: ["Trilogía", "Mañana y tarde", "Melancolía"],
    etiquetas: ["repetición", "silencio", "fe", "doble", "respiración"],
    dedicatoria:
      "Por escribir la respiración de lo que vuelve, se repite y permanece junto al silencio.",
  },
  {
    nombre: "Han Kang",
    disciplina: "Literatura",
    pais: "Corea del Sur",
    periodo: "1970–",
    obra: "La vegetariana",
    obras: ["Actos humanos", "Blanco", "La clase de griego"],
    etiquetas: ["cuerpo", "violencia", "blanco", "memoria", "fragilidad"],
    dedicatoria:
      "Por acercarse a la violencia y a la pérdida con una delicadeza capaz de proteger lo que todavía respira.",
  },
  {
    nombre: "Ágota Kristóf",
    disciplina: "Literatura",
    pais: "Hungría · Suiza",
    periodo: "1935–2011",
    obra: "El gran cuaderno",
    obras: ["La prueba", "La tercera mentira", "Ayer"],
    etiquetas: ["infancia", "guerra", "doble", "despojo", "crueldad"],
    dedicatoria:
      "Por encontrar una lengua desnuda para narrar la infancia, la guerra y la fractura de la identidad.",
  },
  {
    nombre: "László Krasznahorkai",
    disciplina: "Literatura",
    pais: "Hungría",
    periodo: "1954–",
    obra: "Tango satánico",
    obras: [
      "Melancolía de la resistencia",
      "Guerra y guerra",
      "El barón Wenckheim vuelve a casa",
    ],
    etiquetas: ["agotamiento", "apocalipsis", "espera", "comunidad", "deriva"],
    dedicatoria:
      "Por hacer de la frase un territorio exhausto donde la humanidad avanza aun cuando parece no existir salida.",
  },
  {
    nombre: "Alejandra Pizarnik",
    disciplina: "Poesía",
    pais: "Argentina",
    periodo: "1936–1972",
    obra: "Árbol de Diana",
    obras: [
      "Extracción de la piedra de locura",
      "Los trabajos y las noches",
      "El infierno musical",
    ],
    etiquetas: ["silencio", "herida", "noche", "infancia", "desaparición"],
    dedicatoria:
      "Por escuchar el lugar donde la palabra se acerca al silencio sin dejar de buscar una forma de existir.",
  },
  {
    nombre: "Rainer Maria Rilke",
    disciplina: "Poesía",
    pais: "Praga · Austria",
    periodo: "1875–1926",
    obra: "Elegías de Duino",
    obras: ["Sonetos a Orfeo", "Cartas a un joven poeta", "Los cuadernos de Malte"],
    etiquetas: ["ángel", "transformación", "muerte", "belleza", "interioridad"],
    dedicatoria:
      "Por enseñarnos que la belleza y el espanto pueden compartir una misma puerta.",
  },
  {
    nombre: "Georges Bataille",
    disciplina: "Filosofía · Literatura",
    pais: "Francia",
    periodo: "1897–1962",
    obra: "La parte maldita",
    obras: ["La experiencia interior", "El erotismo", "Historia del ojo"],
    etiquetas: ["exceso", "límite", "deseo", "sacrificio", "transgresión"],
    dedicatoria:
      "Por explorar aquello que la razón intenta excluir: el exceso, el deseo y la experiencia del límite.",
  },

  {
    nombre: "Francisco de Goya",
    disciplina: "Pintura · Grabado",
    pais: "España",
    periodo: "1746–1828",
    obra: "Pinturas negras",
    obras: ["Los caprichos", "Los desastres de la guerra", "El 3 de mayo"],
    etiquetas: ["guerra", "sombra", "violencia", "monstruo", "memoria"],
    dedicatoria:
      "Por mirar de frente los monstruos de la historia sin permitir que la belleza los vuelva inocentes.",
  },
  {
    nombre: "Alberto Giacometti",
    disciplina: "Escultura · Pintura",
    pais: "Suiza · Francia",
    periodo: "1901–1966",
    obra: "El hombre que camina",
    obras: ["La plaza", "El perro", "Mujer de pie"],
    etiquetas: ["figura", "soledad", "distancia", "persistencia", "materia"],
    dedicatoria:
      "Por reducir la figura humana hasta revelar la obstinación profunda de seguir en pie.",
  },
  {
    nombre: "Louise Bourgeois",
    disciplina: "Escultura · Instalación",
    pais: "Francia · Estados Unidos",
    periodo: "1911–2010",
    obra: "Maman",
    obras: ["Cells", "Destruction of the Father", "Arch of Hysteria"],
    etiquetas: ["memoria", "madre", "casa", "trauma", "cuerpo"],
    dedicatoria:
      "Por convertir la memoria familiar, el miedo y el cuerpo herido en arquitectura simbólica.",
  },
  {
    nombre: "Anselm Kiefer",
    disciplina: "Pintura · Escultura",
    pais: "Alemania",
    periodo: "1945–",
    obra: "Margarethe",
    obras: ["Sulamith", "Palm Sunday", "The High Priestess"],
    etiquetas: ["ruina", "ceniza", "historia", "plomo", "memoria"],
    dedicatoria:
      "Por trabajar con la ceniza de la historia y demostrar que la materia también puede recordar.",
  },
  {
    nombre: "Mark Rothko",
    disciplina: "Pintura",
    pais: "Letonia · Estados Unidos",
    periodo: "1903–1970",
    obra: "Rothko Chapel",
    obras: ["Seagram Murals", "No. 14", "Black on Maroon"],
    etiquetas: ["color", "umbral", "silencio", "contemplación", "tragedia"],
    dedicatoria:
      "Por convertir el color en una presencia capaz de contener silencio, gravedad y trascendencia.",
  },
  {
    nombre: "Antoni Tàpies",
    disciplina: "Pintura · Escultura",
    pais: "Cataluña · España",
    periodo: "1923–2012",
    obra: "Gran pintura gris",
    obras: ["Materia en forma de pie", "Cruz y R", "Núvol i cadira"],
    etiquetas: ["materia", "muro", "huella", "cruz", "objeto"],
    dedicatoria:
      "Por hallar en el muro, el polvo y la cicatriz una escritura anterior a las palabras.",
  },
  {
    nombre: "Frida Kahlo",
    disciplina: "Pintura",
    pais: "México",
    periodo: "1907–1954",
    obra: "Las dos Fridas",
    obras: ["La columna rota", "Henry Ford Hospital", "Autorretrato con collar"],
    etiquetas: ["cuerpo", "dolor", "identidad", "herida", "autorretrato"],
    dedicatoria:
      "Por transformar el cuerpo herido en una imagen soberana de identidad y resistencia.",
  },
  {
    nombre: "Salvador Dalí",
    disciplina: "Pintura · Cine · Escenografía",
    pais: "Cataluña · España",
    periodo: "1904–1989",
    obra: "La persistencia de la memoria",
    obras: [
      "El gran masturbador",
      "Cristo de San Juan de la Cruz",
      "Construcción blanda",
    ],
    etiquetas: ["sueño", "tiempo", "deseo", "metamorfosis", "surrealismo"],
    dedicatoria:
      "Por demostrar que el sueño puede construir una lógica visual tan precisa como la vigilia.",
  },
  {
    nombre: "Käthe Kollwitz",
    disciplina: "Grabado · Escultura",
    pais: "Alemania",
    periodo: "1867–1945",
    obra: "La guerra",
    obras: ["Los tejedores", "Madre con su hijo muerto", "La rebelión"],
    etiquetas: ["madre", "duelo", "pobreza", "guerra", "compasión"],
    dedicatoria:
      "Por prestar sus manos a las madres, los trabajadores y quienes quedaron sin voz frente a la guerra.",
  },
  {
    nombre: "Chiharu Shiota",
    disciplina: "Instalación",
    pais: "Japón · Alemania",
    periodo: "1972–",
    obra: "The Key in the Hand",
    obras: ["Uncertain Journey", "In Silence", "Accumulation"],
    etiquetas: ["hilo", "memoria", "ausencia", "objeto", "conexión"],
    dedicatoria:
      "Por tejer la ausencia hasta convertirla en un espacio físico que el cuerpo puede atravesar.",
  },

  {
    nombre: "Andrei Tarkovski",
    disciplina: "Cine",
    pais: "Rusia",
    periodo: "1932–1986",
    obra: "Stalker",
    obras: ["El espejo", "Solaris", "Sacrificio"],
    etiquetas: ["tiempo", "agua", "memoria", "ruina", "espiritualidad"],
    dedicatoria:
      "Por esculpir el tiempo y encontrar en el agua, la ruina y la espera una forma de revelación.",
  },
  {
    nombre: "Ingmar Bergman",
    disciplina: "Cine · Teatro",
    pais: "Suecia",
    periodo: "1918–2007",
    obra: "Persona",
    obras: ["El séptimo sello", "Gritos y susurros", "Fanny y Alexander"],
    etiquetas: ["rostro", "muerte", "fe", "máscara", "silencio"],
    dedicatoria:
      "Por acercar la cámara al rostro hasta convertirlo en un territorio de fe, miedo y contradicción.",
  },
  {
    nombre: "Béla Tarr",
    disciplina: "Cine",
    pais: "Hungría",
    periodo: "1955–",
    obra: "Sátántangó",
    obras: ["El caballo de Turín", "Armonías de Werckmeister", "El hombre de Londres"],
    etiquetas: ["agotamiento", "lluvia", "espera", "tiempo", "comunidad"],
    dedicatoria:
      "Por filmar la espera y el agotamiento sin apartar la mirada de quienes continúan caminando.",
  },
  {
    nombre: "Theo Angelopoulos",
    disciplina: "Cine",
    pais: "Grecia",
    periodo: "1935–2012",
    obra: "La mirada de Ulises",
    obras: ["Paisaje en la niebla", "La eternidad y un día", "El paso suspendido"],
    etiquetas: ["frontera", "niebla", "exilio", "viaje", "memoria"],
    dedicatoria:
      "Por convertir la frontera, la niebla y el viaje en paisajes interiores de la historia europea.",
  },
  {
    nombre: "Víctor Erice",
    disciplina: "Cine",
    pais: "España",
    periodo: "1940–",
    obra: "El espíritu de la colmena",
    obras: ["El sur", "El sol del membrillo", "Cerrar los ojos"],
    etiquetas: ["infancia", "ausencia", "mirada", "memoria", "silencio"],
    dedicatoria:
      "Por comprender que la infancia mira el misterio antes de que los adultos hayan aprendido a nombrarlo.",
  },
  {
    nombre: "Abbas Kiarostami",
    disciplina: "Cine · Fotografía",
    pais: "Irán",
    periodo: "1940–2016",
    obra: "El sabor de las cerezas",
    obras: ["¿Dónde está la casa de mi amigo?", "Close-Up", "El viento nos llevará"],
    etiquetas: ["camino", "vida", "muerte", "realidad", "infancia"],
    dedicatoria:
      "Por encontrar en un camino, una conversación o un gesto mínimo la profundidad entera de una vida.",
  },
  {
    nombre: "Luis Buñuel",
    disciplina: "Cine",
    pais: "España · México · Francia",
    periodo: "1900–1983",
    obra: "El ángel exterminador",
    obras: ["Los olvidados", "Viridiana", "El discreto encanto de la burguesía"],
    etiquetas: ["deseo", "encierro", "surrealismo", "hambre", "burguesía"],
    dedicatoria:
      "Por abrir una grieta surrealista dentro del orden social y mostrar el deseo, el hambre y la hipocresía.",
  },
  {
    nombre: "Akira Kurosawa",
    disciplina: "Cine",
    pais: "Japón",
    periodo: "1910–1998",
    obra: "Rashōmon",
    obras: ["Ikiru", "Los siete samuráis", "Dersu Uzala"],
    etiquetas: ["verdad", "honor", "acción", "humanismo", "perspectiva"],
    dedicatoria:
      "Por mostrar que la verdad humana puede tener múltiples rostros sin perder su exigencia moral.",
  },

  {
    nombre: "Arvo Pärt",
    disciplina: "Música",
    pais: "Estonia",
    periodo: "1935–",
    obra: "Tabula Rasa",
    obras: ["Spiegel im Spiegel", "Fratres", "Te Deum"],
    etiquetas: ["silencio", "campana", "repetición", "trascendencia", "respiración"],
    dedicatoria:
      "Por demostrar que unas pocas notas pueden abrir un espacio inmenso para el silencio.",
  },
  {
    nombre: "Henryk Górecki",
    disciplina: "Música",
    pais: "Polonia",
    periodo: "1933–2010",
    obra: "Sinfonía n.º 3",
    obras: ["Beatus Vir", "Miserere", "Totus Tuus"],
    etiquetas: ["duelo", "madre", "repetición", "plegaria", "memoria"],
    dedicatoria:
      "Por convertir el duelo de una madre y de un pueblo en una música de compasión universal.",
  },
  {
    nombre: "Johann Sebastian Bach",
    disciplina: "Música",
    pais: "Alemania",
    periodo: "1685–1750",
    obra: "Pasión según San Mateo",
    obras: ["Variaciones Goldberg", "El arte de la fuga", "Misa en si menor"],
    etiquetas: ["contrapunto", "arquitectura", "fe", "orden", "infinito"],
    dedicatoria:
      "Por construir con sonido una arquitectura donde la emoción y el orden parecen tocar lo infinito.",
  },
  {
    nombre: "Gustav Mahler",
    disciplina: "Música",
    pais: "Bohemia · Austria",
    periodo: "1860–1911",
    obra: "Sinfonía n.º 9",
    obras: ["La canción de la tierra", "Sinfonía n.º 2", "Kindertotenlieder"],
    etiquetas: ["muerte", "naturaleza", "despedida", "mundo", "trascendencia"],
    dedicatoria:
      "Por intentar contener el mundo entero dentro de una sinfonía, incluida su despedida.",
  },
  {
    nombre: "Leonard Cohen",
    disciplina: "Música · Poesía",
    pais: "Canadá",
    periodo: "1934–2016",
    obra: "Songs of Leonard Cohen",
    obras: ["Various Positions", "Book of Longing", "You Want It Darker"],
    etiquetas: ["amor", "fractura", "oración", "deseo", "oscuridad"],
    dedicatoria:
      "Por encontrar una oración dentro de la fractura, el deseo y la imperfección humana.",
  },
  {
    nombre: "Claude Debussy",
    disciplina: "Música",
    pais: "Francia",
    periodo: "1862–1918",
    obra: "La mer",
    obras: ["Prélude à l'après-midi d'un faune", "Images", "Pelléas et Mélisande"],
    etiquetas: ["agua", "luz", "atmósfera", "sugerencia", "movimiento"],
    dedicatoria:
      "Por liberar la música para que pudiera comportarse como el agua, la luz y la memoria.",
  },

  {
    nombre: "Peter Zumthor",
    disciplina: "Arquitectura",
    pais: "Suiza",
    periodo: "1943–",
    obra: "Termas de Vals",
    obras: ["Bruder Klaus Field Chapel", "Kolumba Museum", "Steilneset Memorial"],
    etiquetas: ["materia", "atmósfera", "piedra", "silencio", "memoria"],
    dedicatoria:
      "Por enseñarnos que la materia, la temperatura y el silencio también construyen significado.",
  },
  {
    nombre: "Tadao Ando",
    disciplina: "Arquitectura",
    pais: "Japón",
    periodo: "1941–",
    obra: "Iglesia de la Luz",
    obras: ["Chichu Art Museum", "Templo del Agua", "Church on the Water"],
    etiquetas: ["hormigón", "luz", "vacío", "agua", "contemplación"],
    dedicatoria:
      "Por hacer que la luz y el vacío transformen el hormigón en una experiencia espiritual.",
  },
  {
    nombre: "James Turrell",
    disciplina: "Arte lumínico · Instalación",
    pais: "Estados Unidos",
    periodo: "1943–",
    obra: "Roden Crater",
    obras: ["Aten Reign", "Skyspaces", "Ganzfeld"],
    etiquetas: ["luz", "cielo", "percepción", "umbral", "vacío"],
    dedicatoria:
      "Por convertir la luz en materia y obligarnos a observar el propio acto de mirar.",
  },
  {
    nombre: "Isamu Noguchi",
    disciplina: "Escultura · Diseño",
    pais: "Estados Unidos · Japón",
    periodo: "1904–1988",
    obra: "The Isamu Noguchi Garden Museum",
    obras: ["Akari", "Black Sun", "California Scenario"],
    etiquetas: ["piedra", "jardín", "vacío", "objeto", "paisaje"],
    dedicatoria:
      "Por unir piedra, jardín, objeto y vacío hasta borrar la frontera entre arte y vida.",
  },
  {
    nombre: "Bill Viola",
    disciplina: "Videoarte",
    pais: "Estados Unidos",
    periodo: "1951–2024",
    obra: "The Crossing",
    obras: ["The Reflecting Pool", "Nantes Triptych", "The Dreamers"],
    etiquetas: ["agua", "fuego", "nacimiento", "muerte", "lentitud"],
    dedicatoria:
      "Por convertir el agua, el fuego y la lentitud en umbrales entre nacimiento y muerte.",
  },
  {
    nombre: "Sebastião Salgado",
    disciplina: "Fotografía",
    pais: "Brasil",
    periodo: "1944–",
    obra: "Éxodos",
    obras: ["Trabajadores", "Génesis", "Otras Américas"],
    etiquetas: ["migración", "trabajo", "dignidad", "tierra", "humanidad"],
    dedicatoria:
      "Por mirar el trabajo, el desplazamiento y la pobreza sin arrebatar dignidad a quienes fotografía.",
  },
  {
    nombre: "Francesca Woodman",
    disciplina: "Fotografía",
    pais: "Estados Unidos",
    periodo: "1958–1981",
    obra: "House Series",
    obras: ["Space²", "Providence", "Some Disordered Interior Geometries"],
    etiquetas: ["cuerpo", "desaparición", "casa", "movimiento", "fantasma"],
    dedicatoria:
      "Por hacer que el cuerpo aparezca y desaparezca dentro de la arquitectura como una memoria fugitiva.",
  },
  {
    nombre: "Pina Bausch",
    disciplina: "Danza · Teatro",
    pais: "Alemania",
    periodo: "1940–2009",
    obra: "Café Müller",
    obras: ["Kontakthof", "Nelken", "Vollmond"],
    etiquetas: ["cuerpo", "repetición", "deseo", "violencia", "memoria"],
    dedicatoria:
      "Por preguntar no cómo se mueve una persona, sino qué es aquello que la mueve.",
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

async function detectarFormatoListas() {
  const { data, error } = await supabase
    .from("artistas")
    .select("obras_esenciales, etiquetas")
    .limit(1);

  if (error) {
    throw new Error(`No se pudo inspeccionar la tabla: ${error.message}`);
  }

  const muestra = data?.[0];

  if (!muestra) {
    return "array";
  }

  if (
    Array.isArray(muestra.obras_esenciales) ||
    Array.isArray(muestra.etiquetas)
  ) {
    return "array";
  }

  return "texto";
}

function prepararRegistro(artista, formatoListas) {
  const convertir = (lista) =>
    formatoListas === "array" ? lista : lista.join(" | ");

  return {
    nombre: artista.nombre,
    disciplina: artista.disciplina,
    categoria: artista.disciplina,
    pais: artista.pais,
    territorio: artista.pais,
    periodo: artista.periodo,
    obra: artista.obra,
    obras_esenciales: convertir(artista.obras),
    etiquetas: convertir([
      ...artista.etiquetas,
      "Atlas Fundacional",
      "Tríptico",
    ]),
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

    const { error } = await supabase.from("artistas").insert(lote);

    if (error) {
      throw new Error(
        `Error insertando el lote ${i / tamano + 1}: ${error.message}`
      );
    }

    insertados += lote.length;
    console.log(`   ✓ ${insertados}/${registros.length} insertados`);
  }
}

/* =========================================================
   EJECUCIÓN
========================================================= */

async function ejecutar() {
  console.log("");
  console.log("══════════════════════════════════════════════");
  console.log(" ATLAS FUNDACIONAL · POEMA UNIVERSAL");
  console.log("══════════════════════════════════════════════");
  console.log("");

  if (artistas.length !== 50) {
    throw new Error(
      `El canon debe contener exactamente 50 artistas. Contiene ${artistas.length}.`
    );
  }

  const { data: existentes, error: errorExistentes } = await supabase
    .from("artistas")
    .select("id, nombre");

  if (errorExistentes) {
    throw new Error(
      `No se pudieron consultar los artistas existentes: ${errorExistentes.message}`
    );
  }

  const nombresExistentes = new Set(
    (existentes || []).map((artista) => claveNombre(artista.nombre))
  );

  const pendientes = artistas.filter(
    (artista) => !nombresExistentes.has(claveNombre(artista.nombre))
  );

  console.log(`Canon preparado: ${artistas.length}`);
  console.log(`Ya existentes: ${artistas.length - pendientes.length}`);
  console.log(`Pendientes: ${pendientes.length}`);
  console.log("");

  if (pendientes.length === 0) {
    console.log("✅ Los 50 artistas ya están presentes.");
    return;
  }

  let formato = await detectarFormatoListas();

  console.log(`Formato detectado para listas: ${formato}`);
  console.log("");

  let registros = pendientes.map((artista) =>
    prepararRegistro(artista, formato)
  );

  try {
    await insertarEnLotes(registros);
  } catch (primerError) {
    const formatoAlternativo =
      formato === "array" ? "texto" : "array";

    console.warn("");
    console.warn(`⚠️ Primer intento fallido: ${primerError.message}`);
    console.warn(
      `↻ Reintentando con formato ${formatoAlternativo}...`
    );
    console.warn("");

    formato = formatoAlternativo;

    registros = pendientes.map((artista) =>
      prepararRegistro(artista, formato)
    );

    await insertarEnLotes(registros);
  }

  const { count, error: errorConteo } = await supabase
    .from("artistas")
    .select("*", { count: "exact", head: true });

  if (errorConteo) {
    console.warn(
      `⚠️ No se pudo comprobar el total final: ${errorConteo.message}`
    );
  }

  console.log("");
  console.log("══════════════════════════════════════════════");
  console.log(" ✅ ATLAS FUNDACIONAL INSTALADO");
  console.log(` Artistas añadidos en esta ejecución: ${pendientes.length}`);
  console.log(` Registros totales en la tabla: ${count ?? "sin comprobar"}`);
  console.log("══════════════════════════════════════════════");
  console.log("");
}

ejecutar().catch((error) => {
  console.error("");
  console.error("❌ NO SE PUDO INSTALAR EL ATLAS");
  console.error(error.message);
  console.error("");
  process.exit(1);
});
