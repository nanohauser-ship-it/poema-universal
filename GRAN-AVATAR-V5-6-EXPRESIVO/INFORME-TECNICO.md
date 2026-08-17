# Gran Avatar V5.6 · Motor expresivo

## Cambio principal

Se añade un `avatarPerformanceSignal` que clasifica cada texto antes de
reproducir su voz en tres perfiles: `normal`, `intense` o `recital`.

## Selección

- `reading` siempre entra como `recital`.
- `speaking` puntúa términos de carga filosófica/emocional y patrones de
  reflexión. Solo con puntuación suficiente activa `intense`.
- El resto permanece en `normal`.

La clasificación es determinista y local. No añade latencia ni coste de API.

## Vídeos

- `avatar-speaking-normal-01.mp4`: 720×1280, 50 fps, 18.16 s.
- `avatar-speaking-intense-01.mp4`: 720×1280, 30 fps, ~6.33 s.

El vídeo intenso se recortó temporalmente antes de la zona más exagerada del
original. Si la voz continúa al terminar ese tramo, el motor cruza al vídeo
normal mediante el mismo sistema de fundido.

## Continuidad

Reposo, escucha, pensamiento y silencio siguen usando el máster continuo V5.
Los vídeos de interpretación solo aparecen mientras `avatarVoiceSignal` está
activo.
