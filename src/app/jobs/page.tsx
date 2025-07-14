"use client";

import { useState, useEffect } from "react";
import { Search, Briefcase, Filter } from "lucide-react";
import JobCard from "@/components/JobCard";
import JobCardHorizontal from "@/components/JobCardHorizontal";
import SearchBar from "@/components/SearchBar";
import JobFilters from "@/components/JobFilters";
import ActiveFilters from "@/components/ActiveFilters";
import ViewToggle from "@/components/ViewToggle";
import AnimatedCounter from "@/components/AnimatedCounter";
import { jobsService } from "@/lib/jobs";
import { Job, JobFilters as JobFiltersType } from "@/types/job";
import Button from "@/components/ui/Button";

// Loading Skeleton Components
const JobCardSkeleton = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 animate-pulse">
    <div className="flex items-start gap-8">
      {/* Logo Skeleton */}
      <div className="flex-shrink-0">
        <div className="w-20 h-20 bg-gray-200 rounded-2xl"></div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 min-w-0">
        <div className="flex items-end justify-between mb-6">
          <div className="flex-1 min-w-0 pr-6">
            <div className="h-8 bg-gray-200 rounded-lg mb-2 w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-1/2"></div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="h-6 bg-gray-200 rounded-lg w-24 mb-3"></div>
          </div>
        </div>

        {/* Details Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-5 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Badges Skeleton */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-8 bg-gray-200 rounded-full w-20"></div>
          <div className="h-8 bg-gray-200 rounded-full w-24"></div>
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>

        {/* Tags Skeleton */}
        <div className="flex flex-wrap gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-7 bg-gray-200 rounded-full w-16"></div>
          ))}
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="flex-shrink-0 self-end">
        <div className="h-12 bg-gray-200 rounded-2xl w-32"></div>
      </div>
    </div>
  </div>
);

const JobCardGridSkeleton = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 animate-pulse">
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
    </div>
  </div>
);

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<JobFiltersType>({});
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    remoteJobs: 0,
  });
  const [animationKey, setAnimationKey] = useState(0);

  // Load jobs and stats from Supabase
  useEffect(() => {
    const loadJobsAndStats = async () => {
      try {
        const allJobs = await jobsService.getAllJobs();
        setJobs(allJobs);
        setFilteredJobs(allJobs);

        // Calculate stats
        const uniqueCompanies = new Set(allJobs.map((job) => job.company)).size;
        const remoteJobsCount = allJobs.filter((job) => job.isRemote).length;

        const newStats = {
          totalJobs: allJobs.length,
          totalCompanies: uniqueCompanies,
          remoteJobs: remoteJobsCount,
        };

        setStats(newStats);
        // Start animation after stats are set
        setTimeout(() => setAnimationKey((prev) => prev + 1), 100);
      } catch (error) {
        console.error("Error loading jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadJobsAndStats();
  }, []);

  // Filter jobs when filters change
  useEffect(() => {
    const applyFilters = async () => {
      if (Object.keys(filters).length === 0) {
        setFilteredJobs(jobs);
        return;
      }

      try {
        const filtered = await jobsService.searchJobs(filters);
        setFilteredJobs(filtered);
      } catch (error) {
        console.error("Error filtering jobs:", error);
        setFilteredJobs(jobs);
      }
    };

    applyFilters();
  }, [filters, jobs]);

  return (
    <div className="min-h-screen bg-[#F3F7FA]">
      <div className="max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="relative mb-12 animate-fade-in overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 rounded-3xl"></div>

          {/* Main Content */}
          <div className="relative p-8 text-center">
            {/* Icon Container */}
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#011640] to-[#0476D9] rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="heading-responsive font-bold text-[#011640] mb-6 leading-tight">
              Find Your Next Opportunity
            </h1>

            {/* Description */}
            <p className="text-responsive text-[#6B7280] max-w-3xl mx-auto leading-relaxed mb-8">
              Discover thousands of job opportunities and find the perfect match
              for your career goals. From startups to Fortune 500 companies.
            </p>

            {/* Stats */}
            <div className="flex justify-center items-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                <span className="text-[#6B7280]">Live Jobs</span>
                <span className="font-semibold text-[#011640]">
                  <AnimatedCounter
                    value={stats.totalJobs}
                    duration={2500}
                    key={animationKey}
                  />
                </span>
              </div>
              <div className="w-px h-4 bg-[#E5EAF1]"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#F59E0B] rounded-full"></div>
                <span className="text-[#6B7280]">Companies</span>
                <span className="font-semibold text-[#011640]">
                  <AnimatedCounter
                    value={stats.totalCompanies}
                    duration={2000}
                    key={animationKey}
                  />
                </span>
              </div>
              <div className="w-px h-4 bg-[#E5EAF1]"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#8B5CF6] rounded-full"></div>
                <span className="text-[#6B7280]">Remote</span>
                <span className="font-semibold text-[#011640]">
                  <AnimatedCounter
                    value={stats.remoteJobs}
                    duration={2200}
                    key={animationKey}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4 animate-slide-in-left">
          <SearchBar filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Active Filters */}
        <div className="mb-4">
          <ActiveFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-center gap-2"
          >
            <Filter className="w-4 h-4" />
            {showMobileFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Mobile Filters */}
        {showMobileFilters && (
          <div className="lg:hidden mb-6 animate-fade-in">
            <JobFilters
              filters={filters}
              onFiltersChange={setFilters}
              isMobile={true}
            />
          </div>
        )}

        <div className="flex gap-7">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0 max-w-[280px]">
            <div className="sticky top-8 ">
              <JobFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Count and View Toggle */}
            <div className="mb-8 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[#010D26] text-lg font-medium">
                  {loading
                    ? "Loading opportunities..."
                    : `${filteredJobs.length} job${
                        filteredJobs.length !== 1 ? "s" : ""
                      } found`}
                </p>
                <ViewToggle
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-[#0476D9]">
                <Search className="w-4 h-4" />
                <span>Showing all opportunities</span>
              </div>
            </div>

            {/* Jobs Display */}
            {loading ? (
              // Loading State
              <div className="space-y-6">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, index) => (
                      <JobCardGridSkeleton key={index} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {[...Array(4)].map((_, index) => (
                      <JobCardSkeleton key={index} />
                    ))}
                  </div>
                )}
              </div>
            ) : filteredJobs.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-fade-in">
                  {filteredJobs.map((job, index) => (
                    <div
                      key={job.id}
                      className="animate-scale-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <JobCard job={job} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  {filteredJobs.map((job, index) => (
                    <div
                      key={job.id}
                      className="animate-scale-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <JobCardHorizontal job={job} />
                    </div>
                  ))}
                </div>
              )
            ) : (
              /* No Results */
              <div className="text-center py-16 animate-fade-in">
                <div className="w-24 h-24 bg-gradient-to-br from-[#011640] to-[#0476D9] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <Search className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-[#011640] mb-4">
                  No jobs found
                </h3>
                <p className="text-[#0476D9] mb-8 text-lg max-w-md mx-auto leading-relaxed">
                  Try adjusting your search criteria or filters to find more
                  opportunities
                </p>
                <button onClick={() => setFilters({})} className="btn-primary">
                  Clear all filters
                </button>
              </div>
            )}

            {/* Load More Button (for future pagination) */}
            {filteredJobs.length > 0 && !loading && (
              <div className="text-center mt-12 animate-fade-in">
                <button className="btn-outline">Load More Jobs</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
