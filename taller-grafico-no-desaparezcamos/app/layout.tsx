import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taller Gráfico — No dejes que desaparezcamos",
  description: "Mesa de producción narrativa para construir la obra gráfica a partir de la novela."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
