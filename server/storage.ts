import { v2 as cloudinary } from "cloudinary";

type StorageResult = { key: string; url: string };

function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Armazenamento não configurado. Defina CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET.");
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
  return cloudinary;
}

function normalizeKey(value: string) {
  return value.replace(/^\/+/, "").replace(/\.[a-zA-Z0-9]+$/, "");
}

function toBuffer(data: Buffer | Uint8Array | string) {
  if (typeof data === "string") return Buffer.from(data);
  return Buffer.from(data);
}

async function uploadBuffer(client: typeof cloudinary, buffer: Buffer, publicId: string, contentType: string): Promise<StorageResult> {
  return new Promise((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      {
        public_id: publicId,
        resource_type: "image",
        overwrite: false,
        unique_filename: true,
        use_filename: false,
        format: contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : contentType === "image/gif" ? "gif" : "jpg",
      },
      (error, result) => {
        if (error || !result?.secure_url || !result.public_id) {
          reject(error ?? new Error("O provedor de imagens não retornou uma URL segura."));
          return;
        }
        resolve({ key: result.public_id, url: result.secure_url });
      },
    );
    stream.end(buffer);
  });
}

/** Armazena imagem em Cloudinary e retorna uma URL HTTPS pública e permanente. */
export async function storagePut(relKey: string, data: Buffer | Uint8Array | string, contentType = "application/octet-stream"): Promise<StorageResult> {
  const client = configureCloudinary();
  const publicId = normalizeKey(relKey);
  return uploadBuffer(client, toBuffer(data), publicId, contentType);
}

/** Gera a URL CDN pública de uma imagem já armazenada. */
export async function storageGet(relKey: string): Promise<StorageResult> {
  const client = configureCloudinary();
  const key = normalizeKey(relKey);
  return { key, url: client.url(key, { secure: true, resource_type: "image" }) };
}

/** As imagens culturais são públicas; a URL de entrega segura substitui links temporários. */
export async function storageGetSignedUrl(relKey: string): Promise<string> {
  return (await storageGet(relKey)).url;
}
