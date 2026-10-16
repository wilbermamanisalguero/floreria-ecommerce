import Link from "next/link";

export default function ProductoNoEncontrado() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Producto no encontrado</h1>
      <Link href="/catalogo" className="mt-4 inline-block underline underline-offset-4">
        Volver al catálogo
      </Link>
    </main>
  );
}
