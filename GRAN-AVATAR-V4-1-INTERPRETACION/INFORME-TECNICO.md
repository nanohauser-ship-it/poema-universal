# Gran Avatar V4.1 — interpretación por vídeo

V4.1 sustituye el lip-sync visual agresivo de V4 por una estrategia híbrida.
El audio TTS sigue analizado por `avatarVoiceSignal` y la cronología de visemas
sigue disponible, pero el render facial principal es ahora vídeo humano.

## Control en tiempo real

- `avatarVoiceSignal.level` activa/desactiva el movimiento y gobierna `playbackRate`.
- Histéresis de silencio evita play/pause nervioso.
- Las pausas superiores a ~145 ms cruzan a un frame cerrado del mismo actor.
- Los visemas aplican únicamente un `rate nudge` pequeño.
- `reading` y `speaking` empiezan en puntos distintos del mismo clip.
- El final del clip se reinicia oculto por un fundido de ~210 ms.

## Gramática de cámara

La capa de vídeo se mueve lentamente entre busto, retrato, íntimo y laterales.
No se cambia de identidad ni de render facial entre planos.

## Estados silenciosos

Se derivan cuatro microvídeos del vídeo maestro, sin audio: reposo, escucha,
pensamiento y pausa. Solo se reproduce el estado visible para no decodificar
varios vídeos simultáneamente.

## Respaldos

El instalador copia cada archivo existente a `backups/gran-avatar-v4-1-interpretacion-*`
antes de integrar el payload.
