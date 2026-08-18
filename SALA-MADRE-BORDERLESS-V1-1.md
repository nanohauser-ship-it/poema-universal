# Sala Madre — BORDERLESS V1.1

Esta entrega amplía exclusivamente `app/laboratorio-audiovisual/` sobre
BORDERLESS V1.

## Instalación

Coloca `SALA-MADRE-BORDERLESS-V1-1.zip` dentro de `~/poema-universal` y ejecuta:

```bash
cd ~/poema-universal
unzip -o "SALA-MADRE-BORDERLESS-V1-1.zip" -d .
npm run dev
```

Después abre `http://localhost:3000/laboratorio-audiovisual`.

## Prueba recomendada

1. Entra en **Performance**.
2. Activa la cámara y después **Recorte IA**.
3. Comprueba Presencia, Gigante, Fantasma y Ecos.
4. Pulsa **Abrir umbral**: el performer debe desplazarse hacia el portal con
   transición suave.
5. Pulsa **Atravesar**: HUMAN_LAYER y sus duplicados deben aparecer anclados en
   Pasaje 01, delante de la cámara.
6. Regresa al umbral y cierra: el performer debe recuperar su posición y luz de
   Sala Madre.

## Motor de luz humana

- exposición y contraste;
- saturación y calidez;
- viñeta integrada en la silueta;
- halo de borde generado a partir de la máscara semántica;
- filtros y gradientes precalculados al cambiar de etapa;
- la segmentación continúa usando el fotograma original sin etalonar.

## Anclajes espaciales

Cada etapa BORDERLESS puede declarar un desplazamiento, rotación, escala y
opacidad relativos para HUMAN_LAYER. Los presets humanos siguen siendo la base,
por lo que Gigante y Ecos conservan su comportamiento durante el recorrido.

## Restauración

El estado completo de BORDERLESS V1 está incluido en:

`backups/laboratorio-audiovisual-before-borderless-v1-1/`

Para restaurarlo:

```bash
cd ~/poema-universal
cp -R backups/laboratorio-audiovisual-before-borderless-v1-1/. app/laboratorio-audiovisual/
```
