export type CuratedVoice = {
  position: number;
  kind: "real" | "literary";
  name: string;
  territory: string;
  poemTitle: string;
  treasure: string;
  chapter?: string;
  occupation?: string;
  language?: string;
  age?: string;
};

export const CURATED_VOICES: CuratedVoice[] = [
  {
    "position": 1,
    "kind": "real",
    "name": "José Naveiro",
    "territory": "Galicia · España",
    "poemTitle": "El huerto",
    "treasure": "Tesoro actual de la presencia"
  },
  {
    "position": 2,
    "kind": "real",
    "name": "ASATAKA",
    "territory": "Japón",
    "poemTitle": "La luz regresa descalza",
    "treasure": "Tesoro actual de la presencia"
  },
  {
    "position": 3,
    "kind": "real",
    "name": "Azucena",
    "territory": "México",
    "poemTitle": "",
    "treasure": "Tesoro actual de la presencia"
  },
  {
    "position": 4,
    "kind": "real",
    "name": "Johan Rodríguez Martínez",
    "territory": "Venezuela",
    "poemTitle": "Lo que permanece",
    "treasure": "Tesoro actual de la presencia"
  },
  {
    "position": 5,
    "kind": "real",
    "name": "Andrés Giraldo Flórez",
    "territory": "Colombia",
    "poemTitle": "",
    "treasure": "Tesoro actual de la presencia"
  },
  {
    "position": 6,
    "kind": "real",
    "name": "Marco Indrio",
    "territory": "Italia · Italy",
    "poemTitle": "Solo dos hombres",
    "treasure": "Tesoro actual de la presencia"
  },
  {
    "position": 7,
    "kind": "real",
    "name": "Cheik Ndiaye",
    "territory": "Sénégal · Senegal",
    "poemTitle": "Je suis arrivé vivant",
    "treasure": "Tesoro actual de la presencia"
  },
  {
    "position": 8,
    "kind": "real",
    "name": "Jacobo Blanco Piñeiro",
    "territory": "Galicia · España",
    "poemTitle": "Cofundador · librero",
    "treasure": "Tesoro actual de la presencia"
  },
  {
    "position": 9,
    "kind": "literary",
    "name": "Aiko Mori",
    "territory": "Kioto · Japón",
    "poemTitle": "La madre del tiempo",
    "treasure": "una rueda dentada guardada en un pañuelo",
    "chapter": "La casa anterior al miedo",
    "occupation": "relojera jubilada",
    "language": "JAPONÉS (TRANSLITERACIÓN RŌMAJI)",
    "age": "72 años"
  },
  {
    "position": 10,
    "kind": "literary",
    "name": "Mamadou Diop",
    "territory": "Saint-Louis · Senegal",
    "poemTitle": "Primer mar",
    "treasure": "una viruta de madera con forma de ola",
    "chapter": "La casa anterior al miedo",
    "occupation": "carpintero de ribera",
    "language": "WOLOF (WOLOF DE SAINT-LOUIS)",
    "age": "33 años"
  },
  {
    "position": 11,
    "kind": "literary",
    "name": "Lúa Carballo",
    "territory": "Santiago de Compostela · España",
    "poemTitle": "Inventario de la casa pequeña",
    "treasure": "una llave que ya no abre ninguna puerta",
    "chapter": "La casa anterior al miedo",
    "occupation": "archivera",
    "language": "GALEGO (GALEGO DE GALICIA)",
    "age": "29 años"
  },
  {
    "position": 12,
    "kind": "literary",
    "name": "Ximena Téllez",
    "territory": "Puebla · México",
    "poemTitle": "Historia clínica de una luz",
    "treasure": "una pulsera de hospital sin nombre",
    "chapter": "La casa anterior al miedo",
    "occupation": "obstetra",
    "language": "ESPAÑOL (ESPAÑOL DE MÉXICO)",
    "age": "41 años"
  },
  {
    "position": 13,
    "kind": "literary",
    "name": "Ingrid Solheim",
    "territory": "Tromsø · Noruega",
    "poemTitle": "Constelación de invierno",
    "treasure": "un mapa celeste doblado cuatro veces",
    "chapter": "La casa anterior al miedo",
    "occupation": "estudiante de astronomía",
    "language": "NORUEGO (BOKMÅL)",
    "age": "17 años"
  },
  {
    "position": 14,
    "kind": "literary",
    "name": "Aarav Mehta",
    "territory": "Vadodara · India",
    "poemTitle": "Aviso a los viajeros",
    "treasure": "un billete de andén perforado",
    "chapter": "La casa anterior al miedo",
    "occupation": "locutor ferroviario",
    "language": "GUYARATÍ (TRANSLITERACIÓN LATINA)",
    "age": "38 años"
  },
  {
    "position": 15,
    "kind": "literary",
    "name": "Valentina Caicedo",
    "territory": "Cali · Colombia",
    "poemTitle": "Puntada invisible",
    "treasure": "un dedal abollado",
    "chapter": "La casa anterior al miedo",
    "occupation": "costurera",
    "language": "ESPAÑOL (ESPAÑOL DE COLOMBIA)",
    "age": "63 años"
  },
  {
    "position": 16,
    "kind": "literary",
    "name": "Tomás Lucero",
    "territory": "Córdoba · Argentina",
    "poemTitle": "Ensayo general",
    "treasure": "una cinta elástica gastada",
    "chapter": "Los espejos tienen hambre",
    "occupation": "estudiante de danza",
    "language": "ESPAÑOL (ESPAÑOL DE ARGENTINA)",
    "age": "19 años"
  },
  {
    "position": 17,
    "kind": "literary",
    "name": "Park Seo-yeon",
    "territory": "Seúl · Corea del Sur",
    "poemTitle": "Condiciones de uso",
    "treasure": "un teléfono con la pantalla rota",
    "chapter": "Los espejos tienen hambre",
    "occupation": "diseñadora de interfaces",
    "language": "COREANO (TRANSLITERACIÓN ROMANIZADA)",
    "age": "26 años"
  },
  {
    "position": 18,
    "kind": "literary",
    "name": "Salma El Idrissi",
    "territory": "Fez · Marruecos",
    "poemTitle": "Almuerzo para una hija",
    "treasure": "una cuchara de mango azul",
    "chapter": "Los espejos tienen hambre",
    "occupation": "cocinera escolar",
    "language": "ÁRABE MARROQUÍ (DARIJA DE FEZ)",
    "age": "44 años"
  },
  {
    "position": 19,
    "kind": "literary",
    "name": "Camille Duret",
    "territory": "Lyon · Francia",
    "poemTitle": "Capa de ajuste",
    "treasure": "una fotografía sin editar",
    "chapter": "Los espejos tienen hambre",
    "occupation": "retocadora fotográfica",
    "language": "FRANCÉS (FRANÇAIS DE FRANCE)",
    "age": "31 años"
  },
  {
    "position": 20,
    "kind": "literary",
    "name": "Rafael Nascimento",
    "territory": "Recife · Brasil",
    "poemTitle": "Radiografía",
    "treasure": "una placa velada",
    "chapter": "Los espejos tienen hambre",
    "occupation": "técnico de radiología",
    "language": "PORTUGUÉS (PORTUGUÊS DO BRASIL)",
    "age": "28 años"
  },
  {
    "position": 21,
    "kind": "literary",
    "name": "Nadine Khoury",
    "territory": "Beirut · Líbano",
    "poemTitle": "Posología",
    "treasure": "un frasco ámbar vacío",
    "chapter": "Los espejos tienen hambre",
    "occupation": "farmacéutica",
    "language": "ÁRABE LIBANÉS (ÁRABE DE BEIRUT)",
    "age": "36 años"
  },
  {
    "position": 22,
    "kind": "literary",
    "name": "Thando Maseko",
    "territory": "Johannesburgo · Sudáfrica",
    "poemTitle": "Doce asaltos",
    "treasure": "una venda con una pequeña mancha de sangre",
    "chapter": "Los espejos tienen hambre",
    "occupation": "boxeadora",
    "language": "ISIZULU (ISIZULU DE JOHANNESBURGO)",
    "age": "23 años"
  },
  {
    "position": 23,
    "kind": "literary",
    "name": "Zofia Nowak",
    "territory": "Łódź · Polonia",
    "poemTitle": "Ticket de compra",
    "treasure": "un recibo casi borrado",
    "chapter": "Los espejos tienen hambre",
    "occupation": "cajera de supermercado",
    "language": "POLACO (POLSKI)",
    "age": "55 años"
  },
  {
    "position": 24,
    "kind": "literary",
    "name": "Milagros Quispe",
    "territory": "Cusco · Perú",
    "poemTitle": "Papa para los días rotos",
    "treasure": "un cuaderno manchado de caldo",
    "chapter": "Cocinas para regresar",
    "occupation": "cocinera de escuela pública",
    "language": "QUECHUA (QUECHUA SUREÑO DE CUSCO)",
    "age": "48 años"
  },
  {
    "position": 25,
    "kind": "literary",
    "name": "Enzo Bellini",
    "territory": "Bolonia · Italia",
    "poemTitle": "Las cuatro de la mañana",
    "treasure": "una rasqueta de panadero heredada",
    "chapter": "Cocinas para regresar",
    "occupation": "panadero",
    "language": "ITALIANO (ITALIANO DE BOLONIA)",
    "age": "61 años"
  },
  {
    "position": 26,
    "kind": "literary",
    "name": "Deniz Kaya",
    "territory": "Esmirna · Turquía",
    "poemTitle": "El cuenco imperfecto",
    "treasure": "un cuenco con el borde irregular",
    "chapter": "Cocinas para regresar",
    "occupation": "ceramista",
    "language": "TURCO (TÜRKÇE)",
    "age": "27 años"
  },
  {
    "position": 27,
    "kind": "literary",
    "name": "Hana Tesfaye",
    "territory": "Adís Abeba · Etiopía",
    "poemTitle": "Guardia nocturna",
    "treasure": "una servilleta con una receta escrita",
    "chapter": "Cocinas para regresar",
    "occupation": "médica de urgencias",
    "language": "AMHÁRICO (TRANSLITERACIÓN LATINA)",
    "age": "32 años"
  },
  {
    "position": 28,
    "kind": "literary",
    "name": "Inês Carvalho",
    "territory": "Oporto · Portugal",
    "poemTitle": "Mezcla final",
    "treasure": "unos auriculares reparados con cinta",
    "chapter": "Cocinas para regresar",
    "occupation": "ingeniera de sonido",
    "language": "PORTUGUÉS (PORTUGUÊS DE PORTUGAL)",
    "age": "36 años"
  },
  {
    "position": 29,
    "kind": "literary",
    "name": "Niran Sutham",
    "territory": "Chiang Mai · Tailandia",
    "poemTitle": "El mango y el cuchillo",
    "treasure": "un cuchillo de cocina sin punta",
    "chapter": "Cocinas para regresar",
    "occupation": "cultivador de orquídeas",
    "language": "TAILANDÉS (TRANSLITERACIÓN LATINA)",
    "age": "46 años"
  },
  {
    "position": 30,
    "kind": "literary",
    "name": "Élise Tremblay",
    "territory": "Quebec · Canadá",
    "poemTitle": "Caldo de despedida",
    "treasure": "una taza de porcelana con una grieta",
    "chapter": "Cocinas para regresar",
    "occupation": "voluntaria de cuidados paliativos",
    "language": "FRANCÉS (FRANÇAIS QUÉBÉCOIS)",
    "age": "68 años"
  },
  {
    "position": 31,
    "kind": "literary",
    "name": "Marta Klein",
    "territory": "Leipzig · Alemania",
    "poemTitle": "Prueba de memoria",
    "treasure": "un lápiz mordido por su padre",
    "chapter": "Donde la luz aprende a morir",
    "occupation": "neuróloga",
    "language": "ALEMÁN (DEUTSCH)",
    "age": "52 años"
  },
  {
    "position": 32,
    "kind": "literary",
    "name": "Kojo Mensah",
    "territory": "Kumasi · Ghana",
    "poemTitle": "Tambor pequeño",
    "treasure": "el collar de un perro",
    "chapter": "Donde la luz aprende a morir",
    "occupation": "aprendiz de percusión",
    "language": "TWI (ASANTE TWI)",
    "age": "14 años"
  },
  {
    "position": 33,
    "kind": "literary",
    "name": "Eimear O’Connell",
    "territory": "Galway · Irlanda",
    "poemTitle": "Cuaderno del faro",
    "treasure": "una lente de vidrio verde",
    "chapter": "Donde la luz aprende a morir",
    "occupation": "antigua farera",
    "language": "IRLANDÉS (GAEILGE CHONAMARA)",
    "age": "83 años"
  },
  {
    "position": 34,
    "kind": "literary",
    "name": "Nima Gurung",
    "territory": "Pokhara · Nepal",
    "poemTitle": "Frecuencia perdida",
    "treasure": "una válvula quemada",
    "chapter": "Donde la luz aprende a morir",
    "occupation": "técnico de radio",
    "language": "NEPALÍ (TRANSLITERACIÓN LATINA)",
    "age": "39 años"
  },
  {
    "position": 35,
    "kind": "literary",
    "name": "Rocío Valdés",
    "territory": "Valparaíso · Chile",
    "poemTitle": "Jardinera del cementerio",
    "treasure": "una etiqueta de rosal escrita a mano",
    "chapter": "Donde la luz aprende a morir",
    "occupation": "jardinera",
    "language": "ESPAÑOL (ESPAÑOL DE CHILE)",
    "age": "45 años"
  },
  {
    "position": 36,
    "kind": "literary",
    "name": "Maia Bennett",
    "territory": "Dunedin · Nueva Zelanda",
    "poemTitle": "Cosas que devuelve el mar",
    "treasure": "una caja con conchas y un botón",
    "chapter": "Donde la luz aprende a morir",
    "occupation": "coleccionista de orillas",
    "language": "INGLÉS (NEW ZEALAND ENGLISH)",
    "age": "10 años"
  },
  {
    "position": 37,
    "kind": "literary",
    "name": "Lila Santos",
    "territory": "Cebú · Filipinas",
    "poemTitle": "Manual de motores detenidos",
    "treasure": "una llave inglesa de su madre",
    "chapter": "Donde la luz aprende a morir",
    "occupation": "ingeniera naval",
    "language": "CEBUANO (CEBUANO SA SUGBO)",
    "age": "35 años"
  },
  {
    "position": 38,
    "kind": "literary",
    "name": "Eleni Papadakis",
    "territory": "Tesalónica · Grecia",
    "poemTitle": "Diccionario para después de ti",
    "treasure": "una página arrancada de un diccionario",
    "chapter": "Los cuerpos exiliados",
    "occupation": "traductora",
    "language": "GRIEGO (ΕΛΛΗΝΙΚΆ)",
    "age": "26 años"
  },
  {
    "position": 39,
    "kind": "literary",
    "name": "Mariela Suárez",
    "territory": "La Habana · Cuba",
    "poemTitle": "Ocho tiempos",
    "treasure": "un zapato rojo sin pareja",
    "chapter": "Los cuerpos exiliados",
    "occupation": "profesora de baile",
    "language": "ESPAÑOL (ESPAÑOL DE CUBA)",
    "age": "58 años"
  },
  {
    "position": 40,
    "kind": "literary",
    "name": "Parisa Rahimi",
    "territory": "Shiraz · Irán",
    "poemTitle": "Plano de una casa imposible",
    "treasure": "una regla metálica doblada",
    "chapter": "Los cuerpos exiliados",
    "occupation": "arquitecta",
    "language": "PERSA (فارسی)",
    "age": "30 años"
  },
  {
    "position": 41,
    "kind": "literary",
    "name": "Noor de Vries",
    "territory": "Róterdam · Países Bajos",
    "poemTitle": "Tinta para un cuerpo verdadero",
    "treasure": "una aguja esterilizada dentro de su sobre",
    "chapter": "Los cuerpos exiliados",
    "occupation": "artista del tatuaje",
    "language": "NEERLANDÉS (NEDERLANDS)",
    "age": "24 años"
  },
  {
    "position": 42,
    "kind": "literary",
    "name": "Yadira Peña",
    "territory": "Santo Domingo · República Dominicana",
    "poemTitle": "Demanda de separación",
    "treasure": "dos anillos dentro de un sobre judicial",
    "chapter": "Los cuerpos exiliados",
    "occupation": "abogada de familia",
    "language": "ESPAÑOL (ESPAÑOL DE REPÚBLICA DOMINICANA)",
    "age": "40 años"
  },
  {
    "position": 43,
    "kind": "literary",
    "name": "Sami Benyamina",
    "territory": "Orán · Argelia",
    "poemTitle": "Película quemada",
    "treasure": "un fotograma ennegrecido",
    "chapter": "Los cuerpos exiliados",
    "occupation": "proyeccionista de cine",
    "language": "ÁRABE ARGELINO (DARIJA DE ORÁN)",
    "age": "33 años"
  },
  {
    "position": 44,
    "kind": "literary",
    "name": "Aino Laakso",
    "territory": "Tampere · Finlandia",
    "poemTitle": "Antes de entrar al hielo",
    "treasure": "un gorro de lana rojo",
    "chapter": "Los cuerpos exiliados",
    "occupation": "bibliotecaria",
    "language": "FINÉS (SUOMI)",
    "age": "51 años"
  },
  {
    "position": 45,
    "kind": "literary",
    "name": "Mateo Silveira",
    "territory": "Montevideo · Uruguay",
    "poemTitle": "Cartas no entregadas",
    "treasure": "una bolsa postal de cuero",
    "chapter": "Los cuerpos exiliados",
    "occupation": "cartero jubilado",
    "language": "ESPAÑOL (ESPAÑOL DE URUGUAY)",
    "age": "70 años"
  },
  {
    "position": 46,
    "kind": "literary",
    "name": "Malik Carter",
    "territory": "Chicago · Estados Unidos",
    "poemTitle": "Entrega en curso",
    "treasure": "una luz trasera rota",
    "chapter": "Ciudades que no duermen",
    "occupation": "repartidor en bicicleta",
    "language": "INGLÉS (AMERICAN ENGLISH)",
    "age": "22 años"
  },
  {
    "position": 47,
    "kind": "literary",
    "name": "Lin Xiaoyu",
    "territory": "Shenzhen · China",
    "poemTitle": "Diagnóstico del sistema",
    "treasure": "una placa base inutilizada",
    "chapter": "Ciudades que no duermen",
    "occupation": "ingeniera de semiconductores",
    "language": "CHINO MANDARÍN (TRANSLITERACIÓN PINYIN)",
    "age": "35 años"
  },
  {
    "position": 48,
    "kind": "literary",
    "name": "Wanjiku Njoroge",
    "territory": "Nairobi · Kenia",
    "poemTitle": "Su llamada es importante",
    "treasure": "una diadema con un auricular gastado",
    "chapter": "Ciudades que no duermen",
    "occupation": "operadora de atención telefónica",
    "language": "GIKUYU (GĨKŨYŨ)",
    "age": "27 años"
  },
  {
    "position": 49,
    "kind": "literary",
    "name": "Lev Morózov",
    "territory": "San Petersburgo · Rusia",
    "poemTitle": "Último metro",
    "treasure": "una ficha de transporte antigua",
    "chapter": "Ciudades que no duermen",
    "occupation": "limpiador nocturno",
    "language": "RUSO (РУССКИЙ)",
    "age": "62 años"
  },
  {
    "position": 50,
    "kind": "literary",
    "name": "Maeve Turner",
    "territory": "Melbourne · Australia",
    "poemTitle": "Triaje",
    "treasure": "una manta térmica doblada",
    "chapter": "Ciudades que no duermen",
    "occupation": "paramédica",
    "language": "INGLÉS (AUSTRALIAN ENGLISH)",
    "age": "29 años"
  },
  {
    "position": 51,
    "kind": "literary",
    "name": "Mariam Hassan",
    "territory": "Alejandría · Egipto",
    "poemTitle": "Gambito de la madre",
    "treasure": "una reina blanca sin corona",
    "chapter": "Ciudades que no duermen",
    "occupation": "jugadora de ajedrez",
    "language": "ÁRABE EGIPCIO (ÁRABE DE ALEJANDRÍA)",
    "age": "18 años"
  },
  {
    "position": 52,
    "kind": "literary",
    "name": "Jónas Einarsson",
    "territory": "Reikiavik · Islandia",
    "poemTitle": "Centro de datos",
    "treasure": "un disco duro etiquetado “FAMILIA”",
    "chapter": "Ciudades que no duermen",
    "occupation": "técnico de servidores",
    "language": "ISLANDÉS (ÍSLENSKA)",
    "age": "47 años"
  },
  {
    "position": 53,
    "kind": "literary",
    "name": "Daniela Quesada",
    "territory": "Cartago · Costa Rica",
    "poemTitle": "Rehabilitación",
    "treasure": "una banda elástica amarilla",
    "chapter": "El oficio de las alas",
    "occupation": "fisioterapeuta",
    "language": "ESPAÑOL (ESPAÑOL DE COSTA RICA)",
    "age": "37 años"
  },
  {
    "position": 54,
    "kind": "literary",
    "name": "Andrei Ionescu",
    "territory": "Sibiu · Rumanía",
    "poemTitle": "Restauración de un rostro",
    "treasure": "un pincel de pelo muy fino",
    "chapter": "El oficio de las alas",
    "occupation": "restaurador de frescos",
    "language": "RUMANO (ROMÂNĂ)",
    "age": "45 años"
  },
  {
    "position": 55,
    "kind": "literary",
    "name": "Sari Wulandari",
    "territory": "Yogyakarta · Indonesia",
    "poemTitle": "Teatro de sombras",
    "treasure": "una figura de cuero sin un brazo",
    "chapter": "El oficio de las alas",
    "occupation": "titiritera",
    "language": "JAVANÉS (BASA JAWA EN ALFABETO LATINO)",
    "age": "33 años"
  },
  {
    "position": 56,
    "kind": "literary",
    "name": "Noura al-Khatib",
    "territory": "Belén · Palestina",
    "poemTitle": "Oficio de comadrona",
    "treasure": "una sábana bordada por su abuela",
    "chapter": "El oficio de las alas",
    "occupation": "comadrona",
    "language": "ÁRABE PALESTINO (ÁRABE DE BELÉN)",
    "age": "42 años"
  },
  {
    "position": 57,
    "kind": "literary",
    "name": "Samuel Urrutia",
    "territory": "Barquisimeto · Venezuela",
    "poemTitle": "Partitura para un país lejano",
    "treasure": "una cuerda de violín enrollada",
    "chapter": "El oficio de las alas",
    "occupation": "violinista",
    "language": "ESPAÑOL (ESPAÑOL DE VENEZUELA)",
    "age": "16 años"
  },
  {
    "position": 58,
    "kind": "literary",
    "name": "Anaïs Ravelomanana",
    "territory": "Antananarivo · Madagascar",
    "poemTitle": "Catálogo de semillas para después del incendio",
    "treasure": "un sobre con cincuenta semillas distintas",
    "chapter": "El oficio de las alas",
    "occupation": "conservadora de semillas",
    "language": "MALGACHE (MALAGASY)",
    "age": "67 años"
  }
];

export const CURATED_VOICES_BY_POSITION: Record<number, CuratedVoice> =
  Object.fromEntries(
    CURATED_VOICES.map((voice) => [voice.position, voice]),
  );
