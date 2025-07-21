import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";
import GoogleAnalytics from "./google-analytics";
import { SpeedInsights } from "@vercel/speed-insights/next";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

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
  title:
    "TalentFlight - Find Remote Jobs & Tech Careers | Your Launchpad for Professional Growth",
  description:
    "Discover thousands of remote jobs, tech careers, and professional opportunities. Connect with top companies worldwide. Find your next career move with TalentFlight - the premier job board for tech professionals.",
  keywords:
    "remote jobs, tech jobs, software developer jobs, frontend developer, backend developer, fullstack developer, IT careers, programming jobs, remote work, tech careers, job search, career opportunities, professional growth, recruitment, hiring, software engineering, web development, mobile development, data science, AI jobs",
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
    title:
      "TalentFlight - Find Remote Jobs & Tech Careers | Professional Growth Platform",
    description:
      "Discover thousands of remote jobs, tech careers, and professional opportunities. Connect with top companies worldwide. Your launchpad for professional growth.",
    url: "https://talentflight.com",
    siteName: "TalentFlight",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TalentFlight - Professional job opportunities and tech careers platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TalentFlight - Find Remote Jobs & Tech Careers",
    description:
      "Discover thousands of remote jobs, tech careers, and professional opportunities. Connect with top companies worldwide.",
    images: ["/og-image.jpg"],
    creator: "@talentflight",
    site: "@talentflight",
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
    google: "_zc-27B2bkWXm3QIa7swdtQDs4wg8FuxGy9ivllGH_Y", // https://search.google.com/search-console
  },
  category: "business",
  classification: "job board, career platform, tech jobs",
  other: {
    "google-site-verification": "_zc-27B2bkWXm3QIa7swdtQDs4wg8FuxGy9ivllGH_Y", // Mesmo código do Google
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
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icon-152x152.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="TalentFlight" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="format-detection" content="telephone=no" />

        {/* SEO Meta Tags */}
        <meta name="author" content="TalentFlight" />
        <meta name="copyright" content="TalentFlight" />
        <meta name="language" content="en" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="coverage" content="worldwide" />
        <meta name="target" content="all" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="MobileOptimized" content="width" />

        {/* Social Media Meta Tags */}
        <meta property="og:site_name" content="TalentFlight" />
        <meta property="og:type" content="website" />
        <meta name="twitter:site" content="@talentflight" />
        <meta name="twitter:creator" content="@talentflight" />

        {/* AdSense */}
        <meta name="google-adsense-account" content="ca-pub-7894980089417601" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7894980089417601"
          crossOrigin="anonymous"
        />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
      </head>
      <body className="font-sans antialiased bg-white">
        <Header />
        {children}
        <Footer />
        <PWAInstallPrompt />
        <Analytics />
        <GoogleAnalytics />
        <Schema />
        <SpeedInsights />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                  })
                  .then(function(registration) {
                    console.log('SW registered successfully: ', registration);
                  })
                  .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
                });
              }
              
              // PWA Install prompt
              let deferredPrompt;
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                console.log('PWA install prompt ready');
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
