import { Metadata } from "next";
import { notFound } from "next/navigation";
import { jobsService } from "@/lib/jobs";
import JobPagePreview from "@/components/JobPagePreview";

interface JobPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const job = await jobsService.getJobById(params.slug);
  
  if (!job) {
    return {
      title: "Job Not Found - TalentFlight",
      description: "The requested job opportunity could not be found.",
    };
  }

  const title = `${job.title} at ${job.company} - ${job.location} | TalentFlight`;
  const description = `${job.title} position at ${job.company} in ${job.location}. ${job.description.substring(0, 150)}...`;
  
  return {
    title,
    description,
    keywords: `${job.title}, ${job.company}, ${job.location}, ${job.type}, ${job.category}, ${job.experience}, jobs, careers, employment`,
    openGraph: {
      title,
      description,
      url: `https://talentflight.com/job/${params.slug}`,
      siteName: "TalentFlight",
      images: [
        {
          url: job.companyLogo || "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${job.title} at ${job.company}`,
        },
      ],
      locale: "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [job.companyLogo || "/og-image.jpg"],
    },
    alternates: {
      canonical: `https://talentflight.com/job/${params.slug}`,
    },
  };
}

export default async function JobPage({ params }: JobPageProps) {
  const job = await jobsService.getJobById(params.slug);

  if (!job) {
    notFound();
  }

  return <JobPagePreview job={job} />;
}
