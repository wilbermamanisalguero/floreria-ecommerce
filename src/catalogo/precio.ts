const formato = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Soles PEN: "S/ 1,234.56" (CONTRATO-HU-05 §C).
export function formatearPrecio(precioMinor: number): string {
  return `S/ ${formato.format(precioMinor / 100)}`;
}
