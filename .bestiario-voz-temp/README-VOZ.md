# Voz de la criatura — actualización

Esta actualización añade al Bestiario Poético:

- frase propia de la criatura dentro de la revelación;
- botón «Escuchar su voz»;
- generación de audio bajo demanda;
- pausa y repetición en el navegador;
- aviso visible de que la voz está generada por IA;
- ruta segura de servidor `/api/bestiario-poetico/voz`.

## Variables

La clave existente `OPENAI_API_KEY` es suficiente. Opcionalmente añade a `.env.local`:

```env
OPENAI_TTS_MODEL=gpt-4o-mini-tts
OPENAI_TTS_VOICE=marin
```

Si no añades estas líneas, se usan esos valores por defecto.

## Copia

Desde la raíz de `poema-universal`, después de descomprimir el paquete:

```bash
ditto ~/Downloads/bestiario-poetico-voz-upgrade/app ./app
ditto ~/Downloads/bestiario-poetico-voz-upgrade/lib ./lib
```

Reinicia después:

```bash
npm run dev
```

Genera una criatura nueva. Las criaturas reveladas antes de esta actualización no contienen el campo `voice` y deberán generarse otra vez.
