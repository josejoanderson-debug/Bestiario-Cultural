import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { LOCAL_ADMIN_COOKIE } from "./localAdmin";
import type { TrpcContext } from "./_core/context";

function createContext(cookie = "") {
  const setCookies: Array<{ name: string; value: string }> = [];
  const ctx = {
    user: null,
    req: { protocol: "https", headers: cookie ? { cookie } : {} },
    res: {
      cookie: (name: string, value: string) => setCookies.push({ name, value }),
      clearCookie: () => undefined,
    },
  } as unknown as TrpcContext;
  return { ctx, setCookies };
}

describe("admin.localLogin", () => {
  it("aceita as credenciais locais configuradas e estabelece sessão administrativa", async () => {
    const username = process.env.ADMIN_LOCAL_USERNAME;
    const password = process.env.ADMIN_LOCAL_PASSWORD;
    expect(username).toBeTruthy();
    expect(password).toBeTruthy();

    const login = createContext();
    const result = await appRouter.createCaller(login.ctx).admin.localLogin({ username: username!, password: password! });
    expect(result).toEqual({ success: true });
    expect(login.setCookies).toHaveLength(1);
    expect(login.setCookies[0]?.name).toBe(LOCAL_ADMIN_COOKIE);

    const session = createContext(`${LOCAL_ADMIN_COOKIE}=${login.setCookies[0]?.value}`);
    await expect(appRouter.createCaller(session.ctx).admin.localSession()).resolves.toMatchObject({ authenticated: true, via: "local" });
    await expect(appRouter.createCaller(session.ctx).admin.listCultures()).resolves.toBeInstanceOf(Array);
  });

  it("rejeita uma senha local incorreta", async () => {
    const login = createContext();
    await expect(appRouter.createCaller(login.ctx).admin.localLogin({ username: "ifpbpedras", password: "senha-incorreta" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
