import React from "react";

interface JobFiltersProps {
  filters: {
    query: string;
    status: string;
    type: string;
    category: string;
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
    <div className="flex flex-wrap gap-4 items-end mb-6">
      {/* Busca */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Buscar
        </label>
        <input
          type="text"
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          placeholder="Título, empresa, localização..."
          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-sm min-w-[180px]"
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
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
        >
          <option value="">Todos</option>
          <option value="active">Ativa</option>
          <option value="inactive">Inativa</option>
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
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
        >
          <option value="">Todos</option>
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
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
        >
          <option value="">Todas</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
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
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
        >
          <option value="">Todos</option>
          <option value="yes">Sim</option>
          <option value="no">Não</option>
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
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
        >
          <option value="">Todos</option>
          <option value="yes">Sim</option>
          <option value="no">Não</option>
        </select>
      </div>
      {/* Toggle links inválidos */}
      <div className="flex items-center gap-2 ml-4 mt-2">
        <input
          type="checkbox"
          checked={showInvalidOnly}
          onChange={(e) => onToggleInvalid(e.target.checked)}
          id="invalid-toggle"
          className="accent-[#0476D9] w-5 h-5"
        />
        <label
          htmlFor="invalid-toggle"
          className="text-sm text-[#0476D9] font-medium cursor-pointer"
        >
          Só vagas com links inválidos
        </label>
      </div>
    </div>
  );
}
