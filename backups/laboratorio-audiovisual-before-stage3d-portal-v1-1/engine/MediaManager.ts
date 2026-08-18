import * as THREE from "three";

import type {
  CanvasMediaDescriptor,
  MediaContent,
  TextureTransformConfiguration,
} from "../types/audiovisual";

export interface ManagedMediaHandle {
  texture: THREE.Texture;
  release: () => void;
}

type SharedVideoSource = {
  video: HTMLVideoElement;
  references: number;
};

type SharedCanvasSource = {
  texture: THREE.CanvasTexture;
  references: number;
};

export class MediaManager {
  private readonly handles = new Set<ManagedMediaHandle>();
  private readonly videos = new Map<string, SharedVideoSource>();
  private readonly canvases = new Map<HTMLCanvasElement, SharedCanvasSource>();
  private disposed = false;

  create(content: MediaContent): ManagedMediaHandle | null {
    if (this.disposed) {
      return null;
    }

    switch (content.kind) {
      case "IMAGE":
        return this.createImageTexture(content.src, content.texture);
      case "VIDEO":
        return this.createVideoTexture(content.src, content.texture);
      case "CANVAS":
        return this.createCanvasTexture(content.canvas, content.texture);
      case "WEBCAM":
        return content.element
          ? this.createExternalVideoTexture(content.element, content.texture)
          : null;
      case "NONE":
      case "COLOR":
        return null;
    }
  }

  update(): void {
    if (this.disposed) {
      return;
    }

    for (const source of this.canvases.values()) {
      source.texture.needsUpdate = true;
    }
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }

    this.disposed = true;

    for (const handle of [...this.handles]) {
      handle.release();
    }

    for (const source of this.videos.values()) {
      this.destroyVideoElement(source.video);
    }

    for (const source of this.canvases.values()) {
      source.texture.dispose();
    }

    this.videos.clear();
    this.canvases.clear();
    this.handles.clear();
  }

  private createImageTexture(
    src: string,
    transform?: TextureTransformConfiguration
  ): ManagedMediaHandle {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    const texture = loader.load(src);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    this.applyTextureTransform(texture, transform);

    return this.track(texture);
  }

  private createVideoTexture(
    src: string,
    transform?: TextureTransformConfiguration
  ): ManagedMediaHandle {
    let source = this.videos.get(src);

    if (!source) {
      const video = document.createElement("video");
      video.src = src;
      video.loop = true;
      video.muted = true;
      video.defaultMuted = true;
      video.autoplay = true;
      video.playsInline = true;
      video.preload = "auto";
      video.crossOrigin = "anonymous";
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      video.load();

      source = { video, references: 0 };
      this.videos.set(src, source);
    }

    source.references += 1;
    void source.video.play().catch(() => undefined);

    const texture = new THREE.VideoTexture(source.video);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    this.applyTextureTransform(texture, transform);

    return this.track(texture, () => {
      const current = this.videos.get(src);

      if (!current) {
        return;
      }

      current.references -= 1;

      if (current.references <= 0) {
        this.destroyVideoElement(current.video);
        this.videos.delete(src);
      }
    });
  }

  private createExternalVideoTexture(
    element: HTMLVideoElement,
    transform?: TextureTransformConfiguration
  ): ManagedMediaHandle {
    const texture = new THREE.VideoTexture(element);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    this.applyTextureTransform(texture, transform);

    return this.track(texture);
  }

  private createCanvasTexture(
    source: HTMLCanvasElement | CanvasMediaDescriptor,
    transform?: TextureTransformConfiguration
  ): ManagedMediaHandle {
    if (source instanceof HTMLCanvasElement && !transform) {
      return this.createSharedCanvasTexture(source);
    }

    const canvas =
      source instanceof HTMLCanvasElement
        ? source
        : this.drawCanvasDescriptor(source);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    this.applyTextureTransform(texture, transform);

    return this.track(texture);
  }

  private createSharedCanvasTexture(
    canvas: HTMLCanvasElement
  ): ManagedMediaHandle {
    let source = this.canvases.get(canvas);

    if (!source) {
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      source = { texture, references: 0 };
      this.canvases.set(canvas, source);
    }

    source.references += 1;

    return this.track(
      source.texture,
      () => {
        const current = this.canvases.get(canvas);

        if (!current) {
          return;
        }

        current.references -= 1;

        if (current.references <= 0) {
          current.texture.dispose();
          this.canvases.delete(canvas);
        }
      },
      false
    );
  }

  private drawCanvasDescriptor(descriptor: CanvasMediaDescriptor): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = descriptor.width ?? 1024;
    canvas.height = descriptor.height ?? 576;

    const context = canvas.getContext("2d");

    if (!context) {
      return canvas;
    }

    const accent = descriptor.accent ?? "#d5ad68";
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (!descriptor.transparent) {
      const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, descriptor.background ?? "#0a0b0d");
      gradient.addColorStop(1, "#020304");
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (descriptor.variant === "human-placeholder") {
      this.drawHumanPlaceholder(context, canvas, descriptor, accent);
      return canvas;
    }

    const inset = Math.min(canvas.width, canvas.height) * 0.065;
    context.strokeStyle = accent;
    context.globalAlpha = 0.7;
    context.lineWidth = 2;
    context.strokeRect(inset, inset, canvas.width - inset * 2, canvas.height - inset * 2);

    context.globalAlpha = 1;
    context.fillStyle = accent;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = `600 ${Math.round(canvas.height * 0.06)}px Arial, sans-serif`;
    context.fillText(descriptor.title.toUpperCase(), canvas.width / 2, canvas.height * 0.47);

    if (descriptor.subtitle) {
      context.fillStyle = "rgba(255,255,255,0.5)";
      context.font = `400 ${Math.round(canvas.height * 0.03)}px Arial, sans-serif`;
      context.fillText(descriptor.subtitle.toUpperCase(), canvas.width / 2, canvas.height * 0.57);
    }

    return canvas;
  }

  private drawHumanPlaceholder(
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    descriptor: CanvasMediaDescriptor,
    accent: string
  ): void {
    const centerX = canvas.width / 2;
    const headY = canvas.height * 0.29;
    const headRadius = canvas.width * 0.105;

    context.strokeStyle = accent;
    context.globalAlpha = 0.56;
    context.lineWidth = Math.max(2, canvas.width * 0.004);
    context.beginPath();
    context.arc(centerX, headY, headRadius, 0, Math.PI * 2);
    context.stroke();

    context.beginPath();
    context.moveTo(centerX - canvas.width * 0.22, canvas.height * 0.75);
    context.quadraticCurveTo(
      centerX - canvas.width * 0.2,
      canvas.height * 0.43,
      centerX,
      canvas.height * 0.41
    );
    context.quadraticCurveTo(
      centerX + canvas.width * 0.2,
      canvas.height * 0.43,
      centerX + canvas.width * 0.22,
      canvas.height * 0.75
    );
    context.stroke();

    context.globalAlpha = 1;
    context.fillStyle = accent;
    context.textAlign = "center";
    context.font = `600 ${Math.round(canvas.width * 0.045)}px Arial, sans-serif`;
    context.fillText(descriptor.title, centerX, canvas.height * 0.84);

    if (descriptor.subtitle) {
      context.fillStyle = "rgba(255,255,255,0.42)";
      context.font = `400 ${Math.round(canvas.width * 0.022)}px Arial, sans-serif`;
      context.fillText(descriptor.subtitle, centerX, canvas.height * 0.88);
    }
  }

  private applyTextureTransform(
    texture: THREE.Texture,
    transform?: TextureTransformConfiguration
  ): void {
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    if (!transform) {
      return;
    }

    if (transform.offset) {
      texture.offset.set(transform.offset[0], transform.offset[1]);
    }

    if (transform.repeat) {
      texture.repeat.set(transform.repeat[0], transform.repeat[1]);
    }

    if (transform.mirrorX) {
      texture.repeat.x *= -1;
      texture.offset.x = 1 - texture.offset.x;
    }

    if (transform.mirrorY) {
      texture.repeat.y *= -1;
      texture.offset.y = 1 - texture.offset.y;
    }

    if (transform.center) {
      texture.center.set(transform.center[0], transform.center[1]);
    }

    if (transform.rotation !== undefined) {
      texture.rotation = transform.rotation;
    }

    if (transform.flipY !== undefined) {
      texture.flipY = transform.flipY;
    }

    texture.needsUpdate = true;
  }

  private track(
    texture: THREE.Texture,
    afterRelease?: () => void,
    disposeTexture = true
  ): ManagedMediaHandle {
    let released = false;

    const handle: ManagedMediaHandle = {
      texture,
      release: () => {
        if (released) {
          return;
        }

        released = true;
        if (disposeTexture) {
          texture.dispose();
        }
        afterRelease?.();
        this.handles.delete(handle);
      },
    };

    this.handles.add(handle);
    return handle;
  }

  private destroyVideoElement(video: HTMLVideoElement): void {
    video.pause();
    video.removeAttribute("src");
    video.load();
    video.remove();
  }
}
