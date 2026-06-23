import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/Sonner";
import MobileOverlay from "@/components/MobileOverlay";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SISPORTE",
  description:
    "Plataforma para emissão, gerenciamento e validação de carteiras funcionais da Guarda Municipal de São Luís",
  icons: {
    icon: "/brasaoguarda.png",
    apple: "/brasaoguarda.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const shouldEnableAnalytics =
    process.env.NODE_ENV === "production" && process.env.VERCEL === "1";

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Toaster position="top-right" />
        {/* <MobileOverlay /> */}
        {children}
        {shouldEnableAnalytics && <Analytics />}
      </body>
    </html>
  );
}
