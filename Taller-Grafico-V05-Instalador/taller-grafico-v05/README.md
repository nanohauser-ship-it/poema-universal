# Taller Gráfico — No dejes que desaparezcamos · V0.5

Versión centrada en funcionamiento real:

- Importación DOCX/TXT con detección estructural de prólogo, capítulos y epílogo.
- Arquitectura global separada del análisis de escenas.
- Análisis por capítulo con Structured Outputs y unidades gráficas basadas en rangos exactos del manuscrito.
- Dirección gráfica por unidad con contexto anterior/posterior y continuidad de láminas aprobadas/maestras.
- Generación GPT Image con calidad de prueba, trabajo o final.
- IndexedDB para proyecto, arquitectura y láminas; no usa localStorage para manuscritos grandes.
- Secuencia narrativa horizontal con miniaturas encadenadas.
- Webpack por defecto en desarrollo para evitar problemas previos de Turbopack/.next.
