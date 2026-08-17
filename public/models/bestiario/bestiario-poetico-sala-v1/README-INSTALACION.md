# Bestiario Poético — Sala nueva V1

## Modelos esperados

```text
public/models/bestiario/guardiana-alas-cuerda.glb
public/models/bestiario/cordero-llama-fria.glb
public/models/bestiario/elegiamon.glb
public/models/bestiario/presencia-elefantina-amarilla.glb
```

## Instalación

Desde la raíz de `poema-universal`:

```bash
rm -rf /tmp/bestiario-poetico-sala-v1
mkdir -p /tmp/bestiario-poetico-sala-v1

unzip -q -o ~/Downloads/bestiario-poetico-sala-v1.zip \
  -d /tmp/bestiario-poetico-sala-v1

cp -f /tmp/bestiario-poetico-sala-v1/app/poema-universal/bestiario-poetico/page.tsx \
  app/poema-universal/bestiario-poetico/page.tsx

cp -f /tmp/bestiario-poetico-sala-v1/app/poema-universal/bestiario-poetico/components/BestiaryHall.tsx \
  app/poema-universal/bestiario-poetico/components/BestiaryHall.tsx

cp -f /tmp/bestiario-poetico-sala-v1/app/poema-universal/bestiario-poetico/components/BestiaryScene.tsx \
  app/poema-universal/bestiario-poetico/components/BestiaryScene.tsx

cp -f /tmp/bestiario-poetico-sala-v1/app/poema-universal/bestiario-poetico/components/bestiary-hall.module.css \
  app/poema-universal/bestiario-poetico/components/bestiary-hall.module.css

mkdir -p lib/bestiario-poetico

cp -f /tmp/bestiario-poetico-sala-v1/lib/bestiario-poetico/guardians.ts \
  lib/bestiario-poetico/guardians.ts

pkill -f "next dev"
rm -rf .next
npm run dev
```

## Ruta

```text
http://localhost:3000/poema-universal/bestiario-poetico
```

## Nota

La V1 realiza la selección del guardián en el cliente mediante un sistema simbólico de palabras clave. La siguiente fase puede conectar la ceremonia con la API real de análisis poético y generar una lámina descargable.
