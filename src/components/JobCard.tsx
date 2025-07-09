import Link from "next/link";
import { MapPin, Clock, DollarSign, Building2, Calendar } from "lucide-react";
import {
  htmlToText,
  formatSalary,
  formatDate,
  truncateText,
} from "@/lib/utils";
import Card from "@/components/ui/Card";
import { Job } from "@/types/job";
import Image from "next/image";

interface JobCardProps {
  job: Job;
  className?: string;
}

export default function JobCard({ job, className }: JobCardProps) {
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

  return (
    <Card
      className={`p-6 hover:shadow-xl transition-all duration-300 h-full flex flex-col ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-start gap-2 mb-2">
            {job.companyLogo ? (
              <Image
                width={40}
                height={40}
                src={job.companyLogo}
                alt={`${job.company} logo`}
                className="w-10 h-10 rounded-lg object-cover border border-[#E5EAF1] bg-white"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-gray-500" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-[#011640] -mt-1 transition-colors">
                <Link href={`/job/${job.id}`}>{job.title}</Link>
              </h3>
              <p className="text-[#0476D9] font-medium text-xs">
                {job.company}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-[#010D26]">
          <MapPin className="w-4 h-4 text-[#0476D9]" />
          <span className="text-sm">{job.location}</span>
          {job.isRemote && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              Remote
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-[#010D26]">
          <Clock className="w-4 h-4 text-[#0476D9]" />
          <span className="text-sm capitalize">
            {job.type.replace("-", " ")}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[#010D26]">
          <DollarSign className="w-4 h-4 text-[#0476D9]" />
          <span className="text-sm font-medium">
            {formatSalary(job.salary)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[#010D26]">
          <Calendar className="w-4 h-4 text-[#0476D9]" />
          <span className="text-sm">{formatDate(job.createdAt)}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.experience && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${getExperienceColor(
              job.experience
            )}`}
          >
            {job.experience
              ? job.experience.charAt(0).toUpperCase() + job.experience.slice(1)
              : "N/A"}
          </span>
        )}
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${getTypeColor(
            job.type
          )}`}
        >
          {job.type.replace("-", " ")}
        </span>
      </div>

      <p className="text-[#010D26] text-sm mb-4 leading-relaxed">
        {truncateText(htmlToText(job.description), 120)}
      </p>

      <div className="flex flex-wrap gap-1 mb-4">
        {(job.tags ?? []).slice(0, 3).map((tag: string, index: number) => (
          <span
            key={index}
            className="bg-[#F3F7FA] text-[#0476D9] text-xs px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
        {job.tags && job.tags.length > 3 && (
          <span className="text-[#0476D9] text-xs px-2 py-1">
            +{job.tags.length - 3} more
          </span>
        )}
      </div>

      <Link
        href={`/job/${job.id}`}
        className="w-full bg-[#0476D9] text-white text-center py-3 px-4 rounded-xl font-medium hover:bg-[#0366C4] transition-colors duration-200 block mt-auto"
      >
        View Details
      </Link>
    </Card>
  );
}
