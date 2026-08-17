ORGANISMO V4.8.2 · REPARACIÓN DE GEOMETRÍA

Causa del error:
particleCount podía contener decimales porque se calculaba a partir de valores
de complejidad y memoria. Float32Array redondeaba su longitud internamente,
dejando el último vértice sin un conjunto XYZ completo. Three.js encontraba
undefined en ese vértice y computeBoundingSphere producía NaN.

La reparación:
- fuerza particleCount a un número entero;
- valida la nube de partículas antes del primer render;
- amplía la reparación a BufferAttribute e InterleavedBufferAttribute;
- conserva la rotación anatómica y los controles.
