import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("criterio 5: / responde 200 sin violaciones axe serious ni critical", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.status()).toBe(200);

  const { violations } = await new AxeBuilder({ page }).analyze();
  const graves = violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => `${v.impact} ${v.id}: ${v.help} (${v.nodes.length} nodos)`);

  expect(graves).toEqual([]);
});
