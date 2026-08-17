# El Gran Avatar · organismo propio

## Arquitectura reutilizada

- Se conserva `GranAvatarExperience`: entrada de poemas, biblioteca local,
  conversación, micrófono, lectura, progreso y controles.
- Se conservan las rutas actuales de conversación, voz, transcripción y la ruta
  de sesión LiveAvatar.
- Se conservan IndexedDB y `avatarArchiveStore` sin crear persistencia paralela.
- Se reutilizan React Three Fiber, Drei y Three.js, ya presentes en el proyecto.
- LiveAvatar queda encapsulado como cuerpo alternativo y no se elimina.

## Arquitectura nueva

- `AvatarBody` decide entre `organism` (predeterminado) y `live` (respaldo).
- `PoeticOrganism` proyecta el retrato sobre una geometría subdividida y aplica
  respiración, deriva corporal, parpadeo, mirada, pensamiento y labios mediante
  un shader WebGL ligero.
- `avatarVoiceSignal` mide la energía RMS de la voz local con Web Audio. La boca
  responde al audio real y dispone de una señal procedural de respaldo.
- El retrato está acompañado por una imagen estática accesible durante la carga o
  cuando el navegador no puede iniciar WebGL.

## Archivos que modifica el instalador

- `app/poema-universal/gran-avatar/GranAvatarExperience.tsx`
- `app/poema-universal/gran-avatar/avatarConfig.ts`
- `app/poema-universal/gran-avatar/gran-avatar.module.css`
- `app/poema-universal/gran-avatar/types.ts`
- `app/poema-universal/gran-avatar/components/AvatarBody.tsx`

## Archivos que crea

- `app/poema-universal/gran-avatar/components/LiveAvatarBody.tsx`
- `app/poema-universal/gran-avatar/components/OrganismAvatarBody.tsx`
- `app/poema-universal/gran-avatar/components/PoeticOrganism.tsx`
- `app/poema-universal/gran-avatar/lib/avatarVoiceSignal.ts`
- `public/poema-universal/gran-avatar/organism-portrait.webp`

## Seguridad y reversibilidad

El instalador realiza primero una copia de cada archivo existente y escribe un
`manifest.json` antes de integrar el código. No modifica secretos, `.env.local`,
Supabase, tablas, dependencias ni rutas API.

## Validación realizada

- TypeScript estricto: correcto.
- ESLint con configuración Next.js (Core Web Vitals + TypeScript): correcto.
- `next build` con Next.js 16.2.3: correcto.
- Ruta estática verificada: `/poema-universal/gran-avatar`.
- Las cuatro rutas API del Gran Avatar compilan como rutas dinámicas.
- La comprobación visual automatizada quedó limitada por la ausencia de Chromium
  en el entorno de empaquetado; el fallback estático y la compilación WebGL sí
  quedaron integrados y tipados.

## Riesgos conocidos

- Un retrato nuevo con otro encuadre requerirá recalibrar coordenadas de ojos y
  boca en el shader.
- El lipsync es expresivo y dependiente de amplitud, no fonético.
- En dispositivos sin WebGL aparece el retrato fijo; la conversación y la voz
  permanecen disponibles.
