import * as THREE from "three";

import {
  pieces,
  type PieceKind,
  type WorldPiece,
} from "../data/pieces";

import { worldById } from "../data/worlds";

type PieceMaterials = {
  body: THREE.MeshStandardMaterial;
  pale: THREE.MeshStandardMaterial;
  dark: THREE.MeshStandardMaterial;
  accent: THREE.MeshStandardMaterial;
};

function createMaterials(
  piece: WorldPiece
): PieceMaterials {
  const world = worldById[piece.world];

  return {
    body: new THREE.MeshStandardMaterial({
      color: world.lightSquare,
      roughness: piece.world === "bielka" ? 0.42 : 0.78,
      metalness: piece.world === "jerarquia" ? 0.2 : 0.04,
      transparent: piece.world === "bielka",
      opacity: piece.world === "bielka" ? 0.9 : 1,
    }),

    pale: new THREE.MeshStandardMaterial({
      color: 0xe5ded2,
      roughness: 0.7,
      emissive: world.accent,
      emissiveIntensity: 0.06,
    }),

    dark: new THREE.MeshStandardMaterial({
      color:
        piece.world === "jerarquia"
          ? 0x141316
          : 0x24262a,
      roughness: 0.84,
      metalness: piece.world === "jerarquia" ? 0.28 : 0.04,
    }),

    accent: new THREE.MeshStandardMaterial({
      color: world.accent,
      emissive: world.accent,
      emissiveIntensity: 0.25,
      roughness: 0.38,
      metalness: 0.28,
    }),
  };
}

function mesh(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  position: [number, number, number] = [0, 0, 0]
) {
  const object = new THREE.Mesh(geometry, material);

  object.position.set(...position);
  object.castShadow = true;
  object.receiveShadow = true;

  return object;
}

function addPedestal(
  group: THREE.Group,
  materials: PieceMaterials,
  radius = 0.43
) {
  const base = mesh(
    new THREE.CylinderGeometry(
      radius * 0.92,
      radius,
      0.18,
      32
    ),
    materials.dark,
    [0, 0.09, 0]
  );

  const ring = mesh(
    new THREE.TorusGeometry(
      radius * 0.72,
      0.025,
      10,
      42
    ),
    materials.accent,
    [0, 0.19, 0]
  );

  ring.rotation.x = Math.PI / 2;

  group.add(base, ring);
}

function createFigure(
  materials: PieceMaterials,
  options?: {
    height?: number;
    book?: boolean;
    veil?: boolean;
  }
) {
  const figure = new THREE.Group();
  const height = options?.height ?? 1;

  const body = mesh(
    new THREE.CylinderGeometry(
      0.11,
      0.27,
      0.78 * height,
      18
    ),
    materials.body,
    [0, 0.63 * height, 0]
  );

  const head = mesh(
    new THREE.SphereGeometry(
      0.16 * height,
      22,
      18
    ),
    materials.pale,
    [0, 1.12 * height, 0]
  );

  figure.add(body, head);

  if (options?.book) {
    const book = mesh(
      new THREE.BoxGeometry(0.42, 0.06, 0.29),
      materials.dark,
      [0.22, 0.7 * height, 0.08]
    );

    book.rotation.set(0.12, -0.25, -0.25);
    figure.add(book);
  }

  if (options?.veil) {
    const veil = mesh(
      new THREE.ConeGeometry(
        0.25,
        0.58,
        20,
        1,
        true
      ),
      materials.body,
      [0, 0.98 * height, 0.04]
    );

    veil.rotation.x = -0.16;
    figure.add(veil);
  }

  return figure;
}

function createProfessor(
  materials: PieceMaterials
) {
  const group = new THREE.Group();
  addPedestal(group, materials);

  const figure = createFigure(materials, {
    height: 1.08,
    book: true,
  });

  figure.position.y = 0.14;
  figure.rotation.y = -0.3;

  const verticalLine = mesh(
    new THREE.BoxGeometry(0.025, 0.9, 0.025),
    materials.accent,
    [-0.32, 0.83, 0]
  );

  group.add(figure, verticalLine);
  return group;
}

function createStudent(
  materials: PieceMaterials
) {
  const group = new THREE.Group();
  addPedestal(group, materials);

  const figure = createFigure(materials, {
    height: 0.96,
    book: true,
    veil: true,
  });

  figure.position.y = 0.14;
  figure.rotation.y = 0.3;

  group.add(figure);
  return group;
}

function createFriend(
  materials: PieceMaterials
) {
  const group = new THREE.Group();
  addPedestal(group, materials, 0.52);

  const first = createFigure(materials, {
    height: 0.82,
  });

  const second = createFigure(materials, {
    height: 0.82,
  });

  first.position.set(-0.22, 0.15, 0);
  second.position.set(0.22, 0.15, 0);

  const thread = mesh(
    new THREE.CylinderGeometry(
      0.018,
      0.018,
      0.46,
      10
    ),
    materials.accent,
    [0, 0.83, 0]
  );

  thread.rotation.z = Math.PI / 2;

  group.add(first, second, thread);
  return group;
}

function createUniversity(
  materials: PieceMaterials
) {
  const group = new THREE.Group();
  addPedestal(group, materials, 0.55);

  const tower = mesh(
    new THREE.BoxGeometry(0.62, 1.05, 0.48),
    materials.body,
    [0, 0.72, 0]
  );

  const roof = mesh(
    new THREE.ConeGeometry(0.49, 0.44, 4),
    materials.dark,
    [0, 1.46, 0]
  );

  roof.rotation.y = Math.PI / 4;

  const door = mesh(
    new THREE.BoxGeometry(0.22, 0.44, 0.04),
    materials.dark,
    [0, 0.48, 0.26]
  );

  const split = mesh(
    new THREE.BoxGeometry(0.035, 1.32, 0.035),
    materials.accent,
    [0.07, 0.9, 0.28]
  );

  split.rotation.z = 0.12;

  group.add(tower, roof, door, split);
  return group;
}

function createHunger(
  materials: PieceMaterials
) {
  const group = new THREE.Group();
  addPedestal(group, materials, 0.52);

  const hollow = mesh(
    new THREE.TorusGeometry(0.35, 0.095, 18, 52),
    materials.dark,
    [0, 0.85, 0]
  );

  const toothTop = mesh(
    new THREE.ConeGeometry(0.1, 0.42, 14),
    materials.accent,
    [0, 1.35, 0]
  );

  toothTop.rotation.z = Math.PI;

  const toothBottom = mesh(
    new THREE.ConeGeometry(0.1, 0.42, 14),
    materials.accent,
    [0, 0.35, 0]
  );

  group.add(hollow, toothTop, toothBottom);
  return group;
}

function createChild(
  materials: PieceMaterials
) {
  const group = new THREE.Group();
  addPedestal(group, materials);

  const figure = createFigure(materials, {
    height: 0.68,
  });

  figure.position.y = 0.14;

  const light = mesh(
    new THREE.SphereGeometry(0.07, 16, 14),
    materials.accent,
    [0.25, 0.72, 0.05]
  );

  group.add(figure, light);
  return group;
}

function createWatcher(
  materials: PieceMaterials
) {
  const group = new THREE.Group();
  addPedestal(group, materials);

  const body = mesh(
    new THREE.ConeGeometry(0.32, 1.28, 18),
    materials.dark,
    [0, 0.83, 0]
  );

  const head = mesh(
    new THREE.SphereGeometry(0.17, 20, 16),
    materials.dark,
    [0, 1.52, 0]
  );

  const eye = mesh(
    new THREE.BoxGeometry(0.24, 0.035, 0.04),
    materials.accent,
    [0, 1.53, 0.16]
  );

  group.add(body, head, eye);
  return group;
}

function createCrowd(
  materials: PieceMaterials
) {
  const group = new THREE.Group();
  addPedestal(group, materials, 0.62);

  const positions = [
    [-0.28, 0.12, -0.16],
    [0, 0.12, -0.22],
    [0.28, 0.12, -0.12],
    [-0.18, 0.12, 0.18],
    [0.18, 0.12, 0.18],
  ] as const;

  positions.forEach(([x, y, z], index) => {
    const figure = createFigure(materials, {
      height: index === 1 ? 0.66 : 0.55,
    });

    figure.position.set(x, y, z);
    group.add(figure);
  });

  return group;
}

function createAwakening(
  materials: PieceMaterials
) {
  const group = new THREE.Group();
  addPedestal(group, materials, 0.52);

  const body = mesh(
    new THREE.CylinderGeometry(
      0.13,
      0.23,
      0.73,
      18
    ),
    materials.pale,
    [0, 0.58, 0]
  );

  body.rotation.z = -0.72;

  const head = mesh(
    new THREE.SphereGeometry(0.15, 22, 18),
    materials.pale,
    [-0.3, 0.9, 0]
  );

  const breath = mesh(
    new THREE.TorusGeometry(0.25, 0.018, 10, 38),
    materials.accent,
    [0.31, 0.92, 0]
  );

  breath.rotation.y = Math.PI / 2;

  group.add(body, head, breath);
  return group;
}

function createCart(
  materials: PieceMaterials
) {
  const group = new THREE.Group();
  addPedestal(group, materials, 0.64);

  const cart = mesh(
    new THREE.BoxGeometry(0.86, 0.32, 0.54),
    materials.body,
    [0, 0.62, 0]
  );

  const straw = mesh(
    new THREE.SphereGeometry(0.43, 18, 12),
    materials.accent,
    [0, 0.85, 0]
  );

  straw.scale.set(1.15, 0.46, 0.78);

  const wheelGeometry =
    new THREE.TorusGeometry(0.19, 0.045, 10, 30);

  [-0.32, 0.32].forEach((x) => {
    [-0.3, 0.3].forEach((z) => {
      if (z > 0) return;

      const wheel = mesh(
        wheelGeometry,
        materials.dark,
        [x, 0.42, z]
      );

      wheel.rotation.y = Math.PI / 2;
      group.add(wheel);
    });
  });

  const handle = mesh(
    new THREE.CylinderGeometry(
      0.025,
      0.025,
      0.72,
      10
    ),
    materials.dark,
    [0.72, 0.61, 0]
  );

  handle.rotation.z = Math.PI / 2;

  group.add(cart, straw, handle);
  return group;
}

function createHeart(
  materials: PieceMaterials
) {
  const group = new THREE.Group();
  addPedestal(group, materials, 0.5);

  const left = mesh(
    new THREE.SphereGeometry(0.23, 24, 20),
    materials.accent,
    [-0.16, 0.94, 0]
  );

  const right = mesh(
    new THREE.SphereGeometry(0.23, 24, 20),
    materials.accent,
    [0.16, 0.94, 0]
  );

  left.scale.set(1, 1.2, 0.65);
  right.scale.set(1, 1.2, 0.65);

  left.rotation.z = -0.4;
  right.rotation.z = 0.4;

  const leftPoint = mesh(
    new THREE.ConeGeometry(0.22, 0.55, 20),
    materials.accent,
    [-0.12, 0.61, 0]
  );

  const rightPoint = mesh(
    new THREE.ConeGeometry(0.22, 0.55, 20),
    materials.accent,
    [0.12, 0.61, 0]
  );

  leftPoint.rotation.z = -0.18;
  rightPoint.rotation.z = 0.18;

  const separation = mesh(
    new THREE.BoxGeometry(0.035, 0.88, 0.06),
    materials.pale,
    [0, 0.77, 0.17]
  );

  separation.rotation.z = 0.12;

  group.add(
    left,
    right,
    leftPoint,
    rightPoint,
    separation
  );

  return group;
}

function createVoid(
  materials: PieceMaterials
) {
  const group = new THREE.Group();
  addPedestal(group, materials, 0.55);

  const verticalGeometry =
    new THREE.BoxGeometry(0.05, 1.16, 0.05);

  const horizontalGeometry =
    new THREE.BoxGeometry(0.92, 0.05, 0.05);

  const left = mesh(
    verticalGeometry,
    materials.pale,
    [-0.43, 0.85, 0]
  );

  const right = mesh(
    verticalGeometry,
    materials.pale,
    [0.43, 0.85, 0]
  );

  const top = mesh(
    horizontalGeometry,
    materials.pale,
    [0, 1.43, 0]
  );

  const bottom = mesh(
    horizontalGeometry,
    materials.pale,
    [0, 0.28, 0]
  );

  const trace = mesh(
    new THREE.TorusGeometry(0.18, 0.018, 10, 38),
    materials.accent,
    [0, 0.82, -0.02]
  );

  trace.rotation.y = Math.PI / 2;
  trace.scale.set(1, 1.65, 1);

  group.add(left, right, top, bottom, trace);
  return group;
}

function createShape(
  kind: PieceKind,
  materials: PieceMaterials
) {
  switch (kind) {
    case "professor":
      return createProfessor(materials);
    case "student":
      return createStudent(materials);
    case "friend":
      return createFriend(materials);
    case "university":
      return createUniversity(materials);
    case "hunger":
      return createHunger(materials);
    case "child":
      return createChild(materials);
    case "watcher":
      return createWatcher(materials);
    case "crowd":
      return createCrowd(materials);
    case "awakening":
      return createAwakening(materials);
    case "cart":
      return createCart(materials);
    case "heart":
      return createHeart(materials);
    case "void":
      return createVoid(materials);
  }
}

export function createWorldPieces() {
  const group = new THREE.Group();
  const interactiveObjects: THREE.Object3D[] = [];

  pieces.forEach((piece) => {
    const materials = createMaterials(piece);
    const sculpture = createShape(
      piece.kind,
      materials
    );

    const world = worldById[piece.world];

    sculpture.position.set(
      piece.position[0],
      world.height + 0.08,
      piece.position[1]
    );

    sculpture.rotation.y = piece.rotation || 0;

    const scale = piece.scale || 0.82;
    sculpture.scale.setScalar(scale);

    sculpture.userData.interactivePiece = true;
    sculpture.userData.pieceId = piece.id;
    sculpture.userData.baseScale = scale;

    group.add(sculpture);
    interactiveObjects.push(sculpture);
  });

  return {
    group,
    interactiveObjects,
  };
}
