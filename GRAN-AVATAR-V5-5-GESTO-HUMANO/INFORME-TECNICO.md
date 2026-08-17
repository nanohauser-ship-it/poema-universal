# Gran Avatar V5.5 · Gesto humano

## Cambio principal

V5.5 utiliza dos capas visuales simultáneas:

1. **Cuerpo maestro continuo**: nunca deja de correr.
2. **Interpretación de habla 50 fps**: aparece únicamente mientras existe señal de voz real.

El cuerpo maestro permanece activo detrás del clip de habla, de modo que la vuelta no exige buscar otro fotograma ni reiniciar el personaje.

## Reglas de continuidad

- Crossfade de ~1,15 s.
- Las pausas menores de ~720 ms no provocan cambio visual.
- El clip de habla no hace loop.
- Cerca de su final funde al máster continuo.
- La energía del TTS solo altera levemente la velocidad del movimiento.
- No se usan sprites de boca ni sustituciones faciales.

## Medio añadido

`public/poema-universal/gran-avatar/v55/avatar-speaking-master-01.mp4`

- 720 × 1280
- 50 fps
- sin audio
- optimizado H.264 para web
- marca inferior eliminada mediante recorte de zona segura
