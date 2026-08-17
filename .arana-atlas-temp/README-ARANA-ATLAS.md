# Primera cámara del Atlas 3D

Incluye:
- Atlas público.
- Ficha canónica de La Araña de las Cartas No Enviadas.
- Cámara 3D procedural sin depender todavía de un archivo GLB.
- Lámina oficial.
- Voz conectada a `/api/bestiario-poetico/voz`.

## Instalación

Con el ZIP dentro de la raíz del proyecto:

```bash
rm -rf .arana-atlas-temp
mkdir .arana-atlas-temp
unzip -q -o bestiario-arana-atlas-upgrade.zip -d .arana-atlas-temp
ditto .arana-atlas-temp/app ./app
ditto .arana-atlas-temp/lib ./lib
ditto .arana-atlas-temp/public ./public
npm run dev
```

Abre:

```text
http://localhost:3000/poema-universal/bestiario-poetico/atlas
```
