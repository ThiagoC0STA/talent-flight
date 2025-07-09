'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import JobCard from '@/components/JobCard';
import { getAllJobs } from '@/data/jobs';
import { JobFilters } from '@/types/job';

export default function JobsPage() {
  const allJobs = getAllJobs();
  const [filters, setFilters] = useState<JobFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique tags and locations for filters
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allJobs.forEach(job => job.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [allJobs]);

  const allLocations = useMemo(() => {
    const locations = new Set<string>();
    allJobs.forEach(job => locations.add(job.location));
    return Array.from(locations).sort();
  }, [allJobs]);

  // Filter jobs based on search and filters
  const filteredJobs = useMemo(() => {
    return allJobs.filter(job => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          job.title.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Location filter
      if (filters.location && job.location !== filters.location) {
        return false;
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => job.tags.includes(tag));
        if (!hasMatchingTag) return false;
      }

      return true;
    });
  }, [allJobs, searchTerm, filters]);

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const hasActiveFilters = searchTerm || filters.location || (filters.tags && filters.tags.length > 0);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            All Jobs
          </h1>
          <p className="text-xl text-slate-600">
            Find the perfect opportunity for your career
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-12 shadow-sm">
          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, company, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent text-lg"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Location
              </label>
              <select
                value={filters.location || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value || undefined }))}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              >
                <option value="">All locations</option>
                {allLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Tags Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Skills
              </label>
              <select
                value={filters.tags?.[0] || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  tags: e.target.value ? [e.target.value] : undefined 
                }))}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              >
                <option value="">All skills</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-8 pt-8 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600">Active filters:</span>
                </div>
                <button
                  onClick={clearFilters}
                  className="text-sm text-slate-700 hover:text-slate-900 flex items-center font-medium"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear filters
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {searchTerm && (
                  <span className="px-3 py-1 bg-slate-100 text-slate-800 text-sm rounded-full">
                    Search: &quot;{searchTerm}&quot;
                  </span>
                )}
                {filters.location && (
                  <span className="px-3 py-1 bg-slate-100 text-slate-800 text-sm rounded-full">
                    Location: {filters.location}
                  </span>
                )}
                {filters.tags?.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-800 text-sm rounded-full">
                    Skill: {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-slate-600 text-lg">
            {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} showDescription />
          ))}
        </div>

        {/* No Results */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-4">
              No jobs found
            </h3>
            <p className="text-slate-600 mb-8 text-lg">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={clearFilters}
              className="btn-secondary"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>    
    </div>
  );
} 