'use client';

import { useState, useEffect } from 'react';
import { Search, Briefcase } from 'lucide-react';
import JobCard from '@/components/JobCard';
import SearchFilters from '@/components/SearchFilters';
import { jobsService } from '@/lib/jobs';
import { Job, JobFilters } from '@/types/job';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<JobFilters>({});
  const [loading, setLoading] = useState(true);

  // Load jobs from Supabase
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const allJobs = await jobsService.getAllJobs();
        setJobs(allJobs);
        setFilteredJobs(allJobs);
      } catch (error) {
        console.error('Error loading jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
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
        console.error('Error filtering jobs:', error);
        setFilteredJobs(jobs);
      }
    };

    applyFilters();
  }, [filters, jobs]);

  return (
    <div className="min-h-screen bg-[#F3F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-16 h-16 bg-gradient-to-br from-[#011640] to-[#0476D9] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="heading-responsive font-bold text-[#011640] mb-4">
            Find Your Next Opportunity
          </h1>
          <p className="text-responsive text-[#0476D9] max-w-2xl mx-auto leading-relaxed">
            Discover thousands of job opportunities and find the perfect match for your career goals
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12 animate-slide-in-left">
          <SearchFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        {/* Results Count */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="text-[#010D26] text-lg font-medium">
              {loading ? 'Loading...' : `${filteredJobs.length} job${filteredJobs.length !== 1 ? 's' : ''} found`}
            </p>
            <div className="flex items-center gap-2 text-sm text-[#0476D9]">
              <Search className="w-4 h-4" />
              <span>Showing all opportunities</span>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
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
          /* No Results */
          <div className="text-center py-16 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-[#011640] to-[#0476D9] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <Search className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-[#011640] mb-4">
              No jobs found
            </h3>
            <p className="text-[#0476D9] mb-8 text-lg max-w-md mx-auto leading-relaxed">
              Try adjusting your search criteria or filters to find more opportunities
            </p>
            <button
              onClick={() => setFilters({})}
              className="btn-primary"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Load More Button (for future pagination) */}
        {filteredJobs.length > 0 && (
          <div className="text-center mt-12 animate-fade-in">
            <button className="btn-outline">
              Load More Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 