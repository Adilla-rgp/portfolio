import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  // Component tests render to static markup; React 19 needs the automatic runtime.
  esbuild: { jsx: "automatic" },
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "node",
  },
});
