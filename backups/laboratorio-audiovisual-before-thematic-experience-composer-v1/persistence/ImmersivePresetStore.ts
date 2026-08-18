import type { SurfaceId } from "../types/audiovisual";

const DATABASE_NAME = "poema-universal-sala-madre";
const DATABASE_VERSION = 1;
const STORE_NAME = "immersive-presets";

export interface ImmersiveTextureSettings {
  offsetX: number;
  offsetY: number;
  repeatX: number;
  repeatY: number;
  rotation: number;
  mirrorX: boolean;
  mirrorY: boolean;
}

export interface ImmersivePresetSurface {
  fileName: string | null;
  mimeType: string | null;
  texture: ImmersiveTextureSettings;
  video?: Blob;
}

export interface ImmersivePreset {
  id: string;
  name: string;
  createdAt: number;
  surfaces: Record<SurfaceId, ImmersivePresetSurface>;
}

export type ImmersivePresetSummary = Pick<
  ImmersivePreset,
  "id" | "name" | "createdAt"
>;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("No se pudo abrir el archivo local"));
    request.onblocked = () => reject(new Error("El archivo local está bloqueado por otra pestaña"));
  });
}

function waitForTransaction(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () =>
      reject(transaction.error ?? new Error("No se pudo completar la operación local"));
    transaction.onabort = () =>
      reject(transaction.error ?? new Error("La operación local fue cancelada"));
  });
}

export async function listImmersivePresets(): Promise<ImmersivePresetSummary[]> {
  const database = await openDatabase();

  try {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).getAll();
    const presets = await new Promise<ImmersivePreset[]>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as ImmersivePreset[]);
      request.onerror = () => reject(request.error);
    });

    await waitForTransaction(transaction);

    return presets
      .map(({ id, name, createdAt }) => ({ id, name, createdAt }))
      .sort((a, b) => b.createdAt - a.createdAt);
  } finally {
    database.close();
  }
}

export async function saveImmersivePreset(
  preset: ImmersivePreset
): Promise<void> {
  const database = await openDatabase();

  try {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(preset);
    await waitForTransaction(transaction);
  } finally {
    database.close();
  }
}

export async function loadImmersivePreset(
  id: string
): Promise<ImmersivePreset | null> {
  const database = await openDatabase();

  try {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).get(id);
    const preset = await new Promise<ImmersivePreset | null>((resolve, reject) => {
      request.onsuccess = () =>
        resolve((request.result as ImmersivePreset | undefined) ?? null);
      request.onerror = () => reject(request.error);
    });

    await waitForTransaction(transaction);
    return preset;
  } finally {
    database.close();
  }
}

export async function deleteImmersivePreset(id: string): Promise<void> {
  const database = await openDatabase();

  try {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).delete(id);
    await waitForTransaction(transaction);
  } finally {
    database.close();
  }
}
