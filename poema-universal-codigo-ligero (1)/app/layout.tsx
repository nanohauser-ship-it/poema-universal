import VersoTechnoDock from "./components/VersoTechnoDock";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}        <VersoTechnoDock />
      </body>
    </html>
  );
}