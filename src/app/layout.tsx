import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yaps — Promociones de Bolivia",
  description: "Todas las mejores promociones de Bolivia en un solo lugar",
  icons: {
    icon: [
      { url: "/img/Logo.webp", type: "image/webp" },
    ],
    shortcut: "/img/Logo.webp",
    apple: "/img/Logo.webp",
  },
  other: {
    "google-adsense-account": "ca-pub-6370743227565174",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/img/Logo.webp" type="image/webp" sizes="any" />
        <link rel="apple-touch-icon" href="/img/Logo.webp" />
        <meta name="google-adsense-account" content="ca-pub-6370743227565174" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6370743227565174"
          crossOrigin="anonymous"
        />
        <script src="https://pl31581293.profitableratecpmnetwork.com/1d/7e/af/1d7eaf3ec29e815accb23da478075bdf.js" />
        <script src="https://pl31581339.profitableratecpmnetwork.com/58/d1/ca/58d1ca17f079da07a800d562e971d5ed.js" />
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <AuthProvider>
          {children}
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
