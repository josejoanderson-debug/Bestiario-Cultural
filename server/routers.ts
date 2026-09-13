import { culturalEntries } from "@shared/culturalData";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createCulturalEntry, getCulturalEntryBySlug, listCulturalEntries, setCulturalEntryPublication, updateCulturalEntry } from "./db";
import { publicProcedure, router } from "./_core/trpc";
import { hasLocalAdminSession, LOCAL_ADMIN_COOKIE, localAdminSessionValue, verifyLocalAdminCredentials } from "./localAdmin";
import { storagePut } from "./storage";
import type { Response } from "express";

function setLocalCookie(res: Response, name: string, value: string) {
  const parts = [`${name}=${encodeURIComponent(value)}`, "Path=/", "HttpOnly", "SameSite=Lax", "Max-Age=43200"];
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  res.setHeader("Set-Cookie", parts.join("; "));
}

function clearLocalCookie(res: Response, name: string) {
  res.setHeader("Set-Cookie", `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

const sourceInput = z.object({
  title: z.string().trim().min(2).max(600),
  institution: z.string().trim().min(2).max(200),
  url: z.string().url().max(2000),
  note: z.string().trim().min(2).max(2000),
});

const photoUrlInput = z.string().trim().max(2000).refine(
  (value) => value === "" || /^https:\/\//.test(value),
  "Informe uma URL HTTPS ou uma imagem enviada pelo painel.",
);

const extraPageImageInput = z.object({
  imageUrl: photoUrlInput.refine((value) => value.length > 0, "Informe uma imagem para a galeria."),
  altText: z.string().trim().min(2).max(500),
  credit: z.string().trim().min(2).max(300),
  sourceUrl: z.string().url().max(2000),
  license: z.string().trim().min(2).max(200),
});

const extraPageInput = z.object({
  eyebrow: z.string().trim().min(2).max(120),
  title: z.string().trim().min(2).max(220),
  content: z.string().trim().min(2).max(12000),
  images: z.array(extraPageImageInput).min(2, "Cada página extra precisa de ao menos duas imagens.").max(3, "Cada página extra aceita no máximo três imagens."),
});

const culturalInput = z.object({
  slug: z.string().trim().max(96).optional(),
  title: z.string().trim().min(2).max(160),
  subtitle: z.string().trim().min(2).max(220),
  category: z.enum(["musica", "danca", "artesanato", "festa"]),
  region: z.string().trim().min(2).max(2000),
  territorialNote: z.string().trim().min(2).max(4000),
  excerpt: z.string().trim().min(2).max(4000),
  story: z.array(z.string().trim().min(2).max(6000)).min(1).max(8),
  visualMotif: z.string().trim().min(2).max(200),
  sources: z.array(sourceInput).min(1).max(12),
  photoUrl: photoUrlInput.optional().default(""),
  photoCredit: z.string().trim().max(300).optional().default(""),
  photoSourceUrl: z.string().trim().max(2000).optional().default(""),
  photoLicense: z.string().trim().max(200).optional().default(""),
  extraPages: z.array(extraPageInput).max(40).optional().default([]),
  isPublished: z.boolean(),
});

const editorProcedure = publicProcedure.use(({ ctx, next }) => {
  const isLocalAdmin = hasLocalAdminSession(ctx.req?.headers?.cookie);
  if (!isLocalAdmin) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Acesso administrativo necessário." });
  }
  return next({ ctx });
});

export const appRouter = router({
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      clearLocalCookie(ctx.res, LOCAL_ADMIN_COOKIE);
      return { success: true } as const;
    }),
  }),
  cultural: router({
    list: publicProcedure.query(() => listCulturalEntries()),
    bySlug: publicProcedure.input(z.object({ slug: z.string().min(1) })).query(({ input }) => getCulturalEntryBySlug(input.slug)),
  }),
  admin: router({
    localLogin: publicProcedure.input(z.object({ username: z.string().min(1), password: z.string().min(1) })).mutation(({ ctx, input }) => {
      if (!verifyLocalAdminCredentials(input.username, input.password)) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Nome ou senha inválidos." });
      }
      setLocalCookie(ctx.res, LOCAL_ADMIN_COOKIE, localAdminSessionValue());
      return { success: true } as const;
    }),
    localLogout: publicProcedure.mutation(({ ctx }) => {
      clearLocalCookie(ctx.res, LOCAL_ADMIN_COOKIE);
      return { success: true } as const;
    }),
    localSession: publicProcedure.query(({ ctx }) => ({
      authenticated: hasLocalAdminSession(ctx.req?.headers?.cookie),
      via: hasLocalAdminSession(ctx.req?.headers?.cookie) ? "local" : null,
    })),
    listCultures: editorProcedure.query(() => listCulturalEntries({ includeUnpublished: true })),
    uploadPhoto: editorProcedure.input(z.object({
      fileName: z.string().trim().min(1).max(160),
      mimeType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
      base64: z.string().min(20).max(7_000_000),
    })).mutation(async ({ input }) => {
      const extension = input.mimeType.split("/")[1] ?? "jpg";
      const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/\.[a-zA-Z0-9]+$/, "").slice(0, 96) || "foto";
      const file = Buffer.from(input.base64, "base64");
      if (!file.length || file.length > 5 * 1024 * 1024) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Envie uma imagem de até 5 MB." });
      }
      return storagePut(`cultural-photos/${Date.now()}-${safeName}.${extension}`, file, input.mimeType);
    }),
    createCulture: editorProcedure.input(culturalInput).mutation(({ input }) => createCulturalEntry(input)),
    updateCulture: editorProcedure.input(z.object({ originalSlug: z.string().min(1), culture: culturalInput })).mutation(({ input }) => updateCulturalEntry(input.originalSlug, input.culture)),
    setPublication: editorProcedure.input(z.object({ slug: z.string().min(1), isPublished: z.boolean() })).mutation(({ input }) => setCulturalEntryPublication(input.slug, input.isPublished)),
  }),
});

export type AppRouter = typeof appRouter;
