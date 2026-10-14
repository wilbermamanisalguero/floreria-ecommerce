import path from "node:path";
import { defineConfig } from "vitest/config";
import { loadTestEnv } from "./tests/fixtures/load-env";

loadTestEnv();

const root = process.cwd();

export default defineConfig({
  resolve: {
    alias: [
      // Alias "@/*" -> "src/*" (convención de Next.js con carpeta src/).
      { find: /^@\//, replacement: `${path.join(root, "src")}/` },
      { find: "server-only", replacement: path.join(root, "tests/fixtures/empty-module.ts") },
    ],
  },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts", "tests/integration/**/*.test.ts"],
    testTimeout: 20_000,
  },
});
