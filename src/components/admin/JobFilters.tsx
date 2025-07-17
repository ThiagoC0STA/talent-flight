import React from "react";
import { Search, X } from "lucide-react";

interface JobFiltersProps {
  filters: {
    query: string;
    status: string;
    type: string;
    category: string;
    experience: string;
    remote: string;
    featured: string;
  };
  onChange: (filters: any) => void;
  onSearch: () => void;
  onClear: () => void;
  showInvalidOnly: boolean;
  onToggleInvalid: (value: boolean) => void;
  categories?: string[];
  types?: string[];
  loading?: boolean;
}

export default function JobFilters({
  filters,
  onChange,
  onSearch,
  onClear,
  showInvalidOnly,
  onToggleInvalid,
  categories = [],
  types = [],
  loading = false,
}: JobFiltersProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
        {/* Search */}
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onSearch();
              }
            }}
            placeholder="Title, company, location..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-sm"
          />
        </div>
        {/* Status */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0476D9] focus:border-transparent"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        {/* Type */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => onChange({ ...filters, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0476D9] focus:border-transparent"
          >
            <option value="">All</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0476D9] focus:border-transparent"
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        {/* Experiência */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Experience
          </label>
          <select
            value={filters.experience}
            onChange={(e) => onChange({ ...filters, experience: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0476D9] focus:border-transparent"
          >
            <option value="">All</option>
            <option value="intern">Intern</option>
            <option value="junior">Junior</option>
            <option value="junior-mid">Junior-Mid</option>
            <option value="mid">Mid</option>
            <option value="mid-senior">Mid-Senior</option>
            <option value="senior">Senior</option>
            <option value="between">Between Levels</option>
          </select>
        </div>
        {/* Remote */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Remote
          </label>
          <select
            value={filters.remote}
            onChange={(e) => onChange({ ...filters, remote: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0476D9] focus:border-transparent"
          >
            <option value="">All</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        {/* Featured */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Featured
          </label>
          <select
            value={filters.featured}
            onChange={(e) => onChange({ ...filters, featured: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0476D9] focus:border-transparent"
          >
            <option value="">All</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={showInvalidOnly}
          onChange={(e) => onToggleInvalid(e.target.checked)}
          id="invalid-toggle"
          className="accent-[#0476D9] w-4 h-4 sm:w-5 sm:h-5"
        />
        <label
          htmlFor="invalid-toggle"
          className="text-sm text-[#0476D9] font-medium cursor-pointer"
        >
          Only jobs with invalid links
        </label>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
          <button
            onClick={onSearch}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-[#0476D9] hover:bg-[#0366C9] disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>
    </div>
  );
}
