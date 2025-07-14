import {
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Calendar,
  ExternalLink,
  Users,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { Job } from "@/types/job";
import { formatSalary, formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import Image from "next/image";

export default function JobPagePreview({
  job,
  onBack,
}: {
  job: Job;
  onBack?: () => void;
}) {
  const getExperienceColor = (experience?: string) => {
    const colors = {
      intern: "bg-green-100 text-green-800",
      junior: "bg-blue-100 text-blue-800",
      "junior-mid": "bg-cyan-100 text-cyan-800",
      mid: "bg-yellow-100 text-yellow-800",
      "mid-senior": "bg-orange-100 text-orange-800",
      senior: "bg-purple-100 text-purple-800",
      between: "bg-gray-100 text-gray-800",
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

  return (
    <div className="bg-[#F3F7FA] rounded-2xl p-4">
      <div className="max-w-4xl mx-auto px-2 py-6">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center text-[#0476D9] hover:text-[#011640] transition-colors font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm animate-fade-in">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    {job.companyLogo && (
                      <Image
                        width={64}
                        height={64}
                        src={job.companyLogo}
                        alt={`${job.company} logo`}
                        className="w-16 h-16 rounded-xl object-cover border border-[#E5EAF1]"
                      />
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
              <div className="prose prose-lg max-w-none text-[#010D26] leading-relaxed mb-6">
                <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                  {job.description}
                </ReactMarkdown>
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
                <Button
                  href={job.applicationUrl}
                  className="w-full mb-4"
                  size="lg"
                >
                  Apply Now
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
                <p className="text-sm text-[#010D26] text-center">
                  You&apos;ll be redirected to the company&apos;s application page
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
  );
}
