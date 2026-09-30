import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yaps — Promociones de Bolivia",
  description: "Todas las mejores promociones de Bolivia en un solo lugar",
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
        <meta name="google-adsense-account" content="ca-pub-6370743227565174" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6370743227565174"
          crossOrigin="anonymous"
        />
        <script src="https://pl31580906.profitableratecpmnetwork.com/ee/ee/a2/eeeea24a51d1a416f82a7e7d4991830b.js" />
        <script src="https://pl31580907.profitableratecpmnetwork.com/5e/91/77/5e9177a2f9d566c20478e5c0c7d87d45.js" />
        <script
          async
          data-cfasync="false"
          src="https://pl31580908.profitableratecpmnetwork.com/9a28b1831f6bf8749e072041e3270242/invoke.js"
        />
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
