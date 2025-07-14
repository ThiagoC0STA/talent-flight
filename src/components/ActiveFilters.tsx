"use client";

import { X } from "lucide-react";
import { JobFilters, JobCategory, JobType, ExperienceLevel } from "@/types/job";
import Button from "@/components/ui/Button";

interface ActiveFiltersProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
}

export default function ActiveFilters({
  filters,
  onFiltersChange,
}: ActiveFiltersProps) {
  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) =>
      value !== undefined && (Array.isArray(value) ? value.length > 0 : true)
  );

  const categories: { value: JobCategory; label: string }[] = [
    { value: "engineering", label: "Engineering" },
    { value: "design", label: "Design" },
    { value: "marketing", label: "Marketing" },
    { value: "sales", label: "Sales" },
    { value: "product", label: "Product" },
    { value: "data", label: "Data" },
    { value: "operations", label: "Operations" },
    { value: "finance", label: "Finance" },
    { value: "hr", label: "HR" },
    { value: "other", label: "Other" },
  ];

  const types: { value: JobType; label: string }[] = [
    { value: "full-time", label: "Full Time" },
    { value: "part-time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" },
    { value: "freelance", label: "Freelance" },
  ];

  const experiences: { value: ExperienceLevel; label: string }[] = [
    { value: "intern", label: "Intern" },
    { value: "junior", label: "Junior" },
    { value: "junior-mid", label: "Junior-Mid" },
    { value: "mid", label: "Mid" },
    { value: "mid-senior", label: "Mid-Senior" },
    { value: "senior", label: "Senior" },
    { value: "between", label: "Between Levels" },
  ];

  const handleCategoryChange = (category: JobCategory) => {
    const currentCategories = filters.category || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter((c) => c !== category)
      : [...currentCategories, category];

    onFiltersChange({
      ...filters,
      category: newCategories.length > 0 ? newCategories : undefined,
    });
  };

  const handleTypeChange = (type: JobType) => {
    const currentTypes = filters.type || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];

    onFiltersChange({
      ...filters,
      type: newTypes.length > 0 ? newTypes : undefined,
    });
  };

  const handleExperienceChange = (experience: ExperienceLevel) => {
    const currentExperiences = filters.experience || [];
    const newExperiences = currentExperiences.includes(experience)
      ? currentExperiences.filter((e) => e !== experience)
      : [...currentExperiences, experience];

    onFiltersChange({
      ...filters,
      experience: newExperiences.length > 0 ? newExperiences : undefined,
    });
  };

  if (!hasActiveFilters) return null;

  return (
    <div className="mb-6 relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0476D9]/8 via-[#0487D9]/5 to-[#011640]/8 rounded-3xl"></div>

      {/* Main content */}
      <div className="relative px-4 py-3 bg-white/90 backdrop-blur-sm rounded-xl border border-[#E5EAF1]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-lg font-bold text-[#011640]">
                Active Filters
              </h3>
              <p className="text-xs text-[#6B7280]">
                Refine your search results
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-[#0476D9] hover:text-[#011640] text-xs bg-white/80 hover:bg-white shadow-sm border border-[#E5EAF1]/50"
          >
            Clear All
          </Button>
        </div>

        <div className="flex flex-wrap gap-3">
          {filters.query && (
            <span className="inline-flex items-center gap-2 px-2 py-1 bg-gradient-to-r from-[#0476D9] to-[#0487D9] text-white text-xs font-medium rounded-xl shadow-lg border border-[#0476D9]/20">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
              <span>&quot;{filters.query}&quot;</span>
              <button
                onClick={() =>
                  onFiltersChange({ ...filters, query: undefined })
                }
                className="ml-1 hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.location && (
            <span className="inline-flex items-center gap-2 px-2 py-1 bg-gradient-to-r from-[#10B981] to-[#059669] text-white text-xs font-medium rounded-xl shadow-lg border border-[#10B981]/20">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{filters.location}</span>
              <button
                onClick={() =>
                  onFiltersChange({ ...filters, location: undefined })
                }
                className="ml-1 hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.category?.map((cat) => (
            <span
              key={cat}
              className="inline-flex items-center gap-2 px-2 py-1 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white text-xs font-medium rounded-xl shadow-lg border border-[#8B5CF6]/20"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              <span>{categories.find((c) => c.value === cat)?.label}</span>
              <button
                onClick={() => handleCategoryChange(cat)}
                className="ml-1 hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.type?.map((type) => (
            <span
              key={type}
              className="inline-flex items-center gap-2 px-2 py-1 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white text-xs font-medium rounded-xl shadow-lg border border-[#F59E0B]/20"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{types.find((t) => t.value === type)?.label}</span>
              <button
                onClick={() => handleTypeChange(type)}
                className="ml-1 hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.experience?.map((exp) => (
            <span
              key={exp}
              className="inline-flex items-center gap-2 px-2 py-1 bg-gradient-to-r from-[#EC4899] to-[#DB2777] text-white text-xs font-medium rounded-xl shadow-lg border border-[#EC4899]/20"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{experiences.find((e) => e.value === exp)?.label}</span>
              <button
                onClick={() => handleExperienceChange(exp)}
                className="ml-1 hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.isRemote && (
            <span className="inline-flex items-center gap-2 px-2 py-1 bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-white text-xs font-medium rounded-xl shadow-lg border border-[#06B6D4]/20">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Remote Only</span>
              <button
                onClick={() =>
                  onFiltersChange({ ...filters, isRemote: undefined })
                }
                className="ml-1 hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.isFeatured && (
            <span className="inline-flex items-center gap-2 px-2 py-1 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white text-xs font-medium rounded-xl shadow-lg border border-[#F97316]/20">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>Featured Only</span>
              <button
                onClick={() =>
                  onFiltersChange({ ...filters, isFeatured: undefined })
                }
                className="ml-1 hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
