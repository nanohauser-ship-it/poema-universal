import type {
  AlchemicalPlateType,
  GeneratedAlchemicalPlate,
} from "@/lib/asamblea/atlas-alquimico";

const DATABASE_NAME =
  "poema-universal";

const DATABASE_VERSION = 1;

const STORE_NAME =
  "libro-alquimico";

export const
  ALCHEMICAL_BOOK_UPDATED_EVENT =
    "poema-universal:"
    + "libro-alquimico-updated";

export type StoredAlchemicalPlate = {
  id: string;
  sourceKey: string;
  catalogueNumber: number;

  type: AlchemicalPlateType;
  generatedTitle: string;
  plateTitle: string;
  plateNumber: string;
  caption: string;
  symbol: string;

  secretTitle: string;
  sourcePoem: string;

  image: string;
  mimeType:
    GeneratedAlchemicalPlate[
      "mimeType"
    ];

  createdAt: string;
  updatedAt: string;
};

export type SaveAlchemicalPlateInput = {
  plate: GeneratedAlchemicalPlate;

  plateTitle: string;
  plateNumber:
    | string
    | number;

  symbol: string;
  secretTitle: string;
  sourcePoem: string;
};

function requestResult<T>(
  request: IDBRequest<T>
): Promise<T> {
  return new Promise(
    (resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(
          request.error ??
            new Error(
              "La operación de archivo "
              + "no pudo completarse."
            )
        );
      };
    }
  );
}

function transactionFinished(
  transaction: IDBTransaction
): Promise<void> {
  return new Promise(
    (resolve, reject) => {
      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(
          transaction.error ??
            new Error(
              "La transacción del libro "
              + "no pudo completarse."
            )
        );
      };

      transaction.onabort = () => {
        reject(
          transaction.error ??
            new Error(
              "La transacción del libro "
              + "fue cancelada."
            )
        );
      };
    }
  );
}

function openDatabase():
  Promise<IDBDatabase> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error(
        "El Libro Alquímico "
        + "solo puede abrirse "
        + "en el navegador."
      )
    );
  }

  if (!("indexedDB" in window)) {
    return Promise.reject(
      new Error(
        "Este navegador no permite "
        + "guardar las láminas."
      )
    );
  }

  return new Promise(
    (resolve, reject) => {
      const request =
        window.indexedDB.open(
          DATABASE_NAME,
          DATABASE_VERSION
        );

      request.onupgradeneeded = () => {
        const database =
          request.result;

        let store:
          IDBObjectStore;

        if (
          !database.objectStoreNames
            .contains(STORE_NAME)
        ) {
          store =
            database.createObjectStore(
              STORE_NAME,
              {
                keyPath: "id",
              }
            );
        } else {
          store =
            request.transaction!
              .objectStore(
                STORE_NAME
              );
        }

        if (
          !store.indexNames
            .contains("sourceKey")
        ) {
          store.createIndex(
            "sourceKey",
            "sourceKey",
            {
              unique: true,
            }
          );
        }

        if (
          !store.indexNames
            .contains(
              "catalogueNumber"
            )
        ) {
          store.createIndex(
            "catalogueNumber",
            "catalogueNumber",
            {
              unique: true,
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
              "No se pudo abrir "
              + "el Libro Alquímico."
            )
        );
      };
    }
  );
}

function stableHash(
  value: string
): string {
  let hash = 2166136261;

  for (
    let index = 0;
    index < value.length;
    index += 1
  ) {
    hash ^= value.charCodeAt(index);

    hash = Math.imul(
      hash,
      16777619
    );
  }

  return (
    hash >>> 0
  ).toString(36);
}

function slugify(
  value: string
): string {
  return value
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    )
    .slice(0, 70);
}

export function
buildAlchemicalPlateSourceKey(
  secretTitle: string,
  type: AlchemicalPlateType,
  sourcePoem: string
): string {
  const poemHash =
    stableHash(sourcePoem.trim());

  const titleSlug =
    slugify(secretTitle)
      || "forma-sin-nombre";

  return [
    titleSlug,
    type,
    poemHash,
  ].join(":");
}

function imageDataUrl(
  plate: GeneratedAlchemicalPlate
): string {
  if (
    plate.imageBase64.startsWith(
      "data:"
    )
  ) {
    return plate.imageBase64;
  }

  return (
    `data:${plate.mimeType};`
    + `base64,`
    + plate.imageBase64
  );
}

export async function
listStoredAlchemicalPlates():
  Promise<
    StoredAlchemicalPlate[]
  > {
  const database =
    await openDatabase();

  const transaction =
    database.transaction(
      STORE_NAME,
      "readonly"
    );

  const store =
    transaction.objectStore(
      STORE_NAME
    );

  const plates =
    await requestResult(
      store.getAll()
    ) as StoredAlchemicalPlate[];

  await transactionFinished(
    transaction
  );

  database.close();

  return plates.sort(
    (left, right) =>
      left.catalogueNumber
      - right.catalogueNumber
  );
}

export async function
getStoredAlchemicalPlate(
  sourceKey: string
): Promise<
  StoredAlchemicalPlate
  | undefined
> {
  const database =
    await openDatabase();

  const transaction =
    database.transaction(
      STORE_NAME,
      "readonly"
    );

  const store =
    transaction.objectStore(
      STORE_NAME
    );

  const index =
    store.index("sourceKey");

  const result =
    await requestResult(
      index.get(sourceKey)
    ) as
      | StoredAlchemicalPlate
      | undefined;

  await transactionFinished(
    transaction
  );

  database.close();

  return result;
}

export async function
saveAlchemicalPlate(
  input: SaveAlchemicalPlateInput
): Promise<
  StoredAlchemicalPlate
> {
  const sourceKey =
    buildAlchemicalPlateSourceKey(
      input.secretTitle,
      input.plate.type,
      input.sourcePoem
    );

  const existing =
    await getStoredAlchemicalPlate(
      sourceKey
    );

  const allPlates =
    existing
      ? []
      : await
          listStoredAlchemicalPlates();

  const nextCatalogueNumber =
    existing?.catalogueNumber ??
    (
      allPlates.reduce(
        (maximum, plate) =>
          Math.max(
            maximum,
            plate.catalogueNumber
          ),
        0
      ) + 1
    );

  const now =
    new Date().toISOString();

  const storedPlate:
    StoredAlchemicalPlate = {
      id:
        existing?.id
        ?? sourceKey,

      sourceKey,
      catalogueNumber:
        nextCatalogueNumber,

      type:
        input.plate.type,

      generatedTitle:
        input.plate.title,

      plateTitle:
        input.plateTitle,

      plateNumber:
        String(
          input.plateNumber
        ),

      caption:
        input.plate.caption,

      symbol:
        input.symbol,

      secretTitle:
        input.secretTitle,

      sourcePoem:
        input.sourcePoem,

      image:
        imageDataUrl(
          input.plate
        ),

      mimeType:
        input.plate.mimeType,

      createdAt:
        existing?.createdAt
        ?? now,

      updatedAt: now,
    };

  const database =
    await openDatabase();

  const transaction =
    database.transaction(
      STORE_NAME,
      "readwrite"
    );

  transaction
    .objectStore(STORE_NAME)
    .put(storedPlate);

  await transactionFinished(
    transaction
  );

  database.close();

  if (
    typeof window
    !== "undefined"
  ) {
    window.dispatchEvent(
      new CustomEvent(
        ALCHEMICAL_BOOK_UPDATED_EVENT,
        {
          detail: {
            sourceKey,
          },
        }
      )
    );
  }

  return storedPlate;
}
