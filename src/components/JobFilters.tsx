"use client";

import { Filter, ChevronDown, ChevronRight } from "lucide-react";
import {
  JobFilters as JobFiltersType,
  JobCategory,
  JobType,
  ExperienceLevel,
} from "@/types/job";
import { useState } from "react";

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
  const [openSections, setOpenSections] = useState<{
    categories: boolean;
    types: boolean;
    experience: boolean;
  }>({
    categories: false,
    types: false,
    experience: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
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
    { value: "development", label: "Development" },
    { value: "frontend", label: "Frontend" },
    { value: "backend", label: "Backend" },
    { value: "fullstack", label: "Full Stack" },
    { value: "mobile", label: "Mobile" },
    { value: "devops", label: "DevOps" },
    { value: "ai", label: "AI/ML" },
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

  const FilterSection = ({
    title,
    children,
    isOpen,
    onToggle,
  }: {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
  }) => (
    <div className="mb-6">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-[#F3F7FA] transition-all duration-200 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-1 h-1 bg-[#0476D9] rounded-full"></div>
          <h3 className="text-sm font-semibold text-[#011640] uppercase tracking-wide group-hover:text-[#0476D9] transition-colors">
            {title}
          </h3>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-[#6B7280] group-hover:text-[#0476D9] transition-colors" />
        ) : (
          <ChevronRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#0476D9] transition-colors" />
        )}
      </button>
      {isOpen && (
        <div className="mt-4 pl-1 ml-3 border-l-1 border-[#E5EAF1]">
          {children}
        </div>
      )}
    </div>
  );

  const FilterCheckbox = ({
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

  return (
    <div
      className={`bg-gradient-to-br from-white to-[#F8FAFC] rounded-3xl border border-[#E5EAF1] p-5 ${
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
      </div>

      <div className="space-y-6 filter-scrollbar scrollbar-hide max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        {/* Quick Filters */}
        <div className="space-y-3">
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
        </div>

        {/* Categories */}
        <FilterSection
          title="Categories"
          isOpen={openSections.categories}
          onToggle={() => toggleSection("categories")}
        >
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
        <FilterSection
          title="Job Type"
          isOpen={openSections.types}
          onToggle={() => toggleSection("types")}
        >
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
        <FilterSection
          title="Experience Level"
          isOpen={openSections.experience}
          onToggle={() => toggleSection("experience")}
        >
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
      </div>
    </div>
  );
}
