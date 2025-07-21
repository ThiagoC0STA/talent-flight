import { useState, useEffect } from "react";
import {
  Search,
  ExternalLink,
  Plus,
  RefreshCw,
  AlertCircle,
  History,
  Trash2,
  Clock,
} from "lucide-react";
import Card from "@/components/ui/Card";
import { Job } from "@/types/job";
import { SearchHistory } from "@/types/common";
import { searchExternalJobs, ExternalJob } from "@/lib/external-apis";
import { jobsService, trackingService } from "@/lib/jobs";
import Image from "next/image";

interface JobAggregatorProps {
  onImportJob: (
    job: Omit<Job, "id" | "createdAt" | "updatedAt"> & {
      createdAt?: Date | string;
    }
  ) => Promise<boolean>;
  isSubmitting: boolean;
}

export default function JobAggregator({
  onImportJob,
  isSubmitting,
}: JobAggregatorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSources, setSelectedSources] = useState<string[]>([
    "theirstack",
    "remotive",
    "github",
    "stackoverflow",
  ]);
  const [jobs, setJobs] = useState<ExternalJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sources = [
    { id: "theirstack", name: "TheirStack", color: "bg-blue-600" },
    { id: "remotive", name: "Remotive", color: "bg-green-500" },
    { id: "github", name: "GitHub Jobs", color: "bg-gray-600" },
    { id: "stackoverflow", name: "Stack Overflow", color: "bg-orange-500" },
    { id: "angellist", name: "AngelList", color: "bg-purple-500" },
  ];

  // Carregar histórico de pesquisas
  useEffect(() => {
    const loadHistory = async () => {
      const history = await trackingService.getSearchHistory();
      setSearchHistory(history);
    };
    loadHistory();
  }, []);

  const searchJobs = async () => {
    setLoading(true);
    setError("");
    setDuplicateJobs(new Set()); // Limpar duplicatas
    setImportingJobs(new Set()); // Limpar importando

    try {
      // Buscar em APIs reais
      const externalJobs = await searchExternalJobs(
        searchQuery,
        selectedSources
      );

      setJobs(externalJobs);

      // Salvar no histórico apenas se encontrou resultados
      if (searchQuery.trim() && externalJobs.length > 0) {
        await trackingService.saveSearchHistory(
          searchQuery,
          selectedSources,
          externalJobs.length,
          externalJobs
        );
        // Recarregar histórico
        const history = await trackingService.getSearchHistory();
        setSearchHistory(history);
      }
    } catch (error) {
      setError("Erro ao buscar vagas. Tente novamente.");
      console.error("Erro na busca:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (historyItem: SearchHistory) => {
    setSearchQuery(historyItem.query);
    setSelectedSources(historyItem.sources);
    setShowHistory(false);
  };

  const handleDeleteHistory = async (id: string) => {
    await trackingService.deleteSearchHistory(id);
    const history = await trackingService.getSearchHistory();
    setSearchHistory(history);
  };

  const [importingJobs, setImportingJobs] = useState<Set<string>>(new Set());
  const [duplicateJobs, setDuplicateJobs] = useState<Set<string>>(new Set());
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<string>("all");

  const handleImportJob = async (externalJob: ExternalJob) => {
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

    // Verificar se já existe
    const exists = await jobsService.checkJobExists(jobData);
    if (exists) {
      setDuplicateJobs((prev) => new Set([...prev, externalJob.id]));
      return;
    }

    // Marcar como importando IMEDIATAMENTE
    setImportingJobs((prev) => new Set([...prev, externalJob.id]));

    try {
      const success = await onImportJob(jobData);
      if (success) {
        // Remover o job da lista de resultados após importação bem-sucedida
        setJobs((prev) => prev.filter((job) => job.id !== externalJob.id));
        
        // Marcar o histórico como importado se foi uma busca recente
        const recentHistory = searchHistory.find(h => 
          h.query === searchQuery && 
          h.sources.some(s => selectedSources.includes(s))
        );
        
        if (recentHistory) {
          await trackingService.markSearchHistoryAsImported(recentHistory.id);
          // Atualizar estado local
          setSearchHistory(prev => 
            prev.map(item => 
              item.id === recentHistory.id 
                ? { ...item, imported: true }
                : item
            )
          );
        }
      }
    } finally {
      // Remover da lista de importando
      setImportingJobs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(externalJob.id);
        return newSet;
      });
    }
  };

  const getSourceColor = (source: string) => {
    const sourceConfig = sources.find((s) => s.id === source);
    return sourceConfig?.color || "bg-gray-500";
  };

  const getSourceName = (source: string) => {
    const sourceConfig = sources.find((s) => s.id === source);
    return sourceConfig?.name || source;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#011640] mb-2">
            Search External Jobs
          </h2>
          <p className="text-gray-600">
            Search jobs from multiple platforms and import to your site
          </p>
        </div>
      </div>

      {/* Search Controls */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by title, company, technology..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchJobs()}
                className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent"
              />
              {searchHistory.length > 0 && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <History className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              onClick={searchJobs}
              disabled={loading}
              className="btn-primary px-6 py-3 flex items-center gap-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Search
            </button>
          </div>

          {/* Histórico de Pesquisas */}
          {showHistory && searchHistory.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 max-h-80 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Pesquisas Recentes
                </h4>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              {/* Filtros por fonte */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setHistoryFilter("all")}
                  className={`px-3 py-1 text-xs rounded-full ${
                    historyFilter === "all"
                      ? "bg-[#0476D9] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Todas
                </button>
                {sources.map((source) => (
                  <button
                    key={source.id}
                    onClick={() => setHistoryFilter(source.id)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      historyFilter === source.id
                        ? "bg-[#0476D9] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {source.name}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                {searchHistory
                  .filter((item) => {
                    if (historyFilter === "all") return true;
                    return item.sources.includes(historyFilter);
                  })
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-100"
                      onClick={() => handleHistoryClick(item)}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">
                          {item.query}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            {item.resultsCount} resultados
                          </span>
                          <span>•</span>
                          <div className="flex gap-1">
                            {item.sources.map((source) => {
                              const sourceConfig = sources.find(
                                (s) => s.id === source
                              );
                              return (
                                <span
                                  key={source}
                                  className={`px-2 py-1 text-xs rounded-full text-white ${
                                    sourceConfig?.color || "bg-gray-500"
                                  }`}
                                >
                                  {sourceConfig?.name || source}
                                </span>
                              );
                            })}
                          </div>
                          <span>•</span>
                          <span>
                            {new Date(item.createdAt).toLocaleDateString(
                              "pt-BR"
                            )}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteHistory(item.id);
                        }}
                        className="text-gray-400 hover:text-red-500 p-2 ml-2"
                        title="Deletar do histórico"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
              </div>

              {searchHistory.filter((item) => {
                if (historyFilter === "all") return true;
                return item.sources.includes(historyFilter);
              }).length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  Nenhuma pesquisa encontrada para esta fonte.
                </div>
              )}
            </div>
          )}

          {/* Source Filters */}
          <div>
            <label className="block text-sm font-medium text-[#011640] mb-2">
              Sources
            </label>
            <div className="flex flex-wrap gap-2">
              {sources.map((source) => (
                <label
                  key={source.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedSources.includes(source.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSources([...selectedSources, source.id]);
                      } else {
                        setSelectedSources(
                          selectedSources.filter((s) => s !== source.id)
                        );
                      }
                    }}
                    className="accent-[#0476D9] w-4 h-4"
                  />
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full text-white ${source.color}`}
                  >
                    {source.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200">
          Error searching jobs. Try again.
        </div>
      )}

      {/* Results */}
      {jobs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#011640]">
              Results ({jobs.length})
            </h3>
          </div>

          <div className="grid gap-4">
            {jobs.map((job) => (
              <Card
                key={job.id}
                className={`p-6 transition-all duration-200 ${
                  duplicateJobs.has(job.id)
                    ? "opacity-60 border-2 border-orange-400 bg-orange-50"
                    : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Company Logo */}
                  {job.companyLogo ? (
                    <Image
                      width={48}
                      height={48}
                      src={job.companyLogo}
                      alt={`${job.company} logo`}
                      className="w-12 h-12 rounded-lg object-contain bg-white border border-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-sm font-medium">
                        {(job.company || "Unknown").charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  {/* Job Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-lg text-[#011640] mb-1">
                          {job.title}
                        </h4>
                        <p className="text-gray-600 mb-1">{job.company}</p>
                        <p className="text-sm text-gray-500">{job.location}</p>
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
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {job.description.substring(0, 200)}...
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      {duplicateJobs.has(job.id) ? (
                        <div className="inline-flex items-center gap-2 px-4 py-2 text-orange-600 bg-orange-50 border border-orange-200 rounded-lg">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Already exists
                          </span>
                        </div>
                      ) : importingJobs.has(job.id) ? (
                        <div className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span className="text-sm font-medium">
                            Importing...
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleImportJob(job)}
                          disabled={isSubmitting || duplicateJobs.has(job.id)}
                          className={`btn-primary inline-flex items-center gap-2 px-4 py-2 ${
                            duplicateJobs.has(job.id)
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
      )}

      {/* Empty State */}
      {!loading && jobs.length === 0 && searchQuery && (
        <Card className="p-8 text-center">
          <div className="text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No jobs found</h3>
            <p>Try adjusting search terms or selected sources.</p>
          </div>
        </Card>
      )}
    </div>
  );
}
