import { defineConfig } from "drizzle-kit";

// drizzle-kit no carga .env por sí solo; se lee si existe (Node >= 20.12).
for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    // archivo ausente: se usa el entorno del proceso
  }
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
