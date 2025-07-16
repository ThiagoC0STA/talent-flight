import { useState, useEffect } from "react";
import {
  Clock,
  Trash2,
  Search,
  RefreshCw,
  ExternalLink,
  Plus,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import Card from "@/components/ui/Card";
import { SearchHistory } from "@/types/common";
import { Job } from "@/types/job";
import { trackingService } from "@/lib/jobs";
import { ExternalJob } from "@/lib/external-apis";

interface SearchHistoryTabProps {
  onImportJob?: (
    job: Omit<Job, "id" | "createdAt" | "updatedAt">
  ) => Promise<boolean>;
  isSubmitting?: boolean;
}

export default function SearchHistoryTab({
  onImportJob,
  isSubmitting = false,
}: SearchHistoryTabProps) {
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchResults, setSearchResults] = useState<
    Record<string, ExternalJob[]>
  >({});
  const [importedJobs, setImportedJobs] = useState<Set<string>>(new Set());

  const sources = [
    { id: "theirstack", name: "TheirStack", color: "bg-blue-600" },
    { id: "remotive", name: "Remotive", color: "bg-green-500" },
    { id: "github", name: "GitHub Jobs", color: "bg-gray-600" },
    { id: "stackoverflow", name: "Stack Overflow", color: "bg-orange-500" },
    { id: "angellist", name: "AngelList", color: "bg-purple-500" },
  ];

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const history = await trackingService.getSearchHistory();
      setSearchHistory(history);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistory = async (id: string) => {
    try {
      await trackingService.deleteSearchHistory(id);
      await loadHistory();
    } catch (error) {
      console.error("Erro ao deletar histórico:", error);
    }
  };

  const loadSearchResults = (historyItem: SearchHistory) => {
    if (searchResults[historyItem.id]) return; // Já carregado

    // Usar resultados salvos diretamente
    if (historyItem.results && historyItem.results.length > 0) {
      setSearchResults((prev) => ({
        ...prev,
        [historyItem.id]: historyItem.results as ExternalJob[],
      }));
    }
    // Se não tem resultados salvos, não faz nada (histórico antigo)
  };

  // Verificar vagas importadas
  const checkImportedJobs = async (historyId: string) => {
    const importedJobIds = await trackingService.getImportedJobs(historyId);
    setImportedJobs((prev) => new Set([...prev, ...importedJobIds]));
  };

  // Atualizar toggleExpanded para checar duplicidade
  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
        // Carregar resultados quando expandir
        const item = searchHistory.find((h) => h.id === id);
        if (item) {
          loadSearchResults(item);
          // Checar vagas importadas
          setTimeout(() => {
            checkImportedJobs(item.id);
          }, 0);
        }
      }
      return newSet;
    });
  };

  const handleImportJob = async (
    externalJob: ExternalJob,
    historyId: string
  ) => {
    const jobData: Omit<Job, "id" | "createdAt" | "updatedAt"> & {
      createdAt?: Date | string;
    } = {
      title: externalJob.title,
      company: externalJob.company,
      location: externalJob.location,
      type: (externalJob.type as any) || "full-time",
      category: (externalJob.category as any) || "other",
      experience: externalJob.experience as any,
      salary: externalJob.salary
        ? {
            min: externalJob.salary.min,
            max: externalJob.salary.max,
            currency: externalJob.salary.currency,
            period: externalJob.salary.period as
              | "hourly"
              | "monthly"
              | "yearly"
              | undefined,
          }
        : undefined,
      description: externalJob.description,
      requirements: externalJob.requirements || [],
      benefits: externalJob.benefits || [],
      isRemote: externalJob.isRemote || false,
      isFeatured: false,
      isActive: true,
      applicationUrl: externalJob.applicationUrl,
      companyLogo: externalJob.companyLogo,
      tags: externalJob.tags || [],
      createdAt: externalJob.createdAt,
    };

    // Marcar como importado IMEDIATAMENTE (otimista)
    setImportedJobs((prev) => new Set([...prev, externalJob.id]));

    // Tentar importar em background
    const success = await onImportJob?.(jobData);

    // Se falhou, reverter o estado
    if (!success) {
      setImportedJobs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(externalJob.id);
        return newSet;
      });
    } else {
      // Se sucesso, salvar no banco em background
      trackingService
        .markJobAsImported(
          historyId,
          externalJob.id,
          externalJob.title,
          externalJob.company
        )
        .catch(console.error);
    }
  };

  const getSourceName = (sourceId: string) => {
    const source = sources.find((s) => s.id === sourceId);
    return source?.name || sourceId;
  };

  const getSourceColor = (sourceId: string) => {
    const source = sources.find((s) => s.id === sourceId);
    return source?.color || "bg-gray-500";
  };

  const filteredHistory = searchHistory.filter((item) => {
    if (filter === "all") return true;
    return item.sources.includes(filter);
  });

  const stats = {
    total: searchHistory.length,
    theirstack: searchHistory.filter((h) => h.sources.includes("theirstack"))
      .length,
    remotive: searchHistory.filter((h) => h.sources.includes("remotive"))
      .length,
    github: searchHistory.filter((h) => h.sources.includes("github")).length,
    stackoverflow: searchHistory.filter((h) =>
      h.sources.includes("stackoverflow")
    ).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-[#0476D9]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#011640] mb-2">
            Search History
          </h2>
          <p className="text-gray-600">View and manage your recent searches</p>
        </div>
        <button
          onClick={loadHistory}
          className="btn-outline flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-[#0476D9]">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {stats.theirstack}
          </div>
          <div className="text-sm text-gray-600">TheirStack</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-500">
            {stats.remotive}
          </div>
          <div className="text-sm text-gray-600">Remotive</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">{stats.github}</div>
          <div className="text-sm text-gray-600">GitHub</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-500">
            {stats.stackoverflow}
          </div>
          <div className="text-sm text-gray-600">Stack Overflow</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === "all"
                ? "bg-[#0476D9] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Sources
          </button>
          {sources.map((source) => (
            <button
              key={source.id}
              onClick={() => setFilter(source.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === source.id
                  ? "bg-[#0476D9] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {source.name}
            </button>
          ))}
        </div>
      </Card>

      {/* History List */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <Card className="p-8 text-center">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No searches found</h3>
            <p className="text-gray-500">
              {filter === "all"
                ? "Make some searches to see history here."
                : `No searches found for ${getSourceName(filter)}.`}
            </p>
          </Card>
        ) : (
          filteredHistory.map((item) => (
            <Card key={item.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Search className="w-5 h-5 text-[#0476D9]" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.query}
                      </h3>
                      {item.imported && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Imported
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      {item.resultsCount} resultados
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(item.createdAt).toLocaleTimeString("pt-BR")}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.sources.map((source) => (
                      <span
                        key={source}
                        className={`px-3 py-1 text-xs font-medium rounded-full text-white ${getSourceColor(
                          source
                        )}`}
                      >
                        {getSourceName(source)}
                      </span>
                    ))}
                  </div>

                  {/* Botão para expandir/recolher */}
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className="text-[#0476D9] hover:text-[#0366C4] text-sm font-medium flex items-center gap-2"
                  >
                    {expandedItems.has(item.id)
                      ? "Hide results"
                      : "View results"}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        expandedItems.has(item.id) ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                <button
                  onClick={() => handleDeleteHistory(item.id)}
                  className="text-gray-400 hover:text-red-500 p-2 ml-4"
                  title="Deletar do histórico"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Resultados expandidos */}
              {expandedItems.has(item.id) && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  {searchResults[item.id] ? (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 mb-4">
                        Results found ({searchResults[item.id].length})
                      </h4>
                      <div className="grid gap-4">
                        {searchResults[item.id].map((job) => (
                          <Card
                            key={job.id}
                            className={`p-4 mb-2 transition-all duration-200 ${
                              importedJobs.has(job.id)
                                ? "border-2 border-green-200 bg-green-50/30"
                                : ""
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              {/* Company Logo */}
                              {job.companyLogo ? (
                                <img
                                  src={job.companyLogo}
                                  alt={`${job.company} logo`}
                                  className="w-12 h-12 rounded-lg object-contain bg-white border border-gray-200"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <span className="text-gray-500 text-sm font-medium">
                                    {(job.company || "Unknown")
                                      .charAt(0)
                                      .toUpperCase()}
                                  </span>
                                </div>
                              )}

                              {/* Job Info */}
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className="font-semibold text-lg text-[#011640] -mt-1 transition-colors">
                                      {job.title}
                                    </h4>
                                    <p className="text-[#0476D9] font-medium text-xs">
                                      {job.company}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full text-white ${getSourceColor(
                                        job.source
                                      )}`}
                                    >
                                      {getSourceName(job.source)}
                                    </span>
                                  </div>
                                </div>

                                {/* Job Details */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {job.type && (
                                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                                      {job.type}
                                    </span>
                                  )}
                                  {job.experience && (
                                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 capitalize">
                                      {job.experience}
                                    </span>
                                  )}
                                  {job.isRemote && (
                                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                                      Remote
                                    </span>
                                  )}
                                  {job.salary && (
                                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                                      ${job.salary.min?.toLocaleString()} - $
                                      {job.salary.max?.toLocaleString()}
                                    </span>
                                  )}
                                </div>

                                {/* Description Preview */}
                                <div className="mb-4">
                                  <div
                                    id={`desc-${job.id}`}
                                    className="text-sm text-gray-600 line-clamp-2"
                                    dangerouslySetInnerHTML={{
                                      __html: job.description,
                                    }}
                                  />
                                  <button
                                    onClick={() => {
                                      const element = document.getElementById(
                                        `desc-${job.id}`
                                      );
                                      const button = document.getElementById(
                                        `btn-${job.id}`
                                      );
                                      if (element && button) {
                                        const isExpanded =
                                          element.classList.contains(
                                            "line-clamp-none"
                                          );
                                        if (isExpanded) {
                                          element.classList.remove(
                                            "line-clamp-none"
                                          );
                                          element.classList.add("line-clamp-2");
                                          button.textContent = "Show more";
                                        } else {
                                          element.classList.remove(
                                            "line-clamp-2"
                                          );
                                          element.classList.add(
                                            "line-clamp-none"
                                          );
                                          button.textContent = "Show less";
                                        }
                                      }
                                    }}
                                    id={`btn-${job.id}`}
                                    className="text-[#0476D9] hover:text-[#0366C4] text-xs font-medium mt-1"
                                  >
                                    Show more
                                  </button>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 mt-2">
                                  {importedJobs.has(job.id) ? (
                                    <div className="inline-flex items-center gap-2 px-4 py-2 text-green-700 bg-green-100 border border-green-300 rounded-lg">
                                      <CheckCircle className="w-4 h-4" />
                                      <span className="text-sm font-medium">
                                        Imported
                                      </span>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        handleImportJob(job, item.id)
                                      }
                                      disabled={
                                        isSubmitting || importedJobs.has(job.id)
                                      }
                                      className={`btn-primary inline-flex items-center gap-2 px-4 py-2 ${
                                        importedJobs.has(job.id)
                                          ? "opacity-50 cursor-not-allowed"
                                          : ""
                                      }`}
                                    >
                                      <Plus className="w-4 h-4" />
                                      Import Job
                                    </button>
                                  )}
                                  <a
                                    href={job.originalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-outline inline-flex items-center gap-2 px-4 py-2"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                    View Original
                                  </a>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No results found
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
