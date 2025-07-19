"use client";

import { Job } from "@/types/job";
import { formatSalary, generateJobSlug } from "@/lib/utils";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Link from "next/link";

interface RelatedJobsSidebarProps {
  relatedJobs: Job[];
}

export default function RelatedJobsSidebar({
  relatedJobs,
}: RelatedJobsSidebarProps) {
  if (relatedJobs.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
      <h3 className="text-lg sm:text-xl font-bold text-[#011640] mb-4">
        Related Jobs
      </h3>
      <div className="max-h-96 overflow-y-auto scrollbar-hide">
        <div className="space-y-3">
          {relatedJobs.map((relatedJob) => (
            <Link
              href={`/job/${generateJobSlug(
                relatedJob.title,
                relatedJob.company
              )}`}
              key={relatedJob.id}
              className="cursor-pointer"
            >
              <div
                key={relatedJob.id}
                className="border border-[#E5EAF1] rounded-xl p-3 mb-3 hover:border-[#0476D9] transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  {relatedJob.companyLogo && (
                    <Image
                      width={40}
                      height={40}
                      src={relatedJob.companyLogo}
                      alt={`${relatedJob.company} logo`}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover border border-[#E5EAF1] flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[#011640] text-sm sm:text-base truncate">
                      {relatedJob.title}
                    </h4>
                    <p className="text-[#0476D9] text-xs sm:text-sm font-medium truncate">
                      {relatedJob.company}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[#010D26] text-xs">
                        {relatedJob.location}
                      </span>
                      <span className="text-[#010D26] text-xs">•</span>
                      <span className="text-[#010D26] text-xs capitalize">
                        {relatedJob.type.replace("-", " ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[#010D26] text-xs font-medium">
                        {formatSalary(relatedJob.salary)}
                      </span>
                      <span className="text-[#010D26] text-xs">•</span>
                      <span className="text-[#010D26] text-xs capitalize">
                        {relatedJob.experience || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {relatedJobs.length > 5 && (
        <div className="mt-4 text-center">
          <Button
            href="/jobs"
            className="text-white text-sm font-medium w-full"
          >
            View All Jobs →
          </Button>
        </div>
      )}
    </div>
  );
}
