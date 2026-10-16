import { and, asc, eq } from "drizzle-orm";

import { getDb } from "@/db";
import { productos, type Producto } from "@/db/schema";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function listarProductosActivos(): Promise<Producto[]> {
  return getDb()
    .select()
    .from(productos)
    .where(eq(productos.activo, true))
    .orderBy(asc(productos.nombre));
}

// Id malformado o producto inexistente/inactivo → undefined (la página responde 404).
export async function obtenerProductoActivo(id: string): Promise<Producto | undefined> {
  if (!UUID.test(id)) return undefined;
  const [producto] = await getDb()
    .select()
    .from(productos)
    .where(and(eq(productos.id, id), eq(productos.activo, true)))
    .limit(1);
  return producto;
}
