# Gran Avatar V2 · presencia cinematográfica experimental

## Objetivo

Probar el nuevo personaje dentro de la aplicación real antes de construir el
rig definitivo. Esta versión prioriza presencia, luz, encuadre y transiciones.

## Qué cambia

- `cinematic` pasa a ser el cuerpo visual predeterminado.
- Reposo utiliza el nuevo retrato maestro 16:9.
- Escucha utiliza `avatar-acoge.mp4`.
- Lectura y respuesta utilizan `avatar-habla.mp4`.
- Los vídeos se reproducen `muted`; el audio sigue procediendo de la ruta de voz
  existente de Poema Universal.
- Se redujo el oscurecimiento del rostro respecto al organismo V1.

## Respaldo

Siguen disponibles:

- `NEXT_PUBLIC_GRAN_AVATAR_BODY_MODE=organism`
- `NEXT_PUBLIC_GRAN_AVATAR_BODY_MODE=live`

El instalador crea una copia de seguridad completa de cada archivo sustituido
antes de escribir la V2.

## Límites de esta prueba

- Lipsync visual aproximado: todavía no fonético.
- Los vídeos de Pippit conservan la marca de la exportación de prueba.
- El estado de escucha es deliberadamente experimental; la sonrisa puede ser
  demasiado abierta para la dirección final.
- Esta versión no altera conversación, memoria, poemas, TTS ni transcripción.
