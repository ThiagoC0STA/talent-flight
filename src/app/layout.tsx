import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";
import GoogleAnalytics from "./google-analytics";

import Schema from "./schema";


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
  keywords: "jobs, careers, talent, opportunities, professional growth, recruitment, hiring",
  authors: [{ name: "TalentFlight" }],
  creator: "TalentFlight",
  publisher: "TalentFlight",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://talentflight.com"),
  alternates: {
    canonical: "/",
  },
      openGraph: {
      title: "TalentFlight - Your talent, ready for takeoff",
      description:
        "Connect with exciting job opportunities. Your launchpad for professional growth.",
      url: "https://talentflight.com",
      siteName: "TalentFlight",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "TalentFlight - Professional opportunities platform",
        },
      ],
      locale: "en_US",
      type: "website",
    },
      twitter: {
      card: "summary_large_image",
      title: "TalentFlight - Your talent, ready for takeoff",
      description:
        "Connect with exciting job opportunities. Your launchpad for professional growth.",
      images: ["/og-image.jpg"],
    },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0476D9" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TalentFlight" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
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
        <GoogleAnalytics />
        <Schema />
      </body>
    </html>
  );
}
