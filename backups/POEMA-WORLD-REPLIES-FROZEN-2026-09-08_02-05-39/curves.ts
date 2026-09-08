import * as THREE from "three";

export const cameraPoints = [
  new THREE.Vector3(0, 2.8, 8.5),
  new THREE.Vector3(10, 2.7, 8.2),
  new THREE.Vector3(22, 2.9, 8.3),
  new THREE.Vector3(34, 3.2, 8.0),
  new THREE.Vector3(47, 3.0, 8.2),
  new THREE.Vector3(60, 3.3, 8.0),
  new THREE.Vector3(73, 3.1, 8.4),
  new THREE.Vector3(86, 3.3, 8.1),
  new THREE.Vector3(99, 3.8, 8.8),
  new THREE.Vector3(110, 4.5, 10.2),
];

export const cameraCurve = new THREE.CatmullRomCurve3(
  cameraPoints,
  false,
  "centripetal",
);

export const josePoints = [
  new THREE.Vector3(-1.5, 0.15, 0.8),
  new THREE.Vector3(8.5, 0.15, 0.65),
  new THREE.Vector3(20.5, 0.15, 0.75),
  new THREE.Vector3(33, 0.15, 0.7),
  new THREE.Vector3(46, 0.15, 0.75),
  new THREE.Vector3(59, 0.15, 0.7),
  new THREE.Vector3(72, 0.15, 0.75),
  new THREE.Vector3(85, 0.15, 0.7),
  new THREE.Vector3(98, 0.15, 0.7),
  new THREE.Vector3(108, 0.2, 0.75),
];

export const joseCurve = new THREE.CatmullRomCurve3(
  josePoints,
  false,
  "centripetal",
);

export const rotationTargets = [
  { progress: 0.00, rotation: new THREE.Euler(-0.02, 0.00, 0) },
  { progress: 0.10, rotation: new THREE.Euler(-0.04, 0.03, 0) },
  { progress: 0.20, rotation: new THREE.Euler(-0.07, -0.04, 0) },
  { progress: 0.32, rotation: new THREE.Euler(-0.03, 0.05, 0) },
  { progress: 0.44, rotation: new THREE.Euler(-0.08, -0.02, 0) },
  { progress: 0.56, rotation: new THREE.Euler(-0.03, 0.04, 0) },
  { progress: 0.68, rotation: new THREE.Euler(-0.06, -0.04, 0) },
  { progress: 0.80, rotation: new THREE.Euler(-0.04, 0.04, 0) },
  { progress: 0.91, rotation: new THREE.Euler(-0.09, 0.00, 0) },
  { progress: 1.00, rotation: new THREE.Euler(-0.12, 0.00, 0) },
];

export function getCameraRotation(progress: number) {
  for (let i = 0; i < rotationTargets.length - 1; i++) {
    const start = rotationTargets[i];
    const end = rotationTargets[i + 1];

    if (progress >= start.progress && progress <= end.progress) {
      const local =
        (progress - start.progress) /
        Math.max(end.progress - start.progress, 0.0001);

      const qa = new THREE.Quaternion().setFromEuler(start.rotation);
      const qb = new THREE.Quaternion().setFromEuler(end.rotation);

      return new THREE.Quaternion().slerpQuaternions(
        qa,
        qb,
        THREE.MathUtils.smoothstep(local, 0, 1),
      );
    }
  }

  return new THREE.Quaternion().setFromEuler(
    rotationTargets[rotationTargets.length - 1].rotation,
  );
}
