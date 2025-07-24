"use client";

import Link from "next/link";
import { MapPin, Clock, Building2, Calendar, ExternalLink } from "lucide-react";
import {
  htmlToText,
  formatSalary,
  formatDate,
  truncateText,
  generateJobSlug,
} from "@/lib/utils";
import Card from "@/components/ui/Card";
import { Job } from "@/types/job";
import Image from "next/image";
import { useState } from "react";

interface JobCardHorizontalProps {
  job: Job;
  className?: string;
}

export default function JobCardHorizontal({
  job,
  className,
}: JobCardHorizontalProps) {
  const [imageError, setImageError] = useState(false);

  const getExperienceColor = (experience?: string) => {
    const colors = {
      intern: "bg-emerald-50 text-emerald-700 border-emerald-200",
      junior: "bg-blue-50 text-blue-700 border-blue-200",
      "junior-mid": "bg-cyan-50 text-cyan-700 border-cyan-200",
      mid: "bg-amber-50 text-amber-700 border-amber-200",
      "mid-senior": "bg-orange-50 text-orange-700 border-orange-200",
      senior: "bg-purple-50 text-purple-700 border-purple-200",
      between: "bg-gray-50 text-gray-700 border-gray-200",
    };
    if (!experience) return "bg-gray-50 text-gray-700 border-gray-200";
    return (
      colors[experience as keyof typeof colors] ||
      "bg-gray-50 text-gray-700 border-gray-200"
    );
  };

  const getTypeColor = (type: string) => {
    const colors = {
      "full-time": "bg-gradient-to-r from-blue-600 to-blue-700 text-white",
      "part-time": "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white",
      contract: "bg-gradient-to-r from-slate-800 to-slate-900 text-white",
      internship: "bg-gradient-to-r from-gray-900 to-black text-white",
      freelance: "bg-gradient-to-r from-zinc-800 to-zinc-900 text-white",
    };
    return colors[type as keyof typeof colors] || "bg-gray-600 text-white";
  };

  return (
    <Card
      className={`group transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm ${className}`}
    >
      <div className="flex items-start gap-8 p-8">
        {/* Company Logo */}
        <div className="flex-shrink-0">
            <div className="relative">
            {(job.company_logo || job.companyLogo) && !imageError ? (
              <Image
                width={80}
                height={80}
                unoptimized
                src={(job.company_logo || job.companyLogo) as string}
                alt={`${job.company} logo`}
                className="w-20 h-20 rounded-2xl object-cover border border-gray-100 bg-white"
                onError={() => setImageError(true)}
              />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <Building2 className="w-10 h-10 text-gray-400" />
            </div>
          )}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header with Title, Company and Salary */}
          <div className="flex items-end justify-between mb-6">
            <div className="flex-1 min-w-0 pr-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                <Link
                  href={`/job/${generateJobSlug(job.title, job.company)}`}
                  className="hover:underline"
                >
                  {job.title}
                </Link>
              </h3>
              <div className="flex items-center gap-3">
                <p className="text-blue-600 font-semibold text-lg">
                  {job.company}
                </p>
                {job.isRemote && (
                  <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium border border-green-200">
                    🌐 Remote
                  </span>
                )}
              </div>
            </div>

            {/* Salary */}
            <div className="text-right flex-shrink-0">
              <p className="text-xl font-bold text-gray-900 mb-3">
                {formatSalary(job.salary)}
              </p>
            </div>
          </div>

          {/* Job Details Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Location</p>
                <p className="text-gray-900 font-semibold">{job.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Type</p>
                <p className="text-gray-900 font-semibold capitalize">
                  {job.type.replace("-", " ")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Posted</p>
                <p className="text-gray-900 font-semibold">
                  {formatDate(job.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Category</p>
                <p className="text-gray-900 font-semibold">{job.category}</p>
              </div>
            </div>
          </div>

          {/* Tags and Badges */}
          <div className="flex items-center gap-4 mb-6">
            {job.experience && (
              <span
                className={`text-sm font-semibold px-4 py-2 rounded-full border ${getExperienceColor(
                  job.experience
                )}`}
              >
                {job.experience
                  ? job.experience.charAt(0).toUpperCase() +
                    job.experience.slice(1)
                  : "N/A"}
              </span>
            )}
            <span
              className={`text-sm font-semibold px-4 py-2 rounded-full ${getTypeColor(
                job.type
              )}`}
            >
              {job.type.replace("-", " ")}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-base leading-relaxed mb-6 line-clamp-3">
            {truncateText(htmlToText(job.description), 250)}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {(job.tags ?? []).slice(0, 5).map((tag: string, index: number) => (
              <span
                key={index}
                className="bg-gray-50 text-gray-700 text-sm px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
              >
                #{tag}
              </span>
            ))}
            {job.tags && job.tags.length > 5 && (
              <span className="text-blue-600 text-sm px-3 py-1.5 font-medium">
                +{job.tags.length - 6} more
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0 self-end">
          <Link
            href={`/job/${generateJobSlug(job.title, job.company)}`}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-4 px-8 rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 block whitespace-nowrap shadow-lg hover:shadow-xl group-hover:scale-105 flex items-center gap-2"
          >
            View Details
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
