type AuthUser = { name?: string | null; email?: string | null; role?: string } | null;

/**
 * O Bestiário não exige conta pública. A rota /admin valida uma sessão local
 * assinada no servidor; este hook preserva a interface dos componentes legados.
 */
export function useAuth() {
  return {
    user: null as AuthUser,
    loading: false,
    error: null,
    isAuthenticated: false,
    refresh: async () => undefined,
    logout: async () => undefined,
  };
}
