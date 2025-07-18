import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Calendar,
  Users,
  CheckCircle,
} from "lucide-react";
import { jobsService } from "@/lib/jobs";
import { formatSalary, formatDate } from "@/lib/utils";
import Image from "next/image";
import ApplyButton from "@/components/ApplyButton";
import Breadcrumbs from "@/components/Breadcrumbs";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const slug = await params.slug;
  const job = await jobsService.getJobById(slug);
  if (!job) return {};
  const url = `https://talentflight.com/job/${slug}`;
  return {
    title: `${job.title} at ${job.company} | TalentFlight`,
    description:
      job.description?.replace(/<[^>]+>/g, "").slice(0, 160) ||
      "Job opportunity at TalentFlight",
    keywords: [job.title, job.company, job.location, ...(job.tags || [])].join(
      ", "
    ),
    alternates: { canonical: url },
    openGraph: {
      title: `${job.title} at ${job.company} | TalentFlight`,
      description: job.description?.replace(/<[^>]+>/g, "").slice(0, 160) || "",
      url,
      siteName: "TalentFlight",
      images: job.companyLogo
        ? [
            {
              url: job.companyLogo,
              width: 400,
              height: 400,
              alt: `${job.company} logo`,
            },
          ]
        : [],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${job.title} at ${job.company} | TalentFlight`,
      description: job.description?.replace(/<[^>]+>/g, "").slice(0, 160) || "",
      images: job.companyLogo ? [job.companyLogo] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default async function JobPage({ params }: any) {
  const slug = await params.slug;
  const job = await jobsService.getJobById(slug);
  if (!job) {
    notFound();
  }

  const getExperienceColor = (experience?: string) => {
    const colors = {
      entry: "bg-green-100 text-green-800",
      junior: "bg-blue-100 text-blue-800",
      mid: "bg-yellow-100 text-yellow-800",
      senior: "bg-purple-100 text-purple-800",
      lead: "bg-orange-100 text-orange-800",
      executive: "bg-red-100 text-red-800",
    };
    if (!experience) return "bg-gray-100 text-gray-800";
    return (
      colors[experience as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const getTypeColor = (type: string) => {
    const colors = {
      "full-time": "bg-[#0476D9] text-white",
      "part-time": "bg-[#0487D9] text-white",
      contract: "bg-[#011640] text-white",
      internship: "bg-[#010D26] text-white",
      freelance: "bg-[#00070D] text-white",
    };
    return colors[type as keyof typeof colors] || "bg-gray-500 text-white";
  };

  // Schema.org JobPosting JSON-LD
  const jobPosting = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description?.replace(/<[^>]+>/g, ""),
    datePosted: job.createdAt,
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
        addressCountry: "BR", // ajuste se necessário
      },
    },
    baseSalary: job.salary
      ? {
          "@type": "MonetaryAmount",
          currency: job.salary.currency || "USD",
          value: {
            "@type": "QuantitativeValue",
            minValue: job.salary.min,
            maxValue: job.salary.max,
            unitText: job.salary.period?.toUpperCase() || "YEAR",
          },
        }
      : undefined,
    directApply: true,
    identifier: job.id,
    url: `https://talentflight.com/job/${slug}`,
    skills: job.tags,
    industry: job.category,
    experienceRequirements: job.experience,
    qualifications: job.requirements?.join(", "),
    incentives: job.benefits?.join(", "),
    remote: job.isRemote,
  };

  return (
    <>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPosting) }}
        />
      </head>
      <div className="min-h-screen bg-[#F3F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: "Jobs", href: "/jobs" },
              { label: `${job.title} at ${job.company}` },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Job Header */}
              <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm animate-fade-in">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      {job.companyLogo ? (
                        <Image
                          width={64}
                          height={64}
                          src={job.companyLogo}
                          alt={`${job.company} logo`}
                          className="w-16 h-16 rounded-xl object-cover border border-[#E5EAF1] bg-white"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                          <Building2 className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h1 className="text-3xl font-bold text-[#011640] mb-2">
                          {job.title}
                        </h1>
                        <p className="text-xl text-[#0476D9] font-medium">
                          {job.company}
                        </p>
                      </div>
                    </div>

                    {/* Job Meta */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-[#010D26]">
                        <MapPin className="w-5 h-5 text-[#0476D9]" />
                        <span>{job.location}</span>
                        {job.isRemote && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Remote
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[#010D26]">
                        <Clock className="w-5 h-5 text-[#0476D9]" />
                        <span className="capitalize">
                          {job.type.replace("-", " ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[#010D26]">
                        <DollarSign className="w-5 h-5 text-[#0476D9]" />
                        <span className="font-medium">
                          {formatSalary(job.salary)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[#010D26]">
                        <Calendar className="w-5 h-5 text-[#0476D9]" />
                        <span>Posted {formatDate(job.createdAt)}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span
                        className={`text-sm font-medium px-3 py-1 rounded-full ${getExperienceColor(
                          job.experience
                        )}`}
                      >
                        {job.experience
                          ? job.experience.charAt(0).toUpperCase() +
                            job.experience.slice(1)
                          : "N/A"}
                      </span>
                      <span
                        className={`text-sm font-medium px-3 py-1 rounded-full ${getTypeColor(
                          job.type
                        )}`}
                      >
                        {job.type.replace("-", " ")}
                      </span>
                      {job.isFeatured && (
                        <span className="bg-gradient-to-r from-[#0476D9] to-[#0487D9] text-white text-sm font-medium px-3 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2">
                      {(job.tags ?? []).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-[#F3F7FA] text-[#0476D9] text-sm px-3 py-1 rounded-full border border-[#E5EAF1]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm animate-slide-in-left">
                <h2 className="text-2xl font-bold text-[#011640] mb-6">
                  Job Description
                </h2>
                <div
                  className="prose prose-lg max-w-none text-[#010D26] leading-relaxed mb-6"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
                
                {/* Disclaimer */}
                <div className="mt-8 pt-6 border-t border-[#E5EAF1]">
                  <div className="bg-[#F3F7FA] rounded-lg p-4 border border-[#E5EAF1]">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-[#0476D9] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#011640] mb-1">
                          Job Post Disclaimer
                        </h4>
                        <p className="text-xs text-[#011640]/80 leading-relaxed">
                          This job post was curated and rewritten by Talent Flight to improve clarity and visibility. 
                          The original listing belongs to the hiring company or its representatives. 
                          All applications are redirected to the official source.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm animate-slide-in-left">
                  <h2 className="text-2xl font-bold text-[#011640] mb-6">
                    Requirements
                  </h2>
                  <ul className="space-y-3">
                    {job.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[#0476D9] mt-0.5 flex-shrink-0" />
                        <span className="text-[#010D26]">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <div className="bg-white rounded-2xl p-8 shadow-sm animate-slide-in-left">
                  <h2 className="text-2xl font-bold text-[#011640] mb-6">
                    Benefits
                  </h2>
                  <ul className="space-y-3">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#0476D9] rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-[#010D26]">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Apply Button */}
                <div className="bg-white rounded-2xl p-6 shadow-sm animate-scale-in">
                  <h3 className="text-lg font-semibold text-[#011640] mb-4">
                    Apply for this position
                  </h3>

                  <ApplyButton
                    jobId={job.id}
                    applicationUrl={job.applicationUrl || ""}
                    jobTitle={job.title}
                    company={job.company}
                    className="w-full mb-4"
                    size="lg"
                  />
                  <p className="text-sm text-[#010D26] text-center">
                    You&apos;ll be redirected to the company&apos;s application
                    page
                  </p>
                </div>

                {/* Company Info */}
                <div
                  className="bg-white rounded-2xl p-6 shadow-sm animate-scale-in"
                  style={{ animationDelay: "0.1s" }}
                >
                  <h3 className="text-lg font-semibold text-[#011640] mb-4">
                    About {job.company}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#010D26]">
                      <Building2 className="w-4 h-4 text-[#0476D9]" />
                      <span className="text-sm">{job.company}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#010D26]">
                      <MapPin className="w-4 h-4 text-[#0476D9]" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                    {job.isRemote && (
                      <div className="flex items-center gap-2 text-[#010D26]">
                        <Users className="w-4 h-4 text-[#0476D9]" />
                        <span className="text-sm">Remote-friendly</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Job Summary */}
                <div
                  className="bg-white rounded-2xl p-6 shadow-sm animate-scale-in"
                  style={{ animationDelay: "0.2s" }}
                >
                  <h3 className="text-lg font-semibold text-[#011640] mb-4">
                    Job Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[#010D26]">Experience:</span>
                      <span className="font-medium text-[#0476D9] capitalize">
                        {job.experience ? job.experience : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#010D26]">Type:</span>
                      <span className="font-medium text-[#0476D9] capitalize">
                        {job.type.replace("-", " ")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#010D26]">Category:</span>
                      <span className="font-medium text-[#0476D9] capitalize">
                        {job.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#010D26]">Salary:</span>
                      <span className="font-medium text-[#0476D9]">
                        {formatSalary(job.salary)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
