// HU-05 §D: la tabla `productos` como estado de partida (CONTRATO-HU-05 v1).
// Caja negra sobre la BD: solo nombres de tabla/columnas del contrato, nunca el esquema del DEV.
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  DB_DISPONIBLE,
  MOTIVO_SALTO,
  aplicarMigraciones,
  conectar,
  producto,
  vaciarProductos,
  type Sql,
} from "../fixtures/catalogo-contract";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

describe.skipIf(!DB_DISPONIBLE)(`tabla productos (§D) — ${MOTIVO_SALTO}`, () => {
  let sql: Sql;

  beforeAll(() => {
    aplicarMigraciones();
    sql = conectar();
  }, 120_000);

  beforeEach(async () => {
    await vaciarProductos(sql);
  });

  afterAll(async () => {
    if (!sql) return;
    await vaciarProductos(sql);
    await sql.end();
  });

  // Inserta con columnas explícitas; `valores` puede omitir o pisar campos de un producto válido.
  async function insertar(valores: Record<string, unknown>) {
    const base: Record<string, unknown> = { ...producto("Rosas") };
    const fila = { ...base, ...valores };
    for (const k of Object.keys(fila)) if (fila[k] === undefined) delete fila[k];
    return sql`insert into productos ${sql(fila as Record<string, string>)} returning *`;
  }

  describe("D1: columnas", () => {
    it("existen exactamente con los tipos del contrato", async () => {
      const cols = await sql<{ column_name: string; data_type: string }[]>`
        select column_name, data_type from information_schema.columns
        where table_schema = current_schema() and table_name = 'productos'`;
      const tipos = Object.fromEntries(cols.map((c) => [c.column_name, c.data_type]));

      expect(tipos.id).toBe("uuid");
      expect(["text", "character varying"]).toContain(tipos.nombre);
      expect(["integer", "bigint", "smallint"]).toContain(tipos.precio_minor);
      expect(["text", "character varying"]).toContain(tipos.descripcion);
      expect(["text", "character varying"]).toContain(tipos.imagen_url);
      expect(tipos.activo).toBe("boolean");
    });

    it("id se genera y activo vale true por defecto", async () => {
      const [fila] = await insertar({ activo: undefined });
      expect(fila.id).toMatch(UUID);
      expect(fila.activo).toBe(true);
    });
  });

  describe("D2: descripcion obligatoria", () => {
    it("falla con descripcion nula", async () => {
      await expect(insertar({ descripcion: null })).rejects.toThrow();
    });
    it("falla con descripcion vacía", async () => {
      await expect(insertar({ descripcion: "" })).rejects.toThrow();
    });
  });

  describe("D3: nombre e imagen_url obligatorios, no vacíos", () => {
    it.each([
      ["nombre", null],
      ["nombre", ""],
      ["imagen_url", null],
      ["imagen_url", ""],
    ])("falla con %s = %j", async (col, valor) => {
      await expect(insertar({ [col]: valor })).rejects.toThrow();
    });
  });

  describe("D4: precio_minor obligatorio, entero > 0", () => {
    it.each([null, 0, -100])("falla con precio_minor = %j", async (valor) => {
      await expect(insertar({ precio_minor: valor })).rejects.toThrow();
    });
    it("acepta un entero positivo", async () => {
      const [fila] = await insertar({ precio_minor: 1 });
      expect(Number(fila.precio_minor)).toBe(1);
    });
  });
});
