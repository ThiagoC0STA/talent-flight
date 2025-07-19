"use client";

import {
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Star,
  Users,
  Zap,
  Award,
  Heart,
  Share2,
  Earth,
} from "lucide-react";
import { useState } from "react";
import { Job } from "@/types/job";
import { formatSalary, formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";

interface JobMainContentProps {
  job: Job;
  onModalOpen: () => void;
}

export default function JobMainContent({
  job,
  onModalOpen,
}: JobMainContentProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  console.log(job);

  const getExperienceColor = (experience?: string) => {
    const colors = {
      intern: "bg-gradient-to-r from-green-400 to-emerald-500 text-white",
      junior: "bg-gradient-to-r from-blue-400 to-cyan-500 text-white",
      "junior-mid": "bg-gradient-to-r from-cyan-400 to-teal-500 text-white",
      mid: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white",
      "mid-senior": "bg-gradient-to-r from-orange-400 to-red-500 text-white",
      senior: "bg-gradient-to-r from-purple-400 to-pink-500 text-white",
      between: "bg-gradient-to-r from-gray-400 to-slate-500 text-white",
    };
    if (!experience)
      return "bg-gradient-to-r from-gray-400 to-slate-500 text-white";
    return (
      colors[experience as keyof typeof colors] ||
      "bg-gradient-to-r from-gray-400 to-slate-500 text-white"
    );
  };

  const getTypeColor = (type: string) => {
    const colors = {
      "full-time": "bg-gradient-to-r from-[#0476D9] to-[#0487D9] text-white",
      "part-time": "bg-gradient-to-r from-[#0487D9] to-[#0498D9] text-white",
      contract: "bg-gradient-to-r from-[#011640] to-[#012640] text-white",
      internship: "bg-gradient-to-r from-[#010D26] to-[#011D26] text-white",
      freelance: "bg-gradient-to-r from-[#00070D] to-[#00170D] text-white",
    };
    return (
      colors[type as keyof typeof colors] ||
      "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
    );
  };

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Hero Section with Enhanced Design */}
      <div className="relative overflow-hidden bg-gradient-to-br rounded-3xl p-6 sm:p-8 shadow bg-white border border-blue-100/50">
        {/* Background Pattern */}

        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Company Logo with Enhanced Styling */}

            <div className="flex-1 space-y-4">
              {/* Title and Company */}

              <div className="space-y-2 flex items-center gap-4">
                {job.companyLogo && (
                  <div className="relative group w-32">
                    <Image
                      width={80}
                      height={80}
                      src={job.companyLogo}
                      alt={`${job.company} logo`}
                      className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl object-cover border-2 border-white/20  group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#011640] via-[#0476D9] to-[#011640] bg-clip-text text-transparent">
                    {job.title}
                  </h1>
                  <div className="flex items-center gap-3">
                    <p className="text-xl sm:text-2xl text-[#0476D9] font-semibold">
                      {job.company}
                    </p>
                    {job.isFeatured && (
                      <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        <Star className="w-4 h-4" />
                        Featured
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/80 transition-all duration-300 group">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-[#011640]">{job.location}</p>
                    {job.isRemote && (
                      <span className="inline-block mt-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        <Earth className="w-4 h-4" /> Remote
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/80 transition-all duration-300 group">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-medium text-[#011640] capitalize">
                      {job.type.replace("-", " ")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/80 transition-all duration-300 group">
                  <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg text-white">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Salary</p>
                    <p className="font-medium text-[#011640]">
                      {formatSalary(job.salary)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/80 transition-all duration-300 group">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Posted</p>
                    <p className="font-medium text-[#011640]">
                      {formatDate(job.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Enhanced Tags */}
              <div className="flex flex-wrap gap-3">
                <span
                  className={`text-sm font-medium px-4 py-2 rounded-full shadow bg-gray-100`}
                >
                  {job.experience
                    ? job.experience.charAt(0).toUpperCase() +
                      job.experience.slice(1)
                    : "N/A"}
                </span>
                <span
                  className={`text-sm font-medium px-4 py-2 rounded-full shadow-lg ${getTypeColor(
                    job.type
                  )}`}
                >
                  {job.type.replace("-", " ")}
                </span>
                {job.isFeatured && (
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg">
                    ⭐ Featured
                  </span>
                )}
              </div>

              {/* Enhanced Skills */}
              {/* {job.tags && job.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 text-[#0476D9] text-sm px-3 py-1.5 rounded-full border border-blue-200/50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>

      {/* Job Description with Enhanced Design */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#011640] to-[#0476D9] bg-clip-text text-transparent">
            Job Description
          </h2>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-full transition-all duration-300">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div
            className={`prose prose-lg max-w-none text-[#010D26] leading-relaxed transition-all duration-500 ${
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
                className="space-y-4"
              />
            ) : (
              <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                {job.description}
              </ReactMarkdown>
            )}
          </div>

          {!isDescriptionExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none"></div>
          )}
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#0476D9] to-[#0487D9] text-white px-6 py-3 rounded-full font-medium hover:from-[#0487D9] hover:to-[#0498D9] transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {isDescriptionExpanded ? (
              <>
                <ChevronUp className="w-5 h-5" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-5 h-5" />
                Show More
              </>
            )}
          </button>
        </div>
      </div>

      {/* Requirements with Enhanced Design */}
      {job.requirements && job.requirements.length > 0 && (
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-blue-100/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#011640]">
              Requirements
            </h2>
          </div>
          <ul className="space-y-4">
            {job.requirements.map((requirement, index) => (
              <li
                key={index}
                className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 hover:bg-white/80 transition-all duration-300 group"
              >
                <div className="p-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg text-white mt-1 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-[#010D26] text-base leading-relaxed">
                  {requirement}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Benefits with Enhanced Design */}
      {job.benefits && job.benefits.length > 0 && (
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-purple-100/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#011640]">
              Benefits
            </h2>
          </div>
          <ul className="space-y-4">
            {job.benefits.map((benefit, index) => (
              <li
                key={index}
                className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 hover:bg-white/80 transition-all duration-300 group"
              >
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2 group-hover:scale-125 transition-transform duration-300"></div>
                <span className="text-[#010D26] text-base leading-relaxed">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Enhanced Apply Now Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0476D9] via-[#0487D9] to-[#011640] rounded-3xl p-8 py-10 text-white shadow-2xl">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white/10 to-transparent rounded-full translate-y-24 -translate-x-24"></div>

        <div className="relative text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h2 className="text-4xl sm:text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Ready to Join the Team?
            </h2>
          </div>

          <div className="flex items-center justify-center gap-6 mb-8 text-blue-100">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>Great Team</span>
            </div>
            <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span>Fast Growth</span>
            </div>
            <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span>Amazing Benefits</span>
            </div>
          </div>

          <p className="text-md mb-10 text-blue-100 leading-relaxed max-w-3xl mx-auto">
            Take the next step in your career and help{" "}
            <span className="font-semibold text-white">{job.company}</span>{" "}
            build amazing products that impact millions of users worldwide.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center cursor-pointer">
            <Button
              onClick={() => {
                onModalOpen();
                window.open(job.applicationUrl, "_blank");
              }}
              className="bg-gradient-to-r cursor-pointer px-10 py-5 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-2 border-white/20"
              size="lg"
            >
              🚀 Apply Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
