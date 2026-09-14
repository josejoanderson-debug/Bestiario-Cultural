import { createHmac, timingSafeEqual } from "node:crypto";

export const LOCAL_ADMIN_COOKIE = "bestiario_local_admin";

function configuredUsername() {
  return process.env.ADMIN_LOCAL_USERNAME ?? "";
}

function configuredPassword() {
  return process.env.ADMIN_LOCAL_PASSWORD ?? "";
}

function safelyMatches(actual: string, expected: string) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

export function verifyLocalAdminCredentials(username: string, password: string) {
  const expectedUsername = configuredUsername();
  const expectedPassword = configuredPassword();
  if (!expectedUsername || !expectedPassword) return false;
  return safelyMatches(username, expectedUsername) && safelyMatches(password, expectedPassword);
}

export function localAdminSessionValue() {
  const username = configuredUsername();
  const password = configuredPassword();
  if (!username || !password) return "";

  const signingKey = process.env.JWT_SECRET;
  if (!signingKey) return "";
  return createHmac("sha256", signingKey).update(`${username}:${password}:bestiario-local-admin`).digest("base64url");
}

export function hasLocalAdminSession(cookieHeader: string | undefined) {
  const expected = localAdminSessionValue();
  if (!expected || !cookieHeader) return false;
  const encodedCookie = cookieHeader.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${LOCAL_ADMIN_COOKIE}=`));
  const received = encodedCookie?.slice(LOCAL_ADMIN_COOKIE.length + 1) ?? "";
  return safelyMatches(received, expected);
}
