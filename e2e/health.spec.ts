import { expect, test } from "@playwright/test";
import {
  DB_DOWN_PORT,
  HEALTH_DB_DOWN,
  HEALTH_OK,
  HEALTH_PATH,
} from "../tests/fixtures/health-contract";

test.describe("GET /api/health (SPRINT0 §5)", () => {
  test("criterio 3: con BD disponible responde 200 y el cuerpo exacto", async ({ request }) => {
    test.skip(!process.env.DATABASE_URL, "DATABASE_URL no definida: criterio 3 NO VERIFICADO");

    const res = await request.get(HEALTH_PATH);

    expect(res.status()).toBe(HEALTH_OK.status);
    expect(await res.text()).toBe(HEALTH_OK.body);
  });

  test("criterio 4: con BD caída responde 503 y el cuerpo exacto", async ({ request }) => {
    const base = `http://localhost:${DB_DOWN_PORT}`;
    // La segunda instancia (BD inalcanzable) arranca a la par de la principal: esperar a que sirva.
    await expect
      .poll(async () => (await request.get(`${base}/`).catch(() => null))?.status() ?? 0, {
        timeout: 60_000,
      })
      .toBe(200);

    const res = await request.get(`${base}${HEALTH_PATH}`);

    expect(res.status()).toBe(HEALTH_DB_DOWN.status);
    expect(await res.text()).toBe(HEALTH_DB_DOWN.body);
  });
});
