/**
 * Envio direto do navegador para o Cloudinary usando um "unsigned upload
 * preset". Isso evita passar o arquivo pela função serverless da Vercel, que
 * limita o corpo de cada requisição a 4,5 MB — insuficiente para o antigo
 * fluxo de upload em base64 via tRPC quando a imagem é maior que ~3 MB.
 *
 * Configuração necessária (ver docs/DEPLOY_VERCEL_SUPABASE.md):
 * 1. No painel do Cloudinary: Settings → Upload → Upload presets → Add.
 * 2. Signing mode: "Unsigned". Anote o nome do preset.
 * 3. Defina no projeto (Vercel e `.env` local):
 *    VITE_CLOUDINARY_CLOUD_NAME=<seu cloud name>
 *    VITE_CLOUDINARY_UPLOAD_PRESET=<nome do preset>
 */

export class CloudinaryUploadError extends Error {}

function readConfig() {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

  if (!cloudName || !uploadPreset) {
    throw new CloudinaryUploadError(
      "Envio de imagens não configurado. Defina VITE_CLOUDINARY_CLOUD_NAME e VITE_CLOUDINARY_UPLOAD_PRESET.",
    );
  }

  return { cloudName, uploadPreset };
}

export type CloudinaryUploadResult = { url: string };

export async function uploadImageToCloudinary(file: File): Promise<CloudinaryUploadResult> {
  const { cloudName, uploadPreset } = readConfig();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "cultural-photos");

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new CloudinaryUploadError(detail?.error?.message || "Não foi possível enviar a imagem ao Cloudinary.");
  }

  const result = (await response.json()) as { secure_url?: string };
  if (!result.secure_url) {
    throw new CloudinaryUploadError("O Cloudinary não retornou uma URL segura para a imagem.");
  }

  return { url: result.secure_url };
}
