import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import nodeStdlibBrowser from "vite-plugin-node-stdlib-browser";

export default defineConfig({
  plugins: [
    nodeStdlibBrowser(), // <-- FIRST!
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    cors: false,
  },
  resolve: {
    alias: {
      events: "events",
      stream: "stream-browserify",
      util: "util",
      process: "process/browser",
      crypto: "crypto-browserify",
      os: "os-browserify/browser",
      path: "path-browserify",
      constants: "constants-browserify",
    },
  },
});
