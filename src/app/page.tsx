"use client";

import Link from "next/link";
import {
  ArrowRight,
  Search,
  Briefcase,
  MapPin,
  Users,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import Hero from "@/components/Hero";
import JobCard from "@/components/JobCard";
import { jobsService } from "@/lib/jobs";
import { Suspense, useState } from "react";

// Home Job Card Skeleton
const HomeJobCardSkeleton = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 animate-pulse border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded-lg mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
        </div>
        <div className="text-right">
          <div className="h-5 bg-gray-200 rounded-lg w-20"></div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-4/5"></div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-5 bg-gray-200 rounded-full w-12"></div>
        ))}
      </div>

      {/* Button */}
      <div className="pt-2">
        <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
      </div>
    </div>
  </div>
);

// Loading Component for Jobs Section
const JobsLoading = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
    {[...Array(6)].map((_, index) => (
      <HomeJobCardSkeleton key={index} />
    ))}
  </div>
);

// Jobs Section Component
async function JobsSection() {
  const allJobs = await jobsService.getAllJobs();
  const jobs = allJobs.slice(0, 6);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}

// Newsletter Component
function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setIsSubscribed(true);
      setEmail("");
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setError(error instanceof Error ? error.message : "Failed to subscribe");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white relative overflow-hidden max-w-md mx-auto">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-200" />
          <div>
            <h3 className="font-semibold text-lg">Subscribed!</h3>
            <p className="text-green-100 text-sm">
              You&apos;ll receive similar jobs in your inbox
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
      <div className="flex-1">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="w-full px-6 py-4 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-lg shadow-sm"
          required
          disabled={isLoading}
        />
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary whitespace-nowrap text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Subscribing...
          </div>
        ) : (
          "Subscribe"
        )}
      </button>
    </form>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      {/* Latest Jobs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#011640] mb-4">
            Latest Opportunities
          </h2>
          <p className="text-xl text-[#0476D9] max-w-2xl mx-auto leading-relaxed">
            The most recent jobs posted on TalentFlight
          </p>
        </div>

        <Suspense fallback={<JobsLoading />}>
          <JobsSection />
        </Suspense>

        <div className="text-center">
          <Link
            href="/jobs"
            className="btn-primary inline-flex items-center text-lg px-8 py-4"
          >
            View All Jobs
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#011640] mb-4">
              Why Choose TalentFlight?
            </h2>
            <p className="text-xl text-[#0476D9] max-w-2xl mx-auto leading-relaxed">
              Join thousands of professionals who trust us for their career
              growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#011640] to-[#0476D9] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#011640] mb-2">378+</h3>
              <p className="text-[#0476D9]">Active Jobs</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#011640] to-[#0476D9] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#011640] mb-2">50+</h3>
              <p className="text-[#0476D9]">Countries</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#011640] to-[#0476D9] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#011640] mb-2">10K+</h3>
              <p className="text-[#0476D9]">Professionals</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#011640] to-[#0476D9] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#011640] mb-2">95%</h3>
              <p className="text-[#0476D9]">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-[#F3F7FA] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#011640] to-[#0476D9] rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <Search className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-4xl font-bold text-[#011640] mb-6">
            Stay ahead of the curve
          </h2>

          <p className="text-xl text-[#0476D9] mb-10 max-w-2xl mx-auto leading-relaxed">
            Get the most relevant opportunities delivered to your inbox. No
            spam, just opportunities that matter to you.
          </p>

          <NewsletterSection />

          <p className="text-sm text-[#010D26] mt-6">
            You can unsubscribe at any time.
          </p>
        </div>
      </section>
    </div>
  );
}
