import * as THREE
  from "three";

interface TextPanelOptions {
  text: string;
  width?: number;
  height?: number;
  fontSize?: number;
  color?: string;
  paper?: string;
  italic?: boolean;
}

export interface TextPanel {
  mesh:
    THREE.Mesh<
      THREE.PlaneGeometry,
      THREE.MeshBasicMaterial
    >;

  material:
    THREE.MeshBasicMaterial;

  texture:
    THREE.CanvasTexture;

  dispose(): void;
}

export function createTextPanel(
  options:
    TextPanelOptions
): TextPanel {
  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width =
    1600;

  canvas.height =
    900;

  const context =
    canvas.getContext(
      "2d"
    );

  if (!context) {
    throw new Error(
      "Canvas 2D no disponible"
    );
  }

  context.fillStyle =
    options.paper ??
    "#eee8dd";

  context.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  for (
    let y = 30;
    y < canvas.height;
    y += 64
  ) {
    context.strokeStyle =
      "rgba(65,95,120,0.055)";

    context.lineWidth =
      2;

    context.beginPath();

    context.moveTo(
      0,
      y
    );

    context.lineTo(
      canvas.width,
      y
    );

    context.stroke();
  }

  context.fillStyle =
    options.color ??
    "#272521";

  context.textAlign =
    "center";

  context.textBaseline =
    "middle";

  const size =
    options.fontSize ??
    74;

  context.font =
    `${
      options.italic
        ? "italic "
        : ""
    }${size}px Georgia`;

  const lines =
    options.text.split(
      "\n"
    );

  const lineHeight =
    size * 1.28;

  const startY =
    canvas.height * 0.5 -
    (
      lines.length - 1
    ) *
      lineHeight *
      0.5;

  lines.forEach(
    (
      line,
      index
    ) => {
      context.fillText(
        line,
        canvas.width * 0.5,
        startY +
          index *
            lineHeight
      );
    }
  );

  const texture =
    new THREE.CanvasTexture(
      canvas
    );

  texture.colorSpace =
    THREE.SRGBColorSpace;

  texture.anisotropy =
    4;

  const material =
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      side:
        THREE.DoubleSide,
    });

  const geometry =
    new THREE.PlaneGeometry(
      options.width ??
        5.5,
      options.height ??
        3.1
    );

  const mesh =
    new THREE.Mesh(
      geometry,
      material
    );

  return {
    mesh,
    material,
    texture,

    dispose() {
      geometry.dispose();
      material.dispose();
      texture.dispose();
    },
  };
}
