import { existsSync } from "node:fs";

// Carga DATABASE_URL desde los mismos archivos que usa Next.js en local.
// process.loadEnvFile no pisa variables ya definidas en el entorno.
export function loadTestEnv(): void {
  for (const file of [".env.local", ".env"]) {
    if (existsSync(file)) process.loadEnvFile(file);
  }
}
