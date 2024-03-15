import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "../", "");
  return {
    build: { target: "esnext" },
    publicDir: "src/assets",
    server: { host: "0.0.0.0" },
    clearScreen: false,
    define: {
      "process.env": {
        HATHORA_APP_ID: process.env.HATHORA_APP_ID ?? env.HATHORA_APP_ID,
        HATHORA_API_HOST: process.env.HATHORA_API_HOST ?? env.HATHORA_API_HOST,
        IDEM_WEBSOCKET_API_URL: process.env.IDEM_WEBSOCKET_API_URL ?? env.IDEM_WEBSOCKET_API_URL,
        IDEM_GAME_SERVER: process.env.IDEM_GAME_SERVER ?? env.IDEM_GAME_SERVER, 
        IDEM_GAME_SLUG: process.env.IDEM_GAME_SLUG ?? env.IDEM_GAME_SLUG,
        IDEM_GAME_ID: process.env.IDEM_GAME_ID ?? env.IDEM_GAME_ID,
        IDEM_GAME_JOIN_CODE: process.env.IDEM_GAME_JOIN_CODE ?? env.IDEM_GAME_JOIN_CODE,
      },
    },
  };
});
