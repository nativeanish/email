// vite.config.ts
import { defineConfig } from "file:///C:/Users/Predator/work/email/node_modules/.pnpm/vite@5.4.19_@types+node@24.0.13_lightningcss@1.30.1/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Predator/work/email/node_modules/.pnpm/@vitejs+plugin-react@4.6.0__d756195152cd3195c9d4babcd6b56136/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tailwindcss from "file:///C:/Users/Predator/work/email/node_modules/.pnpm/@tailwindcss+vite@4.1.11_vi_db7afe3210f009ba03b318ba792c57c2/node_modules/@tailwindcss/vite/dist/index.mjs";
import nodeStdlibBrowser from "file:///C:/Users/Predator/work/email/node_modules/.pnpm/vite-plugin-node-stdlib-bro_ad36c5bd0c51d71504fb33899545d395/node_modules/vite-plugin-node-stdlib-browser/index.cjs";
var vite_config_default = defineConfig({
  plugins: [
    nodeStdlibBrowser(),
    // <-- FIRST!
    react(),
    tailwindcss()
  ],
  server: {
    port: 3e3,
    cors: false
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
      constants: "constants-browserify"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxQcmVkYXRvclxcXFx3b3JrXFxcXGVtYWlsXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxQcmVkYXRvclxcXFx3b3JrXFxcXGVtYWlsXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9QcmVkYXRvci93b3JrL2VtYWlsL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSBcIkB0YWlsd2luZGNzcy92aXRlXCI7XHJcbmltcG9ydCBub2RlU3RkbGliQnJvd3NlciBmcm9tIFwidml0ZS1wbHVnaW4tbm9kZS1zdGRsaWItYnJvd3NlclwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICBub2RlU3RkbGliQnJvd3NlcigpLCAvLyA8LS0gRklSU1QhXHJcbiAgICByZWFjdCgpLFxyXG4gICAgdGFpbHdpbmRjc3MoKSxcclxuICBdLFxyXG4gIHNlcnZlcjoge1xyXG4gICAgcG9ydDogMzAwMCxcclxuICAgIGNvcnM6IGZhbHNlLFxyXG4gIH0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgZXZlbnRzOiBcImV2ZW50c1wiLFxyXG4gICAgICBzdHJlYW06IFwic3RyZWFtLWJyb3dzZXJpZnlcIixcclxuICAgICAgdXRpbDogXCJ1dGlsXCIsXHJcbiAgICAgIHByb2Nlc3M6IFwicHJvY2Vzcy9icm93c2VyXCIsXHJcbiAgICAgIGNyeXB0bzogXCJjcnlwdG8tYnJvd3NlcmlmeVwiLFxyXG4gICAgICBvczogXCJvcy1icm93c2VyaWZ5L2Jyb3dzZXJcIixcclxuICAgICAgcGF0aDogXCJwYXRoLWJyb3dzZXJpZnlcIixcclxuICAgICAgY29uc3RhbnRzOiBcImNvbnN0YW50cy1icm93c2VyaWZ5XCIsXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdSLFNBQVMsb0JBQW9CO0FBQzdTLE9BQU8sV0FBVztBQUNsQixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLHVCQUF1QjtBQUU5QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxrQkFBa0I7QUFBQTtBQUFBLElBQ2xCLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxFQUNkO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLE1BQ1IsUUFBUTtBQUFBLE1BQ1IsTUFBTTtBQUFBLE1BQ04sU0FBUztBQUFBLE1BQ1QsUUFBUTtBQUFBLE1BQ1IsSUFBSTtBQUFBLE1BQ0osTUFBTTtBQUFBLE1BQ04sV0FBVztBQUFBLElBQ2I7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
