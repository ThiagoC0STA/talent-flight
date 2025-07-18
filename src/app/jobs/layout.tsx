import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Opportunities - Find Your Next Career Move | TalentFlight",
  description: "Discover thousands of job opportunities and find the perfect match for your career goals. From startups to Fortune 500 companies. Search remote jobs, tech careers, and professional opportunities.",
  keywords: "jobs, career opportunities, employment, remote jobs, tech jobs, software developer jobs, frontend developer, backend developer, fullstack developer, IT careers, programming jobs, remote work, tech careers, job search, career growth, recruitment, hiring",
  openGraph: {
    title: "Job Opportunities - Find Your Next Career Move | TalentFlight",
    description: "Discover thousands of job opportunities and find the perfect match for your career goals. From startups to Fortune 500 companies.",
    url: "https://talentflight.com/jobs",
    siteName: "TalentFlight",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TalentFlight Jobs - Professional opportunities platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Job Opportunities - Find Your Next Career Move | TalentFlight",
    description: "Discover thousands of job opportunities and find the perfect match for your career goals. From startups to Fortune 500 companies.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://talentflight.com/jobs",
  },
};

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 