/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: "./src/index.ts",
      fileName: "index",
      formats: ["es"],
    },
    outDir: "dist",
    sourcemap: true,
  },
  test: {
    environment: "happy-dom",
  },
});
