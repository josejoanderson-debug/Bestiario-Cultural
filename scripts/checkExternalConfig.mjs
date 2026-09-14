const required = [
  "DATABASE_URL",
  "JWT_SECRET",
  "ADMIN_LOCAL_USERNAME",
  "ADMIN_LOCAL_PASSWORD",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const recommended = ["VITE_CLOUDINARY_CLOUD_NAME", "VITE_CLOUDINARY_UPLOAD_PRESET"];

const missing = required.filter((key) => !process.env[key]?.trim());
if (missing.length) {
  console.error(`Configuração externa incompleta. Defina: ${missing.join(", ")}`);
  process.exit(1);
}

if (!/^postgres(ql)?:\/\//.test(process.env.DATABASE_URL)) {
  console.error('DATABASE_URL deve usar um endereço Postgres válido (ex.: "postgresql://...supabase.com:6543/postgres").');
  process.exit(1);
}

if (process.env.JWT_SECRET.length < 32) {
  console.error("JWT_SECRET deve ter pelo menos 32 caracteres.");
  process.exit(1);
}

const missingRecommended = recommended.filter((key) => !process.env[key]?.trim());
if (missingRecommended.length) {
  console.warn(
    `Aviso: variáveis públicas de upload não definidas (${missingRecommended.join(", ")}). O envio de fotos pelo painel administrativo não vai funcionar até que sejam configuradas.`,
  );
}

console.log("Configuração externa validada: banco, sessão local e imagens estão prontos para publicação.");
