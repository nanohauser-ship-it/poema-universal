ORGANISMO V4.7 · REPARACIÓN DEFINITIVA

Este paquete corrige las causas concretas mostradas por Terminal:

1. La V4.6 y la primera V4.7 importaban una API que no existe en el motor real:
   cambiarMetabolismo, migrarOrganismo y evolucionarHastaAhora.
2. El motor real exporta evolucionarHastaHoy y usa edad.
3. Varias copias y carpetas de instaladores estaban dentro del proyecto y
   TypeScript intentaba compilarlas como si fueran parte de la aplicación.
4. La escena Three.js conservaba mount como posiblemente nulo dentro de una
   función anidada.

El instalador conserva todo lo anterior dentro de backups/ y valida únicamente
la sala que quedará activa.
