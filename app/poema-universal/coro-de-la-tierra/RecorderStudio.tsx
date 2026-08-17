"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type RecorderStudioProps = {
  open: boolean;
  onClose: () => void;
  onUploaded: () => Promise<void>;
};


const RECORDER_DB_NAME = "poema-universal-coro";
const RECORDER_STORE_NAME = "voices";
const RECORDER_DB_VERSION = 1;

function openRecorderDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(
      RECORDER_DB_NAME,
      RECORDER_DB_VERSION
    );

    request.onupgradeneeded = () => {
      const database = request.result;

      if (
        !database.objectStoreNames.contains(
          RECORDER_STORE_NAME
        )
      ) {
        database.createObjectStore(
          RECORDER_STORE_NAME,
          {
            keyPath: "id",
          }
        );
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(
        request.error ??
          new Error(
            "No se pudo abrir el archivo sonoro."
          )
      );
    };
  });
}

function saveRecordedVoice(
  voice: Record<string, unknown>
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    let database: IDBDatabase;

    try {
      database = await openRecorderDatabase();
    } catch (error) {
      reject(error);
      return;
    }

    try {
      const transaction = database.transaction(
        RECORDER_STORE_NAME,
        "readwrite"
      );

      const store = transaction.objectStore(
        RECORDER_STORE_NAME
      );

      store.put(voice);

      transaction.oncomplete = () => {
        database.close();
        resolve();
      };

      transaction.onerror = () => {
        const error =
          transaction.error ??
          new Error(
            "No se pudo guardar la grabación."
          );

        database.close();
        reject(error);
      };

      transaction.onabort = () => {
        const error =
          transaction.error ??
          new Error(
            "La grabación no pudo incorporarse."
          );

        database.close();
        reject(error);
      };
    } catch (error) {
      database.close();
      reject(error);
    }
  });
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);

  return `${minutes}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")}`;
}

export default function RecorderStudio({
  open,
  onClose,
  onUploaded,
}: RecorderStudioProps) {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState("");

  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const [blob, setBlob] = useState<Blob | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [language, setLanguage] = useState("");
  const [excerpt, setExcerpt] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stopTracks = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const stopTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const readDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;

    const list = await navigator.mediaDevices.enumerateDevices();

    const inputs = list.filter(
      (device) => device.kind === "audioinput"
    );

    setDevices(inputs);

    setDeviceId((current) => {
      if (
        current &&
        inputs.some((device) => device.deviceId === current)
      ) {
        return current;
      }

      return inputs[0]?.deviceId ?? "";
    });
  }, []);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const initialise = async () => {
      try {
        setError(null);

        const permission =
          await navigator.mediaDevices.getUserMedia({
            audio: true,
          });

        permission
          .getTracks()
          .forEach((track) => track.stop());

        if (!cancelled) {
          await readDevices();
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo acceder a la entrada de audio."
          );
        }
      }
    };

    void initialise();

    const deviceChange = () => {
      void readDevices();
    };

    navigator.mediaDevices?.addEventListener(
      "devicechange",
      deviceChange
    );

    return () => {
      cancelled = true;

      navigator.mediaDevices?.removeEventListener(
        "devicechange",
        deviceChange
      );

      stopTimer();
      stopTracks();
    };
  }, [open, readDevices]);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const start = async () => {
    try {
      setError(null);

      if (preview) {
        URL.revokeObjectURL(preview);
      }

      setPreview(null);
      setBlob(null);
      setSeconds(0);

      chunksRef.current = [];

      const audio:
        | boolean
        | MediaTrackConstraints = deviceId
        ? {
            deviceId: {
              exact: deviceId,
            },
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          }
        : true;

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio,
        });

      streamRef.current = stream;

      const preferred = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
      ].find((type) =>
        MediaRecorder.isTypeSupported(type)
      );

      const recorder = preferred
        ? new MediaRecorder(stream, {
            mimeType: preferred,
          })
        : new MediaRecorder(stream);

      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        stopTimer();
        stopTracks();

        const result = new Blob(
          chunksRef.current,
          {
            type:
              recorder.mimeType ||
              "audio/webm",
          }
        );

        const url =
          URL.createObjectURL(result);

        setBlob(result);
        setPreview(url);
        setRecording(false);
      };

      recorder.start(250);

      setRecording(true);

      timerRef.current =
        window.setInterval(() => {
          setSeconds((value) => value + 1);
        }, 1000);
    } catch (err) {
      stopTracks();

      setError(
        err instanceof Error
          ? err.message
          : "No se pudo iniciar la grabación."
      );
    }
  };

  const stop = () => {
    if (
      recorderRef.current?.state ===
      "recording"
    ) {
      recorderRef.current.stop();
    }
  };

  const discard = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(null);
    setBlob(null);
    setSeconds(0);
  };

  const save = async () => {
    if (!blob) return;

    try {
      setSaving(true);
      setError(null);

      /*
        El Coro guarda las voces en IndexedDB.
        La grabadora usa exactamente el mismo almacén.
      */

      const rawMime =
        blob.type || "audio/webm";

      const mimeType =
        rawMime.split(";")[0] ||
        "audio/webm";

      const extension =
        mimeType.includes("mp4")
          ? "m4a"
          : mimeType.includes("ogg")
            ? "ogg"
            : mimeType.includes("wav")
              ? "wav"
              : mimeType.includes("mpeg")
                ? "mp3"
                : "webm";

      const id =
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `voice-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2)}`;

      const createdAt =
        new Date().toISOString();

      const fileName =
        `voz-${Date.now()}.${extension}`;

      /*
        Creamos un Blob limpio con el MIME que utiliza
        el resto del Coro.
      */

      const storedAudio = blob.slice(
        0,
        blob.size,
        mimeType
      );

      await saveRecordedVoice({
        id,

        name:
          name.trim() ||
          "Nueva grabación",

        place:
          place.trim(),

        language:
          language.trim(),

        excerpt:
          excerpt.trim(),

        translation: "",

        fileName,

        mimeType,

        size:
          storedAudio.size,

        createdAt,

        audio:
          storedAudio,
      });

      /*
        CoroExperience vuelve a leer IndexedDB.
        La nueva voz entra ahora en voices[]
        y por tanto también en el planeta.
      */

      await onUploaded();

      discard();

      setName("");
      setPlace("");
      setLanguage("");
      setExcerpt("");

      onClose();

    } catch (err) {

      console.error(
        "Error guardando grabación en IndexedDB:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "No se pudo incorporar la voz al planeta."
      );

    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="recorder-backdrop">
      <section
        className="recorder-studio"
        role="dialog"
        aria-modal="true"
      >
        <header className="recorder-header">
          <div>
            <p>ESTACIÓN DE CAPTURA</p>

            <h2>Grabar una voz</h2>

            <span>
              La voz se convertirá en una nueva luz de la Tierra.
            </span>
          </div>

          <button
            type="button"
            className="recorder-close"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <div className="recorder-device">
          <label htmlFor="coro-audio-device">
            ENTRADA DE AUDIO
          </label>

          <select
            id="coro-audio-device"
            value={deviceId}
            disabled={recording}
            onChange={(event) =>
              setDeviceId(event.target.value)
            }
          >
            {!devices.length && (
              <option value="">
                Micrófono predeterminado
              </option>
            )}

            {devices.map((device, index) => (
              <option
                key={device.deviceId}
                value={device.deviceId}
              >
                {device.label ||
                  `Entrada ${index + 1}`}
              </option>
            ))}
          </select>
        </div>

        <div
          className={`recorder-orb ${
            recording ? "is-recording" : ""
          }`}
        >
          <i />
          <i />
          <i />

          <div className="recorder-core">
            <span />
          </div>
        </div>

        <div className="recorder-time">
          {formatTime(seconds)}
        </div>

        {!recording && !blob && (
          <button
            type="button"
            className="recorder-main"
            onClick={() => void start()}
          >
            ● INICIAR GRABACIÓN
          </button>
        )}

        {recording && (
          <button
            type="button"
            className="recorder-main is-stop"
            onClick={stop}
          >
            ■ DETENER GRABACIÓN
          </button>
        )}

        {blob && preview && (
          <div className="recorder-preview">
            <p>GRABACIÓN CAPTURADA</p>

            <audio
              controls
              src={preview}
            />

            <button
              type="button"
              onClick={discard}
            >
              REPETIR GRABACIÓN
            </button>
          </div>
        )}

        <div className="recorder-fields">
          <label>
            NOMBRE
            <input
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Nombre"
            />
          </label>

          <label>
            LUGAR
            <input
              value={place}
              onChange={(event) =>
                setPlace(event.target.value)
              }
              placeholder="Santiago · Galicia"
            />
          </label>

          <label>
            IDIOMA
            <input
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value)
              }
              placeholder="Galego"
            />
          </label>

          <label className="recorder-wide">
            VERSO / MENSAJE
            <textarea
              rows={2}
              value={excerpt}
              onChange={(event) =>
                setExcerpt(event.target.value)
              }
              placeholder="La frase que acompañará esta voz…"
            />
          </label>
        </div>

        {error && (
          <p className="recorder-error">
            {error}
          </p>
        )}

        <footer className="recorder-footer">
          <span>
            MICRÓFONO · USB · INTERFAZ EXTERNA
          </span>

          <button
            type="button"
            className="recorder-save"
            disabled={!blob || saving}
            onClick={() => void save()}
          >
            {saving
              ? "INCORPORANDO…"
              : "INCORPORAR AL PLANETA"}
          </button>
        </footer>
      </section>
    </div>
  );
}
