import { Job } from "@/types/job";

interface JobStructuredDataProps {
  job: Job;
}

export default function JobStructuredData({ job }: JobStructuredDataProps) {
  const jobPosting = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description?.replace(/<[^>]+>/g, ""),
    datePosted: job.createdAt,
    validThrough: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    employmentType: job.type?.replace(/-/g, " "),
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
      logo: job.companyLogo || undefined,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: "US", // Default, can be made dynamic
      },
    },
    ...(job.salary && {
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: job.salary.currency || "USD",
        value: {
          "@type": "QuantitativeValue",
          minValue: job.salary.min,
          maxValue: job.salary.max,
          unitText: job.salary.period?.toUpperCase() || "YEAR",
        },
      },
    }),
    directApply: true,
    identifier: job.id,
    url: `https://talentflight.com/job/${job.id}`,
    ...(job.tags && job.tags.length > 0 && {
      skills: job.tags.join(", "),
    }),
    industry: job.category,
    experienceRequirements: job.experience,
    ...(job.requirements && job.requirements.length > 0 && {
      qualifications: job.requirements.join(", "),
    }),
    ...(job.benefits && job.benefits.length > 0 && {
      incentives: job.benefits.join(", "),
    }),
    ...(job.isRemote && {
      jobLocationType: "TELECOMMUTE",
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPosting) }}
    />
  );
} 