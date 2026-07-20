export type RelicInfo = {
  id: number;
  code: string;
  name: string;
  material: string;
  meaning: string;
  description: string;
};

const rawRelics: Array<
  [
    name: string,
    material: string,
    meaning: string,
    description: string,
  ]
> = [
  [
    "Fragmento de carta",
    "Papel manuscrito",
    "Memoria",
    "Una voz que sobrevivió a la ausencia de su destinatario.",
  ],
  [
    "Llave antigua",
    "Latón envejecido",
    "Acceso",
    "No abre una puerta concreta: recuerda que toda obra guarda una entrada.",
  ],
  [
    "Grulla de papel",
    "Papel plegado",
    "Esperanza",
    "Una forma vulnerable que se sostiene gracias a la precisión de sus pliegues.",
  ],
  [
    "Pluma",
    "Pluma natural",
    "Testimonio",
    "Lo que fue ligero y vivo se convierte en instrumento de memoria.",
  ],
  [
    "Flor seca",
    "Materia vegetal",
    "Persistencia",
    "La belleza que se niega a desaparecer después de su estación.",
  ],
  [
    "Concha espiral",
    "Concha marina",
    "Escucha",
    "Guarda el rumor de un mar que quizá ya no pueda encontrarse.",
  ],
  [
    "Cinta roja",
    "Tejido",
    "Vínculo",
    "Un lazo entre dos vidas, dos territorios o dos tiempos separados.",
  ],
  [
    "Frasco de tinta",
    "Vidrio y tinta",
    "Escritura",
    "Antes del poema existe una materia oscura dispuesta a convertirse en voz.",
  ],
  [
    "Sello de cera",
    "Cera",
    "Custodia",
    "Certifica que una voz ha sido recibida y merece permanecer intacta.",
  ],
  [
    "Pulsera de cuentas",
    "Piedra, vidrio e hilo",
    "Continuidad",
    "Cada cuenta representa un paso de la memoria alrededor del cuerpo.",
  ],
  [
    "Hoja prensada",
    "Hoja seca",
    "Tiempo",
    "Un instante vegetal detenido antes de deshacerse por completo.",
  ],
  [
    "Carrete de hilo",
    "Madera e hilo",
    "Reparación",
    "La promesa de que una rotura todavía puede ser cosida.",
  ],
  [
    "Medallón con cabello",
    "Metal y fibra",
    "Intimidad",
    "Conserva una presencia corporal cuando el cuerpo ya no está cerca.",
  ],
  [
    "Flauta pequeña",
    "Madera",
    "Aliento",
    "Un instrumento mínimo que necesita respiración para volver a existir.",
  ],
  [
    "Amuleto tallado",
    "Piedra",
    "Protección",
    "Una figura erosionada por las manos que confiaron en ella.",
  ],
  [
    "Rosario de madera",
    "Madera e hilo",
    "Repetición",
    "Una secuencia de cuentas para atravesar el silencio sin perderse.",
  ],
  [
    "Campana",
    "Bronce",
    "Llamada",
    "Su sonido anuncia que una presencia acaba de entrar en el archivo.",
  ],
  [
    "Lápiz de carbón",
    "Madera y carbono",
    "Huella",
    "Una herramienta humilde capaz de dejar una marca más larga que su propia vida.",
  ],
  [
    "Libro diminuto",
    "Papel y cubierta",
    "Archivo",
    "Una biblioteca reducida a un objeto que cabe dentro de una mano.",
  ],
  [
    "Fragmento de mapa",
    "Papel",
    "Territorio",
    "No muestra el mundo entero: conserva solamente el lugar que alguien necesitó.",
  ],
  [
    "Fósil",
    "Piedra",
    "Tiempo profundo",
    "La forma de una vida preservada mucho después de perder su nombre.",
  ],
  [
    "Bolsa bordada",
    "Tejido e hilo",
    "Reserva",
    "Un pequeño refugio destinado a guardar aquello que no debe dispersarse.",
  ],
  [
    "Moneda perforada",
    "Metal",
    "Intercambio",
    "Un objeto que dejó de comprar cosas para convertirse en memoria.",
  ],
  [
    "Porcelana azul",
    "Cerámica",
    "Fractura",
    "Un fragmento roto que continúa conteniendo la belleza del objeto perdido.",
  ],
  [
    "Retal bordado",
    "Tela e hilo",
    "Herencia",
    "La paciencia de unas manos permanece dentro de cada puntada.",
  ],
  [
    "Obsidiana",
    "Vidrio volcánico",
    "Verdad",
    "Una superficie oscura que refleja sin suavizar aquello que tiene delante.",
  ],
  [
    "Canica de vidrio",
    "Vidrio",
    "Infancia",
    "Un mundo completo, pequeño y luminoso, que todavía puede rodar.",
  ],
  [
    "Vela consumida",
    "Cera y mecha",
    "Vigilia",
    "La prueba de una luz que permaneció encendida mientras alguien esperaba.",
  ],
  [
    "Silbato de cerámica",
    "Cerámica",
    "Señal",
    "Necesita el aliento humano para atravesar la distancia.",
  ],
  [
    "Nudo de cuerda",
    "Fibra trenzada",
    "Unión",
    "Dos extremos diferentes deciden no separarse.",
  ],
  [
    "Marco vacío",
    "Metal dorado",
    "Ausencia",
    "No contiene una imagen: convierte la falta en el centro de la mirada.",
  ],
  [
    "Colgante de hoja",
    "Metal",
    "Decisión",
    "Una forma afilada que recuerda el instante de tomar un camino.",
  ],
  [
    "Coral blanco",
    "Estructura marina",
    "Memoria del océano",
    "El esqueleto de una arquitectura creada lentamente bajo el agua.",
  ],
  [
    "Reloj de arena",
    "Vidrio, metal y arena",
    "Duración",
    "No detiene el tiempo; permite contemplar cómo cae.",
  ],
  [
    "Semilla antigua",
    "Materia vegetal",
    "Potencial",
    "Parece dormida, aunque dentro conserva la posibilidad de un bosque.",
  ],
  [
    "Fotografía rota",
    "Papel fotográfico",
    "Identidad",
    "Una vida incompleta que obliga a imaginar la parte desaparecida.",
  ],
  [
    "Talismán de tela",
    "Tejido bordado",
    "Amparo",
    "Un pequeño objeto fabricado para acompañar a alguien durante el peligro.",
  ],
  [
    "Caballo de madera",
    "Madera",
    "Movimiento",
    "Un juguete detenido que todavía conserva la dirección de una infancia.",
  ],
  [
    "Figura de bronce",
    "Bronce",
    "Gesto",
    "El cuerpo convertido en una postura que el tiempo ya no puede modificar.",
  ],
  [
    "Linterna",
    "Metal y vidrio",
    "Orientación",
    "No ilumina todo el camino: ofrece la luz suficiente para dar el siguiente paso.",
  ],
  [
    "Imperdible",
    "Acero",
    "Reparación",
    "Una solución provisional que muchas veces termina sosteniendo una vida entera.",
  ],
  [
    "Cuarzo",
    "Mineral",
    "Claridad",
    "Una piedra que parece conservar luz dentro de su estructura.",
  ],
  [
    "Sello postal",
    "Papel impreso",
    "Viaje",
    "La prueba mínima de que un mensaje consiguió atravesar una frontera.",
  ],
  [
    "Chapa antigua",
    "Metal",
    "Arqueología cotidiana",
    "Lo que fue desechable se convierte, con el tiempo, en testimonio.",
  ],
  [
    "Madera erosionada",
    "Madera",
    "Resistencia",
    "El agua, el viento y los años escribieron directamente sobre ella.",
  ],
  [
    "Medalla",
    "Metal y esmalte",
    "Devoción",
    "Un rostro protegido por la repetición de las manos que lo tocaron.",
  ],
  [
    "Partitura rota",
    "Papel y tinta",
    "Música",
    "Aunque falten compases, la melodía continúa en la memoria de quien la escuchó.",
  ],
  [
    "Bolsa de semillas",
    "Tela y materia vegetal",
    "Futuro",
    "Un pequeño depósito de vidas que todavía no han comenzado.",
  ],
  [
    "Dedal",
    "Metal",
    "Oficio",
    "Protege el dedo que insiste en atravesar la tela una vez más.",
  ],
  [
    "Trébol de cuatro hojas",
    "Hoja prensada",
    "Azar",
    "Una anomalía natural convertida por los humanos en promesa.",
  ],
  [
    "Frasco de polvo",
    "Vidrio, corcho y sedimento",
    "Resto",
    "Aquello que parecía insignificante recibe un recipiente para no desaparecer.",
  ],
  [
    "Hueso tallado",
    "Materia ósea",
    "Ascendencia",
    "Una parte del cuerpo transformada en señal para atravesar generaciones.",
  ],
  [
    "Nudo tejido",
    "Fibra",
    "Comunidad",
    "Ningún hilo sostiene la forma por sí solo.",
  ],
  [
    "Amuleto grabado",
    "Metal",
    "Lenguaje",
    "Signos que siguen protegiendo incluso cuando ya nadie sabe traducirlos.",
  ],
  [
    "Flor de loto seca",
    "Materia vegetal",
    "Renacimiento",
    "Una flor nacida del agua que conserva su arquitectura después de marchitarse.",
  ],
  [
    "Escarabajo turquesa",
    "Piedra o cerámica esmaltada",
    "Transformación",
    "Una criatura diminuta convertida en símbolo de movimiento y renovación.",
  ],
  [
    "Manuscrito",
    "Papel y tinta",
    "Traducción",
    "Una voz escrita en signos que invitan a cruzar hacia otra lengua.",
  ],
  [
    "Piedra volcánica",
    "Roca porosa",
    "Origen",
    "Materia nacida del fuego que terminó enfriándose dentro de una mano.",
  ],
  [
    "Hilo rojo en frasco",
    "Vidrio e hilo",
    "Destino",
    "Un vínculo encerrado para evitar que el tiempo pueda cortarlo.",
  ],
  [
    "Brújula",
    "Latón y vidrio",
    "Dirección",
    "No decide el camino, pero recuerda que siempre existe un norte posible.",
  ],
];

export const relicCatalog: RelicInfo[] =
  rawRelics.map(
    (
      [
        name,
        material,
        meaning,
        description,
      ],
      index
    ) => {
      const id = index + 1;

      return {
        id,
        code: `T${String(id).padStart(2, "0")}`,
        name,
        material,
        meaning,
        description,
      };
    }
  );

export function getRelicById(
  id: number
): RelicInfo {
  return (
    relicCatalog[id - 1] ??
    relicCatalog[0]
  );
}
