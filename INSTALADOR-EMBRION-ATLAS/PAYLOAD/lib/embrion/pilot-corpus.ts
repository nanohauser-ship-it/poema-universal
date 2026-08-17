import type {
  Author,
  Claim,
  ClaimEvidence,
  GenealogyEdge,
  GenealogyNode,
  Passage,
  Period,
  Source,
  Work,
} from "./types";

export const PILOT_ACCESSED_AT = "2026-08-10";

export const periods: Period[] = [
  { id: "medieval", label: "Edad Media", shortLabel: "Medieval", startYear: 1200, endYear: 1491, order: 1, color: "#a68a62", description: "Tránsito, juicio y orden colectivo de la muerte.", isPilot: true },
  { id: "renaissance", label: "Renacimiento", shortLabel: "Renacimiento", startYear: 1492, endYear: 1599, order: 2, color: "#87907b", description: "La vida terrena se mide frente a una esfera eterna y armónica.", isPilot: true },
  { id: "baroque", label: "Barroco", shortLabel: "Barroco", startYear: 1600, endYear: 1699, order: 3, color: "#9e6049", description: "Caducidad material, desengaño y resistencia del deseo.", isPilot: true },
  { id: "enlightenment", label: "Ilustración / Neoclasicismo", shortLabel: "Ilustración", startYear: 1700, endYear: 1799, order: 4, color: "#b7a77c", description: "Periodo abierto: la muestra piloto aún no permite una lectura suficiente.", isPilot: false },
  { id: "romanticism", label: "Romanticismo", shortLabel: "Romanticismo", startYear: 1800, endYear: 1879, order: 5, color: "#796d78", description: "Muerte individual, espectral y afectiva.", isPilot: true },
  { id: "fin_de_siecle", label: "Fin de siglo / Modernismo / Generación del 98", shortLabel: "Fin de siglo / 98", startYear: 1880, endYear: 1913, order: 6, color: "#798589", description: "Memoria íntima, paisaje y pregunta existencial.", isPilot: true },
  { id: "avant_garde_war", label: "Vanguardias / Generación del 27 / Guerra / Exilio", shortLabel: "27 / Guerra / Exilio", startYear: 1914, endYear: 1939, order: 7, color: "#a84835", description: "Cuerpo, herida, duelo y memoria ante la violencia histórica.", isPilot: true },
  { id: "postwar_contemporary", label: "Posguerra / Transición / Contemporaneidad", shortLabel: "Posguerra / Hoy", startYear: 1940, endYear: 2026, order: 8, color: "#6d7773", description: "Periodo no incorporado todavía: pendiente de selección y derechos.", isPilot: false },
];

export const authors: Author[] = [
  { id: "anonymous-medieval", name: "Anónimo", territory: "Corona de Castilla", language: "castellano medieval" },
  { id: "jorge-manrique", name: "Jorge Manrique", birthYear: 1440, deathYear: 1479, territory: "Corona de Castilla", language: "castellano" },
  { id: "fray-luis", name: "Fray Luis de León", birthYear: 1527, deathYear: 1591, territory: "Corona de Castilla", language: "castellano" },
  { id: "gongora", name: "Luis de Góngora", birthYear: 1561, deathYear: 1627, territory: "Monarquía Hispánica", language: "castellano" },
  { id: "quevedo", name: "Francisco de Quevedo", birthYear: 1580, deathYear: 1645, territory: "Monarquía Hispánica", language: "castellano" },
  { id: "espronceda", name: "José de Espronceda", birthYear: 1808, deathYear: 1842, territory: "España", language: "español" },
  { id: "becquer", name: "Gustavo Adolfo Bécquer", birthYear: 1836, deathYear: 1870, territory: "España", language: "español" },
  { id: "unamuno", name: "Miguel de Unamuno", birthYear: 1864, deathYear: 1936, territory: "España", language: "español" },
  { id: "machado", name: "Antonio Machado", birthYear: 1875, deathYear: 1939, territory: "España", language: "español" },
  { id: "lorca", name: "Federico García Lorca", birthYear: 1898, deathYear: 1936, territory: "España", language: "español" },
  { id: "hernandez", name: "Miguel Hernández", birthYear: 1910, deathYear: 1942, territory: "España", language: "español" },
];

export const sources: Source[] = [
  { id: "src-danza", institution: "Open Iberia/América · University of Oregon", title: "Dança general de la Muerte", url: "https://scholarsbank.uoregon.edu/bitstreams/4341edcd-7cd4-4596-a977-0e554eb92aee/download", accessedAt: PILOT_ACCESSED_AT, editionNote: "Antología universitaria abierta con transcripción y versión normalizada del texto anónimo.", reliability: "institutional_edition" },
  { id: "src-manrique", institution: "Biblioteca Virtual Miguel de Cervantes", title: "Obra completa — Coplas", url: "https://www.cervantesvirtual.com/obra-visor/obra-completa--0/html/ff6c9480-82b1-11df-acc7-002185ce6064_5.html", accessedAt: PILOT_ACCESSED_AT, editionNote: "Edición digital institucional.", reliability: "institutional_edition" },
  { id: "src-fray-luis", institution: "Biblioteca Virtual Miguel de Cervantes", title: "Poesías — Noche serena", url: "https://www.cervantesvirtual.com/obra-visor/poesias--3/html/01e9471c-82b2-11df-acc7-002185ce6064_3.html", accessedAt: PILOT_ACCESSED_AT, editionNote: "Edición digital institucional.", reliability: "institutional_edition" },
  { id: "src-gongora", institution: "Biblioteca Virtual Miguel de Cervantes", title: "Mientras por competir con tu cabello", url: "https://www.cervantesvirtual.com/portales/ver_la_poesia/709080_mientras_competir/", accessedAt: PILOT_ACCESSED_AT, editionNote: "Texto y adaptación accesible de la BVMC.", reliability: "institutional_edition" },
  { id: "src-quevedo", institution: "Biblioteca Virtual Miguel de Cervantes", title: "Antología poética — Amor constante más allá de la muerte", url: "https://www.cervantesvirtual.com/obra-visor/antologia-poetica--39/html/ffa6b3fe-82b1-11df-acc7-002185ce6064_2.html", accessedAt: PILOT_ACCESSED_AT, editionNote: "Edición digital institucional.", reliability: "institutional_edition" },
  { id: "src-espronceda", institution: "Biblioteca Virtual Miguel de Cervantes", title: "El estudiante de Salamanca", url: "https://www.cervantesvirtual.com/obra-visor/el-estudiante-de-salamanca--0/html/fedd8060-82b1-11df-acc7-002185ce6064_3.html", accessedAt: PILOT_ACCESSED_AT, editionNote: "Edición digital institucional con numeración de versos.", reliability: "institutional_edition" },
  { id: "src-becquer", institution: "Biblioteca Virtual Miguel de Cervantes", title: "Rimas y leyendas — Rima LXXIII", url: "https://www.cervantesvirtual.com/obra-visor/rimas-y-leyendas--0/html/00053dfc-82b2-11df-acc7-002185ce6064_2.html", accessedAt: PILOT_ACCESSED_AT, editionNote: "Edición digital institucional.", reliability: "institutional_edition" },
  { id: "src-unamuno", institution: "Biblioteca Virtual Miguel de Cervantes", title: "Estudio: Unamuno y su Elegía en la muerte de un perro", url: "https://www.cervantesvirtual.com/obra-visor/de-valleincln-a-len-felipe-0/html/ffa9452e-82b1-11df-acc7-002185ce6064_11.html", accessedAt: PILOT_ACCESSED_AT, editionNote: "Estudio institucional; el MVP conserva solo metadatos, no reproduce el poema.", reliability: "institutional_study" },
  { id: "src-machado", institution: "Biblioteca Virtual Miguel de Cervantes", title: "Poesías completas — A José María Palacio", url: "https://www.cervantesvirtual.com/obra-visor/poesias-completas-1158024/html/613eab1d-2c06-4d6f-bb4f-453605cb6d5c_2.html", accessedAt: PILOT_ACCESSED_AT, editionNote: "Edición digital institucional, fechada por el autor.", reliability: "institutional_edition" },
  { id: "src-lorca", institution: "Biblioteca Virtual Miguel de Cervantes", title: "Llanto por Ignacio Sánchez Mejías", url: "https://www.cervantesvirtual.com/obra-visor/llanto-por-ignacio-sanchez-mejias-785143/html/e0c85a1b-ec35-497d-b4c9-b11bcc62d25f_2.html", accessedAt: PILOT_ACCESSED_AT, editionNote: "Edición digital institucional.", reliability: "institutional_edition" },
  { id: "src-hernandez", institution: "Biblioteca Virtual Miguel de Cervantes", title: "El rayo que no cesa — Elegía", url: "https://www.cervantesvirtual.com/obra-visor/el-rayo-que-no-cesa-1057848/html/71430300-911c-4f9c-ad06-e1cb831439dc_2.html", accessedAt: PILOT_ACCESSED_AT, editionNote: "Edición digital institucional.", reliability: "institutional_edition" },
];

export const works: Work[] = [
  { id: "danza-muerte", title: "Dança general de la Muerte", authorId: "anonymous-medieval", dateStart: 1400, dateEnd: 1468, dateLabel: "siglo XV", datePrecision: "approximate", periodId: "medieval", movement: ["danza macabra"], territory: "Corona de Castilla", language: "castellano medieval", sourceId: "src-danza", rightsStatus: "public_domain", rightsNote: "Texto histórico en dominio público; transcripción universitaria citada.", textStatus: "excerpt_indexed", curatorialTags: ["igualación", "juicio", "personificación"] },
  { id: "coplas-manrique", title: "Coplas por la muerte de su padre", authorId: "jorge-manrique", dateStart: 1476, dateEnd: 1479, dateLabel: "c. 1476–1479", datePrecision: "composition_range", periodId: "medieval", movement: ["poesía cancioneril", "elegía"], territory: "Corona de Castilla", language: "castellano", sourceId: "src-manrique", rightsStatus: "public_domain", rightsNote: "Obra en dominio público; edición digital citada.", textStatus: "excerpt_indexed", curatorialTags: ["tránsito", "fugacidad", "igualación"] },
  { id: "noche-serena", title: "Noche serena", authorId: "fray-luis", dateStart: 1570, dateEnd: 1580, dateLabel: "c. 1570–1580", datePrecision: "approximate", periodId: "renaissance", movement: ["Renacimiento", "poesía ascética"], territory: "Corona de Castilla", language: "castellano", sourceId: "src-fray-luis", rightsStatus: "public_domain", rightsNote: "Obra en dominio público; edición digital citada.", textStatus: "excerpt_indexed", curatorialTags: ["eternidad", "trascendencia", "armonía"] },
  { id: "gongora-cabello", title: "Mientras por competir con tu cabello", authorId: "gongora", dateStart: 1582, dateEnd: 1582, dateLabel: "1582", datePrecision: "approximate", periodId: "baroque", movement: ["Barroco", "culteranismo"], territory: "Monarquía Hispánica", language: "castellano", sourceId: "src-gongora", rightsStatus: "public_domain", rightsNote: "Obra en dominio público; edición digital citada.", textStatus: "excerpt_indexed", curatorialTags: ["carpe diem", "vanitas", "corrupción"] },
  { id: "quevedo-amor", title: "Amor constante más allá de la muerte", authorId: "quevedo", dateStart: 1600, dateEnd: 1645, dateLabel: "primer tercio del siglo XVII", datePrecision: "approximate", periodId: "baroque", movement: ["Barroco", "conceptismo"], territory: "Monarquía Hispánica", language: "castellano", sourceId: "src-quevedo", rightsStatus: "public_domain", rightsNote: "Obra en dominio público; edición digital citada.", textStatus: "excerpt_indexed", curatorialTags: ["cuerpo", "ceniza", "deseo"] },
  { id: "estudiante-salamanca", title: "El estudiante de Salamanca", authorId: "espronceda", dateStart: 1836, dateEnd: 1840, dateLabel: "1836–1840", datePrecision: "publication", periodId: "romanticism", movement: ["Romanticismo"], territory: "España", language: "español", sourceId: "src-espronceda", rightsStatus: "public_domain", rightsNote: "Obra en dominio público; edición digital citada.", textStatus: "excerpt_indexed", curatorialTags: ["espectro", "destino", "pasión"] },
  { id: "rima-lxxiii", title: "Rima LXXIII", authorId: "becquer", dateStart: 1868, dateEnd: 1871, dateLabel: "publicada en 1871", datePrecision: "publication", periodId: "romanticism", movement: ["Posromanticismo"], territory: "España", language: "español", sourceId: "src-becquer", rightsStatus: "public_domain", rightsNote: "Obra en dominio público; edición digital citada.", textStatus: "excerpt_indexed", curatorialTags: ["soledad", "rito funerario", "recuerdo"] },
  { id: "elegia-perro", title: "Elegía en la muerte de un perro", authorId: "unamuno", dateStart: 1907, dateEnd: 1907, dateLabel: "1907", datePrecision: "publication", periodId: "fin_de_siecle", movement: ["Generación del 98", "poesía existencial"], territory: "España", language: "español", sourceId: "src-unamuno", rightsStatus: "public_domain", rightsNote: "Autor fallecido en 1936; el MVP no reproduce el texto hasta fijar edición primaria.", textStatus: "metadata_only", curatorialTags: ["criatura", "Dios", "inmortalidad"] },
  { id: "a-palacio", title: "A José María Palacio", authorId: "machado", dateStart: 1913, dateEnd: 1913, dateLabel: "29 de abril de 1913", datePrecision: "exact", periodId: "fin_de_siecle", movement: ["Generación del 98"], territory: "España", language: "español", sourceId: "src-machado", rightsStatus: "public_domain", rightsNote: "Autor fallecido en 1939; edición digital institucional citada.", textStatus: "excerpt_indexed", curatorialTags: ["memoria", "paisaje", "ausencia"] },
  { id: "llanto-ignacio", title: "Llanto por Ignacio Sánchez Mejías", authorId: "lorca", dateStart: 1934, dateEnd: 1935, dateLabel: "1935", datePrecision: "publication", periodId: "avant_garde_war", movement: ["Generación del 27", "elegía"], territory: "España", language: "español", sourceId: "src-lorca", rightsStatus: "public_domain", rightsNote: "Autor fallecido en 1936; edición digital institucional citada.", textStatus: "excerpt_indexed", curatorialTags: ["cuerpo", "herida", "rito"] },
  { id: "elegia-sije", title: "Elegía a Ramón Sijé", authorId: "hernandez", dateStart: 1936, dateEnd: 1936, dateLabel: "1936", datePrecision: "publication", periodId: "avant_garde_war", movement: ["Generación del 36", "elegía"], territory: "España", language: "español", sourceId: "src-hernandez", rightsStatus: "public_domain", rightsNote: "Autor fallecido en 1942; edición digital institucional citada.", textStatus: "excerpt_indexed", curatorialTags: ["duelo", "tierra", "amistad"] },
];

export const passages: Passage[] = [
  { id: "p-danza", workId: "danza-muerte", excerpt: "Yo soy la Muerte cierta a todas criaturas, / que son y serán en el mundo durante", locator: "copla I, vv. 1–2 (versión normalizada)", conceptIds: ["muerte", "igualación", "personificación"], legalDisplay: "short_excerpt" },
  { id: "p-manrique", workId: "coplas-manrique", excerpt: "Nuestras vidas son los ríos / que van a dar en la mar, / que es el morir", locator: "Copla III", conceptIds: ["muerte", "tránsito", "tiempo"], legalDisplay: "short_excerpt" },
  { id: "p-fray-luis", workId: "noche-serena", excerpt: "¿Es más que un breve punto / el bajo y torpe suelo, comparado / con ese gran trasunto?", locator: "vv. 36–38", conceptIds: ["muerte", "eternidad"], legalDisplay: "short_excerpt" },
  { id: "p-gongora", workId: "gongora-cabello", excerpt: "en tierra, en humo, en polvo, en sombra, en nada", locator: "v. 14", conceptIds: ["muerte", "cuerpo", "tiempo"], legalDisplay: "short_excerpt" },
  { id: "p-quevedo", workId: "quevedo-amor", excerpt: "serán ceniza, mas tendrá sentido; / polvo serán, mas polvo enamorado", locator: "vv. 13–14", conceptIds: ["muerte", "amor", "cuerpo"], legalDisplay: "short_excerpt" },
  { id: "p-espronceda", workId: "estudiante-salamanca", excerpt: "¡calma luego, / oh muerte, mi inquietud!", locator: "vv. 239–240", conceptIds: ["muerte", "pasión"], legalDisplay: "short_excerpt" },
  { id: "p-becquer", workId: "rima-lxxiii", excerpt: "¡Dios mío, qué solos / se quedan los muertos!", locator: "estribillo", conceptIds: ["muerte", "soledad"], legalDisplay: "short_excerpt" },
  { id: "p-unamuno-meta", workId: "elegia-perro", excerpt: "Texto no reproducido en este piloto: evidencia limitada a metadatos y estudio crítico.", locator: "registro de obra", conceptIds: ["muerte", "Dios", "criatura"], legalDisplay: "metadata_only" },
  { id: "p-machado", workId: "a-palacio", excerpt: "en una tarde azul, sube al Espino, / al alto Espino donde está su tierra", locator: "vv. finales", conceptIds: ["muerte", "memoria", "paisaje"], legalDisplay: "short_excerpt" },
  { id: "p-lorca", workId: "llanto-ignacio", excerpt: "Lo demás era muerte y sólo muerte / a las cinco de la tarde", locator: "La cogida y la muerte", conceptIds: ["muerte", "cuerpo", "rito"], legalDisplay: "short_excerpt" },
  { id: "p-hernandez", workId: "elegia-sije", excerpt: "Yo quiero ser llorando el hortelano / de la tierra que ocupas y estercolas", locator: "estrofa 1", conceptIds: ["muerte", "duelo", "tierra"], legalDisplay: "short_excerpt" },
];

const dimensions = (corpusCoverage: number, sourceQuality = 0.92, agreement = 0.72, temporalCoverage = 0.55) => ({ corpusCoverage, sourceQuality, agreement, temporalCoverage });

export const claims: Claim[] = [
  { id: "claim-medieval", conceptId: "muerte", periodId: "medieval", kind: "computational_interpretation", title: "Tránsito e igualación", statement: "En la muestra medieval, la muerte aparece como tránsito y como fuerza que iguala jerarquías sociales.", method: "Coincidencia de campos semánticos en dos pasajes anotados: tránsito, final común e igualación.", limitations: ["Solo dos obras medievales en el piloto.", "La conclusión describe esta muestra, no toda la poesía medieval."], evidenceGrade: "suggestive", evidenceDimensions: dimensions(0.46, 0.96, 0.86, 0.42), createdBy: "deterministic_analysis", analysisVersion: "muerte-pilot-1.0" },
  { id: "claim-renaissance", conceptId: "muerte", periodId: "renaissance", kind: "computational_interpretation", title: "La vida como medida mínima", statement: "El único testimonio renacentista del piloto desplaza la muerte explícita hacia el contraste entre la brevedad terrena y un orden eterno.", method: "Lectura de proximidad sobre un pasaje anotado con vida breve, suelo y eternidad.", limitations: ["Evidencia limitada: una sola obra.", "No se infiere una tendencia general del Renacimiento."], evidenceGrade: "limited", evidenceDimensions: dimensions(0.18, 0.95, 0.48, 0.22), createdBy: "curator", analysisVersion: "muerte-pilot-1.0" },
  { id: "claim-baroque", conceptId: "muerte", periodId: "baroque", kind: "computational_interpretation", title: "Materia deshecha, deseo persistente", statement: "En los dos sonetos barrocos, el cuerpo se vuelve polvo; una voz culmina en la nada y otra imagina la persistencia del deseo.", method: "Contraste de imágenes materiales y verbos de persistencia en dos sonetos.", limitations: ["Dos autores canónicos no representan por sí solos el Barroco.", "La oposición seleccionada depende de anotación curatorial."], evidenceGrade: "suggestive", evidenceDimensions: dimensions(0.48, 0.96, 0.82, 0.45), createdBy: "deterministic_analysis", analysisVersion: "muerte-pilot-1.0" },
  { id: "claim-enlightenment", conceptId: "muerte", periodId: "enlightenment", kind: "documental_fact", title: "Vacío del corpus piloto", statement: "No hay obras de Ilustración / Neoclasicismo incorporadas al corpus piloto.", method: "Conteo documental de obras vinculadas al periodo.", limitations: ["Un vacío de corpus no significa ausencia del tema en el periodo."], evidenceGrade: "solid_in_corpus", evidenceDimensions: dimensions(1, 1, 1, 1), createdBy: "deterministic_analysis", analysisVersion: "muerte-pilot-1.0" },
  { id: "claim-romanticism", conceptId: "muerte", periodId: "romanticism", kind: "computational_interpretation", title: "Individuo, espectro y soledad", statement: "La muerte romántica del piloto se concentra en una experiencia individual: pasión que expira, espectro y soledad del muerto.", method: "Agrupación de motivos anotados en un poema narrativo y una rima funeraria.", limitations: ["Dos obras y una selección de pasajes muy breve.", "La etiqueta romántica reúne momentos estéticos distintos."], evidenceGrade: "suggestive", evidenceDimensions: dimensions(0.43, 0.94, 0.77, 0.38), createdBy: "deterministic_analysis", analysisVersion: "muerte-pilot-1.0" },
  { id: "claim-fin", conceptId: "muerte", periodId: "fin_de_siecle", kind: "computational_interpretation", title: "Ausencia alojada en paisaje y conciencia", statement: "En la muestra de fin de siglo, la muerte se desplaza hacia el recuerdo íntimo, el paisaje y la pregunta por la continuidad de la conciencia.", method: "Cruce entre etiquetas de paisaje-memoria y un estudio crítico sobre la elegía unamuniana.", limitations: ["El texto de Unamuno no está indexado: evidencia parcial.", "El periodo contiene corrientes heterogéneas."], evidenceGrade: "limited", evidenceDimensions: dimensions(0.31, 0.82, 0.61, 0.31), createdBy: "curator", analysisVersion: "muerte-pilot-1.0" },
  { id: "claim-war", conceptId: "muerte", periodId: "avant_garde_war", kind: "computational_interpretation", title: "Cuerpo herido y duelo material", statement: "En las dos elegías de los años treinta, la muerte se inscribe en el cuerpo, la hora, la herida y la tierra del duelo.", method: "Recurrencia y coaparición de cuerpo, herida, tierra, rito y duelo en dos pasajes elegíacos.", limitations: ["El piloto no distingue aún poesía de guerra, exilio y vanguardias.", "Solo dos obras, ambas elegías personales."], evidenceGrade: "suggestive", evidenceDimensions: dimensions(0.47, 0.96, 0.84, 0.34), createdBy: "deterministic_analysis", analysisVersion: "muerte-pilot-1.0" },
  { id: "claim-contemporary", conceptId: "muerte", periodId: "postwar_contemporary", kind: "documental_fact", title: "Periodo pendiente de derechos", statement: "La posguerra y la contemporaneidad no están incorporadas al piloto hasta completar selección, licencias y política de fragmentos.", method: "Auditoría documental del corpus piloto.", limitations: ["No permite afirmar nada sobre la evolución posterior a 1939."], evidenceGrade: "solid_in_corpus", evidenceDimensions: dimensions(1, 1, 1, 1), createdBy: "curator", analysisVersion: "muerte-pilot-1.0" },
];

export const claimEvidence: ClaimEvidence[] = [
  { claimId: "claim-medieval", passageId: "p-danza", relation: "supports", weight: 0.92, note: "La Muerte se presenta como destino de todas las criaturas; el motivo de igualación se contrasta con Manrique." },
  { claimId: "claim-medieval", passageId: "p-manrique", relation: "supports", weight: 0.94, note: "El río-mar representa un destino común y un tránsito." },
  { claimId: "claim-renaissance", passageId: "p-fray-luis", relation: "supports", weight: 0.72, note: "La vida terrena se reduce a un punto ante la eternidad; la muerte no se nombra." },
  { claimId: "claim-baroque", passageId: "p-gongora", relation: "supports", weight: 0.91, note: "Cadena descendente de materia a nada." },
  { claimId: "claim-baroque", passageId: "p-quevedo", relation: "qualifies", weight: 0.94, note: "La ceniza y el polvo conservan sentido amoroso, complicando la desaparición material." },
  { claimId: "claim-romanticism", passageId: "p-espronceda", relation: "supports", weight: 0.73, note: "Muerte invocada en primera persona dentro del drama pasional." },
  { claimId: "claim-romanticism", passageId: "p-becquer", relation: "supports", weight: 0.91, note: "El estribillo concentra muerte y soledad." },
  { claimId: "claim-fin", passageId: "p-unamuno-meta", relation: "qualifies", weight: 0.42, note: "Registro secundario: apoya los temas, no un análisis textual reproducible." },
  { claimId: "claim-fin", passageId: "p-machado", relation: "supports", weight: 0.89, note: "El cementerio aparece elípticamente dentro del paisaje recordado." },
  { claimId: "claim-war", passageId: "p-lorca", relation: "supports", weight: 0.93, note: "La repetición temporal fija el cuerpo y el rito de la muerte." },
  { claimId: "claim-war", passageId: "p-hernandez", relation: "supports", weight: 0.92, note: "El duelo se materializa en tierra, cuerpo y trabajo del hortelano." },
];

export const genealogyNodes: GenealogyNode[] = [
  { id: "g-transit", conceptId: "muerte", periodId: "medieval", label: "tránsito común", description: "La vida fluye hacia un final compartido.", claimId: "claim-medieval", lane: 1, intensity: 0.88 },
  { id: "g-judgement", conceptId: "muerte", periodId: "medieval", label: "igualación", description: "La muerte deshace la jerarquía terrena.", claimId: "claim-medieval", lane: 3, intensity: 0.84 },
  { id: "g-eternity", conceptId: "muerte", periodId: "renaissance", label: "orden eterno", description: "Lo terrestre se vuelve una medida mínima.", claimId: "claim-renaissance", lane: 1, intensity: 0.58 },
  { id: "g-vanitas", conceptId: "muerte", periodId: "baroque", label: "materia / nada", description: "Belleza y cuerpo terminan en polvo.", claimId: "claim-baroque", lane: 0, intensity: 0.92 },
  { id: "g-desire", conceptId: "muerte", periodId: "baroque", label: "deseo persistente", description: "El amor imagina una duración más allá del cuerpo.", claimId: "claim-baroque", lane: 2, intensity: 0.9 },
  { id: "g-spectral", conceptId: "muerte", periodId: "romanticism", label: "espectro / destino", description: "La muerte entra en el drama del individuo.", claimId: "claim-romanticism", lane: 0, intensity: 0.8 },
  { id: "g-solitude", conceptId: "muerte", periodId: "romanticism", label: "soledad", description: "El rito termina en la soledad del muerto.", claimId: "claim-romanticism", lane: 3, intensity: 0.87 },
  { id: "g-memory", conceptId: "muerte", periodId: "fin_de_siecle", label: "memoria / paisaje", description: "La ausencia queda alojada en un lugar recordado.", claimId: "claim-fin", lane: 3, intensity: 0.75 },
  { id: "g-consciousness", conceptId: "muerte", periodId: "fin_de_siecle", label: "conciencia", description: "La elegía abre una pregunta por la continuidad de la criatura.", claimId: "claim-fin", lane: 1, intensity: 0.52 },
  { id: "g-body", conceptId: "muerte", periodId: "avant_garde_war", label: "cuerpo herido", description: "La muerte se localiza en la herida y la materia.", claimId: "claim-war", lane: 0, intensity: 0.94 },
  { id: "g-grief", conceptId: "muerte", periodId: "avant_garde_war", label: "duelo material", description: "Hora, tierra y trabajo sostienen la memoria.", claimId: "claim-war", lane: 3, intensity: 0.96 },
];

export const genealogyEdges: GenealogyEdge[] = [
  { id: "e1", from: "g-transit", to: "g-eternity", relation: "transformation", confidence: 0.55, claimId: "claim-renaissance" },
  { id: "e2", from: "g-eternity", to: "g-vanitas", relation: "rupture", confidence: 0.64, claimId: "claim-baroque" },
  { id: "e3", from: "g-transit", to: "g-desire", relation: "transformation", confidence: 0.51, claimId: "claim-baroque" },
  { id: "e4", from: "g-vanitas", to: "g-spectral", relation: "transformation", confidence: 0.67, claimId: "claim-romanticism" },
  { id: "e5", from: "g-desire", to: "g-solitude", relation: "rupture", confidence: 0.62, claimId: "claim-romanticism" },
  { id: "e6", from: "g-solitude", to: "g-memory", relation: "transformation", confidence: 0.79, claimId: "claim-fin" },
  { id: "e7", from: "g-judgement", to: "g-consciousness", relation: "reappearance", confidence: 0.41, claimId: "claim-fin" },
  { id: "e8", from: "g-vanitas", to: "g-body", relation: "reappearance", confidence: 0.73, claimId: "claim-war" },
  { id: "e9", from: "g-memory", to: "g-grief", relation: "persistence", confidence: 0.84, claimId: "claim-war" },
  { id: "e10", from: "g-body", to: "g-grief", relation: "coexistence", confidence: 0.91, claimId: "claim-war" },
];
