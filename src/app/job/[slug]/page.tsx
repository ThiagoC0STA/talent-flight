import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Building,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { getJobBySlug } from "@/data/jobs";
import Markdown from "markdown-it";

const md = new Markdown();

export default function JobPage({ params }: any) {
  const job = getJobBySlug(params.slug);

  if (!job) {
    notFound();
  }

  const htmlContent = md.render(job.description);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/jobs"
            className="inline-flex items-center text-slate-700 hover:text-slate-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to all jobs
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Job Header */}
            <div className="card mb-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-slate-900 mb-6">
                    {job.title}
                  </h1>

                  <div className="flex items-center text-slate-600 mb-3">
                    <Building className="w-5 h-5 mr-3" />
                    <span className="font-semibold text-lg">{job.company}</span>
                  </div>

                  <div className="flex items-center text-slate-600 mb-6">
                    <MapPin className="w-5 h-5 mr-3" />
                    <span className="text-lg">{job.location}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="md:ml-8 md:min-w-[200px]">
                  <div className="text-sm text-slate-500 mb-4">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Posted{" "}
                    {new Date(job.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>

                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center w-full md:w-auto justify-center text-lg px-8 py-4"
                  >
                    Apply Now
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </a>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="card">
              <h2 className="text-2xl font-semibold text-slate-900 mb-8">
                Job Description
              </h2>

              <div
                className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Job Summary */}
              <div className="card">
                <h3 className="text-xl font-semibold text-slate-900 mb-6">
                  Job Summary
                </h3>

                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-slate-500 uppercase tracking-wide font-medium">
                      Company
                    </span>
                    <p className="font-semibold text-slate-900 mt-1">
                      {job.company}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm text-slate-500 uppercase tracking-wide font-medium">
                      Location
                    </span>
                    <p className="font-semibold text-slate-900 mt-1">
                      {job.location}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm text-slate-500 uppercase tracking-wide font-medium">
                      Posted
                    </span>
                    <p className="font-semibold text-slate-900 mt-1">
                      {new Date(job.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm text-slate-500 uppercase tracking-wide font-medium">
                      Skills
                    </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full inline-flex items-center justify-center text-lg px-6 py-4"
                  >
                    Apply Now
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
