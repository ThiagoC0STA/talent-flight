import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Find Jobs - TalentFlight",
  description: "Discover thousands of job opportunities and find the perfect match for your career goals. Search by location, category, and experience level.",
  keywords: "jobs, careers, opportunities, employment, hiring, recruitment, job search",
  openGraph: {
    title: "Find Jobs - TalentFlight",
    description: "Discover thousands of job opportunities and find the perfect match for your career goals.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Jobs - TalentFlight",
    description: "Discover thousands of job opportunities and find the perfect match for your career goals.",
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