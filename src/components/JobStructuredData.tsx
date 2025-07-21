import { Job } from "@/types/job";

interface JobStructuredDataProps {
  job: Job;
}

export default function JobStructuredData({ job }: JobStructuredDataProps) {
  // Função para limpar HTML
  const cleanDescription = job.description
    ?.replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&amp;/g, '&') // Decodifica entidades HTML
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ') // Remove espaços extras
    .trim() || '';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": cleanDescription,
    "datePosted": job.createdAt,
    "validThrough": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    "employmentType": job.type?.toUpperCase() || "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company,
      "logo": job.companyLogo || "https://talentflight.com/logo.png",
      "sameAs": `https://linkedin.com/company/${job.company.toLowerCase().replace(/\s+/g, '-')}`
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location,
        "addressCountry": "US"
      }
    },
    ...(job.salary && {
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": job.salary.currency || "USD",
        "value": {
          "@type": "QuantitativeValue",
          "minValue": job.salary.min,
          "maxValue": job.salary.max,
          "unitText": job.salary.period?.toUpperCase() || "YEAR"
        }
      }
    }),
    "qualifications": job.requirements?.join(", ") || "Experience in relevant field",
    "responsibilities": job.description.substring(0, 500),
    "benefits": job.benefits?.join(", ") || "Competitive benefits package",
    "jobBenefits": job.benefits || ["Health insurance", "401k", "Remote work"],
    "workHours": "40 hours per week",
    "applicationContact": {
      "@type": "ContactPoint",
      "contactType": "application",
      "url": job.applicationUrl
    },
    "directApply": true,
    "identifier": {
      "@type": "PropertyValue",
      "name": "TalentFlight Job ID",
      "value": job.id
    },
    "industry": job.category,
    "experienceLevel": job.experience,
    "remoteJob": job.isRemote,
    "featuredJob": job.isFeatured,
    "url": `https://talentflight.com/job/${job.slug}`,
    "sameAs": [
      `https://talentflight.com/job/${job.slug}`,
      job.applicationUrl
    ].filter(Boolean)
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
} 