export type SymbolicHabitat =
  | "deriva"
  | "pulso"
  | "fractura"
  | "espectral"
  | "maquina"
  | "memoria";

export type ImpulseKind =
  | "palabra"
  | "símbolo"
  | "imagen"
  | "materia"
  | "verbo"
  | "tensión";

export type EvidenceState = "documental" | "curatorial" | "experimental";

export type SymbolicSource = {
  id: string;
  shortLabel: string;
  title: string;
  role: string;
};

export type SymbolicImpulse = {
  id: string;
  nucleus: string;
  value: string;
  kind: ImpulseKind;
  habitat: SymbolicHabitat;
  relation: string;
  action: string;
  anatomy: string;
  evidence: EvidenceState;
  confidence: number;
  sourceIds: string[];
  sourceLabels: string[];
  constellation: string;
};

type Orbit = {
  palabra: string[];
  símbolo: string[];
  imagen: string[];
  materia: string[];
  verbo: string[];
  tensión: string[];
};

type SymbolicNode = {
  id: string;
  label: string;
  aliases: string[];
  habitat: SymbolicHabitat;
  evidence: EvidenceState;
  sources: string[];
  orbit: Orbit;
  related: string[];
};

export const SYMBOLIC_SOURCES: SymbolicSource[] = [
  {
    id: "no_dejes",
    shortLabel: "Archivo NDQD",
    title: "No dejes que desaparezcamos · archivo simbólico curado",
    role: "Recurrencias y coapariciones documentadas en el manuscrito.",
  },
  {
    id: "triptico",
    shortLabel: "Tríptico Naveiro",
    title: "La Jerarquía del Hambre · Memorias de Bielka · archivo autoral",
    role: "Constelaciones curatoriales del universo literario del autor.",
  },
  {
    id: "mariposas",
    shortLabel: "Poema Universal",
    title: "Mariposas de polvo · archivo colectivo",
    role: "Memoria de transformación, fragilidad, resto y voz plural.",
  },
  {
    id: "cirlot",
    shortLabel: "Cirlot",
    title: "Diccionario de símbolos · Juan Eduardo Cirlot",
    role: "Memoria simbólica y relaciones morfológicas.",
  },
  {
    id: "chevalier",
    shortLabel: "Chevalier / Gheerbrant",
    title: "Diccionario de los símbolos · Jean Chevalier y Alain Gheerbrant",
    role: "Tradiciones comparadas y ambivalencias simbólicas.",
  },
  {
    id: "bachelard",
    shortLabel: "Bachelard",
    title: "El agua y los sueños · Gaston Bachelard",
    role: "Imaginación material del agua, profundidad, disolución y reflejo.",
  },
  {
    id: "rodari",
    shortLabel: "Rodari",
    title: "Gramática de la fantasía · Gianni Rodari",
    role: "Operaciones combinatorias y encuentros entre palabras distantes.",
  },
  {
    id: "casares",
    shortLabel: "Casares",
    title: "Diccionario ideológico · constelaciones de idea y palabra",
    role: "Navegación de una idea hacia sus vecindades verbales.",
  },
  {
    id: "mitos",
    shortLabel: "Archivo mítico",
    title: "Mitos y leyendas del mundo · archivo de resonancias",
    role: "Figuras de descenso, metamorfosis, umbral, sacrificio y retorno.",
  },
];

const EMPTY_ORBIT: Orbit = {
  palabra: [],
  símbolo: [],
  imagen: [],
  materia: [],
  verbo: [],
  tensión: [],
};

const NODES: SymbolicNode[] = [
  {
    id: "agua",
    label: "Agua",
    aliases: ["agua", "lluvia", "río", "rio", "charco", "fuente", "lágrima", "lagrima"],
    habitat: "deriva",
    evidence: "curatorial",
    sources: ["bachelard", "cirlot", "chevalier", "no_dejes"],
    orbit: {
      palabra: ["orilla", "cauce", "profundidad", "sed", "reflejo"],
      símbolo: ["espejo", "bautismo", "pozo", "estuario"],
      imagen: ["un cuenco oscuro que todavía recuerda la lluvia", "el rostro que el agua deshace sin borrarlo", "una corriente que lleva un nombre hacia otra lengua"],
      materia: ["sal", "limo", "vaho", "hielo"],
      verbo: ["disolver", "filtrar", "erosionar", "sumergir"],
      tensión: ["limpieza / borrado", "superficie / profundidad", "origen / exilio"],
    },
    related: ["mar", "memoria", "cuerpo", "umbral"],
  },
  {
    id: "mar",
    label: "Mar",
    aliases: ["mar", "océano", "oceano", "marea", "ola", "puerto", "naufragio"],
    habitat: "deriva",
    evidence: "curatorial",
    sources: ["bachelard", "chevalier", "no_dejes", "mitos"],
    orbit: {
      palabra: ["horizonte", "deriva", "regreso", "distancia", "abismo"],
      símbolo: ["barca", "isla", "faro", "vientre"],
      imagen: ["una frontera que respira", "la costa vista por quien ya no puede volver", "un faro encendido dentro de una boca cerrada"],
      materia: ["sal", "espuma", "alga", "óxido"],
      verbo: ["cruzar", "devolver", "hundir", "desorientar"],
      tensión: ["salida / pérdida", "cuna / sepultura", "movimiento / permanencia"],
    },
    related: ["agua", "camino", "voz", "muerte"],
  },
  {
    id: "arbol",
    label: "Árbol",
    aliases: ["árbol", "arbol", "raíz", "raiz", "rama", "hoja", "bosque", "tronco", "semilla"],
    habitat: "memoria",
    evidence: "documental",
    sources: ["no_dejes", "cirlot", "chevalier"],
    orbit: {
      palabra: ["corteza", "anillo", "savia", "copa", "testigo"],
      símbolo: ["eje", "genealogía", "tumba", "árbol blanco"],
      imagen: ["una hoja que sobrevive dentro de un cuaderno", "raíces aprendiendo la forma de una ausencia", "un árbol que da sombra también a sus muertos"],
      materia: ["madera", "resina", "ceniza", "tierra"],
      verbo: ["arraigar", "arder", "bifurcar", "guardar"],
      tensión: ["vida / tumba", "organismo / archivo", "centro / exilio"],
    },
    related: ["memoria", "fuego", "tierra", "muerte"],
  },
  {
    id: "fuego",
    label: "Fuego",
    aliases: ["fuego", "llama", "incendio", "arder", "humo", "ceniza", "quemar"],
    habitat: "fractura",
    evidence: "documental",
    sources: ["no_dejes", "cirlot", "chevalier", "mitos"],
    orbit: {
      palabra: ["combustión", "rescoldo", "fulgor", "costra", "resto"],
      símbolo: ["sacrificio", "hogar", "purga", "señal"],
      imagen: ["una luz que destruye aquello que permite ver", "ceniza pegada a la memoria como una segunda piel", "el incendio pronunciando lo que nadie escribió"],
      materia: ["carbón", "hollín", "cera", "madera"],
      verbo: ["consumir", "ennegrecer", "cauterizar", "sobrevivir"],
      tensión: ["destrucción / transformación", "calor / muerte", "memoria / borrado"],
    },
    related: ["arbol", "cuerpo", "memoria", "casa"],
  },
  {
    id: "mano",
    label: "Mano",
    aliases: ["mano", "dedo", "dedos", "palma", "puño", "muñeca", "muneca", "tacto", "tocar"],
    habitat: "pulso",
    evidence: "documental",
    sources: ["no_dejes", "cirlot", "casares"],
    orbit: {
      palabra: ["contacto", "gesto", "huella", "entrega", "oficio"],
      símbolo: ["don", "juramento", "herramienta", "escritura"],
      imagen: ["una mano cerrada alrededor de algo que ya no existe", "dos manos separadas por el grosor de una página", "la palma conservando el frío de otra persona"],
      materia: ["piel", "tinta", "tierra", "cicatriz"],
      verbo: ["tender", "cavar", "cubrir", "soltar"],
      tensión: ["cuidado / violencia", "dar / retener", "tocar / perder"],
    },
    related: ["cuerpo", "memoria", "tierra", "voz"],
  },
  {
    id: "cuerpo",
    label: "Cuerpo",
    aliases: ["cuerpo", "carne", "piel", "sangre", "herida", "hueso", "boca", "corazón", "corazon"],
    habitat: "pulso",
    evidence: "documental",
    sources: ["no_dejes", "triptico", "cirlot", "chevalier"],
    orbit: {
      palabra: ["cicatriz", "latido", "temperatura", "postura", "respiración"],
      símbolo: ["vasija", "territorio", "prueba", "doble"],
      imagen: ["una herida que aprende a escribir", "el cuerpo usado como último documento", "un latido escondido bajo la lengua"],
      materia: ["piel", "sangre", "hueso", "venda"],
      verbo: ["sangrar", "respirar", "cerrar", "recordar"],
      tensión: ["cuerpo / documento", "cuidado / violencia", "cierre / persistencia"],
    },
    related: ["mano", "hambre", "muerte", "animal"],
  },
  {
    id: "hambre",
    label: "Hambre",
    aliases: ["hambre", "sed", "comer", "alimento", "pan", "vacío", "vacio", "ayuno"],
    habitat: "pulso",
    evidence: "curatorial",
    sources: ["triptico", "casares", "mitos"],
    orbit: {
      palabra: ["carencia", "mandíbula", "jerarquía", "miga", "deseo"],
      símbolo: ["mesa vacía", "boca", "animal", "descenso"],
      imagen: ["una mesa que decide quién merece tener cuerpo", "el estómago como campana de una ciudad subterránea", "una miga custodiada como si fuera un reino"],
      materia: ["pan", "saliva", "harina", "hueso"],
      verbo: ["devorar", "repartir", "roer", "negar"],
      tensión: ["necesidad / poder", "alimento / obediencia", "vacío / deseo"],
    },
    related: ["cuerpo", "animal", "ciudad", "muerte"],
  },
  {
    id: "memoria",
    label: "Memoria",
    aliases: ["memoria", "recuerdo", "olvido", "archivo", "cuaderno", "libro", "nombre", "tinta", "escribir"],
    habitat: "memoria",
    evidence: "documental",
    sources: ["no_dejes", "triptico", "mariposas", "casares"],
    orbit: {
      palabra: ["resto", "fecha", "margen", "tachadura", "testimonio"],
      símbolo: ["cuaderno", "reliquia", "cicatriz", "archivo"],
      imagen: ["una fecha que sangra a través del papel", "el margen guardando aquello que el relato expulsó", "un nombre envuelto para que atraviese la frontera"],
      materia: ["papel", "tinta", "polvo", "hilo"],
      verbo: ["fijar", "tachar", "envolver", "transportar"],
      tensión: ["memoria / invención", "prueba / relato", "nombre / desaparición"],
    },
    related: ["voz", "arbol", "mano", "tiempo"],
  },
  {
    id: "umbral",
    label: "Umbral",
    aliases: ["umbral", "puerta", "llave", "cerradura", "ventana", "frontera", "entrada", "salida"],
    habitat: "memoria",
    evidence: "documental",
    sources: ["no_dejes", "triptico", "cirlot", "mitos"],
    orbit: {
      palabra: ["límite", "pasaje", "acceso", "fuera", "regreso"],
      símbolo: ["llave", "guardián", "arco", "laberinto"],
      imagen: ["una puerta que recuerda a quien la atravesó", "la llave de una casa que ya no existe", "un arco de piedra abierto hacia la misma oscuridad"],
      materia: ["piedra", "hierro", "madera", "polvo"],
      verbo: ["atravesar", "cerrar", "custodiar", "pertenecer"],
      tensión: ["refugio / trampa", "dentro / fuera", "acceso / pérdida"],
    },
    related: ["casa", "laberinto", "camino", "muerte"],
  },
  {
    id: "casa",
    label: "Casa",
    aliases: ["casa", "habitación", "habitacion", "hogar", "techo", "pared", "jardín", "jardin", "universidad"],
    habitat: "memoria",
    evidence: "documental",
    sources: ["no_dejes", "cirlot", "chevalier"],
    orbit: {
      palabra: ["refugio", "corredor", "centro", "intimidad", "ruina"],
      símbolo: ["vientre", "institución", "fortaleza", "cuerpo colectivo"],
      imagen: ["una casa que conserva el calor de sus desaparecidos", "paredes levantadas para esconder una comunidad", "un jardín respirando antes del incendio"],
      materia: ["cal", "madera", "yeso", "cristal"],
      verbo: ["habitar", "proteger", "abandonar", "reparar"],
      tensión: ["refugio / objetivo", "común / privado", "casa / institución"],
    },
    related: ["umbral", "arbol", "fuego", "ciudad"],
  },
  {
    id: "camino",
    label: "Camino",
    aliases: ["camino", "carretera", "viaje", "viajar", "ruta", "cuneta", "exilio", "huida", "frontera"],
    habitat: "deriva",
    evidence: "documental",
    sources: ["no_dejes", "triptico", "cirlot", "mitos"],
    orbit: {
      palabra: ["trayecto", "desvío", "huella", "retorno", "pérdida"],
      símbolo: ["peregrinación", "laberinto", "puente", "encrucijada"],
      imagen: ["una carretera que termina debajo de la memoria", "huellas caminando cuando el cuerpo ya se ha detenido", "la frontera doblada dentro de un bolsillo"],
      materia: ["grava", "polvo", "barro", "asfalto"],
      verbo: ["cruzar", "arrastrarse", "desviarse", "desaparecer"],
      tensión: ["movimiento / inmovilidad", "ruta / emboscada", "salida / pérdida"],
    },
    related: ["umbral", "tierra", "mar", "exilio"],
  },
  {
    id: "voz",
    label: "Voz",
    aliases: ["voz", "silencio", "radio", "oír", "oir", "escuchar", "grito", "canción", "cancion"],
    habitat: "espectral",
    evidence: "documental",
    sources: ["no_dejes", "mariposas", "casares"],
    orbit: {
      palabra: ["eco", "zumbido", "nombre", "señal", "susurro"],
      símbolo: ["radio", "campana", "coro", "fantasma"],
      imagen: ["una voz llegando después de la persona", "el silencio encendido como una radio sin emisora", "cincuenta gargantas compartiendo una sola mariposa"],
      materia: ["aire", "cinta", "estática", "aliento"],
      verbo: ["nombrar", "interrumpir", "resonar", "callar"],
      tensión: ["voz / ausencia", "señal / ruido", "público / íntimo"],
    },
    related: ["memoria", "silencio", "aire", "muerte"],
  },
  {
    id: "muerte",
    label: "Muerte",
    aliases: ["muerte", "morir", "muerto", "muerta", "cadáver", "cadaver", "tumba", "duelo", "desaparición", "desaparicion"],
    habitat: "espectral",
    evidence: "curatorial",
    sources: ["no_dejes", "triptico", "cirlot", "chevalier", "mitos"],
    orbit: {
      palabra: ["ausencia", "tránsito", "resto", "duelo", "vigilia"],
      símbolo: ["umbral", "sombra", "tumba", "barca"],
      imagen: ["una habitación que sigue esperando a su cuerpo", "la muerte aprendiendo el nombre de cada objeto", "un reloj detenido que todavía da calor"],
      materia: ["polvo", "hueso", "tierra", "cera"],
      verbo: ["cesar", "velar", "enterrar", "permanecer"],
      tensión: ["presencia / ausencia", "cuerpo / resto", "final / transmisión"],
    },
    related: ["memoria", "umbral", "cuerpo", "tiempo"],
  },
  {
    id: "tiempo",
    label: "Tiempo",
    aliases: ["tiempo", "reloj", "hora", "día", "dia", "noche", "ayer", "mañana", "manana", "siglo"],
    habitat: "maquina",
    evidence: "curatorial",
    sources: ["no_dejes", "cirlot", "chevalier", "casares"],
    orbit: {
      palabra: ["duración", "ciclo", "instante", "demora", "edad"],
      símbolo: ["reloj", "rueda", "anillo", "calendario"],
      imagen: ["un reloj al que alguien da cuerda para recordar", "la misma hora envejeciendo en habitaciones distintas", "el futuro escrito con una tinta anterior"],
      materia: ["óxido", "arena", "cera", "papel"],
      verbo: ["demorar", "repetir", "erosionar", "madurar"],
      tensión: ["instante / duración", "repetición / cambio", "historia / experiencia"],
    },
    related: ["memoria", "muerte", "maquina", "arbol"],
  },
  {
    id: "tierra",
    label: "Tierra",
    aliases: ["tierra", "suelo", "barro", "polvo", "piedra", "montaña", "montana", "campo"],
    habitat: "memoria",
    evidence: "curatorial",
    sources: ["no_dejes", "cirlot", "chevalier", "mitos"],
    orbit: {
      palabra: ["peso", "origen", "sepultura", "territorio", "surco"],
      símbolo: ["madre", "tumba", "montaña", "fundamento"],
      imagen: ["tierra acumulada bajo las uñas del recuerdo", "una piedra que guarda la temperatura de una frontera", "el país convertido en polvo dentro del zapato"],
      materia: ["arcilla", "grava", "humus", "sal"],
      verbo: ["enterrar", "sostener", "agrietar", "germinar"],
      tensión: ["origen / propiedad", "fertilidad / sepultura", "peso / pertenencia"],
    },
    related: ["arbol", "camino", "cuerpo", "madre"],
  },
  {
    id: "laberinto",
    label: "Laberinto",
    aliases: ["laberinto", "minotauro", "pasillo", "corredor", "centro", "perderse", "mapa"],
    habitat: "fractura",
    evidence: "curatorial",
    sources: ["triptico", "cirlot", "mitos"],
    orbit: {
      palabra: ["desvío", "centro", "marca", "retorno", "secreto"],
      símbolo: ["minotauro", "hilo", "puerta de piedra", "mapa"],
      imagen: ["un mapa que cambia después de ser leído", "el monstruo esperando fuera del centro", "un hilo atado a alguien que todavía no ha entrado"],
      materia: ["piedra", "hilo", "carbón", "cal"],
      verbo: ["desorientar", "marcar", "regresar", "custodiar"],
      tensión: ["centro / frontera", "monstruo / guía", "entrada / reentrada"],
    },
    related: ["umbral", "animal", "ciudad", "memoria"],
  },
  {
    id: "animal",
    label: "Animal",
    aliases: ["animal", "perro", "lobo", "pájaro", "pajaro", "bestia", "minotauro", "insecto"],
    habitat: "pulso",
    evidence: "curatorial",
    sources: ["triptico", "cirlot", "chevalier", "mitos"],
    orbit: {
      palabra: ["instinto", "guardián", "olfato", "manada", "rastro"],
      símbolo: ["guía", "doble", "sacrificio", "monstruo"],
      imagen: ["un perro blanco escuchando una puerta cerrada", "el animal que conoce el camino pero no puede explicarlo", "un monstruo protegiendo aquello que todos temen"],
      materia: ["pelo", "hueso", "saliva", "barro"],
      verbo: ["rastrear", "vigilar", "guiar", "sacrificarse"],
      tensión: ["instinto / lenguaje", "guía / víctima", "bestia / parentesco"],
    },
    related: ["laberinto", "hambre", "cuerpo", "umbral"],
  },
  {
    id: "ciudad",
    label: "Ciudad",
    aliases: ["ciudad", "calle", "edificio", "metro", "barrio", "plaza", "Barcelona", "bielka"],
    habitat: "maquina",
    evidence: "curatorial",
    sources: ["triptico", "casares"],
    orbit: {
      palabra: ["multitud", "subsuelo", "tránsito", "ruina", "sistema"],
      símbolo: ["cuerpo colectivo", "máquina", "laberinto", "colmena"],
      imagen: ["una ciudad creciendo debajo de sus propios nombres", "el metro descendiendo hacia una hambre anterior", "ventanas encendidas como órganos que no se conocen"],
      materia: ["hormigón", "hierro", "vidrio", "asfalto"],
      verbo: ["circular", "acumular", "expulsar", "ocultar"],
      tensión: ["multitud / soledad", "superficie / subsuelo", "refugio / sistema"],
    },
    related: ["laberinto", "hambre", "casa", "maquina"],
  },
  {
    id: "mariposa",
    label: "Mariposa",
    aliases: ["mariposa", "ala", "alas", "polilla", "metamorfosis", "polvo"],
    habitat: "espectral",
    evidence: "curatorial",
    sources: ["mariposas", "cirlot", "chevalier"],
    orbit: {
      palabra: ["crisálida", "fragilidad", "mutación", "vuelo", "resto"],
      símbolo: ["alma", "metamorfosis", "mensaje", "duración breve"],
      imagen: ["una mariposa hecha con el polvo de cincuenta voces", "alas que solo aparecen cuando la palabra se rompe", "una crisálida colgada dentro de una frase"],
      materia: ["polvo", "seda", "escama", "aire"],
      verbo: ["mudar", "emerger", "posarse", "desintegrarse"],
      tensión: ["fragilidad / viaje", "cuerpo / transformación", "instante / memoria"],
    },
    related: ["voz", "aire", "memoria", "muerte"],
  },
  {
    id: "sombra",
    label: "Sombra",
    aliases: ["sombra", "oscuridad", "noche", "negro", "fantasma", "espectro", "doble"],
    habitat: "espectral",
    evidence: "curatorial",
    sources: ["cirlot", "chevalier", "mitos", "triptico"],
    orbit: {
      palabra: ["doble", "contorno", "oculto", "resto", "umbral"],
      símbolo: ["fantasma", "reverso", "inconsciente", "compañero"],
      imagen: ["una sombra que llega antes que su cuerpo", "el reverso oscuro de una palabra blanca", "dos siluetas compartiendo una sola ausencia"],
      materia: ["hollín", "tinta", "humo", "terciopelo"],
      verbo: ["ocultar", "duplicar", "seguir", "proyectar"],
      tensión: ["presencia / doble", "luz / ocultación", "compañía / amenaza"],
    },
    related: ["muerte", "memoria", "luz", "cuerpo"],
  },
  {
    id: "luz",
    label: "Luz",
    aliases: ["luz", "blanco", "brillo", "sol", "lámpara", "lampara", "estrella", "amanecer"],
    habitat: "espectral",
    evidence: "curatorial",
    sources: ["triptico", "cirlot", "chevalier", "mitos"],
    orbit: {
      palabra: ["fulgor", "revelación", "palidez", "guía", "vigilia"],
      símbolo: ["estrella", "aureola", "faro", "blanco"],
      imagen: ["una luz respirando después del último cuerpo", "el blanco usado como herida y no como pureza", "un faro que ilumina hacia dentro"],
      materia: ["cal", "cera", "fósforo", "cristal"],
      verbo: ["revelar", "cegar", "velar", "persistir"],
      tensión: ["revelación / ceguera", "pureza / herida", "guía / exposición"],
    },
    related: ["sombra", "fuego", "animal", "arbol"],
  },
  {
    id: "silencio",
    label: "Silencio",
    aliases: ["silencio", "callar", "mudo", "muda", "quietud", "secreto", "pausa"],
    habitat: "espectral",
    evidence: "curatorial",
    sources: ["no_dejes", "mariposas", "casares"],
    orbit: {
      palabra: ["pausa", "vacío", "espera", "secreto", "escucha"],
      símbolo: ["habitación vacía", "radio apagada", "boca cerrada", "nieve"],
      imagen: ["el silencio encendido entre dos nombres", "una radio que transmite solamente la espera", "la frase dejando un lugar para quien falta"],
      materia: ["aire", "nieve", "fieltro", "polvo"],
      verbo: ["suspender", "escuchar", "contener", "interrumpir"],
      tensión: ["ausencia / escucha", "secreto / protección", "vacío / presencia"],
    },
    related: ["voz", "muerte", "memoria", "sombra"],
  },
  {
    id: "aire",
    label: "Aire",
    aliases: ["aire", "viento", "aliento", "respirar", "nube", "cielo", "humo"],
    habitat: "deriva",
    evidence: "curatorial",
    sources: ["cirlot", "chevalier", "mariposas"],
    orbit: {
      palabra: ["aliento", "altura", "deriva", "invisible", "atmósfera"],
      símbolo: ["espíritu", "vuelo", "mensaje", "vacío fértil"],
      imagen: ["una palabra sostenida únicamente por el aliento", "el viento hojeando un libro enterrado", "aire atrapado dentro de una llave"],
      materia: ["vaho", "humo", "polen", "polvo"],
      verbo: ["soplar", "dispersar", "elevar", "atravesar"],
      tensión: ["presencia / invisibilidad", "vuelo / dispersión", "aliento / desaparición"],
    },
    related: ["voz", "mariposa", "fuego", "agua"],
  },
  {
    id: "maquina",
    label: "Máquina",
    aliases: ["máquina", "maquina", "motor", "metal", "código", "codigo", "engranaje", "tecnología", "tecnologia"],
    habitat: "maquina",
    evidence: "experimental",
    sources: ["casares", "rodari", "triptico"],
    orbit: {
      palabra: ["ritmo", "repetición", "precisión", "fallo", "sistema"],
      símbolo: ["reloj", "autómata", "laberinto", "organismo artificial"],
      imagen: ["una máquina aprendiendo a olvidar", "engranajes cubiertos por una piel muy fina", "un error que late dentro del código"],
      materia: ["hierro", "cobre", "aceite", "vidrio"],
      verbo: ["repetir", "procesar", "desajustar", "incubar"],
      tensión: ["precisión / accidente", "sistema / cuerpo", "repetición / mutación"],
    },
    related: ["tiempo", "ciudad", "cuerpo", "memoria"],
  },
  {
    id: "exilio",
    label: "Exilio",
    aliases: ["exilio", "destierro", "extranjero", "extranjera", "país", "pais", "patria", "frontera", "huir"],
    habitat: "deriva",
    evidence: "documental",
    sources: ["no_dejes", "triptico", "mariposas"],
    orbit: {
      palabra: ["distancia", "acento", "retorno", "pertenencia", "maleta"],
      símbolo: ["frontera", "puerto", "llave inútil", "nombre traducido"],
      imagen: ["la llave de una casa guardada en otro país", "un nombre pronunciado con la sal de otra costa", "la patria reducida al peso de una hoja"],
      materia: ["sal", "papel", "polvo", "tela"],
      verbo: ["partir", "traducir", "transportar", "volver"],
      tensión: ["origen / pertenencia", "salida / pérdida", "regreso / imposibilidad"],
    },
    related: ["camino", "mar", "memoria", "casa"],
  },
  {
    id: "madre",
    label: "Madre",
    aliases: ["madre", "mamá", "mama", "materno", "materna", "vientre", "familia"],
    habitat: "pulso",
    evidence: "curatorial",
    sources: ["chevalier", "mitos", "casares"],
    orbit: {
      palabra: ["origen", "cuidado", "linaje", "leche", "separación"],
      símbolo: ["tierra", "casa", "vientre", "luna"],
      imagen: ["una casa recordando el interior de un cuerpo", "la tierra pronunciada como un parentesco", "un hilo de leche atravesando una frontera"],
      materia: ["leche", "tierra", "tela", "agua"],
      verbo: ["gestar", "alimentar", "separar", "proteger"],
      tensión: ["origen / separación", "cuidado / pérdida", "cuerpo / territorio"],
    },
    related: ["tierra", "casa", "agua", "cuerpo"],
  },
];

const SOURCE_BY_ID = new Map(SYMBOLIC_SOURCES.map((source) => [source.id, source]));
const NODE_BY_ID = new Map(NODES.map((node) => [node.id, node]));

const KIND_ORDER: ImpulseKind[] = [
  "palabra",
  "símbolo",
  "materia",
  "verbo",
  "imagen",
  "tensión",
];

function normalize(value: string): string {
  return value
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zñ0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stableHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

function nodeVocabulary(node: SymbolicNode): string[] {
  return unique([
    node.label,
    ...node.aliases,
    ...node.orbit.palabra,
    ...node.orbit.símbolo,
    ...node.orbit.materia,
    ...node.orbit.verbo,
  ]).map(normalize);
}

function scoreNode(input: string, node: SymbolicNode): number {
  const normalized = normalize(input);
  if (!normalized) return 0;
  const words = normalized.split(" ");
  const vocabulary = nodeVocabulary(node);
  let score = 0;

  for (const item of vocabulary) {
    if (normalized === item) score = Math.max(score, 100);
    else if (words.includes(item)) score = Math.max(score, 82);
    else if (item.length > 4 && normalized.includes(item)) score = Math.max(score, 62);
  }

  return score;
}

function resolveNode(input: string): { node: SymbolicNode; direct: boolean } {
  const ranked = NODES
    .map((node) => ({ node, score: scoreNode(input, node) }))
    .sort((a, b) => b.score - a.score);

  if (ranked[0]?.score > 0) {
    return { node: ranked[0].node, direct: ranked[0].score >= 82 };
  }

  return {
    node: NODES[stableHash(normalize(input) || "embrion") % NODES.length],
    direct: false,
  };
}

function actionFor(kind: ImpulseKind, nucleus: string, value: string): string {
  const actions: Record<ImpulseKind, string> = {
    palabra: `Acerca «${value}» a «${nucleus}» y escucha qué temperatura aparece entre ambas.`,
    símbolo: `Haz que ${value.toLocaleLowerCase("es")} actúe en el texto sin explicar lo que significa.`,
    imagen: `No la describas entera: deja que un único detalle de esta imagen contamine la frase.`,
    materia: `Sustituye durante una línea lo abstracto por ${value.toLocaleLowerCase("es")}.`,
    verbo: `Obliga a «${nucleus}» a ${value}; observa si cambia de naturaleza.`,
    tensión: `Mantén «${value}» abierto. No resuelvas todavía ninguno de sus dos polos.`,
  };
  return actions[kind];
}

function impulseFrom(
  nucleus: string,
  node: SymbolicNode,
  kind: ImpulseKind,
  value: string,
  direct: boolean,
  index: number,
): SymbolicImpulse {
  const evidence: EvidenceState = direct ? node.evidence : "experimental";
  const sourceIds = unique([
    ...node.sources.slice(0, direct ? 3 : 2),
    ...(direct ? ["casares"] : ["rodari", "casares"]),
  ]);
  const relation = direct
    ? kind === "tensión"
      ? "polaridad simbólica"
      : kind === "materia"
        ? "imaginación material"
        : "órbita simbólica"
    : "asociación oblicua";
  const sourceLabels = sourceIds
    .map((id) => SOURCE_BY_ID.get(id)?.shortLabel)
    .filter((label): label is string => Boolean(label));

  return {
    id: `${normalize(nucleus).replace(/\s+/g, "-") || "nucleo"}-${node.id}-${kind}-${index}`,
    nucleus,
    value,
    kind,
    habitat: node.habitat,
    relation,
    action: actionFor(kind, nucleus, value),
    anatomy: direct
      ? `«${nucleus}» activa la constelación ${node.label}. «${value}» pertenece a su órbita de ${kind}; la relación procede de una síntesis curatorial, no de una equivalencia definitiva.`
      : `No existe todavía una entrada documental exacta para «${nucleus}». Embrión la aproxima a ${node.label} y ensaya «${value}» como choque fértil. Esta conexión debe leerse como experimental.`,
    evidence,
    confidence: direct
      ? evidence === "documental"
        ? 0.91
        : evidence === "curatorial"
          ? 0.76
          : 0.58
      : 0.42,
    sourceIds,
    sourceLabels,
    constellation: node.label,
  };
}

export function extractWritingWords(text: string): string[] {
  const words = text.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:['’-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*/g) ?? [];
  const seen = new Set<string>();
  const result: string[] = [];

  for (const word of words) {
    const key = normalize(word);
    if (key.length < 2 || seen.has(key)) continue;
    seen.add(key);
    result.push(word);
  }

  return result.slice(-18);
}

export function buildSymbolicImpulses(
  nucleusInput: string,
  contextText = "",
): SymbolicImpulse[] {
  const nucleus = nucleusInput.trim();
  if (!nucleus) return [];

  const resolved = resolveNode(nucleus);
  const contextNodes = extractWritingWords(contextText)
    .filter((word) => normalize(word) !== normalize(nucleus))
    .map((word) => resolveNode(word))
    .filter((item) => item.direct)
    .map((item) => item.node);
  const relatedNodes = resolved.node.related
    .map((id) => NODE_BY_ID.get(id))
    .filter((node): node is SymbolicNode => Boolean(node));
  const satellite = contextNodes[0] ?? relatedNodes[stableHash(nucleus) % Math.max(1, relatedNodes.length)] ?? resolved.node;
  const candidates: SymbolicImpulse[] = [];

  KIND_ORDER.forEach((kind, kindIndex) => {
    const values = resolved.node.orbit[kind].length
      ? resolved.node.orbit[kind]
      : EMPTY_ORBIT[kind];
    values.forEach((value, valueIndex) => {
      candidates.push(
        impulseFrom(
          nucleus,
          resolved.node,
          kind,
          value,
          resolved.direct,
          kindIndex * 20 + valueIndex,
        ),
      );
    });
  });

  const satelliteKinds: ImpulseKind[] = ["palabra", "símbolo", "materia", "imagen"];
  satelliteKinds.forEach((kind, kindIndex) => {
    satellite.orbit[kind].slice(0, 2).forEach((value, valueIndex) => {
      const impulse = impulseFrom(
        nucleus,
        satellite,
        kind,
        value,
        false,
        200 + kindIndex * 10 + valueIndex,
      );
      candidates.push({
        ...impulse,
        relation: contextNodes.includes(satellite)
          ? "resonancia con el texto"
          : "constelación vecina",
        anatomy: contextNodes.includes(satellite)
          ? `Otra palabra escrita ha activado ${satellite.label}. Embrión propone «${value}» como puente entre ambas zonas del texto.`
          : `${resolved.node.label} mantiene una relación curatorial con ${satellite.label}. «${value}» llega desde esa constelación vecina y no como sinónimo de «${nucleus}».`,
      });
    });
  });

  const collisionNode = NODES[
    (stableHash(`${nucleus}:${contextText}:colision`) + 7) % NODES.length
  ];
  const collisionValue = collisionNode.orbit.imagen[
    stableHash(nucleus) % collisionNode.orbit.imagen.length
  ];
  const collision = impulseFrom(
    nucleus,
    collisionNode,
    "imagen",
    collisionValue,
    false,
    999,
  );
  candidates.push({
    ...collision,
    relation: "binomio fantástico",
    anatomy: `Rodari permite unir dos zonas deliberadamente distantes. Embrión hace colisionar «${nucleus}» con ${collisionNode.label}; no afirma una tradición simbólica, abre una posibilidad de escritura.`,
    sourceIds: ["rodari", "casares"],
    sourceLabels: ["Rodari", "Casares"],
    confidence: 0.31,
  });

  const uniqueByValue = new Map<string, SymbolicImpulse>();
  for (const candidate of candidates) {
    const key = normalize(candidate.value);
    if (!uniqueByValue.has(key)) uniqueByValue.set(key, candidate);
  }

  return [...uniqueByValue.values()]
    .sort(
      (a, b) =>
        stableHash(`${nucleus}:${a.value}`) - stableHash(`${nucleus}:${b.value}`),
    )
    .slice(0, 24);
}

export function symbolicSourceDetails(sourceIds: string[]): SymbolicSource[] {
  return sourceIds
    .map((id) => SOURCE_BY_ID.get(id))
    .filter((source): source is SymbolicSource => Boolean(source));
}

