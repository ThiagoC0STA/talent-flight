'use client';

import { useState } from 'react';
import { Search, MapPin, Filter, X } from 'lucide-react';
import { JobFilters, JobCategory, JobType, ExperienceLevel } from '@/types/job';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface SearchFiltersProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  className?: string;
}

export default function SearchFilters({ filters, onFiltersChange, className }: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (field: keyof JobFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value || undefined
    });
  };

  const handleCategoryChange = (category: JobCategory) => {
    const currentCategories = filters.category || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    
    onFiltersChange({
      ...filters,
      category: newCategories.length > 0 ? newCategories : undefined
    });
  };

  const handleTypeChange = (type: JobType) => {
    const currentTypes = filters.type || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    onFiltersChange({
      ...filters,
      type: newTypes.length > 0 ? newTypes : undefined
    });
  };

  const handleExperienceChange = (experience: ExperienceLevel) => {
    const currentExperiences = filters.experience || [];
    const newExperiences = currentExperiences.includes(experience)
      ? currentExperiences.filter(e => e !== experience)
      : [...currentExperiences, experience];
    
    onFiltersChange({
      ...filters,
      experience: newExperiences.length > 0 ? newExperiences : undefined
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && (Array.isArray(value) ? value.length > 0 : true)
  );

  const categories: { value: JobCategory; label: string }[] = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'product', label: 'Product' },
    { value: 'data', label: 'Data' },
    { value: 'operations', label: 'Operations' },
    { value: 'finance', label: 'Finance' },
    { value: 'hr', label: 'HR' },
    { value: 'development', label: 'Development' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'fullstack', label: 'Full Stack' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'devops', label: 'DevOps' },
    { value: 'ai', label: 'AI/ML' },
    { value: 'other', label: 'Other' }
  ];

  const types: { value: JobType; label: string }[] = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'freelance', label: 'Freelance' }
  ];

  const experiences: { value: ExperienceLevel; label: string }[] = [
    { value: 'intern', label: 'Intern' },
    { value: 'junior', label: 'Junior' },
    { value: 'junior-mid', label: 'Junior-Mid' },
    { value: 'mid', label: 'Mid' },
    { value: 'mid-senior', label: 'Mid-Senior' },
    { value: 'senior', label: 'Senior' },
    { value: 'between', label: 'Between Levels' }
  ];

  return (
    <div className={`bg-white rounded-2xl border border-[#E5EAF1] shadow-sm p-6 ${className}`}>
      {/* Main Search Bar */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
          <Input
            placeholder="Search jobs, companies, or keywords..."
            value={filters.query || ''}
            onChange={(value) => handleInputChange('query', value)}
            className="pl-12"
          />
        </div>
        <div className="flex-1 relative">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
          <Input
            placeholder="Location"
            value={filters.location || ''}
            onChange={(value) => handleInputChange('location', value)}
            className="pl-12"
          />
        </div>
        <Button
          variant={isExpanded ? 'primary' : 'outline'}
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.query && (
            <span className="badge badge-primary flex items-center gap-1">
              Search: {filters.query}
              <button
                onClick={() => handleInputChange('query', '')}
                className="ml-1 hover:bg-white/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.location && (
            <span className="badge badge-primary flex items-center gap-1">
              Location: {filters.location}
              <button
                onClick={() => handleInputChange('location', '')}
                className="ml-1 hover:bg-white/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.category?.map(cat => (
            <span key={cat} className="badge badge-outline flex items-center gap-1">
              {categories.find(c => c.value === cat)?.label}
              <button
                onClick={() => handleCategoryChange(cat)}
                className="ml-1 hover:bg-[#0476D9]/10 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.type?.map(type => (
            <span key={type} className="badge badge-outline flex items-center gap-1">
              {types.find(t => t.value === type)?.label}
              <button
                onClick={() => handleTypeChange(type)}
                className="ml-1 hover:bg-[#0476D9]/10 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.experience?.map(exp => (
            <span key={exp} className="badge badge-outline flex items-center gap-1">
              {experiences.find(e => e.value === exp)?.label}
              <button
                onClick={() => handleExperienceChange(exp)}
                className="ml-1 hover:bg-[#0476D9]/10 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-[#0476D9] hover:text-[#011640]"
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="border-t border-[#E5EAF1] pt-6 space-y-6 animate-fade-in">
          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-[#011640] mb-3">Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {categories.map(({ value, label }) => (
                <label key={value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.category?.includes(value) || false}
                    onChange={() => handleCategoryChange(value)}
                    className="rounded border-[#E5EAF1] text-[#0476D9] focus:ring-[#0476D9]"
                  />
                  <span className="text-sm text-[#010D26]">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Job Types */}
          <div>
            <h3 className="text-sm font-semibold text-[#011640] mb-3">Job Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {types.map(({ value, label }) => (
                <label key={value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.type?.includes(value) || false}
                    onChange={() => handleTypeChange(value)}
                    className="rounded border-[#E5EAF1] text-[#0476D9] focus:ring-[#0476D9]"
                  />
                  <span className="text-sm text-[#010D26]">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Experience Levels */}
          <div>
            <h3 className="text-sm font-semibold text-[#011640] mb-3">Experience Level</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {experiences.map(({ value, label }) => (
                <label key={value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.experience?.includes(value) || false}
                    onChange={() => handleExperienceChange(value)}
                    className="rounded border-[#E5EAF1] text-[#0476D9] focus:ring-[#0476D9]"
                  />
                  <span className="text-sm text-[#010D26]">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Remote Option */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.isRemote || false}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  isRemote: e.target.checked ? true : undefined
                })}
                className="rounded border-[#E5EAF1] text-[#0476D9] focus:ring-[#0476D9]"
              />
              <span className="text-sm font-medium text-[#010D26]">Remote Only</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
} 