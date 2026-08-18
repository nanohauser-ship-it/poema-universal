import { HumanSegmenter } from "./HumanSegmenter";
import type { HumanLookConfiguration } from "../types/audiovisual";

const COMPOSITOR_WIDTH = 384;
const COMPOSITOR_HEIGHT = 580;
const FRAME_INTERVAL = 1 / 24;
const HORIZONTAL_EDGE_FEATHER = 0.055;
const TOP_EDGE_FEATHER = 0.04;
const BOTTOM_EDGE_FEATHER = 0.12;

const DEFAULT_HUMAN_LOOK: HumanLookConfiguration = {
  brightness: 1,
  contrast: 1,
  saturation: 1,
  warmth: 0,
  vignette: 0,
  rimColor: "#d4ad6d",
  rimIntensity: 0,
  rimBlur: 8,
};

function smoothStep(value: number): number {
  const clamped = Math.min(1, Math.max(0, value));
  return clamped * clamped * (3 - 2 * clamped);
}

export class HumanCompositor {
  readonly canvas: HTMLCanvasElement;

  private readonly sourceCanvas: HTMLCanvasElement;
  private readonly maskCanvas: HTMLCanvasElement;
  private readonly rimCanvas: HTMLCanvasElement;
  private readonly outputContext: CanvasRenderingContext2D | null;
  private readonly sourceContext: CanvasRenderingContext2D | null;
  private readonly maskContext: CanvasRenderingContext2D | null;
  private readonly rimContext: CanvasRenderingContext2D | null;
  private readonly segmenter = new HumanSegmenter();

  private maskImage: ImageData | null = null;
  private temporalAlpha = new Uint8ClampedArray(0);
  private video: HTMLVideoElement | null = null;
  private frameAccumulator = 0;
  private semanticCutoutEnabled = false;
  private humanLook: HumanLookConfiguration = { ...DEFAULT_HUMAN_LOOK };
  private colorFilter = "none";
  private rimFilter = "blur(8px)";
  private vignetteGradient: CanvasGradient | null = null;
  private disposed = false;

  constructor() {
    this.canvas = this.createCanvas(COMPOSITOR_WIDTH, COMPOSITOR_HEIGHT);
    this.sourceCanvas = this.createCanvas(COMPOSITOR_WIDTH, COMPOSITOR_HEIGHT);
    this.maskCanvas = this.createCanvas(1, 1);
    this.rimCanvas = this.createCanvas(COMPOSITOR_WIDTH, COMPOSITOR_HEIGHT);

    this.outputContext = this.canvas.getContext("2d");
    this.sourceContext = this.sourceCanvas.getContext("2d");
    this.maskContext = this.maskCanvas.getContext("2d");
    this.rimContext = this.rimCanvas.getContext("2d");
    this.updateLookResources();
  }

  connect(video: HTMLVideoElement): HTMLCanvasElement {
    if (this.disposed) {
      return this.canvas;
    }

    this.video = video;
    this.frameAccumulator = FRAME_INTERVAL;
    this.semanticCutoutEnabled = false;
    this.segmenter.reset();
    this.renderFrame();
    return this.canvas;
  }

  disconnect(): void {
    this.video = null;
    this.frameAccumulator = 0;
    this.semanticCutoutEnabled = false;
    this.segmenter.reset();
    this.temporalAlpha.fill(0);
    this.clearCanvases();
  }

  async enableSemanticCutout(): Promise<boolean> {
    if (this.disposed || !this.video) {
      return false;
    }

    const ready = await this.segmenter.initialize();

    if (!ready || this.disposed || !this.video) {
      return false;
    }

    this.semanticCutoutEnabled = true;
    this.segmenter.reset();
    this.temporalAlpha.fill(0);
    return true;
  }

  disableCutout(): void {
    this.semanticCutoutEnabled = false;
    this.segmenter.reset();
    this.temporalAlpha.fill(0);
    this.renderFrame();
  }

  setLook(configuration: Partial<HumanLookConfiguration>): void {
    this.humanLook = {
      ...DEFAULT_HUMAN_LOOK,
      ...configuration,
    };
    this.updateLookResources();
  }

  update(deltaTime: number): boolean {
    if (this.disposed || !this.video) {
      return false;
    }

    this.frameAccumulator += deltaTime;

    if (this.frameAccumulator < FRAME_INTERVAL) {
      return false;
    }

    this.frameAccumulator %= FRAME_INTERVAL;
    return this.renderFrame();
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }

    this.disposed = true;
    this.disconnect();
    this.segmenter.dispose();
  }

  private renderFrame(): boolean {
    if (!this.drawSourceFrame()) {
      return false;
    }

    if (!this.semanticCutoutEnabled) {
      this.renderRawFrame();
      return true;
    }

    this.segmenter.process(this.sourceCanvas, performance.now());
    const mask = this.segmenter.getMask();

    if (!mask) {
      this.renderRawFrame();
      return true;
    }

    this.renderSemanticFrame(mask.data, mask.width, mask.height);
    return true;
  }

  private drawSourceFrame(): boolean {
    const video = this.video;
    const context = this.sourceContext;

    if (
      !video ||
      !context ||
      video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
      video.videoWidth <= 0 ||
      video.videoHeight <= 0
    ) {
      return false;
    }

    const targetAspect = COMPOSITOR_WIDTH / COMPOSITOR_HEIGHT;
    const sourceAspect = video.videoWidth / video.videoHeight;
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = video.videoWidth;
    let sourceHeight = video.videoHeight;

    if (sourceAspect > targetAspect) {
      sourceWidth = video.videoHeight * targetAspect;
      sourceX = (video.videoWidth - sourceWidth) / 2;
    } else {
      sourceHeight = video.videoWidth / targetAspect;
      sourceY = (video.videoHeight - sourceHeight) / 2;
    }

    context.save();
    context.clearRect(0, 0, COMPOSITOR_WIDTH, COMPOSITOR_HEIGHT);
    context.setTransform(-1, 0, 0, 1, COMPOSITOR_WIDTH, 0);
    context.drawImage(
      video,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      COMPOSITOR_WIDTH,
      COMPOSITOR_HEIGHT
    );
    context.restore();
    return true;
  }

  private renderRawFrame(): void {
    const context = this.outputContext;

    if (!context) {
      return;
    }

    context.clearRect(0, 0, COMPOSITOR_WIDTH, COMPOSITOR_HEIGHT);
    this.drawGradedSource(context);
    this.applyVignette(context);
  }

  private renderSemanticFrame(
    confidence: Float32Array,
    width: number,
    height: number
  ): void {
    const maskContext = this.maskContext;
    const outputContext = this.outputContext;

    if (!maskContext || !outputContext) {
      this.renderRawFrame();
      return;
    }

    this.prepareMaskBuffers(width, height);

    if (!this.maskImage || this.temporalAlpha.length !== confidence.length) {
      this.renderRawFrame();
      return;
    }

    const pixels = this.maskImage.data;

    for (let index = 0; index < confidence.length; index += 1) {
      const normalized = Math.min(
        1,
        Math.max(0, (confidence[index] - 0.14) / 0.66)
      );
      const eased = smoothStep(normalized);
      const x = index % width;
      const y = Math.floor(index / width);
      const horizontalDistance = Math.min(x, width - 1 - x);
      const topDistance = y;
      const bottomDistance = height - 1 - y;
      const horizontalFade = smoothStep(
        horizontalDistance / Math.max(width * HORIZONTAL_EDGE_FEATHER, 1)
      );
      const topFade = smoothStep(
        topDistance / Math.max(height * TOP_EDGE_FEATHER, 1)
      );
      const bottomFade = smoothStep(
        bottomDistance / Math.max(height * BOTTOM_EDGE_FEATHER, 1)
      );
      const frameFade = Math.min(horizontalFade, topFade, bottomFade);
      const measuredAlpha = Math.round(eased * frameFade * 255);
      const previousAlpha = this.temporalAlpha[index];
      const response = measuredAlpha >= previousAlpha ? 0.68 : 0.38;
      const alpha = Math.round(
        previousAlpha * (1 - response) + measuredAlpha * response
      );
      const pixelIndex = index * 4;

      this.temporalAlpha[index] = alpha;
      pixels[pixelIndex] = 255;
      pixels[pixelIndex + 1] = 255;
      pixels[pixelIndex + 2] = 255;
      pixels[pixelIndex + 3] = alpha;
    }

    maskContext.putImageData(this.maskImage, 0, 0);
    outputContext.save();
    outputContext.clearRect(0, 0, COMPOSITOR_WIDTH, COMPOSITOR_HEIGHT);
    this.drawGradedSource(outputContext);
    outputContext.globalCompositeOperation = "destination-in";
    outputContext.imageSmoothingEnabled = true;
    outputContext.imageSmoothingQuality = "high";
    outputContext.filter = "blur(1.15px)";
    outputContext.drawImage(
      this.maskCanvas,
      0,
      0,
      width,
      height,
      0,
      0,
      COMPOSITOR_WIDTH,
      COMPOSITOR_HEIGHT
    );
    outputContext.restore();
    this.renderRim(width, height);
    this.applyVignette(outputContext);
  }

  private drawGradedSource(context: CanvasRenderingContext2D): void {
    context.save();
    context.filter = this.colorFilter;
    context.drawImage(this.sourceCanvas, 0, 0);
    context.restore();
  }

  private renderRim(maskWidth: number, maskHeight: number): void {
    const outputContext = this.outputContext;
    const rimContext = this.rimContext;
    const { rimColor, rimIntensity } = this.humanLook;

    if (!outputContext || !rimContext || rimIntensity <= 0) {
      return;
    }

    rimContext.save();
    rimContext.clearRect(0, 0, COMPOSITOR_WIDTH, COMPOSITOR_HEIGHT);
    rimContext.imageSmoothingEnabled = true;
    rimContext.imageSmoothingQuality = "high";
    rimContext.filter = this.rimFilter;
    rimContext.drawImage(
      this.maskCanvas,
      0,
      0,
      maskWidth,
      maskHeight,
      0,
      0,
      COMPOSITOR_WIDTH,
      COMPOSITOR_HEIGHT
    );
    rimContext.restore();

    rimContext.save();
    rimContext.globalCompositeOperation = "source-in";
    rimContext.fillStyle = rimColor;
    rimContext.fillRect(0, 0, COMPOSITOR_WIDTH, COMPOSITOR_HEIGHT);
    rimContext.restore();

    outputContext.save();
    outputContext.globalCompositeOperation = "destination-over";
    outputContext.globalAlpha = Math.min(1, Math.max(0, rimIntensity));
    outputContext.drawImage(this.rimCanvas, 0, 0);
    outputContext.restore();
  }

  private applyVignette(context: CanvasRenderingContext2D): void {
    if (!this.vignetteGradient || this.humanLook.vignette <= 0) {
      return;
    }

    context.save();
    context.globalCompositeOperation = "source-atop";
    context.fillStyle = this.vignetteGradient;
    context.fillRect(0, 0, COMPOSITOR_WIDTH, COMPOSITOR_HEIGHT);
    context.restore();
  }

  private updateLookResources(): void {
    const brightness = Math.max(0, this.humanLook.brightness) * 100;
    const contrast = Math.max(0, this.humanLook.contrast) * 100;
    const saturation = Math.max(0, this.humanLook.saturation) * 100;
    const warmth = Math.min(1, Math.max(0, this.humanLook.warmth));

    this.colorFilter = [
      `brightness(${brightness}%)`,
      `contrast(${contrast}%)`,
      `saturate(${saturation}%)`,
      `sepia(${warmth * 100}%)`,
      `hue-rotate(${-warmth * 10}deg)`,
    ].join(" ");
    this.rimFilter = `blur(${Math.max(0, this.humanLook.rimBlur)}px)`;

    const context = this.outputContext;

    if (!context) {
      this.vignetteGradient = null;
      return;
    }

    const gradient = context.createRadialGradient(
      COMPOSITOR_WIDTH * 0.5,
      COMPOSITOR_HEIGHT * 0.42,
      COMPOSITOR_WIDTH * 0.16,
      COMPOSITOR_WIDTH * 0.5,
      COMPOSITOR_HEIGHT * 0.44,
      COMPOSITOR_HEIGHT * 0.62
    );
    const vignette = Math.min(1, Math.max(0, this.humanLook.vignette));
    gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
    gradient.addColorStop(0.58, "rgba(0, 0, 0, 0)");
    gradient.addColorStop(1, `rgba(0, 0, 0, ${vignette})`);
    this.vignetteGradient = gradient;
  }

  private prepareMaskBuffers(width: number, height: number): void {
    if (
      this.maskCanvas.width === width &&
      this.maskCanvas.height === height &&
      this.maskImage
    ) {
      return;
    }

    this.maskCanvas.width = width;
    this.maskCanvas.height = height;
    this.maskImage = this.maskContext?.createImageData(width, height) ?? null;
    this.temporalAlpha = new Uint8ClampedArray(width * height);
  }

  private clearCanvases(): void {
    this.outputContext?.clearRect(0, 0, COMPOSITOR_WIDTH, COMPOSITOR_HEIGHT);
    this.sourceContext?.clearRect(0, 0, COMPOSITOR_WIDTH, COMPOSITOR_HEIGHT);
    this.maskContext?.clearRect(
      0,
      0,
      this.maskCanvas.width,
      this.maskCanvas.height
    );
    this.rimContext?.clearRect(0, 0, COMPOSITOR_WIDTH, COMPOSITOR_HEIGHT);
  }

  private createCanvas(width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
}
