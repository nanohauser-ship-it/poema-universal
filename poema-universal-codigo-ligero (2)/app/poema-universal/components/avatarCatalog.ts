export type AvatarInfo = {
  id: number;
  code: string;
  title: string;
  presence: string;
  gesture: string;
  description: string;
};

const rawAvatars: Array<
  [
    title: string,
    presence: string,
    gesture: string,
    description: string,
  ]
> = [
  [
    "La guardiana del umbral",
    "Serenidad",
    "Espera sin retroceder",
    "Una presencia que protege el paso entre lo conocido y aquello que todavía no tiene nombre.",
  ],
  [
    "El escriba de la lluvia",
    "Escucha",
    "Inclina la mirada",
    "Parece escuchar cada palabra antes de permitir que llegue al papel.",
  ],
  [
    "La memoria de las manos",
    "Cuidado",
    "Sostiene lo frágil",
    "Sus manos representan todo aquello que una comunidad aprende a conservar.",
  ],
  [
    "El caminante del alba",
    "Movimiento",
    "Avanza lentamente",
    "Una figura que continúa caminando incluso cuando el camino todavía permanece oscuro.",
  ],
  [
    "La custodia de la ceniza",
    "Persistencia",
    "Protege un resto",
    "Guarda aquello que sobrevivió al fuego y todavía puede volver a convertirse en memoria.",
  ],
  [
    "El cartógrafo del silencio",
    "Observación",
    "Mide la distancia",
    "No dibuja territorios visibles, sino los espacios que existen entre una voz y otra.",
  ],
  [
    "La voz del hilo rojo",
    "Vínculo",
    "Une dos extremos",
    "Representa las relaciones invisibles que atraviesan países, edades y lenguas.",
  ],
  [
    "El testigo de las mareas",
    "Paciencia",
    "Contempla el regreso",
    "Sabe que algunas cosas desaparecen únicamente para volver transformadas.",
  ],
  [
    "La mujer de la lámpara",
    "Orientación",
    "Alumbra hacia abajo",
    "No ofrece una luz total, sino la claridad necesaria para continuar un paso más.",
  ],
  [
    "El hombre del cuaderno azul",
    "Recuerdo",
    "Escribe en secreto",
    "Conserva en un pequeño cuaderno aquello que el mundo consideró demasiado pequeño para recordar.",
  ],
  [
    "La hija del polvo dorado",
    "Transformación",
    "Recoge partículas",
    "Encuentra valor en los restos y devuelve dignidad a lo que parecía perdido.",
  ],
  [
    "El guardián de las semillas",
    "Futuro",
    "Cierra las manos",
    "Protege vidas diminutas que todavía no han encontrado la tierra donde crecer.",
  ],
  [
    "La cantora del invierno",
    "Resistencia",
    "Respira antes de cantar",
    "Su voz nace cuando todo alrededor parece inmóvil, frío y aparentemente vacío.",
  ],
  [
    "El mensajero del puente",
    "Tránsito",
    "Mira ambas orillas",
    "Existe para llevar una palabra desde un lugar que ya no puede permanecer aislado.",
  ],
  [
    "La mujer de los nombres",
    "Identidad",
    "Pronuncia despacio",
    "Recuerda que nombrar a alguien es también impedir que desaparezca.",
  ],
  [
    "El huésped de la niebla",
    "Misterio",
    "Permanece a medias",
    "Una presencia que nunca termina de revelarse y, precisamente por eso, invita a acercarse.",
  ],
  [
    "La tejedora de ausencias",
    "Reparación",
    "Cruza los hilos",
    "Construye una forma nueva con los espacios que dejaron quienes ya no están.",
  ],
  [
    "El observador del fuego",
    "Conciencia",
    "No aparta la mirada",
    "Contempla la destrucción para comprender qué merece ser salvado.",
  ],
  [
    "La voz de la ventana",
    "Apertura",
    "Mira hacia fuera",
    "Representa el instante en que una vida descubre que existe un mundo más allá de su habitación.",
  ],
  [
    "El portador de la llave",
    "Acceso",
    "Ofrece sin imponer",
    "Lleva una llave cuya puerta solo puede ser elegida por quien la recibe.",
  ],
  [
    "La mujer del jardín seco",
    "Espera",
    "Toca una rama",
    "Reconoce la vida incluso cuando todavía no existe ninguna señal visible de su regreso.",
  ],
  [
    "El hombre de las campanas",
    "Llamada",
    "Escucha la vibración",
    "Su presencia anuncia que una nueva voz acaba de entrar en el archivo.",
  ],
  [
    "La viajera de los bordes",
    "Libertad",
    "Camina fuera del centro",
    "Habita las fronteras porque sabe que allí se mezclan las lenguas y comienzan otras formas.",
  ],
  [
    "El custodio de la sal",
    "Conservación",
    "Guarda una pequeña cantidad",
    "Protege una materia humilde que preserva los alimentos, las lágrimas y la memoria del mar.",
  ],
  [
    "La figura del pañuelo blanco",
    "Despedida",
    "Sostiene un gesto",
    "Permanece en el instante exacto en que alguien se marcha y todavía puede mirar hacia atrás.",
  ],
  [
    "El lector de las sombras",
    "Interpretación",
    "Busca una forma",
    "Encuentra relatos en aquello que los demás confunden con oscuridad.",
  ],
  [
    "La mujer del espejo roto",
    "Reconstrucción",
    "Acepta el fragmento",
    "No intenta recuperar una imagen perfecta, sino comprender todas sus partes.",
  ],
  [
    "El niño del mapa incompleto",
    "Curiosidad",
    "Señala un espacio vacío",
    "Observa las zonas sin dibujar como una invitación y no como una carencia.",
  ],
  [
    "La guardiana de los pájaros",
    "Libertad",
    "Abre las manos",
    "Cuida aquello que solo puede permanecer vivo mientras conserva la posibilidad de marcharse.",
  ],
  [
    "El hombre del hilo oscuro",
    "Continuidad",
    "Sigue una hebra",
    "Avanza guiado por una conexión casi invisible que nunca termina de romperse.",
  ],
  [
    "La presencia de la montaña",
    "Firmeza",
    "Permanece inmóvil",
    "No necesita imponerse: su fuerza procede del tiempo que ha conseguido resistir.",
  ],
  [
    "El recolector de ecos",
    "Memoria sonora",
    "Acerca el oído",
    "Recoge las últimas vibraciones de las voces antes de que el silencio las absorba.",
  ],
  [
    "La mujer de la tinta",
    "Escritura",
    "Mancha sus dedos",
    "Acepta que toda palabra verdadera deja una huella también sobre quien la escribe.",
  ],
  [
    "El testigo del desierto",
    "Soledad",
    "Mira el horizonte",
    "Conserva la orientación en un espacio donde todas las direcciones parecen iguales.",
  ],
  [
    "La voz de la porcelana",
    "Fragilidad",
    "Habla con precisión",
    "Su delicadeza no representa debilidad, sino una forma extrema de resistencia.",
  ],
  [
    "El caminante de la estación",
    "Partida",
    "Espera un tren",
    "Habita ese lugar suspendido donde nadie sabe todavía si llega o se despide.",
  ],
  [
    "La mujer de la carta cerrada",
    "Intimidad",
    "Protege un mensaje",
    "Custodia unas palabras cuyo valor depende también de no haber sido abiertas todavía.",
  ],
  [
    "El hombre de las raíces",
    "Pertenencia",
    "Afirma los pies",
    "Recuerda que una vida puede desplazarse sin perder por completo el lugar del que procede.",
  ],
  [
    "La presencia del lago",
    "Profundidad",
    "Permanece en calma",
    "Su superficie serena oculta historias que solo aparecen cuando alguien aprende a mirar despacio.",
  ],
  [
    "El guardián del reloj",
    "Duración",
    "Cuenta sin apresurar",
    "No intenta detener el tiempo: protege el derecho de cada cosa a necesitar el suyo.",
  ],
  [
    "La mujer de la lluvia lenta",
    "Consuelo",
    "Levanta el rostro",
    "Representa una tristeza que no destruye, sino que limpia y permite respirar.",
  ],
  [
    "El hombre de la piedra negra",
    "Verdad",
    "Sostiene el peso",
    "Carga con una materia oscura que no necesita ser embellecida para resultar valiosa.",
  ],
  [
    "La voz del patio vacío",
    "Resonancia",
    "Habla hacia el centro",
    "Su palabra crece porque encuentra un espacio vacío donde poder regresar.",
  ],
  [
    "El portador del farol",
    "Guía",
    "Camina delante",
    "Ilumina únicamente el tramo que otros necesitan para no perder el camino.",
  ],
  [
    "La figura de la cinta roja",
    "Destino",
    "Anuda una promesa",
    "Representa un vínculo que permanece incluso cuando sus extremos dejan de verse.",
  ],
  [
    "El cuidador de las ruinas",
    "Dignidad",
    "Retira el polvo",
    "No reconstruye el pasado: conserva sus restos para que todavía puedan ser comprendidos.",
  ],
  [
    "La mujer del pan compartido",
    "Hospitalidad",
    "Divide sin medir",
    "Su gesto convierte un alimento cotidiano en una forma profunda de comunidad.",
  ],
  [
    "El viajero de las fotografías",
    "Archivo",
    "Ordena los rostros",
    "Transporta imágenes de personas que quizá nunca volverán a encontrarse.",
  ],
  [
    "La presencia del bosque lavado",
    "Renovación",
    "Respira entre cenizas",
    "Habita un paisaje que sobrevivió al incendio y comenzó a volverse blanco.",
  ],
  [
    "El guardián de la última puerta",
    "Aceptación",
    "Espera una decisión",
    "No obliga a cruzar: acompaña el instante en que alguien comprende que debe hacerlo.",
  ],
  [
    "La mujer de las cuentas azules",
    "Meditación",
    "Repite un gesto",
    "Cada cuenta le permite regresar a una respiración, un nombre o una ausencia.",
  ],
  [
    "El hombre del abrigo gastado",
    "Experiencia",
    "Protege lo poco",
    "Su ropa conserva los caminos recorridos y las estaciones que consiguió atravesar.",
  ],
  [
    "La voz del puente de madera",
    "Encuentro",
    "Avanza con cuidado",
    "Une dos orillas mediante una estructura humilde que cruje, pero todavía sostiene.",
  ],
  [
    "La figura de la flor seca",
    "Persistencia",
    "Conserva la forma",
    "Su belleza no depende de permanecer intacta ni de continuar viva del mismo modo.",
  ],
  [
    "El custodio del manuscrito",
    "Transmisión",
    "Protege una página",
    "Guarda un texto que solo permanece completo cuando otra persona decide leerlo.",
  ],
  [
    "La mujer del cristal",
    "Claridad",
    "Mira a través",
    "No elimina las imperfecciones: permite que la luz las atraviese.",
  ],
  [
    "El hombre del puerto antiguo",
    "Regreso",
    "Observa los barcos",
    "Conoce la diferencia entre esperar a alguien y aceptar que quizá no vuelva.",
  ],
  [
    "La presencia de la ceniza blanca",
    "Renacimiento",
    "Camina entre restos",
    "Representa una vida que no niega la destrucción, pero tampoco termina dentro de ella.",
  ],
  [
    "El guardián de la brújula",
    "Dirección",
    "Busca el norte",
    "No conoce el destino exacto, aunque conserva una orientación mientras todo cambia.",
  ],
  [
    "La voz que permanece",
    "Permanencia",
    "Mira directamente",
    "Es la última presencia del archivo y recuerda que el poema continúa mientras alguien lo escuche.",
  ],
];

export const avatarCatalog: AvatarInfo[] =
  rawAvatars.map(
    (
      [
        title,
        presence,
        gesture,
        description,
      ],
      index
    ) => {
      const id = index + 1;

      return {
        id,
        code: `A${String(id).padStart(2, "0")}`,
        title,
        presence,
        gesture,
        description,
      };
    }
  );

export function getAvatarById(
  id: number
): AvatarInfo {
  return (
    avatarCatalog[id - 1] ??
    avatarCatalog[0]
  );
}
