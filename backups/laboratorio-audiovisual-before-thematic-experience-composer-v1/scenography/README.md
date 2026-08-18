# Generative Scenography Director V1

Esta capa convierte un `ScenographyBrief` en datos validados y compilables. La IA
solo planifica una vez por toma; nunca crea Three.js, shaders, URLs ni recursos en
el navegador. Si no hay credenciales, el generador local produce el mismo resultado
para una misma semilla.

## Flujo

1. `ArchitectureDirector` crea o recupera una toma.
2. La ruta local `api/architecture` intenta obtener un blueprint remoto.
3. `ArchitectureValidator` rechaza campos, módulos, materiales o límites no seguros.
4. `ArchitectureCompiler` traduce exclusivamente módulos de la biblioteca permitida.
5. `ArchitectureManager` intercambia arquitecturas dentro de `ARCHITECTURE_GROUP`.

## Configuración opcional del servidor

- `OPENAI_API_KEY`: credencial del servidor; nunca se envía al cliente.
- `SALA_MADRE_ARCHITECTURE_MODEL`: modelo dedicado para esta experiencia.
- `OPENAI_MODEL`: alternativa si no existe la variable anterior.

Sin estas variables, o si la respuesta remota falla la validación, se usa el fallback
determinista sin interrumpir la experiencia.
