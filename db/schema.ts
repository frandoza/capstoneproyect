import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const flavorCatalog = sqliteTable("flavor_catalog", {
  category: text("category").primaryKey(),
  names: text("names").notNull(),
  revision: text("revision").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const requests = sqliteTable("requests", {
  id: text("id").primaryKey(),
  payload: text("payload").notNull(),
  status: text("status").notNull().default("Nueva"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
export const sessions = sqliteTable("admin_sessions", {
  tokenHash: text("token_hash").primaryKey(),
  expiresAt: integer("expires_at").notNull(),
});
export const rateLimits = sqliteTable("rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull(),
  resetAt: integer("reset_at").notNull(),
});
