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
  Share2,
  Earth,
  Home,
  Briefcase,
} from "lucide-react";
import { useState } from "react";
import { Job } from "@/types/job";
import { formatSalary, formatDate } from "@/lib/utils";
import ApplyButton from "@/components/ApplyButton";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";

interface JobMainContentProps {
  job: Job;
  onModalOpen: () => void;
}

export default function JobMainContent({
  job,
  onModalOpen,
}: JobMainContentProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showShareFeedback, setShowShareFeedback] = useState(false);

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

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowShareFeedback(true);
      setTimeout(() => setShowShareFeedback(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar link:", error);
    }
  };

  return (
    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
      {/* Breadcrumbs Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
        <Link
          href="/"
          className="flex items-center hover:text-[#0476D9] transition-colors"
        >
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <span className="text-gray-400">/</span>
        <Link
          href="/jobs"
          className="flex items-center hover:text-[#0476D9] transition-colors"
        >
          <Briefcase className="w-4 h-4 mr-1" />
          Jobs
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium truncate">{job.title}</span>
      </nav>
      {/* Hero Section with Enhanced Design */}
      <div className="relative overflow-hidden bg-gradient-to-br rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm bg-white">
        {/* Background Pattern */}

        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-start gap-4 sm:gap-6">
            <div className="flex-1 space-y-3 sm:space-y-4">
              {/* Title and Company */}
              <div className="space-y-2 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                {job.companyLogo && (
                  <div className="relative group">
                    <Image
                      width={80}
                      height={80}
                      unoptimized
                      src={job.companyLogo}
                      alt={`${job.company} logo`}
                      className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 rounded-2xl object-cover border border-gray-200 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#011640] via-[#0476D9] to-[#011640] bg-clip-text text-transparent leading-tight">
                    {job.title}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-2">
                    <p className="text-lg sm:text-xl lg:text-2xl text-[#0476D9] font-semibold">
                      {job.company}
                    </p>
                    {job.isFeatured && (
                      <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-lg w-fit">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Featured</span>
                        <span className="sm:hidden">⭐</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div className="group relative overflow-hidden bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-sm rounded-xl border border-blue-200/30 hover:border-blue-300/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-2 sm:gap-3 p-3">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600 font-medium">
                        Location
                      </p>
                      <p className="font-semibold text-[#011640] text-sm sm:text-base truncate">
                        {job.location}
                      </p>
                      {job.isRemote && (
                        <span className="inline-flex items-center gap-1 mt-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          <Earth className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span className="hidden sm:inline">Remote</span>
                          <span className="sm:hidden">🌐</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="group relative overflow-hidden bg-gradient-to-br from-white/80 to-green-50/80 backdrop-blur-sm rounded-xl border border-green-200/30 hover:border-green-300/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-2 sm:gap-3 p-3">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600 font-medium">
                        Type
                      </p>
                      <p className="font-semibold text-[#011640] capitalize text-sm sm:text-base">
                        {job.type.replace("-", " ")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group relative overflow-hidden bg-gradient-to-br from-white/80 to-yellow-50/80 backdrop-blur-sm rounded-xl border border-yellow-200/30 hover:border-yellow-300/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-2 sm:gap-3 p-3">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                      <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600 font-medium">
                        Salary
                      </p>
                      <p className="font-semibold text-[#011640] text-sm sm:text-base">
                        {formatSalary(job.salary)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group relative overflow-hidden bg-gradient-to-br from-white/80 to-purple-50/80 backdrop-blur-sm rounded-xl border border-purple-200/30 hover:border-purple-300/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-2 sm:gap-3 p-3">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600 font-medium">
                        Posted
                      </p>
                      <p className="font-semibold text-[#011640] text-sm sm:text-base">
                        {formatDate(job.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Tags */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <span className="group relative overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-gray-300/50">
                  <span className="relative z-10">
                    {job.experience
                      ? job.experience.charAt(0).toUpperCase() +
                        job.experience.slice(1)
                      : "N/A"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </span>

                <span
                  className={`group relative overflow-hidden text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 ${getTypeColor(
                    job.type
                  )}`}
                >
                  <span className="relative z-10">
                    {job.type.replace("-", " ")}
                  </span>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </span>
              </div>

              {/* Skills Section */}
              {/* {job.tags && job.tags.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-[#011640] flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    Key Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="group relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 text-[#0476D9] text-sm font-medium px-3 py-1.5 rounded-full border border-blue-200/50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 cursor-pointer hover:shadow-md hover:-translate-y-0.5"
                      >
                        <span className="relative z-10">{tag}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </span>
                    ))}
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>
      {/* Job Description with Enhanced Design */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-10 shadow-sm transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#011640] to-[#0476D9] bg-clip-text text-transparent">
            Job Description
          </h2>
          <div className="flex items-center gap-2 relative">
            <button
              onClick={handleShare}
              className="p-2 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-full transition-all duration-300 hover:scale-110"
              title="Compartilhar vaga"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            {showShareFeedback && (
              <div className="absolute text-nowrap -top-12 right-0 bg-blue-500 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium shadow-lg animate-in slide-in-from-top-2">
                Link copied to clipboard!{" "}
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <div
            className={`prose prose-sm sm:prose-base lg:prose-lg max-w-none text-[#010D26] leading-relaxed transition-all duration-500 ${
              isDescriptionExpanded
                ? "max-h-none"
                : "max-h-[400px] sm:max-h-[600px] overflow-hidden"
            }`}
          >
            {job.description.includes("<") ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(job.description),
                }}
                className="space-y-3 sm:space-y-4"
              />
            ) : (
              <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                {job.description}
              </ReactMarkdown>
            )}
          </div>

          {!isDescriptionExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none"></div>
          )}
        </div>

        <div className="flex justify-center mt-4 sm:mt-2">
          <button
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#0476D9] to-[#0487D9] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium hover:from-[#0487D9] hover:to-[#0498D9] transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
          >
            {isDescriptionExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                Show More
              </>
            )}
          </button>
        </div>
      </div>
      {/* Requirements with Enhanced Design */}
      {job.requirements && job.requirements.length > 0 && (
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-10 shadow-xl border border-blue-100/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#011640]">
              Requirements
            </h2>
          </div>
          <ul className="space-y-3 sm:space-y-4">
            {job.requirements.map((requirement, index) => (
              <li
                key={index}
                className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 hover:bg-white/80 transition-all duration-300 group"
              >
                <div className="p-1.5 sm:p-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg text-white mt-0.5 sm:mt-1 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <span className="text-[#010D26] text-sm sm:text-base leading-relaxed">
                  {requirement}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Benefits with Enhanced Design */}
      {job.benefits && job.benefits.length > 0 && (
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-10 shadow-xl border border-purple-100/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white">
              <Award className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#011640]">
              Benefits
            </h2>
          </div>
          <ul className="space-y-3 sm:space-y-4">
            {job.benefits.map((benefit, index) => (
              <li
                key={index}
                className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 hover:bg-white/80 transition-all duration-300 group"
              >
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-1.5 sm:mt-2 group-hover:scale-125 transition-transform duration-300 flex-shrink-0"></div>
                <span className="text-[#010D26] text-sm sm:text-base leading-relaxed">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="relative overflow-hidden bg-gradient-to-br from-[#0476D9] via-[#0487D9] to-[#011640] rounded-2xl sm:rounded-3xl p-6 sm:p-8 py-8 sm:py-10 text-white shadow-2xl">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 sm:-translate-y-32 translate-x-16 sm:translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-gradient-to-tr from-white/10 to-transparent rounded-full translate-y-12 sm:translate-y-24 -translate-x-12 sm:-translate-x-24"></div>

        <div className="relative text-center max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="p-3 sm:p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Ready to Join the Team?
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-6 sm:mb-8 text-blue-100 text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Great Team</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-blue-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Fast Growth</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-blue-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Amazing Benefits</span>
            </div>
          </div>

          <p className="text-sm sm:text-base mb-8 sm:mb-10 text-blue-100 leading-relaxed max-w-3xl mx-auto px-2">
            Take the next step in your career and help{" "}
            <span className="font-semibold text-white">{job.company}</span>{" "}
            build amazing products that impact millions of users worldwide.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center cursor-pointer">
            {job.applicationUrl && (
              <ApplyButton
                jobId={job.id}
                applicationUrl={job.applicationUrl}
                jobTitle={job.title}
                company={job.company}
                className="bg-gradient-to-r cursor-pointer px-6 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-2 border-white/20"
                size="lg"
                onClick={onModalOpen}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
