import Link from 'next/link';
import { MapPin, Building, Calendar } from 'lucide-react';
import { Job } from '@/types/job';

interface JobCardProps {
  job: Job;
  showDescription?: boolean;
}

export default function JobCard({ job, showDescription = false }: JobCardProps) {
  return (
    <div className="card group hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <Link 
                href={`/job/${job.slug}`}
                className="text-lg font-semibold text-[#011640] hover:text-[#0476D9] transition-colors line-clamp-2 group-hover:text-[#0476D9]"
              >
                {job.title}
              </Link>
              <div className="flex items-center text-[#010D26] mt-2">
                <Building className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">{job.company}</span>
              </div>
            </div>
          </div>

          {/* Location and Date */}
          <div className="flex items-center justify-between text-sm text-[#0476D9] mb-4">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{new Date(job.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {job.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-[#E5EAF1] text-[#0476D9] text-xs font-medium rounded-full border border-[#0476D9]"
              >
                {tag}
              </span>
            ))}
            {job.tags.length > 3 && (
              <span className="px-3 py-1 bg-[#F3F7FA] text-[#011640] text-xs font-medium rounded-full">
                +{job.tags.length - 3}
              </span>
            )}
          </div>

          {/* Description Preview */}
          {showDescription && (
            <p className="text-[#010D26] text-sm line-clamp-3 mb-4 leading-relaxed">
              {job.description.replace(/^#.*$/m, '').replace(/^##.*$/m, '').trim().slice(0, 150)}...
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E5EAF1]">
          <Link
            href={`/job/${job.slug}`}
            className="text-[#0476D9] hover:text-[#011640] font-medium text-sm transition-colors"
          >
            View details →
          </Link>
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm py-2 px-4"
          >
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );
}
