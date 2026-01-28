import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { TranslationProvider } from "@/contexts/TranslationContext";

export const metadata: Metadata = {
  title: "Maniuz E-Ticaret - Soğuk İçecekler ve Enerji İçecekleri",
  description: "Soğuk içecekler ve enerji içecekleri satışı",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">
        <AuthProvider>
          <TranslationProvider>
            {children}
          </TranslationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
