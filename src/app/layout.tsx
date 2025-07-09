import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TalentFlight - Your talent, ready for takeoff",
  description:
    "Connect with exciting job opportunities. Your launchpad for professional growth.",
  keywords: "jobs, careers, talent, opportunities, professional growth",
  openGraph: {
    title: "TalentFlight - Your talent, ready for takeoff",
    description:
      "Connect with exciting job opportunities. Your launchpad for professional growth.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7894980089417601"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased bg-white">
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
