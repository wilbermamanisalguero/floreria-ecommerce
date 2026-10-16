import { sql } from "drizzle-orm";
import { boolean, check, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

// HU-05 (CONTRATO-HU-05 §D): un solo tipo de producto, terminado y con foto fija.
export const productos = pgTable(
  "productos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    nombre: text("nombre").notNull(),
    precioMinor: integer("precio_minor").notNull(),
    descripcion: text("descripcion").notNull(),
    imagenUrl: text("imagen_url").notNull(),
    activo: boolean("activo").notNull().default(true),
  },
  (t) => [
    check("productos_nombre_no_vacio", sql`${t.nombre} <> ''`),
    check("productos_descripcion_no_vacia", sql`${t.descripcion} <> ''`),
    check("productos_imagen_url_no_vacia", sql`${t.imagenUrl} <> ''`),
    check("productos_precio_minor_positivo", sql`${t.precioMinor} > 0`),
  ],
);

export type Producto = typeof productos.$inferSelect;
