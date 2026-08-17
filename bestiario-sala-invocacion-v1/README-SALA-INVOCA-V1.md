# Bestiario Poético — Sala de invocación V1

Modelos esperados:
- public/models/bestiario/elegiamon.glb
- public/models/bestiario/cordero-llama-fria.glb
- public/models/bestiario/guardiana-alas-cuerda.glb
- public/models/bestiario/esfinge-del-umbral.glb

Instalación:
rm -rf .bestiario-sala-temp
mkdir .bestiario-sala-temp
unzip -q -o bestiario-sala-invocacion-v1.zip -d .bestiario-sala-temp
ditto .bestiario-sala-temp/app ./app
ditto .bestiario-sala-temp/lib ./lib
npm run dev

Ruta:
http://localhost:3000/poema-universal/bestiario-poetico
