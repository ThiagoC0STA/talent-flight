"use client";

import { Search, MapPin, Filter } from "lucide-react";
import { JobFilters } from "@/types/job";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface SearchBarProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  onSearch: () => void;
  isSearching?: boolean;
}

export default function SearchBar({
  filters,
  onFiltersChange,
  onSearch,
  isSearching = false,
}: SearchBarProps) {
  const handleInputChange = (field: keyof JobFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value || undefined,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5EAF1] p-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
          <Input
            placeholder="Search jobs, companies, keywords, or technologies..."
            value={filters.query || ""}
            onChange={(value) => handleInputChange("query", value)}
            onKeyPress={handleKeyPress}
            className="pl-12"
          />
        </div>

        {/* Location Input */}
        <div className="flex-1 relative">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
          <Input
            placeholder="Location (optional)"
            value={filters.location || ""}
            onChange={(value) => handleInputChange("location", value)}
            onKeyPress={handleKeyPress}
            className="pl-12"
          />
        </div>

        {/* Search Button */}
        <div className="flex-shrink-0">
          <Button
            onClick={onSearch}
            disabled={isSearching}
            className="w-full lg:w-auto px-8 h-12 flex items-center gap-2"
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

      {/* Quick Search Tips */}
      <div className="mt-4 pt-4 border-t border-[#E5EAF1]">
        <p className="text-xs text-[#6B7280]">
          💡 Try searching for: "React", "Python", "Remote", "Senior", "AWS",
          etc.
        </p>
      </div>
    </div>
  );
}
