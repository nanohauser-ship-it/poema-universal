import type {
  AtlasRelationNodeRef,
} from "./relation-ontology";

/**
 * ATLAS UNIVERSAL DE LAS INFLUENCIAS
 *
 * Nodos auxiliares externos al corpus central de 501 autores.
 * Aquí viven autores, obras, movimientos, tradiciones,
 * instituciones y conceptos necesarios para explicar
 * las relaciones del Atlas.
 */

export const atlasExternalNodesMaster:
  AtlasRelationNodeRef[] = [
  {
    type: "author",
    id: "ann-radcliffe",
    label: "Ann Radcliffe",
  },

  {
    type: "author",
    id: "anne-frank",
    label: "Anne Frank",
  },

  {
    type: "author",
    id: "auden",
    label: "W. H. Auden",
  },

  {
    type: "author",
    id: "daniel-defoe",
    label: "Daniel Defoe",
  },

  {
    type: "author",
    id: "dylan-thomas",
    label: "Dylan Thomas",
  },

  {
    type: "author",
    id: "frances-burney",
    label: "Frances Burney",
  },

  {
    type: "author",
    id: "franz-boas",
    label: "Franz Boas",
  },

  {
    type: "author",
    id: "gerard-manley-hopkins",
    label: "Gerard Manley Hopkins",
  },

  {
    type: "author",
    id: "graham-greene",
    label: "Graham Greene",
  },

  {
    type: "author",
    id: "han-ha-un",
    label: "Han Ha-un",
  },

  {
    type: "author",
    id: "muriel-rukeyser",
    label: "Muriel Rukeyser",
  },

  {
    type: "author",
    id: "northrop-frye",
    label: "Northrop Frye",
  },

  {
    type: "author",
    id: "thomas-merton",
    label: "Thomas Merton",
  },

  {
    type: "author",
    id: "vladimir-holan",
    label: "Vladimír Holan",
  },


  {
    type: "movement",
    id: "poesia-concreta-brasilena",
    label: "Poesía concreta brasileña",
  },

  {
    type: "movement",
    id: "neoconcretismo",
    label: "Neoconcretismo",
  },

  {
    type: "movement",
    id: "simbolismo",
    label: "Simbolismo",
  },

  {
    type: "tradition",
    id: "tao-te-ching",
    label: "Tao Te Ching / Taoísmo",
  },

  {
    type: "institution",
    id: "modern-yiddish-canon",
    label: "Canon yidis moderno",
  },

  {
    type: "tradition",
    id: "greek-tragedy",
    label: "Tragedia griega",
  },

  {
    type: "tradition",
    id: "old-attic-comedy",
    label: "Comedia ática antigua",
  },

  {
    type: "tradition",
    id: "epicureanism",
    label: "Epicureísmo",
  },

  {
    type: "tradition",
    id: "roman-lyric-tradition",
    label: "Tradición lírica romana",
  },

  {
    type: "tradition",
    id: "roman-love-elegy",
    label: "Elegía amorosa romana",
  },

  {
    type: "tradition",
    id: "chinese-pastoral-poetry",
    label: "Poesía pastoral china",
  },

  {
    type: "tradition",
    id: "tang-poetry",
    label: "Poesía de la dinastía Tang",
  },

  {
    type: "tradition",
    id: "sufi-tradition",
    label: "Tradición sufí",
  },

  {
    type: "tradition",
    id: "persian-epic-tradition",
    label: "Tradición épica persa",
  },

  {
    type: "tradition",
    id: "persian-ghazal-tradition",
    label: "Tradición persa del ghazal",
  },

  {
    type: "tradition",
    id: "persian-rubai-tradition",
    label: "Tradición persa del rubāʿī",
  },

  {
    type: "movement",
    id: "petrarchism",
    label: "Petrarquismo",
  },

  {
    type: "movement",
    id: "la-pleiade",
    label: "La Pléiade",
  },

  {
    type: "tradition",
    id: "spanish-mysticism",
    label: "Mística española",
  },

  {
    type: "movement",
    id: "metaphysical-poetry",
    label: "Poesía metafísica inglesa",
  },

  {
    type: "movement",
    id: "romanticism",
    label: "Romanticismo",
  },

  {
    type: "tradition",
    id: "archaic-greek-lyric",
    label: "Lírica griega arcaica",
  },

  {
    type: "tradition",
    id: "stoicism",
    label: "Estoicismo",
  },

  {
    type: "tradition",
    id: "abbasid-poetry",
    label: "Poesía abasí",
  },

  {
    type: "tradition",
    id: "arabic-qasida",
    label: "Tradición árabe de la qaṣīda",
  },

  {
    type: "tradition",
    id: "medieval-french-literature",
    label: "Literatura francesa medieval",
  },

  {
    type: "tradition",
    id: "medieval-french-poetry",
    label: "Poesía francesa bajomedieval",
  },

  {
    type: "tradition",
    id: "medieval-castilian-elegy",
    label: "Elegía castellana medieval",
  },

  {
    type: "tradition",
    id: "italian-chivalric-epic",
    label: "Épica caballeresca italiana",
  },

  {
    type: "movement",
    id: "spanish-golden-age-theatre",
    label: "Teatro del Siglo de Oro",
  },

  {
    type: "movement",
    id: "conceptismo",
    label: "Conceptismo",
  },

  {
    type: "movement",
    id: "french-classicism",
    label: "Clasicismo francés",
  },

  {
    type: "tradition",
    id: "haikai-tradition",
    label: "Tradición del haikai",
  },

  {
    type: "movement",
    id: "modern-drama",
    label: "Drama moderno europeo",
  },

  {
    type: "movement",
    id: "modernismo-hispanoamericano",
    label: "Modernismo hispanoamericano",
  },

  {
    type: "author",
    id: "laurence-sterne",
    label: "Laurence Sterne",
  },

  {
    type: "movement",
    id: "generation-98",
    label: "Generación del 98",
  },

  {
    type: "place",
    id: "alexandria",
    label: "Alejandría",
  },

  {
    type: "author",
    id: "john-ruskin",
    label: "John Ruskin",
  },

  {
    type: "religious_tradition",
    id: "buddhism",
    label: "Budismo",
  },

  {
    type: "movement",
    id: "cubism",
    label: "Cubismo",
  },

  {
    type: "tradition",
    id: "hindi-urdu-realism",
    label: "Realismo hindi-urdu",
  },

  {
    type: "author",
    id: "friedrich-nietzsche",
    label: "Friedrich Nietzsche",
  },

  {
    type: "movement",
    id: "modernism",
    label: "Modernismo internacional",
  },

  {
    type: "movement",
    id: "imagism",
    label: "Imagismo",
  },

  {
    type: "movement",
    id: "french-modernism",
    label: "Modernidad poética francesa",
  },

  {
    type: "movement",
    id: "portuguese-modernism",
    label: "Modernismo portugués",
  },

  {
    type: "movement",
    id: "acmeism",
    label: "Acmeísmo",
  },

  {
    type: "movement",
    id: "postmodernismo-hispanoamericano",
    label: "Postmodernismo hispanoamericano",
  },

  {
    type: "movement",
    id: "russian-futurism",
    label: "Futurismo ruso",
  },

  {
    type: "movement",
    id: "argentine-avant-garde",
    label: "Vanguardia argentina",
  },

  {
    type: "movement",
    id: "polish-modernism",
    label: "Modernismo polaco",
  },

  {
    type: "movement",
    id: "latin-american-avant-garde",
    label: "Vanguardia latinoamericana",
  },

  {
    type: "place",
    id: "bosnia",
    label: "Bosnia",
  },

  {
    type: "historical_event",
    id: "russian-revolution-1917",
    label: "Revolución rusa de 1917",
  },

  {
    type: "movement",
    id: "generation-27",
    label: "Generación del 27",
  },

  {
    type: "movement",
    id: "creacionismo",
    label: "Creacionismo",
  },

  {
    type: "movement",
    id: "surrealism",
    label: "Surrealismo",
  },

  {
    type: "movement",
    id: "italian-hermeticism",
    label: "Hermetismo italiano",
  },

  {
    type: "movement",
    id: "lost-generation",
    label: "Generación Perdida",
  },

  {
    type: "movement",
    id: "brazilian-modernism",
    label: "Modernismo brasileño",
  },

  {
    type: "historical_event",
    id: "great-depression",
    label: "Gran Depresión",
  },

  {
    type: "tradition",
    id: "korean-folk-song",
    label: "Tradición de canción popular coreana",
  },

  {
    type: "movement",
    id: "afrocubanismo",
    label: "Afrocubanismo",
  },

  {
    type: "movement",
    id: "contemporaneos-mexico",
    label: "Contemporáneos",
  },

  {
    type: "concept",
    id: "lo-real-maravilloso",
    label: "Lo real maravilloso",
  },

  {
    type: "movement",
    id: "may-fourth-movement",
    label: "Movimiento del Cuatro de Mayo",
  },

  {
    type: "place",
    id: "argentina",
    label: "Argentina",
  },

  {
    type: "movement",
    id: "progressive-writers-association",
    label: "Progressive Writers' Association",
  },

  {
    type: "movement",
    id: "negritude",
    label: "Négritude",
  },

  {
    type: "tradition",
    id: "indian-english-fiction",
    label: "Narrativa india en inglés",
  },

  {
    type: "movement",
    id: "swedish-modernism",
    label: "Modernismo sueco",
  },

  {
    type: "movement",
    id: "chhayavad",
    label: "Chhayavad",
  },

  {
    type: "tradition",
    id: "american-literature",
    label: "Literatura estadounidense",
  },

  {
    type: "tradition",
    id: "gandhian-thought",
    label: "Pensamiento gandhiano",
  },

  {
    type: "tradition",
    id: "i-novel",
    label: "Tradición japonesa de la I-novel",
  },

  {
    type: "movement",
    id: "origenes-group",
    label: "Grupo Orígenes",
  },

  {
    type: "historical_event",
    id: "spanish-civil-war",
    label: "Guerra Civil española",
  },

  {
    type: "movement",
    id: "korean-modernism",
    label: "Modernismo coreano",
  },

  {
    type: "historical_event",
    id: "argentine-political-violence",
    label: "Violencia política argentina del siglo XX",
  },

  {
    type: "movement",
    id: "pakistani-progressive-literature",
    label: "Literatura progresista pakistaní",
  },

  {
    type: "movement",
    id: "australian-modernism",
    label: "Modernismo australiano",
  },

  {
    type: "tradition",
    id: "cuban-lyric-20c",
    label: "Lírica cubana del siglo XX",
  },

  {
    type: "historical_event",
    id: "partition-india-1947",
    label: "Partición de India de 1947",
  },

  {
    type: "movement",
    id: "czech-postwar-literature",
    label: "Literatura checa de posguerra",
  },

  {
    type: "movement",
    id: "latin-american-boom",
    label: "Boom latinoamericano",
  },

  {
    type: "concept",
    id: "antipoetry",
    label: "Antipoesía",
  },

  {
    type: "historical_event",
    id: "korean-war",
    label: "Guerra de Corea",
  },

  {
    type: "tradition",
    id: "australian-modern-poetry",
    label: "Poesía australiana moderna",
  },

  {
    type: "historical_event",
    id: "paraguayan-dictatorship",
    label: "Dictadura paraguaya del siglo XX",
  },

  {
    type: "oral_tradition",
    id: "yoruba-oral-tradition",
    label: "Tradición oral yoruba",
  },

  {
    type: "tradition",
    id: "brazilian-modern-prose",
    label: "Prosa brasileña moderna",
  },

  {
    type: "movement",
    id: "generation-45-uruguay",
    label: "Generación del 45 uruguaya",
  },

  {
    type: "movement",
    id: "generation-45-brazil",
    label: "Generación del 45 brasileña",
  },

  {
    type: "tradition",
    id: "nigerian-urban-literature",
    label: "Literatura urbana nigeriana",
  },

  {
    type: "movement",
    id: "generation-50-peru",
    label: "Generación del 50 peruana",
  },

  {
    type: "historical_event",
    id: "world-war-two",
    label: "Segunda Guerra Mundial",
  },

  {
    type: "historical_event",
    id: "apartheid",
    label: "Apartheid",
  },

  {
    type: "historical_event",
    id: "caribbean-migration-britain",
    label: "Migración caribeña a Gran Bretaña",
  },

  {
    type: "tradition",
    id: "polish-postwar-poetry",
    label: "Poesía polaca de posguerra",
  },

  {
    type: "tradition",
    id: "new-zealand-modern-literature",
    label: "Literatura moderna de Nueva Zelanda",
  },

  {
    type: "movement",
    id: "japanese-postwar-avant-garde",
    label: "Vanguardia japonesa de posguerra",
  },

  {
    type: "tradition",
    id: "indian-english-poetry",
    label: "Poesía india en inglés",
  },

  {
    type: "author",
    id: "nima-yushij",
    label: "Nima Yushij",
  },

  {
    type: "tradition",
    id: "japanese-postwar-literature",
    label: "Literatura japonesa de posguerra",
  },

  {
    type: "community",
    id: "adivasi-communities",
    label: "Comunidades adivasi",
  },

  {
    type: "tradition",
    id: "korean-postwar-novel",
    label: "Novela coreana de posguerra",
  },

  {
    type: "tradition",
    id: "francophone-african-postcolonial-literature",
    label: "Literatura africana francófona poscolonial",
  },

  {
    type: "movement",
    id: "caribbean-decolonization",
    label: "Descolonización literaria del Caribe",
  },

  {
    type: "tradition",
    id: "south-asian-multilingual-literature",
    label: "Literatura multilingüe del sur de Asia",
  },

  {
    type: "historical_event",
    id: "holocaust",
    label: "Holocausto",
  },

  {
    type: "movement",
    id: "generation-50-spain",
    label: "Generación del 50 española",
  },

  {
    type: "historical_event",
    id: "algerian-war-independence",
    label: "Guerra de Independencia de Argelia",
  },

  {
    type: "tradition",
    id: "african-feminist-literature",
    label: "Literatura feminista africana",
  },

  {
    type: "historical_event",
    id: "prague-spring-1968",
    label: "Primavera de Praga de 1968",
  },

  {
    type: "movement",
    id: "modern-arabic-poetry",
    label: "Poesía árabe moderna",
  },

  {
    type: "historical_event",
    id: "argentine-dictatorship-1976",
    label: "Dictadura argentina de 1976–1983",
  },

  {
    type: "tradition",
    id: "caribbean-nation-language",
    label: "Nation Language caribeño",
  },

  {
    type: "tradition",
    id: "canadian-short-story",
    label: "Cuento canadiense moderno",
  },

  {
    type: "tradition",
    id: "spanish-postwar-poetry",
    label: "Poesía española de posguerra",
  },

  {
    type: "tradition",
    id: "swedish-postwar-poetry",
    label: "Poesía sueca de posguerra",
  },

  {
    type: "movement",
    id: "african-modernist-poetry",
    label: "Poesía modernista africana",
  },

  {
    type: "tradition",
    id: "caribbean-postcolonial-literature",
    label: "Literatura caribeña poscolonial",
  },

  {
    type: "movement",
    id: "modern-persian-poetry",
    label: "Poesía persa moderna",
  },

  {
    type: "tradition",
    id: "yugoslav-postwar-literature",
    label: "Literatura yugoslava de posguerra",
  },

  {
    type: "movement",
    id: "nigerian-modernist-poetry",
    label: "Poesía modernista nigeriana",
  },

  {
    type: "oral_tradition",
    id: "ewe-oral-tradition",
    label: "Tradición oral ewe",
  },

  {
    type: "historical_event",
    id: "communist-albania",
    label: "Albania comunista",
  },

  {
    type: "movement",
    id: "african-decolonization",
    label: "Descolonización africana",
  },

  {
    type: "tradition",
    id: "african-postcolonial-novel",
    label: "Novela africana poscolonial",
  },

  {
    type: "historical_event",
    id: "division-of-korea",
    label: "División de Corea",
  },

  {
    type: "tradition",
    id: "diasporic-literature",
    label: "Literatura de la diáspora",
  },

  {
    type: "tradition",
    id: "australian-postcolonial-fiction",
    label: "Narrativa australiana poscolonial",
  },

  {
    type: "movement",
    id: "brazilian-concrete-poetry",
    label: "Poesía concreta brasileña",
  },

  {
    type: "tradition",
    id: "francophone-maghrebi-literature",
    label: "Literatura magrebí francófona",
  },

  {
    type: "movement",
    id: "maori-literary-renaissance",
    label: "Renacimiento literario māorí",
  },

  {
    type: "tradition",
    id: "somali-postcolonial-literature",
    label: "Literatura somalí poscolonial",
  },

  {
    type: "movement",
    id: "misty-poets",
    label: "Poetas Brumosos",
  },

  {
    type: "historical_event",
    id: "yugoslav-wars",
    label: "Guerras yugoslavas",
  },

  {
    type: "tradition",
    id: "caribbean-women-writing",
    label: "Escritura caribeña de mujeres",
  },

  {
    type: "historical_event",
    id: "pinochet-dictatorship",
    label: "Dictadura de Pinochet",
  },

  {
    type: "historical_event",
    id: "romanian-communism",
    label: "Comunismo rumano",
  },

  {
    type: "tradition",
    id: "hungarian-postwar-literature",
    label: "Literatura húngara de posguerra",
  },

  {
    type: "movement",
    id: "korean-feminist-poetry",
    label: "Poesía feminista coreana",
  },

  {
    type: "tradition",
    id: "indian-ocean-literature",
    label: "Literatura del océano Índico",
  },

  {
    type: "tradition",
    id: "nigerian-magical-realism",
    label: "Realismo mágico nigeriano",
  },

  {
    type: "tradition",
    id: "korean-contemporary-fiction",
    label: "Narrativa coreana contemporánea",
  },

  {
    type: "historical_event",
    id: "gwangju-uprising",
    label: "Levantamiento de Gwangju",
  },

  {
    type: "tradition",
    id: "hebrew-modern-literature",
    label: "Literatura hebrea moderna",
  },

  {
    type: "historical_event",
    id: "soviet-central-asia",
    label: "Asia Central soviética",
  },

  {
    type: "historical_event",
    id: "colonial-zanzibar",
    label: "Zanzíbar colonial",
  },

  {
    type: "movement",
    id: "angolan-independence",
    label: "Independencia de Angola",
  },

  {
    type: "tradition",
    id: "turkish-modernism",
    label: "Modernismo turco",
  },

  {
    type: "tradition",
    id: "francophone-congolese-literature",
    label: "Literatura congoleña francófona",
  },

  {
    type: "tradition",
    id: "pacific-postcolonial-literature",
    label: "Literatura poscolonial del Pacífico",
  },

  {
    type: "tradition",
    id: "italian-postwar-fiction",
    label: "Narrativa italiana de posguerra",
  },

  {
    type: "historical_event",
    id: "soviet-repression",
    label: "Represión soviética",
  },

  {
    type: "community",
    id: "waanyi-people",
    label: "Pueblo Waanyi",
  },

  {
    type: "tradition",
    id: "philippine-english-literature",
    label: "Literatura filipina en inglés",
  },

  {
    type: "community",
    id: "yankunytjatjara-people",
    label: "Pueblo Yankunytjatjara",
  },

  {
    type: "tradition",
    id: "mediterranean-francophone-literature",
    label: "Literatura mediterránea francófona",
  },

  {
    type: "historical_event",
    id: "soviet-collectivization",
    label: "Colectivización soviética",
  },

  {
    type: "historical_event",
    id: "bhopal-disaster",
    label: "Desastre de Bhopal",
  },

  {
    type: "movement",
    id: "black-feminist-literature",
    label: "Literatura feminista negra",
  },

  {
    type: "historical_event",
    id: "iranian-revolution-1979",
    label: "Revolución iraní de 1979",
  },

  {
    type: "tradition",
    id: "japanese-contemporary-fiction",
    label: "Narrativa japonesa contemporánea",
  },

  {
    type: "tradition",
    id: "filipino-diaspora-literature",
    label: "Literatura de la diáspora filipina",
  },

  {
    type: "institution",
    id: "kwani-trust",
    label: "Kwani Trust",
  },

  {
    type: "historical_event",
    id: "vietnam-war",
    label: "Guerra de Vietnam",
  },

  {
    type: "movement",
    id: "modern-hebrew-poetry",
    label: "Poesía hebrea moderna",
  },

  {
    type: "movement",
    id: "indonesian-generation-45",
    label: "Generación del 45 indonesia",
  },

  {
    type: "tradition",
    id: "victorian-novel",
    label: "Novela victoriana",
  },

  {
    type: "tradition",
    id: "victorian-women-novel",
    label: "Novela victoriana escrita por mujeres",
  },

  {
    type: "tradition",
    id: "uruguayan-modern-poetry",
    label: "Poesía uruguaya moderna",
  },

  {
    type: "tradition",
    id: "philippine-modern-poetry",
    label: "Poesía filipina moderna",
  },

  {
    type: "historical_event",
    id: "central-american-civil-wars",
    label: "Guerras civiles centroamericanas",
  },

  {
    type: "tradition",
    id: "uruguayan-exile-literature",
    label: "Literatura uruguaya del exilio",
  },

  {
    type: "tradition",
    id: "african-diaspora-literature",
    label: "Literatura africana de la diáspora",
  },

  {
    type: "tradition",
    id: "italian-fantastic-literature",
    label: "Literatura fantástica italiana",
  },

  {
    type: "community",
    id: "haisla-heiltsuk",
    label: "Pueblos Haisla-Heiltsuk",
  },

  {
    type: "tradition",
    id: "shanghai-modernism",
    label: "Modernidad literaria de Shanghái",
  },

  {
    type: "movement",
    id: "mexican-postrevolutionary-literature",
    label: "Literatura mexicana posrevolucionaria",
  },

  {
    type: "tradition",
    id: "mexican-testimonial-literature",
    label: "Literatura testimonial mexicana",
  },

  {
    type: "community",
    id: "mununjali-yugambeh",
    label: "Pueblos Mununjali-Yugambeh",
  },

  {
    type: "tradition",
    id: "philippine-postcolonial-literature",
    label: "Literatura filipina poscolonial",
  },

  {
    type: "tradition",
    id: "arab-women-diaspora-literature",
    label: "Literatura árabe de mujeres en la diáspora",
  },

  {
    type: "tradition",
    id: "uruguayan-fantastic-literature",
    label: "Literatura fantástica uruguaya",
  },

  {
    type: "movement",
    id: "new-york-school",
    label: "New York School",
  },

  {
    type: "community",
    id: "anishinaabe",
    label: "Anishinaabe",
  },

  {
    type: "historical_event",
    id: "nakba-1948",
    label: "Nakba de 1948",
  },

  {
    type: "historical_event",
    id: "nicaraguan-revolution",
    label: "Revolución nicaragüense",
  },

  {
    type: "tradition",
    id: "indonesian-modern-essay",
    label: "Ensayo indonesio moderno",
  },

  {
    type: "tradition",
    id: "luo-oral-tradition",
    label: "Tradición oral luo",
  },

  {
    type: "tradition",
    id: "iraqi-exile-literature",
    label: "Literatura iraquí del exilio",
  },

  {
    type: "tradition",
    id: "archaic-greek-poetry",
    label: "Poesía griega arcaica",
  },

  {
    type: "tradition",
    id: "lebanese-postwar-literature",
    label: "Literatura libanesa de posguerra",
  },

  {
    type: "tradition",
    id: "iranian-modern-fiction",
    label: "Narrativa iraní moderna",
  },

  {
    type: "tradition",
    id: "armenian-national-literature",
    label: "Literatura nacional armenia",
  },

  {
    type: "tradition",
    id: "russian-realism",
    label: "Realismo ruso",
  },

  {
    type: "community",
    id: "blackfeet-gros-ventre",
    label: "Pueblos Blackfeet-Gros Ventre",
  },

  {
    type: "tradition",
    id: "transnational-maritime-literature",
    label: "Literatura marítima transnacional",
  },

  {
    type: "oral_tradition",
    id: "quechua-oral-tradition",
    label: "Tradición oral quechua",
  },

  {
    type: "historical_event",
    id: "philippine-independence-movement",
    label: "Movimiento independentista filipino",
  },

  {
    type: "community",
    id: "muscogee-people",
    label: "Pueblo Muscogee",
  },

  {
    type: "tradition",
    id: "mexican-short-fiction",
    label: "Cuento mexicano moderno",
  },

  {
    type: "tradition",
    id: "medieval-castilian-literature",
    label: "Literatura castellana medieval",
  },

  {
    type: "historical_event",
    id: "mexican-revolution",
    label: "Revolución mexicana",
  },

  {
    type: "tradition",
    id: "japanese-modernism",
    label: "Modernismo japonés",
  },

  {
    type: "historical_event",
    id: "marshall-islands-nuclear-testing",
    label: "Pruebas nucleares en las Islas Marshall",
  },

  {
    type: "community",
    id: "noongar-people",
    label: "Pueblo Noongar",
  },

  {
    type: "tradition",
    id: "classical-sanskrit-literature",
    label: "Literatura sánscrita clásica",
  },

  {
    type: "community",
    id: "michi-saagiig-nishnaabeg",
    label: "Michi Saagiig Nishnaabeg",
  },

  {
    type: "community",
    id: "laguna-pueblo",
    label: "Laguna Pueblo",
  },

  {
    type: "community",
    id: "chickasaw-people",
    label: "Pueblo Chickasaw",
  },

  {
    type: "community",
    id: "ojibwe-people",
    label: "Pueblo Ojibwe",
  },

  {
    type: "historical_event",
    id: "italian-invasion-ethiopia",
    label: "Invasión italiana de Etiopía",
  },

  {
    type: "tradition",
    id: "turkmen-classical-poetry",
    label: "Poesía clásica turcomana",
  },

  {
    type: "tradition",
    id: "iranian-rural-fiction",
    label: "Narrativa rural iraní",
  },

  {
    type: "tradition",
    id: "argentine-modern-fiction",
    label: "Narrativa argentina moderna",
  },

  {
    type: "historical_event",
    id: "peruvian-land-conflicts",
    label: "Conflictos agrarios peruanos",
  },

  {
    type: "tradition",
    id: "uruguayan-modern-literature",
    label: "Literatura uruguaya moderna",
  },

  {
    type: "tradition",
    id: "american-vernacular-literature",
    label: "Literatura vernácula estadounidense",
  },

  {
    type: "tradition",
    id: "uruguayan-fantastic-poetry",
    label: "Poesía fantástica uruguaya",
  },

  {
    type: "tradition",
    id: "chilean-modernist-fiction",
    label: "Narrativa chilena moderna",
  },

  {
    type: "tradition",
    id: "philippine-australian-diaspora-literature",
    label: "Literatura filipino-australiana de la diáspora",
  },

  {
    type: "movement",
    id: "latin-american-magical-realism",
    label: "Realismo mágico latinoamericano",
  },

  {
    type: "tradition",
    id: "heian-court-literature",
    label: "Literatura cortesana Heian",
  },

  {
    type: "community",
    id: "kiowa-people",
    label: "Pueblo Kiowa",
  },

  {
    type: "tradition",
    id: "somali-diaspora-literature",
    label: "Literatura somalí de la diáspora",
  },

  {
    type: "tradition",
    id: "american-dark-romanticism",
    label: "Romanticismo oscuro estadounidense",
  },

  {
    type: "tradition",
    id: "vietnamese-classical-literature",
    label: "Literatura clásica vietnamita",
  },

  {
    type: "tradition",
    id: "philippine-hispanic-literature",
    label: "Literatura filipina de herencia hispánica",
  },

  {
    type: "tradition",
    id: "persian-romance-tradition",
    label: "Tradición persa del romance",
  },

  {
    type: "oral_tradition",
    id: "acholi-oral-tradition",
    label: "Tradición oral acholi",
  },

  {
    type: "community",
    id: "noonuccal-people",
    label: "Pueblo Noonuccal",
  },

  {
    type: "tradition",
    id: "turkish-postmodern-fiction",
    label: "Narrativa posmoderna turca",
  },

  {
    type: "tradition",
    id: "modern-hebrew-poetry-tradition",
    label: "Poesía hebrea moderna",
  },
  {
    type: "historical_event",
    id: "guatemalan-civil-war",
    label: "Guerra civil de Guatemala",
  },

  {
    type: "tradition",
    id: "mozambican-postcolonial-literature",
    label: "Literatura mozambiqueña poscolonial",
  },

  {
    type: "historical_event",
    id: "indonesian-colonialism-and-independence",
    label: "Colonialismo e independencia de Indonesia",
  },

  {
    type: "tradition",
    id: "honduran-social-poetry",
    label: "Poesía social hondureña",
  },

  {
    type: "historical_event",
    id: "salvadoran-political-violence",
    label: "Violencia política salvadoreña",
  },

  {
    type: "tradition",
    id: "mexican-indigenista-literature",
    label: "Literatura indigenista mexicana",
  },

  {
    type: "tradition",
    id: "turkish-modern-short-story",
    label: "Cuento turco moderno",
  },

  {
    type: "community",
    id: "palyku-people",
    label: "Pueblo Palyku",
  },

  {
    type: "tradition",
    id: "postcolonial-diasporic-fiction",
    label: "Narrativa poscolonial de la diáspora",
  },

  {
    type: "tradition",
    id: "indonesian-modern-poetry",
    label: "Poesía indonesia moderna",
  },

  {
    type: "historical_event",
    id: "rwandan-genocide-1994",
    label: "Genocidio de Ruanda de 1994",
  },

  {
    type: "tradition",
    id: "iranian-womens-literature",
    label: "Literatura iraní escrita por mujeres",
  },

  {
    type: "community",
    id: "spokane-coeur-dalene",
    label: "Pueblos Spokane-Coeur d'Alene",
  },

  {
    type: "tradition",
    id: "medieval-georgian-literature",
    label: "Literatura georgiana medieval",
  },

  {
    type: "tradition",
    id: "samoan-pacific-literature",
    label: "Literatura samoana y del Pacífico",
  },

  {
    type: "tradition",
    id: "thai-modern-literature",
    label: "Literatura tailandesa moderna",
  },

  {
    type: "community",
    id: "acoma-pueblo",
    label: "Acoma Pueblo",
  },

  {
    type: "tradition",
    id: "thai-classical-poetry",
    label: "Poesía clásica tailandesa",
  },

  {
    type: "tradition",
    id: "east-african-experimental-literature",
    label: "Literatura experimental de África oriental",
  },

  {
    type: "tradition",
    id: "indigenous-north-american-literature",
    label: "Literatura indígena norteamericana",
  },

  {
    type: "tradition",
    id: "zimbabwean-postcolonial-literature",
    label: "Literatura zimbabuense poscolonial",
  },

  {
    type: "tradition",
    id: "mahabharata-tradition",
    label: "Tradición del Mahābhārata",
  },

  {
    type: "tradition",
    id: "ramayana-tradition",
    label: "Tradición del Rāmāyaṇa",
  },

  {
    type: "tradition",
    id: "chinese-contemporary-fiction",
    label: "Narrativa china contemporánea",
  },

  {
    type: "tradition",
    id: "american-regionalist-fiction",
    label: "Narrativa regionalista estadounidense",
  },

  {
    type: "movement",
    id: "vietnamese-new-poetry",
    label: "Nueva Poesía vietnamita",
  },

  {
    type: "tradition",
    id: "anatolian-oral-narrative",
    label: "Narrativa oral de Anatolia",
  },

  {
    type: "tradition",
    id: "armenian-modern-poetry",
    label: "Poesía armenia moderna",
  },

  {
    type: "tradition",
    id: "kenyan-postcolonial-literature",
    label: "Literatura keniana poscolonial",
  },

  {
    type: "tradition",
    id: "south-african-postapartheid-literature",
    label: "Literatura sudafricana posapartheid",
  },

  {
    type: "tradition",
    id: "argentine-postwar-poetry",
    label: "Poesía argentina de posguerra",
  },

];