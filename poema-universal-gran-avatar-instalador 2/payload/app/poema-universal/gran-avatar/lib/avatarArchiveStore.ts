import type { AvatarPoemRecord } from "../types";

const DATABASE_NAME = "poema-universal-gran-avatar";
const DATABASE_VERSION = 1;
const POEMS_STORE = "poems";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(
        new Error(
          "Este navegador no permite abrir el archivo local.",
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

      if (!database.objectStoreNames.contains(POEMS_STORE)) {
        const store = database.createObjectStore(POEMS_STORE, {
          keyPath: "id",
        });

        store.createIndex("updatedAt", "updatedAt");
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(
        request.error ??
          new Error("No se pudo abrir el archivo local."),
      );
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(POEMS_STORE, mode);
    const store = transaction.objectStore(POEMS_STORE);
    const request = operation(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(
        request.error ??
          new Error("El archivo local no respondió."),
      );

    transaction.oncomplete = () => database.close();
    transaction.onerror = () => {
      database.close();
      reject(
        transaction.error ??
          new Error("No se pudo completar la operación."),
      );
    };
  });
}

export async function listAvatarPoems(): Promise<
  AvatarPoemRecord[]
> {
  const records = await withStore<AvatarPoemRecord[]>(
    "readonly",
    (store) => store.getAll(),
  );

  return records.sort((first, second) =>
    second.updatedAt.localeCompare(first.updatedAt),
  );
}

export async function saveAvatarPoem(
  record: AvatarPoemRecord,
): Promise<void> {
  await withStore<IDBValidKey>("readwrite", (store) =>
    store.put(record),
  );
}

export async function deleteAvatarPoem(
  id: string,
): Promise<void> {
  await withStore<undefined>("readwrite", (store) =>
    store.delete(id),
  );
}
