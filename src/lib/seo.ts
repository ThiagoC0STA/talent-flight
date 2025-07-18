import { Metadata } from "next";

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

export function generateSEO(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords,
    image = "/og-image.jpg",
    url,
    type = "website",
    publishedTime,
    modifiedTime,
    author = "TalentFlight",
  } = config;

  const fullTitle = title.includes("TalentFlight")
    ? title
    : `${title} | TalentFlight`;
  const fullUrl = url
    ? `https://talentflight.com${url}`
    : "https://talentflight.com";

  return {
    title: fullTitle,
    description,
    keywords:
      keywords ||
      "jobs, careers, opportunities, professional growth, recruitment, hiring, remote jobs, tech jobs",
    authors: [{ name: author }],
    creator: author,
    publisher: "TalentFlight",
    metadataBase: new URL("https://talentflight.com"),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: "TalentFlight",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: "en_US",
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
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
  };
}

export function generateJobSEO(job: any, slug: string) {
  const title = `${job.title} at ${job.company} - ${job.location}`;
  const description = `${job.title} position at ${job.company} in ${
    job.location
  }. ${job.description?.substring(0, 150)}...`;

  return generateSEO({
    title,
    description,
    keywords: `${job.title}, ${job.company}, ${job.location}, ${job.type}, ${job.category}, ${job.experience}, jobs, careers, employment`,
    url: `/job/${slug}`,
    type: "article",
    publishedTime: job.createdAt,
    modifiedTime: job.updatedAt,
  });
}

export function generateJobsListSEO() {
  const title = "Job Opportunities - Find Your Next Career Move";
  const description =
    "Discover thousands of job opportunities and find the perfect match for your career goals. From startups to Fortune 500 companies.";

  return generateSEO({
    title,
    description,
    keywords:
      "jobs, career opportunities, employment, remote jobs, tech jobs, software developer jobs, frontend developer, backend developer, fullstack developer, IT careers, programming jobs, remote work, tech careers, job search, career growth, recruitment, hiring",
    url: "/jobs",
  });
}

export function generateHomeSEO() {
  return generateSEO({
    title:
      "Find Remote Jobs & Tech Careers | Your Launchpad for Professional Growth",
    description:
      "Discover thousands of remote jobs, tech careers, and professional opportunities. Connect with top companies worldwide. Find your next career move with TalentFlight - the premier job board for tech professionals.",
    keywords:
      "remote jobs, tech jobs, software developer jobs, frontend developer, backend developer, fullstack developer, IT careers, programming jobs, remote work, tech careers, job search, career opportunities, professional growth, recruitment, hiring, software engineering, web development, mobile development, data science, AI jobs",
    url: "/",
  });
}
