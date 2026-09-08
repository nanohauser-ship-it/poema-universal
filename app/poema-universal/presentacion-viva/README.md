# Poema Universal · Presentación Viva

Motor audiovisual experimental.

## Ruta

/poema-universal/presentacion-viva

## Modos

Interacción:
- scroll = recorrido
- espacio = play / pause
- R = reiniciar
- 1 = Umbral
- 2 = Voces
- 3 = Libro / Árbol
- H = ocultar HUD
- F = fullscreen

Grabación automática:

/poema-universal/presentacion-viva?record=1

Duración configurable:

/poema-universal/presentacion-viva?record=1&duration=92

## Arquitectura

01 · ThresholdScene
02 · VoicesScene
03 · BookTreeScene

La cámara se desplaza por una CatmullRomCurve3.
La orientación se interpola mediante quaternion slerp.
Las escenas responden a un progress global 0 → 1.

No existe audio.
El sistema está diseñado para grabación limpia.
