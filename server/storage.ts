import { getSupabaseAdmin } from "./supabase";

type StorageResult = { key: string; url: string };

const bucket = () => process.env.SUPABASE_STORAGE_BUCKET || "cultural-images";

export async function storagePut(relKey: string, data: Buffer | Uint8Array | string, contentType = "application/octet-stream"): Promise<StorageResult> {
  const supabase = getSupabaseAdmin();
  const key = relKey.replace(/^\/+/, "");
  const { error } = await supabase.storage.from(bucket()).upload(key, data, {
    contentType,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error(`Falha no upload para o Supabase Storage: ${error.message}`);
  const { data: publicData } = supabase.storage.from(bucket()).getPublicUrl(key);
  return { key, url: publicData.publicUrl };
}

export async function storageGet(relKey: string): Promise<StorageResult> {
  const key = relKey.replace(/^\/+/, "");
  const { data } = getSupabaseAdmin().storage.from(bucket()).getPublicUrl(key);
  return { key, url: data.publicUrl };
}

export async function storageGetSignedUrl(relKey: string): Promise<string> {
  return (await storageGet(relKey)).url;
}
