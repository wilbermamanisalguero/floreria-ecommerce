import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { obtenerProductoActivo } from "@/catalogo/consultas";
import { formatearPrecio } from "@/catalogo/precio";

export const metadata: Metadata = {
  title: "Producto · Florería",
};

export default async function FichaProductoPage({ params }: PageProps<"/catalogo/[id]">) {
  const { id } = await params;
  const producto = await obtenerProductoActivo(id);

  if (!producto) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/catalogo" className="text-sm underline underline-offset-4">
        Volver al catálogo
      </Link>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <Image
          src={producto.imagenUrl}
          alt={producto.descripcion}
          width={800}
          height={800}
          sizes="(min-width: 640px) 50vw, 100vw"
          priority
          className="aspect-square w-full rounded-lg bg-muted object-cover"
        />
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{producto.nombre}</h1>
          <p className="mt-2 text-xl">{formatearPrecio(producto.precioMinor)}</p>
          <p className="mt-4 text-muted-foreground">{producto.descripcion}</p>
        </div>
      </div>
    </main>
  );
}
