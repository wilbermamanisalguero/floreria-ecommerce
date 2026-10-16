// HU-05 — Consultar catálogo (contratos/CONTRATO-HU-05.md v2), casos A, B, C, D5, E1–E3.
// Caja negra: estado de partida en la tabla `productos`, verificación por HTTP + navegador.
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";
import {
  CATALOGO_PATH,
  DB_DISPONIBLE,
  ENLACE_VOLVER,
  H1_CATALOGO,
  MOTIVO_SALTO,
  MSG_CATALOGO_VACIO,
  MSG_NO_ENCONTRADO,
  PRECIOS,
  UUID_INEXISTENTE,
  aplicarMigraciones,
  conectar,
  fichaPath,
  insertarProductos,
  producto,
  vaciarProductos,
  type NuevoProducto,
  type Sql,
} from "../tests/fixtures/catalogo-contract";

test.describe.configure({ mode: "serial" });
test.skip(!DB_DISPONIBLE, MOTIVO_SALTO);

let sql: Sql;

test.beforeAll(async () => {
  test.setTimeout(120_000);
  aplicarMigraciones();
  sql = conectar();
});

test.afterAll(async () => {
  if (!sql) return;
  await vaciarProductos(sql);
  await sql.end();
});

async function sembrar(items: NuevoProducto[]) {
  await vaciarProductos(sql);
  return insertarProductos(sql, items);
}

const TRES = [producto("Rosas"), producto("Girasoles"), producto("Lirios")];

// Texto tal cual (textContent, sin normalizar espacios): los textos exactos se comparan así.
const textoCrudo = (l: Locator) => l.evaluate((el) => el.textContent ?? "");

async function graves(page: Page) {
  const { violations } = await new AxeBuilder({ page }).analyze();
  return violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => `${v.impact} ${v.id}: ${v.help} (${v.nodes.length} nodos)`);
}

// A8 / B2: controles y señales fuera de alcance (búsqueda, filtros, categorías, variantes,
// personalización, add-ons, carrito/compra, disponibilidad).
async function sinFueraDeAlcance(page: Page) {
  await expect(page.locator("input, select, textarea")).toHaveCount(0);
  await expect(page.getByRole("searchbox")).toHaveCount(0);
  await expect(page.getByRole("combobox")).toHaveCount(0);
  await expect(page.getByRole("checkbox")).toHaveCount(0);
  await expect(page.getByRole("radio")).toHaveCount(0);
  await expect(page.locator("form")).toHaveCount(0);
  await expect(page.getByRole("button")).toHaveCount(0);
  const prohibido =
    /buscar|filtr|categor|variante|personaliz|add-on|complemento|carrito|comprar|agregar|añadir|disponib|agotad|stock/i;
  expect(await page.locator("body").innerText()).not.toMatch(prohibido);
}

test.describe("A. Listado /catalogo", () => {
  test("A1 + A9: 200 sin sesión, h1 'Catálogo' y un elemento por producto con imagen, nombre y precio", async ({
    browser,
  }) => {
    const productos = await sembrar(TRES);
    const ctx = await browser.newContext(); // sin cookies
    const page = await ctx.newPage();

    const res = await page.goto(CATALOGO_PATH);

    expect(res?.status()).toBe(200);
    expect(res?.request().redirectedFrom()).toBeNull();
    expect(new URL(page.url()).pathname).toBe(CATALOGO_PATH);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(H1_CATALOGO);
    const items = page.getByRole("list").getByRole("listitem");
    await expect(items).toHaveCount(3);
    for (const p of productos) {
      const item = items.filter({ hasText: p.nombre });
      await expect(item).toHaveCount(1);
      await expect(item.locator("img")).toHaveCount(1);
      expect(await textoCrudo(item)).toContain("S/ 120.50");
    }
    await ctx.close();
  });

  test("A2: cada elemento muestra solo imagen, nombre y precio", async ({ page }) => {
    const productos = await sembrar(TRES);
    await page.goto(CATALOGO_PATH);

    for (const p of productos) {
      const item = page.getByRole("listitem").filter({ hasText: p.nombre });
      await expect(item.locator("img")).toHaveCount(1);
      const resto = (await textoCrudo(item)).replace(p.nombre, "").replace("S/ 120.50", "");
      expect(resto.trim()).toBe("");
      expect(await textoCrudo(item)).not.toContain(p.descripcion);
    }
  });

  test("A3: el alt de cada imagen es exactamente la descripcion", async ({ page }) => {
    const productos = await sembrar(TRES);
    await page.goto(CATALOGO_PATH);

    for (const p of productos) {
      const img = page.getByRole("listitem").filter({ hasText: p.nombre }).locator("img");
      await expect(img).toHaveAttribute("alt", p.descripcion);
    }
  });

  test("A4: cada elemento enlaza a /catalogo/<id> con el nombre en su nombre accesible", async ({
    page,
  }) => {
    const productos = await sembrar(TRES);
    await page.goto(CATALOGO_PATH);

    for (const p of productos) {
      const item = page.getByRole("listitem").filter({ hasText: p.nombre });
      const enlace = item.getByRole("link", { name: p.nombre });
      await expect(enlace).toHaveCount(1);
      await expect(enlace).toHaveAttribute("href", fichaPath(p.id));
    }
  });

  test("A5: el producto inactivo no aparece", async ({ page }) => {
    await sembrar([producto("Rosas"), producto("Lirios"), producto("Tulipanes", { activo: false })]);
    await page.goto(CATALOGO_PATH);

    await expect(page.getByRole("list").getByRole("listitem")).toHaveCount(2);
    expect(await page.locator("body").innerText()).not.toContain("Tulipanes");
  });

  test("A6: orden alfabético ascendente por nombre", async ({ page }) => {
    await sembrar(TRES); // insertados como Rosas, Girasoles, Lirios
    await page.goto(CATALOGO_PATH);

    const items = page.getByRole("list").getByRole("listitem");
    await expect(items).toHaveCount(3);
    const textos = await items.allTextContents();
    const orden = textos.map((t) => ["Girasoles", "Lirios", "Rosas"].find((n) => t.includes(n)));
    expect(orden).toEqual(["Girasoles", "Lirios", "Rosas"]);
  });

  test("A7: catálogo vacío -> 200, h1 'Catálogo', mensaje exacto y sin lista", async ({ page }) => {
    await sembrar([producto("Rosas", { activo: false })]);
    const res = await page.goto(CATALOGO_PATH);

    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(H1_CATALOGO);
    const mensaje = page.getByText(MSG_CATALOGO_VACIO, { exact: true });
    await expect(mensaje).toHaveCount(1);
    expect((await textoCrudo(mensaje)).trim()).toBe(MSG_CATALOGO_VACIO);
    await expect(page.getByRole("listitem")).toHaveCount(0);
  });

  test("A8: sin controles fuera de alcance", async ({ page }) => {
    await sembrar(TRES);
    await page.goto(CATALOGO_PATH);
    await sinFueraDeAlcance(page);
  });

  test("A10: sin violaciones axe serious/critical con productos", async ({ page }) => {
    await sembrar(TRES);
    await page.goto(CATALOGO_PATH);
    expect(await graves(page)).toEqual([]);
  });

  test("A10: sin violaciones axe serious/critical con catálogo vacío", async ({ page }) => {
    await sembrar([]);
    await page.goto(CATALOGO_PATH);
    expect(await graves(page)).toEqual([]);
  });
});

test.describe("B. Ficha /catalogo/<id>", () => {
  test("B1: 200, h1 = nombre, precio, imagen con alt = descripcion y descripcion visible", async ({
    page,
  }) => {
    const [p] = await sembrar([producto("Rosas")]);
    const res = await page.goto(fichaPath(p.id));

    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(p.nombre);
    expect(await textoCrudo(page.locator("body"))).toContain("S/ 120.50");
    await expect(page.locator(`img[alt="${p.descripcion}"]`)).toHaveCount(1);
    await expect(page.getByText(p.descripcion, { exact: true })).toBeVisible();
  });

  test("B2: sin variantes, categoría, personalización, add-ons, carrito ni disponibilidad", async ({
    page,
  }) => {
    const [p] = await sembrar([producto("Rosas")]);
    await page.goto(fichaPath(p.id));
    // E3 (v2): "una sola imagen" se mide dentro de main; fuera (encabezado, logo) es libre.
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("main img")).toHaveCount(1);
    await sinFueraDeAlcance(page);
  });

  test("B3: enlace exacto 'Volver al catálogo' hacia /catalogo", async ({ page }) => {
    const [p] = await sembrar([producto("Rosas")]);
    await page.goto(fichaPath(p.id));

    const volver = page.getByRole("link", { name: ENLACE_VOLVER, exact: true });
    await expect(volver).toHaveCount(1);
    await expect(volver).toHaveAttribute("href", CATALOGO_PATH);
  });

  const casos404 = [
    { caso: "B4: id inexistente", ruta: async () => fichaPath(UUID_INEXISTENTE) },
    { caso: "B5: id malformado", ruta: async () => fichaPath("abc") },
    {
      caso: "B6: producto inactivo",
      ruta: async () => fichaPath((await sembrar([producto("Rosas", { activo: false })]))[0].id),
    },
  ];

  for (const { caso, ruta } of casos404) {
    test(`${caso} -> 404 'Producto no encontrado' con 'Volver al catálogo'`, async ({ page }) => {
      await sembrar([producto("Lirios")]);
      const destino = await ruta();
      const res = await page.goto(destino);

      expect(res?.status()).toBe(404);
      await expect(page.getByText(MSG_NO_ENCONTRADO, { exact: true })).toHaveCount(1);
      const volver = page.getByRole("link", { name: ENLACE_VOLVER, exact: true });
      await expect(volver).toHaveCount(1);
      await expect(volver).toHaveAttribute("href", CATALOGO_PATH);
    });
  }

  test("B7: sin violaciones axe serious/critical en la ficha", async ({ page }) => {
    const [p] = await sembrar([producto("Rosas")]);
    await page.goto(fichaPath(p.id));
    expect(await graves(page)).toEqual([]);
  });

  test("B7: sin violaciones axe serious/critical en el 404", async ({ page }) => {
    await sembrar([]);
    await page.goto(fichaPath(UUID_INEXISTENTE));
    expect(await graves(page)).toEqual([]);
  });
});

test.describe("C. Formato del precio", () => {
  for (const { caso, minor, texto } of PRECIOS) {
    test(`${caso}: precio_minor ${minor} -> '${texto}' en listado y ficha`, async ({ page }) => {
      const [p] = await sembrar([producto("Rosas", { precio_minor: minor })]);

      await page.goto(CATALOGO_PATH);
      expect(await textoCrudo(page.getByRole("listitem"))).toContain(texto);

      await page.goto(fichaPath(p.id));
      expect(await textoCrudo(page.locator("body"))).toContain(texto);
    });
  }
});

test.describe("E2. Datos frescos: render por petición", () => {
  test("/catalogo refleja altas, bajas y cambios de productos en la siguiente petición", async ({
    page,
  }) => {
    const [rosas] = await sembrar([producto("Rosas")]);
    await page.goto(CATALOGO_PATH);
    const items = page.getByRole("list").getByRole("listitem");
    await expect(items).toHaveCount(1);

    await insertarProductos(sql, [producto("Lirios")]);
    await page.goto(CATALOGO_PATH);
    await expect(items).toHaveCount(2);

    await sql`update productos set nombre = 'Orquídeas' where id = ${rosas.id}`;
    await page.goto(CATALOGO_PATH);
    await expect(items.filter({ hasText: "Orquídeas" })).toHaveCount(1);
    await expect(items.filter({ hasText: "Rosas" })).toHaveCount(0);

    await vaciarProductos(sql);
    await page.goto(CATALOGO_PATH);
    await expect(page.getByText(MSG_CATALOGO_VACIO, { exact: true })).toHaveCount(1);
  });

  test("/catalogo/<id> refleja cambios y desactivación en la siguiente petición", async ({ page }) => {
    const [p] = await sembrar([producto("Rosas")]);
    await page.goto(fichaPath(p.id));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Rosas");

    await sql`update productos set nombre = 'Orquídeas', precio_minor = 5000 where id = ${p.id}`;
    await page.goto(fichaPath(p.id));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Orquídeas");
    expect(await textoCrudo(page.locator("body"))).toContain("S/ 50.00");

    await sql`update productos set activo = false where id = ${p.id}`;
    expect((await page.goto(fichaPath(p.id)))?.status()).toBe(404);
  });
});

test.describe("D5. Imágenes en Vercel Blob", () => {
  test("listado y ficha se renderizan sin error con URL *.public.blob.vercel-storage.com", async ({
    page,
  }) => {
    const errores: string[] = [];
    page.on("pageerror", (e) => errores.push(e.message));
    const [p] = await sembrar([producto("Rosas")]);

    expect((await page.goto(CATALOGO_PATH))?.status()).toBe(200);
    await expect(page.getByRole("listitem").locator("img")).toHaveCount(1);
    expect((await page.goto(fichaPath(p.id)))?.status()).toBe(200);
    await expect(page.locator(`img[alt="${p.descripcion}"]`)).toHaveCount(1);
    expect(errores).toEqual([]);
  });
});
