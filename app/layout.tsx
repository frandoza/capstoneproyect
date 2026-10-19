import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Food Solutions | Desarrollo de sabores para la industria",
  description:
    "Desarrollo técnico de sabores naturales para bebidas, lácteos, helados, panificación y otras aplicaciones alimentarias.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
