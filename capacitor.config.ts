import type { CapacitorConfig } from "@capacitor/cli";

const serverUrl = process.env.CAPACITOR_SERVER_URL ?? "https://parkflow-pro-web-o3pw.vercel.app";

const config: CapacitorConfig = {
  appId: "br.com.webify.smartpark",
  appName: "SmartPark",
  webDir: "out",
  server: {
    url: serverUrl,
    cleartext: serverUrl.startsWith("http://"),
  },
};

export default config;
