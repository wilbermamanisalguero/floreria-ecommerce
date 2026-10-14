// Contrato de GET /api/health llamando al Route Handler que fija SPRINT0 §5 criterio 9
// (src/app/api/health/route.ts), con la URL de BD controlada por la prueba.
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  HEALTH_DB_DOWN,
  HEALTH_OK,
  HEALTH_PATH,
  UNREACHABLE_DATABASE_URL,
} from "../fixtures/health-contract";

const realDatabaseUrl = process.env.DATABASE_URL;

async function callHealth(databaseUrl: string) {
  vi.resetModules();
  vi.stubEnv("DATABASE_URL", databaseUrl);
  const route = await import("../../src/app/api/health/route");
  const GET = route.GET as (req: Request) => Promise<Response>;
  const res = await GET(new Request(`http://localhost:3000${HEALTH_PATH}`));
  return { status: res.status, body: await res.text() };
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("GET /api/health", () => {
  it.skipIf(!realDatabaseUrl)("criterio 3: con BD disponible -> 200 y cuerpo exacto", async () => {
    expect(await callHealth(realDatabaseUrl!)).toEqual(HEALTH_OK);
  });

  it("criterio 4: con BD inalcanzable -> 503 y cuerpo exacto", async () => {
    expect(await callHealth(UNREACHABLE_DATABASE_URL)).toEqual(HEALTH_DB_DOWN);
  });
});
