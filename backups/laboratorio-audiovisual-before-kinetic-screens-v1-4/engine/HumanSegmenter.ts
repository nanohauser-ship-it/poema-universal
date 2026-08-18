import {
  FilesetResolver,
  ImageSegmenter,
  type ImageSegmenterResult,
} from "@mediapipe/tasks-vision";

const MEDIAPIPE_VERSION = "1.0.1";
const WASM_ROOT = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`;
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite";
const INFERENCE_INTERVAL_MS = 1000 / 12;

const BENIGN_MEDIAPIPE_ERROR_MESSAGES = [
  "Created TensorFlow Lite XNNPACK delegate for CPU",
  "Feedback manager requires a model with a single signature inference",
] as const;

type ConsoleMethod = (...data: unknown[]) => void;

function isBenignMediaPipeMessage(data: unknown[]): boolean {
  const message = data
    .map((value) =>
      typeof value === "string"
        ? value
        : value instanceof Error
          ? value.message
          : String(value)
    )
    .join(" ");

  return BENIGN_MEDIAPIPE_ERROR_MESSAGES.some((knownMessage) =>
    message.includes(knownMessage)
  );
}

function installMediaPipeConsoleGuard(): () => void {
  const originalError: ConsoleMethod = console.error;
  const guardedError: ConsoleMethod = (...data) => {
    if (isBenignMediaPipeMessage(data)) {
      return;
    }

    originalError.apply(console, data);
  };

  console.error = guardedError;

  return () => {
    if (console.error === guardedError) {
      console.error = originalError;
    }
  };
}

export type PersonConfidenceMask = {
  data: Float32Array;
  width: number;
  height: number;
};

export class HumanSegmenter {
  private segmenter: ImageSegmenter | null = null;
  private initialization: Promise<boolean> | null = null;
  private mask: PersonConfidenceMask | null = null;
  private lastInferenceTime = -Infinity;
  private disposed = false;

  initialize(): Promise<boolean> {
    if (this.disposed) {
      return Promise.resolve(false);
    }

    if (this.segmenter) {
      return Promise.resolve(true);
    }

    if (this.initialization) {
      return this.initialization;
    }

    this.initialization = this.createSegmenter();
    return this.initialization;
  }

  process(source: HTMLCanvasElement, timestamp: number): boolean {
    if (
      this.disposed ||
      !this.segmenter ||
      timestamp - this.lastInferenceTime < INFERENCE_INTERVAL_MS
    ) {
      return false;
    }

    this.lastInferenceTime = timestamp;

    const restoreConsole = installMediaPipeConsoleGuard();

    try {
      this.segmenter.segmentForVideo(source, timestamp, (result) => {
        try {
          this.copyPersonMask(result);
        } finally {
          result.close();
        }
      });
      return true;
    } catch {
      return false;
    } finally {
      restoreConsole();
    }
  }

  getMask(): PersonConfidenceMask | null {
    return this.mask;
  }

  reset(): void {
    this.mask = null;
    this.lastInferenceTime = -Infinity;
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }

    this.disposed = true;
    this.mask = null;
    this.segmenter?.close();
    this.segmenter = null;
  }

  private async createSegmenter(): Promise<boolean> {
    const restoreConsole = installMediaPipeConsoleGuard();

    try {
      const vision = await FilesetResolver.forVisionTasks(WASM_ROOT);
      const segmenter = await ImageSegmenter.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: MODEL_URL,
        },
        runningMode: "VIDEO",
        outputCategoryMask: false,
        outputConfidenceMasks: true,
      });

      if (this.disposed) {
        segmenter.close();
        return false;
      }

      this.segmenter = segmenter;
      return true;
    } catch {
      return false;
    } finally {
      restoreConsole();
      this.initialization = null;
    }
  }

  private copyPersonMask(result: ImageSegmenterResult): void {
    const confidenceMasks = result.confidenceMasks;
    const personMask = confidenceMasks?.[1] ?? confidenceMasks?.[0];

    if (!personMask) {
      return;
    }

    const confidence = personMask.getAsFloat32Array();
    const requiredLength = personMask.width * personMask.height;

    if (
      !this.mask ||
      this.mask.width !== personMask.width ||
      this.mask.height !== personMask.height
    ) {
      this.mask = {
        data: new Float32Array(requiredLength),
        width: personMask.width,
        height: personMask.height,
      };
    }

    this.mask.data.set(confidence);
  }
}
