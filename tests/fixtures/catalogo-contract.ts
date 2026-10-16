// Contrato observable de HU-05 (contratos/CONTRATO-HU-05.md v2): nombres que no se negocian
// y preparación del estado de partida insertando directamente en la tabla `productos` (§D).
import { spawnSync } from "node:child_process";
import path from "node:path";
import postgres from "postgres";

export const CATALOGO_PATH = "/catalogo";
export const fichaPath = (id: string) => `${CATALOGO_PATH}/${id}`;

export const H1_CATALOGO = "Catálogo";
export const MSG_CATALOGO_VACIO = "Por ahora no hay productos en el catálogo.";
export const MSG_NO_ENCONTRADO = "Producto no encontrado";
export const ENLACE_VOLVER = "Volver al catálogo";

// §C + §E1 (v2): precio_minor -> texto exacto (soles, "S/", espacio U+0020 —U+00A0 no cumple—,
// miles con coma, dos decimales). Se compara textContent sin normalizar espacios.
export const PRECIOS = [
  { caso: "C1", minor: 12050, texto: "S/ 120.50" },
  { caso: "C2", minor: 123456, texto: "S/ 1,234.56" },
  { caso: "C3", minor: 5000, texto: "S/ 50.00" },
] as const;

// §D5: host de Vercel Blob. Las URL no tienen que existir: el contrato pide que la página
// se renderice con ellas sin error.
export const blobUrl = (archivo: string) =>
  `https://tester-hu05.public.blob.vercel-storage.com/${archivo}`;

// UUID válido que no corresponde a ningún producto (B4).
export const UUID_INEXISTENTE = "00000000-0000-4000-8000-000000000000";

export type NuevoProducto = {
  nombre: string;
  precio_minor: number;
  descripcion: string;
  imagen_url: string;
  activo?: boolean;
};

export type Producto = Required<NuevoProducto> & { id: string };

export const producto = (nombre: string, extra: Partial<NuevoProducto> = {}): NuevoProducto => ({
  nombre,
  precio_minor: 12050,
  descripcion: `Ramo de ${nombre.toLowerCase()} frescas envuelto en papel kraft`,
  imagen_url: blobUrl(`${nombre.toLowerCase()}.jpg`),
  ...extra,
});

// Las pruebas que usan BD vacían `productos`: solo corren con DATABASE_URL y permiso explícito,
// para no borrar datos de una base compartida por accidente.
export const DB_DISPONIBLE = !!process.env.DATABASE_URL && process.env.TEST_ALLOW_DB_RESET === "1";
export const MOTIVO_SALTO =
  "Requiere DATABASE_URL y TEST_ALLOW_DB_RESET=1 (las pruebas vacían la tabla productos): NO VERIFICADO";

export function conectar() {
  return postgres(process.env.DATABASE_URL!, { max: 1, onnotice: () => {} });
}

export type Sql = ReturnType<typeof conectar>;

// D1: la tabla existe "tras aplicar las migraciones de drizzle/". Se aplican con drizzle-kit.
export function aplicarMigraciones(): void {
  // Sin import.meta: Playwright carga este módulo como CommonJS. Se corre desde la raíz del proyecto.
  const bin = path.join(process.cwd(), "node_modules", "drizzle-kit", "bin.cjs");
  const r = spawnSync(process.execPath, [bin, "migrate"], { encoding: "utf8", env: process.env });
  if (r.status !== 0) {
    throw new Error(`drizzle-kit migrate falló (exit ${r.status}):\n${r.stdout}\n${r.stderr}`);
  }
}

export async function vaciarProductos(sql: Sql): Promise<void> {
  await sql`delete from productos`;
}

export async function insertarProductos(sql: Sql, items: NuevoProducto[]): Promise<Producto[]> {
  const out: Producto[] = [];
  for (const p of items) {
    const [row] = await sql<Producto[]>`
      insert into productos (nombre, precio_minor, descripcion, imagen_url, activo)
      values (${p.nombre}, ${p.precio_minor}, ${p.descripcion}, ${p.imagen_url}, ${p.activo ?? true})
      returning id, nombre, precio_minor, descripcion, imagen_url, activo`;
    out.push(row);
  }
  return out;
}
