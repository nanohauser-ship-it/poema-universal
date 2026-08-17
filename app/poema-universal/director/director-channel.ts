export const DIRECTOR_CHANNEL =
  "poema-universal-director-v1";

export type DirectorCommand =
  | {
      type: "PING";
      timestamp: number;
    }
  | {
      type: "SCENE";
      scene: string;
      timestamp: number;
    }
  | {
      type: "BLACKOUT";
      active: boolean;
      timestamp: number;
    }
  | {
      type: "SILENCE";
      timestamp: number;
    }
  | {
      type: "CAMERA";
      active: boolean;
      timestamp: number;
    }
  | {
      type: "VIDEO";
      active: boolean;
      timestamp: number;
    };

export type DirectorResponse =
  | {
      type: "SALA_READY";
      timestamp: number;
    }
  | {
      type: "PONG";
      timestamp: number;
    }
  | {
      type: "ACK";
      command: string;
      timestamp: number;
    };

export function createDirectorChannel() {
  if (
    typeof window === "undefined" ||
    !("BroadcastChannel" in window)
  ) {
    return null;
  }

  return new BroadcastChannel(
    DIRECTOR_CHANNEL,
  );
}
