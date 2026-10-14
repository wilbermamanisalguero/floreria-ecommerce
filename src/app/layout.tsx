import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Florería",
  description: "E-commerce de Florería",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-dvh bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
