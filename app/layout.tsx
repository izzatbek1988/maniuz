import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Maniuz E-Tijоrat - Sovuq ichimliklar va energetik ichimliklar",
  description: "Sovuq ichimliklar va energetik ichimliklar sotiladi. Tez yetkazib berish va qulay narxlar.",
  keywords: ["maniuz", "sovuq ichimliklar", "energetik ichimliklar", "ichimliklar", "online xarid", "tashkent"],
  metadataBase: new URL('https://maniuz.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'uz_UZ',
    url: 'https://maniuz.vercel.app',
    siteName: 'Maniuz',
    title: 'Maniuz E-Tijоrat - Sovuq ichimliklar va energetik ichimliklar',
    description: 'Sovuq ichimliklar va energetik ichimliklar sotiladi. Tez yetkazib berish va qulay narxlar.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className="antialiased">
        <AuthProvider>
          <TranslationProvider>
            {children}
            <Toaster position="top-right" />
          </TranslationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
