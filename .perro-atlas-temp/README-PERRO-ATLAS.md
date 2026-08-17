# Segunda cámara del Atlas 3D

Incluye:
- El Perro de Sal que Guarda la Ausencia.
- Atlas público actualizado con dos criaturas.
- Cámara 3D procedural del perro.
- Ficha canónica, lámina y voz.
- Compatibilidad con la araña ya creada.

## Instalación

Con el ZIP dentro de la raíz del proyecto:

```bash
rm -rf .perro-atlas-temp
mkdir .perro-atlas-temp
unzip -q -o bestiario-perro-atlas-upgrade.zip -d .perro-atlas-temp
ditto .perro-atlas-temp/app ./app
ditto .perro-atlas-temp/lib ./lib
ditto .perro-atlas-temp/public ./public
npm run dev
```

Abre:

```text
http://localhost:3000/poema-universal/bestiario-poetico/atlas
```
