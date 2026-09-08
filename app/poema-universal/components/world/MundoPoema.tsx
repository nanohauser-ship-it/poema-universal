"use client";

import { useState } from "react";

import Link from "next/link";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sparkles } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import styles from "./MundoPoema.module.css";
import NarrativeOverlay from "./NarrativeOverlay";
import WorldStory from "./WorldStory";
import ElHuertoRitual from "./ElHuertoRitual";
import LaLuzRegresaRitual from "./LaLuzRegresaRitual";
import PoemBook, { type PoemEntry } from "./PoemBook";
import { FOUNDATIONAL_BOOK_POEMS } from "../../data/foundationalPoems";
import PoemSoundLightRig from "./PoemSoundLightRig";
import PoemSoundtrack from "./PoemSoundtrack";

const CYCLE_DURATION = 32;

export const BOOK_POEMS: PoemEntry[] = [
  {
    id: "jose-naveiro-01",
    poetName: "José Naveiro",
    country: "Galicia · España",
    title: "El huerto",
    originalLabel: "Original · Español",
    poem: `Muchos años después,
cavé la tierra para hacer un huerto.

A la tercera palada,
la tierra me devolvió
los huesos del perro
que había enterrado con mis manos.

Me quedé inmóvil.

En la curva de sus costillas
aún resonaba un ladrido,
como si la muerte
no hubiera conseguido cerrarlo.

Aparté la tierra con cuidado.
Toqué el polvo que lo rodeaba
y sentí un poco de calor.

Quizá no estaba allí.
Quizá era mi mano
recordando su cuerpo.

Volví a cubrirlo.

Sobre aquel lugar
planté un árbol.

Desde entonces,
cuando el viento mueve sus ramas,
algo corre hacia mí
desde el fondo de la tierra.`,
  },
  {
    id: "asataka-02",
    poetName: "ASATAKA",
    country: "Japón · 日本",
    title: "La luz regresa descalza",
    originalLabel: "Original · 日本語",
    translationLabel: "Traducción · Español",
    poem: `いい意味で死にそうになる景色だね。
そう貴方は言う。
硬い線路の上を浮遊する貴方は
惑星の内部に詩の誕生を告げて
ページとページのあいだで材質をつくり
背表紙に触知する花弁に真実在を眠らせる。
そうして貴方の中扉と景色との創造は
丁度層で止まる空気のような
振動をつづる形で
私のめくれかけた表紙に留まりながら
名を閉じない。
光は光から返ってくる素足の
残像。`,
    translation: `«Es un paisaje que casi podría matarte,
en el mejor de los sentidos».
Eso dices.

Tú, que flotas sobre las vías rígidas,
anuncias en el interior del planeta
el nacimiento de un poema;
creas materia entre una página y otra
y haces dormir la verdadera existencia
en pétalos palpables sobre el lomo.

Así, la creación de tu portadilla
y del paisaje
traza una vibración,
como el aire detenido
en una capa precisa;
permanece sobre mi cubierta
a punto de abrirse,
sin cerrar el nombre.

La luz es la imagen persistente
de unos pies descalzos
que regresan de la luz.`,
  },
  {
    id: "azucena-03",
    poetName: "Azucena",
    country: "México",
    title: "Habitación blanca",
    originalLabel: "Original · Español",
    poem: `Ya no pude seguir.

En algún lugar,
entre el olor del desinfectante
y la luz que nunca se apagaba,
comprendí
que había dejado de soñar.

—Una dosis más.

La frase cayó
como una llave
cerrando otra puerta.

No pregunté.
Había preguntas
que ya nacían cansadas.

¿Cuántas píldoras
hacen falta
para dormir el miedo?

Me prometí comer,
pero la ansiedad
siempre llegaba primero
y ocupaba mi silla.

Las flores del jardín
eran el único lugar
donde el mundo
todavía respiraba despacio.

Me tumbaba entre ellas
para recordar
que aún existía un cielo.

«¿Con quién puedo hablar?»,
pregunté una tarde.

El silencio
fue el primero en responder.

Después llegaron
otros ojos.

Había tantas personas
cargando universos parecidos
que entendí
que el dolor
también aprende
a compartir habitación.

Perdóname,
vida mía.

Tendré que aprender
a fingir un poco,
a esconder
el temblor de las manos,
a vestir de calma
esta tormenta.

Pero si alguien
tiembla frente a mí,

escucharé.

Si alguien
cree que está solo,

me quedaré.

Porque incluso aquí,
donde parecía terminar el mundo,

todavía es posible
cuidarnos.`,
  },
  {
    id: "andres-giraldo-florez-04",
    poetName: "Andrés Giraldo Flórez",
    country: "Colombia",
    title: "El tiempo",
    originalLabel: "Original · Español",
    poem: `Cocinar es muy difícil.

Qué rico descansar…

Pero, si no trabajo,
no descanso.

¿Cuándo tendré tiempo para crear?

¿Cómo se compra el tiempo,
si para comprar tiempo
necesito tiempo?

Espero que, después de todos estos años de esforzarme,
todavía encuentre mi alma.`,
  },
  {
    id: "johan-martinez-05",
    poetName: "Johan Rodríguez Martínez",
    country: "Venezuela",
    title: "Lo que permanece",
    originalLabel: "Original · Español",
    poem: `Solo dos hombres.

Uno llevaba el miedo
como quien protege una lámpara del viento.

El otro
temía que el amor
nunca aprendiera a pronunciar su nombre.

Se encontraron
mucho antes de estrecharse las manos.

Hay almas
que se reconocen
por la manera en que sostienen el silencio.

No hicieron promesas.

Las promesas pertenecen
a quienes creen dominar el tiempo.

Ellos apenas compartieron
la gravedad de una mirada,
el temblor de una respiración,
la certeza inexplicable
de haber llegado demasiado tarde
y, sin embargo,
al lugar correcto.

Después vino la distancia.

Esa habitación inmensa
donde los cuerpos ya no están,
pero la memoria
continúa respirando.

Comprendieron entonces
que hay amores
que no nacieron para poseerse,
sino para enseñar
hasta dónde puede llegar
el corazón humano.

Desde entonces
uno habita la nostalgia.

El otro,
la esperanza.

Y entre ambos
permanece un puente invisible
que ninguna ausencia consigue derribar.

Porque existen fuegos
que no necesitan consumirse
para seguir dando luz.

Y cuando la noche
vuelve a cerrar los ojos del mundo,

todavía hay dos hombres
que se buscan en el mismo sueño,

como si el amor
fuera la única patria
de la que nadie
puede ser exiliado.`,
  },
  {
    id: "marco-indrio-06",
    poetName: "Marco Indrio",
    country: "Italia · Italy",
    title: "Solo dos hombres",
    originalLabel: "Original · Italiano",
    translationLabel: "Traducción · Español",
    poem: `Ci sono amori

che non imparano mai
a dire addio.

Restano
come il mare dopo il tramonto:
oscuri,
immensi,
incapaci di dimenticare la luce.

Eravamo due uomini.

Non due corpi,
ma due domande
in cerca di rifugio
nella stessa notte.

Uno temeva
di aprire le mani.

L'altro
che nemmeno due mani aperte
potessero bastare.

Ci siamo incontrati
nel luogo in cui il linguaggio finisce
e comincia il respiro dell'anima.

Non furono necessarie promesse.

Bastò il tremore
di uno sguardo trattenuto,
il lieve sfiorarsi
di due solitudini
che compresero
di essersi attese
per anni.

Poi arrivò la distanza,

quell'antica artigiana
che trasforma la presenza
in memoria.

E comprendemmo
che esistono abbracci
che continuano ad accadere
molto tempo dopo
che i corpi
si sono separati.

Da allora
cammino accompagnato
da un'assenza
che non pesa:

illumina.

Perché ci sono amori
che non hanno bisogno
di un destino
per essere eterni.

Basta
che siano esistiti
una sola volta

per continuare ad ardere
nel luogo più segreto
del cuore,

come una fiamma
che il tempo contempla,

ma che non riuscirà
mai a spegnere.`,
    translation: `Hay amores

que nunca aprenden
a despedirse.

Permanecen
como el mar después del atardecer:
oscuros,
inmensos,
incapaces de olvidar la luz.

Éramos dos hombres.

No dos cuerpos,
sino dos preguntas
buscando refugio
en la misma noche.

Uno temía abrir las manos.

El otro,
que ni siquiera unas manos abiertas
fueran suficientes.

Nos encontramos
en ese lugar donde el lenguaje termina
y comienza la respiración del alma.

No hicieron falta juramentos.

Bastó el temblor
de una mirada sostenida,
el leve roce
de dos soledades
que comprendieron
que llevaban años
esperándose.

Después llegó la distancia,

esa antigua artesana
que convierte la presencia
en memoria.

Y descubrimos
que existen abrazos
que siguen ocurriendo
mucho después
de que los cuerpos se hayan separado.

Desde entonces
camino acompañado
por una ausencia
que no pesa:

ilumina.

Porque hay amores
que no necesitan un destino
para ser eternos.

Les basta
haber existido una vez

para continuar ardiendo
en el lugar más secreto del corazón,

como una llama
que el tiempo contempla,

pero jamás consigue apagar.`,
  },
  {
    id: "cheik-senegal-07",
    poetName: "Cheik Ndiaye",
    country: "Sénégal · Senegal",
    title: "Je suis arrivé vivant",
    originalLabel: "Original · Français",
    translationLabel: "Traducción · Español",
    poem: `Je suis né là où le soleil
apprend aux enfants
que la vie commence souvent
par le manque.

J'ai perdu ma mère
à quatorze ans.

Ce jour-là,
je suis devenu plus vieux
que mon âge.

J'ai grandi
avec le silence comme compagnon,
le travail comme école,
et l'espérance
comme unique richesse.

Puis un matin,
j'ai regardé l'horizon.

On disait
que derrière la mer
existait un endroit
où un homme pouvait recommencer.

Je suis monté dans une pirogue.

Neuf jours
entre le ciel et l'eau.

Trois jours
sans manger.

Chaque vague
posait la même question :

« Veux-tu vivre ? »

Et chaque battement de mon cœur
répondait :

« Oui. »

Quand la terre est apparue,
je n'ai pas vu l'Europe.

J'ai vu
une nouvelle possibilité.

Je suis arrivé
sur l'île de La Gomera,
non avec des bagages,

mais avec une vie
que je refusais d'abandonner.

Aujourd'hui,
chaque pas que je fais
porte la mémoire
de ceux qui n'ont jamais atteint la rive.

Je marche aussi pour eux.

Parce que survivre
n'est pas seulement respirer.

C'est transformer la douleur
en avenir.`,
    translation: `Nací donde el sol
enseña a los niños
que la vida
muchas veces comienza
con la ausencia.

Perdí a mi madre
a los catorce años.

Aquel día
me hice más viejo
que mi propia edad.

Crecí
con el silencio por compañero,
el trabajo por escuela
y la esperanza
como única riqueza.

Hasta que una mañana
miré el horizonte.

Decían
que al otro lado del mar
existía un lugar
donde un hombre
podía volver a empezar.

Subí a un cayuco.

Nueve días
entre el cielo y el agua.

Tres días
sin comer.

Cada ola
me hacía la misma pregunta:

«¿Quieres vivir?»

Y cada latido de mi corazón
respondía:

«Sí.»

Cuando apareció la tierra,
no vi Europa.

Vi
una nueva posibilidad.

Llegué
a la isla de La Gomera,
no con equipaje,

sino con una vida
que me negaba a abandonar.

Hoy,
cada paso que doy
lleva también la memoria
de quienes nunca alcanzaron la orilla.

Camino también por ellos.

Porque sobrevivir
no es solo seguir respirando.

Es convertir el dolor
en futuro.`,
  },
];


type PoetTask =
  | "stone"
  | "pages"
  | "light"
  | "water"
  | "rope"
  | "seed";

type PoetData = {
  position: [number, number, number];
  rotation: number;
  color: string;
  task: PoetTask;
  phase: number;
  scale: number;
};

const POET_COLORS = [
  "#786352",
  "#594f49",
  "#6e6971",
  "#82715d",
  "#6f5d4e",
  "#565c66",
  "#7a674d",
  "#655b58",
  "#66706b",
  "#74695c",
  "#82715f",
  "#5f6268",
  "#8a7059",
  "#56504e",
  "#756d76",
  "#927e66",
  "#735f55",
  "#626975",
  "#806d52",
  "#71635e",
];

const WORKSHOPS: Array<{
  position: [number, number, number];
  rotation: number;
  task: PoetTask;
}> = [
  {
    position: [-8.2, 0.72, 3.8],
    rotation: -0.9,
    task: "stone",
  },
  {
    position: [-5.6, 0.72, 5.2],
    rotation: -0.4,
    task: "stone",
  },
  {
    position: [-5.4, 1.95, 0.5],
    rotation: 0.4,
    task: "pages",
  },
  {
    position: [-2.4, 1.95, 1.3],
    rotation: -0.2,
    task: "pages",
  },
  {
    position: [1.2, 1.95, 2.1],
    rotation: 0.7,
    task: "rope",
  },
  {
    position: [4.4, 1.95, 2.3],
    rotation: 1.1,
    task: "rope",
  },
  {
    position: [-1.2, 3.3, -2.4],
    rotation: -0.4,
    task: "light",
  },
  {
    position: [2.2, 3.3, -1.8],
    rotation: 0.5,
    task: "light",
  },
  {
    position: [5.8, 3.3, -2.4],
    rotation: 1,
    task: "water",
  },
  {
    position: [7.4, 3.3, -4.1],
    rotation: 1.5,
    task: "water",
  },
  {
    position: [2.5, 4.85, -5.8],
    rotation: -0.2,
    task: "seed",
  },
  {
    position: [5.2, 4.85, -6.1],
    rotation: 0.5,
    task: "seed",
  },
];

const FORMATION_OFFSETS: Array<[number, number]> = [
  [-0.82, 0.34],
  [-0.4, -0.26],
  [0, 0.18],
  [0.4, -0.24],
  [0.82, 0.32],
];

const POETS: PoetData[] = WORKSHOPS.flatMap(
  (workshop, workshopIndex) =>
    FORMATION_OFFSETS.map(([side, depth], memberIndex) => {
      const cos = Math.cos(workshop.rotation);
      const sin = Math.sin(workshop.rotation);

      const x =
        workshop.position[0] +
        side * cos -
        depth * sin;

      const z =
        workshop.position[2] +
        side * sin +
        depth * cos;

      const poetIndex =
        workshopIndex * FORMATION_OFFSETS.length +
        memberIndex;

      return {
        position: [
          x,
          workshop.position[1],
          z,
        ],
        rotation:
          workshop.rotation +
          (memberIndex - 2) * 0.13,
        color:
          POET_COLORS[
            poetIndex % POET_COLORS.length
          ],
        task: workshop.task,
        phase:
          poetIndex * 0.39 +
          workshopIndex * 0.17,
        scale:
          0.76 +
          ((poetIndex * 7) % 8) * 0.018,
      };
    })
);

function AutonomousCamera() {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const interactingRef = useRef(false);
  const resumeAtRef = useRef(0);
  const hasTouchedRef = useRef(false);

  useFrame(({ clock }) => {
    const controls = controlsRef.current;
    if (!controls) return;

    const now =
      typeof performance !== "undefined"
        ? performance.now()
        : 0;

    const canResumeAutonomous =
      !interactingRef.current &&
      now >= resumeAtRef.current;

    if (canResumeAutonomous) {
      const t = clock.getElapsedTime() * 0.045;

      const targetPosition = new THREE.Vector3(
        8 + Math.sin(t) * 2.6,
        10.8 + Math.sin(t * 0.8) * 0.7,
        22 + Math.cos(t) * 2.8
      );

      const returnStrength =
        hasTouchedRef.current ? 0.0065 : 0.02;

      camera.position.lerp(
        targetPosition,
        returnStrength
      );

      controls.target.lerp(
        new THREE.Vector3(1.8, 3.1, -2.4),
        hasTouchedRef.current ? 0.025 : 0.08
      );
    }

    controls.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      target={[1.8, 3.1, -2.4]}
      enablePan={false}
      enableRotate
      enableZoom
      enableDamping
      dampingFactor={0.055}
      rotateSpeed={0.42}
      zoomSpeed={0.58}
      minDistance={9}
      maxDistance={38}
      minPolarAngle={0.48}
      maxPolarAngle={1.48}
      onStart={() => {
        interactingRef.current = true;
        hasTouchedRef.current = true;
        resumeAtRef.current = Number.POSITIVE_INFINITY;

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent(
              "poema-universal:camera-orbit",
              { detail: { active: true } }
            )
          );
        }
      }}
      onEnd={() => {
        interactingRef.current = false;
        resumeAtRef.current =
          (typeof performance !== "undefined"
            ? performance.now()
            : 0) + 12000;

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent(
              "poema-universal:camera-orbit",
              { detail: { active: false } }
            )
          );
        }
      }}
    />
  );
}

function PoetTool({ task }: { task: PoetTask }) {
  if (task === "stone") {
    return (
      <mesh position={[0, 0.28, -0.62]} castShadow>
        <dodecahedronGeometry args={[0.34, 0]} />
        <meshStandardMaterial color="#4f4942" roughness={1} />
      </mesh>
    );
  }

  if (task === "pages") {
    return (
      <group
        position={[0.3, 0.72, -0.24]}
        rotation={[0.15, 0.2, -0.18]}
      >
        <mesh castShadow>
          <boxGeometry args={[0.46, 0.06, 0.34]} />
          <meshStandardMaterial color="#dfd3b5" roughness={0.9} />
        </mesh>

        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.42, 0.025, 0.3]} />
          <meshStandardMaterial color="#f1e9d6" />
        </mesh>
      </group>
    );
  }

  if (task === "light") {
    return (
      <group position={[0.3, 0.72, -0.24]}>
        <mesh>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial
            color="#f2c778"
            emissive="#d98e31"
            emissiveIntensity={2.5}
          />
        </mesh>

        <pointLight
          color="#f1b763"
          intensity={8}
          distance={3.5}
        />
      </group>
    );
  }

  if (task === "water") {
    return (
      <group
        position={[0.28, 0.46, -0.28]}
        rotation={[0, 0, -0.25]}
      >
        <mesh castShadow>
          <cylinderGeometry args={[0.22, 0.28, 0.38, 14]} />
          <meshStandardMaterial
            color="#536b72"
            metalness={0.1}
            roughness={0.7}
          />
        </mesh>

        <mesh
          position={[0.28, 0.05, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.055, 0.08, 0.38, 10]} />
          <meshStandardMaterial color="#536b72" />
        </mesh>
      </group>
    );
  }

  if (task === "rope") {
    return (
      <mesh
        position={[0.28, 0.56, -0.25]}
        rotation={[Math.PI / 2, 0.2, 0]}
        castShadow
      >
        <torusGeometry args={[0.22, 0.035, 8, 24]} />
        <meshStandardMaterial color="#9a7950" roughness={1} />
      </mesh>
    );
  }

  return (
    <group position={[0.3, 0.54, -0.2]}>
      <mesh castShadow>
        <sphereGeometry args={[0.12, 14, 14]} />
        <meshStandardMaterial color="#a49366" roughness={1} />
      </mesh>

      <mesh position={[0, 0.19, 0]}>
        <coneGeometry args={[0.06, 0.28, 8]} />
        <meshStandardMaterial color="#d8d5c2" />
      </mesh>
    </group>
  );
}

function Poet({
  position,
  rotation,
  color,
  task,
  phase,
  scale,
}: PoetData) {
  // V52_ANATOMIA_POETICA_REFINADA
  // V52C_CABEZAS_RENDIMIENTO
  const root = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const leftUpperArm = useRef<THREE.Group>(null);
  const rightUpperArm = useRef<THREE.Group>(null);
  const leftForearm = useRef<THREE.Group>(null);
  const rightForearm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);
  const leftLowerLeg = useRef<THREE.Group>(null);
  const rightLowerLeg = useRef<THREE.Group>(null);

  const silhouetteProfiles = [
    { height: 0.97, shoulders: 0.90, chest: 0.93, hips: 0.92, limbs: 0.97, headX: 0.93, headY: 1.08, stance: 0.095, robe: 0.82, lean: -0.010 },
    { height: 1.03, shoulders: 1.11, chest: 1.06, hips: 0.97, limbs: 1.02, headX: 0.98, headY: 1.02, stance: 0.112, robe: 0.72, lean: 0.000 },
    { height: 0.94, shoulders: 1.00, chest: 1.02, hips: 1.09, limbs: 0.93, headX: 1.02, headY: 0.99, stance: 0.122, robe: 1.04, lean: 0.012 },
    { height: 1.08, shoulders: 0.95, chest: 0.92, hips: 0.90, limbs: 1.08, headX: 0.91, headY: 1.10, stance: 0.102, robe: 0.68, lean: -0.012 },
    { height: 0.99, shoulders: 1.05, chest: 0.99, hips: 1.03, limbs: 1.00, headX: 1.00, headY: 1.04, stance: 0.118, robe: 1.12, lean: 0.008 },
    { height: 1.01, shoulders: 0.97, chest: 1.00, hips: 0.95, limbs: 0.99, headX: 0.96, headY: 1.01, stance: 0.106, robe: 0.88, lean: -0.004 },
  ] as const;

  const silhouetteIndex =
    Math.abs(Math.floor(phase * 17.31)) %
    silhouetteProfiles.length;

  const silhouette =
    silhouetteProfiles[silhouetteIndex];

  const skinPalette = [
    "#d0aa8d",
    "#bd9073",
    "#a87962",
    "#d8b99e",
    "#c49778",
    "#8f6655",
  ];

  const hairPalette = [
    "#3d3029",
    "#5a4638",
    "#2e2926",
    "#6a5240",
    "#403731",
    "#725641",
  ];

  const skin =
    skinPalette[silhouetteIndex];

  const hair =
    hairPalette[
      (silhouetteIndex + 2) %
        hairPalette.length
    ];

  const h = silhouette.height;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const local = t * 0.9 + phase;
    const slow =
      t * 0.28 + phase * 0.73;

    const breath =
      Math.sin(local * 1.08) * 0.008;

    const rareGesture =
      Math.pow(
        Math.max(
          0,
          Math.sin(
            t * 0.39 +
              phase * 1.57
          )
        ),
        11
      );

    let lean = silhouette.lean;

    let torsoTurn =
      Math.sin(slow * 0.76) *
      0.032;

    let headTurn =
      Math.sin(slow * 0.92) *
      0.085;

    let headTilt =
      Math.sin(slow * 1.07) *
      0.026;

    let leftShoulder = -0.08;
    let rightShoulder = -0.14;
    let leftElbow = -0.22;
    let rightElbow = -0.28;

    let leftHip = -0.018;
    let rightHip = 0.018;

    let leftKnee = 0.05;
    let rightKnee = 0.04;

    let stepX = 0;
    let stepZ = 0;

    switch (task) {
      case "stone":
        lean +=
          0.045 +
          rareGesture * 0.07;

        rightShoulder =
          -0.42 +
          Math.sin(
            local * 1.16
          ) * 0.12;

        leftShoulder =
          -0.28 +
          Math.sin(
            local * 0.82 + 1.1
          ) * 0.07;

        rightElbow =
          -0.5 -
          rareGesture * 0.18;

        leftElbow = -0.38;
        leftHip = -0.055;
        rightHip = 0.045;
        leftKnee = 0.12;
        rightKnee = 0.075;

        stepZ =
          Math.sin(
            local * 0.42
          ) * 0.009;

        break;

      case "pages":
        lean -= 0.008;

        rightShoulder =
          -0.04 +
          Math.sin(
            local * 0.55
          ) * 0.045;

        leftShoulder =
          0.08 +
          Math.sin(
            local * 0.5 + 0.8
          ) * 0.04;

        rightElbow =
          -0.62 +
          rareGesture * 0.23;

        leftElbow =
          -0.66 +
          Math.sin(
            local * 0.55
          ) * 0.08;

        headTilt -=
          rareGesture * 0.04;

        torsoTurn += 0.03;
        break;

      case "light":
        lean -= 0.015;

        rightShoulder =
          -0.27 -
          rareGesture * 0.18;

        leftShoulder = 0.06;

        rightElbow =
          -0.48 -
          rareGesture * 0.24;

        leftElbow = -0.32;

        headTurn +=
          rareGesture * 0.12;

        headTilt +=
          rareGesture * 0.035;

        torsoTurn += 0.04;
        break;

      case "water":
        lean +=
          0.038 +
          rareGesture * 0.045;

        rightShoulder =
          -0.36 +
          Math.sin(
            local * 0.84
          ) * 0.1;

        leftShoulder = -0.16;
        rightElbow = -0.52;
        leftElbow = -0.34;

        leftHip = -0.045;
        rightHip = 0.035;
        leftKnee = 0.1;

        stepX =
          Math.sin(
            local * 0.4
          ) * 0.008;

        break;

      case "rope":
        lean +=
          Math.sin(
            local * 0.43
          ) * 0.022;

        rightShoulder =
          -0.5 +
          Math.sin(
            local * 0.96
          ) * 0.13;

        leftShoulder =
          -0.38 +
          Math.sin(
            local * 0.96 + 1.2
          ) * 0.11;

        rightElbow = -0.58;
        leftElbow = -0.55;

        torsoTurn -= 0.05;

        leftHip = -0.04;
        rightHip = 0.04;

        leftKnee = 0.09;
        rightKnee = 0.08;

        stepZ =
          Math.sin(
            local * 0.41
          ) * 0.009;

        break;

      case "seed":
        lean +=
          0.03 +
          rareGesture * 0.065;

        rightShoulder =
          -0.28 +
          Math.sin(
            local * 0.67
          ) * 0.07;

        leftShoulder =
          -0.07 +
          rareGesture * 0.08;

        rightElbow = -0.5;
        leftElbow = -0.38;

        headTilt -=
          rareGesture * 0.035;

        leftHip = -0.04;
        leftKnee = 0.11;
        rightKnee = 0.07;

        break;
    }

    if (root.current) {
      root.current.position.x =
        position[0] + stepX;

      root.current.position.y =
        position[1] +
        breath +
        Math.sin(
          local * 0.34
        ) * 0.006;

      root.current.position.z =
        position[2] + stepZ;

      root.current.rotation.x =
        lean;

      root.current.rotation.y =
        rotation +
        torsoTurn +
        rareGesture * 0.014;
    }

    if (torso.current) {
      torso.current.scale.y =
        1 + breath * 0.18;

      torso.current.rotation.z =
        Math.sin(
          slow * 0.8
        ) * 0.01;
    }

    if (head.current) {
      head.current.rotation.y =
        headTurn;

      head.current.rotation.z =
        headTilt;
    }

    if (leftUpperArm.current) {
      leftUpperArm.current.rotation.x =
        leftShoulder;

      leftUpperArm.current.rotation.z =
        0.1;
    }

    if (rightUpperArm.current) {
      rightUpperArm.current.rotation.x =
        rightShoulder;

      rightUpperArm.current.rotation.z =
        -0.1;
    }

    if (leftForearm.current) {
      leftForearm.current.rotation.x =
        leftElbow;
    }

    if (rightForearm.current) {
      rightForearm.current.rotation.x =
        rightElbow;
    }

    if (leftLeg.current) {
      leftLeg.current.rotation.x =
        leftHip;
    }

    if (rightLeg.current) {
      rightLeg.current.rotation.x =
        rightHip;
    }

    if (leftLowerLeg.current) {
      leftLowerLeg.current.rotation.x =
        leftKnee;
    }

    if (rightLowerLeg.current) {
      rightLowerLeg.current.rotation.x =
        rightKnee;
    }
  });

  const shoulderX =
    0.225 *
    silhouette.shoulders;

  const hipX =
    silhouette.stance;

  const torsoY =
    0.83 * h;

  const neckY =
    1.13 * h;

  const headY =
    1.32 * h;

  const hipY =
    0.56 * h;

  return (
    <group
      ref={root}
      position={position}
      rotation={[0, rotation, 0]}
      scale={scale}
    >

      <mesh
        position={[0, 0.018, 0.035]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[0.52, 0.26, 1]}
        renderOrder={-1}
      >
        <circleGeometry args={[0.42, 12]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.24}
          depthWrite={false}
        />
      </mesh>
      <group
        ref={torso}
        position={[
          0,
          torsoY,
          0,
        ]}
      >
        <mesh
          position={[
            0,
            0.1 * h,
            0,
          ]}
          scale={[
            silhouette.chest *
              1.28,
            0.82,
            silhouette.chest *
              0.76,
          ]}
        >
          <sphereGeometry
            args={[
              0.19,
              12,
              12,
            ]}
          />

          <meshStandardMaterial
            color={color}
            roughness={0.96}
            metalness={0.012}
          />
        </mesh>

        <mesh
          position={[
            0,
            -0.12 * h,
            0,
          ]}
          scale={[
            silhouette.hips *
              1.02,
            0.96,
            silhouette.hips *
              0.76,
          ]}
        >
          <sphereGeometry
            args={[
              0.18,
              12,
              12,
            ]}
          />

          <meshStandardMaterial
            color={color}
            roughness={0.97}
            metalness={0.01}
          />
        </mesh>

        <mesh
          position={[
            0,
            -0.28 * h,
            0,
          ]}
        >
          <cylinderGeometry
            args={[
              0.16 *
                silhouette.hips,
              0.21 *
                silhouette.hips *
                silhouette.robe,
              0.34 *
                h *
                silhouette.robe,
              8,
            ]}
          />

          <meshStandardMaterial
            color={color}
            roughness={0.98}
            metalness={0.008}
          />
        </mesh>

        <mesh
          position={[
            0,
            0.23 * h,
            0,
          ]}
          rotation={[
            0,
            0,
            Math.PI / 2,
          ]}
          scale={[
            1,
            silhouette.shoulders,
            1,
          ]}
        >
          <cylinderGeometry
            args={[
              0.055,
              0.065,
              0.37,
              8,
            ]}
          />

          <meshStandardMaterial
            color={color}
            roughness={0.96}
          />
        </mesh>
      </group>

      <mesh
        position={[
          0,
          neckY,
          0,
        ]}
      >
        <cylinderGeometry
          args={[
            0.048,
            0.06,
            0.12 * h,
            8,
          ]}
        />

        <meshStandardMaterial
          color={skin}
          roughness={0.92}
        />
      </mesh>

      <group
        ref={head}
        position={[
          0,
          headY,
          0,
        ]}
        scale={[
          silhouette.headX,
          silhouette.headY,
          0.91,
        ]}
      >
        <mesh>
          <sphereGeometry
            args={[
              0.165,
              12,
              12,
            ]}
          />

          <meshStandardMaterial
            color={skin}
            roughness={0.93}
          />
        </mesh>

        <mesh
          position={[
            0,
            -0.082,
            0.012,
          ]}
          scale={[
            0.88,
            0.63,
            0.86,
          ]}
        >
          <sphereGeometry
            args={[
              0.14,
              12,
              12,
            ]}
          />

          <meshStandardMaterial
            color={skin}
            roughness={0.94}
          />
        </mesh>

        <mesh
          position={[
            0,
            -0.005,
            0.152,
          ]}
          scale={[
            0.36,
            0.48,
            0.3,
          ]}
        >
          <sphereGeometry
            args={[
              0.07,
              12,
              12,
            ]}
          />

          <meshStandardMaterial
            color={skin}
            roughness={0.95}
          />
        </mesh>

        {silhouetteIndex !== 2 && (
          <mesh
            position={[
              0,
              0.145,
              -0.055,
            ]}
            scale={[
              0.98,
              0.29,
              0.92,
            ]}
          >
            <sphereGeometry
              args={[
                0.16,
                12,
                12,
              ]}
            />

            <meshStandardMaterial
              color={hair}
              roughness={0.98}
            />
          </mesh>
        )}
      </group>

      <group
        ref={leftUpperArm}
        position={[
          shoulderX,
          1.0 * h,
          0,
        ]}
      >
        <mesh
          position={[
            0,
            -0.14 * h,
            0,
          ]}
        >
          <cylinderGeometry
            args={[
              0.046,
              0.057,
              0.29 *
                h *
                silhouette.limbs,
              8,
            ]}
          />

          <meshStandardMaterial
            color={color}
            roughness={0.96}
          />
        </mesh>

        <mesh
          position={[
            0,
            -0.29 * h,
            0,
          ]}
        >
          <sphereGeometry
            args={[
              0.052,
              12,
              12,
            ]}
          />

          <meshStandardMaterial
            color={skin}
            roughness={0.94}
          />
        </mesh>

        <group
          ref={leftForearm}
          position={[
            0,
            -0.29 * h,
            0,
          ]}
        >
          <mesh
            position={[
              0.015,
              -0.12 * h,
              0.015,
            ]}
          >
            <cylinderGeometry
              args={[
                0.034,
                0.043,
                0.25 *
                  h *
                  silhouette.limbs,
                8,
              ]}
            />

            <meshStandardMaterial
              color={skin}
              roughness={0.94}
            />
          </mesh>

          <mesh
            position={[
              0.025,
              -0.255 * h,
              0.03,
            ]}
            scale={[
              0.7,
              1,
              0.52,
            ]}
          >
            <sphereGeometry
              args={[
                0.052,
                12,
                12,
              ]}
            />

            <meshStandardMaterial
              color={skin}
              roughness={0.94}
            />
          </mesh>
        </group>
      </group>

      <group
        ref={rightUpperArm}
        position={[
          -shoulderX,
          1.0 * h,
          0,
        ]}
      >
        <mesh
          position={[
            0,
            -0.14 * h,
            0,
          ]}
        >
          <cylinderGeometry
            args={[
              0.046,
              0.057,
              0.29 *
                h *
                silhouette.limbs,
              8,
            ]}
          />

          <meshStandardMaterial
            color={color}
            roughness={0.96}
          />
        </mesh>

        <mesh
          position={[
            0,
            -0.29 * h,
            0,
          ]}
        >
          <sphereGeometry
            args={[
              0.052,
              12,
              12,
            ]}
          />

          <meshStandardMaterial
            color={skin}
            roughness={0.94}
          />
        </mesh>

        <group
          ref={rightForearm}
          position={[
            0,
            -0.29 * h,
            0,
          ]}
        >
          <mesh
            position={[
              -0.015,
              -0.12 * h,
              0.015,
            ]}
          >
            <cylinderGeometry
              args={[
                0.034,
                0.043,
                0.25 *
                  h *
                  silhouette.limbs,
                8,
              ]}
            />

            <meshStandardMaterial
              color={skin}
              roughness={0.94}
            />
          </mesh>

          <mesh
            position={[
              -0.025,
              -0.255 * h,
              0.03,
            ]}
            scale={[
              0.7,
              1,
              0.52,
            ]}
          >
            <sphereGeometry
              args={[
                0.052,
                12,
                12,
              ]}
            />

            <meshStandardMaterial
              color={skin}
              roughness={0.94}
            />
          </mesh>
        </group>
      </group>

      <group
        ref={leftLeg}
        position={[
          hipX,
          hipY,
          0,
        ]}
      >
        <mesh
          position={[
            0,
            -0.16 * h,
            0,
          ]}
        >
          <cylinderGeometry
            args={[
              0.058,
              0.069,
              0.33 *
                h *
                silhouette.limbs,
              8,
            ]}
          />

          <meshStandardMaterial
            color={color}
            roughness={0.97}
          />
        </mesh>

        <mesh
          position={[
            0,
            -0.33 * h,
            0,
          ]}
        >
          <sphereGeometry
            args={[
              0.057,
              12,
              12,
            ]}
          />

          <meshStandardMaterial
            color="#796b60"
            roughness={0.98}
          />
        </mesh>

        <group
          ref={leftLowerLeg}
          position={[
            0,
            -0.33 * h,
            0,
          ]}
        >
          <mesh
            position={[
              0,
              -0.14 * h,
              0.01,
            ]}
          >
            <cylinderGeometry
              args={[
                0.043,
                0.054,
                0.28 *
                  h *
                  silhouette.limbs,
                8,
              ]}
            />

            <meshStandardMaterial
              color="#6f6258"
              roughness={0.99}
            />
          </mesh>

          <mesh
            position={[
              0,
              -0.29 * h,
              0.065,
            ]}
            scale={[
              0.7,
              0.48,
              1.2,
            ]}
          >
            <boxGeometry
              args={[
                0.12,
                0.1,
                0.17,
              ]}
            />

            <meshStandardMaterial
              color="#564c45"
              roughness={1}
            />
          </mesh>
        </group>
      </group>

      <group
        ref={rightLeg}
        position={[
          -hipX,
          hipY,
          0,
        ]}
      >
        <mesh
          position={[
            0,
            -0.16 * h,
            0,
          ]}
        >
          <cylinderGeometry
            args={[
              0.058,
              0.069,
              0.33 *
                h *
                silhouette.limbs,
              8,
            ]}
          />

          <meshStandardMaterial
            color={color}
            roughness={0.97}
          />
        </mesh>

        <mesh
          position={[
            0,
            -0.33 * h,
            0,
          ]}
        >
          <sphereGeometry
            args={[
              0.057,
              12,
              12,
            ]}
          />

          <meshStandardMaterial
            color="#796b60"
            roughness={0.98}
          />
        </mesh>

        <group
          ref={rightLowerLeg}
          position={[
            0,
            -0.33 * h,
            0,
          ]}
        >
          <mesh
            position={[
              0,
              -0.14 * h,
              0.01,
            ]}
          >
            <cylinderGeometry
              args={[
                0.043,
                0.054,
                0.28 *
                  h *
                  silhouette.limbs,
                8,
              ]}
            />

            <meshStandardMaterial
              color="#6f6258"
              roughness={0.99}
            />
          </mesh>

          <mesh
            position={[
              0,
              -0.29 * h,
              0.065,
            ]}
            scale={[
              0.7,
              0.48,
              1.2,
            ]}
          >
            <boxGeometry
              args={[
                0.12,
                0.1,
                0.17,
              ]}
            />

            <meshStandardMaterial
              color="#564c45"
              roughness={1}
            />
          </mesh>
        </group>
      </group>

      <PoetTool task={task} />
    </group>
  );
}

function Terraces() {
  const terraces = [
    {
      position: [0, 0, 0] as [number, number, number],
      size: [22, 1.15, 16] as [number, number, number],
      color: "#403b35",
    },
    {
      position: [0.5, 1.2, -1.5] as [number, number, number],
      size: [18, 1.2, 12] as [number, number, number],
      color: "#4b443b",
    },
    {
      position: [2.2, 2.55, -3.6] as [number, number, number],
      size: [13.5, 1.45, 8.2] as [number, number, number],
      color: "#393631",
    },
    {
      position: [3.8, 4.05, -5.5] as [number, number, number],
      size: [8.8, 1.55, 5.5] as [number, number, number],
      color: "#514a40",
    },
  ];

  const stairCount = 8;
  const totalRise = 1.225;
  const stepRise = totalRise / stairCount;
  const baseHeight = 0.575;

  return (
    <>
      {terraces.map((terrace, index) => (
        <mesh
          key={index}
          position={terrace.position}
          receiveShadow
          castShadow
        >
          <boxGeometry args={terrace.size} />

          <meshStandardMaterial
            color={terrace.color}
            roughness={1}
          />
        </mesh>
      ))}

      <group position={[-4.4, baseHeight, 4.45]}>
        {Array.from({ length: stairCount }).map((_, index) => {
          const stepHeight = stepRise * (index + 1);

          return (
            <mesh
              key={`monumental-step-${index}`}
              position={[
                0,
                stepHeight / 2,
                -index * 0.43,
              ]}
              castShadow
              receiveShadow
            >
              <boxGeometry
                args={[
                  2.55,
                  stepHeight,
                  0.48,
                ]}
              />

              <meshStandardMaterial
                color={
                  index % 2 === 0
                    ? "#6d6254"
                    : "#645a4e"
                }
                roughness={0.96}
                metalness={0}
              />
            </mesh>
          );
        })}

        <mesh
          position={[
            0,
            totalRise + 0.055,
            -(stairCount - 1) * 0.43 - 0.12,
          ]}
          receiveShadow
        >
          <boxGeometry args={[2.7, 0.11, 0.72]} />

          <meshStandardMaterial
            color="#756a5a"
            roughness={1}
          />
        </mesh>
      </group>

      <mesh
        position={[-8.7, 0.72, -4.8]}
        receiveShadow
      >
        <boxGeometry args={[4.2, 0.16, 4.8]} />

        <meshStandardMaterial
          color="#263b45"
          roughness={0.3}
          metalness={0.05}
        />
      </mesh>
    </>
  );
}

function Ruins() {
  return (
    <group position={[7.2, 5.4, -6.5]}>
      {[-1.2, 0, 1.2].map((x) => (
        <mesh key={x} position={[x, 1.35, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.25, 2.7, 12]} />
          <meshStandardMaterial color="#b7ad96" roughness={1} />
        </mesh>
      ))}

      <mesh position={[0, 2.72, 0]} castShadow>
        <boxGeometry args={[3.4, 0.32, 0.62]} />
        <meshStandardMaterial color="#a99e87" roughness={1} />
      </mesh>
    </group>
  );
}

function Bridge() {
  return (
    <group
      position={[5.2, 3.85, 0.8]}
      rotation={[0, -0.12, 0]}
    >
      <mesh receiveShadow castShadow>
        <boxGeometry args={[6.5, 0.28, 1.55]} />
        <meshStandardMaterial color="#67513d" roughness={1} />
      </mesh>

      {Array.from({ length: 7 }).map((_, index) => (
        <mesh
          key={index}
          position={[-3 + index, 0.6, -0.63]}
          castShadow
        >
          <cylinderGeometry args={[0.045, 0.045, 1.2, 8]} />
          <meshStandardMaterial color="#927452" />
        </mesh>
      ))}
    </group>
  );
}

function BookJourney() {
  const book = useRef<THREE.Group>(null);

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-8.2, 1.5, 4.4),
        new THREE.Vector3(-5.8, 2.6, 1.2),
        new THREE.Vector3(-1.2, 3.9, -2),
        new THREE.Vector3(3, 5.2, -4.6),
        new THREE.Vector3(4.2, 6.25, -6.1),
      ]),
    []
  );

  const point = useMemo(() => new THREE.Vector3(), []);
  const tangent = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    if (!book.current) return;

    const cycle =
      (clock.getElapsedTime() % CYCLE_DURATION) /
      CYCLE_DURATION;

    const travel = Math.min(cycle / 0.78, 1);
    const eased = travel * travel * (3 - 2 * travel);

    curve.getPointAt(eased, point);
    curve.getTangentAt(Math.min(eased, 0.999), tangent);

    book.current.position.copy(point);
    book.current.position.y +=
      Math.sin(clock.getElapsedTime() * 2) * 0.08;

    book.current.rotation.y =
      Math.atan2(tangent.x, tangent.z);
  });

  return (
    <group ref={book}>
      <mesh castShadow>
        <boxGeometry args={[0.72, 0.18, 0.52]} />
        <meshStandardMaterial
          color="#c7a666"
          emissive="#4a3015"
          emissiveIntensity={0.45}
          roughness={0.55}
        />
      </mesh>

      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.64, 0.06, 0.46]} />
        <meshStandardMaterial color="#e9dfc8" roughness={0.9} />
      </mesh>

      <pointLight
        position={[0, 0.3, 0]}
        color="#e9b65e"
        intensity={5}
        distance={3}
      />
    </group>
  );
}

function WhiteTree() {
  const blossoms = useRef<Array<THREE.Mesh | null>>([]);

  const blossomData = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, index) => {
        const angle = index * 2.399;
        const radius =
          0.5 + (((index * 37) % 100) / 100) * 2.2;

        const height =
          3.7 + (((index * 23) % 100) / 100) * 2.7;

        return {
          position: [
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius * 0.72,
          ] as [number, number, number],
          delay: (index % 12) / 12,
        };
      }),
    []
  );

  useFrame(({ clock }) => {
    const cycle =
      (clock.getElapsedTime() % CYCLE_DURATION) /
      CYCLE_DURATION;

    const rawBloom = THREE.MathUtils.clamp(
      (cycle - 0.72) / 0.18,
      0,
      1
    );

    const bloom =
      rawBloom * rawBloom * (3 - 2 * rawBloom);

    blossoms.current.forEach((mesh, index) => {
      if (!mesh) return;

      const delayed = THREE.MathUtils.clamp(
        bloom * 1.5 -
          blossomData[index].delay * 0.5,
        0,
        1
      );

      const pulse =
        1 +
        Math.sin(clock.getElapsedTime() * 2 + index) *
          0.06;

      mesh.scale.setScalar(delayed * pulse);
    });
  });

  return (
    <group position={[4.2, 4.85, -6.15]}>
      <mesh position={[0, 2.25, 0]} castShadow>
        <cylinderGeometry args={[0.23, 0.52, 4.5, 14]} />
        <meshStandardMaterial color="#c6bdaa" roughness={1} />
      </mesh>

      {[
        [0.8, 4.1, 0, 0.85],
        [-0.9, 4.25, 0.2, -0.8],
        [0.5, 4.9, -0.1, 0.55],
        [-0.5, 5.05, 0.1, -0.55],
      ].map(([x, y, z, rotation], index) => (
        <mesh
          key={index}
          position={[x, y, z]}
          rotation={[0, 0, rotation]}
          castShadow
        >
          <cylinderGeometry args={[0.09, 0.15, 2.1, 10]} />
          <meshStandardMaterial color="#d4ccbb" roughness={1} />
        </mesh>
      ))}

      {blossomData.map((blossom, index) => (
        <mesh
          key={index}
          ref={(node) => {
            blossoms.current[index] = node;
          }}
          position={blossom.position}
          scale={0}
        >
          <sphereGeometry args={[0.17, 12, 12]} />
          <meshStandardMaterial
            color="#f4f1e8"
            emissive="#d2c79f"
            emissiveIntensity={0.6}
            roughness={0.75}
          />
        </mesh>
      ))}

      <pointLight
        position={[0, 4.8, 0]}
        color="#fff0c5"
        intensity={10}
        distance={8}
      />
    </group>
  );
}

function isElHuertoPoem(
  poemId: string | null
) {
  return Boolean(
    poemId
      ?.toLowerCase()
      .includes("huerto")
  );
}

function isAsatakaPoem(
  poemId: string | null
) {
  const normalized =
    poemId?.toLowerCase() ?? "";

  return (
    normalized.includes("asataka") ||
    normalized === "poema-02" ||
    normalized === "poem-02"
  );
}

function Scene({
  activePoemId,
}: {
  activePoemId: string | null;
}) {
  return (
    <>
      <color attach="background" args={["#07090d"]} />
      <fog attach="fog" args={["#0b1016", 20, 52]} />

      <ambientLight intensity={0.62} />

      <hemisphereLight
        color="#d3deeb"
        groundColor="#2d241a"
        intensity={1.35}
      />

      <directionalLight
        position={[-12, 18, 10]}
        color="#ffd79e"
        intensity={3.1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <pointLight
        position={[6, 8, -3]}
        color="#d79747"
        intensity={20}
        distance={22}
      />

      <pointLight
        position={[4.2, 8.6, -6.2]}
        color="#fff1c8"
        intensity={10}
        distance={10}
      />

      <group position={[-1.2, 0, 0]} scale={1.08}>
        <Terraces />
        <WorldStory />
        <ElHuertoRitual
          activeScene={
            isElHuertoPoem(
              activePoemId
            )
          }
        />
        <LaLuzRegresaRitual
          activeScene={
            isAsatakaPoem(
              activePoemId
            )
          }
        />
        <Bridge />
        <Ruins />

        {POETS.map((poet, index) => (
          <Poet key={index} {...poet} />
        ))}

        <BookJourney />
        <WhiteTree />
      </group>

      <Sparkles
        count={64}
        scale={[32, 12, 24]}
        position={[0, 5, -2]}
        size={1.4}
        speed={0.18}
        opacity={0.3}
        color="#dbc9a0"
      />

      <PoemSoundLightRig />

      <AutonomousCamera />
    </>
  );
}

export default function MundoPoema() {
  const [
    activePoemId,
    setActivePoemId,
  ] = useState<string | null>(null);

  return (
    <main className={styles.page}>
      <div className={styles.canvas}>
        <Canvas
          shadows="basic"
          dpr={[0.9, 1.3]}
          camera={{
            position: [8, 10.8, 24],
            fov: 42,
            near: 0.1,
            far: 100,
          }}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
          }}
        >
          <Scene
            activePoemId={
              activePoemId
            }
          />
        </Canvas>
      </div>

      <div className={styles.atmosphere} />

      <header className={styles.header}>
        <Link href="/poema-universal" className={styles.back}>
          POEMA UNIVERSAL
        </Link>

        <p className={styles.eyebrow}>
          EXPERIENCIA AUTÓNOMA · PROTOTIPO I
        </p>

        <h1>La Construcción del Poema</h1>

        <p className={styles.intro}>
          Sesenta voces llegan a una tierra que todavía no sabe
          convertirse en mundo. Cada poema entrega algo al Libro;
          cada entrega modifica la materia, hasta que el Árbol
          Blanco recuerda cómo florecer.
        </p>
      </header>

      <NarrativeOverlay />

      <PoemSoundtrack />

      <PoemBook
        poems={FOUNDATIONAL_BOOK_POEMS}
        onActivePoemChange={
          setActivePoemId
        }
      />

      <div className={styles.legend}>
        <span className={styles.liveDot} />
        La obra vive sin ser dirigida
      </div>
    </main>
  );
}
