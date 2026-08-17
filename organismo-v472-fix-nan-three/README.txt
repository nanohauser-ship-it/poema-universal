ORGANISMO V4.7.2 · REPARACIÓN THREE.JS / NaN

Corrige el error:
THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN

La reparación:
- sustituye el temporizador por tiempo de requestAnimationFrame;
- valida biomasa, pulsos, BPM y métricas del organismo;
- evita multiplicaciones acumulativas de escala;
- repara posiciones no finitas en geometrías cargadas;
- aplica guardas antes de cada render;
- conserva la alimentación verbal V4.7.1.
