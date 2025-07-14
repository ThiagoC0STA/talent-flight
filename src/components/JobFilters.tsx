"use client";

import { X, Filter } from "lucide-react";
import {
  JobFilters as JobFiltersType,
  JobCategory,
  JobType,
  ExperienceLevel,
} from "@/types/job";
import Button from "@/components/ui/Button";

interface JobFiltersProps {
  filters: JobFiltersType;
  onFiltersChange: (filters: JobFiltersType) => void;
  isMobile?: boolean;
}

export default function JobFilters({
  filters,
  onFiltersChange,
  isMobile = false,
}: JobFiltersProps) {
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
    { value: "entry", label: "Entry Level" },
    { value: "junior", label: "Junior" },
    { value: "mid", label: "Mid Level" },
    { value: "senior", label: "Senior" },
    { value: "lead", label: "Lead" },
    { value: "executive", label: "Executive" },
  ];

  const FilterSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-1 bg-[#0476D9] rounded-full"></div>
        <h3 className="text-sm font-semibold text-[#011640] uppercase tracking-wide">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );

  const FilterCheckbox = ({
    value,
    label,
    checked,
    onChange,
  }: {
    value: string;
    label: string;
    checked: boolean;
    onChange: () => void;
  }) => (
    <label className="flex items-center gap-1 cursor-pointer hover:bg-[#F3F7FA] p-3 rounded-xl transition-all duration-200 group">
      <div className="relative flex items-center justify-center w-5 h-5">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="absolute opacity-0 w-5 h-5 cursor-pointer"
        />
        <div
          className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${
            checked
              ? "bg-[#0476D9] border-[#0476D9]"
              : "bg-white border-[#E5EAF1] group-hover:border-[#0476D9]"
          }`}
        >
          {checked && (
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
      <span className="text-sm text-[#010D26] font-medium group-hover:text-[#0476D9] transition-colors">
        {label}
      </span>
    </label>
  );

  const ActiveFilters = () =>
    hasActiveFilters && (
      <div className="mb-6 p-5 bg-gradient-to-r from-[#F3F7FA] to-[#E8F4FD] rounded-2xl border border-[#E5EAF1]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#0476D9] rounded-full"></div>
            <h3 className="text-sm font-semibold text-[#011640]">
              Active Filters
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-[#0476D9] hover:text-[#011640] text-xs bg-white/50 hover:bg-white/80"
          >
            Clear All
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.query && (
            <span className="badge badge-primary flex items-center gap-1 text-xs">
              Search: {filters.query}
              <button
                onClick={() =>
                  onFiltersChange({ ...filters, query: undefined })
                }
                className="ml-1 hover:bg-white/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.location && (
            <span className="badge badge-primary flex items-center gap-1 text-xs">
              Location: {filters.location}
              <button
                onClick={() =>
                  onFiltersChange({ ...filters, location: undefined })
                }
                className="ml-1 hover:bg-white/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.category?.map((cat) => (
            <span
              key={cat}
              className="badge badge-outline flex items-center gap-1 text-xs"
            >
              {categories.find((c) => c.value === cat)?.label}
              <button
                onClick={() => handleCategoryChange(cat)}
                className="ml-1 hover:bg-[#0476D9]/10 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.type?.map((type) => (
            <span
              key={type}
              className="badge badge-outline flex items-center gap-1 text-xs"
            >
              {types.find((t) => t.value === type)?.label}
              <button
                onClick={() => handleTypeChange(type)}
                className="ml-1 hover:bg-[#0476D9]/10 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.experience?.map((exp) => (
            <span
              key={exp}
              className="badge badge-outline flex items-center gap-1 text-xs"
            >
              {experiences.find((e) => e.value === exp)?.label}
              <button
                onClick={() => handleExperienceChange(exp)}
                className="ml-1 hover:bg-[#0476D9]/10 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    );

  return (
    <div
      className={`bg-gradient-to-br from-white to-[#F8FAFC] rounded-3xl border border-[#E5EAF1] shadow-lg p-6 ${
        isMobile ? "mb-6" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#0476D9] to-[#0487D9] rounded-xl flex items-center justify-center">
            <Filter className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#011640]">Filters</h2>
            <p className="text-xs text-[#6B7280]">Refine your search</p>
          </div>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-[#0476D9] hover:text-[#011640] text-xs bg-[#F3F7FA] hover:bg-[#E5EAF1]"
          >
            Clear All
          </Button>
        )}
      </div>

      <ActiveFilters />

      <div className="space-y-6 filter-scrollbar scrollbar-hide max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        {/* Categories */}
        <FilterSection title="Categories">
          <div className="space-y-2">
            {categories.map(({ value, label }) => (
              <FilterCheckbox
                key={value}
                value={value}
                label={label}
                checked={filters.category?.includes(value) || false}
                onChange={() => handleCategoryChange(value)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Job Types */}
        <FilterSection title="Job Type">
          <div className="space-y-2">
            {types.map(({ value, label }) => (
              <FilterCheckbox
                key={value}
                value={value}
                label={label}
                checked={filters.type?.includes(value) || false}
                onChange={() => handleTypeChange(value)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Experience Levels */}
        <FilterSection title="Experience Level">
          <div className="space-y-2">
            {experiences.map(({ value, label }) => (
              <FilterCheckbox
                key={value}
                value={value}
                label={label}
                checked={filters.experience?.includes(value) || false}
                onChange={() => handleExperienceChange(value)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Remote Option */}
        <FilterSection title="Work Type">
          <FilterCheckbox
            value="remote"
            label="Remote Only"
            checked={filters.isRemote || false}
            onChange={() =>
              onFiltersChange({
                ...filters,
                isRemote: !filters.isRemote ? true : undefined,
              })
            }
          />
        </FilterSection>

        {/* Featured Jobs */}
        <FilterSection title="Job Status">
          <FilterCheckbox
            value="featured"
            label="Featured Jobs Only"
            checked={filters.isFeatured || false}
            onChange={() =>
              onFiltersChange({
                ...filters,
                isFeatured: !filters.isFeatured ? true : undefined,
              })
            }
          />
        </FilterSection>

        {/* Quick Actions */}
        <div className="pt-6 border-t border-[#E5EAF1]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-1 bg-[#0476D9] rounded-full"></div>
            <h3 className="text-sm font-semibold text-[#011640] uppercase tracking-wide">
              Quick Actions
            </h3>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => onFiltersChange({ isRemote: true })}
              className="w-full text-left text-sm text-[#0476D9] hover:text-[#011640] p-3 rounded-xl hover:bg-[#F3F7FA] transition-all duration-200 filter-quick-action group"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#0476D9] rounded-full group-hover:scale-125 transition-transform"></div>
                <span className="font-medium">Show Remote Jobs</span>
              </div>
            </button>
            <button
              onClick={() => onFiltersChange({ isFeatured: true })}
              className="w-full text-left text-sm text-[#0476D9] hover:text-[#011640] p-3 rounded-xl hover:bg-[#F3F7FA] transition-all duration-200 filter-quick-action group"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#0476D9] rounded-full group-hover:scale-125 transition-transform"></div>
                <span className="font-medium">Show Featured Jobs</span>
              </div>
            </button>
            <button
              onClick={() => onFiltersChange({ type: ["full-time"] })}
              className="w-full text-left text-sm text-[#0476D9] hover:text-[#011640] p-3 rounded-xl hover:bg-[#F3F7FA] transition-all duration-200 filter-quick-action group"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#0476D9] rounded-full group-hover:scale-125 transition-transform"></div>
                <span className="font-medium">Full Time Only</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
