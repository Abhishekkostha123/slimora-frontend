import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { getCategories } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Slimora Living — 369 Manifestation Method, Spirituality & Mindset",
    template: "%s | Slimora Living",
  },
  description:
    "Slimora Living guides you through the 369 manifestation method, law of attraction, spiritual growth, and mindset transformation. Practical guides rooted in Nikola Tesla's sacred numbers.",
  metadataBase: new URL("https://www.slimora.living"),
  openGraph: {
    siteName: "Slimora Living",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@SlimoraLiving",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "t5rc38o4F5-ROhtYMCdS5GypAAKDwi3Qdpx3TYmw4Jw",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();

  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="bg-bg-custom antialiased">
        <Header categories={categories} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}