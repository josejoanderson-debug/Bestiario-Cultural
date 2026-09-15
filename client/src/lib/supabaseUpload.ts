import { getSupabaseClient, SupabaseConfigError } from "./supabaseClient";

/**
 * Envio direto do navegador para o Supabase Storage — evita passar o arquivo
 * pela função serverless da Vercel, que limita o corpo de cada requisição a
 * 4,5 MB.
 *
 * Configuração necessária (ver docs/DEPLOY_VERCEL_SUPABASE.md):
 * 1. No painel do Supabase: Storage → New bucket → nome "cultural-photos",
 *    marcado como "Public bucket".
 * 2. SQL Editor → rode as políticas de acesso (leitura e envio públicos)
 *    descritas no guia de deploy.
 * 3. Defina no projeto (Vercel e `.env` local):
 *    VITE_SUPABASE_URL=<Project URL, em Settings → API>
 *    VITE_SUPABASE_ANON_KEY=<anon public key, em Settings → API>
 */

export class SupabaseUploadError extends Error {}

const BUCKET = "cultural-photos";

function extensionFor(file: File) {
  const fromName = file.name.split(".").pop();
  if (fromName && /^[a-zA-Z0-9]+$/.test(fromName)) return fromName.toLowerCase();
  const fromType = file.type.split("/")[1];
  return fromType || "jpg";
}

export type SupabaseUploadResult = { url: string };

export async function uploadImageToSupabase(file: File): Promise<SupabaseUploadResult> {
  let client;
  try {
    client = getSupabaseClient();
  } catch (error) {
    throw new SupabaseUploadError(error instanceof SupabaseConfigError ? error.message : "Envio de imagens não configurado.");
  }

  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extensionFor(file)}`;

  const { error } = await client.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    throw new SupabaseUploadError(error.message || "Não foi possível enviar a imagem ao Supabase.");
  }

  const { data } = client.storage.from(BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) {
    throw new SupabaseUploadError("O Supabase não retornou uma URL pública para a imagem.");
  }

  return { url: data.publicUrl };
}
