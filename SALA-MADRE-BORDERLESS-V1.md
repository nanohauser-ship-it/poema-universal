# Sala Madre — BORDERLESS V1

Esta entrega amplía exclusivamente `app/laboratorio-audiovisual/`.

## Instalación

1. Copia `SALA-MADRE-BORDERLESS-V1.zip` dentro de `~/poema-universal`.
2. Desde Terminal:

```bash
cd ~/poema-universal
unzip -o "SALA-MADRE-BORDERLESS-V1.zip" -d .
npm run dev
```

3. Abre `http://localhost:3000/laboratorio-audiovisual`.

## Recorrido

- En **Inmersión** o **Performance**, pulsa **Abrir umbral**.
- La cámara se aproxima a la abertura mientras desaparece la pared audiovisual.
- Pulsa **Atravesar** para entrar en **Pasaje 01**.
- Se conserva el gesto de arrastrar para mirar.
- Pulsa **Regresar al umbral** y después **Cerrar** para volver a Sala Madre.

## Arquitectura

- `BorderlessDirector` controla únicamente arquitectura transitable, estados y
  transición de cámara.
- `experiences/borderless.ts` contiene el contenido y los presets declarativos.
- `SurfaceManager` mantiene las superficies panorámicas y libera los vídeos al
  cerrar el pasaje.
- `SceneEngine` continúa siendo propietario de una única escena, cámara,
  renderer, reloj y ciclo `requestAnimationFrame`.
- Human Layer V3.3 y MediaPipe permanecen sin cambios.

## Restauración

La copia anterior está incluida en:

`backups/laboratorio-audiovisual-before-borderless-v1/`

Para restaurarla manualmente:

```bash
cd ~/poema-universal
cp -R backups/laboratorio-audiovisual-before-borderless-v1/. app/laboratorio-audiovisual/
```
