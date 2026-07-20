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

function cylinderBetween(
  start: THREE.Vector3,
  end: THREE.Vector3,
  radius: number,
  material: THREE.Material
) {
  const direction = new THREE.Vector3().subVectors(
    end,
    start
  );

  const length = direction.length();

  const cylinder = mesh(
    new THREE.CylinderGeometry(
      radius,
      radius,
      length,
      12
    ),
    material
  );

  cylinder.position
    .copy(start)
    .add(end)
    .multiplyScalar(0.5);

  cylinder.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().normalize()
  );

  return cylinder;
}

function createExile(
  materials: PieceMaterials
) {
  const group = new THREE.Group();
  addPedestal(group, materials, 0.55);

  const leftCoat = mesh(
    new THREE.BoxGeometry(0.31, 1.15, 0.46),
    materials.dark,
    [-0.19, 0.84, 0]
  );

  const rightCoat = mesh(
    new THREE.BoxGeometry(0.31, 1.15, 0.46),
    materials.dark,
    [0.19, 0.84, 0]
  );

  leftCoat.rotation.z = 0.055;
  rightCoat.rotation.z = -0.055;

  const shoulders = mesh(
    new THREE.BoxGeometry(0.72, 0.17, 0.49),
    materials.dark,
    [0, 1.39, 0]
  );

  const head = mesh(
    new THREE.SphereGeometry(0.18, 24, 18),
    materials.pale,
    [0, 1.68, 0]
  );

  head.scale.set(0.82, 1.08, 0.76);

  const chestVoid = mesh(
    new THREE.BoxGeometry(0.3, 0.34, 0.055),
    materials.dark,
    [0, 1.04, 0.245]
  );

  const houseGroup = new THREE.Group();
  houseGroup.name = "exile-house";
  houseGroup.position.set(0, 1.03, 0.285);

  const house = mesh(
    new THREE.BoxGeometry(0.17, 0.16, 0.09),
    materials.accent
  );

  const roof = mesh(
    new THREE.ConeGeometry(0.14, 0.13, 4),
    materials.accent,
    [0, 0.135, 0]
  );

  roof.rotation.y = Math.PI / 4;

  const door = mesh(
    new THREE.BoxGeometry(0.045, 0.07, 0.012),
    materials.dark,
    [0, -0.035, 0.052]
  );

  houseGroup.add(house, roof, door);

  const coatTailLeft = mesh(
    new THREE.ConeGeometry(0.24, 0.54, 4),
    materials.dark,
    [-0.18, 0.31, 0]
  );

  const coatTailRight = mesh(
    new THREE.ConeGeometry(0.24, 0.54, 4),
    materials.dark,
    [0.18, 0.31, 0]
  );

  coatTailLeft.rotation.y = Math.PI / 4;
  coatTailRight.rotation.y = Math.PI / 4;

  group.add(
    leftCoat,
    rightCoat,
    shoulders,
    head,
    chestVoid,
    houseGroup,
    coatTailLeft,
    coatTailRight
  );

  return group;
}

function createAbstractHand(
  side: -1 | 1,
  materials: PieceMaterials
) {
  const hand = new THREE.Group();

  const forearmStart = new THREE.Vector3(
    side * 0.74,
    0.48,
    0
  );

  const forearmEnd = new THREE.Vector3(
    side * 0.34,
    0.82,
    0
  );

  hand.add(
    cylinderBetween(
      forearmStart,
      forearmEnd,
      0.095,
      materials.body
    )
  );

  const palm = mesh(
    new THREE.SphereGeometry(0.17, 22, 18),
    materials.pale,
    [side * 0.25, 0.88, 0]
  );

  palm.scale.set(0.72, 1.1, 0.5);
  hand.add(palm);

  const fingerOffsets = [-0.07, 0, 0.07];

  fingerOffsets.forEach((offset, index) => {
    const start = new THREE.Vector3(
      side * 0.19,
      0.91 + offset,
      index === 1 ? 0.025 : 0
    );

    const end = new THREE.Vector3(
      side * (0.05 + index * 0.012),
      0.94 + offset * 0.45,
      0
    );

    hand.add(
      cylinderBetween(
        start,
        end,
        0.025,
        materials.pale
      )
    );
  });

  return hand;
}

function createPromise(
  materials: PieceMaterials
) {
  const group = new THREE.Group();
  addPedestal(group, materials, 0.64);

  const leftHand = createAbstractHand(
    -1,
    materials
  );

  const rightHand = createAbstractHand(
    1,
    materials
  );

  leftHand.name = "promise-left";
  rightHand.name = "promise-right";

  leftHand.userData.baseX = -0.06;
  rightHand.userData.baseX = 0.06;

  leftHand.position.x = -0.06;
  rightHand.position.x = 0.06;

  const thread = cylinderBetween(
    new THREE.Vector3(-0.07, 0.95, 0.01),
    new THREE.Vector3(0.07, 0.95, 0.01),
    0.012,
    materials.accent
  );

  thread.name = "promise-thread";

  const suspendedPoint = mesh(
    new THREE.SphereGeometry(0.035, 14, 12),
    materials.accent,
    [0, 0.95, 0.01]
  );

  suspendedPoint.name = "promise-light";

  group.add(
    leftHand,
    rightHand,
    thread,
    suspendedPoint
  );

  return group;
}

function createWoundedUniversity(
  materials: PieceMaterials
) {
  const group = new THREE.Group();
  addPedestal(group, materials, 0.59);

  const leftTower = mesh(
    new THREE.BoxGeometry(0.46, 1.12, 0.52),
    materials.body,
    [-0.27, 0.78, 0]
  );

  const rightTower = mesh(
    new THREE.BoxGeometry(0.46, 1.12, 0.52),
    materials.body,
    [0.27, 0.78, 0]
  );

  leftTower.rotation.z = 0.025;
  rightTower.rotation.z = -0.025;

  const leftRoof = mesh(
    new THREE.ConeGeometry(0.38, 0.38, 4),
    materials.dark,
    [-0.27, 1.52, 0]
  );

  const rightRoof = mesh(
    new THREE.ConeGeometry(0.38, 0.38, 4),
    materials.dark,
    [0.27, 1.52, 0]
  );

  leftRoof.rotation.y = Math.PI / 4;
  rightRoof.rotation.y = Math.PI / 4;

  const doorLeft = mesh(
    new THREE.BoxGeometry(0.14, 0.38, 0.035),
    materials.dark,
    [-0.12, 0.45, 0.275]
  );

  const doorRight = mesh(
    new THREE.BoxGeometry(0.14, 0.38, 0.035),
    materials.dark,
    [0.12, 0.45, 0.275]
  );

  const fissure = mesh(
    new THREE.BoxGeometry(0.045, 1.45, 0.05),
    materials.accent,
    [0, 0.89, 0.29]
  );

  fissure.rotation.z = 0.07;

  const branchGroup = new THREE.Group();
  branchGroup.name = "university-branch";
  branchGroup.position.set(0, 1.02, 0.34);

  const stem = cylinderBetween(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.02, 0.55, 0),
    0.025,
    materials.pale
  );

  const branchLeft = cylinderBetween(
    new THREE.Vector3(0.01, 0.32, 0),
    new THREE.Vector3(-0.19, 0.51, 0),
    0.018,
    materials.pale
  );

  const branchRight = cylinderBetween(
    new THREE.Vector3(0.01, 0.4, 0),
    new THREE.Vector3(0.2, 0.59, 0),
    0.018,
    materials.pale
  );

  branchGroup.add(
    stem,
    branchLeft,
    branchRight
  );

  group.add(
    leftTower,
    rightTower,
    leftRoof,
    rightRoof,
    doorLeft,
    doorRight,
    fissure,
    branchGroup
  );

  return group;
}

function createEmptyChair(
  materials: PieceMaterials
) {
  const group = new THREE.Group();
  addPedestal(group, materials, 0.63);

  const chair = new THREE.Group();
  chair.name = "empty-chair-object";
  chair.position.set(0.08, 0.18, 0.03);
  chair.rotation.y = -0.18;

  const burntMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x241a16,
      roughness: 0.96,
      metalness: 0.02,
    });

  const seat = mesh(
    new THREE.BoxGeometry(0.52, 0.1, 0.48),
    burntMaterial,
    [0, 0.65, 0]
  );

  const back = mesh(
    new THREE.BoxGeometry(0.52, 0.72, 0.09),
    burntMaterial,
    [0, 1.03, -0.2]
  );

  const upperBack = mesh(
    new THREE.BoxGeometry(0.61, 0.09, 0.12),
    materials.accent,
    [0, 1.39, -0.2]
  );

  const legPositions = [
    [-0.2, 0.32, -0.18],
    [0.2, 0.32, -0.18],
    [-0.2, 0.32, 0.18],
    [0.2, 0.32, 0.18],
  ] as const;

  legPositions.forEach(([x, y, z]) => {
    chair.add(
      mesh(
        new THREE.BoxGeometry(
          0.075,
          0.62,
          0.075
        ),
        burntMaterial,
        [x, y, z]
      )
    );
  });

  chair.add(seat, back, upperBack);

  const book = mesh(
    new THREE.BoxGeometry(0.48, 0.08, 0.34),
    materials.pale,
    [-0.42, 0.25, 0.18]
  );

  book.rotation.y = -0.28;

  const bookLine = mesh(
    new THREE.BoxGeometry(0.32, 0.012, 0.025),
    materials.accent,
    [-0.42, 0.297, 0.18]
  );

  bookLine.rotation.y = -0.28;

  const shadowMaterial =
    new THREE.MeshBasicMaterial({
      color: 0x050505,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
    });

  const shadowGroup = new THREE.Group();
  shadowGroup.name = "empty-chair-shadow";
  shadowGroup.position.set(-0.25, 0.205, -0.17);
  shadowGroup.rotation.x = -Math.PI / 2;
  shadowGroup.rotation.z = 0.3;

  const shadowBody = mesh(
    new THREE.PlaneGeometry(0.45, 1.05),
    shadowMaterial,
    [0, 0, 0]
  );

  const shadowHead = mesh(
    new THREE.CircleGeometry(0.2, 24),
    shadowMaterial,
    [0, 0.66, 0]
  );

  shadowGroup.add(shadowBody, shadowHead);

  group.add(
    shadowGroup,
    chair,
    book,
    bookLine
  );

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
    case "exile":
      return createExile(materials);
    case "promise":
      return createPromise(materials);
    case "wounded-university":
      return createWoundedUniversity(materials);
    case "empty-chair":
      return createEmptyChair(materials);
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

    sculpture.userData.baseY =
      sculpture.position.y;

    sculpture.userData.animationKind =
      piece.kind;

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


export function animateWorldPieces(
  group: THREE.Group,
  elapsed: number,
  activePieceId: string | null
) {
  group.children.forEach((object) => {
    const pieceId =
      object.userData.pieceId as string | undefined;

    const kind =
      object.userData.animationKind as
        | PieceKind
        | undefined;

    const active =
      Boolean(pieceId) &&
      pieceId === activePieceId;

    if (kind === "exile") {
      const house =
        object.getObjectByName("exile-house");

      if (house) {
        const pulse =
          1 +
          Math.sin(elapsed * 1.8) *
            (active ? 0.055 : 0.018);

        house.scale.setScalar(pulse);
      }
    }

    if (kind === "promise") {
      const left =
        object.getObjectByName("promise-left");

      const right =
        object.getObjectByName("promise-right");

      const light =
        object.getObjectByName("promise-light");

      const approach = active
        ? 0.065 +
          Math.sin(elapsed * 1.5) * 0.012
        : Math.sin(elapsed * 0.7) * 0.006;

      if (left) {
        left.position.x =
          (left.userData.baseX ?? -0.06) +
          approach;
      }

      if (right) {
        right.position.x =
          (right.userData.baseX ?? 0.06) -
          approach;
      }

      if (light) {
        const pulse =
          1 +
          Math.sin(elapsed * 2.6) *
            (active ? 0.22 : 0.07);

        light.scale.setScalar(pulse);
      }
    }

    if (kind === "wounded-university") {
      const branch =
        object.getObjectByName(
          "university-branch"
        );

      if (branch) {
        branch.rotation.z =
          Math.sin(elapsed * 0.9) *
          (active ? 0.075 : 0.025);
      }
    }

    if (kind === "empty-chair") {
      const shadow =
        object.getObjectByName(
          "empty-chair-shadow"
        );

      if (shadow) {
        const shadowMesh =
          shadow.children[0] as
            | THREE.Mesh
            | undefined;

        const material =
          shadowMesh?.material;

        if (
          material instanceof
          THREE.MeshBasicMaterial
        ) {
          material.opacity =
            (active ? 0.46 : 0.26) +
            Math.sin(elapsed * 1.1) *
              (active ? 0.055 : 0.018);
        }

        shadow.scale.y =
          1 +
          Math.sin(elapsed * 0.8) *
            (active ? 0.055 : 0.018);
      }
    }
  });
}
