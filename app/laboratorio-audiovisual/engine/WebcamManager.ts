import type { WebcamStatus } from "../types/audiovisual";

export type WebcamActivationResult = {
  status: WebcamStatus;
  video?: HTMLVideoElement;
};

export class WebcamManager {
  private stream: MediaStream | null = null;
  private video: HTMLVideoElement | null = null;
  private disposed = false;
  private requestVersion = 0;

  async start(): Promise<WebcamActivationResult> {
    if (this.disposed) {
      return { status: "error" };
    }

    if (this.video && this.stream) {
      return { status: "active", video: this.video };
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      return { status: "unsupported" };
    }

    const requestVersion = ++this.requestVersion;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30, max: 60 },
        },
      });

      if (this.disposed || requestVersion !== this.requestVersion) {
        stream.getTracks().forEach((track) => track.stop());
        return { status: "idle" };
      }

      const video = document.createElement("video");
      video.autoplay = true;
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      video.srcObject = stream;

      this.stream = stream;
      this.video = video;

      await video.play();

      return { status: "active", video };
    } catch (error) {
      this.stop();

      if (
        error instanceof DOMException &&
        (error.name === "NotAllowedError" || error.name === "SecurityError")
      ) {
        return { status: "denied" };
      }

      return { status: "error" };
    }
  }

  stop(): void {
    this.requestVersion += 1;
    this.video?.pause();

    if (this.video) {
      this.video.srcObject = null;
      this.video.remove();
    }

    this.stream?.getTracks().forEach((track) => track.stop());
    this.video = null;
    this.stream = null;
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }

    this.disposed = true;
    this.stop();
  }
}
