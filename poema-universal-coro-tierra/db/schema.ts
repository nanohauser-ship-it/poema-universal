import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const voices = sqliteTable("voices", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  place: text("place").notNull().default(""),
  language: text("language").notNull().default(""),
  excerpt: text("excerpt").notNull().default(""),
  fileName: text("file_name").notNull(),
  storageKey: text("storage_key").notNull().unique(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
