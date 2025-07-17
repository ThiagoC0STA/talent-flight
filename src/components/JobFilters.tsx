"use client";

import {
  Filter,
  ChevronDown,
  ChevronRight,
  Search,
  MapPin,
} from "lucide-react";
import {
  JobFilters as JobFiltersType,
  JobCategory,
  JobType,
  ExperienceLevel,
} from "@/types/job";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface JobFiltersProps {
  filters: JobFiltersType;
  onFiltersChange: (filters: JobFiltersType) => void;
  onSearch: () => void;
  isSearching?: boolean;
  isMobile?: boolean;
}

export default function JobFilters({
  filters,
  onFiltersChange,
  onSearch,
  isSearching = false,
  isMobile = false,
}: JobFiltersProps) {
  const [openSections, setOpenSections] = useState<{
    types: boolean;
    experience: boolean;
  }>({
    types: false,
    experience: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      types: section === "types" ? !prev.types : false,
      experience: section === "experience" ? !prev.experience : false,
    }));
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
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-[#F3F7FA] transition-all duration-200 group"
      >
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 bg-[#0476D9] rounded-full"></div>
          <h3 className="text-xs font-semibold text-[#011640] uppercase tracking-wide group-hover:text-[#0476D9] transition-colors">
            {title}
          </h3>
        </div>
        {isOpen ? (
          <ChevronDown className="w-3 h-3 text-[#6B7280] group-hover:text-[#0476D9] transition-colors" />
        ) : (
          <ChevronRight className="w-3 h-3 text-[#6B7280] group-hover:text-[#0476D9] transition-colors" />
        )}
      </button>
      {isOpen && (
        <div className="mt-3 pl-1 ml-3 border-l-1 border-[#E5EAF1]">
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
    <label className="flex items-center gap-2 cursor-pointer hover:bg-[#F3F7FA] p-2 rounded-lg transition-all duration-200 group">
      <div className="relative flex items-center justify-center w-4 h-4">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="absolute opacity-0 w-4 h-4 cursor-pointer"
        />
        <div
          className={`w-3 h-3 rounded border flex items-center justify-center transition-all duration-200 ${
            checked
              ? "bg-[#0476D9] border-[#0476D9]"
              : "bg-white border-[#E5EAF1] group-hover:border-[#0476D9]"
          }`}
        >
          {checked && (
            <svg
              className="w-2 h-2 text-white"
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
      <span className="text-xs text-[#010D26] font-medium group-hover:text-[#0476D9] transition-colors">
        {label}
      </span>
    </label>
  );

  const handleInputChange = (field: keyof JobFiltersType, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value || undefined,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div
      className={`bg-gradient-to-br from-white to-[#F8FAFC] rounded-3xl border border-[#E5EAF1] p-4 ${
        isMobile ? "mb-6" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#0476D9] to-[#0487D9] rounded-lg flex items-center justify-center">
            <Filter className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#011640]">
              Search & Filters
            </h2>
            <p className="text-xs text-[#6B7280]">Find your perfect job</p>
          </div>
        </div>
      </div>

            {/* Search Inputs */}
      <div className="mb-6 space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-4 h-4" />
          <Input
            placeholder="Search jobs, companies, keywords, or technologies..."
            value={filters.query || ""}
            onChange={(value) => handleInputChange("query", value)}
            onKeyPress={handleKeyPress}
            className="pl-10 h-10 text-sm"
          />
        </div>

        {/* Location Input */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-4 h-4" />
          <Input
            placeholder="Location (optional)"
            value={filters.location || ""}
            onChange={(value) => handleInputChange("location", value)}
            onKeyPress={handleKeyPress}
            className="pl-10 h-10 text-sm"
          />
        </div>
      </div>

      <div className="space-y-4 filter-scrollbar scrollbar-hide max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
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
        </div>

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

        {/* Search Button */}
        <div className="pt-4 border-t border-[#E5EAF1]">
          <Button
            onClick={onSearch}
            disabled={isSearching}
            className="w-full h-10 text-sm flex items-center justify-center gap-2"
          >
            {isSearching ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search Jobs
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
