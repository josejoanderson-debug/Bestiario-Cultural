import { boolean, index, integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const culturalCategoryEnum = pgEnum("cultural_category", ["musica", "danca", "artesanato", "festa"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const culturalChapters = pgTable("culturalChapters", {
  id: serial("id").primaryKey(),
  chapterNumber: integer("chapterNumber").notNull().unique(),
  slug: varchar("slug", { length: 96 }).notNull().unique(),
  title: varchar("title", { length: 160 }).notNull(),
  subtitle: varchar("subtitle", { length: 220 }).notNull().default(""),
  category: culturalCategoryEnum("category").notNull(),
  territory: text("territory").notNull(),
  territorialNote: text("territorialNote").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  illustrationLabel: varchar("illustrationLabel", { length: 200 }).notNull(),
  photoUrl: varchar("photoUrl", { length: 2048 }).notNull().default(""),
  photoCredit: varchar("photoCredit", { length: 300 }).notNull().default(""),
  photoSourceUrl: varchar("photoSourceUrl", { length: 2048 }).notNull().default(""),
  photoLicense: varchar("photoLicense", { length: 200 }).notNull().default(""),
  isPublished: boolean("isPublished").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const culturalSources = pgTable("culturalSources", {
  id: serial("id").primaryKey(),
  chapterSlug: varchar("chapterSlug", { length: 96 }).notNull(),
  title: text("title").notNull(),
  institution: varchar("institution", { length: 200 }).notNull(),
  sourceUrl: text("sourceUrl").notNull(),
  note: text("note").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("culturalSources_chapterSlug_idx").on(table.chapterSlug)]);

// Páginas extras de aprofundamento por cultura (até 40 por capítulo — limite
// aplicado em server/routers.ts, na validação de entrada `culturalInput`).
export const culturalExtraPages = pgTable("culturalExtraPages", {
  id: serial("id").primaryKey(),
  chapterSlug: varchar("chapterSlug", { length: 96 }).notNull(),
  sortOrder: integer("sortOrder").notNull(),
  eyebrow: varchar("eyebrow", { length: 120 }).notNull().default("Aprofundamento"),
  title: varchar("title", { length: 220 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => [index("culturalExtraPages_chapterSlug_idx").on(table.chapterSlug)]);

export const culturalExtraPageImages = pgTable("culturalExtraPageImages", {
  id: serial("id").primaryKey(),
  pageId: integer("pageId").notNull(),
  sortOrder: integer("sortOrder").notNull(),
  imageUrl: varchar("imageUrl", { length: 2048 }).notNull(),
  altText: varchar("altText", { length: 500 }).notNull().default(""),
  credit: varchar("credit", { length: 300 }).notNull(),
  sourceUrl: varchar("sourceUrl", { length: 2048 }).notNull(),
  license: varchar("license", { length: 200 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("culturalExtraPageImages_pageId_idx").on(table.pageId)]);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type CulturalChapter = typeof culturalChapters.$inferSelect;
export type CulturalSourceRecord = typeof culturalSources.$inferSelect;
export type CulturalExtraPageRecord = typeof culturalExtraPages.$inferSelect;
export type CulturalExtraPageImageRecord = typeof culturalExtraPageImages.$inferSelect;
