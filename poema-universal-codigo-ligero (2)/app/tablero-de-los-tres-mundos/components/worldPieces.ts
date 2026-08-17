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

function createAtlas(
  materials: PieceMaterials
) {
  const group = new THREE.Group();
  addPedestal(group, materials, 0.68);

  const dog = new THREE.Group();
  dog.name = "atlas-dog";
  dog.position.set(-0.08, 0.18, 0.08);
  dog.rotation.y = -0.18;

  const albinoMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xe4dfd5,
      roughness: 0.78,
      metalness: 0.02,
      emissive: 0x8b8174,
      emissiveIntensity: 0.06,
    });

  const body = mesh(
    new THREE.SphereGeometry(0.38, 28, 22),
    albinoMaterial,
    [0, 0.79, 0.08]
  );

  body.scale.set(0.72, 0.67, 1.28);

  const chest = mesh(
    new THREE.SphereGeometry(0.29, 24, 18),
    albinoMaterial,
    [0, 0.91, -0.29]
  );

  chest.scale.set(0.85, 1.05, 0.72);

  const neck = cylinderBetween(
    new THREE.Vector3(0, 0.92, -0.28),
    new THREE.Vector3(0, 1.25, -0.51),
    0.14,
    albinoMaterial
  );

  const head = mesh(
    new THREE.SphereGeometry(0.23, 26, 20),
    albinoMaterial,
    [0, 1.39, -0.63]
  );

  head.name = "atlas-head";
  head.scale.set(0.72, 0.82, 1.05);

  const muzzle = mesh(
    new THREE.BoxGeometry(0.2, 0.14, 0.3),
    albinoMaterial,
    [0, 1.33, -0.84]
  );

  const nose = mesh(
    new THREE.SphereGeometry(0.065, 18, 14),
    materials.dark,
    [0, 1.35, -1.01]
  );

  const leftEar = mesh(
    new THREE.ConeGeometry(0.105, 0.39, 12),
    albinoMaterial,
    [-0.13, 1.72, -0.62]
  );

  const rightEar = mesh(
    new THREE.ConeGeometry(0.105, 0.39, 12),
    albinoMaterial,
    [0.13, 1.72, -0.62]
  );

  leftEar.rotation.z = 0.09;
  rightEar.rotation.z = -0.09;

  const eyeMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x6d5651,
      emissive: 0x4d302d,
      emissiveIntensity: 0.3,
      roughness: 0.4,
    });

  const leftEye = mesh(
    new THREE.SphereGeometry(0.025, 12, 10),
    eyeMaterial,
    [-0.085, 1.45, -0.82]
  );

  const rightEye = mesh(
    new THREE.SphereGeometry(0.025, 12, 10),
    eyeMaterial,
    [0.085, 1.45, -0.82]
  );

  const legPositions = [
    [-0.2, 0.43, -0.27],
    [0.2, 0.43, -0.27],
    [-0.2, 0.43, 0.4],
    [0.2, 0.43, 0.4],
  ] as const;

  legPositions.forEach(([x, y, z]) => {
    const leg = mesh(
      new THREE.CylinderGeometry(
        0.055,
        0.07,
        0.62,
        14
      ),
      albinoMaterial,
      [x, y, z]
    );

    dog.add(leg);

    const paw = mesh(
      new THREE.SphereGeometry(0.085, 16, 12),
      albinoMaterial,
      [x, 0.16, z - 0.025]
    );

    paw.scale.set(1, 0.5, 1.25);
    dog.add(paw);
  });

  const tail = cylinderBetween(
    new THREE.Vector3(0, 0.85, 0.52),
    new THREE.Vector3(0.18, 1.16, 0.91),
    0.045,
    albinoMaterial
  );

  const collar = mesh(
    new THREE.TorusGeometry(
      0.155,
      0.025,
      10,
      34
    ),
    materials.dark,
    [0, 1.17, -0.43]
  );

  collar.rotation.x = Math.PI / 2;
  collar.rotation.z = -0.12;

  dog.add(
    body,
    chest,
    neck,
    head,
    muzzle,
    nose,
    leftEar,
    rightEar,
    leftEye,
    rightEye,
    tail,
    collar
  );

  const yellowMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xe2b91d,
      emissive: 0xb88d00,
      emissiveIntensity: 0.42,
      roughness: 0.48,
    });

  const ball = mesh(
    new THREE.SphereGeometry(0.16, 24, 18),
    yellowMaterial,
    [0.73, 0.35, -0.18]
  );

  ball.name = "atlas-ball";
  ball.userData.baseX = ball.position.x;
  ball.userData.baseY = ball.position.y;
  ball.userData.baseZ = ball.position.z;

  group.add(dog, ball);

  return group;
}

function createHierarchyTable(
  materials: PieceMaterials
) {
  const group = new THREE.Group();
  addPedestal(group, materials, 0.7);

  const table = new THREE.Group();
  table.name = "hierarchy-table";
  table.position.y = 0.16;

  const top = mesh(
    new THREE.BoxGeometry(1.38, 0.12, 0.79),
    materials.dark,
    [0, 1.25, 0]
  );

  const edge = mesh(
    new THREE.BoxGeometry(1.48, 0.09, 0.89),
    materials.accent,
    [0, 1.17, 0]
  );

  const legPositions = [
    [-0.54, 0.65, -0.25],
    [0.54, 0.65, -0.25],
    [-0.54, 0.65, 0.25],
    [0.54, 0.65, 0.25],
  ] as const;

  legPositions.forEach(([x, y, z]) => {
    table.add(
      mesh(
        new THREE.BoxGeometry(
          0.11,
          1.05,
          0.11
        ),
        materials.dark,
        [x, y, z]
      )
    );
  });

  const plateData = [
    {
      x: -0.42,
      radius: 0.25,
      height: 1.36,
    },
    {
      x: 0,
      radius: 0.17,
      height: 1.36,
    },
    {
      x: 0.4,
      radius: 0.095,
      height: 1.36,
    },
  ];

  plateData.forEach(
    ({ x, radius, height }, index) => {
      const plate = mesh(
        new THREE.CylinderGeometry(
          radius,
          radius * 1.05,
          0.055,
          30
        ),
        index === 0
          ? materials.pale
          : materials.body,
        [x, height, 0]
      );

      plate.name = `hierarchy-plate-${index}`;
      plate.userData.baseY = height;

      table.add(plate);

      const ring = mesh(
        new THREE.TorusGeometry(
          radius * 0.72,
          0.014,
          8,
          30
        ),
        materials.accent,
        [x, height + 0.035, 0]
      );

      ring.rotation.x = Math.PI / 2;
      table.add(ring);
    }
  );

  const marks = [
    [-0.39, 0.29, -0.1, 0.42],
    [0, 0.29, -0.08, 0.31],
    [0.39, 0.29, -0.1, 0.22],
  ] as const;

  marks.forEach(([x, y, z, scale]) => {
    const body = mesh(
      new THREE.ConeGeometry(
        0.12 * scale,
        0.55 * scale,
        12
      ),
      materials.body,
      [x, y + 0.16 * scale, z]
    );

    const head = mesh(
      new THREE.SphereGeometry(
        0.09 * scale,
        14,
        12
      ),
      materials.pale,
      [x, y + 0.49 * scale, z]
    );

    table.add(body, head);
  });

  table.add(top, edge);
  group.add(table);

  return group;
}

function createEmptyPlate(
  materials: PieceMaterials
) {
  const group = new THREE.Group();
  addPedestal(group, materials, 0.61);

  const bowl = mesh(
    new THREE.CylinderGeometry(
      0.48,
      0.31,
      0.2,
      42,
      1,
      true
    ),
    materials.dark,
    [0, 0.66, 0]
  );

  const bottom = mesh(
    new THREE.CylinderGeometry(
      0.31,
      0.31,
      0.055,
      36
    ),
    materials.dark,
    [0, 0.56, 0]
  );

  const rim = mesh(
    new THREE.TorusGeometry(
      0.48,
      0.04,
      12,
      48
    ),
    materials.accent,
    [0, 0.76, 0]
  );

  rim.rotation.x = Math.PI / 2;

  const voidMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x050507,
      emissive: 0x260b09,
      emissiveIntensity: 0.5,
      roughness: 0.35,
    });

  const voidCore = mesh(
    new THREE.SphereGeometry(0.25, 24, 18),
    voidMaterial,
    [0, 0.69, 0]
  );

  voidCore.name = "empty-plate-void";
  voidCore.scale.set(1, 0.28, 1);

  const breathMaterial =
    new THREE.MeshBasicMaterial({
      color: 0x9b5543,
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
    });

  const breath = mesh(
    new THREE.TorusGeometry(
      0.25,
      0.015,
      8,
      40
    ),
    breathMaterial,
    [0, 0.85, 0]
  );

  breath.name = "empty-plate-breath";
  breath.rotation.x = Math.PI / 2;
  breath.userData.baseY = breath.position.y;

  const crackMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xb16a53,
      emissive: 0x7c2e22,
      emissiveIntensity: 0.38,
      roughness: 0.4,
    });

  const crackOne = mesh(
    new THREE.BoxGeometry(
      0.025,
      0.03,
      0.34
    ),
    crackMaterial,
    [0.18, 0.775, 0.19]
  );

  crackOne.rotation.y = -0.72;

  const crackTwo = mesh(
    new THREE.BoxGeometry(
      0.02,
      0.03,
      0.19
    ),
    crackMaterial,
    [0.29, 0.775, 0.02]
  );

  crackTwo.rotation.y = 0.18;

  group.add(
    bowl,
    bottom,
    rim,
    voidCore,
    breath,
    crackOne,
    crackTwo
  );

  return group;
}

function createBrokenChain(
  materials: PieceMaterials
) {
  const group = new THREE.Group();
  addPedestal(group, materials, 0.66);

  const figure = createFigure(materials, {
    height: 0.56,
  });

  figure.name = "released-figure";
  figure.position.set(0, 0.19, 0);
  figure.userData.baseZ = figure.position.z;

  const chainGroup = new THREE.Group();
  chainGroup.position.y = 0.74;

  const linkMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x312a29,
      roughness: 0.58,
      metalness: 0.72,
    });

  const positions = [
    [-0.57, 0, -0.2],
    [-0.3, 0, 0.43],
    [0.03, 0, 0.56],
    [0.38, 0, 0.37],
    [0.57, 0, -0.05],
  ] as const;

  positions.forEach(([x, y, z], index) => {
    const link = mesh(
      new THREE.TorusGeometry(
        0.19,
        0.047,
        10,
        26
      ),
      linkMaterial,
      [x, y, z]
    );

    link.rotation.set(
      index % 2 === 0 ? Math.PI / 2 : 0.25,
      index * 0.35,
      index % 2 === 0 ? 0.15 : Math.PI / 2
    );

    chainGroup.add(link);
  });

  const brokenMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x8d4d3d,
      emissive: 0x60251d,
      emissiveIntensity: 0.34,
      roughness: 0.47,
      metalness: 0.6,
    });

  const brokenLink = mesh(
    new THREE.TorusGeometry(
      0.22,
      0.052,
      10,
      28,
      Math.PI * 1.35
    ),
    brokenMaterial,
    [0.55, 0, -0.48]
  );

  brokenLink.name = "broken-chain-link";
  brokenLink.userData.baseRotationZ = -0.4;
  brokenLink.rotation.set(
    Math.PI / 2,
    0.2,
    -0.4
  );

  chainGroup.add(brokenLink);

  const openingLight = mesh(
    new THREE.SphereGeometry(0.06, 14, 12),
    materials.accent,
    [0.72, 0.05, -0.6]
  );

  openingLight.name = "broken-chain-light";

  chainGroup.add(openingLight);
  group.add(figure, chainGroup);

  return group;
}

function createStrawMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0xc7a76a,
    emissive: 0x705129,
    emissiveIntensity: 0.12,
    roughness: 0.92,
    metalness: 0,
  });
}

function createWaterMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: 0xa9d3dc,
    roughness: 0.16,
    metalness: 0.02,
    transmission: 0.45,
    transparent: true,
    opacity: 0.72,
    clearcoat: 0.85,
    clearcoatRoughness: 0.2,
  });
}

function createAwakening(
  materials: PieceMaterials
) {
  const group = new THREE.Group();
  addPedestal(group, materials, 0.68);

  const strawMaterial = createStrawMaterial();
  const waterMaterial = createWaterMaterial();

  const water = mesh(
    new THREE.CylinderGeometry(
      0.58,
      0.58,
      0.055,
      48
    ),
    waterMaterial,
    [0, 0.28, 0]
  );

  water.name = "bielka-water";

  const waterRing = mesh(
    new THREE.TorusGeometry(
      0.5,
      0.025,
      12,
      56
    ),
    materials.accent,
    [0, 0.32, 0]
  );

  waterRing.rotation.x = Math.PI / 2;
  waterRing.name = "bielka-water-ring";

  const strawGroup = new THREE.Group();
  strawGroup.name = "bielka-straw-bed";
  strawGroup.position.y = 0.32;

  for (let index = 0; index < 34; index += 1) {
    const angle =
      (index / 34) * Math.PI * 2;

    const radius =
      0.2 + (index % 5) * 0.075;

    const straw = mesh(
      new THREE.CylinderGeometry(
        0.009,
        0.009,
        0.38 + (index % 4) * 0.05,
        6
      ),
      strawMaterial,
      [
        Math.cos(angle) * radius,
        0.04 + (index % 3) * 0.012,
        Math.sin(angle) * radius,
      ]
    );

    straw.rotation.set(
      Math.PI / 2 + (index % 3) * 0.08,
      angle,
      angle * 0.55
    );

    strawGroup.add(straw);
  }

  const bodyMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xe9e5dc,
      roughness: 0.7,
      emissive: 0xb7dce2,
      emissiveIntensity: 0.08,
    });

  const figure = new THREE.Group();
  figure.name = "awakening-figure";
  figure.position.set(0, 0.39, 0.05);

  const lowerBody = mesh(
    new THREE.ConeGeometry(
      0.3,
      0.7,
      20
    ),
    bodyMaterial,
    [0, 0.34, 0.08]
  );

  lowerBody.rotation.z = -0.16;

  const torso = mesh(
    new THREE.CylinderGeometry(
      0.13,
      0.22,
      0.64,
      20
    ),
    bodyMaterial,
    [0, 0.86, 0]
  );

  torso.rotation.z = -0.13;

  const head = mesh(
    new THREE.SphereGeometry(
      0.18,
      26,
      20
    ),
    bodyMaterial,
    [-0.09, 1.25, -0.02]
  );

  head.scale.set(0.9, 1.06, 0.88);

  const hairMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x6f665f,
      roughness: 0.94,
    });

  const hair = mesh(
    new THREE.SphereGeometry(
      0.195,
      24,
      18
    ),
    hairMaterial,
    [-0.12, 1.28, 0.02]
  );

  hair.scale.set(0.96, 1.05, 0.9);
  hair.position.z += 0.06;

  const faceMask = mesh(
    new THREE.SphereGeometry(
      0.145,
      22,
      16,
      0,
      Math.PI * 2,
      0,
      Math.PI * 0.56
    ),
    bodyMaterial,
    [-0.09, 1.25, -0.13]
  );

  faceMask.rotation.x = Math.PI * 0.44;

  const armLeft = cylinderBetween(
    new THREE.Vector3(
      -0.12,
      0.97,
      0
    ),
    new THREE.Vector3(
      -0.37,
      0.65,
      0.16
    ),
    0.045,
    bodyMaterial
  );

  const armRight = cylinderBetween(
    new THREE.Vector3(
      0.12,
      0.96,
      0
    ),
    new THREE.Vector3(
      0.34,
      0.62,
      -0.11
    ),
    0.045,
    bodyMaterial
  );

  const breathMaterial =
    new THREE.MeshBasicMaterial({
      color: 0xd7f3f6,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
    });

  const breath = mesh(
    new THREE.TorusGeometry(
      0.16,
      0.012,
      8,
      36
    ),
    breathMaterial,
    [0.02, 1.02, -0.24]
  );

  breath.name = "awakening-breath";
  breath.rotation.y = Math.PI / 2;

  figure.add(
    lowerBody,
    torso,
    hair,
    head,
    faceMask,
    armLeft,
    armRight,
    breath
  );

  group.add(
    water,
    waterRing,
    strawGroup,
    figure
  );

  return group;
}

function createCart(
  materials: PieceMaterials
) {
  const group = new THREE.Group();
  addPedestal(group, materials, 0.72);

  const woodMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x725741,
      roughness: 0.9,
      metalness: 0.02,
    });

  const strawMaterial = createStrawMaterial();

  const cart = new THREE.Group();
  cart.name = "bielka-cart";
  cart.position.set(0, 0.34, 0);

  const base = mesh(
    new THREE.BoxGeometry(
      1.05,
      0.16,
      0.62
    ),
    woodMaterial,
    [0, 0.52, 0]
  );

  const leftWall = mesh(
    new THREE.BoxGeometry(
      1.02,
      0.35,
      0.07
    ),
    woodMaterial,
    [0, 0.72, -0.28]
  );

  const rightWall = mesh(
    new THREE.BoxGeometry(
      1.02,
      0.35,
      0.07
    ),
    woodMaterial,
    [0, 0.72, 0.28]
  );

  const frontWall = mesh(
    new THREE.BoxGeometry(
      0.07,
      0.35,
      0.62
    ),
    woodMaterial,
    [-0.49, 0.72, 0]
  );

  const wheelMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x332b28,
      roughness: 0.74,
      metalness: 0.25,
    });

  [-0.37, 0.37].forEach((x) => {
    [-0.34, 0.34].forEach((z) => {
      if (z > 0) {
        return;
      }

      const wheel = mesh(
        new THREE.TorusGeometry(
          0.22,
          0.04,
          10,
          30
        ),
        wheelMaterial,
        [x, 0.38, z]
      );

      wheel.name = "bielka-cart-wheel";
      wheel.rotation.y = Math.PI / 2;

      cart.add(wheel);
    });
  });

  const axle = cylinderBetween(
    new THREE.Vector3(
      -0.58,
      0.38,
      -0.34
    ),
    new THREE.Vector3(
      0.58,
      0.38,
      -0.34
    ),
    0.025,
    wheelMaterial
  );

  const handleLeft = cylinderBetween(
    new THREE.Vector3(
      0.5,
      0.54,
      -0.18
    ),
    new THREE.Vector3(
      1.02,
      0.5,
      -0.18
    ),
    0.025,
    woodMaterial
  );

  const handleRight = cylinderBetween(
    new THREE.Vector3(
      0.5,
      0.54,
      0.18
    ),
    new THREE.Vector3(
      1.02,
      0.5,
      0.18
    ),
    0.025,
    woodMaterial
  );

  const strawMass = mesh(
    new THREE.SphereGeometry(
      0.43,
      24,
      18
    ),
    strawMaterial,
    [-0.04, 0.86, 0]
  );

  strawMass.scale.set(1.1, 0.55, 0.78);

  const floatingStraw = new THREE.Group();
  floatingStraw.name =
    "bielka-floating-straw";

  for (let index = 0; index < 18; index += 1) {
    const straw = mesh(
      new THREE.CylinderGeometry(
        0.008,
        0.008,
        0.25 + (index % 4) * 0.05,
        6
      ),
      strawMaterial,
      [
        -0.46 + index * 0.055,
        0.92 + (index % 4) * 0.045,
        -0.25 + (index % 5) * 0.12,
      ]
    );

    straw.rotation.set(
      Math.PI / 2,
      index * 0.37,
      0.5 + index * 0.18
    );

    floatingStraw.add(straw);
  }

  const glow = mesh(
    new THREE.SphereGeometry(
      0.1,
      18,
      14
    ),
    materials.accent,
    [-0.08, 0.96, 0]
  );

  glow.name = "bielka-cart-glow";

  cart.add(
    base,
    leftWall,
    rightWall,
    frontWall,
    axle,
    handleLeft,
    handleRight,
    strawMass,
    floatingStraw,
    glow
  );

  group.add(cart);

  return group;
}

function createHeartHalf(
  side: -1 | 1,
  materials: PieceMaterials
) {
  const half = new THREE.Group();

  const lobe = mesh(
    new THREE.SphereGeometry(
      0.24,
      26,
      20
    ),
    materials.accent,
    [side * 0.11, 0.2, 0]
  );

  lobe.scale.set(0.9, 1.08, 0.6);

  const point = mesh(
    new THREE.ConeGeometry(
      0.24,
      0.58,
      22
    ),
    materials.accent,
    [side * 0.08, -0.18, 0]
  );

  point.rotation.z = side * 0.17;

  const cutMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xe7f1f1,
      emissive: 0xb8e2e7,
      emissiveIntensity: 0.25,
      roughness: 0.34,
    });

  const cut = mesh(
    new THREE.BoxGeometry(
      0.025,
      0.68,
      0.11
    ),
    cutMaterial,
    [side * -0.015, -0.03, 0.13]
  );

  cut.rotation.z = side * -0.08;

  half.add(lobe, point, cut);

  return half;
}

function createHeart(
  materials: PieceMaterials
) {
  const group = new THREE.Group();
  addPedestal(group, materials, 0.64);

  const heart = new THREE.Group();
  heart.position.set(0, 0.94, 0);

  const left = createHeartHalf(
    -1,
    materials
  );

  const right = createHeartHalf(
    1,
    materials
  );

  left.name = "bielka-heart-left";
  right.name = "bielka-heart-right";

  left.position.x = -0.3;
  right.position.x = 0.3;

  left.userData.baseX = -0.3;
  right.userData.baseX = 0.3;

  const chainMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xd3c9b7,
      roughness: 0.38,
      metalness: 0.68,
    });

  const chainLeft = mesh(
    new THREE.TorusGeometry(
      0.54,
      0.015,
      8,
      42,
      Math.PI
    ),
    chainMaterial,
    [-0.22, 0.45, 0]
  );

  chainLeft.rotation.z = -0.2;

  const chainRight = mesh(
    new THREE.TorusGeometry(
      0.54,
      0.015,
      8,
      42,
      Math.PI
    ),
    chainMaterial,
    [0.22, 0.45, 0]
  );

  chainRight.rotation.z = Math.PI + 0.2;

  const centralLight = mesh(
    new THREE.SphereGeometry(
      0.045,
      16,
      12
    ),
    materials.pale,
    [0, -0.02, 0.13]
  );

  centralLight.name =
    "bielka-heart-light";

  heart.add(
    left,
    right,
    chainLeft,
    chainRight,
    centralLight
  );

  group.add(heart);

  return group;
}

function createVoid(
  materials: PieceMaterials
) {
  const group = new THREE.Group();
  addPedestal(group, materials, 0.7);

  const marbleMaterial =
    new THREE.MeshPhysicalMaterial({
      color: 0xf0eee8,
      roughness: 0.22,
      metalness: 0,
      transmission: 0.08,
      clearcoat: 0.6,
      clearcoatRoughness: 0.25,
      emissive: 0xc8e7ea,
      emissiveIntensity: 0.12,
    });

  const whiteSquare = mesh(
    new THREE.BoxGeometry(
      0.95,
      0.1,
      0.95
    ),
    marbleMaterial,
    [0, 0.34, 0]
  );

  whiteSquare.name =
    "bielka-white-square";

  const labyrinth = new THREE.Group();
  labyrinth.name =
    "bielka-labyrinth";

  const wallData = [
    [-0.42, 0.76, 0, 0.06, 0.86],
    [0.42, 0.76, 0, 0.06, 0.86],
    [0, 1.17, -0.42, 0.86, 0.06],
    [-0.21, 0.75, 0.2, 0.42, 0.055],
    [0.23, 0.9, -0.18, 0.38, 0.055],
    [0.03, 0.61, -0.08, 0.055, 0.32],
  ] as const;

  wallData.forEach(
    ([x, y, z, width, depth]) => {
      labyrinth.add(
        mesh(
          new THREE.BoxGeometry(
            width,
            0.82,
            depth
          ),
          marbleMaterial,
          [x, y, z]
        )
      );
    }
  );

  const mistMaterial =
    new THREE.MeshBasicMaterial({
      color: 0xe8f7f8,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    });

  const mist = mesh(
    new THREE.SphereGeometry(
      0.48,
      24,
      18
    ),
    mistMaterial,
    [0, 0.76, 0]
  );

  mist.name = "bielka-white-mist";
  mist.scale.set(1.1, 0.42, 1.1);

  const footprintMaterial =
    new THREE.MeshBasicMaterial({
      color: 0xc4dfe2,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });

  const footprint = new THREE.Group();
  footprint.name =
    "bielka-footprint";
  footprint.position.set(
    0.12,
    0.405,
    -0.04
  );

  const heel = mesh(
    new THREE.SphereGeometry(
      0.08,
      16,
      12
    ),
    footprintMaterial,
    [0, 0, 0.13]
  );

  heel.scale.set(0.65, 0.08, 1);

  const sole = mesh(
    new THREE.SphereGeometry(
      0.11,
      18,
      14
    ),
    footprintMaterial,
    [0, 0, -0.03]
  );

  sole.scale.set(0.72, 0.08, 1.38);

  const toePositions = [
    [-0.075, -0.17, 0.035],
    [-0.03, -0.2, 0.04],
    [0.02, -0.21, 0.042],
    [0.07, -0.19, 0.037],
  ] as const;

  toePositions.forEach(
    ([x, z, radius]) => {
      const toe = mesh(
        new THREE.SphereGeometry(
          radius,
          12,
          10
        ),
        footprintMaterial,
        [x, 0, z]
      );

      toe.scale.y = 0.08;
      footprint.add(toe);
    }
  );

  footprint.add(heel, sole);

  const breathRing = mesh(
    new THREE.TorusGeometry(
      0.26,
      0.012,
      8,
      42
    ),
    materials.accent,
    [0, 1.2, 0]
  );

  breathRing.name =
    "bielka-absence-breath";

  breathRing.rotation.x =
    Math.PI / 2;

  group.add(
    whiteSquare,
    labyrinth,
    mist,
    footprint,
    breathRing
  );

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
    case "atlas":
      return createAtlas(materials);
    case "hierarchy-table":
      return createHierarchyTable(materials);
    case "empty-plate":
      return createEmptyPlate(materials);
    case "broken-chain":
      return createBrokenChain(materials);
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

    if (kind === "atlas") {
      const ball =
        object.getObjectByName("atlas-ball");

      const head =
        object.getObjectByName("atlas-head");

      if (ball) {
        const baseX =
          ball.userData.baseX ?? 0.73;

        const baseY =
          ball.userData.baseY ?? 0.35;

        const baseZ =
          ball.userData.baseZ ?? -0.18;

        const push = active
          ? 0.2 +
            Math.sin(elapsed * 1.7) * 0.065
          : Math.sin(elapsed * 0.8) * 0.012;

        ball.position.x = baseX + push;
        ball.position.y =
          baseY +
          Math.abs(Math.sin(elapsed * 1.7)) *
            (active ? 0.055 : 0.012);

        ball.position.z =
          baseZ +
          Math.sin(elapsed * 0.85) *
            (active ? 0.025 : 0.008);

        ball.rotation.x += active
          ? 0.035
          : 0.006;
      }

      if (head) {
        head.rotation.y =
          Math.sin(elapsed * 0.85) *
          (active ? 0.11 : 0.025);
      }
    }

    if (kind === "hierarchy-table") {
      [0, 1, 2].forEach((index) => {
        const plate =
          object.getObjectByName(
            `hierarchy-plate-${index}`
          );

        if (!plate) {
          return;
        }

        const baseY =
          plate.userData.baseY ?? 1.36;

        const inequality =
          active
            ? (2 - index) * 0.055
            : 0;

        plate.position.y =
          baseY +
          inequality +
          Math.sin(
            elapsed * 0.9 + index * 0.8
          ) *
            (active ? 0.014 : 0.004);
      });
    }

    if (kind === "empty-plate") {
      const voidCore =
        object.getObjectByName(
          "empty-plate-void"
        );

      const breath =
        object.getObjectByName(
          "empty-plate-breath"
        );

      if (voidCore) {
        const pulse =
          1 +
          Math.sin(elapsed * 1.45) *
            (active ? 0.12 : 0.035);

        voidCore.scale.set(
          pulse,
          0.28,
          pulse
        );
      }

      if (breath) {
        const expansion =
          1 +
          ((elapsed * 0.24) % 1) *
            (active ? 0.72 : 0.24);

        breath.scale.setScalar(expansion);

        breath.position.y =
          (breath.userData.baseY ?? 0.85) +
          ((elapsed * 0.13) % 1) *
            (active ? 0.22 : 0.05);

        const material = (
          breath as THREE.Mesh
        ).material;

        if (
          material instanceof
          THREE.MeshBasicMaterial
        ) {
          material.opacity =
            active
              ? 0.42 -
                ((elapsed * 0.24) % 1) * 0.3
              : 0.16;
        }
      }
    }

    if (kind === "broken-chain") {
      const brokenLink =
        object.getObjectByName(
          "broken-chain-link"
        );

      const figure =
        object.getObjectByName(
          "released-figure"
        );

      const light =
        object.getObjectByName(
          "broken-chain-light"
        );

      if (brokenLink) {
        brokenLink.rotation.z =
          (brokenLink.userData
            .baseRotationZ ?? -0.4) +
          Math.sin(elapsed * 1.1) *
            (active ? 0.22 : 0.035);
      }

      if (figure) {
        figure.position.z =
          (figure.userData.baseZ ?? 0) -
          (active
            ? 0.1 +
              Math.sin(elapsed * 0.8) * 0.02
            : 0);
      }

      if (light) {
        const pulse =
          1 +
          Math.sin(elapsed * 2.2) *
            (active ? 0.28 : 0.08);

        light.scale.setScalar(pulse);
      }
    }


    /* BIELKA TREASURES ANIMATION */

    if (kind === "awakening") {
      const figure =
        object.getObjectByName(
          "awakening-figure"
        );

      const breath =
        object.getObjectByName(
          "awakening-breath"
        );

      const ring =
        object.getObjectByName(
          "bielka-water-ring"
        );

      if (figure) {
        figure.position.y =
          0.39 +
          Math.sin(elapsed * 1.15) *
            (active ? 0.025 : 0.008);

        figure.rotation.z =
          Math.sin(elapsed * 0.8) *
            (active ? 0.018 : 0.006);
      }

      if (breath) {
        const expansion =
          1 +
          ((elapsed * 0.35) % 1) *
            (active ? 0.72 : 0.18);

        breath.scale.setScalar(expansion);

        const material =
          (breath as THREE.Mesh).material;

        if (
          material instanceof
          THREE.MeshBasicMaterial
        ) {
          material.opacity =
            active
              ? 0.4 -
                ((elapsed * 0.35) % 1) *
                  0.3
              : 0.14;
        }
      }

      if (ring) {
        const pulse =
          1 +
          Math.sin(elapsed * 1.3) *
            (active ? 0.055 : 0.015);

        ring.scale.setScalar(pulse);
      }
    }

    if (kind === "cart") {
      const cart =
        object.getObjectByName(
          "bielka-cart"
        );

      const straw =
        object.getObjectByName(
          "bielka-floating-straw"
        );

      const glow =
        object.getObjectByName(
          "bielka-cart-glow"
        );

      if (cart) {
        cart.position.x =
          Math.sin(elapsed * 0.45) *
            (active ? 0.12 : 0.025);

        cart.position.y =
          0.34 +
          Math.sin(elapsed * 0.9) *
            (active ? 0.025 : 0.008);
      }

      if (straw) {
        straw.rotation.y =
          elapsed *
          (active ? 0.08 : 0.025);

        straw.children.forEach(
          (fragment, index) => {
            fragment.position.y +=
              Math.sin(
                elapsed * 1.1 + index
              ) *
              (active ? 0.0008 : 0.0002);
          }
        );
      }

      if (glow) {
        const pulse =
          1 +
          Math.sin(elapsed * 2) *
            (active ? 0.24 : 0.07);

        glow.scale.setScalar(pulse);
      }
    }

    if (kind === "heart") {
      const left =
        object.getObjectByName(
          "bielka-heart-left"
        );

      const right =
        object.getObjectByName(
          "bielka-heart-right"
        );

      const light =
        object.getObjectByName(
          "bielka-heart-light"
        );

      const approach =
        active
          ? 0.14 +
            Math.sin(elapsed * 1.2) *
              0.025
          : Math.sin(elapsed * 0.65) *
              0.012;

      if (left) {
        left.position.x =
          (left.userData.baseX ?? -0.3) +
          approach;
      }

      if (right) {
        right.position.x =
          (right.userData.baseX ?? 0.3) -
          approach;
      }

      if (light) {
        const pulse =
          1 +
          Math.sin(elapsed * 2.4) *
            (active ? 0.35 : 0.1);

        light.scale.setScalar(pulse);
      }
    }

    if (kind === "void") {
      const square =
        object.getObjectByName(
          "bielka-white-square"
        );

      const mist =
        object.getObjectByName(
          "bielka-white-mist"
        );

      const footprint =
        object.getObjectByName(
          "bielka-footprint"
        );

      const breath =
        object.getObjectByName(
          "bielka-absence-breath"
        );

      if (square) {
        const pulse =
          1 +
          Math.sin(elapsed * 0.85) *
            (active ? 0.025 : 0.007);

        square.scale.y = pulse;
      }

      if (mist) {
        mist.rotation.y =
          elapsed *
          (active ? 0.14 : 0.035);

        const mistMaterial =
          (mist as THREE.Mesh).material;

        if (
          mistMaterial instanceof
          THREE.MeshBasicMaterial
        ) {
          mistMaterial.opacity =
            active
              ? 0.16 +
                Math.sin(elapsed * 0.8) *
                  0.04
              : 0.08;
        }
      }

      if (footprint) {
        const opacity =
          active
            ? THREE.MathUtils.clamp(
                (
                  Math.sin(
                    elapsed * 0.72
                  ) + 1
                ) * 0.22,
                0.04,
                0.42
              )
            : 0;

        footprint.children.forEach(
          (part) => {
            if (!(part instanceof THREE.Mesh)) {
              return;
            }

            const material = part.material;

            if (
              material instanceof
              THREE.MeshBasicMaterial
            ) {
              material.opacity = opacity;
            }
          }
        );
      }

      if (breath) {
        const expansion =
          1 +
          ((elapsed * 0.18) % 1) *
            (active ? 0.82 : 0.2);

        breath.scale.setScalar(expansion);

        breath.position.y =
          1.2 +
          Math.sin(elapsed * 0.8) *
            (active ? 0.08 : 0.015);
      }
    }

  });
}
