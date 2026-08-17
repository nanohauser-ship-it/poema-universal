import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

let schemaReady: Promise<void> | null = null;

type CoroBindings = {
  DB: D1Database;
  BUCKET: R2Bucket;
};

export function getRuntimeBindings() {
  const runtime = globalThis as typeof globalThis & { __CORO_RUNTIME_ENV__?: CoroBindings };
  if (!runtime.__CORO_RUNTIME_ENV__?.DB || !runtime.__CORO_RUNTIME_ENV__?.BUCKET) {
    throw new Error("El almacenamiento de la sala todavía no está disponible.");
  }
  return runtime.__CORO_RUNTIME_ENV__;
}

export function getDb() {
  return drizzle(getRuntimeBindings().DB, { schema });
}

export async function ensureVoiceStorage() {
  const database = getRuntimeBindings().DB;
  if (!schemaReady) {
    schemaReady = database.batch([
      database.prepare(`
        CREATE TABLE IF NOT EXISTS voices (
          id text PRIMARY KEY NOT NULL,
          name text NOT NULL,
          place text DEFAULT '' NOT NULL,
          language text DEFAULT '' NOT NULL,
          excerpt text DEFAULT '' NOT NULL,
          file_name text NOT NULL,
          storage_key text NOT NULL UNIQUE,
          mime_type text NOT NULL,
          size integer NOT NULL,
          created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL
        )
      `),
      database.prepare("CREATE INDEX IF NOT EXISTS voices_created_at_idx ON voices (created_at)"),
    ]).then(() => undefined).catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  return schemaReady;
}
