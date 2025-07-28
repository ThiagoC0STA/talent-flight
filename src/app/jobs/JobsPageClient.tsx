"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Briefcase, Filter } from "lucide-react";
import JobCard from "@/components/JobCard";
import JobCardHorizontal from "@/components/JobCardHorizontal";
import JobFilters from "@/components/JobFilters";
import ViewToggle from "@/components/ViewToggle";
import AnimatedCounter from "@/components/AnimatedCounter";
import Pagination from "@/components/Pagination";
import { Job, JobFilters as JobFiltersType } from "@/types/job";
import Button from "@/components/ui/Button";
import api from "@/lib/api";

// Loading Skeleton Components
const JobCardSkeleton = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 animate-pulse">
    <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 lg:gap-8">
      {/* Logo Skeleton */}
      <div className="flex-shrink-0">
        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-20 lg:h-20 bg-gray-200 rounded-2xl"></div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
          <div className="flex-1 min-w-0 pr-0 sm:pr-6">
            <div className="h-6 sm:h-8 bg-gray-200 rounded-lg mb-2 w-3/4"></div>
            <div className="h-4 sm:h-6 bg-gray-200 rounded-lg w-1/2"></div>
          </div>
          <div className="text-left sm:text-right flex-shrink-0">
            <div className="h-5 sm:h-6 bg-gray-200 rounded-lg w-24 mb-2 sm:mb-3"></div>
          </div>
        </div>

        {/* Details Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-12 sm:w-16 mb-1"></div>
                <div className="h-4 sm:h-5 bg-gray-200 rounded w-16 sm:w-20"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Badges Skeleton */}
        <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="h-6 sm:h-8 bg-gray-200 rounded-full w-16 sm:w-20"></div>
          <div className="h-6 sm:h-8 bg-gray-200 rounded-full w-20 sm:w-24"></div>
        </div>

        {/* Description Skeleton */}
        <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-4/6"></div>
        </div>

        {/* Tags Skeleton */}
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-5 sm:h-7 bg-gray-200 rounded-full w-12 sm:w-16"
            ></div>
          ))}
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="flex-shrink-0 self-start sm:self-end mt-4 sm:mt-0">
        <div className="h-10 sm:h-12 bg-gray-200 rounded-2xl w-28 sm:w-32"></div>
      </div>
    </div>
  </div>
);

const JobCardGridSkeleton = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 animate-pulse">
    <div className="space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-5 sm:h-6 bg-gray-200 rounded-lg mb-2 w-3/4"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded-lg w-1/2"></div>
        </div>
        <div className="text-right">
          <div className="h-4 sm:h-5 bg-gray-200 rounded-lg w-16 sm:w-20"></div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-20 sm:w-24"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-20"></div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-4/5"></div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-4 sm:h-5 bg-gray-200 rounded-full w-10 sm:w-12"
          ></div>
        ))}
      </div>
    </div>
  </div>
);

interface JobsPageClientProps {
  initialJobs: Job[];
  initialStats: {
    totalJobs: number;
    totalCompanies: number;
    remoteJobs: number;
  };
  totalJobs: number;
}

export default function JobsPageClient({
  initialJobs,
  initialStats,
  totalJobs: initialTotalJobs,
}: JobsPageClientProps) {
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(initialJobs || []);
  const [filters, setFilters] = useState<JobFiltersType>({});
  const [loading, setLoading] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Debug function for viewMode changes
  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  // For mobile, always use grid view
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const effectiveViewMode = isMobile ? "grid" : viewMode;

  const [stats, setStats] = useState(
    initialStats || { totalJobs: 0, totalCompanies: 0, remoteJobs: 0 }
  );
  const [animationKey, setAnimationKey] = useState(0);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(initialTotalJobs || 0);
  const jobsPerPage = 12;



  // Estado para controlar se a busca foi aplicada
  const [hasAppliedSearch, setHasAppliedSearch] = useState(false);

  // Estado para controlar loading de stats separadamente
  const [statsLoading, setStatsLoading] = useState(false);

  // Função utilitária para construir parâmetros da API
  const buildApiParams = useCallback(
    (page: number, includeFilters: boolean = false) => {
      const params: any = {
        page: page.toString(),
        limit: jobsPerPage.toString(),
      };

      // Adicionar filtros ativos à query apenas se solicitado
      if (includeFilters && hasAppliedSearch) {
        if (filters.query) params.search = filters.query;
        if (filters.location) params.location = filters.location;
        if (filters.experience?.length) {
          params.experience = filters.experience;
        }
        if (filters.type?.length) {
          params.type = filters.type;
        }
        if (filters.category?.length) {
          params.category = filters.category;
        }
        if (filters.isRemote) params.remote = "true";
        if (filters.isFeatured) params.featured = "true";
      }

      return params;
    },
    [filters, hasAppliedSearch, jobsPerPage]
  );

  // Load jobs and stats from API with pagination - ULTRA OTIMIZADO
  useEffect(() => {
    const loadJobsAndStats = async () => {
      try {
        setLoading(true);

        // Carregar jobs primeiro (prioridade máxima)
        if (currentPage === 1 && !hasAppliedSearch) {
          // Carregar jobs imediatamente
          const jobsResponse = await api.get("/api/jobs", {
            params: buildApiParams(1, false),
          });

          setFilteredJobs(jobsResponse.data.jobs);
          setTotalJobs(jobsResponse.data.total);
          setTotalPages(jobsResponse.data.totalPages);

          // Parar loading dos jobs imediatamente
          setLoading(false);

          // Carregar stats em background (sem bloquear)
          setStatsLoading(true);
          api
            .get("/api/jobs/stats")
            .then((statsResponse) => {
              setStats({
                totalJobs: statsResponse.data.totalJobs,
                totalCompanies: statsResponse.data.totalCompanies,
                remoteJobs: statsResponse.data.remoteJobs,
              });
              setAnimationKey((prev) => prev + 1);
              setStatsLoading(false);
            })
            .catch((error) => {
              console.error("Error loading stats:", error);
              setStatsLoading(false);
            });
        } else {
          // Para mudanças de página ou buscas, carregar apenas os jobs
          const response = await api.get("/api/jobs", {
            params: buildApiParams(currentPage, true),
          });

          setFilteredJobs(response.data.jobs);
          setTotalJobs(response.data.total);
          setTotalPages(response.data.totalPages);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading jobs:", error);
        setLoading(false);
      }
    };

    loadJobsAndStats();
  }, [currentPage, hasAppliedSearch]);

  // Função para aplicar busca manualmente - OTIMIZADA COM DEBOUNCE
  const applySearch = useCallback(async () => {
    try {
      setLoading(true);
      setHasAppliedSearch(true);

      // Reset pagination
      setCurrentPage(1);

      const response = await api.get("/api/jobs", {
        params: buildApiParams(1, true),
      });

      setFilteredJobs(response.data.jobs);
      setTotalJobs(response.data.total);
      setTotalPages(response.data.totalPages);

      // Scroll para o elemento de resultados após a busca
      scrollToResults();
    } catch (error) {
      console.error("Error filtering jobs:", error);
    } finally {
      setLoading(false);
    }
  }, [buildApiParams]);

  // Debounce para a busca
  const debouncedSearch = useCallback(() => {
    let timeoutId: NodeJS.Timeout;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        applySearch();
      }, 300);
    };
  }, [applySearch])();

  // Função utilitária para scroll suave - OTIMIZADA
  const scrollToResults = () => {
    // Usar requestAnimationFrame para melhor performance
    requestAnimationFrame(() => {
      const element = document.getElementById("jobs-results");
      if (element) {
        const elementPosition = element.offsetTop - 100; // Offset de 100px para subir mais
        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        });
      }
    });
  };

  // Função para mudar de página - OTIMIZADA
  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    scrollToResults();
  };

  return (
    <div className="min-h-screen bg-[#F3F7FA]">
      <div className="max-w-[1540px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Page Header */}
        <div className="relative mb-8 sm:mb-10 md:mb-12 animate-fade-in overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 rounded-2xl sm:rounded-3xl"></div>

          {/* Main Content */}
          <div className="relative p-4 sm:p-6 md:p-8 text-center">
            {/* Icon Container */}
            <div className="relative mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#011640] to-[#0476D9] rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#011640] mb-4 sm:mb-6 leading-tight">
              Find Your Next Opportunity
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-[#6B7280] max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-2">
              Discover thousands of job opportunities and find the perfect match
              for your career goals. From startups to Fortune 500 companies.
            </p>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                <span className="text-[#6B7280]">Live Jobs</span>
                <span className="font-semibold text-[#011640]">
                  {statsLoading ? (
                    <span className="animate-pulse">0</span>
                  ) : (
                    <AnimatedCounter
                      value={stats.totalJobs}
                      duration={2500}
                      key={animationKey}
                    />
                  )}
                </span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-[#E5EAF1]"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#F59E0B] rounded-full"></div>
                <span className="text-[#6B7280]">Companies</span>
                <span className="font-semibold text-[#011640]">
                  {statsLoading ? (
                    <span className="animate-pulse">0</span>
                  ) : (
                    <AnimatedCounter
                      value={stats.totalCompanies}
                      duration={2000}
                      key={animationKey}
                    />
                  )}
                </span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-[#E5EAF1]"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#8B5CF6] rounded-full"></div>
                <span className="text-[#6B7280]">Remote</span>
                <span className="font-semibold text-[#011640]">
                  {statsLoading ? (
                    <span className="animate-pulse">0</span>
                  ) : (
                    <AnimatedCounter
                      value={stats.remoteJobs}
                      duration={2200}
                      key={animationKey}
                    />
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4 sm:mb-6">
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Filter className="w-4 h-4" />
            {showMobileFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Mobile Filters */}
        {showMobileFilters && (
          <div className="lg:hidden mb-4 sm:mb-6 animate-fade-in">
            <JobFilters
              filters={filters}
              onFiltersChange={setFilters}
              onSearch={debouncedSearch}
              isSearching={loading}
              isMobile={true}
            />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-7">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block w-full lg:w-80 flex-shrink-0 max-w-full lg:max-w-[280px]">
            <div className="sticky top-24">
              <JobFilters
                filters={filters}
                onFiltersChange={setFilters}
                onSearch={debouncedSearch}
                isSearching={loading}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results Count and View Toggle */}
            <div className="mb-6 sm:mb-8 animate-fade-in" id="jobs-results">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
                <p className="text-[#010D26] text-base sm:text-lg font-medium">
                  {loading
                    ? "Loading opportunities..."
                    : hasAppliedSearch
                      ? `${totalJobs} job${totalJobs !== 1 ? "s" : ""} found`
                      : `${stats.totalJobs} job${
                          stats.totalJobs !== 1 ? "s" : ""
                        } found`}
                </p>
                <div className="hidden lg:block">
                  <ViewToggle
                    viewMode={viewMode}
                    onViewModeChange={handleViewModeChange}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#0476D9]">
                <Search className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Showing all opportunities</span>
              </div>
            </div>

            {/* Jobs Display */}
            {loading ? (
              // Loading State
              <div className="space-y-4 sm:space-y-6">
                {effectiveViewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {[...Array(6)].map((_, index) => (
                      <JobCardGridSkeleton key={index} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    {[...Array(4)].map((_, index) => (
                      <JobCardSkeleton key={index} />
                    ))}
                  </div>
                )}
              </div>
            ) : filteredJobs.length > 0 ? (
              effectiveViewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 animate-fade-in">
                  {filteredJobs.map((job, index) => (
                    <div
                      key={job.id}
                      className="animate-scale-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <JobCard job={job} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6 animate-fade-in">
                  {filteredJobs.map((job, index) => (
                    <div
                      key={job.id}
                      className="animate-scale-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <JobCardHorizontal job={job} />
                    </div>
                  ))}
                </div>
              )
            ) : (
              /* No Results */
              <div className="text-center py-12 sm:py-16 animate-fade-in">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#011640] to-[#0476D9] rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg">
                  <Search className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#011640] mb-3 sm:mb-4">
                  No jobs found
                </h3>
                <p className="text-[#0476D9] mb-6 sm:mb-8 text-sm sm:text-lg max-w-md mx-auto leading-relaxed px-4">
                  Try adjusting your search criteria or filters to find more
                  opportunities
                </p>
                <button
                  onClick={() => setFilters({})}
                  className="btn-primary text-sm sm:text-base"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="mt-8 sm:mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalItems={totalJobs}
                  itemsPerPage={jobsPerPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
