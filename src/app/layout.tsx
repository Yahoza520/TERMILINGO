import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/providers/auth-provider";

export const metadata: Metadata = {
  title: "TermiLingo - Türkiye'nin Profesyonel Tercüman Platformu",
  description: "Profesyonel tercüman arayın, çeviri projeleri bulun, terminoloji sözlüğü oluşturun.",
  keywords: "tercüman, çeviri, hukuk çevirisi, teknik çeviri, konferans tercümanlığı",
};

import Header from "@/components/layout/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className="h-full antialiased font-sans"
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
