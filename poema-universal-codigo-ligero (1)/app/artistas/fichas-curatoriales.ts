export type HuellaCuratorial = {
  titulo: string;
  texto: string;
};

export type ObraCuratorial = {
  titulo: string;
  razon: string;
};

export type ConexionTriptico = {
  obra: string;
  relacion: string;
};

export type FichaCuratorial = {
  pregunta: string;
  introduccion: string;
  huellas: HuellaCuratorial[];
  aprendizajes: string[];
  obras: ObraCuratorial[];
  triptico: ConexionTriptico[];
  constelacion: string[];
};

export function normalizarNombreCuratorial(nombre: string) {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export const FICHAS_CURATORIALES: Record<
  string,
  FichaCuratorial
> = {
  [normalizarNombreCuratorial("Albert Camus")]: {
    pregunta:
      "¿Cómo vivir con dignidad cuando el mundo no ofrece ninguna respuesta?",

    introduccion:
      "Camus no convirtió el absurdo en una excusa para abandonar el mundo. Lo convirtió en una exigencia de lucidez, medida y solidaridad. Frente al silencio del universo, su obra elige permanecer junto a los seres humanos.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La distancia entre el deseo humano de sentido y un mundo que no responde.",
      },
      {
        titulo: "La respuesta",
        texto:
          "Vivir sin consuelo falso, pero también sin renunciar a la belleza, la compasión ni la rebelión.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Una escritura clara, física y luminosa, donde el sol, el mar, la peste y la piedra cargan con el pensamiento.",
      },
    ],

    aprendizajes: [
      "Sostener una contradicción sin resolverla artificialmente.",
      "Convertir una idea filosófica en una experiencia corporal y narrativa.",
      "Utilizar símbolos elementales —sol, mar, piedra, enfermedad— sin agotarlos mediante explicaciones.",
      "Conservar la belleza incluso cuando la obra contempla el sufrimiento.",
      "Entender la rebelión como una defensa de la dignidad compartida.",
    ],

    obras: [
      {
        titulo: "El extranjero",
        razon:
          "La extrañeza del individuo ante las normas, los gestos y los juicios de la sociedad.",
      },
      {
        titulo: "El mito de Sísifo",
        razon:
          "La formulación del absurdo y la decisión de vivir sin apelación.",
      },
      {
        titulo: "La peste",
        razon:
          "La solidaridad como respuesta concreta frente al sufrimiento colectivo.",
      },
      {
        titulo: "El hombre rebelde",
        razon:
          "Los límites éticos de la rebelión y la negativa a justificar el crimen.",
      },
      {
        titulo: "El primer hombre",
        razon:
          "La pobreza, la infancia argelina, la madre y la memoria de los orígenes.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La dignidad frente a una violencia que no puede repararse; el árbol blanco como testigo silencioso de un mundo que no explica la herida.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "La rebelión del cuerpo frente a los sistemas que distribuyen alimento, amor, reconocimiento y existencia.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La vida dentro de una condición incomprensible: la llamada, el laberinto y la necesidad de actuar aunque ninguna ley revele su sentido completo.",
      },
    ],

    constelacion: [
      "Franz Kafka",
      "Simone Weil",
      "Samuel Beckett",
      "José Saramago",
      "Andrei Tarkovski",
      "Abbas Kiarostami",
    ],
  },

  [normalizarNombreCuratorial("Jorge Luis Borges")]: {
    pregunta:
      "¿Qué ocurre cuando el universo es un libro que nunca termina de escribirse?",

    introduccion:
      "Borges convirtió la literatura en una forma de pensamiento. Sus cuentos abren bibliotecas infinitas, espejos, dobles, bifurcaciones y laberintos donde una idea puede adquirir la intensidad de una revelación. No trató de explicar el mundo: mostró que quizá el mundo ya era una ficción que todavía no habíamos aprendido a leer.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La sospecha de que ninguna identidad, recuerdo o realidad posee un centro estable.",
      },
      {
        titulo: "La luz",
        texto:
          "La posibilidad de convertir el infinito, el tiempo y la memoria en formas narrativas precisas.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Una prosa exacta, intelectual y misteriosa, capaz de contener universos enteros en unas pocas páginas.",
      },
    ],

    aprendizajes: [
      "Construir profundidad sin depender de la extensión.",
      "Transformar una idea abstracta en una arquitectura narrativa.",
      "Permitir que un símbolo conserve varias interpretaciones simultáneas.",
      "Usar la erudición como materia poética y no como exhibición.",
      "Recordar que toda lectura modifica también a quien lee.",
    ],

    obras: [
      {
        titulo: "Ficciones",
        razon:
          "Una biblioteca de mundos posibles donde el relato se convierte en laberinto, espejo y pregunta metafísica.",
      },
      {
        titulo: "El Aleph",
        razon:
          "La experiencia imposible de contemplar todos los lugares del universo desde un único punto.",
      },
      {
        titulo: "El libro de arena",
        razon:
          "El vértigo de un objeto infinito que destruye la tranquilidad de quien intenta poseerlo.",
      },
      {
        titulo: "Historia universal de la infamia",
        razon:
          "La identidad como máscara, montaje y reescritura de historias anteriores.",
      },
      {
        titulo: "El hacedor",
        razon:
          "La memoria, la ceguera y la creación reunidas en una obra íntima y fragmentaria.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "El libro de las siete reliquias y la transmisión final convierten la memoria en un archivo que atraviesa cuerpos, países y generaciones.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El descenso, las puertas y los espacios imposibles responden a una arquitectura donde cada elección contiene otros mundos.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Bielka y su laberinto participan de una lógica borgiana: una geografía real cuya ley última permanece fuera del alcance de quienes la habitan.",
      },
    ],

    constelacion: [
      "Franz Kafka",
      "Julio Cortázar",
      "Italo Calvino",
      "Fernando Pessoa",
      "Andrei Tarkovski",
      "Kōbō Abe",
    ],
  },

  [normalizarNombreCuratorial("Franz Kafka")]: {
    pregunta:
      "¿Puede una persona conservar su humanidad dentro de un sistema que nunca revela sus reglas?",

    introduccion:
      "Kafka comprendió que el terror moderno no necesitaba monstruos visibles. Bastaban una puerta, una oficina, una acusación sin causa o una ley inaccesible. Su obra convirtió la impotencia cotidiana en una experiencia metafísica y mostró que la culpa puede preceder incluso al delito.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La experiencia de ser juzgado, transformado o excluido sin comprender nunca por qué.",
      },
      {
        titulo: "La luz",
        texto:
          "La precisión con la que reveló el absurdo escondido dentro de instituciones aparentemente normales.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Una prosa sobria y casi administrativa que vuelve todavía más inquietante aquello que describe.",
      },
    ],

    aprendizajes: [
      "Crear angustia sin explicar completamente su causa.",
      "Usar espacios cotidianos como máquinas simbólicas.",
      "Mostrar el poder mediante procedimientos, esperas y silencios.",
      "Evitar que el símbolo se reduzca a una única lectura.",
      "Mantener una voz precisa incluso dentro de una realidad imposible.",
    ],

    obras: [
      {
        titulo: "La metamorfosis",
        razon:
          "La transformación física como revelación brutal de la fragilidad del amor, la utilidad y la pertenencia.",
      },
      {
        titulo: "El proceso",
        razon:
          "La justicia convertida en un sistema infinito que acusa sin revelar la falta.",
      },
      {
        titulo: "El castillo",
        razon:
          "La imposibilidad de acceder al centro del poder y el agotamiento producido por una espera interminable.",
      },
      {
        titulo: "América",
        razon:
          "El desplazamiento del individuo dentro de un mundo gigantesco, extraño y administrado por otros.",
      },
      {
        titulo: "Carta al padre",
        razon:
          "La autoridad, el miedo y la imposibilidad de alcanzar una relación justa mediante el lenguaje.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La búsqueda de justicia tras la violencia se enfrenta a estructuras que no devuelven sentido ni reparación suficiente.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Las estaciones subterráneas funcionan como organismos administrativos y morales que clasifican cuerpos, necesidades y voces.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La llamada y el laberinto constituyen una ley incomprensible ante la que cada habitante debe actuar sin conocer el tribunal ni la sentencia.",
      },
    ],

    constelacion: [
      "Jorge Luis Borges",
      "Samuel Beckett",
      "Albert Camus",
      "Kōbō Abe",
      "László Krasznahorkai",
      "Béla Tarr",
    ],
  },

  [normalizarNombreCuratorial("José Saramago")]: {
    pregunta:
      "¿Qué responsabilidad tiene una persona cuando toda la sociedad decide dejar de mirar?",

    introduccion:
      "Saramago utilizó situaciones imposibles para revelar comportamientos profundamente reales. Una epidemia de ceguera, una muerte interrumpida o una ciudad que vota en blanco se convierten en pruebas morales. Su escritura examina cómo el poder, el miedo y la compasión transforman a una comunidad.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La facilidad con la que una sociedad normaliza el sufrimiento cuando deja de reconocer al otro.",
      },
      {
        titulo: "La luz",
        texto:
          "La solidaridad humilde como una forma de resistencia frente a la deshumanización.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Una voz oral, irónica y continua que convierte la narración en conciencia colectiva.",
      },
    ],

    aprendizajes: [
      "Usar una premisa extraordinaria para estudiar conductas ordinarias.",
      "Construir una voz narrativa capaz de pensar junto al lector.",
      "Combinar ironía, ternura y dureza sin separarlas.",
      "Convertir a la comunidad en verdadero personaje.",
      "Preguntar por la responsabilidad individual dentro de una catástrofe colectiva.",
    ],

    obras: [
      {
        titulo: "Ensayo sobre la ceguera",
        razon:
          "La pérdida de la visión física como revelación de una ceguera moral previa.",
      },
      {
        titulo: "El Evangelio según Jesucristo",
        razon:
          "La revisión humana, política y compasiva de un relato fundacional.",
      },
      {
        titulo: "Todos los nombres",
        razon:
          "La búsqueda de una desconocida como rebelión frente al anonimato burocrático.",
      },
      {
        titulo: "Las intermitencias de la muerte",
        razon:
          "La ausencia de muerte convertida en crisis social, administrativa y afectiva.",
      },
      {
        titulo: "La balsa de piedra",
        razon:
          "Una península que se desprende como imagen política, geográfica y existencial.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La memoria de María exige mirar aquello que una comunidad preferiría convertir en silencio o expediente.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El hambre deja de ser individual y revela una organización social donde unos cuerpos reciben alimento y otros apenas reconocimiento.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La comunidad residual debe inventar formas de cuidado dentro de un mundo sin institución capaz de explicar su destino.",
      },
    ],

    constelacion: [
      "Albert Camus",
      "Simone Weil",
      "Franz Kafka",
      "Toni Morrison",
      "Juan Rulfo",
      "Doris Salcedo",
    ],
  },

  [normalizarNombreCuratorial("Simone Weil")]: {
    pregunta:
      "¿Es posible mirar verdaderamente el sufrimiento de otro sin convertirlo en una posesión propia?",

    introduccion:
      "Simone Weil hizo de la atención una forma radical de ética. Pensó desde la fábrica, la guerra, el hambre, la gravedad y la experiencia espiritual. Su obra no busca consolar: exige mirar sin apartarse y renunciar al deseo de ocupar el centro.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La desdicha que reduce a una persona a cosa y destruye incluso su capacidad de ser escuchada.",
      },
      {
        titulo: "La luz",
        texto:
          "La atención absoluta como forma de amor que no invade ni utiliza al otro.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Una escritura austera y luminosa donde pensamiento, experiencia física y exigencia moral permanecen unidos.",
      },
    ],

    aprendizajes: [
      "Mirar antes de interpretar.",
      "No utilizar el dolor ajeno como ornamento narrativo.",
      "Comprender el poder desde su efecto sobre los cuerpos.",
      "Dar espacio al silencio y a la ausencia.",
      "Aceptar que una obra ética también debe cuestionar a quien la crea.",
    ],

    obras: [
      {
        titulo: "La gravedad y la gracia",
        razon:
          "Fragmentos sobre fuerza, desapego, vacío y atención espiritual.",
      },
      {
        titulo: "Echar raíces",
        razon:
          "La necesidad humana de pertenencia frente al desarraigo político y social.",
      },
      {
        titulo: "La condición obrera",
        razon:
          "La fábrica contemplada desde la experiencia directa del agotamiento y la obediencia.",
      },
      {
        titulo: "La Ilíada o el poema de la fuerza",
        razon:
          "La fuerza como poder que convierte a quien la sufre y a quien la ejerce en cosa.",
      },
      {
        titulo: "Carta a un religioso",
        razon:
          "La búsqueda espiritual sostenida desde la distancia crítica ante las instituciones.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La obra intenta sostener la atención sobre María sin convertir su violencia en espectáculo ni reducirla a símbolo.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El hambre se presenta como fuerza material que altera dignidad, voluntad, cuerpo y pertenencia.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Los habitantes se enfrentan al desarraigo absoluto: existir sin mundo anterior y sin promesa clara de llegada.",
      },
    ],

    constelacion: [
      "Albert Camus",
      "María Zambrano",
      "Hannah Arendt",
      "Franz Kafka",
      "Doris Salcedo",
      "Primo Levi",
    ],
  },

  [normalizarNombreCuratorial("María Zambrano")]: {
    pregunta:
      "¿Puede el pensamiento descender hasta aquello que la razón por sí sola no alcanza?",

    introduccion:
      "María Zambrano buscó una forma de conocimiento que no expulsara el sueño, la música, la herida ni la revelación. Su razón poética no abandona el pensamiento: lo vuelve hospitalario para todo aquello que solo aparece cuando la conciencia aprende a escuchar.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "El exilio y la separación entre pensamiento, vida, cuerpo y misterio.",
      },
      {
        titulo: "La luz",
        texto:
          "La razón poética como conocimiento que avanza sin destruir aquello que intenta comprender.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Una prosa meditativa, musical y visionaria que piensa mediante imágenes.",
      },
    ],

    aprendizajes: [
      "Pensar sin expulsar la intuición ni el sueño.",
      "Permitir que una imagen contenga conocimiento.",
      "Escribir desde el umbral entre filosofía y poesía.",
      "Tratar el exilio como una condición interior además de geográfica.",
      "Buscar claridad sin cancelar el misterio.",
    ],

    obras: [
      {
        titulo: "Claros del bosque",
        razon:
          "El conocimiento entendido como aparición: una claridad breve dentro de la espesura.",
      },
      {
        titulo: "El hombre y lo divino",
        razon:
          "La relación entre conciencia, sacrificio, historia y experiencia de lo sagrado.",
      },
      {
        titulo: "Filosofía y poesía",
        razon:
          "La separación y el posible reencuentro entre dos formas de conocimiento.",
      },
      {
        titulo: "Delirio y destino",
        razon:
          "Autobiografía, pensamiento histórico y experiencia del exilio reunidos.",
      },
      {
        titulo: "Los sueños y el tiempo",
        razon:
          "El sueño como estructura de la conciencia y forma particular de temporalidad.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "El Árbol Blanco funciona como un claro donde memoria, violencia y revelación se reúnen sin convertirse en explicación cerrada.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El descenso subterráneo permite pensar mediante espacios, cuerpos y símbolos antes que mediante argumentos.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Bielka es una realidad de umbral donde identidad, muerte y memoria solo pueden comprenderse mediante una razón poética.",
      },
    ],

    constelacion: [
      "Simone Weil",
      "Rainer Maria Rilke",
      "Clarice Lispector",
      "Jon Fosse",
      "Tarkovski",
      "Olga Tokarczuk",
    ],
  },

  [normalizarNombreCuratorial("Samuel Beckett")]: {
    pregunta:
      "¿Qué queda del ser humano cuando ya no puede esperar ninguna solución?",

    introduccion:
      "Beckett retiró de la escena casi todo: argumento, progreso, certeza, incluso identidad. En ese espacio reducido dejó cuerpos que esperan, hablan, fracasan y continúan. Su obra descubre una dignidad mínima en el gesto de persistir cuando la esperanza ya no organiza el tiempo.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La imposibilidad de terminar, avanzar o encontrar una razón suficiente para continuar.",
      },
      {
        titulo: "La luz",
        texto:
          "El humor, la compañía y la persistencia que sobreviven incluso dentro del fracaso.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Una escritura despojada donde repetición, pausa y silencio se convierten en materia dramática.",
      },
    ],

    aprendizajes: [
      "Eliminar hasta descubrir qué resulta verdaderamente imprescindible.",
      "Utilizar el silencio como acción.",
      "Construir ritmo mediante repetición y espera.",
      "Encontrar humor sin negar la desesperación.",
      "Permitir que un personaje exista incluso cuando ya no puede transformarse.",
    ],

    obras: [
      {
        titulo: "Esperando a Godot",
        razon:
          "La espera convertida en condición humana, rito, comedia y condena.",
      },
      {
        titulo: "Final de partida",
        razon:
          "Un mundo agotado donde dependencia, crueldad y afecto ya no pueden separarse.",
      },
      {
        titulo: "Molloy",
        razon:
          "La identidad y el relato desintegrándose mientras la voz continúa.",
      },
      {
        titulo: "Malone muere",
        razon:
          "Narrar como último gesto ante la inmovilidad y la proximidad del final.",
      },
      {
        titulo: "El innombrable",
        razon:
          "Una voz sin cuerpo estable que no puede callar ni afirmar plenamente quién habla.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La espera de reparación convive con la certeza de que ninguna respuesta devolverá lo perdido.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Los personajes continúan avanzando por espacios donde toda salida puede ser otra forma de repetición.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La existencia sin envejecimiento ni muerte ordinaria convierte la espera en una estructura ontológica.",
      },
    ],

    constelacion: [
      "Franz Kafka",
      "Jon Fosse",
      "Béla Tarr",
      "Albert Camus",
      "László Krasznahorkai",
      "Pina Bausch",
    ],
  },

  [normalizarNombreCuratorial("Clarice Lispector")]: {
    pregunta:
      "¿Qué aparece cuando una conciencia deja de protegerse de sí misma?",

    introduccion:
      "Clarice Lispector llevó la narración hacia el instante en que una vida cotidiana se abre y deja ver algo insoportable, animal o sagrado. Sus personajes no descubren respuestas: atraviesan una transformación interior que altera la forma de mirar una habitación, un cuerpo o una cucaracha.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La distancia entre la identidad que una persona representa y la vida desconocida que existe dentro de ella.",
      },
      {
        titulo: "La luz",
        texto:
          "La revelación de que lo extraordinario puede surgir en el centro de lo doméstico.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Una prosa sensorial e interrogativa que parece escribir mientras descubre aquello que intenta decir.",
      },
    ],

    aprendizajes: [
      "Narrar el movimiento interior con intensidad física.",
      "Convertir un objeto cotidiano en acontecimiento metafísico.",
      "Escribir desde la incertidumbre sin ocultarla.",
      "Permitir que la voz se contradiga y se transforme.",
      "Tratar el lenguaje como una búsqueda y no como un recipiente cerrado.",
    ],

    obras: [
      {
        titulo: "La pasión según G. H.",
        razon:
          "El encuentro con una cucaracha destruye la identidad social y abre una experiencia radical de existencia.",
      },
      {
        titulo: "La hora de la estrella",
        razon:
          "La vida de Macabéa y la responsabilidad del narrador ante una existencia casi invisible.",
      },
      {
        titulo: "Cerca del corazón salvaje",
        razon:
          "La conciencia femenina explorada desde su intensidad, contradicción y deseo.",
      },
      {
        titulo: "Lazos de familia",
        razon:
          "La grieta que aparece dentro de matrimonios, hogares y gestos aparentemente normales.",
      },
      {
        titulo: "Agua viva",
        razon:
          "La escritura intentando alcanzar el instante anterior a toda forma estable.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La memoria corporal y el objeto-reliquia abren accesos a experiencias que no pueden formularse mediante una narración lineal.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El hambre transforma identidad, percepción y lenguaje antes de convertirse en argumento.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Mara nace como conciencia en formación y elige su nombre cuando descubre que existir también implica inventarse.",
      },
    ],

    constelacion: [
      "Virginia Woolf",
      "María Zambrano",
      "Han Kang",
      "Alejandra Pizarnik",
      "Franz Kafka",
      "Yoko Tawada",
    ],
  },

  [normalizarNombreCuratorial("Fernando Pessoa")]: {
    pregunta:
      "¿Cuántas vidas puede contener una sola conciencia?",

    introduccion:
      "Pessoa no utilizó seudónimos: creó autores completos, con biografías, estilos, ideas y relaciones propias. Convirtió la identidad en un teatro interior y mostró que el yo quizá no sea una unidad, sino una multitud que aprende a escribirse.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La imposibilidad de habitar una identidad única sin sentir todo lo que queda fuera de ella.",
      },
      {
        titulo: "La luz",
        texto:
          "La multiplicidad como forma de libertad creadora y conocimiento de uno mismo.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Voces distintas que construyen filosofías, ritmos y sensibilidades incompatibles dentro de una misma obra.",
      },
    ],

    aprendizajes: [
      "Crear voces con autonomía real.",
      "Separar autor, narrador, personaje y conciencia.",
      "Utilizar la contradicción como arquitectura.",
      "Explorar el yo mediante máscaras que revelan en lugar de ocultar.",
      "Aceptar que una obra puede contener poéticas enfrentadas.",
    ],

    obras: [
      {
        titulo: "Libro del desasosiego",
        razon:
          "El diario fragmentario de una conciencia que observa la vida desde la distancia.",
      },
      {
        titulo: "Mensaje",
        razon:
          "Historia, mito y destino portugués reorganizados mediante una visión simbólica.",
      },
      {
        titulo: "Poemas de Alberto Caeiro",
        razon:
          "La tentativa de mirar las cosas sin añadirles una metafísica.",
      },
      {
        titulo: "Odas de Ricardo Reis",
        razon:
          "Disciplina clásica, conciencia de la fugacidad y aceptación contenida del destino.",
      },
      {
        titulo: "Poesía de Álvaro de Campos",
        razon:
          "Exceso, modernidad, deseo, cansancio y multiplicación emocional del yo.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Las voces, reliquias y memorias permiten que una identidad continúe fuera del cuerpo que la sostuvo.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Los personajes son observados desde distintas formas de hambre que alteran quiénes creen ser.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Mara reúne huellas de María y Sayonara, pero convierte esa herencia en una identidad elegida y nueva.",
      },
    ],

    constelacion: [
      "Jorge Luis Borges",
      "Clarice Lispector",
      "Virginia Woolf",
      "Franz Kafka",
      "Alejandra Pizarnik",
      "Italo Calvino",
    ],
  },

  [normalizarNombreCuratorial("Julio Cortázar")]: {
    pregunta:
      "¿Dónde termina la realidad cuando una pequeña fisura permite que entre lo imposible?",

    introduccion:
      "Cortázar descubrió que lo fantástico no necesitaba castillos lejanos. Podía aparecer en una casa, un juego, un trayecto cotidiano o una puerta mal cerrada. Su escritura transforma la lectura en participación y obliga a sospechar de la superficie aparentemente estable del mundo.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La insuficiencia de una realidad organizada por hábitos, nombres y explicaciones previsibles.",
      },
      {
        titulo: "La luz",
        texto:
          "El juego como forma seria de conocimiento y liberación de la percepción.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Una prosa rítmica, lúdica y precisa que permite que lo imposible aparezca sin anunciarse.",
      },
    ],

    aprendizajes: [
      "Introducir lo extraño sin romper el tono cotidiano.",
      "Convertir la estructura del libro en parte de su significado.",
      "Utilizar el juego para cuestionar las reglas.",
      "Confiar en la inteligencia activa del lector.",
      "Crear umbrales donde dos realidades puedan coexistir.",
    ],

    obras: [
      {
        titulo: "Rayuela",
        razon:
          "Una novela abierta que convierte el orden de lectura en decisión, búsqueda y fracaso.",
      },
      {
        titulo: "Bestiario",
        razon:
          "Lo fantástico penetrando silenciosamente en hogares, vínculos y costumbres.",
      },
      {
        titulo: "Final del juego",
        razon:
          "Infancia, crueldad, imaginación y extrañeza reunidas en relatos de precisión extraordinaria.",
      },
      {
        titulo: "Las armas secretas",
        razon:
          "La identidad, el tiempo y la violencia alterando aquello que parecía real.",
      },
      {
        titulo: "62/Modelo para armar",
        razon:
          "Personajes, ciudades y escenas conectados mediante una estructura fragmentaria y móvil.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Las reliquias funcionan como accesos donde pasado y presente dejan de permanecer separados.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El descenso convierte la ciudad reconocible en una arquitectura fantástica gobernada por reglas propias.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "El laberinto no es alegoría exterior, sino espacio real que transforma el tiempo, el cuerpo y la identidad.",
      },
    ],

    constelacion: [
      "Jorge Luis Borges",
      "Italo Calvino",
      "Franz Kafka",
      "Leonora Carrington",
      "Remedios Varo",
      "David Lynch",
    ],
  },


  [normalizarNombreCuratorial("Olga Tokarczuk")]: {
    pregunta:
      "¿Puede una historia contener al mismo tiempo un cuerpo, un territorio y todas las vidas que lo atravesaron?",

    introduccion:
      "Tokarczuk construye novelas como constelaciones. Sus relatos se desplazan entre épocas, especies, fronteras y conciencias sin aceptar que una sola voz posea la verdad completa. En su obra, viajar no significa únicamente cambiar de lugar: significa abandonar la ilusión de una identidad inmóvil.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La fragmentación del mundo y la imposibilidad de reducir una vida a una única narración.",
      },
      {
        titulo: "La luz",
        texto:
          "La mirada capaz de conectar cuerpos, animales, mapas, mitos y memorias aparentemente dispersas.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Una narración móvil y polifónica que piensa mediante fragmentos, recorridos y asociaciones.",
      },
    ],

    aprendizajes: [
      "Construir una novela como red y no únicamente como línea.",
      "Cambiar de escala entre lo íntimo, lo histórico y lo cósmico.",
      "Permitir que distintas voces cuestionen la autoridad narrativa.",
      "Tratar el territorio como organismo vivo.",
      "Encontrar conexiones sin borrar las diferencias.",
    ],

    obras: [
      {
        titulo: "Los errantes",
        razon:
          "El viaje, el cuerpo y la identidad reunidos en una estructura fragmentaria y migratoria.",
      },
      {
        titulo: "Los libros de Jacob",
        razon:
          "Una comunidad histórica reconstruida desde múltiples perspectivas, lenguas y desplazamientos.",
      },
      {
        titulo: "Sobre los huesos de los muertos",
        razon:
          "Justicia, violencia contra los animales y excentricidad moral dentro de una intriga fronteriza.",
      },
      {
        titulo: "Un lugar llamado Antaño",
        razon:
          "La historia de un pueblo convertida en mito, memoria y ciclo natural.",
      },
      {
        titulo: "Casa diurna, casa nocturna",
        razon:
          "El territorio como archivo de sueños, vidas, cuerpos y leyendas superpuestas.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Las reliquias y desplazamientos construyen una memoria que sobrevive mediante objetos, relatos y territorios.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "La ciudad subterránea aparece como un ecosistema de cuerpos, voces, necesidades y reglas conectadas.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Bielka reúne tiempos, procedencias y muertes incompletas dentro de una geografía que funciona como archivo vivo.",
      },
    ],

    constelacion: [
      "Jorge Luis Borges",
      "Italo Calvino",
      "Juan Rulfo",
      "Han Kang",
      "Yoko Tawada",
      "W. G. Sebald",
    ],
  },

  [normalizarNombreCuratorial("Jon Fosse")]: {
    pregunta:
      "¿Qué puede revelar una voz cuando deja de avanzar y comienza a repetirse?",

    introduccion:
      "Fosse escribe como si el lenguaje respirara. Sus frases vuelven, se interrumpen y regresan ligeramente transformadas. En esa repetición aparecen el miedo, el amor, la fe, la muerte y aquello que no puede nombrarse directamente.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La imposibilidad de comunicar completamente aquello que una conciencia vive.",
      },
      {
        titulo: "La luz",
        texto:
          "La repetición como acceso a una presencia más profunda que el argumento.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Una prosa rítmica y respiratoria donde la pausa contiene tanto como la palabra.",
      },
    ],

    aprendizajes: [
      "Escuchar el ritmo interno de una frase.",
      "Utilizar la repetición como transformación.",
      "Escribir el silencio sin explicarlo.",
      "Reducir la acción para intensificar la presencia.",
      "Permitir que lo espiritual aparezca sin convertirse en doctrina.",
    ],

    obras: [
      {
        titulo: "Septología",
        razon:
          "Identidad, duplicidad, arte, pérdida y fe sostenidos por una única respiración narrativa.",
      },
      {
        titulo: "Trilogía",
        razon:
          "Amor, pobreza, culpa y trascendencia en una historia de extrema concentración.",
      },
      {
        titulo: "Melancolía",
        razon:
          "La conciencia del pintor Lars Hertervig atrapada entre creación, fragilidad y desintegración.",
      },
      {
        titulo: "Alguien va a venir",
        razon:
          "El deseo de aislamiento destruido por la sospecha y la presencia del otro.",
      },
      {
        titulo: "Mañana y tarde",
        razon:
          "Nacimiento, muerte y continuidad contemplados desde una serenidad radical.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La repetición de símbolos y silencios permite que el duelo permanezca sin quedar cerrado.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El descenso adquiere un ritmo ritual donde cada espacio modifica lentamente la percepción.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La llamada, la espera y el tiempo no lineal de la conciencia encuentran una resonancia profundamente fossiana.",
      },
    ],

    constelacion: [
      "Samuel Beckett",
      "Rainer Maria Rilke",
      "María Zambrano",
      "Béla Tarr",
      "Arvo Pärt",
      "Han Kang",
    ],
  },

  [normalizarNombreCuratorial("Han Kang")]: {
    pregunta:
      "¿Qué recuerda el cuerpo cuando el lenguaje ya no puede sostener el dolor?",

    introduccion:
      "Han Kang escribe desde cuerpos atravesados por violencia, memoria y transformación. Sus personajes intentan abandonar aquello que los daña, pero descubren que la historia permanece inscrita en la carne, en los gestos y en los silencios.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La violencia histórica y familiar que continúa viviendo dentro del cuerpo.",
      },
      {
        titulo: "La luz",
        texto:
          "La delicadeza como forma de resistencia frente a aquello que pretende destruirla.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Una prosa contenida, sensorial y fragmentaria donde belleza y devastación permanecen unidas.",
      },
    ],

    aprendizajes: [
      "Tratar el cuerpo como archivo narrativo.",
      "Escribir la violencia sin convertirla en espectáculo.",
      "Utilizar imágenes delicadas para sostener experiencias extremas.",
      "Permitir que el silencio tenga consecuencias físicas.",
      "Explorar la transformación sin reducirla a metáfora.",
    ],

    obras: [
      {
        titulo: "La vegetariana",
        razon:
          "La negativa del cuerpo como rebelión frente a la violencia, la familia y la normalidad.",
      },
      {
        titulo: "Actos humanos",
        razon:
          "Una memoria coral de la masacre de Gwangju y de los cuerpos que la historia intenta silenciar.",
      },
      {
        titulo: "Blanco",
        razon:
          "Duelo, nacimiento y ausencia construidos mediante objetos y variaciones del color blanco.",
      },
      {
        titulo: "La clase de griego",
        razon:
          "Dos pérdidas —la voz y la visión— convertidas en una forma frágil de encuentro.",
      },
      {
        titulo: "Imposible decir adiós",
        razon:
          "La violencia histórica regresando mediante memoria, nieve, sueños y vínculos entre mujeres.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "El cuerpo de María y el Árbol Blanco sostienen una memoria que no puede reducirse al relato judicial de la violencia.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El hambre y la transformación corporal revelan sistemas de dominación inscritos directamente en la carne.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Mara nace entre restos de memoria y debe construir una identidad sin negar las huellas corporales que la preceden.",
      },
    ],

    constelacion: [
      "Clarice Lispector",
      "Alejandra Pizarnik",
      "Simone Weil",
      "Doris Salcedo",
      "Käthe Kollwitz",
      "Chiharu Shiota",
    ],
  },

  [normalizarNombreCuratorial("Ágota Kristóf")]: {
    pregunta:
      "¿Qué le sucede al lenguaje cuando sobrevivir exige dejar de sentir?",

    introduccion:
      "Kristóf escribe con una sequedad que parece haber eliminado toda protección sentimental. Sus frases breves, sus niños endurecidos y sus identidades inciertas muestran cómo la guerra transforma la verdad, la memoria y la capacidad de amar.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La infancia obligada a convertirse en disciplina, mentira y resistencia.",
      },
      {
        titulo: "La luz",
        texto:
          "La precisión radical con la que una frase desnuda puede contener una catástrofe completa.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Una escritura austera, directa y aparentemente objetiva que vuelve insoportable aquello que calla.",
      },
    ],

    aprendizajes: [
      "Eliminar sentimentalismo sin eliminar emoción.",
      "Construir violencia mediante hechos y no explicaciones.",
      "Utilizar una voz limitada para crear ambigüedad.",
      "Convertir la identidad en problema estructural.",
      "Confiar en la fuerza de una frase simple.",
    ],

    obras: [
      {
        titulo: "El gran cuaderno",
        razon:
          "Dos hermanos entrenan su cuerpo y su conciencia para sobrevivir a la guerra.",
      },
      {
        titulo: "La prueba",
        razon:
          "La separación, la memoria y la identidad comienzan a desestabilizar la verdad del primer libro.",
      },
      {
        titulo: "La tercera mentira",
        razon:
          "La narración revela que toda certeza anterior podía ser una construcción defensiva.",
      },
      {
        titulo: "Ayer",
        razon:
          "Exilio, deseo e imposibilidad de pertenecer expresados con extrema concentración.",
      },
      {
        titulo: "La analfabeta",
        razon:
          "La experiencia de perder una lengua y convertirse en escritora dentro de otra.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La infancia y la violencia obligan a conservar memoria mediante formas fragmentarias y defensivas.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Sobrevivir exige adoptar reglas que transforman gradualmente el cuerpo y la conciencia.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Iván y Lev encarnan una infancia sometida a una ley incomprensible donde memoria y verdad pueden separarse.",
      },
    ],

    constelacion: [
      "Han Kang",
      "Franz Kafka",
      "Primo Levi",
      "Samuel Beckett",
      "Herta Müller",
      "László Krasznahorkai",
    ],
  },

  [normalizarNombreCuratorial("László Krasznahorkai")]: {
    pregunta:
      "¿Cómo continuar cuando el mundo parece haber agotado todas sus posibilidades?",

    introduccion:
      "Krasznahorkai escribe desde el borde del colapso. Sus frases avanzan durante páginas, arrastrando pensamientos, ruinas, lluvia, miedo y deseo de salvación. En sus novelas, la catástrofe no llega de repente: ya estaba instalada en el paisaje.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La sensación de habitar un mundo que se descompone sin llegar nunca a terminar.",
      },
      {
        titulo: "La luz",
        texto:
          "La persistencia de una belleza extraña incluso dentro de la ruina y el agotamiento.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Frases extensas y envolventes que convierten la lectura en desplazamiento físico y mental.",
      },
    ],

    aprendizajes: [
      "Construir atmósfera mediante sintaxis.",
      "Hacer del paisaje una conciencia.",
      "Mantener tensión sin depender de acontecimientos constantes.",
      "Escribir el deterioro como proceso.",
      "Permitir que belleza y amenaza aparezcan en la misma imagen.",
    ],

    obras: [
      {
        titulo: "Sátántangó",
        razon:
          "Una comunidad arruinada espera una salvación que puede ser otra forma de engaño.",
      },
      {
        titulo: "Melancolía de la resistencia",
        razon:
          "Una ciudad, una ballena y una multitud transforman el desorden en fuerza política.",
      },
      {
        titulo: "Guerra y guerra",
        razon:
          "Un archivista intenta salvar un manuscrito mientras su propia conciencia se desintegra.",
      },
      {
        titulo: "Ha llegado Isaías",
        razon:
          "Una voz perdida atraviesa un territorio moral y emocional devastado.",
      },
      {
        titulo: "El último lobo",
        razon:
          "Extinción, relato y culpa reunidos en una única corriente verbal.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La ruina moral permanece en el paisaje y en los objetos incluso cuando los personajes intentan continuar.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El descenso prolongado y sus estaciones construyen una sensación de sistema agotado que todavía continúa funcionando.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "El tiempo suspendido, la comunidad residual y el laberinto convierten la existencia en una espera sin resolución.",
      },
    ],

    constelacion: [
      "Béla Tarr",
      "Samuel Beckett",
      "Franz Kafka",
      "Jon Fosse",
      "Thomas Bernhard",
      "Ágota Kristóf",
    ],
  },

  [normalizarNombreCuratorial("Alejandra Pizarnik")]: {
    pregunta:
      "¿Puede el lenguaje alcanzar aquello que solo existe cuando callamos?",

    introduccion:
      "Pizarnik convirtió el poema en una habitación donde la palabra se enfrenta a su propia insuficiencia. La infancia, la noche, la muerte, el deseo y el silencio aparecen como presencias que no pueden explicarse, únicamente invocarse.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La distancia entre la experiencia interior y las palabras disponibles para nombrarla.",
      },
      {
        titulo: "La luz",
        texto:
          "La intensidad alcanzada cuando el poema renuncia a todo lo innecesario.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Una poesía breve, nocturna y exacta donde cada palabra parece situada al borde del silencio.",
      },
    ],

    aprendizajes: [
      "Eliminar hasta que cada palabra resulte inevitable.",
      "Usar el silencio como estructura.",
      "Construir una voz mediante imágenes recurrentes.",
      "Escribir desde la fragilidad sin convertirla en ornamento.",
      "Aceptar que el poema puede abrir una pregunta sin cerrarla.",
    ],

    obras: [
      {
        titulo: "Árbol de Diana",
        razon:
          "Poemas breves donde infancia, noche y lenguaje alcanzan una concentración extrema.",
      },
      {
        titulo: "Los trabajos y las noches",
        razon:
          "El amor, la ausencia y la escritura convertidos en ritual nocturno.",
      },
      {
        titulo: "Extracción de la piedra de locura",
        razon:
          "La prosa poética como descenso hacia una conciencia fragmentada.",
      },
      {
        titulo: "El infierno musical",
        razon:
          "La palabra enfrentada a su fracaso, su deseo y su violencia.",
      },
      {
        titulo: "La condesa sangrienta",
        razon:
          "Belleza, crueldad y fascinación construidas mediante una prosa ceremonial.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "El Árbol Blanco, las reliquias y la ausencia convierten la memoria en una forma de invocación.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Las voces subterráneas y los cuerpos no amados participan de una poética de la herida y el silencio.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La llamada, la identidad incompleta y los objetos abandonados habitan el mismo territorio entre presencia y desaparición.",
      },
    ],

    constelacion: [
      "Rainer Maria Rilke",
      "Clarice Lispector",
      "Han Kang",
      "Francesca Woodman",
      "Leonora Carrington",
      "Paul Celan",
    ],
  },

  [normalizarNombreCuratorial("Rainer Maria Rilke")]: {
    pregunta:
      "¿Cómo transformar el miedo a desaparecer en una forma más intensa de presencia?",

    introduccion:
      "Rilke entendió la poesía como una tarea de transformación. Las cosas, los animales, los ángeles, la muerte y la soledad no son temas: son umbrales. Su escritura exige aprender a mirar hasta que lo visible revele una dimensión interior.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La conciencia de que amar, crear y existir implican siempre pérdida y transformación.",
      },
      {
        titulo: "La luz",
        texto:
          "La posibilidad de convertir aquello que desaparece en experiencia interior.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Una poesía musical y visionaria donde la imagen se vuelve forma de conocimiento.",
      },
    ],

    aprendizajes: [
      "Mirar un objeto hasta que deje de ser decorativo.",
      "Aceptar la soledad como espacio de formación.",
      "Transformar experiencia en imagen.",
      "Escribir la muerte como parte de la vida.",
      "Permitir que el poema piense mediante ritmo y visión.",
    ],

    obras: [
      {
        titulo: "Elegías de Duino",
        razon:
          "La belleza, el terror, los ángeles y la condición humana reunidos en una arquitectura poética mayor.",
      },
      {
        titulo: "Sonetos a Orfeo",
        razon:
          "La transformación, el canto y la muerte contemplados como movimiento creador.",
      },
      {
        titulo: "Cartas a un joven poeta",
        razon:
          "La creación entendida como paciencia, soledad y necesidad interior.",
      },
      {
        titulo: "Nuevos poemas",
        razon:
          "Las cosas observadas hasta adquirir una intensidad espiritual propia.",
      },
      {
        titulo: "Los cuadernos de Malte Laurids Brigge",
        razon:
          "La conciencia moderna enfrentada a la ciudad, la memoria y la muerte.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Las reliquias transforman la pérdida en presencia interior y permiten que los muertos continúen actuando.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El descenso convierte el sufrimiento en experiencia simbólica sin negarle su materialidad.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Bielka obliga a pensar la muerte no como final, sino como transformación incompleta de la presencia.",
      },
    ],

    constelacion: [
      "Alejandra Pizarnik",
      "María Zambrano",
      "Jon Fosse",
      "Paul Celan",
      "Tarkovski",
      "Louise Bourgeois",
    ],
  },

  [normalizarNombreCuratorial("Georges Bataille")]: {
    pregunta:
      "¿Qué revela el ser humano cuando atraviesa los límites que su propia sociedad necesita imponer?",

    introduccion:
      "Bataille pensó el erotismo, el sacrificio, el exceso, la muerte y lo sagrado como experiencias que desestabilizan la identidad. Su obra explora aquello que una cultura expulsa para poder conservar su orden.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La separación entre la vida regulada y las fuerzas que desbordan toda utilidad.",
      },
      {
        titulo: "La luz",
        texto:
          "La comprensión del límite como lugar donde una conciencia pierde su falsa autonomía.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Una escritura filosófica y narrativa que combina pensamiento, violencia, erotismo y experiencia interior.",
      },
    ],

    aprendizajes: [
      "Explorar el límite sin convertirlo en simple provocación.",
      "Comprender el deseo como fuerza narrativa.",
      "Relacionar cuerpo, economía, sacrificio y poder.",
      "Aceptar que una obra puede resultar incómoda sin ser arbitraria.",
      "Investigar aquello que una comunidad necesita excluir.",
    ],

    obras: [
      {
        titulo: "El erotismo",
        razon:
          "El deseo y la muerte entendidos como experiencias de continuidad y pérdida de límites.",
      },
      {
        titulo: "La experiencia interior",
        razon:
          "Una búsqueda de conocimiento que atraviesa éxtasis, vacío e imposibilidad.",
      },
      {
        titulo: "La parte maldita",
        razon:
          "El exceso y el gasto improductivo como estructuras fundamentales de las sociedades.",
      },
      {
        titulo: "Historia del ojo",
        razon:
          "Deseo, transgresión y obsesión desarrollados mediante una cadena de imágenes extremas.",
      },
      {
        titulo: "La literatura y el mal",
        razon:
          "La creación literaria como relación conflictiva con prohibición, culpa y libertad.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La violencia destruye el orden comunitario y revela la fragilidad de toda frontera moral.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Deseo, hambre, sacrificio y exceso constituyen fuerzas que organizan la arquitectura subterránea.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "El laberinto funciona como frontera donde las leyes del cuerpo, la muerte y la identidad cambian.",
      },
    ],

    constelacion: [
      "Friedrich Nietzsche",
      "Luis Buñuel",
      "Francisco de Goya",
      "David Lynch",
      "Anselm Kiefer",
      "Doris Salcedo",
    ],
  },

  [normalizarNombreCuratorial("Francisco de Goya")]: {
    pregunta:
      "¿Qué aparece cuando una sociedad pierde la máscara de la razón?",

    introduccion:
      "Goya atravesó la corte, la guerra, la enfermedad, la superstición y la violencia política. Su obra comenzó retratando un mundo visible y terminó revelando los monstruos que ese mismo mundo intentaba ocultar.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La crueldad colectiva y la facilidad con la que la razón puede ponerse al servicio de la violencia.",
      },
      {
        titulo: "La luz",
        texto:
          "La mirada capaz de denunciar sin simplificar y de mostrar víctimas, verdugos y espectadores.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Pintura y grabado transformados en testimonio, sátira, pesadilla y acusación.",
      },
    ],

    aprendizajes: [
      "Representar violencia sin glorificarla.",
      "Utilizar deformación y oscuridad como conocimiento.",
      "Observar también a quienes miran y callan.",
      "Dejar que una imagen conserve ambigüedad moral.",
      "Convertir experiencia histórica en símbolo universal.",
    ],

    obras: [
      {
        titulo: "Los desastres de la guerra",
        razon:
          "La violencia bélica mostrada desde el cuerpo, el sufrimiento y la ausencia de heroísmo.",
      },
      {
        titulo: "Caprichos",
        razon:
          "Superstición, hipocresía y abuso social expuestos mediante sátira y pesadilla.",
      },
      {
        titulo: "Pinturas negras",
        razon:
          "Miedo, vejez, violencia y oscuridad interior ocupando los muros de la vida privada.",
      },
      {
        titulo: "El 3 de mayo de 1808",
        razon:
          "La ejecución convertida en imagen universal de víctima, poder y terror.",
      },
      {
        titulo: "Saturno devorando a su hijo",
        razon:
          "El poder destruyendo aquello mismo que debería preservar.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La violencia no se representa como espectáculo heroico, sino como herida corporal, moral y comunitaria.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Los cuerpos deformados por hambre y poder revelan una sociedad que ha perdido toda máscara civilizada.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "El laberinto y sus monstruos participan de una imaginación oscura donde miedo e historia se vuelven inseparables.",
      },
    ],

    constelacion: [
      "Käthe Kollwitz",
      "Georges Bataille",
      "Luis Buñuel",
      "Anselm Kiefer",
      "Doris Salcedo",
      "Guillermo del Toro",
    ],
  },

  [normalizarNombreCuratorial("Alberto Giacometti")]: {
    pregunta:
      "¿Cuánto puede desaparecer un cuerpo antes de perder por completo su presencia?",

    introduccion:
      "Giacometti redujo la figura humana hasta convertirla en una línea frágil, erosionada y obstinadamente vertical. Sus cuerpos parecen lejanos incluso cuando están delante de nosotros. No representan debilidad: representan la dificultad de existir.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La distancia irreductible entre una persona y cualquier mirada que intente poseerla.",
      },
      {
        titulo: "La luz",
        texto:
          "La persistencia de la presencia humana incluso cuando casi toda materia ha desaparecido.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Figuras alargadas, superficies erosionadas y espacios vacíos que convierten la escultura en existencia.",
      },
    ],

    aprendizajes: [
      "Eliminar materia sin eliminar presencia.",
      "Utilizar proporción y distancia como emoción.",
      "Aceptar que una figura incompleta puede resultar más verdadera.",
      "Convertir el vacío en parte activa de la obra.",
      "Trabajar la fragilidad sin confundirla con debilidad.",
    ],

    obras: [
      {
        titulo: "El hombre que camina",
        razon:
          "La figura humana reducida a movimiento, verticalidad y resistencia.",
      },
      {
        titulo: "La plaza",
        razon:
          "Varias figuras comparten espacio sin llegar a encontrarse verdaderamente.",
      },
      {
        titulo: "Mujer de pie",
        razon:
          "Una presencia inmóvil, frontal y casi ritual.",
      },
      {
        titulo: "El perro",
        razon:
          "El cuerpo animal convertido en agotamiento, desplazamiento y autorretrato indirecto.",
      },
      {
        titulo: "Cabeza de Diego",
        razon:
          "La imposibilidad de capturar completamente un rostro incluso después de observarlo durante años.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Los cuerpos ausentes continúan existiendo mediante huellas, reliquias y espacios vacíos.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El hambre adelgaza cuerpos y identidades hasta revelar únicamente su persistencia esencial.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Las figuras que habitan Bielka existen entre presencia, desgaste y una imposibilidad radical de desaparecer.",
      },
    ],

    constelacion: [
      "Samuel Beckett",
      "Louise Bourgeois",
      "Francesca Woodman",
      "Pina Bausch",
      "Béla Tarr",
      "Alberto Camus",
    ],
  },


  [normalizarNombreCuratorial("Louise Bourgeois")]: {
    pregunta:
      "¿Puede una obra reparar la casa interior donde comenzó una herida?",

    introduccion:
      "Louise Bourgeois convirtió la memoria familiar en arquitectura, cuerpo y criatura. La madre, el padre, la casa, la sexualidad y el miedo regresan en su obra como habitaciones que nunca terminan de cerrarse. Crear fue para ella una manera de recordar sin quedar prisionera del recuerdo.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La infancia como territorio donde amor, abandono, deseo y traición quedan unidos.",
      },
      {
        titulo: "La luz",
        texto:
          "La posibilidad de transformar una memoria privada en una forma compartida.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Esculturas, celdas, tejidos y cuerpos fragmentados convertidos en autobiografía material.",
      },
    ],

    aprendizajes: [
      "Convertir memoria personal en estructura artística.",
      "Permitir que ternura y amenaza habiten el mismo objeto.",
      "Trabajar el cuerpo sin reducirlo a anatomía.",
      "Usar materiales como portadores de memoria.",
      "Repetir una forma hasta descubrir qué intenta decir.",
    ],

    obras: [
      {
        titulo: "Maman",
        razon:
          "La araña monumental como madre, protección, trabajo, inteligencia y amenaza.",
      },
      {
        titulo: "Cells",
        razon:
          "Habitaciones de memoria donde objetos, cuerpos y espacios permanecen atrapados.",
      },
      {
        titulo: "The Destruction of the Father",
        razon:
          "La mesa familiar convertida en escenario de deseo, violencia y rebelión.",
      },
      {
        titulo: "Arch of Hysteria",
        razon:
          "El cuerpo suspendido entre placer, dolor, vulnerabilidad y teatralidad.",
      },
      {
        titulo: "Femme Maison",
        razon:
          "La casa ocupando el lugar de la cabeza y fundiendo identidad femenina y espacio doméstico.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Las reliquias y el Árbol Blanco convierten el trauma en una arquitectura de memoria.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Los cuerpos y espacios subterráneos contienen deseos, miedos y vínculos familiares deformados.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Los objetos de Lev, Sahra e Iván funcionan como celdas materiales donde la ausencia sigue presente.",
      },
    ],

    constelacion: [
      "Alberto Giacometti",
      "Chiharu Shiota",
      "Francesca Woodman",
      "Käthe Kollwitz",
      "Doris Salcedo",
      "Pina Bausch",
    ],
  },

  [normalizarNombreCuratorial("Anselm Kiefer")]: {
    pregunta:
      "¿Cómo puede una cultura mirar las ruinas que ella misma produjo?",

    introduccion:
      "Kiefer trabaja con ceniza, plomo, paja, libros, campos y edificios devastados. Su obra no reconstruye una historia limpia: obliga a permanecer frente a los restos. La memoria colectiva aparece como materia pesada, erosionada y todavía activa.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La historia convertida en ruina material y culpa heredada.",
      },
      {
        titulo: "La luz",
        texto:
          "La posibilidad de atravesar la destrucción sin borrarla ni embellecerla.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Pintura, escultura y arquitectura unidas mediante plomo, ceniza, tierra, escritura y fuego.",
      },
    ],

    aprendizajes: [
      "Trabajar la historia como materia y no como decoración.",
      "Permitir que una superficie revele su proceso.",
      "Aceptar la ruina como forma activa.",
      "Utilizar escala y peso para crear experiencia física.",
      "No ofrecer reconciliaciones fáciles.",
    ],

    obras: [
      {
        titulo: "Margarethe",
        razon:
          "Paja, memoria y poesía enfrentadas al exterminio y a la tradición cultural alemana.",
      },
      {
        titulo: "Sulamith",
        razon:
          "Una arquitectura oscura donde espacio, duelo y memoria histórica se vuelven inseparables.",
      },
      {
        titulo: "The High Priestess/Zweistromland",
        razon:
          "Libros de plomo como archivo monumental, inaccesible y cargado de silencio.",
      },
      {
        titulo: "Osiris und Isis",
        razon:
          "Fragmentación, mito y reconstrucción pensados mediante ruinas y circuitos.",
      },
      {
        titulo: "Las siete torres celestiales",
        razon:
          "Arquitectura, ascenso y destrucción reunidos en una instalación de escala ritual.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "El árbol incendiado y las reliquias sostienen una memoria que no puede restaurarse sin cicatriz.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "La materia subterránea —óxido, ceniza, restos y muros— conserva la historia de quienes descendieron.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Bielka es una civilización residual construida sobre objetos, cuerpos y ruinas que no desaparecen.",
      },
    ],

    constelacion: [
      "Francisco de Goya",
      "Paul Celan",
      "Doris Salcedo",
      "Christian Boltanski",
      "Georges Bataille",
      "Tarkovski",
    ],
  },

  [normalizarNombreCuratorial("Mark Rothko")]: {
    pregunta:
      "¿Puede un color convertirse en un lugar donde una conciencia permanezca en silencio?",

    introduccion:
      "Rothko retiró de la pintura casi toda figura reconocible para dejar campos de color que respiran, avanzan y retroceden. Sus cuadros no representan una emoción: construyen las condiciones para que ocurra.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La dificultad de compartir una experiencia interior sin reducirla a una imagen literal.",
      },
      {
        titulo: "La luz",
        texto:
          "El color como presencia capaz de producir intimidad, gravedad y contemplación.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Rectángulos suspendidos, bordes vibrantes y capas cromáticas que transforman el espacio.",
      },
    ],

    aprendizajes: [
      "Confiar en una forma mínima.",
      "Trabajar el color como experiencia temporal.",
      "Permitir que una obra necesite proximidad y silencio.",
      "Eliminar sin empobrecer.",
      "Crear intensidad mediante relaciones y no mediante acumulación.",
    ],

    obras: [
      {
        titulo: "Rothko Chapel",
        razon:
          "Pintura, arquitectura y silencio reunidos en un espacio contemplativo.",
      },
      {
        titulo: "Seagram Murals",
        razon:
          "Campos oscuros concebidos para envolver y confrontar al espectador.",
      },
      {
        titulo: "No. 14, 1960",
        razon:
          "Azul y naranja convertidos en profundidad, tensión y respiración.",
      },
      {
        titulo: "Black on Maroon",
        razon:
          "La oscuridad entendida como umbral y no como ausencia.",
      },
      {
        titulo: "Orange and Yellow",
        razon:
          "La luminosidad sostenida por capas que parecen emitir una luz interior.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "El blanco del árbol funciona como campo emocional antes que como simple color descriptivo.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Cada estación posee una temperatura cromática y afectiva que modifica la experiencia del descenso.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La blancura del minotauro y los espacios del laberinto actúan como presencias silenciosas.",
      },
    ],

    constelacion: [
      "James Turrell",
      "Tadao Ando",
      "Arvo Pärt",
      "Bill Viola",
      "Jon Fosse",
      "Tarkovski",
    ],
  },

  [normalizarNombreCuratorial("Antoni Tàpies")]: {
    pregunta:
      "¿Qué memoria guarda una pared después de que todos hayan dejado de mirarla?",

    introduccion:
      "Tàpies convirtió muros, cruces, grietas, polvo y objetos humildes en superficies de pensamiento. Su obra atiende aquello que suele considerarse pobre, deteriorado o insignificante y descubre en ello una densidad espiritual.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La materia marcada por el tiempo, la violencia y el abandono.",
      },
      {
        titulo: "La luz",
        texto:
          "La dignidad poética de aquello que parecía residual.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Texturas, signos, tierra, tela y objetos cotidianos convertidos en escritura material.",
      },
    ],

    aprendizajes: [
      "Escuchar la historia de los materiales.",
      "Utilizar desgaste y accidente como parte de la obra.",
      "Encontrar significado en lo humilde.",
      "Crear signos sin cerrarlos en una lectura.",
      "Comprender la superficie como profundidad.",
    ],

    obras: [
      {
        titulo: "Gran pintura gris",
        razon:
          "La superficie convertida en muro, cuerpo, huella y campo de contemplación.",
      },
      {
        titulo: "Cruz y R",
        razon:
          "Signos elementales organizando materia, memoria y tensión.",
      },
      {
        titulo: "Puerta metálica y violín",
        razon:
          "Objetos reconocibles desplazados hacia una presencia enigmática.",
      },
      {
        titulo: "Calcetín",
        razon:
          "Un objeto mínimo ampliado hasta adquirir condición monumental.",
      },
      {
        titulo: "Núvol i cadira",
        razon:
          "La silla como espera, pensamiento, fragilidad y suspensión.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "El árbol quemado y las reliquias conservan marcas físicas que sustituyen cualquier explicación completa.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Los muros y objetos encontrados registran la erosión de los cuerpos y las instituciones.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La puerta de piedra, las huellas y la sangre escrita convierten la materia en testimonio.",
      },
    ],

    constelacion: [
      "Anselm Kiefer",
      "Doris Salcedo",
      "Joseph Beuys",
      "Chiharu Shiota",
      "Alberto Giacometti",
      "Tadao Ando",
    ],
  },

  [normalizarNombreCuratorial("Frida Kahlo")]: {
    pregunta:
      "¿Cómo puede un cuerpo herido seguir siendo territorio de identidad, deseo y creación?",

    introduccion:
      "Frida Kahlo pintó su cuerpo no para encerrarse en sí misma, sino para mostrar que identidad, dolor, amor, política y paisaje podían ocupar la misma superficie. El autorretrato se convirtió en anatomía emocional y mitología personal.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "El cuerpo transformado por accidente, enfermedad, deseo, pérdida y mirada ajena.",
      },
      {
        titulo: "La luz",
        texto:
          "La capacidad de construir una identidad creadora sin ocultar la fractura.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Autorretrato, símbolo, naturaleza y tradición popular reunidos con precisión frontal.",
      },
    ],

    aprendizajes: [
      "Convertir experiencia personal en lenguaje compartido.",
      "Usar el autorretrato como investigación y no como complacencia.",
      "Permitir que belleza y dolor convivan.",
      "Crear una mitología propia mediante símbolos recurrentes.",
      "Reivindicar el cuerpo sin idealizarlo.",
    ],

    obras: [
      {
        titulo: "Las dos Fridas",
        razon:
          "Dos identidades conectadas por un sistema circulatorio visible y vulnerable.",
      },
      {
        titulo: "La columna rota",
        razon:
          "Dolor físico, estructura corporal y resistencia expuestos sin protección.",
      },
      {
        titulo: "Autorretrato con collar de espinas",
        razon:
          "Naturaleza, sufrimiento y mirada frontal convertidos en icono personal.",
      },
      {
        titulo: "Henry Ford Hospital",
        razon:
          "Pérdida reproductiva y cuerpo médico representados desde una intimidad radical.",
      },
      {
        titulo: "El venado herido",
        razon:
          "La identidad humana y animal reunidas en una figura atravesada que todavía avanza.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "El cuerpo femenino herido exige una representación que no lo reduzca a víctima ni a alegoría.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Los cuerpos conservan deseo, memoria e identidad incluso cuando el sistema intenta clasificarlos.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Mara construye su identidad a partir de huellas recibidas, pero decide cómo habitarlas.",
      },
    ],

    constelacion: [
      "Louise Bourgeois",
      "Han Kang",
      "Käthe Kollwitz",
      "Leonora Carrington",
      "Doris Salcedo",
      "Pina Bausch",
    ],
  },

  [normalizarNombreCuratorial("Salvador Dalí")]: {
    pregunta:
      "¿Qué verdad aparece cuando la realidad acepta la lógica del sueño?",

    introduccion:
      "Dalí convirtió el sueño, el deseo, el miedo y la memoria en paisajes de precisión casi fotográfica. Su imaginación no rechazó la técnica: la utilizó para hacer verosímil aquello que la conciencia despierta intenta excluir.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La inestabilidad del deseo y la imposibilidad de confiar por completo en la percepción.",
      },
      {
        titulo: "La luz",
        texto:
          "La libertad de construir imágenes donde varias realidades coexisten.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Pintura minuciosa, asociaciones inesperadas, dobles imágenes y espacios oníricos.",
      },
    ],

    aprendizajes: [
      "Representar lo imposible con rigor técnico.",
      "Permitir que una imagen contenga varias figuras.",
      "Convertir obsesiones personales en vocabulario visual.",
      "Explorar deseo y miedo sin traducirlos a discurso.",
      "Usar precisión para intensificar el sueño.",
    ],

    obras: [
      {
        titulo: "La persistencia de la memoria",
        razon:
          "El tiempo convertido en materia blanda, vulnerable y sometida al sueño.",
      },
      {
        titulo: "El gran masturbador",
        razon:
          "Deseo, miedo, paisaje e identidad reunidos en una forma inestable.",
      },
      {
        titulo: "Construcción blanda con judías hervidas",
        razon:
          "La guerra civil anticipada como cuerpo que se destruye a sí mismo.",
      },
      {
        titulo: "Sueño causado por el vuelo de una abeja",
        razon:
          "El instante onírico expandido mediante una cadena visual precisa.",
      },
      {
        titulo: "Cristo de San Juan de la Cruz",
        razon:
          "La escena sagrada reconstruida desde un punto de vista imposible.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Las reliquias y el árbol funcionan como imágenes donde memoria, sueño y realidad se superponen.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Las estaciones subterráneas obedecen una lógica material y onírica al mismo tiempo.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "El minotauro blanco y el laberinto convierten el sueño en geografía tangible.",
      },
    ],

    constelacion: [
      "Luis Buñuel",
      "Leonora Carrington",
      "Remedios Varo",
      "David Lynch",
      "Franz Kafka",
      "Federico García Lorca",
    ],
  },

  [normalizarNombreCuratorial("Käthe Kollwitz")]: {
    pregunta:
      "¿Cómo mirar el dolor colectivo sin convertirlo en una imagen distante?",

    introduccion:
      "Kollwitz dedicó su obra a madres, trabajadores, muertos, hambrientos y víctimas de la guerra. Sus figuras no son alegorías abstractas: poseen peso, manos, duelo y proximidad. Dibujar fue una forma de acompañar.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "El sufrimiento producido por guerra, pobreza y pérdida familiar.",
      },
      {
        titulo: "La luz",
        texto:
          "La compasión que conserva dignidad sin suavizar la violencia.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Grabados y esculturas de gran concentración corporal, gestual y emocional.",
      },
    ],

    aprendizajes: [
      "Representar dolor sin apropiárselo.",
      "Dar dignidad a los cuerpos anónimos.",
      "Utilizar manos y gestos como narración.",
      "Evitar la heroicidad cuando se habla de guerra.",
      "Construir fuerza mediante sobriedad.",
    ],

    obras: [
      {
        titulo: "La guerra",
        razon:
          "Una serie donde madres, viudas y niños ocupan el centro de la experiencia bélica.",
      },
      {
        titulo: "La revuelta de los tejedores",
        razon:
          "Pobreza, organización y represión narradas mediante cuerpos colectivos.",
      },
      {
        titulo: "Mujer con niño muerto",
        razon:
          "El duelo materno concentrado en un abrazo que intenta retener lo irrecuperable.",
      },
      {
        titulo: "Los padres en duelo",
        razon:
          "Dos figuras inclinadas ante la muerte del hijo y el peso irreversible de la pérdida.",
      },
      {
        titulo: "Pan",
        razon:
          "El hambre familiar representada mediante una escena doméstica mínima.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La muerte de María exige una mirada que preserve cuerpo, duelo y dignidad.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El hambre aparece como violencia social inscrita en familias y cuerpos concretos.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La manta, los zapatos y los niños ausentes sostienen un duelo que no puede clausurarse.",
      },
    ],

    constelacion: [
      "Francisco de Goya",
      "Doris Salcedo",
      "Han Kang",
      "Primo Levi",
      "Louise Bourgeois",
      "Sebastião Salgado",
    ],
  },

  [normalizarNombreCuratorial("Chiharu Shiota")]: {
    pregunta:
      "¿Puede una ausencia ocupar físicamente una habitación?",

    introduccion:
      "Shiota llena espacios con miles de hilos que conectan llaves, camas, zapatos, cartas, maletas y embarcaciones. Sus instalaciones convierten memoria, vínculo y pérdida en una arquitectura que el visitante debe atravesar.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "Los vínculos que permanecen después de que las personas o los lugares hayan desaparecido.",
      },
      {
        titulo: "La luz",
        texto:
          "La posibilidad de hacer visible la red invisible que une memoria, cuerpo y objeto.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Hilos, objetos usados y espacio transformados en dibujo tridimensional.",
      },
    ],

    aprendizajes: [
      "Construir con relaciones y no solo con objetos.",
      "Permitir que el visitante atraviese la obra.",
      "Usar repetición para crear densidad emocional.",
      "Convertir objetos usados en presencias.",
      "Dar forma física a la memoria.",
    ],

    obras: [
      {
        titulo: "The Key in the Hand",
        razon:
          "Miles de llaves suspendidas sobre barcas como memoria colectiva de accesos y pérdidas.",
      },
      {
        titulo: "Uncertain Journey",
        razon:
          "Barcas y redes rojas construyendo una travesía sin destino seguro.",
      },
      {
        titulo: "In Silence",
        razon:
          "Un piano quemado atrapado en hilo negro como memoria de destrucción y sonido ausente.",
      },
      {
        titulo: "Accumulation: Searching for the Destination",
        razon:
          "Maletas suspendidas como desplazamiento, migración y vidas transportadas.",
      },
      {
        titulo: "During Sleep",
        razon:
          "Camas y cuerpos envueltos por redes que funden sueño, vulnerabilidad y memoria.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Las siete reliquias podrían desplegar una red física de vínculos entre quienes las tocaron.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Las voces, recorridos y estaciones forman una red invisible que captura a quienes descienden.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Los zapatos, la manta y la pelota conectan ausencias mediante objetos que todavía ocupan espacio.",
      },
    ],

    constelacion: [
      "Louise Bourgeois",
      "Christian Boltanski",
      "Doris Salcedo",
      "Francesca Woodman",
      "Bill Viola",
      "Pina Bausch",
    ],
  },

  [normalizarNombreCuratorial("Andrei Tarkovski")]: {
    pregunta:
      "¿Puede una imagen conservar el tiempo que una vida ya ha perdido?",

    introduccion:
      "Tarkovski entendió el cine como una forma de esculpir el tiempo. El agua, el fuego, las ruinas, los sueños y los rostros no explican una historia: permiten que la memoria se vuelva experiencia presente.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La separación entre el ser humano y aquello que considera sagrado, verdadero o perdido.",
      },
      {
        titulo: "La luz",
        texto:
          "La posibilidad de que una imagen lenta restituya profundidad a la experiencia.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Planos prolongados, elementos naturales, sueños y espacios erosionados organizados como memoria.",
      },
    ],

    aprendizajes: [
      "Tratar el tiempo como materia narrativa.",
      "Permitir que una imagen dure más allá de su función informativa.",
      "Usar agua, fuego, viento y ruina como presencias.",
      "Construir símbolos sin traducirlos.",
      "Confiar en la experiencia contemplativa del espectador.",
    ],

    obras: [
      {
        titulo: "Stalker",
        razon:
          "La Zona como espacio físico, espiritual y moral que responde de forma incierta al deseo.",
      },
      {
        titulo: "El espejo",
        razon:
          "Infancia, madre, historia y sueño reunidos en una memoria no cronológica.",
      },
      {
        titulo: "Solaris",
        razon:
          "El cosmos convertido en espejo de culpa, amor y recuerdos irresueltos.",
      },
      {
        titulo: "Andréi Rubliov",
        razon:
          "El arte, la fe y la violencia histórica atravesados por el silencio del creador.",
      },
      {
        titulo: "Sacrificio",
        razon:
          "La posibilidad de entregar una vida cotidiana a cambio de impedir una catástrofe.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "El Árbol Blanco, el fuego y la memoria se comportan como imágenes temporales antes que como símbolos explicados.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El descenso exige tiempo, contemplación y una relación física con espacios en ruina.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Bielka y el laberinto funcionan como una Zona donde memoria, deseo y ley ontológica se confunden.",
      },
    ],

    constelacion: [
      "Ingmar Bergman",
      "Béla Tarr",
      "Jon Fosse",
      "Arvo Pärt",
      "Rainer Maria Rilke",
      "Abbas Kiarostami",
    ],
  },

  [normalizarNombreCuratorial("Ingmar Bergman")]: {
    pregunta:
      "¿Qué queda de una persona cuando todas sus máscaras dejan de protegerla?",

    introduccion:
      "Bergman convirtió el rostro en escenario. El miedo a la muerte, la ausencia de Dios, el deseo, la culpa y la intimidad aparecen en habitaciones donde hablar puede herir tanto como callar. Su cine observa el instante en que una identidad pierde su defensa.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La dificultad de amar, creer o comunicarse sin convertir al otro en escenario de nuestras necesidades.",
      },
      {
        titulo: "La luz",
        texto:
          "La verdad frágil que aparece cuando un rostro ya no puede sostener su papel.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Primeros planos, silencios, interiores y diálogos convertidos en anatomía de la conciencia.",
      },
    ],

    aprendizajes: [
      "Utilizar el rostro como paisaje dramático.",
      "Construir tensión mediante intimidad.",
      "Permitir que los personajes se contradigan.",
      "Tratar el silencio como relación.",
      "Explorar grandes preguntas dentro de espacios pequeños.",
    ],

    obras: [
      {
        titulo: "Persona",
        razon:
          "Dos identidades se aproximan hasta perder la frontera que parecía separarlas.",
      },
      {
        titulo: "El séptimo sello",
        razon:
          "La muerte, la fe y el silencio de Dios organizados como partida y viaje.",
      },
      {
        titulo: "Gritos y susurros",
        razon:
          "Dolor, cuidados, resentimiento y muerte dentro de una casa intensamente roja.",
      },
      {
        titulo: "Fresas salvajes",
        razon:
          "Un viaje exterior que obliga a revisar una vida construida desde la distancia afectiva.",
      },
      {
        titulo: "Secretos de un matrimonio",
        razon:
          "La intimidad observada como negociación, crueldad, dependencia y verdad cambiante.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Los rostros que recuerdan a María deben enfrentarse a culpa, silencio y formas incompletas de amor.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Cada encuentro revela máscaras afectivas y morales que el descenso termina erosionando.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La identidad de Mara y el silencio de Iván obligan a preguntar qué permanece cuando una vida cambia de forma.",
      },
    ],

    constelacion: [
      "Andrei Tarkovski",
      "Samuel Beckett",
      "Pina Bausch",
      "Franz Kafka",
      "Carl Theodor Dreyer",
      "Béla Tarr",
    ],
  },


  [normalizarNombreCuratorial("Béla Tarr")]: {
    pregunta:
      "¿Cómo cambia una vida cuando el tiempo deja de prometer que algo sucederá?",

    introduccion:
      "Béla Tarr filma comunidades agotadas, paisajes barridos por el viento y cuerpos que continúan caminando aunque toda esperanza parezca haberse retirado. Sus planos prolongados no ralentizan la realidad: permiten sentir su peso.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La espera dentro de un mundo deteriorado que ya no ofrece una salida creíble.",
      },
      {
        titulo: "La luz",
        texto:
          "La dignidad silenciosa de quienes siguen moviéndose en medio del fracaso.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Blanco y negro, planos largos, lluvia, viento y desplazamientos convertidos en experiencia temporal.",
      },
    ],

    aprendizajes: [
      "Permitir que una escena dure hasta revelar otra dimensión.",
      "Trabajar la atmósfera como verdadera acción.",
      "Utilizar el movimiento de cámara como pensamiento.",
      "Confiar en cuerpos, clima y espacio antes que en la explicación.",
      "Representar el agotamiento sin vaciarlo de humanidad.",
    ],

    obras: [
      {
        titulo: "Sátántangó",
        razon:
          "Una comunidad devastada espera a un salvador cuya llegada puede completar el engaño.",
      },
      {
        titulo: "Armonías de Werckmeister",
        razon:
          "Una ballena, una multitud y una ciudad alterada por la amenaza y el deseo de orden.",
      },
      {
        titulo: "El caballo de Turín",
        razon:
          "La repetición cotidiana llevada hasta el agotamiento del mundo.",
      },
      {
        titulo: "El hombre de Londres",
        razon:
          "Culpa, dinero y observación dentro de un espacio portuario dominado por sombras.",
      },
      {
        titulo: "Condenación",
        razon:
          "Deseo, traición y ruina moral en un paisaje industrial sin horizonte.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "El duelo y la imposibilidad de reparación necesitan tiempo, silencio y una observación que no huya.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El descenso se vuelve una experiencia física de duración, humedad, cansancio y repetición.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La comunidad detenida, el clima moral y la espera ante el laberinto pertenecen profundamente a su universo.",
      },
    ],

    constelacion: [
      "László Krasznahorkai",
      "Samuel Beckett",
      "Jon Fosse",
      "Andrei Tarkovski",
      "Ingmar Bergman",
      "Ágota Kristóf",
    ],
  },

  [normalizarNombreCuratorial("Theo Angelopoulos")]: {
    pregunta:
      "¿Puede un paisaje recordar aquello que una nación intenta olvidar?",

    introduccion:
      "Angelopoulos convirtió fronteras, niebla, carreteras y desplazamientos en formas visibles de la historia. Sus personajes atraviesan territorios donde el pasado político continúa respirando dentro del presente.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "El exilio, la frontera y la imposibilidad de regresar intacto al lugar de origen.",
      },
      {
        titulo: "La luz",
        texto:
          "La memoria colectiva sostenida por quienes caminan a través de sus ruinas.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Planos secuencia, paisajes neblinosos y movimientos corales que reúnen historia y tiempo.",
      },
    ],

    aprendizajes: [
      "Tratar el paisaje como archivo político.",
      "Integrar historia colectiva y experiencia íntima.",
      "Utilizar desplazamientos físicos como estructura narrativa.",
      "Construir tiempo mediante coreografía.",
      "Evitar que una frontera sea únicamente geográfica.",
    ],

    obras: [
      {
        titulo: "La mirada de Ulises",
        razon:
          "Un viaje balcánico en busca de imágenes perdidas y de una memoria cinematográfica común.",
      },
      {
        titulo: "Paisaje en la niebla",
        razon:
          "Dos niños atraviesan un territorio incierto buscando a un padre que quizá solo exista como deseo.",
      },
      {
        titulo: "El paso suspendido de la cigüeña",
        razon:
          "La frontera como herida política, corporal y emocional.",
      },
      {
        titulo: "El viaje de los comediantes",
        razon:
          "Una compañía teatral recorre décadas de historia griega dentro de una temporalidad abierta.",
      },
      {
        titulo: "La eternidad y un día",
        razon:
          "Un último día convertido en recorrido por memoria, lenguaje y pérdida.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Argelia, España y la transmisión de las reliquias convierten la memoria en un viaje entre territorios.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "La ciudad se transforma en frontera vertical entre quienes pertenecen y quienes han sido expulsados.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Bielka es una tierra de llegada sin retorno, poblada por exilios que nunca terminan de resolverse.",
      },
    ],

    constelacion: [
      "Andrei Tarkovski",
      "Béla Tarr",
      "Abbas Kiarostami",
      "W. G. Sebald",
      "Mahmoud Darwish",
      "Josef Koudelka",
    ],
  },

  [normalizarNombreCuratorial("Víctor Erice")]: {
    pregunta:
      "¿Qué descubre una infancia cuando mira aquello que los adultos han decidido callar?",

    introduccion:
      "Erice filma el misterio que permanece dentro de una casa, un rostro o una pantalla de cine. Sus imágenes observan la infancia como una conciencia capaz de percibir las ausencias históricas y afectivas que los adultos no saben nombrar.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "El silencio familiar e histórico que obliga al niño a construir sus propias explicaciones.",
      },
      {
        titulo: "La luz",
        texto:
          "La imaginación como forma de aproximarse a aquello que todavía no puede comprenderse.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Luz natural, silencios, objetos y miradas infantiles organizados con extrema delicadeza.",
      },
    ],

    aprendizajes: [
      "Filmar o escribir desde la percepción infantil sin infantilizarla.",
      "Permitir que un objeto guarde una historia.",
      "Construir emoción mediante ausencia.",
      "Utilizar la luz como memoria.",
      "Respetar aquello que un personaje no sabe explicar.",
    ],

    obras: [
      {
        titulo: "El espíritu de la colmena",
        razon:
          "Una niña contempla Frankenstein y transforma el silencio de la posguerra mediante imaginación y miedo.",
      },
      {
        titulo: "El sur",
        razon:
          "La figura del padre reconstruida desde la memoria parcial y el deseo de una hija.",
      },
      {
        titulo: "El sol del membrillo",
        razon:
          "La pintura, la luz y el paso del tiempo observados durante el intento de capturar un árbol.",
      },
      {
        titulo: "Cerrar los ojos",
        razon:
          "Cine, desaparición, amistad y memoria regresan décadas después como una búsqueda.",
      },
      {
        titulo: "La morte rouge",
        razon:
          "La experiencia infantil del cine evocada como origen del miedo y de la mirada.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La infancia, el árbol y los objetos conservan aquello que la historia adulta intenta silenciar.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "La mirada del niño descubre significados que los adultos del descenso ya no pueden percibir.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Lev, Sahra y los niños llevados al laberinto ocupan el centro moral de un mundo construido por silencios adultos.",
      },
    ],

    constelacion: [
      "Andrei Tarkovski",
      "Ingmar Bergman",
      "Abbas Kiarostami",
      "Käthe Kollwitz",
      "Rainer Maria Rilke",
      "Terrence Malick",
    ],
  },

  [normalizarNombreCuratorial("Abbas Kiarostami")]: {
    pregunta:
      "¿Cuánta verdad puede contener una imagen que reconoce que también está construida?",

    introduccion:
      "Kiarostami borró las fronteras entre documental y ficción, actor y persona, camino y relato. Su cine no engaña al espectador: le permite observar cómo la verdad aparece precisamente dentro de una representación consciente de sí misma.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La distancia entre una vida real y las imágenes mediante las que intentamos comprenderla.",
      },
      {
        titulo: "La luz",
        texto:
          "La capacidad del cine para crear encuentros sin apropiarse completamente de ellos.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Caminos, automóviles, conversaciones, paisajes y dispositivos cinematográficos expuestos con sencillez.",
      },
    ],

    aprendizajes: [
      "Confiar en situaciones mínimas.",
      "Mostrar el artificio sin destruir la emoción.",
      "Permitir que el espectador complete la obra.",
      "Usar el trayecto como forma narrativa.",
      "Observar con respeto antes de intervenir.",
    ],

    obras: [
      {
        titulo: "Close-Up",
        razon:
          "Un caso real de suplantación reconstruido por sus propios protagonistas.",
      },
      {
        titulo: "El sabor de las cerezas",
        razon:
          "Un hombre busca a alguien que acepte acompañar materialmente su decisión de morir.",
      },
      {
        titulo: "¿Dónde está la casa de mi amigo?",
        razon:
          "El recorrido de un niño transforma una obligación sencilla en gesto ético.",
      },
      {
        titulo: "Y la vida continúa",
        razon:
          "La búsqueda de unos actores después de un terremoto revela persistencia y reconstrucción.",
      },
      {
        titulo: "A través de los olivos",
        razon:
          "Ficción, rodaje y deseo amoroso se superponen sin anularse.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La transmisión de la memoria exige reconocer la distancia entre una vida y cualquier relato que intente conservarla.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Los trayectos y conversaciones revelan gradualmente la ética de cada personaje.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Los caminos hacia el laberinto y la decisión de acompañar a otro adquieren valor moral antes que explicativo.",
      },
    ],

    constelacion: [
      "Andrei Tarkovski",
      "Víctor Erice",
      "Theo Angelopoulos",
      "Albert Camus",
      "Terrence Malick",
      "Abbas Kiarostami",
    ],
  },

  [normalizarNombreCuratorial("Luis Buñuel")]: {
    pregunta:
      "¿Qué deseos continúan gobernándonos debajo de la moral, la cortesía y la razón?",

    introduccion:
      "Buñuel utilizó el sueño, la blasfemia, el humor y la crueldad para desmontar las ceremonias de la burguesía, la religión y el poder. Su cine muestra que la normalidad suele ser una puesta en escena sostenida por deseos que nadie admite.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La represión del deseo y la violencia escondida dentro de las instituciones respetables.",
      },
      {
        titulo: "La luz",
        texto:
          "La libertad de la imaginación para revelar aquello que el discurso racional oculta.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Sueños, interrupciones, objetos fetiche y humor seco integrados en una puesta en escena precisa.",
      },
    ],

    aprendizajes: [
      "Atacar una convención mediante una imagen.",
      "Usar el humor para intensificar la violencia crítica.",
      "Permitir que el sueño interrumpa la lógica sin pedir permiso.",
      "Trabajar con obsesiones recurrentes.",
      "Evitar convertir la provocación en un fin vacío.",
    ],

    obras: [
      {
        titulo: "El ángel exterminador",
        razon:
          "Una élite incapaz de abandonar una habitación revela la fragilidad de sus reglas.",
      },
      {
        titulo: "Viridiana",
        razon:
          "Caridad, deseo y religión confrontados con una realidad que desarma toda pureza.",
      },
      {
        titulo: "Los olvidados",
        razon:
          "Infancia, pobreza y violencia observadas sin sentimentalismo ni consuelo.",
      },
      {
        titulo: "El discreto encanto de la burguesía",
        razon:
          "Una comida eternamente aplazada descompone deseo, clase y representación.",
      },
      {
        titulo: "Un perro andaluz",
        razon:
          "La asociación onírica liberada de la obligación narrativa convencional.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La violencia rompe cualquier relato cómodo sobre moral, comunidad y normalidad.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Comida, deseo, culpa y clase organizan un descenso donde toda institución revela su obscenidad.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La lógica del laberinto permite que sueño, cuerpo y ley convivan sin someterse a una explicación racional.",
      },
    ],

    constelacion: [
      "Salvador Dalí",
      "Georges Bataille",
      "Francisco de Goya",
      "Federico García Lorca",
      "David Lynch",
      "Leonora Carrington",
    ],
  },

  [normalizarNombreCuratorial("Akira Kurosawa")]: {
    pregunta:
      "¿Cómo puede una persona actuar justamente cuando toda verdad llega fragmentada?",

    introduccion:
      "Kurosawa construyó relatos donde honor, miedo, poder y compasión se enfrentan dentro de situaciones extremas. Sus personajes deben decidir sin poseer una verdad completa y descubren que la acción moral siempre implica riesgo.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La imposibilidad de conocer completamente los hechos o las intenciones de los demás.",
      },
      {
        titulo: "La luz",
        texto:
          "La responsabilidad de actuar incluso dentro de la incertidumbre.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Movimiento, clima, montaje, composición coral y acción física organizados con claridad monumental.",
      },
    ],

    aprendizajes: [
      "Narrar un conflicto desde perspectivas incompatibles.",
      "Construir acción con densidad moral.",
      "Utilizar clima y paisaje como fuerzas dramáticas.",
      "Dar autonomía a cada miembro de un grupo.",
      "Unir espectáculo, humanidad y pensamiento.",
    ],

    obras: [
      {
        titulo: "Rashōmon",
        razon:
          "Un mismo crimen narrado desde versiones irreconciliables.",
      },
      {
        titulo: "Los siete samuráis",
        razon:
          "Una comunidad se organiza frente a la violencia y descubre el coste de la solidaridad.",
      },
      {
        titulo: "Vivir",
        razon:
          "La proximidad de la muerte transforma una existencia burocrática en una decisión concreta.",
      },
      {
        titulo: "Trono de sangre",
        razon:
          "Ambición, profecía y culpa trasladadas a una atmósfera feudal de extrema potencia visual.",
      },
      {
        titulo: "Ran",
        razon:
          "El poder familiar y político desata una destrucción que supera a quienes la iniciaron.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Testimonio, memoria y verdad no coinciden siempre, pero la responsabilidad ante la víctima permanece.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El grupo debe decidir cómo actuar cuando cada personaje entiende el hambre desde un lugar distinto.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La comunidad debe responder ante la llamada y el laberinto sin disponer de una verdad común completa.",
      },
    ],

    constelacion: [
      "Ingmar Bergman",
      "William Shakespeare",
      "Francisco de Goya",
      "José Saramago",
      "Toni Morrison",
      "Theo Angelopoulos",
    ],
  },

  [normalizarNombreCuratorial("Arvo Pärt")]: {
    pregunta:
      "¿Cuánto silencio necesita una nota para comenzar a ser escuchada?",

    introduccion:
      "Pärt reconstruyó su lenguaje musical desde la renuncia. Tras años de crisis y silencio, creó el tintinnabuli: una música donde cada nota parece avanzar acompañada por su propia resonancia espiritual.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La saturación de un lenguaje que ya no permitía escuchar lo esencial.",
      },
      {
        titulo: "La luz",
        texto:
          "La sencillez como disciplina capaz de abrir un espacio interior.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Voces, campanas, tríadas y líneas melódicas reducidas a relaciones de extrema claridad.",
      },
    ],

    aprendizajes: [
      "Escuchar el espacio entre dos sonidos.",
      "Reducir sin empobrecer.",
      "Utilizar repetición y resonancia como transformación.",
      "Aceptar el silencio como parte de la composición.",
      "Construir intensidad sin volumen excesivo.",
    ],

    obras: [
      {
        titulo: "Spiegel im Spiegel",
        razon:
          "Una línea melódica y un acompañamiento mínimo crean una sensación de tiempo suspendido.",
      },
      {
        titulo: "Tabula Rasa",
        razon:
          "La música como tránsito desde el movimiento hacia una quietud casi absoluta.",
      },
      {
        titulo: "Fratres",
        razon:
          "Una misma estructura reaparece en distintas instrumentaciones conservando su identidad.",
      },
      {
        titulo: "Passio",
        razon:
          "El relato de la Pasión convertido en arquitectura vocal austera y ritual.",
      },
      {
        titulo: "Für Alina",
        razon:
          "Unas pocas notas abren un espacio de fragilidad, escucha y comienzo.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "El silencio alrededor del Árbol Blanco necesita una música que acompañe sin ocupar la herida.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El descenso podría articularse mediante pulsos mínimos, ecos y resonancias de cada estación.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La llamada y la espera pertenecen a un espacio sonoro donde una sola nota puede adquirir condición de presencia.",
      },
    ],

    constelacion: [
      "Jon Fosse",
      "Andrei Tarkovski",
      "Mark Rothko",
      "Henryk Górecki",
      "Johann Sebastian Bach",
      "Tadao Ando",
    ],
  },

  [normalizarNombreCuratorial("Henryk Górecki")]: {
    pregunta:
      "¿Puede una voz atravesar el dolor sin quedar destruida por él?",

    introduccion:
      "Górecki construyó una música donde repetición, lentitud y canto sostienen el duelo. Su obra no representa el sufrimiento desde fuera: crea un espacio donde la voz puede permanecer junto a él.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La pérdida colectiva y personal inscrita en voces que llaman a quienes ya no pueden responder.",
      },
      {
        titulo: "La luz",
        texto:
          "La posibilidad de que la música acompañe el dolor sin explicarlo.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Repeticiones lentas, armonías modales, masas sonoras y voces de gran desnudez.",
      },
    ],

    aprendizajes: [
      "Construir emoción mediante repetición gradual.",
      "Dar tiempo a una voz para habitar una frase.",
      "Evitar adornar el dolor.",
      "Utilizar sencillez y escala de forma simultánea.",
      "Permitir que una obra funcione como espacio de duelo.",
    ],

    obras: [
      {
        titulo: "Sinfonía n.º 3, Sinfonía de las lamentaciones",
        razon:
          "Tres cantos de separación entre madres e hijos sostenidos por una arquitectura lenta y creciente.",
      },
      {
        titulo: "Beatus Vir",
        razon:
          "Una gran obra coral donde resistencia espiritual y monumentalidad permanecen unidas.",
      },
      {
        titulo: "Miserere",
        razon:
          "Una súplica coral construida mediante acumulación, insistencia y contención.",
      },
      {
        titulo: "Totus Tuus",
        razon:
          "La voz colectiva reducida a una expresión de devoción directa.",
      },
      {
        titulo: "Cuarteto de cuerda n.º 1, Already It Is Dusk",
        razon:
          "Tensión, oscuridad y memoria concentradas dentro de una forma camerística.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "El duelo por María necesita una voz que no convierta la pérdida en espectáculo.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Las voces colectivas pueden expresar aquello que ningún personaje aislado consigue contener.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Las separaciones entre niños, madres y acompañantes encuentran una resonancia directa en su música.",
      },
    ],

    constelacion: [
      "Arvo Pärt",
      "Käthe Kollwitz",
      "Paul Celan",
      "Nelly Sachs",
      "Tarkovski",
      "Gustav Mahler",
    ],
  },

  [normalizarNombreCuratorial("Johann Sebastian Bach")]: {
    pregunta:
      "¿Puede una estructura perfecta contener toda la fragilidad de una vida humana?",

    introduccion:
      "Bach construyó arquitecturas musicales de precisión extraordinaria sin separar nunca forma y emoción. En sus obras, una voz entra, responde a otra y transforma el conjunto. El orden no reprime la experiencia: le permite desplegarse.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La conciencia humana enfrentada a pérdida, culpa, muerte y deseo de trascendencia.",
      },
      {
        titulo: "La luz",
        texto:
          "La polifonía como modelo de convivencia entre voces autónomas.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Contrapunto, fuga, variación y armonía convertidos en pensamiento sonoro.",
      },
    ],

    aprendizajes: [
      "Construir complejidad desde una regla clara.",
      "Permitir que cada voz conserve autonomía.",
      "Transformar repetición en desarrollo.",
      "Unir técnica y emoción sin jerarquizarlas.",
      "Crear una estructura capaz de sobrevivir a múltiples interpretaciones.",
    ],

    obras: [
      {
        titulo: "Pasión según San Mateo",
        razon:
          "Relato, coro, dolor y contemplación organizados en una arquitectura espiritual inmensa.",
      },
      {
        titulo: "Variaciones Goldberg",
        razon:
          "Una misma base armónica produce un universo completo de transformaciones.",
      },
      {
        titulo: "El arte de la fuga",
        razon:
          "La investigación contrapuntística llevada hasta un límite abierto e inacabado.",
      },
      {
        titulo: "Misa en si menor",
        razon:
          "Tradiciones, estilos y épocas reunidos dentro de una unidad monumental.",
      },
      {
        titulo: "El clave bien temperado",
        razon:
          "Preludios y fugas que exploran sistemáticamente posibilidades tonales y expresivas.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Las siete reliquias pueden leerse como voces independientes que construyen una memoria común.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Cada estación desarrolla un motivo propio dentro de una arquitectura mayor de descenso y retorno.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Las vidas residuales forman una polifonía donde ninguna voz explica por sí sola la ley del mundo.",
      },
    ],

    constelacion: [
      "Arvo Pärt",
      "Gustav Mahler",
      "Philip Glass",
      "Jon Fosse",
      "Peter Zumthor",
      "Tadao Ando",
    ],
  },

  [normalizarNombreCuratorial("Gustav Mahler")]: {
    pregunta:
      "¿Cómo puede una sinfonía contener un mundo que al mismo tiempo nace, ama, marcha y desaparece?",

    introduccion:
      "Mahler concibió la sinfonía como un universo. Marchas, canciones populares, naturaleza, ironía, terror y éxtasis aparecen dentro de una misma forma. Su música no elimina las contradicciones: las hace convivir hasta que adquieren dimensión cósmica.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La conciencia de la muerte atravesando incluso los momentos de mayor belleza.",
      },
      {
        titulo: "La luz",
        texto:
          "La capacidad de una obra para contener experiencias opuestas sin reducirlas.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Orquesta expandida, cantos, marchas, naturaleza y rupturas de escala organizados dramáticamente.",
      },
    ],

    aprendizajes: [
      "Construir una obra capaz de contener contradicciones.",
      "Cambiar de escala sin perder unidad.",
      "Utilizar materiales populares y elevados sin jerarquía rígida.",
      "Permitir que la ironía conviva con lo sublime.",
      "Hacer del retorno de un motivo una experiencia transformada.",
    ],

    obras: [
      {
        titulo: "Sinfonía n.º 2, Resurrección",
        razon:
          "Muerte, memoria y renacimiento desplegados desde una marcha fúnebre hasta una expansión coral.",
      },
      {
        titulo: "Sinfonía n.º 5",
        razon:
          "Un recorrido desde la oscuridad inicial hasta una afirmación luminosa y compleja.",
      },
      {
        titulo: "Das Lied von der Erde",
        razon:
          "Naturaleza, despedida y fugacidad reunidas en una obra entre canción y sinfonía.",
      },
      {
        titulo: "Sinfonía n.º 9",
        razon:
          "La despedida convertida en disolución lenta del sonido y del tiempo.",
      },
      {
        titulo: "Kindertotenlieder",
        razon:
          "El duelo por los hijos expresado mediante una intimidad musical devastadora.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La obra reúne intimidad, violencia histórica, naturaleza y transmisión dentro de una escala emocional amplia.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El descenso alterna lo grotesco, lo trágico, lo colectivo y lo íntimo como movimientos de una gran sinfonía.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Bielka contiene muerte, infancia, animales, memoria y trascendencia dentro de una misma arquitectura.",
      },
    ],

    constelacion: [
      "Johann Sebastian Bach",
      "Henryk Górecki",
      "Leonard Cohen",
      "Rainer Maria Rilke",
      "Tarkovski",
      "Käthe Kollwitz",
    ],
  },


  [normalizarNombreCuratorial("Leonard Cohen")]: {
    pregunta:
      "¿Puede una voz atravesar el deseo, la fe y la derrota sin dejar de ser íntima?",

    introduccion:
      "Leonard Cohen escribió desde la grieta entre lo sagrado y lo carnal. Sus canciones no ofrecen pureza ni redención sencilla: reúnen deseo, culpa, oración, ironía y pérdida dentro de una voz que parece hablar al oído de una sola persona.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La imposibilidad de separar completamente amor, pérdida, cuerpo, fe y culpa.",
      },
      {
        titulo: "La luz",
        texto:
          "La dignidad de reconocer la fractura sin convertirla en cinismo.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Versos sobrios, imágenes bíblicas, melodías contenidas y una voz cada vez más grave y cercana.",
      },
    ],

    aprendizajes: [
      "Escribir lo espiritual sin negar el cuerpo.",
      "Utilizar una voz sencilla para sostener grandes contradicciones.",
      "Encontrar precisión dentro de la repetición.",
      "Convertir vulnerabilidad en autoridad poética.",
      "Dejar que una canción conserve misterio después de ser comprendida.",
    ],

    obras: [
      {
        titulo: "Songs of Leonard Cohen",
        razon:
          "La intimidad, el deseo y la tradición poética convertidos en una primera voz musical plenamente reconocible.",
      },
      {
        titulo: "Songs of Love and Hate",
        razon:
          "Amor, resentimiento, culpa y belleza llevados a una concentración extrema.",
      },
      {
        titulo: "Various Positions",
        razon:
          "Fe, deseo y caída reunidos en canciones que permanecen abiertas a múltiples lecturas.",
      },
      {
        titulo: "I'm Your Man",
        razon:
          "Una nueva voz electrónica, irónica y grave que convierte la madurez en transformación artística.",
      },
      {
        titulo: "You Want It Darker",
        razon:
          "La despedida, la obediencia y la proximidad de la muerte expresadas sin sentimentalismo.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "El amor y la pérdida sobreviven mediante una voz que no promete reparar lo irreparable.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Deseo, culpa, fe y cuerpo se confunden dentro de personajes que buscan alimento emocional y espiritual.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La llamada, la despedida y la aceptación de una ley desconocida encuentran una resonancia profundamente coheniana.",
      },
    ],

    constelacion: [
      "Rainer Maria Rilke",
      "Federico García Lorca",
      "Gustav Mahler",
      "Nick Cave",
      "Simone Weil",
      "Arvo Pärt",
    ],
  },

  [normalizarNombreCuratorial("Claude Debussy")]: {
    pregunta:
      "¿Puede la música sugerir un mundo sin tener que describirlo por completo?",

    introduccion:
      "Debussy liberó la música de la obligación de avanzar siempre hacia una resolución. El agua, la niebla, la luz, el viento y el deseo aparecen como atmósferas cambiantes. Su obra no dibuja contornos cerrados: permite que el sonido conserve la movilidad de una impresión.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La rigidez de un lenguaje que obliga a cada tensión a resolverse de una única manera.",
      },
      {
        titulo: "La luz",
        texto:
          "La posibilidad de crear profundidad mediante color, suspensión y ambigüedad.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Escalas modales, armonías flotantes, timbres delicados y formas que parecen transformarse mientras se escuchan.",
      },
    ],

    aprendizajes: [
      "Sugerir en lugar de describir.",
      "Trabajar con color y textura como estructura.",
      "Permitir que una tensión permanezca abierta.",
      "Usar el silencio y la resonancia como parte de la frase.",
      "Construir movimiento sin depender de una dirección evidente.",
    ],

    obras: [
      {
        titulo: "La mer",
        razon:
          "El océano convertido en movimiento, luz, profundidad y materia orquestal.",
      },
      {
        titulo: "Prélude à l'après-midi d'un faune",
        razon:
          "Deseo, sueño y sensualidad desplegados mediante una forma musical suspendida.",
      },
      {
        titulo: "Pelléas et Mélisande",
        razon:
          "Una ópera de silencios, símbolos y afectos que nunca llegan a explicarse completamente.",
      },
      {
        titulo: "Images",
        razon:
          "Paisajes, reflejos y ritmos convertidos en arquitectura sonora.",
      },
      {
        titulo: "Préludes",
        razon:
          "Pequeños mundos donde cada pieza construye una atmósfera autónoma.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La luz, el árbol y la memoria necesitan una música que sugiera sin subrayar.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Cada estación puede poseer un color sonoro propio, cambiante y no completamente resolutivo.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La niebla, el agua y el tiempo suspendido del mundo encuentran una afinidad natural con su lenguaje.",
      },
    ],

    constelacion: [
      "Maurice Ravel",
      "Arvo Pärt",
      "Tarkovski",
      "James Turrell",
      "Mark Rothko",
      "Virginia Woolf",
    ],
  },

  [normalizarNombreCuratorial("Peter Zumthor")]: {
    pregunta:
      "¿Puede un edificio recordar mediante la temperatura, el sonido y la materia?",

    introduccion:
      "Zumthor diseña espacios que parecen haber existido antes de ser construidos. Piedra, madera, agua, sombra, olor y reverberación forman una experiencia inseparable. Su arquitectura no busca impresionar desde lejos: transforma lentamente a quien entra.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La pérdida de una relación sensorial y corporal con los espacios que habitamos.",
      },
      {
        titulo: "La luz",
        texto:
          "La arquitectura como presencia íntima capaz de activar memoria y atención.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Materia, proporción, recorrido, temperatura, sonido y luz organizados como experiencia completa.",
      },
    ],

    aprendizajes: [
      "Diseñar desde el cuerpo y no únicamente desde la imagen.",
      "Escuchar las cualidades emocionales de cada material.",
      "Construir una secuencia de llegada y descubrimiento.",
      "Permitir que la luz revele la materia.",
      "Crear atmósfera sin recurrir a decoración superflua.",
    ],

    obras: [
      {
        titulo: "Termas de Vals",
        razon:
          "Piedra, agua y penumbra construyen una experiencia corporal casi geológica.",
      },
      {
        titulo: "Capilla Bruder Klaus",
        razon:
          "Un interior quemado y vertical convierte materia, luz y silencio en experiencia espiritual.",
      },
      {
        titulo: "Museo Kolumba",
        razon:
          "Ruinas, ciudad y arquitectura contemporánea reunidas sin borrar sus distintas temporalidades.",
      },
      {
        titulo: "Pabellón de Suiza, Hannover 2000",
        razon:
          "Madera, olor, sonido y desmontabilidad organizados como presencia temporal.",
      },
      {
        titulo: "Steilneset Memorial",
        razon:
          "Arquitectura, memoria y paisaje construyen un recorrido dedicado a las víctimas de persecución.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "El Árbol Blanco y sus reliquias piden una arquitectura donde materia y memoria sean inseparables.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Cada estación puede sentirse mediante temperatura, humedad, reverberación y textura.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "El arco, la puerta de piedra y el laberinto exigen una arquitectura anterior a toda explicación.",
      },
    ],

    constelacion: [
      "Tadao Ando",
      "Carlo Scarpa",
      "Mark Rothko",
      "Arvo Pärt",
      "Tarkovski",
      "Antoni Tàpies",
    ],
  },

  [normalizarNombreCuratorial("Tadao Ando")]: {
    pregunta:
      "¿Cuánta luz necesita un muro para dejar de ser una barrera?",

    introduccion:
      "Ando construye con hormigón, agua, sombra y geometría para intensificar la percepción. Sus espacios no aíslan al ser humano de la naturaleza: crean una distancia precisa desde la que volver a sentirla.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La separación entre vida cotidiana, naturaleza y experiencia interior.",
      },
      {
        titulo: "La luz",
        texto:
          "La capacidad de una abertura mínima para transformar completamente un espacio.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Hormigón desnudo, geometría elemental, agua, recorridos y cortes de luz.",
      },
    ],

    aprendizajes: [
      "Construir intensidad mediante pocos elementos.",
      "Utilizar el recorrido como preparación emocional.",
      "Permitir que luz y sombra sean materiales.",
      "Crear silencio mediante proporción.",
      "Relacionar interior y paisaje sin disolver sus límites.",
    ],

    obras: [
      {
        titulo: "Iglesia de la Luz",
        razon:
          "Una cruz abierta en el muro convierte la luz en estructura espiritual.",
      },
      {
        titulo: "Templo del Agua",
        razon:
          "El visitante desciende bajo un estanque de lotos hacia un espacio rojo y contemplativo.",
      },
      {
        titulo: "Chichu Art Museum",
        razon:
          "Arte, tierra, geometría y luz natural organizados dentro del paisaje.",
      },
      {
        titulo: "Casa Azuma",
        razon:
          "Un patio abierto obliga a atravesar la naturaleza para vivir la casa.",
      },
      {
        titulo: "Hill of the Buddha",
        razon:
          "La figura monumental solo se revela después de recorrer un paisaje construido.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Una arquitectura mínima puede convertir el Árbol Blanco en presencia y no en decoración.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El descenso puede construirse mediante umbrales, cambios de luz y oposición entre vacío y masa.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "El laberinto y la puerta de piedra necesitan una geometría que haga sentir la ley antes de explicarla.",
      },
    ],

    constelacion: [
      "Peter Zumthor",
      "Mark Rothko",
      "James Turrell",
      "Arvo Pärt",
      "Isamu Noguchi",
      "Tarkovski",
    ],
  },

  [normalizarNombreCuratorial("James Turrell")]: {
    pregunta:
      "¿Qué ocurre cuando dejamos de mirar la luz y comenzamos a habitarla?",

    introduccion:
      "Turrell utiliza luz, color, cielo y arquitectura para alterar la percepción. Sus obras no iluminan objetos: convierten la propia visión en materia. El espectador descubre que mirar también es una experiencia física.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La costumbre de mirar sin ser conscientes del acto de percibir.",
      },
      {
        titulo: "La luz",
        texto:
          "La percepción convertida en acontecimiento y espacio habitable.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Campos lumínicos, aperturas al cielo, color saturado y arquitectura perceptiva.",
      },
    ],

    aprendizajes: [
      "Trabajar con la percepción antes que con la representación.",
      "Utilizar el color como espacio.",
      "Modificar la experiencia mediante una intervención mínima.",
      "Dar tiempo a los ojos para adaptarse.",
      "Construir una obra que dependa realmente de la presencia del visitante.",
    ],

    obras: [
      {
        titulo: "Roden Crater",
        razon:
          "Un volcán transformado en observatorio de luz, cielo y fenómenos astronómicos.",
      },
      {
        titulo: "Skyspaces",
        razon:
          "Aberturas arquitectónicas que convierten el cielo en superficie cambiante.",
      },
      {
        titulo: "Afrum",
        razon:
          "La luz proyectada adquiere la apariencia imposible de un volumen sólido.",
      },
      {
        titulo: "Ganzfeld",
        razon:
          "El campo visual pierde límites y altera la orientación corporal.",
      },
      {
        titulo: "Meeting",
        razon:
          "Un espacio aparentemente sencillo cambia por completo durante el tránsito de la luz natural.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La blancura del árbol puede actuar como fenómeno perceptivo que cambia con la mirada y el tiempo.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Cada estación podría alterar el cuerpo mediante color, oscuridad y adaptación visual.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La luz del laberinto puede comportarse como una ley física y espiritual simultánea.",
      },
    ],

    constelacion: [
      "Mark Rothko",
      "Tadao Ando",
      "Peter Zumthor",
      "Bill Viola",
      "Claude Debussy",
      "Arvo Pärt",
    ],
  },

  [normalizarNombreCuratorial("Isamu Noguchi")]: {
    pregunta:
      "¿Puede una piedra conservar su silencio y al mismo tiempo convertirse en gesto humano?",

    introduccion:
      "Noguchi trabajó entre escultura, paisaje, mobiliario, arquitectura y escenografía. No entendía los objetos como formas aisladas, sino como relaciones entre cuerpo, materia, vacío y entorno.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La separación artificial entre arte, vida cotidiana, naturaleza y espacio público.",
      },
      {
        titulo: "La luz",
        texto:
          "La posibilidad de que una forma acompañe al cuerpo sin imponerse sobre él.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Piedra, papel, luz, tierra y geometría convertidos en esculturas habitables.",
      },
    ],

    aprendizajes: [
      "Diseñar relaciones y no únicamente objetos.",
      "Escuchar la forma original de un material.",
      "Trabajar entre disciplinas sin perder coherencia.",
      "Utilizar el vacío como parte de la escultura.",
      "Crear belleza compatible con el uso cotidiano.",
    ],

    obras: [
      {
        titulo: "Akari",
        razon:
          "Lámparas de papel donde luz, artesanía y ligereza forman una presencia doméstica.",
      },
      {
        titulo: "Black Sun",
        razon:
          "Una piedra monumental perforada convierte masa y vacío en una única forma.",
      },
      {
        titulo: "Noguchi Garden Museum",
        razon:
          "Esculturas y paisaje organizados como recorrido y conversación material.",
      },
      {
        titulo: "Red Cube",
        razon:
          "Una geometría inclinada interrumpe y activa el espacio urbano.",
      },
      {
        titulo: "Escenografías para Martha Graham",
        razon:
          "La escultura convertida en compañero activo del movimiento corporal.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Las reliquias pueden exponerse como formas silenciosas capaces de organizar el espacio a su alrededor.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Objetos, bancos, piedras y luces pueden transformar cada estación en un paisaje corporal.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La puerta, el arco y los objetos del laberinto pueden conservar una materialidad austera y esencial.",
      },
    ],

    constelacion: [
      "Tadao Ando",
      "Peter Zumthor",
      "Pina Bausch",
      "James Turrell",
      "Martha Graham",
      "Antoni Tàpies",
    ],
  },

  [normalizarNombreCuratorial("Bill Viola")]: {
    pregunta:
      "¿Puede una imagen ralentizada revelar lo que una emoción esconde mientras sucede?",

    introduccion:
      "Viola utiliza agua, fuego, tiempo, sonido y cuerpo para construir experiencias cercanas al rito. Sus vídeos prolongan un gesto hasta que deja de ser anecdótico y se convierte en tránsito entre nacimiento, pérdida, transformación y muerte.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La imposibilidad de detener los cambios que atraviesan el cuerpo y los vínculos.",
      },
      {
        titulo: "La luz",
        texto:
          "La atención prolongada como acceso a dimensiones invisibles de una emoción.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Vídeo ralentizado, sonido envolvente, agua, fuego y figuras humanas tratadas como presencias rituales.",
      },
    ],

    aprendizajes: [
      "Alterar el tiempo para transformar el significado.",
      "Utilizar elementos naturales como fuerzas narrativas.",
      "Construir una instalación desde el cuerpo del espectador.",
      "Convertir un gesto sencillo en rito.",
      "Permitir que una imagen sea simultáneamente física y espiritual.",
    ],

    obras: [
      {
        titulo: "The Crossing",
        razon:
          "Un cuerpo es consumido alternativamente por agua y fuego hasta desaparecer.",
      },
      {
        titulo: "The Reflecting Pool",
        razon:
          "Un salto suspendido altera la relación entre cuerpo, agua, reflejo y tiempo.",
      },
      {
        titulo: "The Quintet of the Astonished",
        razon:
          "Una emoción colectiva se despliega lentamente hasta adquirir condición escultórica.",
      },
      {
        titulo: "Martyrs",
        razon:
          "Cuatro cuerpos resisten tierra, aire, fuego y agua dentro de una composición ritual.",
      },
      {
        titulo: "Nantes Triptych",
        razon:
          "Nacimiento, cuerpo suspendido y muerte forman una única arquitectura audiovisual.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Fuego, cuerpo y memoria podrían convertirse en una instalación temporal que rehúya la ilustración literal.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Cada estación puede experimentarse como tránsito corporal mediante imagen, sonido y duración.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "El paso entre mundos, la llamada y la imposibilidad de morir fuera del laberinto pertenecen a su lenguaje ritual.",
      },
    ],

    constelacion: [
      "James Turrell",
      "Tarkovski",
      "Chiharu Shiota",
      "Pina Bausch",
      "Mark Rothko",
      "Peter Zumthor",
    ],
  },

  [normalizarNombreCuratorial("Sebastião Salgado")]: {
    pregunta:
      "¿Cómo fotografiar el sufrimiento y el trabajo sin reducir a una persona a su dolor?",

    introduccion:
      "Salgado construyó grandes relatos fotográficos sobre trabajo, migración, pobreza, territorio y naturaleza. Sus imágenes buscan escala épica, pero permanecen sostenidas por cuerpos concretos, miradas y gestos individuales.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La desigualdad que obliga a millones de personas a desplazarse, trabajar y sobrevivir en condiciones extremas.",
      },
      {
        titulo: "La luz",
        texto:
          "La dignidad visible incluso dentro de circunstancias que intentan negarla.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Blanco y negro de gran contraste, composición monumental y series fotográficas de larga duración.",
      },
    ],

    aprendizajes: [
      "Trabajar un tema durante años.",
      "Construir contexto además de imágenes individuales.",
      "Buscar dignidad sin ocultar la violencia estructural.",
      "Comprender la escala colectiva mediante cuerpos concretos.",
      "Asumir la responsabilidad ética de la mirada.",
    ],

    obras: [
      {
        titulo: "Trabajadores",
        razon:
          "Un archivo monumental del trabajo manual durante la transformación industrial del mundo.",
      },
      {
        titulo: "Éxodos",
        razon:
          "Migraciones, desplazamientos y fronteras contemplados como experiencia humana global.",
      },
      {
        titulo: "Serra Pelada",
        razon:
          "Miles de cuerpos convierten una mina en imagen de esfuerzo, explotación y multitud.",
      },
      {
        titulo: "Sahel",
        razon:
          "Hambre, sequía y desplazamiento documentados mediante una mirada de extrema gravedad.",
      },
      {
        titulo: "Génesis",
        razon:
          "Territorios, animales y comunidades observados como memoria viva del planeta.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La memoria de las víctimas necesita imágenes que conserven dignidad y contexto.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Trabajo, migración, pobreza y hambre se revelan como estructuras colectivas antes que como destinos individuales.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Las llegadas desde el mar y los cuerpos desplazados requieren una mirada que no los convierta en espectáculo.",
      },
    ],

    constelacion: [
      "Käthe Kollwitz",
      "Josef Koudelka",
      "Doris Salcedo",
      "Toni Morrison",
      "Theo Angelopoulos",
      "Francesca Woodman",
    ],
  },

  [normalizarNombreCuratorial("Francesca Woodman")]: {
    pregunta:
      "¿Puede un cuerpo desaparecer dentro de una imagen y, precisamente por ello, volverse más presente?",

    introduccion:
      "Woodman fotografió cuerpos que se mezclan con paredes, papeles, habitaciones y movimiento. Sus autorretratos no afirman una identidad estable: investigan cómo una presencia puede fragmentarse, ocultarse y dejar una huella.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La dificultad de permanecer visible sin quedar fijada por la mirada ajena.",
      },
      {
        titulo: "La luz",
        texto:
          "La desaparición parcial como forma de libertad y exploración.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Blanco y negro, exposiciones largas, interiores deteriorados, cuerpo y movimiento.",
      },
    ],

    aprendizajes: [
      "Utilizar el cuerpo como pregunta y no como respuesta.",
      "Trabajar la ausencia dentro del encuadre.",
      "Convertir limitaciones técnicas en lenguaje.",
      "Crear continuidad entre figura y arquitectura.",
      "Permitir que una imagen conserve vulnerabilidad y extrañeza.",
    ],

    obras: [
      {
        titulo: "House Series",
        razon:
          "El cuerpo se integra en habitaciones erosionadas hasta volverse parte de su memoria.",
      },
      {
        titulo: "Space²",
        razon:
          "La figura femenina explora desaparición, encierro y duplicidad dentro del espacio.",
      },
      {
        titulo: "Self-Deceit",
        razon:
          "Espejo, cuerpo y percepción convierten el autorretrato en problema.",
      },
      {
        titulo: "Providence, Rhode Island",
        razon:
          "Imágenes donde movimiento y exposición prolongada desestabilizan la presencia.",
      },
      {
        titulo: "Some Disordered Interior Geometries",
        razon:
          "Libro de artista que relaciona cuerpo, dibujo, texto y arquitectura.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "El cuerpo ausente continúa adherido a habitaciones, objetos y superficies.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Los cuerpos se confunden con espacios que los clasifican, esconden o transforman.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La identidad incompleta y los cuerpos que no envejecen participan de una presencia siempre inestable.",
      },
    ],

    constelacion: [
      "Louise Bourgeois",
      "Alejandra Pizarnik",
      "Chiharu Shiota",
      "Pina Bausch",
      "Clarice Lispector",
      "Bill Viola",
    ],
  },

  [normalizarNombreCuratorial("Pina Bausch")]: {
    pregunta:
      "¿Qué revela un cuerpo cuando repite un gesto hasta que ya no puede fingir?",

    introduccion:
      "Pina Bausch convirtió la danza en una investigación sobre deseo, miedo, violencia, ternura y memoria. Sus intérpretes no representan emociones: atraviesan acciones que desgastan las máscaras sociales y vuelven visible aquello que el cuerpo recuerda.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La violencia escondida dentro de los gestos aprendidos para amar, obedecer o pertenecer.",
      },
      {
        titulo: "La luz",
        texto:
          "La capacidad del cuerpo para transformar experiencia personal en lenguaje colectivo.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Repetición, movimiento cotidiano, escenografías materiales, palabra y presencia de los intérpretes.",
      },
    ],

    aprendizajes: [
      "Preguntar al intérprete en lugar de imponerle una respuesta.",
      "Convertir un gesto cotidiano en coreografía.",
      "Utilizar repetición para revelar violencia o deseo.",
      "Construir espacio con tierra, agua, flores y objetos reales.",
      "Permitir que fragilidad y humor convivan.",
    ],

    obras: [
      {
        titulo: "Café Müller",
        razon:
          "Cuerpos, sillas y ojos cerrados construyen un espacio de deseo, choque y memoria.",
      },
      {
        titulo: "La consagración de la primavera",
        razon:
          "La danza sobre tierra convierte sacrificio, miedo y fuerza colectiva en experiencia física.",
      },
      {
        titulo: "Kontakthof",
        razon:
          "La seducción y la violencia social se repiten en un salón de baile.",
      },
      {
        titulo: "Vollmond",
        razon:
          "Agua, piedra y movimiento liberan una energía corporal celebratoria y extrema.",
      },
      {
        titulo: "Nelken",
        razon:
          "Un campo de claveles acoge belleza, control, memoria y fragilidad.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "El duelo, la violencia y la memoria podrían transformarse en gestos repetidos alrededor del Árbol Blanco.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Cada hambre posee una postura, un movimiento y una forma particular de acercarse al otro.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Los cuerpos que no envejecen, los animales y el recorrido al laberinto pueden existir como coreografía ritual.",
      },
    ],

    constelacion: [
      "Louise Bourgeois",
      "Francesca Woodman",
      "Bill Viola",
      "Isamu Noguchi",
      "Samuel Beckett",
      "Chiharu Shiota",
    ],
  },


  [normalizarNombreCuratorial("Fiódor Dostoyevski")]: {
    pregunta:
      "¿Hasta dónde puede descender una conciencia antes de dejar de reconocerse?",

    introduccion:
      "Dostoyevski convirtió la novela en un tribunal interior. Culpa, fe, crimen, libertad, humillación y deseo se enfrentan dentro de personajes que no pueden reducirse a una sola idea. Sus voces discuten porque la verdad moral nunca pertenece por completo a una de ellas.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La conciencia dividida entre deseo de libertad, necesidad de amor y capacidad de destrucción.",
      },
      {
        titulo: "La luz",
        texto:
          "La posibilidad de que incluso una vida degradada conserve una última apertura hacia el otro.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Diálogo extremo, confesión, contradicción y polifonía convertidos en combate espiritual.",
      },
    ],

    aprendizajes: [
      "Construir personajes capaces de contradecir la tesis de la obra.",
      "Convertir el conflicto moral en acción dramática.",
      "Dar autonomía real a cada voz.",
      "Explorar la culpa sin simplificarla.",
      "Permitir que compasión y violencia habiten el mismo personaje.",
    ],

    obras: [
      {
        titulo: "Crimen y castigo",
        razon:
          "El crimen como experimento intelectual que termina revelando la fragilidad moral del individuo.",
      },
      {
        titulo: "Los hermanos Karamázov",
        razon:
          "Fe, libertad, familia y responsabilidad reunidas en una gran arquitectura polifónica.",
      },
      {
        titulo: "El idiota",
        razon:
          "La bondad radical enfrentada a una sociedad incapaz de recibirla sin destruirla.",
      },
      {
        titulo: "Demonios",
        razon:
          "Ideas políticas, resentimiento y nihilismo transformados en fuerzas de descomposición colectiva.",
      },
      {
        titulo: "Memorias del subsuelo",
        razon:
          "Una conciencia que convierte su lucidez, humillación y contradicción en encierro.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La culpa, la justicia y la imposibilidad de reparar completamente una violencia atraviesan toda la memoria de María.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El descenso somete a cada personaje a una prueba donde deseo, vergüenza, fe y necesidad se vuelven inseparables.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Iván encarna una conciencia que sobrevive dentro de culpa, amor fraterno, obsesión y transformación.",
      },
    ],

    constelacion: [
      "Albert Camus",
      "Friedrich Nietzsche",
      "Franz Kafka",
      "Simone Weil",
      "Ingmar Bergman",
      "Cormac McCarthy",
    ],
  },

  [normalizarNombreCuratorial("Friedrich Nietzsche")]: {
    pregunta:
      "¿Puede una vida afirmarse incluso cuando ya no existe ninguna verdad que la justifique?",

    introduccion:
      "Nietzsche sometió a crítica la moral, la verdad, la religión y la idea misma de sujeto. No propuso una doctrina cerrada: convirtió el pensamiento en una fuerza capaz de examinar los valores que organizan una vida y preguntar quién se beneficia de ellos.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La sospecha de que muchas verdades morales encubren miedo, resentimiento y voluntad de dominio.",
      },
      {
        titulo: "La luz",
        texto:
          "La posibilidad de crear valores capaces de afirmar la vida sin refugiarse en un más allá.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Aforismo, genealogía, provocación, poesía y máscara filosófica.",
      },
    ],

    aprendizajes: [
      "Preguntar por el origen de cada valor.",
      "Distinguir una idea de la necesidad que la produjo.",
      "Escribir pensamiento con ritmo y fuerza.",
      "Aceptar la contradicción como método.",
      "Examinar si una obra afirma o empobrece la vida.",
    ],

    obras: [
      {
        titulo: "Así habló Zaratustra",
        razon:
          "Una obra filosófica y poética sobre transformación, superación y creación de valores.",
      },
      {
        titulo: "Más allá del bien y del mal",
        razon:
          "La crítica de las certezas morales y filosóficas heredadas.",
      },
      {
        titulo: "La genealogía de la moral",
        razon:
          "El análisis histórico y psicológico de culpa, castigo, resentimiento y conciencia.",
      },
      {
        titulo: "El nacimiento de la tragedia",
        razon:
          "Lo apolíneo y lo dionisíaco como fuerzas complementarias del arte y la existencia.",
      },
      {
        titulo: "La gaya ciencia",
        razon:
          "Pensamiento, libertad, muerte de Dios y eterno retorno desarrollados mediante una escritura experimental.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La obra pregunta qué valores sobreviven cuando justicia, religión y comunidad no logran proteger a la víctima.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Cada estación revela una moral construida alrededor de fuerza, necesidad, obediencia y resentimiento.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "El eterno retorno se convierte en prueba existencial dentro de un mundo donde el tiempo no ofrece una salida sencilla.",
      },
    ],

    constelacion: [
      "Fiódor Dostoyevski",
      "Albert Camus",
      "Georges Bataille",
      "Gustav Mahler",
      "Ingmar Bergman",
      "László Krasznahorkai",
    ],
  },

  [normalizarNombreCuratorial("Cormac McCarthy")]: {
    pregunta:
      "¿Qué forma adopta la dignidad cuando el mundo ha dejado de prometer justicia?",

    introduccion:
      "McCarthy escribe paisajes donde violencia, naturaleza, azar y ley se confunden. Sus personajes atraviesan territorios despojados de protección moral y deben decidir si todavía es posible conservar una forma de cuidado.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La violencia como fuerza anterior y posterior a cualquier orden humano.",
      },
      {
        titulo: "La luz",
        texto:
          "La ternura mínima que persiste incluso dentro de un mundo devastado.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Prosa bíblica, precisión física, diálogos desnudos y paisajes de escala moral.",
      },
    ],

    aprendizajes: [
      "Construir un paisaje con poder ético.",
      "Evitar explicar la violencia más de lo necesario.",
      "Utilizar el diálogo con extrema concentración.",
      "Crear símbolos elementales sin convertirlos en alegorías cerradas.",
      "Sostener ternura y brutalidad dentro de la misma obra.",
    ],

    obras: [
      {
        titulo: "Meridiano de sangre",
        razon:
          "Violencia, frontera y mito americano llevados a una dimensión bíblica y aterradora.",
      },
      {
        titulo: "La carretera",
        razon:
          "Un padre y un hijo conservan una forma mínima de humanidad dentro del fin del mundo.",
      },
      {
        titulo: "No es país para viejos",
        razon:
          "Azar, mal y ley moral enfrentados dentro de una persecución contemporánea.",
      },
      {
        titulo: "Todos los hermosos caballos",
        razon:
          "Juventud, pérdida y desaparición de un mundo pastoral idealizado.",
      },
      {
        titulo: "El pasajero",
        razon:
          "Culpa, ciencia, duelo y realidad desestabilizada dentro de una conciencia fragmentada.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La violencia no ofrece una explicación proporcional a la pérdida, pero obliga a decidir qué memoria conservar.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El cuerpo, la necesidad y el poder adquieren una crudeza material semejante a sus territorios fronterizos.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Iván atraviesa un mundo residual donde sobrevivir ya no garantiza conservar la humanidad.",
      },
    ],

    constelacion: [
      "Fiódor Dostoyevski",
      "William Faulkner",
      "Primo Levi",
      "Käthe Kollwitz",
      "Béla Tarr",
      "Friedrich Nietzsche",
    ],
  },

  [normalizarNombreCuratorial("W. G. Sebald")]: {
    pregunta:
      "¿Cómo puede la memoria reconstruir una historia cuando solo conserva fragmentos, fotografías y ruinas?",

    introduccion:
      "Sebald escribió libros donde viaje, ensayo, ficción, fotografía y archivo se mezclan. Sus narradores caminan por territorios europeos mientras descubren que cada paisaje contiene capas de destrucción que el presente apenas reconoce.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La desaparición de vidas y comunidades que apenas dejaron documentos suficientes para ser recordadas.",
      },
      {
        titulo: "La luz",
        texto:
          "La atención paciente capaz de reconstruir vínculos entre restos dispersos.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Prosa digresiva, fotografías, viajes y asociaciones históricas sin fronteras genéricas.",
      },
    ],

    aprendizajes: [
      "Tratar el documento como parte de la narración.",
      "Construir una obra mediante asociaciones.",
      "Permitir que el viaje sea también investigación.",
      "Escribir la historia desde sus restos.",
      "Aceptar la incertidumbre del archivo.",
    ],

    obras: [
      {
        titulo: "Austerlitz",
        razon:
          "Una vida reconstruida desde arquitectura, infancia perdida, fotografías y memoria histórica.",
      },
      {
        titulo: "Los anillos de Saturno",
        razon:
          "Un paseo por Inglaterra se convierte en cartografía de imperios, destrucciones y recuerdos.",
      },
      {
        titulo: "Los emigrados",
        razon:
          "Cuatro vidas desplazadas por la historia y conservadas mediante narración, imagen y testimonio.",
      },
      {
        titulo: "Vértigo",
        razon:
          "Viaje, literatura y memoria personal organizados como una experiencia de desorientación.",
      },
      {
        titulo: "Sobre la historia natural de la destrucción",
        razon:
          "La dificultad de la cultura alemana para narrar la devastación de sus ciudades.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Las reliquias, el paquete final y los desplazamientos construyen un archivo incompleto que atraviesa décadas.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Cada estación conserva restos de historias anteriores que el viajero solo puede reconstruir parcialmente.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Bielka funciona como archivo territorial de muertos incompletos, objetos y memorias que no encontraron cierre.",
      },
    ],

    constelacion: [
      "Olga Tokarczuk",
      "Primo Levi",
      "Paul Celan",
      "Theo Angelopoulos",
      "Josef Koudelka",
      "Jorge Luis Borges",
    ],
  },

  [normalizarNombreCuratorial("Paul Celan")]: {
    pregunta:
      "¿Puede la poesía continuar después de que el lenguaje haya sido utilizado para destruir?",

    introduccion:
      "Celan escribió desde una lengua herida por el exterminio. Sus poemas comprimen palabras, silencios, minerales, respiraciones y restos históricos. No restauran una lengua intacta: construyen una forma de hablar desde su fractura.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La destrucción de vidas, familias y lenguaje durante la Shoá.",
      },
      {
        titulo: "La luz",
        texto:
          "El poema como encuentro posible con un otro que quizá nunca responda.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Condensación, neologismo, ruptura sintáctica, silencio y precisión mineral.",
      },
    ],

    aprendizajes: [
      "Aceptar que una lengua también carga con su historia.",
      "Escribir desde la fractura sin fingir reparación.",
      "Dar peso material a cada palabra.",
      "Utilizar silencio y espacio como parte del poema.",
      "Comprender el poema como envío hacia otro.",
    ],

    obras: [
      {
        titulo: "Amapola y memoria",
        razon:
          "Memoria, amor y exterminio reunidos en una poesía de extrema tensión.",
      },
      {
        titulo: "Fuga de muerte",
        razon:
          "La maquinaria del exterminio convertida en una composición repetitiva e insoportable.",
      },
      {
        titulo: "Reja de lenguaje",
        razon:
          "La comunicación aparece como cercanía y separación simultáneas.",
      },
      {
        titulo: "La rosa de nadie",
        razon:
          "Ausencia, nombre, judaísmo y creación atravesados por una lengua quebrada.",
      },
      {
        titulo: "Cambio de aliento",
        razon:
          "La poesía reducida a respiración, resto y encuentro imposible.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Nombrar a la víctima exige una lengua que no convierta la memoria en fórmula ni consuelo.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Las voces de los no amados y los cuerpos excluidos necesitan una escritura capaz de conservar su fractura.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Los objetos y nombres incompletos funcionan como restos enviados hacia quienes todavía pueden escucharlos.",
      },
    ],

    constelacion: [
      "Primo Levi",
      "Nelly Sachs",
      "Rainer Maria Rilke",
      "Alejandra Pizarnik",
      "Anselm Kiefer",
      "W. G. Sebald",
    ],
  },

  [normalizarNombreCuratorial("Primo Levi")]: {
    pregunta:
      "¿Cómo dar testimonio de una experiencia que intentó destruir incluso la posibilidad de ser contada?",

    introduccion:
      "Levi escribió desde la precisión del testigo y del químico. Su obra examina el sistema concentracionario sin convertirlo en abstracción, mito ni espectáculo. Cada detalle material protege la realidad de quienes fueron reducidos a número.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La deshumanización organizada como procedimiento cotidiano.",
      },
      {
        titulo: "La luz",
        texto:
          "La claridad del testimonio como defensa frente a negación, simplificación y olvido.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Prosa exacta, sobria y analítica sostenida por memoria, observación y responsabilidad.",
      },
    ],

    aprendizajes: [
      "Narrar hechos extremos sin dramatización innecesaria.",
      "Distinguir comprender de justificar.",
      "Conservar nombres, gestos y detalles concretos.",
      "Evitar convertir a las víctimas en una masa indistinta.",
      "Asumir que testimoniar también implica límites.",
    ],

    obras: [
      {
        titulo: "Si esto es un hombre",
        razon:
          "La vida en Auschwitz descrita desde cuerpos, rutinas, hambre y degradación sistemática.",
      },
      {
        titulo: "La tregua",
        razon:
          "El regreso desde el campo como viaje incierto entre liberación, desarraigo y memoria.",
      },
      {
        titulo: "Los hundidos y los salvados",
        razon:
          "Una reflexión rigurosa sobre testimonio, memoria, zona gris y responsabilidad.",
      },
      {
        titulo: "El sistema periódico",
        razon:
          "Química, autobiografía e historia reunidas mediante los elementos de la materia.",
      },
      {
        titulo: "La llave estrella",
        razon:
          "Trabajo, técnica y dignidad narrados mediante la voz de un montador industrial.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La memoria de María debe conservar detalles concretos frente a cualquier relato que la convierta únicamente en símbolo.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Hambre, jerarquía y deshumanización muestran cómo un sistema altera gradualmente la moral.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Quienes llegan conservan testimonios parciales de un mundo anterior que no puede reconstruirse por completo.",
      },
    ],

    constelacion: [
      "Paul Celan",
      "W. G. Sebald",
      "Ágota Kristóf",
      "Käthe Kollwitz",
      "Simone Weil",
      "Cormac McCarthy",
    ],
  },

  [normalizarNombreCuratorial("Virginia Woolf")]: {
    pregunta:
      "¿Cómo puede una novela mostrar la vida que transcurre detrás de cada gesto visible?",

    introduccion:
      "Woolf desplazó el centro de la narración hacia la conciencia, el tiempo interior y las percepciones mínimas. Sus novelas muestran que una habitación, una calle o una comida contienen vidas simultáneas que ninguna mirada exterior puede agotar.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La distancia entre la experiencia interior y los papeles sociales que intentan contenerla.",
      },
      {
        titulo: "La luz",
        texto:
          "La capacidad de una conciencia para revelar conexiones invisibles entre vidas separadas.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Flujo de conciencia, ritmo, cambios de perspectiva y tiempo subjetivo.",
      },
    ],

    aprendizajes: [
      "Narrar pensamiento sin convertirlo en explicación.",
      "Cambiar de conciencia con fluidez.",
      "Tratar el tiempo interior como estructura.",
      "Construir intensidad mediante detalles cotidianos.",
      "Escuchar vidas históricamente silenciadas.",
    ],

    obras: [
      {
        titulo: "La señora Dalloway",
        razon:
          "Un solo día contiene memoria, guerra, deseo, muerte y múltiples conciencias urbanas.",
      },
      {
        titulo: "Al faro",
        razon:
          "Familia, arte, ausencia y paso del tiempo organizados mediante percepciones cambiantes.",
      },
      {
        titulo: "Las olas",
        razon:
          "Seis voces construyen una conciencia coral desde infancia hasta muerte.",
      },
      {
        titulo: "Orlando",
        razon:
          "Identidad, género, tiempo e historia transformados mediante una biografía imposible.",
      },
      {
        titulo: "Una habitación propia",
        razon:
          "La creación femenina pensada desde condiciones materiales, económicas y simbólicas.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La memoria de María se construye desde conciencias distintas, tiempos superpuestos y objetos cotidianos.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Cada personaje experimenta el mismo espacio desde una forma distinta de deseo y necesidad.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La conciencia de Mara se forma mediante voces, huellas y tiempos que no pertenecen a una identidad única.",
      },
    ],

    constelacion: [
      "Clarice Lispector",
      "Fernando Pessoa",
      "Toni Morrison",
      "Francesca Woodman",
      "María Zambrano",
      "Claude Debussy",
    ],
  },

  [normalizarNombreCuratorial("Toni Morrison")]: {
    pregunta:
      "¿Cómo puede una comunidad recordar aquello que la historia oficial intentó convertir en silencio?",

    introduccion:
      "Morrison escribió sobre esclavitud, racismo, familia, deseo y memoria desde voces capaces de devolver complejidad a quienes fueron reducidos a categorías históricas. Sus novelas muestran que el pasado no desaparece: regresa en cuerpos, casas, nombres y fantasmas.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La violencia histórica transmitida a través de familias, cuerpos y generaciones.",
      },
      {
        titulo: "La luz",
        texto:
          "La recuperación de voces y vínculos que la historia dominante intentó borrar.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Polifonía, oralidad, mito, memoria fragmentada y presencia espectral.",
      },
    ],

    aprendizajes: [
      "Construir memoria colectiva mediante voces individuales.",
      "Representar la historia dentro del cuerpo.",
      "Utilizar lo espectral como forma de verdad.",
      "Dar densidad a personajes históricamente simplificados.",
      "Permitir que amor y violencia permanezcan trágicamente unidos.",
    ],

    obras: [
      {
        titulo: "Beloved",
        razon:
          "La esclavitud regresa como fantasma, cuerpo, culpa y memoria dentro de una familia.",
      },
      {
        titulo: "La canción de Salomón",
        razon:
          "Identidad, genealogía y mito organizan una búsqueda de origen y libertad.",
      },
      {
        titulo: "Sula",
        razon:
          "Amistad femenina, comunidad y transgresión observadas fuera de cualquier moral simplificadora.",
      },
      {
        titulo: "Ojos azules",
        razon:
          "Una niña interioriza una mirada racial que destruye su posibilidad de reconocerse.",
      },
      {
        titulo: "Jazz",
        razon:
          "Ciudad, deseo, violencia y memoria narrados mediante una estructura musical.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La víctima regresa mediante memoria, objeto y relato para exigir una escucha colectiva.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El hambre también es pertenencia, reconocimiento y derecho a ser visto por la comunidad.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Los muertos incompletos continúan afectando a los vivos y convierten el mundo en memoria encarnada.",
      },
    ],

    constelacion: [
      "Virginia Woolf",
      "William Faulkner",
      "José Saramago",
      "Han Kang",
      "Doris Salcedo",
      "Käthe Kollwitz",
    ],
  },

  [normalizarNombreCuratorial("Italo Calvino")]: {
    pregunta:
      "¿Puede la imaginación construir un mundo más exacto que la realidad visible?",

    introduccion:
      "Calvino convirtió la ligereza, la estructura, el juego y la combinatoria en formas de conocimiento. Sus ciudades, caballeros, lectores y universos no escapan de la realidad: la reorganizan para revelar sus mecanismos.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La pesadez de un mundo que parece haber perdido la capacidad de imaginarse de otro modo.",
      },
      {
        titulo: "La luz",
        texto:
          "La imaginación estructurada como forma de precisión y libertad.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Fábula, combinatoria, metaliteratura, geometría y ligereza narrativa.",
      },
    ],

    aprendizajes: [
      "Diseñar una regla generadora antes de escribir.",
      "Utilizar ligereza sin perder profundidad.",
      "Convertir estructura en placer narrativo.",
      "Hacer visible el mecanismo de la obra.",
      "Construir mundos mediante variaciones.",
    ],

    obras: [
      {
        titulo: "Las ciudades invisibles",
        razon:
          "Ciudades imaginarias como formas de memoria, deseo, muerte, lenguaje y percepción.",
      },
      {
        titulo: "Si una noche de invierno un viajero",
        razon:
          "El lector se convierte en protagonista de una novela formada por comienzos interrumpidos.",
      },
      {
        titulo: "El barón rampante",
        razon:
          "Una vida entera vivida sobre los árboles convierte distancia y rebeldía en perspectiva.",
      },
      {
        titulo: "El caballero inexistente",
        razon:
          "Identidad, forma y vacío reunidos en una armadura sin cuerpo.",
      },
      {
        titulo: "Cosmicómicas",
        razon:
          "La historia del universo convertida en fábulas íntimas y paradójicas.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Las reliquias pueden organizarse como un sistema de relatos que se responden y transforman mutuamente.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Cada estación funciona como una ciudad invisible gobernada por una idea y una regla propias.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "El mundo residual y el laberinto pueden leerse como máquinas narrativas que producen identidades y destinos.",
      },
    ],

    constelacion: [
      "Jorge Luis Borges",
      "Julio Cortázar",
      "Olga Tokarczuk",
      "Kōbō Abe",
      "Fernando Pessoa",
      "Tadao Ando",
    ],
  },

  [normalizarNombreCuratorial("Kōbō Abe")]: {
    pregunta:
      "¿Qué sucede con una identidad cuando el espacio que habita deja de obedecer las reglas conocidas?",

    introduccion:
      "Abe convirtió arena, cajas, rostros, mapas y ciudades en mecanismos de extrañamiento. Sus personajes pierden nombre, posición o salida y descubren que la identidad dependía mucho más del espacio y de la mirada ajena de lo que creían.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La pérdida de identidad dentro de sistemas urbanos y sociales que vuelven intercambiables a las personas.",
      },
      {
        titulo: "La luz",
        texto:
          "La extrañeza como oportunidad para observar de nuevo aquello que parecía normal.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Fábula existencial, absurdo, arquitectura opresiva y objetos convertidos en dispositivos filosóficos.",
      },
    ],

    aprendizajes: [
      "Hacer que el espacio transforme al personaje.",
      "Convertir un objeto en sistema narrativo.",
      "Explorar identidad mediante desaparición y sustitución.",
      "Construir absurdo con precisión material.",
      "Mantener una lógica interna incluso dentro de lo imposible.",
    ],

    obras: [
      {
        titulo: "La mujer de la arena",
        razon:
          "Un hombre queda atrapado en una fosa donde la arena reorganiza trabajo, deseo e identidad.",
      },
      {
        titulo: "El rostro ajeno",
        razon:
          "Una máscara modifica la relación entre cuerpo, personalidad y mirada social.",
      },
      {
        titulo: "El hombre caja",
        razon:
          "Un individuo abandona su identidad visible y observa el mundo desde una caja.",
      },
      {
        titulo: "El mapa calcinado",
        razon:
          "La búsqueda de un desaparecido termina desestabilizando al investigador y a la ciudad.",
      },
      {
        titulo: "La pared",
        razon:
          "El nombre, la pertenencia y la realidad física se vuelven intercambiables y absurdos.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Objetos y espacios absorben identidad y conservan presencias después de la desaparición.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Cada espacio subterráneo impone una regla que modifica quién puede ser cada personaje.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "El laberinto transforma cuerpo, tiempo e identidad mediante una ley material incomprensible.",
      },
    ],

    constelacion: [
      "Franz Kafka",
      "Italo Calvino",
      "Jorge Luis Borges",
      "Samuel Beckett",
      "Béla Tarr",
      "Tadao Ando",
    ],
  },


  [normalizarNombreCuratorial("Herta Müller")]: {
    pregunta:
      "¿Cómo puede una persona conservar su voz cuando el poder intenta ocupar incluso sus pensamientos?",

    introduccion:
      "Herta Müller escribe desde la vigilancia, el miedo, la persecución y el exilio. Sus novelas muestran cómo una dictadura penetra en los objetos cotidianos, en el cuerpo y en el lenguaje. Frente a esa invasión, la imagen poética se convierte en una forma de resistencia.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La vida sometida a una vigilancia que destruye confianza, intimidad y pertenencia.",
      },
      {
        titulo: "La luz",
        texto:
          "La posibilidad de proteger una conciencia mediante una lengua propia, precisa y difícil de domesticar.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Frases cortantes, imágenes inesperadas, objetos cotidianos y silencios cargados de amenaza.",
      },
    ],

    aprendizajes: [
      "Mostrar el poder mediante detalles cotidianos.",
      "Convertir un objeto en testigo político.",
      "Escribir el miedo sin depender de grandes escenas.",
      "Usar la imagen poética como forma de precisión.",
      "Tratar el exilio como experiencia lingüística e interior.",
    ],

    obras: [
      {
        titulo: "La bestia del corazón",
        razon:
          "Amistad, vigilancia y persecución dentro de una dictadura que invade cada gesto.",
      },
      {
        titulo: "Todo lo que tengo lo llevo conmigo",
        razon:
          "Hambre, deportación y supervivencia narradas desde la materialidad extrema del cuerpo.",
      },
      {
        titulo: "En tierras bajas",
        razon:
          "La infancia rural observada desde violencia, opresión y extrañeza.",
      },
      {
        titulo: "El hombre es un gran faisán en el mundo",
        razon:
          "La espera de emigrar convertida en degradación, miedo y pérdida de dignidad.",
      },
      {
        titulo: "Hoy hubiera preferido no encontrarme a mí misma",
        razon:
          "Un trayecto hacia un interrogatorio reconstruye una vida bajo amenaza.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La violencia continúa actuando en objetos, palabras y silencios mucho después del hecho central.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El sistema subterráneo invade gradualmente la percepción, el cuerpo y la capacidad de confiar.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Los habitantes conservan una conciencia fragmentaria dentro de un mundo que no les permite regresar.",
      },
    ],

    constelacion: [
      "Ágota Kristóf",
      "Primo Levi",
      "Paul Celan",
      "Franz Kafka",
      "W. G. Sebald",
      "Käthe Kollwitz",
    ],
  },

  [normalizarNombreCuratorial("Yoko Tawada")]: {
    pregunta:
      "¿Qué identidad aparece cuando una persona deja de pertenecer por completo a una sola lengua?",

    introduccion:
      "Yoko Tawada escribe desde el desplazamiento entre idiomas, cuerpos, países y especies. En su obra, traducir no significa trasladar intactamente un significado: significa descubrir que cada lengua fabrica una realidad diferente.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La imposibilidad de regresar a una identidad intacta después de habitar otra lengua.",
      },
      {
        titulo: "La luz",
        texto:
          "El extrañamiento como oportunidad para volver a mirar el cuerpo, las palabras y el mundo.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Metamorfosis, humor, bilingüismo, desplazamiento y asociaciones inesperadas.",
      },
    ],

    aprendizajes: [
      "Escribir desde el espacio entre dos lenguas.",
      "Convertir un error lingüístico en descubrimiento.",
      "Desestabilizar la frontera entre humano y animal.",
      "Utilizar la traducción como recurso creativo.",
      "Permitir que la identidad permanezca móvil.",
    ],

    obras: [
      {
        titulo: "Memorias de una osa polar",
        razon:
          "Tres generaciones de osas atraviesan escritura, circo, maternidad y migración.",
      },
      {
        titulo: "El emisario",
        razon:
          "Una sociedad envejecida y aislada observa cómo los cuerpos jóvenes cambian de forma.",
      },
      {
        titulo: "Donde Europa comienza",
        razon:
          "Viaje, lengua y geografía se vuelven espacios de transformación identitaria.",
      },
      {
        titulo: "Retrato de una lengua",
        razon:
          "La convivencia entre alemán y japonés observada desde extrañeza, juego y pensamiento.",
      },
      {
        titulo: "Paul Celan y el chino de los caracteres",
        razon:
          "La lectura poética se convierte en encuentro entre sistemas lingüísticos y visuales.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La transmisión entre países y lenguas modifica la memoria sin destruir necesariamente su núcleo.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Cada estación altera las palabras con las que los personajes comprenden su cuerpo y su deseo.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Mara nace entre nombres, memorias y procedencias distintas, y convierte esa distancia en identidad propia.",
      },
    ],

    constelacion: [
      "Franz Kafka",
      "Olga Tokarczuk",
      "Clarice Lispector",
      "Kōbō Abe",
      "Paul Celan",
      "Ursula K. Le Guin",
    ],
  },

  [normalizarNombreCuratorial("Mahmoud Darwish")]: {
    pregunta:
      "¿Cómo puede una persona conservar una patria cuando la patria se convierte en ausencia?",

    introduccion:
      "Darwish convirtió el exilio palestino en una poesía capaz de sostener territorio, amor, memoria y pérdida sin reducirlos a consigna. Su patria existe en aldeas, olivos, nombres, cuerpos y en la lengua que impide que la ausencia termine de borrar lo vivido.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La expulsión del territorio y la amenaza de que una vida colectiva sea borrada de la memoria.",
      },
      {
        titulo: "La luz",
        texto:
          "La lengua poética como lugar portátil donde una comunidad puede seguir existiendo.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Lirismo, símbolo, historia, amor y voz colectiva reunidos sin perder intimidad.",
      },
    ],

    aprendizajes: [
      "Escribir políticamente sin abandonar la complejidad poética.",
      "Convertir el territorio en experiencia corporal.",
      "Sostener identidad sin volverla rígida.",
      "Unir memoria individual y colectiva.",
      "Crear una voz capaz de hablar desde el exilio sin quedar definida solo por él.",
    ],

    obras: [
      {
        titulo: "Mural",
        razon:
          "La proximidad de la muerte abre una meditación sobre identidad, memoria y lenguaje.",
      },
      {
        titulo: "Estado de sitio",
        razon:
          "La vida cotidiana bajo asedio convertida en resistencia poética.",
      },
      {
        titulo: "¿Por qué has dejado solo al caballo?",
        razon:
          "Infancia, familia y pérdida territorial reconstruidas mediante una memoria íntima.",
      },
      {
        titulo: "Menos rosas",
        razon:
          "El exilio y la fragmentación expresados mediante poemas de gran concentración.",
      },
      {
        titulo: "En presencia de la ausencia",
        razon:
          "Autobiografía, despedida y conversación con la propia ausencia.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La memoria se desplaza entre territorios y sobrevive mediante nombres, reliquias y transmisión.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El hambre también expresa desposesión, frontera y derecho a ocupar un lugar en el mundo.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Quienes llegan habitan una patria imposible, compuesta únicamente por memoria, objetos y comunidad residual.",
      },
    ],

    constelacion: [
      "Federico García Lorca",
      "Nelly Sachs",
      "Paul Celan",
      "Theo Angelopoulos",
      "Rabindranath Tagore",
      "Wole Soyinka",
    ],
  },

  [normalizarNombreCuratorial("Nelly Sachs")]: {
    pregunta:
      "¿Cómo puede una lengua acompañar a los muertos sin pretender hablar en su lugar?",

    introduccion:
      "Nelly Sachs escribió desde el exilio y la destrucción de la comunidad judía europea. Su poesía reúne polvo, estrellas, humo, cuerpos y transformación. El poema se convierte en duelo y tránsito, nunca en explicación suficiente.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La desaparición de vidas y nombres dentro de una maquinaria de exterminio.",
      },
      {
        titulo: "La luz",
        texto:
          "La poesía como acompañamiento y espacio de metamorfosis para aquello que no puede repararse.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Imágenes cósmicas, bíblicas y corporales sostenidas por una voz de duelo.",
      },
    ],

    aprendizajes: [
      "Escribir para acompañar y no para apropiarse.",
      "Utilizar imágenes amplias sin perder el cuerpo concreto.",
      "Dar espacio a los muertos sin convertirlos en símbolo vacío.",
      "Trabajar el duelo mediante ritmo y transformación.",
      "Aceptar que la belleza también debe responder éticamente.",
    ],

    obras: [
      {
        titulo: "En las moradas de la muerte",
        razon:
          "El exterminio contemplado mediante imágenes de polvo, humo, cuerpos y ausencia.",
      },
      {
        titulo: "Eclipse de estrella",
        razon:
          "La oscuridad histórica se proyecta sobre una escala cósmica.",
      },
      {
        titulo: "Huida y metamorfosis",
        razon:
          "Exilio, transformación y supervivencia espiritual dentro de una lengua desplazada.",
      },
      {
        titulo: "Más allá del polvo",
        razon:
          "La memoria intenta atravesar aquello que ha sido reducido a resto.",
      },
      {
        titulo: "Eli",
        razon:
          "Un misterio dramático sobre un niño asesinado y la comunidad que conserva su ausencia.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La muerte de María exige una lengua de duelo que no la reduzca al hecho de su violencia.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Las voces excluidas forman un coro de pérdidas que necesita ser escuchado sin ser domesticado.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Los muertos incompletos viven en un territorio donde polvo, cuerpo y memoria todavía no se han separado.",
      },
    ],

    constelacion: [
      "Paul Celan",
      "Primo Levi",
      "Mahmoud Darwish",
      "Käthe Kollwitz",
      "Henryk Górecki",
      "Herta Müller",
    ],
  },

  [normalizarNombreCuratorial("Ursula K. Le Guin")]: {
    pregunta:
      "¿Qué mundos podríamos construir si dejáramos de considerar inevitable el mundo que conocemos?",

    introduccion:
      "Le Guin utilizó la ciencia ficción y la fantasía como laboratorios políticos, antropológicos y espirituales. Sus mundos no son escapatorias: permiten observar género, poder, propiedad, lenguaje y equilibrio desde una distancia transformadora.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La convicción social de que las jerarquías existentes son naturales e inevitables.",
      },
      {
        titulo: "La luz",
        texto:
          "La imaginación como capacidad política para pensar otras formas de convivencia.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Construcción de mundos, antropología, mito, claridad narrativa y ambigüedad moral.",
      },
    ],

    aprendizajes: [
      "Construir sociedades y no únicamente escenarios.",
      "Preguntar qué valores organizan cada mundo.",
      "Evitar que una utopía carezca de contradicciones.",
      "Tratar la fantasía como pensamiento serio.",
      "Utilizar el lenguaje para modificar la percepción de lo posible.",
    ],

    obras: [
      {
        titulo: "Los desposeídos",
        razon:
          "Dos sociedades opuestas permiten examinar propiedad, libertad, revolución y pertenencia.",
      },
      {
        titulo: "La mano izquierda de la oscuridad",
        razon:
          "Género, política y vínculo humano explorados dentro de una cultura radicalmente distinta.",
      },
      {
        titulo: "Un mago de Terramar",
        razon:
          "El poder exige conocer y aceptar la propia sombra.",
      },
      {
        titulo: "El nombre del mundo es Bosque",
        razon:
          "Colonización, violencia y relación con la naturaleza enfrentan dos formas de habitar.",
      },
      {
        titulo: "El eterno regreso a casa",
        razon:
          "Una cultura futura reconstruida mediante relatos, poemas, mapas y documentos.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Las reliquias crean una cultura de memoria cuya ley moral se construye mediante transmisión.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Cada estación funciona como una sociedad organizada alrededor de una necesidad y una distribución del poder.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Bielka posee una antropología propia: tiempo, cuerpo, animales, muerte y comunidad obedecen leyes diferentes.",
      },
    ],

    constelacion: [
      "Octavia E. Butler",
      "Italo Calvino",
      "Olga Tokarczuk",
      "Yoko Tawada",
      "Rabindranath Tagore",
      "Toni Morrison",
    ],
  },

  [normalizarNombreCuratorial("Juan Rulfo")]: {
    pregunta:
      "¿Cuánto tiempo puede seguir hablando una tierra después de que sus habitantes hayan muerto?",

    introduccion:
      "Rulfo convirtió pueblos, caminos, polvo, voces y silencios en una geografía donde vivos y muertos comparten la misma memoria. Su obra demuestra que una narración breve puede contener siglos de abandono, violencia y deseo.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La tierra abandonada por quienes prometieron justicia, lluvia o regreso.",
      },
      {
        titulo: "La luz",
        texto:
          "La capacidad de escuchar las voces que permanecen adheridas al paisaje.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Oralidad, silencio, fragmentación temporal y paisaje convertido en conciencia.",
      },
    ],

    aprendizajes: [
      "Escuchar cómo habla un territorio.",
      "Construir una comunidad mediante voces.",
      "Usar el silencio como información.",
      "Alterar el tiempo sin perder claridad emocional.",
      "Lograr intensidad mediante una obra breve.",
    ],

    obras: [
      {
        titulo: "Pedro Páramo",
        razon:
          "Un pueblo de muertos reconstruye deseo, violencia, poder y memoria mediante voces fragmentarias.",
      },
      {
        titulo: "El llano en llamas",
        razon:
          "Relatos donde pobreza, tierra y violencia revelan vidas privadas de futuro.",
      },
      {
        titulo: "Diles que no me maten",
        razon:
          "La venganza histórica regresa cuando el tiempo parecía haberla agotado.",
      },
      {
        titulo: "No oyes ladrar los perros",
        razon:
          "Un padre carga a su hijo mientras amor, resentimiento y agotamiento se confunden.",
      },
      {
        titulo: "Luvina",
        razon:
          "Un pueblo desolado se convierte en experiencia física de abandono y viento.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "El árbol y la tierra conservan voces que el tiempo no consigue hacer desaparecer.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Los espacios hablan mediante quienes los atravesaron y dejaron hambre, culpa o deseo.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Bielka es un territorio habitado por muertos que siguen organizando comunidad, memoria y relato.",
      },
    ],

    constelacion: [
      "Gabriel García Márquez",
      "Toni Morrison",
      "W. G. Sebald",
      "Mahmoud Darwish",
      "Theo Angelopoulos",
      "Kenzaburō Ōe",
    ],
  },

  [normalizarNombreCuratorial("Wole Soyinka")]: {
    pregunta:
      "¿Qué responsabilidad tiene el artista cuando el poder convierte el silencio en obediencia?",

    introduccion:
      "Soyinka ha unido teatro, poesía, mito yoruba y acción política. Su obra examina tiranía, sacrificio, tradición y libertad sin simplificar la relación entre cultura africana y modernidad.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La violencia del poder colonial y poscolonial sobre cuerpos, lenguas y comunidades.",
      },
      {
        titulo: "La luz",
        texto:
          "La palabra artística como resistencia pública y memoria colectiva.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Teatro ritual, sátira política, mito, poesía y conflicto trágico.",
      },
    ],

    aprendizajes: [
      "Relacionar mito y conflicto contemporáneo.",
      "Usar sátira contra el poder.",
      "Construir tragedia desde valores incompatibles.",
      "No separar creación y responsabilidad pública.",
      "Trabajar la tradición como materia viva.",
    ],

    obras: [
      {
        titulo: "La muerte y el caballero del rey",
        razon:
          "Deber ritual, colonialismo y tragedia surgen del choque entre mundos morales.",
      },
      {
        titulo: "Los intérpretes",
        razon:
          "Una generación intelectual observa las contradicciones de una sociedad poscolonial.",
      },
      {
        titulo: "El hombre ha muerto",
        razon:
          "Prisión, resistencia y conciencia política narradas desde la experiencia personal.",
      },
      {
        titulo: "La carretera",
        razon:
          "Conductores, muerte y absurdo construyen un espacio teatral de gran densidad simbólica.",
      },
      {
        titulo: "Crónicas desde el país de la gente más feliz de la Tierra",
        razon:
          "La corrupción contemporánea examinada mediante sátira, violencia y ambición.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "El silencio ante la violencia constituye una decisión política y moral.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Las instituciones subterráneas convierten rito, poder y necesidad en jerarquía.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La llamada y el laberinto pueden leerse como rito comunitario enfrentado a una ley desconocida.",
      },
    ],

    constelacion: [
      "Ngũgĩ wa Thiong’o",
      "Aimé Césaire",
      "Toni Morrison",
      "Mahmoud Darwish",
      "Francisco de Goya",
      "Akira Kurosawa",
    ],
  },

  [normalizarNombreCuratorial("Ngũgĩ wa Thiong’o")]: {
    pregunta:
      "¿Puede una comunidad recuperar su libertad sin recuperar también el derecho a nombrar el mundo?",

    introduccion:
      "Ngũgĩ ha mostrado que la colonización no termina con la retirada política: continúa en la lengua, la escuela, el teatro y la imaginación. Elegir escribir en gikuyu fue para él una intervención estética y política.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La sustitución de una lengua y una memoria por el sistema cultural del colonizador.",
      },
      {
        titulo: "La luz",
        texto:
          "La recuperación de la lengua propia como reconstrucción de comunidad y pensamiento.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Novela, ensayo, oralidad, teatro comunitario y narración política.",
      },
    ],

    aprendizajes: [
      "Preguntar quién puede acceder a la lengua de una obra.",
      "Comprender el idioma como estructura de poder.",
      "Vincular creación y comunidad.",
      "Recuperar formas orales sin convertirlas en folclore.",
      "Examinar las instituciones que producen imaginación.",
    ],

    obras: [
      {
        titulo: "Descolonizar la mente",
        razon:
          "La lengua se analiza como territorio central de dominación y emancipación.",
      },
      {
        titulo: "Un grano de trigo",
        razon:
          "Independencia, traición y memoria colectiva alrededor del nacimiento de una nación.",
      },
      {
        titulo: "Pétalos de sangre",
        razon:
          "Las promesas poscoloniales se enfrentan a explotación, desigualdad y corrupción.",
      },
      {
        titulo: "El diablo en la cruz",
        razon:
          "Una novela escrita en prisión que denuncia la alianza entre poder local y capitalismo.",
      },
      {
        titulo: "El brujo del cuervo",
        razon:
          "Dictadura, magia y sátira construyen una gran alegoría política africana.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Transmitir memoria implica decidir en qué lengua, desde qué territorio y para qué comunidad se conserva.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Las jerarquías distribuyen también palabra, autoridad y derecho a interpretar la experiencia.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Una comunidad formada por múltiples procedencias necesita construir una lengua común sin borrar las anteriores.",
      },
    ],

    constelacion: [
      "Wole Soyinka",
      "Aimé Césaire",
      "Toni Morrison",
      "Ursula K. Le Guin",
      "Mahmoud Darwish",
      "Rabindranath Tagore",
    ],
  },

  [normalizarNombreCuratorial("Rabindranath Tagore")]: {
    pregunta:
      "¿Cómo puede una vida pertenecer al mundo sin perder la intimidad de sus raíces?",

    introduccion:
      "Tagore reunió poesía, música, educación, novela y pensamiento político. Defendió una humanidad abierta al intercambio cultural, pero crítica con el nacionalismo y con cualquier identidad convertida en frontera rígida.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La separación entre culturas, naturaleza, educación y experiencia espiritual.",
      },
      {
        titulo: "La luz",
        texto:
          "Una idea de humanidad capaz de pertenecer sin excluir.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Poesía lírica, canción, relato, pedagogía y reflexión humanista.",
      },
    ],

    aprendizajes: [
      "Relacionar creación, educación y forma de vida.",
      "Construir una voz universal sin borrar lo local.",
      "Evitar convertir identidad en frontera.",
      "Escuchar la naturaleza como interlocutora.",
      "Entender la belleza como experiencia ética.",
    ],

    obras: [
      {
        titulo: "Gitanjali",
        razon:
          "Poemas de entrega, naturaleza y experiencia espiritual de gran sencillez lírica.",
      },
      {
        titulo: "La casa y el mundo",
        razon:
          "Amor, nacionalismo y emancipación femenina dentro de una sociedad en transformación.",
      },
      {
        titulo: "Gora",
        razon:
          "Religión, nación e identidad se desestabilizan mediante una revelación personal.",
      },
      {
        titulo: "El jardinero",
        razon:
          "El amor y la naturaleza se expresan mediante una poesía íntima y musical.",
      },
      {
        titulo: "La religión del hombre",
        razon:
          "Una visión humanista de espiritualidad, creatividad y relación entre culturas.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La memoria cruza territorios sin perder su raíz afectiva ni su vocación universal.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El hambre espiritual y material cuestiona qué significa pertenecer a una comunidad humana.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Una sociedad de procedencias distintas debe aprender una convivencia que no exija renunciar a toda memoria.",
      },
    ],

    constelacion: [
      "Mahmoud Darwish",
      "Ursula K. Le Guin",
      "Mahatma Gandhi",
      "Ngũgĩ wa Thiong’o",
      "Wole Soyinka",
      "Kenzaburō Ōe",
    ],
  },

  [normalizarNombreCuratorial("Kenzaburō Ōe")]: {
    pregunta:
      "¿Cómo puede una persona asumir una responsabilidad que altera para siempre la vida que había imaginado?",

    introduccion:
      "Ōe escribió sobre culpa histórica, discapacidad, familia, violencia y responsabilidad. Sus personajes deben abandonar la fantasía de una vida intacta y aprender a convivir con aquello que no eligieron.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La ruptura entre la vida imaginada y una realidad que exige responsabilidad.",
      },
      {
        titulo: "La luz",
        texto:
          "La aceptación activa del vínculo con aquello que inicialmente produce miedo o rechazo.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Narración moral, grotesco, introspección, historia japonesa y experiencia familiar.",
      },
    ],

    aprendizajes: [
      "Construir personajes moralmente incómodos.",
      "Narrar la responsabilidad como proceso.",
      "Relacionar historia colectiva e intimidad.",
      "No idealizar el cuidado.",
      "Permitir que una crisis transforme realmente al personaje.",
    ],

    obras: [
      {
        titulo: "Una cuestión personal",
        razon:
          "Un padre enfrenta el nacimiento de un hijo con discapacidad y su propio deseo de huir.",
      },
      {
        titulo: "El grito silencioso",
        razon:
          "Familia, violencia y memoria histórica regresan a un pueblo marcado por antiguas revueltas.",
      },
      {
        titulo: "Arrancad las semillas, fusilad a los niños",
        razon:
          "Un grupo de jóvenes abandonados durante una epidemia construye una comunidad efímera.",
      },
      {
        titulo: "Dinos cómo sobrevivir a nuestra locura",
        razon:
          "Padres, hijos y fragilidad psicológica observados desde vínculos extremos.",
      },
      {
        titulo: "Muerte por agua",
        razon:
          "Un escritor investiga la muerte de su padre y descubre los límites de la memoria familiar.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La memoria obliga a asumir una responsabilidad que no puede delegarse en instituciones o símbolos.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Los personajes deben decidir si cuidar al otro cuando ese cuidado altera su propia supervivencia.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Iván, Mara y quienes acompañan a los niños se definen por responsabilidades que nunca eligieron plenamente.",
      },
    ],

    constelacion: [
      "Juan Rulfo",
      "Primo Levi",
      "Kōbō Abe",
      "Toni Morrison",
      "Käthe Kollwitz",
      "Rabindranath Tagore",
    ],
  },

  [normalizarNombreCuratorial("Federico García Lorca")]: {
    pregunta:
      "¿Qué sucede cuando el deseo de vivir choca contra una sociedad construida para silenciarlo?",

    introduccion:
      "Lorca hizo del deseo, la luna, la sangre, el caballo, la tierra y la muerte un lenguaje propio. Su poesía y su teatro escuchan a quienes viven encerrados por familia, norma, clase, género o miedo. La belleza nunca elimina la amenaza: canta junto a ella.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "El deseo condenado a ocultarse dentro de una comunidad que convierte la diferencia en peligro.",
      },
      {
        titulo: "La luz",
        texto:
          "La capacidad de transformar dolor, pueblo, música y símbolo en una voz universal.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Poesía, teatro, canción popular, imágenes telúricas y símbolos de gran potencia escénica.",
      },
    ],

    aprendizajes: [
      "Construir un universo mediante símbolos recurrentes.",
      "Unir tradición popular y experimentación.",
      "Dar voz a quienes una comunidad intenta silenciar.",
      "Escribir deseo y muerte sin separarlos.",
      "Crear imágenes que funcionen también como acciones teatrales.",
    ],

    obras: [
      {
        titulo: "Romancero gitano",
        razon:
          "Mito, persecución, deseo y tradición popular reunidos en una imaginería inolvidable.",
      },
      {
        titulo: "Poeta en Nueva York",
        razon:
          "La ciudad moderna aparece como violencia económica, racial y espiritual.",
      },
      {
        titulo: "La casa de Bernarda Alba",
        razon:
          "Autoridad, deseo femenino y encierro convierten una casa en sistema opresivo.",
      },
      {
        titulo: "Bodas de sangre",
        razon:
          "Deseo, honor, tierra y muerte avanzan hacia una tragedia ritual.",
      },
      {
        titulo: "Yerma",
        razon:
          "La maternidad exigida por la sociedad se transforma en vacío, presión y destrucción.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La muerte bajo el Árbol Blanco une tierra, violencia, memoria y una belleza que no consigue proteger a la víctima.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Deseo, cuerpo, exclusión y voces no amadas construyen una tragedia social y poética.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Los niños, los animales, la sangre y el laberinto participan de una imaginería ritual cercana a su teatro.",
      },
    ],

    constelacion: [
      "Leonard Cohen",
      "Salvador Dalí",
      "Luis Buñuel",
      "Mahmoud Darwish",
      "Alejandra Pizarnik",
      "Francisco de Goya",
    ],
  },

  [normalizarNombreCuratorial("Moby")]: {
    pregunta:
      "¿Puede la música electrónica conservar una sensación de fragilidad humana dentro de un mundo saturado de ruido?",

    introduccion:
      "Moby ha construido una obra donde electrónica, gospel, ambient, punk y melancolía conviven. Sus canciones suelen unir una producción expansiva con voces vulnerables, creando espacios de movimiento, soledad y contemplación.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La soledad y la desconexión que persisten incluso dentro de una cultura permanentemente estimulada.",
      },
      {
        titulo: "La luz",
        texto:
          "La capacidad de encontrar calma, compasión y belleza dentro de tecnologías sonoras contemporáneas.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Electrónica, samples de gospel y blues, ambient, repetición rítmica y melodías de gran claridad.",
      },
    ],

    aprendizajes: [
      "Unir tecnología y emoción sin que una anule a la otra.",
      "Construir atmósfera mediante capas sencillas.",
      "Utilizar repetición como refugio y movimiento.",
      "Trabajar con voces encontradas respetando su carga humana.",
      "Permitir que una canción popular conserve profundidad contemplativa.",
    ],

    obras: [
      {
        titulo: "Play",
        razon:
          "Samples históricos, electrónica y melancolía construyen un lenguaje accesible y profundamente reconocible.",
      },
      {
        titulo: "18",
        razon:
          "La amplitud electrónica se combina con canciones sobre pérdida, distancia y esperanza.",
      },
      {
        titulo: "Everything Is Wrong",
        razon:
          "Punk, rave y ambient expresan energía, conflicto y desencanto.",
      },
      {
        titulo: "Wait for Me",
        razon:
          "Una obra más íntima donde fragilidad, lentitud y atmósfera ocupan el centro.",
      },
      {
        titulo: "Long Ambients",
        razon:
          "La música abandona la estructura convencional para convertirse en espacio de calma y duración.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La electrónica ambiental puede acompañar memoria, árboles, fuego y ausencia sin ilustrarlos literalmente.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Ritmo, repetición y capas sonoras podrían diferenciar cada nivel del descenso.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Los paisajes residuales y el tiempo suspendido encuentran una traducción natural en su música ambient.",
      },
    ],

    constelacion: [
      "Arvo Pärt",
      "Claude Debussy",
      "Leonard Cohen",
      "Bill Viola",
      "James Turrell",
      "Tarkovski",
    ],
  },


  [normalizarNombreCuratorial("Aimé Césaire")]: {
    pregunta:
      "¿Cómo recuperar una voz después de que el poder haya intentado convertirla en una copia de otra?",

    introduccion:
      "Césaire convirtió la poesía en una fuerza de descolonización. Su lenguaje reúne rabia, memoria, surrealismo, historia y dignidad negra. No busca regresar a una identidad intacta: construye una conciencia capaz de atravesar la violencia colonial sin aceptar sus categorías.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La colonización que intenta destruir lengua, historia, cuerpo y capacidad de imaginarse.",
      },
      {
        titulo: "La luz",
        texto:
          "La palabra poética como recuperación de dignidad, memoria y soberanía interior.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Surrealismo, oralidad, imagen volcánica, discurso político y ritmo de gran intensidad.",
      },
    ],

    aprendizajes: [
      "Escribir contra una lengua de dominación desde dentro de la propia lengua.",
      "Convertir rabia política en forma poética.",
      "Recuperar historia sin idealizar el pasado.",
      "Unir identidad y universalidad sin borrar la diferencia.",
      "Utilizar la imagen como fuerza de emancipación.",
    ],

    obras: [
      {
        titulo: "Cuaderno de un retorno al país natal",
        razon:
          "El regreso a Martinica se convierte en examen de colonialismo, identidad y renacimiento poético.",
      },
      {
        titulo: "Discurso sobre el colonialismo",
        razon:
          "La barbarie colonial se revela como parte central de la modernidad europea.",
      },
      {
        titulo: "Las armas milagrosas",
        razon:
          "La poesía surrealista se transforma en instrumento de resistencia y reconstrucción.",
      },
      {
        titulo: "Una temporada en el Congo",
        razon:
          "La independencia congoleña y la figura de Lumumba observadas como tragedia política.",
      },
      {
        titulo: "La tragedia del rey Christophe",
        razon:
          "Poder, emancipación y fracaso poscolonial dentro de una gran arquitectura dramática.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La memoria de la violencia exige una voz que no reproduzca el lenguaje de quienes la impusieron.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "La jerarquía distribuye también dignidad, lengua y derecho a nombrar el mundo.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Los habitantes deben reconstruir identidad y comunidad después de haber sido arrancados de sus territorios.",
      },
    ],

    constelacion: [
      "Ngũgĩ wa Thiong’o",
      "Wole Soyinka",
      "Mahmoud Darwish",
      "Toni Morrison",
      "Frantz Fanon",
      "Wifredo Lam",
    ],
  },

  [normalizarNombreCuratorial("Giorgio de Chirico")]: {
    pregunta:
      "¿Por qué un lugar conocido puede volverse inquietante cuando parece esperar algo que nunca sucede?",

    introduccion:
      "De Chirico construyó plazas vacías, arcadas, sombras largas, estatuas y trenes lejanos. Sus ciudades parecen ordenadas, pero toda proporción contiene una amenaza. La pintura metafísica no representa un sueño: revela lo extraño que ya existía dentro de la realidad.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La sensación de que el mundo visible contiene una lógica que no llega a revelarse.",
      },
      {
        titulo: "La luz",
        texto:
          "La capacidad de descubrir misterio dentro de arquitectura, objetos y espacios cotidianos.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Perspectivas imposibles, plazas vacías, maniquíes, sombras y objetos desplazados.",
      },
    ],

    aprendizajes: [
      "Crear inquietud sin recurrir a violencia explícita.",
      "Utilizar arquitectura y sombra como personajes.",
      "Desplazar un objeto cotidiano para alterar su significado.",
      "Construir atmósfera mediante vacío.",
      "Permitir que la perspectiva sea emocional antes que realista.",
    ],

    obras: [
      {
        titulo: "El misterio y la melancolía de una calle",
        razon:
          "Una plaza, una sombra y una niña construyen una amenaza sin acontecimiento visible.",
      },
      {
        titulo: "La nostalgia del infinito",
        razon:
          "Una torre monumental transforma distancia, escala y memoria en enigma.",
      },
      {
        titulo: "Las musas inquietantes",
        razon:
          "Maniquíes y arquitectura industrial producen una presencia simultáneamente teatral y vacía.",
      },
      {
        titulo: "El enigma de una tarde de otoño",
        razon:
          "La ciudad ordinaria se abre hacia una dimensión desconocida y suspendida.",
      },
      {
        titulo: "Héctor y Andrómaca",
        razon:
          "La tragedia clásica aparece mediante cuerpos sin rostro y una intimidad imposible.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "El Árbol Blanco y los espacios vacíos pueden adquirir una tensión metafísica anterior a toda explicación.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Las estaciones subterráneas funcionan como plazas cerradas donde cada objeto parece anunciar una ley oculta.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "El arco, la puerta de piedra y el laberinto pertenecen a una geografía donde el silencio parece esperar.",
      },
    ],

    constelacion: [
      "Odilon Redon",
      "Salvador Dalí",
      "René Magritte",
      "Edward Hopper",
      "David Lynch",
      "Tadao Ando",
    ],
  },

  [normalizarNombreCuratorial("Caspar David Friedrich")]: {
    pregunta:
      "¿Qué descubre una persona cuando se vuelve pequeña frente a aquello que no puede abarcar?",

    introduccion:
      "Friedrich situó figuras humanas ante montañas, mares, niebla, ruinas y horizontes. Sus paisajes no son decoraciones: convierten la naturaleza en experiencia interior. Mirar el mundo significa también enfrentarse a la propia finitud.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La conciencia de la pequeñez humana frente al tiempo, la naturaleza y la muerte.",
      },
      {
        titulo: "La luz",
        texto:
          "La contemplación como forma de vínculo con aquello que supera al individuo.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Paisaje, figura de espaldas, niebla, ruina, horizonte y composición simbólica.",
      },
    ],

    aprendizajes: [
      "Convertir el paisaje en estado interior.",
      "Utilizar escala para producir emoción.",
      "Permitir que una figura contemple en lugar de actuar.",
      "Trabajar con niebla, distancia y horizonte.",
      "Relacionar belleza y mortalidad sin explicarlas.",
    ],

    obras: [
      {
        titulo: "Caminante sobre el mar de nubes",
        razon:
          "Una figura contempla un paisaje inmenso que no puede dominar aunque lo observe desde arriba.",
      },
      {
        titulo: "Monje a la orilla del mar",
        razon:
          "La pequeñez humana queda expuesta ante un horizonte casi vacío.",
      },
      {
        titulo: "Abadía en el robledal",
        razon:
          "Ruina, invierno y procesión convierten el paisaje en meditación funeraria.",
      },
      {
        titulo: "El mar de hielo",
        razon:
          "La naturaleza destruye cualquier ilusión de control o permanencia.",
      },
      {
        titulo: "Acantilados blancos en Rügen",
        razon:
          "Belleza, vértigo y fragilidad se reúnen en una escena de contemplación.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "El Árbol Blanco funciona como paisaje espiritual donde memoria y mortalidad se vuelven visibles.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El descenso cambia la escala humana y obliga a contemplar fuerzas que superan al individuo.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La geografía residual, los arcos y el laberinto convierten el paisaje en condición ontológica.",
      },
    ],

    constelacion: [
      "Rainer Maria Rilke",
      "Andrei Tarkovski",
      "Theo Angelopoulos",
      "Edward Hopper",
      "Peter Zumthor",
      "Gustav Mahler",
    ],
  },

  [normalizarNombreCuratorial("Edward Hopper")]: {
    pregunta:
      "¿Cuánta soledad puede contener una habitación sin que nadie diga una sola palabra?",

    introduccion:
      "Hopper pintó bares, hoteles, gasolineras, ventanas y habitaciones donde las personas parecen próximas y, al mismo tiempo, inaccesibles. La luz ilumina con precisión, pero no consigue unir a quienes comparten el espacio.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La distancia emocional que persiste dentro de ciudades, parejas y espacios compartidos.",
      },
      {
        titulo: "La luz",
        texto:
          "La capacidad de una escena cotidiana para revelar una vida interior completa.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Luz arquitectónica, encuadre cinematográfico, quietud, ventanas y figuras aisladas.",
      },
    ],

    aprendizajes: [
      "Narrar una historia mediante una sola escena.",
      "Usar la luz como distancia emocional.",
      "Permitir que un personaje permanezca inaccesible.",
      "Construir tensión sin acción visible.",
      "Convertir arquitectura cotidiana en estado psicológico.",
    ],

    obras: [
      {
        titulo: "Nighthawks",
        razon:
          "Un bar iluminado contiene proximidad física y aislamiento absoluto.",
      },
      {
        titulo: "Morning Sun",
        razon:
          "Una mujer ante una ventana queda suspendida entre luz, espera y vida interior.",
      },
      {
        titulo: "Automat",
        razon:
          "La soledad urbana se concentra en una mesa, un reflejo y una mirada baja.",
      },
      {
        titulo: "Gas",
        razon:
          "Una gasolinera aislada transforma el borde de la carretera en escenario existencial.",
      },
      {
        titulo: "Room in New York",
        razon:
          "Una pareja comparte habitación sin compartir verdaderamente su atención.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Las habitaciones y ventanas posteriores a la pérdida pueden expresar aquello que los personajes no consiguen decir.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Cada estación contiene individuos próximos cuyos deseos permanecen separados.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La comunidad comparte un mundo, pero cada habitante conserva una soledad imposible de transferir.",
      },
    ],

    constelacion: [
      "Giorgio de Chirico",
      "Ingmar Bergman",
      "Víctor Erice",
      "Francesca Woodman",
      "Samuel Beckett",
      "David Lynch",
    ],
  },

  [normalizarNombreCuratorial("Odilon Redon")]: {
    pregunta:
      "¿Qué formas nacen cuando la imaginación deja de obedecer únicamente a lo visible?",

    introduccion:
      "Redon creó ojos flotantes, criaturas, flores, cabezas y mundos interiores donde sueño y materia permanecen unidos. Su obra atraviesa la oscuridad del carbón y llega a una explosión de color sin abandonar nunca el misterio.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La insuficiencia del mundo visible para contener la experiencia interior.",
      },
      {
        titulo: "La luz",
        texto:
          "La imaginación como territorio donde lo monstruoso y lo luminoso pueden convivir.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Carbón, litografía, pastel, flores, criaturas y símbolos oníricos.",
      },
    ],

    aprendizajes: [
      "Crear seres que no necesiten explicación.",
      "Trabajar oscuridad y color como etapas de una misma búsqueda.",
      "Permitir que una imagen parezca llegada de otro mundo.",
      "Utilizar flores y ojos como presencias y no como decoración.",
      "Confiar en la lógica de la imaginación.",
    ],

    obras: [
      {
        titulo: "El ojo, como un globo extraño, se dirige hacia el infinito",
        razon:
          "La visión se separa del cuerpo y se convierte en viaje, deseo y amenaza.",
      },
      {
        titulo: "La araña sonriente",
        razon:
          "Una criatura inquietante reúne humor, miedo y extrañeza.",
      },
      {
        titulo: "El cíclope",
        razon:
          "Una figura mítica contempla el mundo desde una ternura ambigua.",
      },
      {
        titulo: "El Buda",
        razon:
          "Color, naturaleza y espiritualidad se organizan en una imagen contemplativa.",
      },
      {
        titulo: "Jarrón con flores",
        razon:
          "El color floral adquiere una intensidad casi visionaria.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Las reliquias y el árbol pueden abrir una dimensión visionaria sin abandonar su materia.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Cada estación puede producir criaturas y símbolos nacidos de una lógica interior.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "El minotauro blanco y los animales del mundo participan de una imaginación entre sueño y presencia.",
      },
    ],

    constelacion: [
      "Giorgio de Chirico",
      "Leonora Carrington",
      "Remedios Varo",
      "Alejandra Pizarnik",
      "Salvador Dalí",
      "Bill Viola",
    ],
  },

  [normalizarNombreCuratorial("Leonora Carrington")]: {
    pregunta:
      "¿Qué ocurre cuando una mujer deja de ser personaje dentro del sueño de otros y construye su propia mitología?",

    introduccion:
      "Carrington creó mundos de criaturas híbridas, alquimia, humor, ritual y metamorfosis. Su obra rechaza la identidad fija y transforma lo doméstico, lo animal y lo mágico en espacios de autonomía.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La imposición de papeles que reducen a la mujer a musa, objeto o personaje secundario.",
      },
      {
        titulo: "La luz",
        texto:
          "La imaginación como territorio de soberanía, transformación y conocimiento.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Pintura, relato, alquimia, animales, humor y escenas rituales.",
      },
    ],

    aprendizajes: [
      "Construir una mitología propia.",
      "Utilizar metamorfosis para cuestionar la identidad.",
      "Unir humor y misterio.",
      "Dar autonomía completa a las criaturas.",
      "Convertir la casa y la cocina en laboratorios simbólicos.",
    ],

    obras: [
      {
        titulo: "Autorretrato en el albergue del caballo del alba",
        razon:
          "La identidad se relaciona con animales, movimiento y liberación.",
      },
      {
        titulo: "La giganta",
        razon:
          "Una figura femenina monumental contiene paisaje, aves y fuerzas protectoras.",
      },
      {
        titulo: "El mundo mágico de los mayas",
        razon:
          "Ritual, comunidad y cosmología se reúnen en una escena compleja.",
      },
      {
        titulo: "La trompetilla acústica",
        razon:
          "Vejez, humor, institución y transformación construyen una novela de emancipación.",
      },
      {
        titulo: "La casa del miedo",
        razon:
          "Relatos donde identidad, sueño y espacio doméstico pierden sus fronteras.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Las reliquias pueden convertirse en objetos alquímicos que conservan memoria y transformación.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Las estaciones permiten que cuerpo, animalidad, deseo y ritual construyan nuevas identidades.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Mara, el minotauro y los animales habitan una mitología donde ninguna forma permanece completamente fija.",
      },
    ],

    constelacion: [
      "Remedios Varo",
      "Odilon Redon",
      "Salvador Dalí",
      "Alejandra Pizarnik",
      "Frida Kahlo",
      "Clarice Lispector",
    ],
  },

  [normalizarNombreCuratorial("Remedios Varo")]: {
    pregunta:
      "¿Puede una vida convertirse en un viaje de conocimiento sin separar ciencia, sueño y misterio?",

    introduccion:
      "Varo pintó talleres, máquinas, torres, viajes y figuras que parecen realizar experimentos espirituales. Sus mundos poseen reglas propias donde técnica, alquimia y búsqueda interior forman una misma actividad.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La vida encerrada dentro de sistemas que limitan imaginación, conocimiento y autonomía.",
      },
      {
        titulo: "La luz",
        texto:
          "La creación como viaje capaz de unir inteligencia, intuición y transformación.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Arquitecturas fantásticas, máquinas, figuras alargadas, alquimia y narración visual.",
      },
    ],

    aprendizajes: [
      "Construir un mundo con reglas visuales coherentes.",
      "Unir ciencia y misterio.",
      "Convertir el proceso creativo en argumento.",
      "Utilizar arquitectura como mecanismo narrativo.",
      "Representar conocimiento mediante acciones y objetos.",
    ],

    obras: [
      {
        titulo: "La creación de las aves",
        razon:
          "Una criatura artista utiliza ciencia, música y luz para dar vida a sus dibujos.",
      },
      {
        titulo: "Papilla estelar",
        razon:
          "Una figura alimenta a la luna dentro de una torre, uniendo cuidado, encierro y cosmos.",
      },
      {
        titulo: "Bordando el manto terrestre",
        razon:
          "Mujeres encerradas fabrican el mundo mientras una de ellas prepara su fuga.",
      },
      {
        titulo: "Exploración de las fuentes del río Orinoco",
        razon:
          "Un viaje científico se convierte en búsqueda interior y revelación.",
      },
      {
        titulo: "Mujer saliendo del psicoanalista",
        razon:
          "Una figura abandona cargas simbólicas después de atravesar un proceso de transformación.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Las reliquias pueden formar una máquina simbólica capaz de reconstruir memoria.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Cada estación funciona como laboratorio donde una necesidad produce formas, objetos y reglas.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "El laberinto es una máquina ontológica que transforma a quienes intentan comprenderla.",
      },
    ],

    constelacion: [
      "Leonora Carrington",
      "Italo Calvino",
      "Jorge Luis Borges",
      "Odilon Redon",
      "Tadao Ando",
      "Ursula K. Le Guin",
    ],
  },

  [normalizarNombreCuratorial("Christian Boltanski")]: {
    pregunta:
      "¿Cómo puede una obra recordar a alguien cuando ya no conserva casi nada de su vida?",

    introduccion:
      "Boltanski trabajó con fotografías anónimas, ropa usada, luces, nombres y archivos. Sus instalaciones no reconstruyen biografías completas: muestran la fragilidad de toda memoria y la necesidad de recordar incluso cuando apenas quedan rastros.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La desaparición de vidas que terminan reducidas a imágenes, números o prendas.",
      },
      {
        titulo: "La luz",
        texto:
          "El gesto de preservar una presencia aunque el archivo permanezca incompleto.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Fotografías, ropa, bombillas, archivos, sombras y acumulaciones.",
      },
    ],

    aprendizajes: [
      "Trabajar con ausencia sin fingir reconstrucción total.",
      "Utilizar objetos anónimos como presencias.",
      "Crear memoria mediante repetición.",
      "Aceptar la fragilidad del archivo.",
      "Construir una instalación como lugar de duelo.",
    ],

    obras: [
      {
        titulo: "Monument",
        razon:
          "Fotografías e iluminación construyen altares dedicados a identidades anónimas.",
      },
      {
        titulo: "Personnes",
        razon:
          "Montañas de ropa y una grúa mecánica convierten el cuerpo ausente en multitud.",
      },
      {
        titulo: "Réserve",
        razon:
          "Prendas usadas ocupan el espacio como restos de vidas sin nombre.",
      },
      {
        titulo: "Les Archives de C. B.",
        razon:
          "El archivo personal se presenta como intento imposible de preservar una vida completa.",
      },
      {
        titulo: "Animitas",
        razon:
          "Campanas pequeñas en el paisaje producen un memorial sonoro movido por el viento.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Las siete reliquias forman un archivo incompleto donde la persona permanece mediante objetos.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Ropa, voces y restos pueden construir la memoria material de quienes fueron excluidos.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La manta, los zapatos y la pelota conservan una identidad que ya no puede aparecer físicamente.",
      },
    ],

    constelacion: [
      "Chiharu Shiota",
      "Doris Salcedo",
      "W. G. Sebald",
      "Primo Levi",
      "Käthe Kollwitz",
      "Francesca Woodman",
    ],
  },

  [normalizarNombreCuratorial("Doris Salcedo")]: {
    pregunta:
      "¿Cómo puede una obra dar lugar al duelo de quienes fueron expulsados incluso de la memoria pública?",

    introduccion:
      "Salcedo trabaja con muebles, ropa, hormigón, tierra, grietas y espacios alterados. Sus obras nacen de testimonios de violencia política, pero rehúyen representar literalmente a las víctimas. Construyen un lugar material para una ausencia que la sociedad no ha sabido alojar.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La violencia política que destruye cuerpos, hogares, vínculos y derecho al duelo.",
      },
      {
        titulo: "La luz",
        texto:
          "La posibilidad de crear un espacio público donde una ausencia sea reconocida.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Muebles sellados, grietas, tierra, telas, arquitectura intervenida y silencio.",
      },
    ],

    aprendizajes: [
      "Trabajar desde el testimonio sin ilustrarlo.",
      "Dar forma material a la ausencia.",
      "Convertir arquitectura y objeto en memoria política.",
      "Evitar apropiarse del dolor ajeno.",
      "Construir lugares para un duelo colectivo.",
    ],

    obras: [
      {
        titulo: "Shibboleth",
        razon:
          "Una grieta atraviesa el suelo institucional y hace visible una frontera histórica y racial.",
      },
      {
        titulo: "Noviembre 6 y 7",
        razon:
          "Sillas descienden por la fachada del Palacio de Justicia como memorial temporal.",
      },
      {
        titulo: "Plegaria muda",
        razon:
          "Mesas y tierra construyen una presencia funeraria asociada a jóvenes asesinados.",
      },
      {
        titulo: "Atrabiliarios",
        razon:
          "Zapatos detrás de membranas translúcidas conservan la ausencia de personas desaparecidas.",
      },
      {
        titulo: "Fragmentos",
        razon:
          "Armas fundidas forman un suelo dedicado a víctimas del conflicto colombiano.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La memoria de María necesita un espacio de duelo que no convierta su cuerpo en espectáculo.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Los objetos y arquitecturas revelan cómo la violencia se instala dentro de la vida cotidiana.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Los objetos de quienes entraron al laberinto funcionan como memoriales materiales de una ausencia sin cierre.",
      },
    ],

    constelacion: [
      "Christian Boltanski",
      "Käthe Kollwitz",
      "Chiharu Shiota",
      "Anselm Kiefer",
      "Toni Morrison",
      "Primo Levi",
    ],
  },

  [normalizarNombreCuratorial("Joseph Beuys")]: {
    pregunta:
      "¿Puede el arte transformar la forma en que una sociedad piensa, trabaja y se organiza?",

    introduccion:
      "Beuys amplió la idea de escultura hasta incluir conversación, política, educación y acción colectiva. Fieltro, grasa, animales, árboles y objetos funcionan como materiales de una obra que intenta modificar también la conciencia social.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La separación entre creación artística, vida común y responsabilidad política.",
      },
      {
        titulo: "La luz",
        texto:
          "La idea de que toda persona puede intervenir creativamente en la transformación social.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Acción, instalación, objetos, pedagogía, símbolo y escultura social.",
      },
    ],

    aprendizajes: [
      "Entender una obra como proceso y no solo como objeto.",
      "Utilizar materiales por su memoria y comportamiento.",
      "Incluir conversación y comunidad dentro del arte.",
      "Convertir una acción simbólica en intervención política.",
      "Preguntar qué transforma realmente una obra.",
    ],

    obras: [
      {
        titulo: "I Like America and America Likes Me",
        razon:
          "El artista convive con un coyote dentro de una acción sobre mito, violencia y territorio.",
      },
      {
        titulo: "7000 Oaks",
        razon:
          "Miles de árboles y piedras transforman la ciudad mediante una escultura colectiva prolongada.",
      },
      {
        titulo: "How to Explain Pictures to a Dead Hare",
        razon:
          "Una acción sobre lenguaje, enseñanza, muerte y límites de la explicación.",
      },
      {
        titulo: "Felt Suit",
        razon:
          "El vestido de fieltro conserva memoria corporal, protección y ausencia.",
      },
      {
        titulo: "The Pack",
        razon:
          "Un vehículo y trineos de supervivencia construyen una imagen de emergencia y cuidado.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Las reliquias pueden actuar como objetos de transformación comunitaria y no solo como piezas de archivo.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El hambre puede abordarse mediante acciones colectivas que cuestionen distribución, cuidado y poder.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Los objetos, animales y rituales pueden participar activamente en la construcción de una nueva comunidad.",
      },
    ],

    constelacion: [
      "Antoni Tàpies",
      "Doris Salcedo",
      "Christian Boltanski",
      "Anselm Kiefer",
      "Isamu Noguchi",
      "Ursula K. Le Guin",
    ],
  },


  [normalizarNombreCuratorial("Berlinde De Bruyckere")]: {
    pregunta:
      "¿Qué dignidad conserva un cuerpo cuando ha sido herido, ocultado o reducido a materia?",

    introduccion:
      "De Bruyckere crea cuerpos, árboles, pieles, mantas y formas fragmentadas que parecen encontrarse entre herida, refugio y metamorfosis. Sus esculturas no representan cadáveres ni anatomías exactas: construyen presencias vulnerables que obligan a mirar sin dominar.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "El cuerpo expuesto a violencia, enfermedad, abandono y pérdida de identidad.",
      },
      {
        titulo: "La luz",
        texto:
          "La posibilidad de conservar ternura y dignidad dentro de una forma dañada.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Cera, madera, textiles, cuerpos fragmentados, árboles y superficies semejantes a piel.",
      },
    ],

    aprendizajes: [
      "Representar vulnerabilidad sin convertirla en debilidad.",
      "Trabajar la materia como memoria corporal.",
      "Utilizar fragmentación sin perder presencia.",
      "Permitir que refugio y amenaza convivan.",
      "Crear figuras que no se reduzcan a una identidad cerrada.",
    ],

    obras: [
      {
        titulo: "Kreupelhout — Cripplewood",
        razon:
          "Un árbol herido y vendado adquiere escala corporal, histórica y funeraria.",
      },
      {
        titulo: "The Embalmer",
        razon:
          "La anatomía incompleta y la cera construyen una presencia entre conservación y desaparición.",
      },
      {
        titulo: "No Life Lost",
        razon:
          "Cuerpos equinos cubiertos revelan fragilidad, peso y duelo.",
      },
      {
        titulo: "Schmerzensmann",
        razon:
          "La figura doliente aparece suspendida entre tradición religiosa y materia contemporánea.",
      },
      {
        titulo: "We Are All Flesh",
        razon:
          "La continuidad entre cuerpo humano, animal y materia se vuelve imposible de ignorar.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "El cuerpo de María y el Árbol Blanco comparten una vulnerabilidad material que la memoria intenta proteger.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El hambre transforma piel, postura e identidad hasta convertir el cuerpo en archivo visible.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "El minotauro blanco, Iván y los cuerpos que no envejecen habitan una frontera entre carne, herida y metamorfosis.",
      },
    ],

    constelacion: [
      "Louise Bourgeois",
      "Alberto Giacometti",
      "Doris Salcedo",
      "Käthe Kollwitz",
      "Chiharu Shiota",
      "Francisco de Goya",
    ],
  },

  [normalizarNombreCuratorial("Robert Bresson")]: {
    pregunta:
      "¿Cuánto puede retirarse una película antes de que aparezca lo esencial?",

    introduccion:
      "Bresson eliminó gestos enfáticos, psicología explicada y espectáculo para construir un cine de manos, sonidos, objetos y decisiones. Sus intérpretes no representan emociones: permiten que la acción y el montaje las hagan aparecer.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La distancia entre la experiencia interior y las convenciones utilizadas para representarla.",
      },
      {
        titulo: "La luz",
        texto:
          "La revelación que aparece cuando la forma renuncia a imponer una emoción.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Fragmentación corporal, sonido fuera de campo, montaje preciso y actuación despojada.",
      },
    ],

    aprendizajes: [
      "Eliminar todo gesto que explique demasiado.",
      "Confiar en el sonido como espacio narrativo.",
      "Filmar acciones antes que interpretaciones.",
      "Utilizar manos y objetos como portadores de conciencia.",
      "Encontrar intensidad mediante contención.",
    ],

    obras: [
      {
        titulo: "Un condenado a muerte se ha escapado",
        razon:
          "La libertad se construye mediante acciones mínimas, sonidos y una disciplina material absoluta.",
      },
      {
        titulo: "Pickpocket",
        razon:
          "El robo, la soledad y la gracia se expresan mediante manos, ritmo y distancia.",
      },
      {
        titulo: "Al azar de Baltasar",
        razon:
          "La vida de un burro revela crueldad, inocencia y sufrimiento humano sin sentimentalismo.",
      },
      {
        titulo: "Mouchette",
        razon:
          "Una adolescente atraviesa pobreza, violencia y abandono dentro de una forma radicalmente austera.",
      },
      {
        titulo: "El dinero",
        razon:
          "Un billete falso desencadena una cadena moral donde cada gesto produce consecuencias irreversibles.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La violencia y la memoria deben mostrarse mediante acciones, objetos y silencios, no mediante dramatización excesiva.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Manos, pasos, puertas y sonidos pueden revelar la transformación moral del descenso.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La llamada y el laberinto adquieren fuerza cuando la puesta en escena evita explicar su misterio.",
      },
    ],

    constelacion: [
      "Carl Theodor Dreyer",
      "Andrei Tarkovski",
      "Víctor Erice",
      "Samuel Beckett",
      "Arvo Pärt",
      "Pedro Costa",
    ],
  },

  [normalizarNombreCuratorial("Carl Theodor Dreyer")]: {
    pregunta:
      "¿Qué verdad puede revelar un rostro cuando ya no tiene lugar donde esconderse?",

    introduccion:
      "Dreyer convirtió el primer plano, la luz, la fe y el silencio en instrumentos de una intensidad extrema. Sus personajes se enfrentan a instituciones, familias y comunidades que intentan gobernar aquello que creen, desean o son.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La conciencia individual sometida al juicio de una autoridad religiosa, familiar o social.",
      },
      {
        titulo: "La luz",
        texto:
          "La verdad interior que permanece visible incluso cuando el cuerpo ha sido derrotado.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Rostros, blancos intensos, interiores austeros, duración y movimiento ceremonial.",
      },
    ],

    aprendizajes: [
      "Tratar el rostro como acontecimiento.",
      "Construir tensión mediante quietud.",
      "Utilizar la luz como fuerza moral.",
      "Representar la fe sin convertirla en respuesta sencilla.",
      "Dejar que una escena adquiera condición ritual.",
    ],

    obras: [
      {
        titulo: "La pasión de Juana de Arco",
        razon:
          "El rostro de Juana enfrenta juicio, fe y muerte dentro de una puesta en escena radical.",
      },
      {
        titulo: "Ordet",
        razon:
          "Fe, locura, familia y milagro conviven sin quedar reducidos a una sola interpretación.",
      },
      {
        titulo: "Dies Irae",
        razon:
          "Deseo, persecución y poder religioso convierten una comunidad en tribunal.",
      },
      {
        titulo: "Gertrud",
        razon:
          "Una mujer sostiene una idea absoluta del amor frente a una sociedad incapaz de recibirla.",
      },
      {
        titulo: "Vampyr",
        razon:
          "Sueño, muerte y amenaza se desarrollan mediante espacios y sombras de lógica incierta.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "El rostro de la víctima y la violencia institucional exigen una mirada frontal y sin ornamento.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Cada estación funciona como tribunal moral donde deseo, culpa y autoridad se enfrentan.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La llamada, la fe en una salida y la puerta de piedra pueden adquirir una dimensión ritual semejante.",
      },
    ],

    constelacion: [
      "Robert Bresson",
      "Ingmar Bergman",
      "Andrei Tarkovski",
      "Simone Weil",
      "Arvo Pärt",
      "Víctor Erice",
    ],
  },

  [normalizarNombreCuratorial("Terrence Malick")]: {
    pregunta:
      "¿Puede una vida reconocer su lugar dentro de una naturaleza que existía antes y continuará después de ella?",

    introduccion:
      "Malick filma cuerpos, hierba, agua, viento, infancia, violencia y cosmos como partes de una misma pregunta. Sus relatos avanzan mediante recuerdos, voces interiores y percepciones que convierten el mundo natural en presencia espiritual.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La separación entre la conciencia humana y el mundo vivo del que forma parte.",
      },
      {
        titulo: "La luz",
        texto:
          "La posibilidad de descubrir gracia dentro de lo cotidiano, incluso junto a la violencia.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Voz en off, luz natural, cámara móvil, naturaleza, montaje asociativo y escala cósmica.",
      },
    ],

    aprendizajes: [
      "Filmar o escribir desde la percepción.",
      "Relacionar intimidad y cosmos.",
      "Utilizar la naturaleza como interlocutora.",
      "Construir memoria mediante fragmentos sensoriales.",
      "Permitir que una pregunta espiritual permanezca abierta.",
    ],

    obras: [
      {
        titulo: "El árbol de la vida",
        razon:
          "Infancia, familia, duelo y origen del universo forman una única experiencia de memoria.",
      },
      {
        titulo: "La delgada línea roja",
        razon:
          "La guerra se confronta con la belleza indiferente y persistente de la naturaleza.",
      },
      {
        titulo: "Días del cielo",
        razon:
          "Amor, trabajo, paisaje y destrucción avanzan bajo una luz casi mítica.",
      },
      {
        titulo: "Malas tierras",
        razon:
          "Violencia juvenil y paisaje americano se observan desde una distancia inquietantemente lírica.",
      },
      {
        titulo: "Una vida oculta",
        razon:
          "La conciencia individual se niega a obedecer al poder aunque el gesto permanezca invisible para la historia.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "El Árbol Blanco reúne infancia, naturaleza, violencia y memoria dentro de una presencia anterior a los personajes.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "La materia urbana y corporal puede alternarse con recuerdos del mundo natural perdido.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Animales, cuerpos y paisaje residual participan de una misma pregunta sobre vida, muerte y continuidad.",
      },
    ],

    constelacion: [
      "Andrei Tarkovski",
      "Víctor Erice",
      "Caspar David Friedrich",
      "Gustav Mahler",
      "Rainer Maria Rilke",
      "Apichatpong Weerasethakul",
    ],
  },

  [normalizarNombreCuratorial("David Lynch")]: {
    pregunta:
      "¿Qué se esconde debajo de una realidad que insiste demasiado en parecer normal?",

    introduccion:
      "Lynch construyó suburbios, habitaciones, carreteras, teatros y sueños donde identidad y tiempo pierden estabilidad. Lo inquietante no irrumpe desde otro mundo: emerge desde la superficie cotidiana y revela que nunca fue segura.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La violencia y el deseo ocultos debajo de las imágenes sociales de inocencia y normalidad.",
      },
      {
        titulo: "La luz",
        texto:
          "La imaginación capaz de dar forma a aquello que la conciencia no puede expresar directamente.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Sueño, sonido industrial, dobles, espacios nocturnos, humor y narración fragmentada.",
      },
    ],

    aprendizajes: [
      "Construir una lógica emocional antes que explicativa.",
      "Usar el sonido como amenaza y materia.",
      "Permitir que una identidad se divida.",
      "Crear símbolos que no admitan traducción única.",
      "Encontrar lo extraño dentro de lo cotidiano.",
    ],

    obras: [
      {
        titulo: "Mulholland Drive",
        razon:
          "Deseo, fracaso, identidad y cine se reorganizan mediante sueño, doble y memoria.",
      },
      {
        titulo: "Terciopelo azul",
        razon:
          "La superficie amable de una ciudad revela violencia, deseo y oscuridad subterránea.",
      },
      {
        titulo: "Twin Peaks",
        razon:
          "Una comunidad entera se abre alrededor de una muerte y de múltiples realidades superpuestas.",
      },
      {
        titulo: "Carretera perdida",
        razon:
          "La culpa y la identidad producen una narración circular e inestable.",
      },
      {
        titulo: "Eraserhead",
        razon:
          "Paternidad, cuerpo y ansiedad industrial adquieren forma de pesadilla material.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La memoria de la violencia abre una grieta donde sueño, culpa y realidad dejan de separarse.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "La ciudad subterránea posee una lógica sensorial, sonora y moral próxima a sus mundos.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "El laberinto, la transformación de Iván y la identidad de Mara pueden coexistir dentro de una estructura onírica rigurosa.",
      },
    ],

    constelacion: [
      "Franz Kafka",
      "Luis Buñuel",
      "Salvador Dalí",
      "Edward Hopper",
      "Leonora Carrington",
      "Apichatpong Weerasethakul",
    ],
  },

  [normalizarNombreCuratorial("Pedro Costa")]: {
    pregunta:
      "¿Cómo mirar a quienes viven fuera del encuadre social sin convertir su precariedad en espectáculo?",

    introduccion:
      "Pedro Costa ha construido un cine de sombras, habitaciones y presencias junto a comunidades desplazadas y marginadas. Sus imágenes poseen una belleza rigurosa, pero nunca olvidan las condiciones materiales de quienes aparecen en ellas.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La expulsión de cuerpos y comunidades hacia espacios invisibles para la ciudad oficial.",
      },
      {
        titulo: "La luz",
        texto:
          "La posibilidad de construir una imagen digna mediante tiempo, colaboración y escucha.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Luz mínima, interiores, planos fijos, voces, ruinas y trabajo prolongado con las mismas personas.",
      },
    ],

    aprendizajes: [
      "Trabajar con una comunidad y no únicamente sobre ella.",
      "Construir dignidad mediante tiempo y presencia.",
      "Evitar la mirada turística sobre la pobreza.",
      "Utilizar la oscuridad como espacio y no como ocultación.",
      "Permitir que una persona controle parte de su propia representación.",
    ],

    obras: [
      {
        titulo: "En el cuarto de Vanda",
        razon:
          "Una habitación y un barrio en demolición se convierten en archivo de una comunidad.",
      },
      {
        titulo: "Juventud en marcha",
        razon:
          "Ventura atraviesa casas y memorias mientras la ciudad desplaza a quienes la construyeron.",
      },
      {
        titulo: "Caballo dinero",
        razon:
          "Trauma, revolución, hospital y memoria colonial conviven dentro de una temporalidad espectral.",
      },
      {
        titulo: "Vitalina Varela",
        razon:
          "Una mujer llega demasiado tarde al funeral de su marido y ocupa el centro de su propia historia.",
      },
      {
        titulo: "Ossos",
        razon:
          "Pobreza, maternidad y abandono se observan mediante cuerpos y espacios de extrema austeridad.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La víctima y quienes la recuerdan necesitan una representación construida desde dignidad y duración.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Los excluidos del sistema deben poseer voz, rostro y tiempo propios.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La comunidad residual puede filmarse como presencia y no como simple escenario fantástico.",
      },
    ],

    constelacion: [
      "Robert Bresson",
      "Béla Tarr",
      "Doris Salcedo",
      "Sebastião Salgado",
      "Lucrecia Martel",
      "Primo Levi",
    ],
  },

  [normalizarNombreCuratorial("Lucrecia Martel")]: {
    pregunta:
      "¿Qué violencia circula por una casa antes de que alguien sea capaz de nombrarla?",

    introduccion:
      "Martel construye películas donde clase, familia, deseo, cuerpo y colonialidad se revelan mediante sonidos, proximidades y espacios domésticos. La cámara rara vez explica: escucha aquello que las relaciones intentan mantener fuera de campo.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La violencia social y familiar normalizada dentro de gestos, silencios y jerarquías cotidianas.",
      },
      {
        titulo: "La luz",
        texto:
          "La capacidad del sonido y del cuerpo para revelar aquello que el discurso oculta.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Diseño sonoro inmersivo, encuadres fragmentarios, cuerpos próximos y narración elíptica.",
      },
    ],

    aprendizajes: [
      "Construir espacio mediante sonido.",
      "Mostrar una jerarquía sin explicarla.",
      "Filmar o escribir desde posiciones corporales.",
      "Permitir que lo importante permanezca parcialmente fuera de campo.",
      "Observar cómo la clase atraviesa la intimidad.",
    ],

    obras: [
      {
        titulo: "La ciénaga",
        razon:
          "Una familia, una piscina y un verano sofocante revelan decadencia, clase y violencia.",
      },
      {
        titulo: "La niña santa",
        razon:
          "Deseo, religión y poder adulto se confunden dentro de un hotel.",
      },
      {
        titulo: "La mujer sin cabeza",
        razon:
          "Un accidente posible altera percepción, culpa y privilegio social.",
      },
      {
        titulo: "Zama",
        razon:
          "La espera colonial transforma identidad, tiempo y relación con el territorio.",
      },
      {
        titulo: "Terminal Norte",
        razon:
          "Música, comunidad y territorio aparecen desde una forma libre y cercana.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La violencia existe antes de ser nombrada y continúa circulando dentro de familias, espacios y sonidos.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Clase, cuerpo y deseo se expresan mediante proximidad, ruido y jerarquía espacial.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La espera y la ley del mundo pueden percibirse corporalmente antes de ser comprendidas.",
      },
    ],

    constelacion: [
      "Pedro Costa",
      "Toni Morrison",
      "Virginia Woolf",
      "Doris Salcedo",
      "Apichatpong Weerasethakul",
      "Juan Rulfo",
    ],
  },

  [normalizarNombreCuratorial("Apichatpong Weerasethakul")]: {
    pregunta:
      "¿Dónde termina una vida cuando sueños, espíritus, animales y recuerdos continúan hablando?",

    introduccion:
      "Apichatpong filma selvas, hospitales, pueblos, cuerpos dormidos y presencias espectrales como partes de una misma realidad. En su cine, lo sobrenatural no interrumpe el mundo: convive con él con absoluta naturalidad.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La historia política y personal que regresa mediante cuerpos, sueños y lugares.",
      },
      {
        titulo: "La luz",
        texto:
          "La posibilidad de convivir con múltiples formas de existencia sin jerarquizarlas.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Duración, selva, sueño, sonido, espíritus, duplicidad y narración abierta.",
      },
    ],

    aprendizajes: [
      "Integrar lo sobrenatural sin subrayarlo.",
      "Construir memoria mediante lugares.",
      "Permitir que una película o relato cambie de forma.",
      "Escuchar animales, clima y oscuridad.",
      "Tratar sueño y vigilia como territorios comunicados.",
    ],

    obras: [
      {
        titulo: "Uncle Boonmee recuerda sus vidas pasadas",
        razon:
          "Un hombre moribundo recibe a familiares muertos y recuerdos de otras existencias.",
      },
      {
        titulo: "Tropical Malady",
        razon:
          "Una historia de amor se transforma en viaje nocturno, animal y mítico.",
      },
      {
        titulo: "Cemetery of Splendour",
        razon:
          "Soldados dormidos, memoria política y luces subterráneas conviven en un hospital.",
      },
      {
        titulo: "Syndromes and a Century",
        razon:
          "Hospital, recuerdo y repetición reorganizan tiempo, identidad y espacio.",
      },
      {
        titulo: "Memoria",
        razon:
          "Un sonido inexplicable conduce hacia capas geológicas, personales e históricas.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Los muertos, la naturaleza y los objetos pueden continuar presentes sin necesidad de explicación fantástica.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El descenso puede alterar progresivamente tiempo, sueño y percepción corporal.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Bielka comparte su convivencia natural entre muertos, animales, memoria y leyes desconocidas.",
      },
    ],

    constelacion: [
      "David Lynch",
      "Terrence Malick",
      "Andrei Tarkovski",
      "Lucrecia Martel",
      "Juan Rulfo",
      "Yoko Tawada",
    ],
  },

  [normalizarNombreCuratorial("Guillermo del Toro")]: {
    pregunta:
      "¿Quién es realmente el monstruo cuando la criatura conserva más compasión que quienes la persiguen?",

    introduccion:
      "Del Toro ha construido una mitología de criaturas heridas, niños, insectos, fantasmas, máquinas y regímenes autoritarios. Sus monstruos no encarnan simplemente el miedo: revelan la violencia de quienes necesitan excluir lo diferente.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La persecución de aquello que no encaja en una definición normalizada de humanidad.",
      },
      {
        titulo: "La luz",
        texto:
          "La imaginación como refugio, resistencia y reconocimiento de otras formas de vida.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Diseño de criaturas, cuento oscuro, objetos mecánicos, infancia, horror y melodrama.",
      },
    ],

    aprendizajes: [
      "Diseñar criaturas con biografía y materialidad.",
      "Utilizar el género fantástico para hablar de violencia histórica.",
      "Dar complejidad moral al monstruo.",
      "Construir mundos mediante objetos y texturas.",
      "Relacionar infancia, miedo y desobediencia.",
    ],

    obras: [
      {
        titulo: "El laberinto del fauno",
        razon:
          "Infancia, fascismo y mundo fantástico se enfrentan dentro de una prueba moral.",
      },
      {
        titulo: "La forma del agua",
        razon:
          "Una criatura perseguida y una mujer silenciada construyen un vínculo fuera de la norma.",
      },
      {
        titulo: "El espinazo del diablo",
        razon:
          "Un fantasma infantil conserva la memoria de la violencia dentro de un orfanato.",
      },
      {
        titulo: "Cronos",
        razon:
          "Inmortalidad, cuerpo y maquinaria se reúnen en un objeto que transforma a quien lo usa.",
      },
      {
        titulo: "Pinocho de Guillermo del Toro",
        razon:
          "Una criatura creada aprende vida, desobediencia y muerte dentro de un régimen autoritario.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "El árbol, el fuego y la infancia permiten que la fantasía revele una violencia histórica concreta.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Los cuerpos deformados por necesidad pueden conservar más humanidad que las instituciones que los juzgan.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "El minotauro blanco y el laberinto exigen una mirada que no confunda monstruosidad con maldad.",
      },
    ],

    constelacion: [
      "Francisco de Goya",
      "Leonora Carrington",
      "Luis Buñuel",
      "David Lynch",
      "Kenzaburō Ōe",
      "Berlinde De Bruyckere",
    ],
  },

  [normalizarNombreCuratorial("Jóhann Jóhannsson")]: {
    pregunta:
      "¿Puede una música convertir el tiempo, la máquina y la memoria en una única respiración?",

    introduccion:
      "Jóhannsson combinó orquesta, electrónica, grabaciones, voz y repetición para construir paisajes sonoros de gran densidad emocional. Su música parece observar al ser humano desde una escala histórica, tecnológica y cósmica.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La pérdida humana dentro de sistemas, máquinas y transformaciones que parecen superar al individuo.",
      },
      {
        titulo: "La luz",
        texto:
          "La capacidad del sonido para devolver intimidad a una escala monumental.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Orquesta, electrónica, drones, repetición, archivo sonoro y construcción gradual.",
      },
    ],

    aprendizajes: [
      "Unir sonido acústico y electrónico sin jerarquía.",
      "Construir emoción mediante acumulación lenta.",
      "Crear una identidad sonora para un mundo narrativo.",
      "Utilizar archivos y voces como memoria.",
      "Trabajar la escala sin perder intimidad.",
    ],

    obras: [
      {
        titulo: "Fordlandia",
        razon:
          "Una utopía industrial fallida se convierte en paisaje de repetición, melancolía y memoria.",
      },
      {
        titulo: "Orphée",
        razon:
          "El mito del descenso y el retorno se transforma en una obra de tránsito y pérdida.",
      },
      {
        titulo: "The Miners' Hymns",
        razon:
          "Trabajo, comunidad minera e historia industrial aparecen mediante archivo y música.",
      },
      {
        titulo: "Arrival",
        razon:
          "Lenguaje, tiempo y duelo adquieren una identidad sonora circular y expansiva.",
      },
      {
        titulo: "Sicario",
        razon:
          "Pulsos graves y repetición convierten la frontera en amenaza física.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Archivo, memoria, árbol y pérdida podrían organizarse mediante una música de acumulación lenta.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Cada nivel del descenso puede adquirir un pulso mecánico y corporal diferente.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "El laberinto, la llamada y la transformación de Iván necesitan una música entre rito, máquina y memoria.",
      },
    ],

    constelacion: [
      "Arvo Pärt",
      "Henryk Górecki",
      "Gustav Mahler",
      "Andrei Tarkovski",
      "Bill Viola",
      "Moby",
    ],
  },


  [normalizarNombreCuratorial("Max Richter")]: {
    pregunta:
      "¿Puede la música reconstruir una memoria sin borrar las fracturas que la formaron?",

    introduccion:
      "Max Richter trabaja entre composición clásica, electrónica, archivo, literatura y paisaje sonoro. Sus obras convierten la repetición en memoria y la melodía en una forma de acompañar aquello que regresa, se pierde o permanece suspendido.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La experiencia de recordar mediante fragmentos que nunca recuperan por completo aquello que ocurrió.",
      },
      {
        titulo: "La luz",
        texto:
          "La posibilidad de crear consuelo sin negar la pérdida.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Cuerdas, piano, electrónica, voz, archivo y repetición progresiva.",
      },
    ],

    aprendizajes: [
      "Construir emoción mediante variaciones mínimas.",
      "Unir instrumentos acústicos y electrónica con naturalidad.",
      "Trabajar con documentos y voces como memoria.",
      "Crear una obra extensa sin perder intimidad.",
      "Permitir que la belleza acompañe el dolor sin resolverlo.",
    ],

    obras: [
      {
        titulo: "The Blue Notebooks",
        razon:
          "Piano, cuerdas y textos construyen una meditación sobre violencia, memoria y vida interior.",
      },
      {
        titulo: "Sleep",
        razon:
          "Una obra de ocho horas transforma música, descanso y conciencia en una única arquitectura temporal.",
      },
      {
        titulo: "Recomposed: Vivaldi – The Four Seasons",
        razon:
          "Una obra canónica se descompone y reconstruye mediante repetición, memoria y transformación.",
      },
      {
        titulo: "Infra",
        razon:
          "Movimiento, pérdida y vida urbana aparecen en una partitura de gran concentración emocional.",
      },
      {
        titulo: "Voices",
        razon:
          "La Declaración Universal de los Derechos Humanos se convierte en materia coral y sonora.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La memoria, las reliquias y la violencia pueden organizarse mediante capas musicales que regresan transformadas.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Cada estación puede poseer un motivo que se deforme a medida que el descenso avanza.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "El tiempo suspendido y las presencias residuales encuentran una afinidad directa con su música.",
      },
    ],

    constelacion: [
      "Jóhann Jóhannsson",
      "Philip Glass",
      "Arvo Pärt",
      "Henryk Górecki",
      "Bill Viola",
      "Andrei Tarkovski",
    ],
  },

  [normalizarNombreCuratorial("Philip Glass")]: {
    pregunta:
      "¿Cuánto puede transformarse una forma sin dejar de ser reconocible?",

    introduccion:
      "Philip Glass convirtió repetición, pulso y variación en una experiencia temporal expansiva. Sus estructuras no permanecen inmóviles: cambian lentamente hasta que el oyente descubre que el paisaje sonoro ya no es el mismo.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La percepción de un tiempo cotidiano fragmentado, acelerado y difícil de habitar.",
      },
      {
        titulo: "La luz",
        texto:
          "La repetición como forma de atención y transformación gradual.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Arpegios, pulsos, módulos, desplazamientos rítmicos y acumulación.",
      },
    ],

    aprendizajes: [
      "Construir movimiento mediante cambios mínimos.",
      "Trabajar con módulos claramente reconocibles.",
      "Permitir que la repetición modifique la percepción.",
      "Sostener grandes duraciones mediante estructura.",
      "Convertir el pulso en arquitectura.",
    ],

    obras: [
      {
        titulo: "Einstein on the Beach",
        razon:
          "Ópera, imagen, movimiento y repetición se liberan de la narración tradicional.",
      },
      {
        titulo: "Glassworks",
        razon:
          "El lenguaje minimalista se presenta con claridad, intimidad y accesibilidad.",
      },
      {
        titulo: "Koyaanisqatsi",
        razon:
          "Música e imagen construyen una visión del desequilibrio entre humanidad, tecnología y planeta.",
      },
      {
        titulo: "Music in Twelve Parts",
        razon:
          "Un sistema musical se transforma durante horas mediante expansión y desplazamiento.",
      },
      {
        titulo: "Metamorphosis",
        razon:
          "El piano convierte repetición y cambio gradual en experiencia interior.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Las reliquias pueden regresar como motivos cuyo significado cambia con cada aparición.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El descenso puede estructurarse mediante patrones que se acumulan y desestabilizan.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La espera, los ciclos y la transformación lenta de Iván poseen una lógica profundamente repetitiva.",
      },
    ],

    constelacion: [
      "Max Richter",
      "Jóhann Jóhannsson",
      "Arvo Pärt",
      "Meredith Monk",
      "Johann Sebastian Bach",
      "Pina Bausch",
    ],
  },

  [normalizarNombreCuratorial("György Ligeti")]: {
    pregunta:
      "¿Qué ocurre cuando el sonido deja de avanzar como melodía y comienza a comportarse como materia?",

    introduccion:
      "Ligeti creó nubes sonoras, polirritmos, masas vocales y mecanismos musicales de extrema precisión. Su obra oscila entre terror cósmico, humor, complejidad matemática y una imaginación que convierte el sonido en organismo.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La experiencia de un mundo donde el orden puede volverse opresivo, mecánico o incomprensible.",
      },
      {
        titulo: "La luz",
        texto:
          "La libertad de inventar nuevas formas auditivas sin abandonar rigor ni emoción.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Micropolifonía, masas sonoras, polirritmia, voz, humor y estructuras mecánicas.",
      },
    ],

    aprendizajes: [
      "Tratar el sonido como espacio y textura.",
      "Construir caos mediante reglas precisas.",
      "Utilizar densidad sin perder dirección.",
      "Permitir que humor y amenaza convivan.",
      "Crear una experiencia física mediante organización sonora.",
    ],

    obras: [
      {
        titulo: "Atmosphères",
        razon:
          "La orquesta se transforma en una masa sonora sin melodía ni pulso reconocible.",
      },
      {
        titulo: "Lux Aeterna",
        razon:
          "Las voces forman una materia flotante, luminosa y casi inmaterial.",
      },
      {
        titulo: "Requiem",
        razon:
          "El coro adquiere una densidad abrumadora que convierte el rito en experiencia cósmica.",
      },
      {
        titulo: "Le Grand Macabre",
        razon:
          "Muerte, absurdo y sátira se combinan dentro de una ópera de imaginación extrema.",
      },
      {
        titulo: "Études pour piano",
        razon:
          "Ritmo, ilusión, mecanismo y virtuosismo abren nuevas posibilidades para el piano.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "El incendio, la memoria y el terror colectivo pueden adquirir una dimensión sonora no narrativa.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Las estaciones pueden sentirse como masas acústicas que alteran orientación y cuerpo.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "El laberinto y su ley desconocida encuentran una traducción natural en sus arquitecturas sonoras.",
      },
    ],

    constelacion: [
      "Jóhann Jóhannsson",
      "Stanley Kubrick",
      "Philip Glass",
      "Béla Tarr",
      "David Lynch",
      "Guillermo del Toro",
    ],
  },

  [normalizarNombreCuratorial("Nina Simone")]: {
    pregunta:
      "¿Cómo puede una voz convertir dolor, rabia y dignidad en una forma de libertad?",

    introduccion:
      "Nina Simone reunió jazz, blues, música clásica, gospel y protesta política en una voz imposible de separar de su presencia. No interpretaba una canción como una forma cerrada: la sometía a su propia verdad emocional y política.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "El racismo, la exclusión y la violencia que intentan reducir una vida y una voz.",
      },
      {
        titulo: "La luz",
        texto:
          "La música como afirmación de dignidad, identidad y resistencia.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Piano, voz grave, improvisación, repertorio transformado y presencia escénica.",
      },
    ],

    aprendizajes: [
      "Interpretar una obra hasta volverla propia.",
      "No separar estética y posición política.",
      "Utilizar el silencio antes de una frase.",
      "Convertir la vulnerabilidad en fuerza escénica.",
      "Permitir que una voz conserve rabia, ternura y autoridad.",
    ],

    obras: [
      {
        titulo: "Mississippi Goddam",
        razon:
          "La canción de protesta abandona toda cortesía frente a la violencia racial.",
      },
      {
        titulo: "Four Women",
        razon:
          "Cuatro identidades femeninas revelan distintas heridas producidas por racismo y estereotipo.",
      },
      {
        titulo: "Sinnerman",
        razon:
          "Repetición, urgencia y espiritualidad convierten la interpretación en experiencia ritual.",
      },
      {
        titulo: "I Put a Spell on You",
        razon:
          "Deseo, posesión y presencia vocal transforman completamente una canción conocida.",
      },
      {
        titulo: "Feeling Good",
        razon:
          "La afirmación de una nueva vida adquiere una fuerza expansiva y política.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La memoria de la víctima necesita una voz capaz de sostener dolor y dignidad sin pedir permiso.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Las voces excluidas pueden convertir rabia y deseo de reconocimiento en presencia colectiva.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La comunidad residual necesita canciones que devuelvan nombre, fuerza y pertenencia.",
      },
    ],

    constelacion: [
      "Toni Morrison",
      "Mahmoud Darwish",
      "Leonard Cohen",
      "Käthe Kollwitz",
      "Wole Soyinka",
      "Nick Cave",
    ],
  },

  [normalizarNombreCuratorial("Nick Cave")]: {
    pregunta:
      "¿Puede una canción atravesar violencia, culpa y duelo sin renunciar a la belleza?",

    introduccion:
      "Nick Cave ha construido una obra donde balada, crimen, fe, deseo, muerte y pérdida personal permanecen en tensión. Su escritura no busca pureza: encuentra formas de cantar desde aquello que permanece roto.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La pérdida y la culpa que transforman para siempre la relación con el lenguaje y la fe.",
      },
      {
        titulo: "La luz",
        texto:
          "La posibilidad de continuar creando sin fingir que el dolor ha sido superado.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Balada oscura, narrativa bíblica, piano, ruido, repetición y voz confesional.",
      },
    ],

    aprendizajes: [
      "Escribir desde el duelo sin convertirlo en exhibición.",
      "Unir narración, canción y mito.",
      "Permitir que la fe permanezca en conflicto.",
      "Transformar una voz artística después de una pérdida.",
      "Utilizar oscuridad sin abandonar ternura.",
    ],

    obras: [
      {
        titulo: "Murder Ballads",
        razon:
          "La tradición de la canción criminal se lleva hacia una teatralidad extrema y consciente.",
      },
      {
        titulo: "The Boatman's Call",
        razon:
          "Amor, pérdida y fe aparecen mediante una escritura íntima y despojada.",
      },
      {
        titulo: "Skeleton Tree",
        razon:
          "El duelo altera estructura, voz y tiempo hasta convertir el álbum en presencia espectral.",
      },
      {
        titulo: "Ghosteen",
        razon:
          "La pérdida se transforma en una obra luminosa, suspendida y profundamente espiritual.",
      },
      {
        titulo: "Abattoir Blues / The Lyre of Orpheus",
        razon:
          "Violencia, mito, gospel y deseo se reúnen en una arquitectura doble.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "La pérdida exige una voz que continúe cantando sin convertir el dolor en cierre.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Deseo, violencia, religión y cuerpos expulsados encuentran un lenguaje cercano a sus baladas.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Los muertos incompletos, los niños y la transformación de Iván piden una música capaz de convivir con el duelo.",
      },
    ],

    constelacion: [
      "Leonard Cohen",
      "Nina Simone",
      "Federico García Lorca",
      "Cormac McCarthy",
      "P. J. Harvey",
      "Jóhann Jóhannsson",
    ],
  },

  [normalizarNombreCuratorial("Meredith Monk")]: {
    pregunta:
      "¿Qué recuerda la voz antes de convertirse en palabra?",

    introduccion:
      "Meredith Monk utiliza voz, cuerpo, movimiento, espacio y repetición para explorar formas de comunicación anteriores o posteriores al lenguaje verbal. Sus obras convierten respiración, gesto y sonido en una comunidad escénica.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La reducción de la voz humana a portadora de palabras y significados estables.",
      },
      {
        titulo: "La luz",
        texto:
          "La recuperación de la voz como cuerpo, juego, memoria y vínculo.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Técnicas vocales extendidas, movimiento, teatro, repetición y composición espacial.",
      },
    ],

    aprendizajes: [
      "Explorar la voz antes de escribir texto.",
      "Relacionar sonido y movimiento.",
      "Construir comunidad mediante respiración y ritmo.",
      "Utilizar repetición sin fijar un único significado.",
      "Aceptar lo no verbal como pensamiento.",
    ],

    obras: [
      {
        titulo: "Dolmen Music",
        razon:
          "Voces y cámara construyen un ritual sonoro sin lenguaje narrativo convencional.",
      },
      {
        titulo: "Book of Days",
        razon:
          "Una comunidad medieval imaginada observa enfermedad, tiempo y memoria desde múltiples disciplinas.",
      },
      {
        titulo: "Atlas",
        razon:
          "Viaje, identidad y búsqueda se convierten en una ópera de voces, imágenes y movimiento.",
      },
      {
        titulo: "On Behalf of Nature",
        razon:
          "Cuerpo, voz y ecología construyen una experiencia de interdependencia.",
      },
      {
        titulo: "Songs of Ascension",
        razon:
          "Música, arquitectura y desplazamiento vertical forman una única obra.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Las voces pueden conservar memoria antes incluso de formular un relato completo.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Cada hambre puede poseer respiración, sonido y gesto propios.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La llamada y las voces de los muertos incompletos pueden existir en un territorio anterior a las palabras.",
      },
    ],

    constelacion: [
      "Pina Bausch",
      "Philip Glass",
      "Arvo Pärt",
      "Bill Viola",
      "Moby",
      "Chiharu Shiota",
    ],
  },

  [normalizarNombreCuratorial("Lina Bo Bardi")]: {
    pregunta:
      "¿Puede la arquitectura construir comunidad sin decidir de antemano cómo debe vivir la gente?",

    introduccion:
      "Lina Bo Bardi diseñó museos, centros culturales, casas y mobiliario desde una atención radical a la vida común. Sus espacios aceptan mezcla, improvisación, uso colectivo y transformación. La arquitectura no aparece como monumento distante, sino como estructura disponible.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La arquitectura que excluye, disciplina o convierte la cultura en privilegio.",
      },
      {
        titulo: "La luz",
        texto:
          "El espacio público como lugar de convivencia, apropiación y libertad.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Estructuras directas, reutilización, hormigón, vidrio, cultura popular y espacios abiertos.",
      },
    ],

    aprendizajes: [
      "Diseñar para usos no previstos.",
      "Construir dignidad sin lujo innecesario.",
      "Integrar cultura popular e institución.",
      "Reutilizar edificios sin borrar su historia.",
      "Permitir que una comunidad complete la arquitectura.",
    ],

    obras: [
      {
        titulo: "MASP",
        razon:
          "Un gran volumen suspendido libera el suelo urbano para convertirlo en plaza pública.",
      },
      {
        titulo: "SESC Pompéia",
        razon:
          "Una antigua fábrica se transforma en un centro cultural abierto, lúdico y colectivo.",
      },
      {
        titulo: "Casa de Vidro",
        razon:
          "La vivienda se relaciona con paisaje, estructura moderna y vida cotidiana.",
      },
      {
        titulo: "Teatro Oficina",
        razon:
          "El espacio teatral se convierte en calle interior, rito y participación.",
      },
      {
        titulo: "Solar do Unhão",
        razon:
          "Patrimonio, cultura popular y arquitectura contemporánea se reúnen sin jerarquía rígida.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "El museo de las reliquias debe permitir reunión, memoria y apropiación comunitaria.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Los espacios pueden cuestionar quién accede, quién permanece y quién queda excluido.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Una comunidad residual necesita arquitecturas abiertas capaces de evolucionar con sus habitantes.",
      },
    ],

    constelacion: [
      "Peter Zumthor",
      "Tadao Ando",
      "Joseph Beuys",
      "Isamu Noguchi",
      "Luis Barragán",
      "Doris Salcedo",
    ],
  },

  [normalizarNombreCuratorial("Carlo Scarpa")]: {
    pregunta:
      "¿Cómo puede una intervención nueva entrar en una ruina sin borrar el tiempo que ya contiene?",

    introduccion:
      "Scarpa trabajó con agua, piedra, metal, vidrio, juntas, umbrales y detalles de extraordinaria precisión. Sus edificios no ocultan la historia: construyen conversaciones entre materiales, épocas y recorridos.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La restauración que elimina las cicatrices y convierte la historia en una superficie limpia.",
      },
      {
        titulo: "La luz",
        texto:
          "La posibilidad de añadir una nueva capa sin destruir las anteriores.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Detalle constructivo, agua, piedra, metal, juntas, escalones y secuencias espaciales.",
      },
    ],

    aprendizajes: [
      "Diseñar cada encuentro entre materiales.",
      "Mostrar el paso entre lo antiguo y lo nuevo.",
      "Utilizar el agua como espacio y tiempo.",
      "Construir recorridos mediante pequeñas decisiones.",
      "Aceptar la cicatriz como parte de la belleza.",
    ],

    obras: [
      {
        titulo: "Castelvecchio",
        razon:
          "Museo, ruina y arquitectura contemporánea se articulan mediante detalles y recorridos precisos.",
      },
      {
        titulo: "Cementerio Brion",
        razon:
          "Agua, hormigón, jardín y símbolo construyen una arquitectura de duelo y memoria.",
      },
      {
        titulo: "Fundación Querini Stampalia",
        razon:
          "El agua de Venecia entra en el edificio y se transforma en parte de su experiencia.",
      },
      {
        titulo: "Negozio Olivetti",
        razon:
          "Piedra, madera, mosaico y escalera convierten un pequeño interior en obra total.",
      },
      {
        titulo: "Gipsoteca Canoviana",
        razon:
          "La luz natural reorganiza la percepción de esculturas, cuerpos y espacio.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Las reliquias necesitan una arquitectura que muestre sus cicatrices y distintas temporalidades.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Puertas, juntas, escaleras y umbrales pueden narrar el descenso materialmente.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "El arco, la puerta y el laberinto piden una construcción donde cada unión revele tiempo y transformación.",
      },
    ],

    constelacion: [
      "Peter Zumthor",
      "Tadao Ando",
      "Antoni Tàpies",
      "Isamu Noguchi",
      "Doris Salcedo",
      "Luis Barragán",
    ],
  },

  [normalizarNombreCuratorial("Luis Barragán")]: {
    pregunta:
      "¿Puede una casa proteger el silencio sin aislarse de la luz, el agua y el mundo?",

    introduccion:
      "Barragán creó una arquitectura de muros, patios, color, agua, sombra y recorrido. Sus espacios poseen una intimidad casi espiritual, pero nunca abandonan la materia ni la tradición popular mexicana.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La pérdida de intimidad, misterio y contemplación dentro de la vida moderna.",
      },
      {
        titulo: "La luz",
        texto:
          "La casa como refugio emocional y relación medida con el exterior.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Muros de color, patios, agua, sombra, geometría y secuencias de acceso.",
      },
    ],

    aprendizajes: [
      "Utilizar el color como materia arquitectónica.",
      "Diseñar una llegada gradual.",
      "Construir intimidad mediante muros y aperturas.",
      "Relacionar agua, silencio y luz.",
      "Aprender de la tradición sin copiarla literalmente.",
    ],

    obras: [
      {
        titulo: "Casa Estudio Luis Barragán",
        razon:
          "Vida, trabajo, jardín, color y silencio se integran dentro de una arquitectura íntima.",
      },
      {
        titulo: "Casa Gilardi",
        razon:
          "Una piscina interior y planos de color convierten el recorrido en experiencia luminosa.",
      },
      {
        titulo: "Capilla de las Capuchinas",
        razon:
          "Luz, madera, color y recogimiento construyen una espiritualidad material.",
      },
      {
        titulo: "Cuadra San Cristóbal",
        razon:
          "Muros, agua y caballos producen una composición monumental y serena.",
      },
      {
        titulo: "Torres de Satélite",
        razon:
          "Color y geometría transforman una infraestructura urbana en hito perceptivo.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "El Árbol Blanco podría habitar un patio de luz, agua y silencio que proteja su memoria.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "El color y los umbrales pueden marcar las estaciones emocionales del descenso.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "La puerta de piedra y los espacios de espera necesitan una arquitectura austera, luminosa y ritual.",
      },
    ],

    constelacion: [
      "Lina Bo Bardi",
      "Carlo Scarpa",
      "Tadao Ando",
      "Peter Zumthor",
      "James Turrell",
      "Mark Rothko",
    ],
  },

  [normalizarNombreCuratorial("Josef Koudelka")]: {
    pregunta:
      "¿Cómo puede una fotografía conservar la dignidad de quienes viven en movimiento, exilio o ruina?",

    introduccion:
      "Koudelka ha fotografiado comunidades romaníes, invasiones, fronteras, paisajes devastados y territorios marcados por la historia. Su mirada combina proximidad humana, composición rigurosa y una conciencia constante de desplazamiento.",

    huellas: [
      {
        titulo: "La herida",
        texto:
          "La pérdida de hogar y la transformación del territorio por violencia, frontera y abandono.",
      },
      {
        titulo: "La luz",
        texto:
          "La libertad de mirar desde una posición móvil, sin apropiarse completamente del lugar.",
      },
      {
        titulo: "El lenguaje",
        texto:
          "Blanco y negro, gran angular, composición intensa, movimiento y paisaje panorámico.",
      },
    ],

    aprendizajes: [
      "Trabajar durante años con un territorio o comunidad.",
      "Construir cercanía sin invadir.",
      "Fotografiar la historia mediante el paisaje.",
      "Utilizar el encuadre como tensión.",
      "Aceptar el desplazamiento como forma de mirada.",
    ],

    obras: [
      {
        titulo: "Gypsies",
        razon:
          "Comunidades romaníes aparecen desde intimidad, movimiento, celebración y dureza material.",
      },
      {
        titulo: "Invasion 68: Prague",
        razon:
          "La invasión soviética se registra desde las calles mediante imágenes de urgencia histórica.",
      },
      {
        titulo: "Exiles",
        razon:
          "Desplazamiento, soledad y territorio construyen una autobiografía indirecta.",
      },
      {
        titulo: "Chaos",
        razon:
          "Paisajes industriales y ruinas revelan la transformación violenta del territorio.",
      },
      {
        titulo: "Wall",
        razon:
          "La frontera física se convierte en herida panorámica dentro del paisaje.",
      },
    ],

    triptico: [
      {
        obra: "No dejes que desaparezcamos",
        relacion:
          "Los desplazamientos entre Argelia y España necesitan una mirada capaz de conservar territorio, pérdida y memoria.",
      },
      {
        obra: "La Jerarquía del Hambre",
        relacion:
          "Los cuerpos en tránsito y los espacios degradados pueden documentarse sin convertirlos en espectáculo.",
      },
      {
        obra: "Memorias de Bielka",
        relacion:
          "Bielka es una geografía de exilio donde cada habitante conserva la huella de un territorio perdido.",
      },
    ],

    constelacion: [
      "Sebastião Salgado",
      "Theo Angelopoulos",
      "W. G. Sebald",
      "Mahmoud Darwish",
      "Doris Salcedo",
      "Pedro Costa",
    ],
  },

};

export function obtenerFichaCuratorial(nombre: string) {
  return (
    FICHAS_CURATORIALES[
      normalizarNombreCuratorial(nombre)
    ] ?? null
  );
}
