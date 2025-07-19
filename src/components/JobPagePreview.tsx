"use client";

import {
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  CheckCircle,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Job } from "@/types/job";
import { formatSalary, formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
import NewsletterSignup from "./NewsletterSignup";
import RelatedJobs from "./RelatedJobs";
import RelatedJobsSidebar from "./RelatedJobsSidebar";
import RelatedJobsModal from "./RelatedJobsModal";

export default function JobPagePreview({
  job,
  onBack,
  relatedJobs = [],
}: {
  job: Job;
  onBack?: () => void;
  relatedJobs?: Job[];
}) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    <div className="bg-[#F3F7FA] rounded-2xl p-2 sm:p-4">
      <div className="max-w-[1180px] mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center text-[#0476D9] hover:text-[#011640] transition-colors font-medium mb-4 sm:mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8 shadow-sm animate-fade-in">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                    {job.companyLogo && (
                      <Image
                        width={64}
                        height={64}
                        src={job.companyLogo}
                        alt={`${job.company} logo`}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover border border-[#E5EAF1] self-start sm:self-center"
                      />
                    )}
                    <div className="flex-1">
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#011640] mb-2">
                        {job.title}
                      </h1>
                      <p className="text-lg sm:text-xl text-[#0476D9] font-medium">
                        {job.company}
                      </p>
                    </div>
                  </div>
                  {/* Job Meta */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 text-[#010D26] text-sm sm:text-base">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#0476D9] flex-shrink-0" />
                      <span className="truncate">{job.location}</span>
                      {job.isRemote && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex-shrink-0">
                          Remote
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[#010D26] text-sm sm:text-base">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#0476D9] flex-shrink-0" />
                      <span className="capitalize">
                        {job.type.replace("-", " ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[#010D26] text-sm sm:text-base">
                      <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-[#0476D9] flex-shrink-0" />
                      <span className="font-medium">
                        {formatSalary(job.salary)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[#010D26] text-sm sm:text-base">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#0476D9] flex-shrink-0" />
                      <span>Posted {formatDate(job.createdAt)}</span>
                    </div>
                  </div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                    <span
                      className={`text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full ${getExperienceColor(
                        job.experience
                      )}`}
                    >
                      {job.experience
                        ? job.experience.charAt(0).toUpperCase() +
                          job.experience.slice(1)
                        : "N/A"}
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full ${getTypeColor(
                        job.type
                      )}`}
                    >
                      {job.type.replace("-", " ")}
                    </span>
                    {job.isFeatured && (
                      <span className="bg-gradient-to-r from-[#0476D9] to-[#0487D9] text-white text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  {/* Skills */}
                  {job.tags && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {(job.tags ?? []).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-[#F3F7FA] text-[#0476D9] text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full border border-[#E5EAF1]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Job Description */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8 shadow-sm animate-slide-in-left">
              <h2 className="text-xl sm:text-2xl font-bold text-[#011640] mb-4 sm:mb-6">
                Job Description
              </h2>

              <div className="relative">
                <div
                  className={`prose prose-sm sm:prose-base lg:prose-lg max-w-none text-[#010D26] leading-relaxed transition-all duration-300 ${
                    isDescriptionExpanded
                      ? "max-h-none"
                      : "max-h-[600px] overflow-hidden"
                  }`}
                >
                  {job.description.includes("<") ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(job.description),
                      }}
                    />
                  ) : (
                    <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                      {job.description}
                    </ReactMarkdown>
                  )}
                </div>

                {!isDescriptionExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                )}
              </div>

              <div className="flex justify-center mt-4">
                <button
                  onClick={() =>
                    setIsDescriptionExpanded(!isDescriptionExpanded)
                  }
                  className="flex items-center gap-2 text-[#0476D9] hover:text-[#011640] transition-colors font-medium text-sm px-4 py-2 rounded-lg hover:bg-[#F3F7FA]"
                >
                  {isDescriptionExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Show More
                    </>
                  )}
                </button>
              </div>
            </div>
            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8 shadow-sm animate-slide-in-left">
                <h2 className="text-xl sm:text-2xl font-bold text-[#011640] mb-4 sm:mb-6">
                  Requirements
                </h2>
                <ul className="space-y-2 sm:space-y-3">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#0476D9] mt-0.5 flex-shrink-0" />
                      <span className="text-[#010D26] text-sm sm:text-base">
                        {requirement}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm animate-slide-in-left">
                <h2 className="text-xl sm:text-2xl font-bold text-[#011640] mb-4 sm:mb-6">
                  Benefits
                </h2>
                <ul className="space-y-2 sm:space-y-3">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 sm:gap-3">
                      <div className="w-2 h-2 bg-[#0476D9] rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-[#010D26] text-sm sm:text-base">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Apply Now Section */}
            <div className="bg-gradient-to-br from-[#0476D9] via-[#0487D9] to-[#011640] rounded-3xl p-8 lg:p-8 text-white shadow-2xl animate-fade-in">
              <div className="text-center max-w-3xl mx-auto">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <TrendingUp className="w-8 h-8" />
                  <h2 className="text-3xl font-bold">
                    Ready to Join the Team?
                  </h2>
                </div>
                <p className="text-blue-100 mb-8 text-base leading-relaxed">
                  Take the next step in your career and help {job.company} build
                  amazing products that impact millions of users worldwide.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => {
                      setIsModalOpen(true);
                      window.open(job.applicationUrl, "_blank");
                    }}
                    className="bg-white text-[#0476D9] cursor-pointer hover:bg-blue-50 px-8 py-4 text-base font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    size="lg"
                  >
                    🚀 Apply Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-4 sm:space-y-6">
              {/* Newsletter */}

              {/* Related Jobs Sidebar */}
              <RelatedJobsSidebar relatedJobs={relatedJobs} />

              <NewsletterSignup />
            </div>
          </div>
        </div>

        {/* Related Jobs Carousel - Only show if not in sidebar */}
        {relatedJobs.length > 0 && <RelatedJobs relatedJobs={relatedJobs} />}
      </div>

      {/* Related Jobs Modal */}
      <RelatedJobsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        relatedJobs={relatedJobs}
        currentJob={job}
      />
    </div>
  );
}
