# Embrión · atlas histórico

La ruta canónica nueva es `/embrion`. La experiencia histórica anterior permanece disponible en `/laboratorio/verso-tecno`; su API musical no ha sido modificada.

## Qué demuestra este MVP

- un corpus piloto para **MUERTE** con 11 obras y fuentes inspeccionables;
- una periodización editable con vacíos visibles;
- una genealogía ramificada cuyas aristas son hipótesis, no causalidades;
- un comparador entre periodos;
- preguntas respondidas prioritariamente desde el corpus;
- la acción “¿Por qué Embrión dice esto?” para abrir método, obras, pasajes, fuentes, grado y limitaciones;
- un genoma histórico determinista: cada variable visual corresponde a una métrica documentada.

## Capas

| Capa | Ubicación | Responsabilidad |
| --- | --- | --- |
| Dominio | `lib/embrion/types.ts` | Contratos documentales y analíticos |
| Corpus piloto | `lib/embrion/pilot-corpus.ts` | Periodos, autores, obras, pasajes, fuentes y afirmaciones |
| Análisis | `lib/embrion/analysis.ts` | Comparación y recuperación para preguntas |
| Evidencia | `lib/embrion/evidence.ts` | Resolución trazable de afirmación a fuente |
| Morfología | `lib/embrion/genome.ts` | Vector métrico y semilla visual determinista |
| API | `app/api/embrion/v1` | Contrato estable para sustituir JSON por repositorio SQL |
| Interfaz | `app/embrion` | Atlas, genealogía, comparador, pregunta y archivo de evidencia |
| Persistencia futura | `supabase/migrations/20260810120000_embrion_historical_atlas.sql` | Esquema normalizado y periodizaciones solapables |

## Reglas metodológicas incorporadas

1. `documental_fact`, `curatorial_annotation` y `computational_interpretation` son categorías diferentes.
2. Toda interpretación mostrada guarda `claimEvidence` y una versión de análisis.
3. El grado de evidencia combina cobertura del corpus, calidad de fuente, convergencia y cobertura temporal.
4. Una ausencia se formula como “no detectado en el corpus disponible”.
5. La síntesis con modelo es opcional. Sin `OPENAI_API_KEY`, la pregunta funciona con una síntesis determinista; con clave, el modelo recibe un paquete cerrado y sus `claimIds` se validan contra el conjunto permitido.
6. Los textos completos se separan de los metadatos y de los fragmentos para aplicar derechos por obra/edición.

## Siguiente umbral antes de escalar

- revisión filológica de fechas, títulos y ediciones por una persona curadora;
- incorporación de una edición primaria para Unamuno;
- muestra suficiente de Ilustración y política de licencias para 1940–actualidad;
- migración del corpus piloto a Supabase y políticas de lectura pública / escritura curatorial;
- pruebas de recuperación y evaluación contra preguntas históricas definidas por especialistas.
