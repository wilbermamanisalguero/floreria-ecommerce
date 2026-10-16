import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";

import { listarProductosActivos } from "@/catalogo/consultas";
import { formatearPrecio } from "@/catalogo/precio";

export const metadata: Metadata = {
  title: "Catálogo · Florería",
};

export default async function CatalogoPage() {
  // El catálogo se lee de la BD en cada petición, no en el build.
  await connection();
  const productos = await listarProductosActivos();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-semibold tracking-tight">Catálogo</h1>
      {productos.length === 0 ? (
        <p className="mt-6 text-muted-foreground">Por ahora no hay productos en el catálogo.</p>
      ) : (
        <ul role="list" className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {productos.map((producto) => (
            <li key={producto.id}>
              <Link
                href={`/catalogo/${producto.id}`}
                className="block overflow-hidden rounded-lg border border-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Image
                  src={producto.imagenUrl}
                  alt={producto.descripcion}
                  width={600}
                  height={600}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="aspect-square w-full bg-muted object-cover"
                />
                <div className="p-3">
                  <h2 className="font-medium">{producto.nombre}</h2>
                  <p className="mt-1 text-sm">{formatearPrecio(producto.precioMinor)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
