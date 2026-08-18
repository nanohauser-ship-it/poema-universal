import * as THREE from "three";

import type {
  CameraConfiguration,
  CameraPresetId,
  Vector3Tuple,
} from "../types/audiovisual";

type CameraPreset = {
  position: Vector3Tuple;
  lookAt: Vector3Tuple;
  fov: number;
};

const CAMERA_PRESETS: Record<CameraPresetId, CameraPreset> = {
  GENERAL: {
    position: [0, 2.4, 8.4],
    lookAt: [0, 2.22, -2.2],
    fov: 44,
  },
  IMMERSIVE: {
    position: [0, 2.55, 7.55],
    lookAt: [0, 2.28, -2.85],
    fov: 54,
  },
  PERFORMANCE: {
    position: [0, 2.48, 8.8],
    lookAt: [0, 2.06, 0.28],
    fov: 42,
  },
};

export class CameraDirector {
  private readonly targetPosition = new THREE.Vector3();
  private readonly currentLookAt = new THREE.Vector3();
  private readonly targetLookAt = new THREE.Vector3();
  private readonly renderedLookAt = new THREE.Vector3();

  private targetFov = 44;
  private targetResponse = 3.8;
  private pointerId: number | null = null;
  private previousX = 0;
  private previousY = 0;
  private targetYaw = 0;
  private targetPitch = 0;
  private yaw = 0;
  private pitch = 0;
  private disposed = false;

  constructor(
    private readonly camera: THREE.PerspectiveCamera,
    private readonly element: HTMLCanvasElement
  ) {
    const initial = CAMERA_PRESETS.GENERAL;
    this.camera.position.set(...initial.position);
    this.targetPosition.copy(this.camera.position);
    this.currentLookAt.set(...initial.lookAt);
    this.targetLookAt.copy(this.currentLookAt);
    this.targetFov = initial.fov;

    this.element.style.cursor = "grab";
    this.element.style.touchAction = "none";
    this.element.addEventListener("pointerdown", this.onPointerDown);
    this.element.addEventListener("pointermove", this.onPointerMove);
    this.element.addEventListener("pointerup", this.finishPointer);
    this.element.addEventListener("pointercancel", this.finishPointer);
    this.element.addEventListener("lostpointercapture", this.finishPointer);
  }

  setCamera(configuration: CameraConfiguration): void {
    const preset = CAMERA_PRESETS[configuration.preset];
    const position = configuration.position ?? preset.position;
    const lookAt = configuration.lookAt ?? preset.lookAt;

    this.targetPosition.set(position[0], position[1], position[2]);
    this.targetLookAt.set(lookAt[0], lookAt[1], lookAt[2]);
    this.targetFov = configuration.fov ?? preset.fov;
    this.targetResponse = THREE.MathUtils.clamp(
      configuration.response ?? 3.8,
      0.35,
      12
    );
  }

  centerView(): void {
    this.targetYaw = 0;
    this.targetPitch = 0;
  }

  update(deltaTime: number): void {
    if (this.disposed) {
      return;
    }

    const cameraAlpha = 1 - Math.exp(-this.targetResponse * deltaTime);
    const lookAlpha = 1 - Math.exp(-5.2 * deltaTime);

    this.camera.position.lerp(this.targetPosition, cameraAlpha);
    this.currentLookAt.lerp(this.targetLookAt, cameraAlpha);
    this.yaw = THREE.MathUtils.lerp(this.yaw, this.targetYaw, lookAlpha);
    this.pitch = THREE.MathUtils.lerp(this.pitch, this.targetPitch, lookAlpha);

    const nextFov = THREE.MathUtils.lerp(this.camera.fov, this.targetFov, cameraAlpha);

    if (Math.abs(nextFov - this.camera.fov) > 0.0001) {
      this.camera.fov = nextFov;
      this.camera.updateProjectionMatrix();
    }

    this.renderedLookAt.set(
      this.currentLookAt.x + Math.sin(this.yaw) * 5.5,
      this.currentLookAt.y - this.pitch * 5,
      this.currentLookAt.z
    );
    this.camera.lookAt(this.renderedLookAt);
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }

    this.disposed = true;
    this.element.removeEventListener("pointerdown", this.onPointerDown);
    this.element.removeEventListener("pointermove", this.onPointerMove);
    this.element.removeEventListener("pointerup", this.finishPointer);
    this.element.removeEventListener("pointercancel", this.finishPointer);
    this.element.removeEventListener("lostpointercapture", this.finishPointer);

    if (this.pointerId !== null && this.element.hasPointerCapture(this.pointerId)) {
      this.element.releasePointerCapture(this.pointerId);
    }

    this.pointerId = null;
  }

  private readonly onPointerDown = (event: PointerEvent): void => {
    this.pointerId = event.pointerId;
    this.previousX = event.clientX;
    this.previousY = event.clientY;
    this.element.setPointerCapture(event.pointerId);
    this.element.style.cursor = "grabbing";
  };

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (this.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - this.previousX;
    const deltaY = event.clientY - this.previousY;

    this.targetYaw = THREE.MathUtils.clamp(
      this.targetYaw - deltaX * 0.003,
      -0.72,
      0.72
    );
    this.targetPitch = THREE.MathUtils.clamp(
      this.targetPitch + deltaY * 0.0025,
      -0.25,
      0.25
    );

    this.previousX = event.clientX;
    this.previousY = event.clientY;
  };

  private readonly finishPointer = (event: PointerEvent): void => {
    if (this.pointerId !== event.pointerId) {
      return;
    }

    if (this.element.hasPointerCapture(event.pointerId)) {
      this.element.releasePointerCapture(event.pointerId);
    }

    this.pointerId = null;
    this.element.style.cursor = "grab";
  };
}
