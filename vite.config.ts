import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/@radix-ui")) {
            return "radix";
          }

          if (id.includes("node_modules/react-router")) {
            return "router";
          }

          if (id.includes("node_modules/react")) {
            return "react-vendor";
          }

          if (id.includes("node_modules/@js-temporal")) {
            return "temporal";
          }

          return undefined;
        },
      },
    },
  },
  plugins: [react(), cloudflare()],
  resolve: {
    alias: {
      src: new URL("./src", import.meta.url).pathname,
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
  },
});