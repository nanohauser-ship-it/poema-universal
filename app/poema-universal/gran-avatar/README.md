# Dirección poética del Gran Avatar

La ruta y las APIs existentes se conservan. El modo `synchronized` sigue siendo
un cuerpo de vídeo; no tiene esqueleto, ojos independientes ni blendshapes.

## Uso

- `Intención` selecciona serenidad, contemplación, ternura, intensidad o silencio
  corporal. El silencio corporal permite mantener una imagen quieta durante la voz.
- Después de cargar un poema, `Dirigir la lectura` permite guardar pausas y cambios
  de intención en su archivo local. Las marcas se aplican en la siguiente lectura.
- Los tiempos son segundos del audio, excluyendo las pausas insertadas. No son
  segundos de reloj. Un cambio de velocidad no desplaza las marcas respecto al audio.
- La recitación termina con 2,4 segundos de silencio. Pausar también suspende ese
  silencio; continuar lo reanuda; detener cancela la sesión completa.
- Si vuelve a generarse el audio, hay que revisar las marcas. La caché es limitada
  y vive solo en memoria; no fija para siempre una interpretación del proveedor.

## Implementación

`avatarAudio.ts` posee solicitudes, medios y URLs de una sesión. Prepara hasta dos
fragmentos simultáneamente y espera sus duraciones antes de empezar. Esto prioriza
continuidad y progreso real, a cambio de una espera inicial mayor en poemas largos.
No solicita alineación labial porque los cuerpos locales actuales no la consumen.
Las rutas y la utilidad histórica de visemas siguen disponibles.

`avatarTimeline.ts` valida y ordena eventos con identificador único. El reloj de
silencio avanza separadamente del audio, y se suspende durante una pausa del usuario.
`avatarCapabilities.ts` rechaza gestos anatómicos que el recurso actual no puede
realizar. No se sustituyen con movimientos engañosos de toda la imagen.

El vídeo activo acompaña la voz con una interpretación como máximo por recitación,
sin bucles de manos, movimientos periódicos de cámara ni bombeo luminoso. Después
regresa al retrato. Pausa, silencio, pestaña oculta y movimiento reducido detienen
el movimiento. Los recursos originales permanecen en public sin alteraciones.

El modo alternativo `organism` conserva su plano con textura: se ha reducido la
respiración, introducido pausas de mirada y dobles parpadeos ocasionales, eliminado
el habla sintética durante el silencio y congelado el shader cuando corresponde.
Estas deformaciones no equivalen a un rig humano.

## Validación

Desde la raíz del proyecto:

```sh
node --test app/poema-universal/gran-avatar/tests/avatarRuntime.test.cjs
node_modules/.bin/eslint app/poema-universal/gran-avatar --no-cache
```

Las pruebas usan medios, red y reloj simulados, y cubren cancelación, pausas,
velocidad entre fragmentos, silencio final, errores concurrentes y confirmación
transaccional de IndexedDB. No sustituyen una prueba de voz real.

La comprobación con el proveedor durante esta implementación devuelve 429 por falta
de créditos. No se han modificado credenciales ni facturación. Para completar la
validación audiovisual hace falta que el servicio vuelva a estar disponible.

El control independiente de cuello, ojos, párpados, mandíbula, manos, dedos y peso
corporal requiere un recurso articulado o nuevas tomas específicamente dirigidas.
No se ha cambiado la arquitectura para fingir esas capacidades.
