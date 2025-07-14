import React from "react";

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
  showInvalidOnly: boolean;
  onToggleInvalid: (value: boolean) => void;
  categories?: string[];
  types?: string[];
}

export default function JobFilters({
  filters,
  onChange,
  showInvalidOnly,
  onToggleInvalid,
  categories = [],
  types = [],
}: JobFiltersProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
        {/* Busca */}
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <input
            type="text"
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder="Título, empresa, localização..."
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
        {/* Tipo */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Tipo
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
        {/* Categoria */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Categoria
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
        {/* Remoto */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Remoto
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
        {/* Destaque */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Destaque
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
      
      {/* Toggle links inválidos */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
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
    </div>
  );
}
