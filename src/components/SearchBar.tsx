"use client";

import { Search, MapPin } from "lucide-react";
import { JobFilters } from "@/types/job";
import Input from "@/components/ui/Input";

interface SearchBarProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
}

export default function SearchBar({
  filters,
  onFiltersChange,
}: SearchBarProps) {
  const handleInputChange = (field: keyof JobFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value || undefined,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5EAF1] p-5 ">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
          <Input
            placeholder="Search jobs, companies, or keywords..."
            value={filters.query || ""}
            onChange={(value) => handleInputChange("query", value)}
            className="pl-12"
          />
        </div>
        <div className="flex-1 relative">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5" />
          <Input
            placeholder="Location"
            value={filters.location || ""}
            onChange={(value) => handleInputChange("location", value)}
            className="pl-12"
          />
        </div>
      </div>
    </div>
  );
}
