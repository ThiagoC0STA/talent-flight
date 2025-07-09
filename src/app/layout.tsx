import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
      <body className="font-sans antialiased bg-white">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
