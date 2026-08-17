const DATABASE_NAME = "poema-universal-presencias";
const DATABASE_VERSION = 1;
const VIDEO_STORE = "presence-videos";
const VIDEO_CHANGE_EVENT =
  "poema-universal:presence-video-change";

export const MAX_LOCAL_VIDEO_BYTES =
  500 * 1024 * 1024;

export type StoredPresenceVideo = {
  slug: string;
  blob: Blob;
  fileName: string;
  mimeType: string;
  size: number;
  updatedAt: string;
};

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(
        new Error(
          "El navegador no permite almacenamiento audiovisual local.",
        ),
      );
      return;
    }

    const request = indexedDB.open(
      DATABASE_NAME,
      DATABASE_VERSION,
    );

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(VIDEO_STORE)) {
        database.createObjectStore(VIDEO_STORE, {
          keyPath: "slug",
        });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(
        request.error ??
          new Error("No se pudo abrir el archivo audiovisual."),
      );
    request.onblocked = () =>
      reject(
        new Error(
          "El archivo audiovisual está abierto en otra pestaña.",
        ),
      );
  });
}

function notifyPresenceVideoChange(slug: string) {
  window.dispatchEvent(
    new CustomEvent(VIDEO_CHANGE_EVENT, {
      detail: { slug },
    }),
  );
}

export async function getPresenceVideo(
  slug: string,
): Promise<StoredPresenceVideo | null> {
  const database = await openDatabase();

  try {
    return await new Promise((resolve, reject) => {
      const transaction = database.transaction(
        VIDEO_STORE,
        "readonly",
      );
      const request = transaction
        .objectStore(VIDEO_STORE)
        .get(slug);

      request.onsuccess = () =>
        resolve(
          (request.result as StoredPresenceVideo | undefined) ??
            null,
        );
      request.onerror = () =>
        reject(
          request.error ??
            new Error("No se pudo leer la película."),
        );
    });
  } finally {
    database.close();
  }
}

export async function savePresenceVideo(
  slug: string,
  file: File,
) {
  const database = await openDatabase();
  const record: StoredPresenceVideo = {
    slug,
    blob: file.slice(0, file.size, file.type),
    fileName: file.name,
    mimeType: file.type || "video/mp4",
    size: file.size,
    updatedAt: new Date().toISOString(),
  };

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(
        VIDEO_STORE,
        "readwrite",
      );

      transaction.objectStore(VIDEO_STORE).put(record);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () =>
        reject(
          transaction.error ??
            new Error("No se pudo guardar la película."),
        );
      transaction.onabort = () =>
        reject(
          transaction.error ??
            new Error("El guardado de la película se interrumpió."),
        );
    });
  } finally {
    database.close();
  }

  notifyPresenceVideoChange(slug);
}

export async function deletePresenceVideo(slug: string) {
  const database = await openDatabase();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(
        VIDEO_STORE,
        "readwrite",
      );

      transaction.objectStore(VIDEO_STORE).delete(slug);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () =>
        reject(
          transaction.error ??
            new Error("No se pudo retirar la película."),
        );
      transaction.onabort = () =>
        reject(
          transaction.error ??
            new Error("La retirada de la película se interrumpió."),
        );
    });
  } finally {
    database.close();
  }

  notifyPresenceVideoChange(slug);
}

export function subscribeToPresenceVideo(
  slug: string,
  listener: () => void,
) {
  function handleChange(event: Event) {
    const detail = (event as CustomEvent<{ slug?: string }>).detail;

    if (detail?.slug === slug) {
      listener();
    }
  }

  window.addEventListener(VIDEO_CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener(
      VIDEO_CHANGE_EVENT,
      handleChange,
    );
  };
}
