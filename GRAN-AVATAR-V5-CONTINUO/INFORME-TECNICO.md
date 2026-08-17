# Gran Avatar V5 · cuerpo continuo

## Decisión de arquitectura
Se elimina el montaje visual por sustitución de clips durante los cambios de
estado. `SynchronizedAvatarBody` mantiene una sola etiqueta `<video>` activa y
la reproduce de forma continua.

## Gobernanza por estado
- `idle`: 0.76x, busto.
- `listening`: 0.79x, lateral suave.
- `thinking`: 0.67x, lateral opuesto, luz contenida.
- `paused`: 0.58x, retrato.
- `reading`: 0.91x + energía de voz, secuencia lenta de cámara.
- `speaking`: 0.94x + energía de voz, secuencia lenta de cámara.

La transición de `playbackRate` se interpola en `requestAnimationFrame`; no se
aplican pausas ni seeks durante los estados.

## Audio
`avatarVoiceSignal` continúa midiendo RMS del TTS. V5 usa únicamente su nivel
para una corrección máxima muy pequeña de velocidad. La alineación de palabras
y visemas sigue disponible en el proyecto, pero no altera el rostro.

## Activo nuevo
`public/poema-universal/gran-avatar/v5/avatar-master-continuous.mp4`
- 720×1280
- 30 fps
- H.264
- sin audio
- ~55 s
- optimizado para web

## Objetivo visual
Continuidad temporal > sincronización aparente. El cuerpo nunca desaparece,
nunca cambia de identidad y nunca se recompone con sprites.
