import type { CapacitorConfig } from "@capacitor/cli";

const appOrigin = process.env.APP_ORIGIN;
if (!appOrigin?.startsWith("https://")) {
  throw new Error("Defina APP_ORIGIN com a URL HTTPS da hospedagem externa antes de executar o Capacitor.");
}

const config: CapacitorConfig = {
  appId: "org.bestiariocultural.app",
  appName: "Bestiário Cultural",
  webDir: "dist",
  server: { url: appOrigin, cleartext: false },
};

export default config;
