# Taller Gráfico — No dejes que desaparezcamos

MVP de una herramienta privada de producción para construir la novela gráfica **a la par de la novela**, fragmento por fragmento.

## Qué hace ya

- Importa `.docx` y `.txt` y divide el manuscrito en fragmentos de trabajo.
- Permite navegar por el texto y fijar un fragmento activo.
- Trabaja en tres modos: literal, poético y elíptico.
- Construye una dirección gráfica editable: acción, emoción, plano, cámara, composición, luz, color, símbolo, fuera de campo, texto visible, silencio y prompt maestro.
- Sin API key: funciona con una dirección local de respaldo para poder diseñar el flujo.
- Con `OPENAI_API_KEY`: usa la Responses API para lectura/dirección y GPT Image 2 para generación.
- Conserva láminas, estados y versiones en `localStorage` del navegador.
- Estados: desarrollo, aprobada y maestra.
- Botón **NO ESTÁ A LA ALTURA** para forzar un replanteamiento conceptual en lugar de una simple variación estética.
- Panel de ADN visual canónico.

## Arranque

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre `http://localhost:3000`.

## Activar IA real

En `.env.local`:

```bash
OPENAI_API_KEY=tu_clave
OPENAI_TEXT_MODEL=gpt-5.6
OPENAI_IMAGE_MODEL=gpt-image-2
```

La clave solo se utiliza en rutas de servidor; no se envía al navegador.

## Siguiente fase recomendada

1. Segmentar por capítulos/escenas en lugar de solo párrafos.
2. Crear fichas persistentes de personajes, vestuario, lugares, objetos y reliquias.
3. Cargar imágenes maestras como referencias visuales.
4. Añadir continuidad automática entre la lámina anterior, actual y siguiente.
5. Implementar edición de una imagen existente y no solo generación nueva.
6. Añadir versiones A/B/C y comparación visual.
7. Migrar persistencia desde `localStorage` a SQLite/Supabase cuando la estructura quede fijada.
