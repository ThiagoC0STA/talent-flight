"use client";

import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Job } from "@/types/job";
import NewsletterSignup from "./NewsletterSignup";
import RelatedJobs from "./RelatedJobs";
import RelatedJobsSidebar from "./RelatedJobsSidebar";
import RelatedJobsModal from "./RelatedJobsModal";
import JobMainContent from "./JobMainContent";

export default function JobPagePreview({
  job,
  onBack,
  relatedJobs = [],
}: {
  job: Job;
  onBack?: () => void;
  relatedJobs?: Job[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <JobMainContent job={job} onModalOpen={() => setIsModalOpen(true)} />
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
