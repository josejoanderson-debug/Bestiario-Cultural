import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase do navegador. Usa a "anon key" — feita para uso público
 * no cliente; quem protege os dados são as políticas de acesso (RLS)
 * configuradas no banco/bucket, não o sigilo dessa chave.
 */
export class SupabaseConfigError extends Error {}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  if (!url || !anonKey) {
    throw new SupabaseConfigError("Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.");
  }

  cachedClient = createClient(url, anonKey);
  return cachedClient;
}
