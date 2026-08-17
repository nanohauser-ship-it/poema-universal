# Gran Avatar V3 · Sincronización labial

## Arquitectura

`voice/route.ts` continúa generando el audio TTS. La V3 añade `align/route.ts`,
que usa `whisper-1` con `response_format: verbose_json` y marcas temporales de
palabra. El cliente transforma esas marcas en una línea temporal de visemas.

La animación no intenta fingir que el vídeo pregrabado pronuncia una frase nueva.
Durante `reading` y `speaking`, `SynchronizedAvatarBody` usa poses extraídas de una
misma toma del personaje y las cambia según `audio.currentTime`. El vídeo de
escucha sigue disponible para el estado `listening`.

## Visemas

- REST
- A
- E
- I
- O
- U
- MBP
- FV
- L

La segmentación es deliberadamente contenida: se limita el número de poses por
palabra para evitar un resultado nervioso. Los huecos temporales vuelven a REST.

## Fallback

Si `/align` no responde, el sistema calcula tiempos aproximados según longitud de
palabra y duración real del archivo de audio. De ese modo la lectura no queda
bloqueada por el segundo análisis.

## Respaldo

El instalador crea una copia de todos los archivos que vaya a sustituir en:

`backups/gran-avatar-sincronizado-v3-<timestamp>/`
