"use client";

import { useState } from "react";
import { Job } from "@/types/job";
import { formatSalary, formatDate, generateJobSlug } from "@/lib/utils";
import Image from "next/image";
import Button from "@/components/ui/Button";
import {
  X,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  ExternalLink,
} from "lucide-react";

interface RelatedJobsModalProps {
  isOpen: boolean;
  onClose: () => void;
  relatedJobs: Job[];
  currentJob: Job;
}

export default function RelatedJobsModal({
  isOpen,
  onClose,
  relatedJobs,
  currentJob,
}: RelatedJobsModalProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(relatedJobs[0]);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 bg-black/40 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0476D9] to-[#0487D9] text-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                🚀 Explore Similar Opportunities
              </h2>
              <p className="text-blue-100 text-lg">
                Based on your interest in{" "}
                <span className="font-semibold">{currentJob.title}</span> at{" "}
                <span className="font-semibold">{currentJob.company}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(95vh-140px)]">
          {/* Jobs List */}
          <div className="w-[36%] pb-4 border-r border-[#E5EAF1] overflow-y-auto bg-[#F8FAFC]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#011640]">
                  Related Jobs ({relatedJobs.length})
                </h3>
                <div className="bg-[#0476D9] text-white text-xs px-3 py-1 rounded-full">
                  {relatedJobs.length} opportunities
                </div>
              </div>
              <div className="space-y-4">
                {relatedJobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                      selectedJob?.id === job.id
                        ? "border-[#0476D9] bg-white shadow-lg scale-[1.02]"
                        : "border-[#E5EAF1] bg-white hover:border-[#0476D9]"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {job.companyLogo && (
                        <Image
                          width={56}
                          height={56}
                          unoptimized
                          src={job.companyLogo}
                          alt={`${job.company} logo`}
                          className="w-14 h-14 rounded-xl object-cover border border-[#E5EAF1] flex-shrink-0 shadow-sm"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#011640] text-base truncate mb-1">
                          {job.title}
                        </h4>
                        <p className="text-[#0476D9] text-sm font-semibold truncate mb-2">
                          {job.company}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[#010D26] text-xs font-medium">
                            📍 {job.location}
                          </span>
                          <span className="text-[#010D26] text-xs">•</span>
                          <span className="text-[#010D26] text-xs font-bold">
                            💰 {formatSalary(job.salary)}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium ${getExperienceColor(
                              job.experience
                            )}`}
                          >
                            {job.experience
                              ? job.experience.charAt(0).toUpperCase() +
                                job.experience.slice(1)
                              : "N/A"}
                          </span>
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium ${getTypeColor(
                              job.type
                            )}`}
                          >
                            {job.type.replace("-", " ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="w-3/5 overflow-y-auto bg-white">
            {selectedJob ? (
              <div className="p-8">
                <div className="flex items-start gap-6 mb-8">
                  {selectedJob.companyLogo && (
                    <Image
                      width={80}
                      height={80}
                      unoptimized
                      src={selectedJob.companyLogo}
                      alt={`${selectedJob.company} logo`}
                      className="w-20 h-20 rounded-2xl object-cover border border-[#E5EAF1] shadow-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#011640] mb-3">
                      {selectedJob.title}
                    </h3>
                    <p className="text-xl text-[#0476D9] font-semibold mb-4">
                      {selectedJob.company}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span
                        className={`text-sm px-4 py-2 rounded-full font-medium ${getExperienceColor(
                          selectedJob.experience
                        )}`}
                      >
                        {selectedJob.experience
                          ? selectedJob.experience.charAt(0).toUpperCase() +
                            selectedJob.experience.slice(1)
                          : "N/A"}
                      </span>
                      <span
                        className={`text-sm px-4 py-2 rounded-full font-medium ${getTypeColor(
                          selectedJob.type
                        )}`}
                      >
                        {selectedJob.type.replace("-", " ")}
                      </span>
                      {selectedJob.isRemote && (
                        <span className="bg-green-100 text-green-800 text-sm px-4 py-2 rounded-full font-medium">
                          🌍 Remote
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Job Meta */}
                <div className="grid grid-cols-2 gap-6 mb-8 p-6 bg-[#F8FAFC] rounded-2xl">
                  <div className="flex items-center gap-3 text-[#010D26]">
                    <div className="w-10 h-10 bg-[#0476D9] rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] font-medium">
                        Location
                      </p>
                      <p className="font-semibold">{selectedJob.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[#010D26]">
                    <div className="w-10 h-10 bg-[#0476D9] rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] font-medium">Type</p>
                      <p className="font-semibold capitalize">
                        {selectedJob.type.replace("-", " ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[#010D26]">
                    <div className="w-10 h-10 bg-[#0476D9] rounded-full flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] font-medium">
                        Salary
                      </p>
                      <p className="font-semibold">
                        {formatSalary(selectedJob.salary)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[#010D26]">
                    <div className="w-10 h-10 bg-[#0476D9] rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] font-medium">
                        Posted
                      </p>
                      <p className="font-semibold">
                        {formatDate(selectedJob.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description Preview */}
                <div className="mb-8">
                  <h4 className="text-lg font-bold text-[#011640] mb-4">
                    Job Description
                  </h4>
                  <div className="bg-[#F8FAFC] rounded-2xl p-6">
                    <p className="text-[#010D26] text-sm leading-relaxed line-clamp-6">
                      {selectedJob.description
                        .replace(/<[^>]*>/g, "")
                        .substring(0, 400)}
                      ...
                    </p>
                  </div>
                </div>

                {/* Apply Button */}
                <Button
                  href={`/job/${generateJobSlug(
                    selectedJob.title,
                    selectedJob.company
                  )}`}
                  className="w-full bg-gradient-to-r from-[#0476D9] to-[#0487D9] text-white hover:from-[#0366C4] hover:to-[#0476D9] py-4 text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                  🚀 View Job Details
                  <ExternalLink className="w-6 h-6 ml-3" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-[#0476D9] to-[#0487D9] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <MapPin className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#011640] mb-3">
                    Select a job to view details
                  </h3>
                  <p className="text-[#010D26] text-lg">
                    Click on any job from the list to see more information
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
