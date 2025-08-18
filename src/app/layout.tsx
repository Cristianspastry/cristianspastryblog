import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity";
import { SpeedInsights } from "@vercel/speed-insights/next"
// Wrapper per evitare warning di props non riconosciute
const VisualEditingWrapper = () => {
  return <VisualEditing />;
};
import { SanityLive } from "@/sanity/lib/live";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Cristian's Pastry - Dolci Artigianali",
  description: "Scopri ricette di dolci artigianali, tecniche di pasticceria e la passione per i dolci fatti in casa.",
  keywords: ["dolci", "pasticceria", "ricette", "torte", "biscotti", "artigianale"],
  authors: [{ name: "Cristian's Pastry" }],
  openGraph: {
    title: "Cristian's Pastry - Dolci Artigianali",
    description: "Scopri ricette di dolci artigianali, tecniche di pasticceria e la passione per i dolci fatti in casa.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
    <html lang="it">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <meta name="google-site-verification" content="dUN8G5y3wcV9cFpWBe-iwKYreuiJriXxL53A_PzhyLk" />
        <meta name="google-adsense-account" content="ca-pub-9041998535543330"/>
      </head>
      <body className={`${inter.variable} ${playfair.variable} bg-gray-50 text-gray-900`}>
       <SpeedInsights/>
        <main className="min-h-screen">
          {children}
          <SanityLive />
          {(await draftMode()).isEnabled && <VisualEditingWrapper />}
        </main>
      </body>
    </html>
  );
}
