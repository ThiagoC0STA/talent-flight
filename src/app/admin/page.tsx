"use client";

import { useState, useEffect } from "react";
import {
  LogOut,
  BarChart3,
  Plus,
  Briefcase,
  Eye,
  MapPin,
  Users,
  MousePointer,
  CheckCircle,
  XCircle,
  Menu,
  X,
  Search,
  Clock,
} from "lucide-react";
import { Job } from "@/types/job";
import { jobsService, trackingService } from "@/lib/jobs";
import { supabase } from "@/lib/supabase";
import JobCard from "@/components/JobCard";
import Card from "@/components/ui/Card";
import AnalyticsCard from "@/components/admin/AnalyticsCard";
import JobTable from "@/components/admin/JobTable";
import JobForm from "@/components/admin/JobForm";
import AnalyticsCharts from "@/components/admin/AnalyticsCharts";
import GA4Analytics from "@/components/admin/GA4Analytics";
import { marked } from "marked";
import DOMPurify from "dompurify";
import JobFilters from "@/components/admin/JobFilters";
import Pagination from "@/components/admin/Pagination";
import JobAggregator from "@/components/admin/JobAggregator";
import SearchHistoryTab from "@/components/admin/SearchHistoryTab";

function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#0476D9] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-[#011640] text-lg font-semibold animate-pulse">
          Loading...
        </span>
      </div>
    </div>
  );
}

// Toast simples
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  if (!message) return null;
  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto sm:right-6 z-50 bg-[#0476D9] text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-4 animate-fade-in">
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-white/80 hover:text-white font-bold"
      >
        ×
      </button>
    </div>
  );
}

export default function AdminPage() {
  // Auth state
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");

  // Tabs state
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Jobs state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Analytics state
  const [analytics, setAnalytics] = useState({
    totalJobs: 0,
    activeJobs: 0,
    remoteJobs: 0,
    totalCompanies: 0,
  });

  // Click analytics state
  const [clickAnalytics, setClickAnalytics] = useState({
    totalClicks: 0,
    validClicks: 0,
    invalidClicks: 0,
    conversionRate: 0,
  });

  const [toast, setToast] = useState("");

  const [filters, setFilters] = useState({
    query: "",
    status: "",
    type: "",
    category: "",
    experience: "",
    remote: "",
    featured: "",
  });
  const [showInvalidOnly, setShowInvalidOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Simulação de links inválidos (depois integrar com analytics real)
  const [invalidJobIds, setInvalidJobIds] = useState<string[]>([]);

  // Filtros dinâmicos
  const categories = Array.from(new Set(jobs.map((j) => j.category))).filter(
    Boolean
  );
  const types = Array.from(new Set(jobs.map((j) => j.type))).filter(Boolean);

  // Filtragem - agora usa os jobs carregados diretamente
  const filteredJobs = jobs.filter((job) => {
    if (showInvalidOnly && !invalidJobIds.includes(job.id)) return false;
    return true;
  });

  // Paginação
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Resetar página ao filtrar
  useEffect(() => {
    setCurrentPage(1);
  }, [showInvalidOnly]);

  // Buscar jobs com links inválidos (analytics real)
  useEffect(() => {
    let ignore = false;
    async function fetchInvalidJobs() {
      if (!showInvalidOnly) {
        setInvalidJobIds([]);
        return;
      }
      const clicks = await trackingService.getClickStats();
      // Agrupar por job_id e contar inválidos
      const invalidMap: Record<string, number> = {};
      clicks.forEach((click: any) => {
        if (click.is_valid === false) {
          invalidMap[click.job_id] = (invalidMap[click.job_id] || 0) + 1;
        }
      });
      const ids = Object.keys(invalidMap).filter((id) => invalidMap[id] > 0);
      if (!ignore) setInvalidJobIds(ids);
    }
    fetchInvalidJobs();
    return () => {
      ignore = true;
    };
  }, [showInvalidOnly, jobs]);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setAuthLoading(false);
    };
    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Load jobs only once when user is authenticated
  useEffect(() => {
    if (user && jobs.length === 0) {
      loadJobs();
    }
  }, [user]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const allJobs = await jobsService.getAllJobs();
      setJobs(allJobs);

      // Calculate analytics
      const activeJobs = allJobs.filter((job) => job.isActive).length;
      const remoteJobs = allJobs.filter((job) => job.isRemote).length;
      const uniqueCompanies = new Set(allJobs.map((job) => job.company)).size;

      setAnalytics({
        totalJobs: allJobs.length,
        activeJobs,
        remoteJobs,
        totalCompanies: uniqueCompanies,
      });

      // Load click analytics
      try {
        const clickData = await trackingService.getClickSummary();
        const conversionRate =
          clickData.totalClicks > 0
            ? (clickData.validClicks / clickData.totalClicks) * 100
            : 0;

        setClickAnalytics({
          totalClicks: clickData.totalClicks,
          validClicks: clickData.validClicks,
          invalidClicks: clickData.invalidClicks,
          conversionRate,
        });
      } catch (error) {
        console.error("Error loading click analytics:", error);
      }
    } catch (error) {
      console.error("Error loading jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const { error } = await supabase.auth.signInWithPassword(loginData);
      if (error) throw error;
    } catch (error: any) {
      setLoginError(error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingJob(null);
    setMessage("");
  };

  const handleEdit = (job: Job) => {
    setIsEditing(true);
    setEditingJob(job);
    setActiveTab("create");
    setMobileMenuOpen(false);
  };

  const handleDelete = async (jobId: string) => {
    try {
      await jobsService.deleteJob(jobId);
      // Remove job from local state instead of reloading all
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
      setToast("Job deleted successfully!");
    } catch (error) {
      console.error("Erro ao deletar vaga:", error);
      setToast("Error deleting job");
    }
  };

  const handleToggleActive = async (job: Job) => {
    try {
      const updatedJob = await jobsService.updateJob(job.id, {
        isActive: !job.isActive,
      });
      if (updatedJob) {
        // Update job in local state instead of reloading all
        setJobs((prevJobs) =>
          prevJobs.map((j) => (j.id === job.id ? updatedJob : j))
        );
        setToast(
          `Job ${
            updatedJob.isActive ? "activated" : "deactivated"
          } successfully!`
        );
      }
    } catch (error) {
      console.error("Erro ao alterar status da vaga:", error);
      setToast("Error changing job status");
    }
  };

  const handleToggleRemote = async (job: Job) => {
    try {
      const updatedJob = await jobsService.updateJob(job.id, {
        isRemote: !job.isRemote,
      });
      if (updatedJob) {
        // Update job in local state instead of reloading all
        setJobs((prevJobs) =>
          prevJobs.map((j) => (j.id === job.id ? updatedJob : j))
        );
        setToast(
          `Job marked as ${
            updatedJob.isRemote ? "remote" : "not remote"
          } successfully!`
        );
      }
    } catch (error) {
      console.error("Erro ao alterar status remote da vaga:", error);
      setToast("Error changing job remote status");
    }
  };

  const handleImportJob = async (
    jobData: Omit<Job, "id" | "createdAt" | "updatedAt"> & {
      createdAt?: Date | string;
    }
  ): Promise<boolean> => {
    try {
      const result = await jobsService.createJob(jobData);
      if (result) {
        // Add new job to local state instead of reloading all
        setJobs((prevJobs) => [...prevJobs, result]);
        setToast("Job imported successfully!");
        return true;
      } else {
        setToast("Error importing job");
        return false;
      }
    } catch (error) {
      console.error("Erro ao importar vaga:", error);
      setToast("Error importing job");
      return false;
    }
  };

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      // Sanitize HTML description
      const rawHtml = await marked(formData.description);
      const safeHtml = DOMPurify.sanitize(rawHtml);

      let createdAtDate: Date;

      if (isEditing && editingJob && formData.created_at) {
        // Se é edição e tem data, usar a data do form
        createdAtDate = new Date(formData.created_at + "T00:00:00");

        // Validar se a data é válida
        if (isNaN(createdAtDate.getTime())) {
          createdAtDate = new Date();
        }
      } else {
        // Se é nova vaga, usar data atual
        createdAtDate = new Date();
      }

      console.log("=== ADMIN DEBUG ===");
      console.log("formData.created_at:", formData.created_at);
      console.log("createdAtDate:", createdAtDate);
      console.log("createdAtDate.toISOString():", createdAtDate.toISOString());

      const jobData = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        type: formData.type,
        category: formData.category,
        experience: formData.experience,
        salary:
          formData.salary_min && formData.salary_max
            ? {
                min: Number(formData.salary_min),
                max: Number(formData.salary_max),
                currency: formData.salary_currency || undefined,
                period:
                  (formData.salary_period as "hourly" | "monthly" | "yearly") ||
                  undefined,
              }
            : undefined,
        description: safeHtml,
        requirements: formData.requirements.filter(
          (r: string) => r.trim().length > 0
        ),
        benefits: formData.benefits.filter((b: string) => b.trim().length > 0),
        isRemote: formData.is_remote,
        isFeatured: false,
        isActive: formData.is_active,
        applicationUrl: formData.applicationUrl,
        companyLogo: formData.company_logo || undefined,
        tags: formData.tags
          .split(",")
          .map((tag: string) => tag.trim())
          .filter((tag: string) => tag.length > 0),
        createdAt: createdAtDate,
      };

      console.log("jobData enviado:", jobData);
      let result;
      if (isEditing && editingJob) {
        result = await jobsService.updateJob(editingJob.id, jobData);
        if (result) {
          setToast("Job updated successfully!");
          setActiveTab("jobs");
        } else {
          setToast("Error updating job");
        }
      } else {
        result = await jobsService.createJob(jobData);

        if (result) {
          setToast("Job created successfully!");
          setActiveTab("jobs");
        } else {
          setToast("Error creating job");
        }
      }

      if (result) {
        resetForm();
        // Update jobs in local state instead of reloading all
        if (isEditing && editingJob) {
          setJobs((prevJobs) =>
            prevJobs.map((job) => (job.id === editingJob.id ? result : job))
          );
        } else {
          setJobs((prevJobs) => [...prevJobs, result]);
        }
      }
    } catch (error) {
      console.error("Erro no submit:", error);
      setToast(error instanceof Error ? error.message : "Error saving job");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F3F7FA] to-[#E5EAF1] p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-white p-6 sm:p-8 rounded-2xl shadow-xl space-y-6 border border-slate-100 animate-fade-in"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-[#011640] mb-4 text-center">
            Admin Login
          </h2>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-base sm:text-lg"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-base sm:text-lg"
              required
            />
          </div>
          {loginError && (
            <div className="text-red-600 text-sm text-center animate-fade-in">
              {loginError}
            </div>
          )}
          <button
            type="submit"
            className="btn-primary w-full text-base sm:text-lg py-3 flex items-center justify-center"
            disabled={authLoading}
          >
            {authLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3F7FA] to-[#E5EAF1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#011640] mb-2">
              Admin Dashboard
            </h1>
            <p className="text-base sm:text-lg text-[#0476D9]">
              Manage jobs and view analytics
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-outline flex items-center gap-2 text-[#0476D9] border-[#0476D9] hover:bg-[#F3F7FA] w-full sm:w-auto justify-center"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="sm:hidden mb-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between"
          >
            <span className="font-medium text-[#011640]">Menu</span>
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-[#0476D9]" />
            ) : (
              <Menu className="w-5 h-5 text-[#0476D9]" />
            )}
          </button>
        </div>

        {/* Tabs */}
        <div
          className={`mb-6 sm:mb-8 ${
            mobileMenuOpen ? "block" : "hidden sm:block"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:space-x-1 bg-white/80 backdrop-blur-sm rounded-xl p-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              { id: "jobs", label: "All Jobs", icon: Briefcase },
              {
                id: "create",
                label: isEditing ? "Edit Job" : "Create Job",
                icon: Plus,
              },
              { id: "search", label: "Search Jobs", icon: Search },
              { id: "history", label: "History", icon: Clock },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-3 sm:py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-[#0476D9] text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 sm:space-y-8">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <AnalyticsCard
                title="Total Jobs"
                value={analytics.totalJobs}
                icon={Briefcase}
                color="bg-blue-500"
                trend={{ value: 12, isPositive: true }}
              />
              <AnalyticsCard
                title="Active Jobs"
                value={analytics.activeJobs}
                icon={Eye}
                color="bg-green-500"
                trend={{ value: 8, isPositive: true }}
              />
              <AnalyticsCard
                title="Remote Jobs"
                value={analytics.remoteJobs}
                icon={MapPin}
                color="bg-purple-500"
                trend={{ value: 15, isPositive: true }}
              />
              <AnalyticsCard
                title="Companies"
                value={analytics.totalCompanies}
                icon={Users}
                color="bg-orange-500"
                trend={{ value: 5, isPositive: true }}
              />
            </div>

            {/* Analytics de Cliques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <AnalyticsCard
                title="Total Clicks"
                value={clickAnalytics.totalClicks}
                icon={MousePointer}
                color="bg-blue-500"
                trend={{ value: 0, isPositive: true }}
              />
              <AnalyticsCard
                title="Valid Clicks"
                value={clickAnalytics.validClicks}
                icon={CheckCircle}
                color="bg-green-500"
                trend={{ value: 0, isPositive: true }}
              />
              <AnalyticsCard
                title="Invalid Clicks"
                value={clickAnalytics.invalidClicks}
                icon={XCircle}
                color="bg-red-500"
                trend={{ value: 0, isPositive: false }}
              />
              <AnalyticsCard
                title="Conversion Rate"
                value={`${clickAnalytics.conversionRate.toFixed(1)}%`}
                icon={BarChart3}
                color="bg-purple-500"
                trend={{ value: 0, isPositive: true }}
              />
            </div>

            {/* Gráficos de Analytics */}
            <AnalyticsCharts jobs={jobs} />

            <GA4Analytics />

            {/* Recent Jobs */}
            <Card className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-[#011640] mb-4">
                Recent Jobs
              </h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-[#0476D9] border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {jobs.slice(0, 6).map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === "jobs" && (
          <div className="space-y-4 sm:space-y-6">
            <JobFilters
              filters={filters}
              onChange={setFilters}
              onSearch={async () => {
                setSearchLoading(true);
                try {
                  const searchResults = await jobsService.searchJobsAdmin(filters);
                  setJobs(searchResults);
                  setCurrentPage(1);
                } catch (error) {
                  console.error("Erro na busca:", error);
                  setToast("Erro ao buscar vagas");
                } finally {
                  setSearchLoading(false);
                }
              }}
              onClear={async () => {
                const emptyFilters = {
                  query: "",
                  status: "",
                  type: "",
                  category: "",
                  experience: "",
                  remote: "",
                  featured: "",
                };
                setFilters(emptyFilters);
                setCurrentPage(1);
                setSearchLoading(true);
                try {
                  const allJobs = await jobsService.getAllJobs();
                  setJobs(allJobs);
                } catch (error) {
                  console.error("Erro ao carregar vagas:", error);
                  setToast("Erro ao carregar vagas");
                } finally {
                  setSearchLoading(false);
                }
              }}
              showInvalidOnly={showInvalidOnly}
              onToggleInvalid={setShowInvalidOnly}
              categories={categories}
              types={types}
              loading={searchLoading}
            />
            <JobTable
              jobs={paginatedJobs}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
              onToggleRemote={handleToggleRemote}
              loading={loading || searchLoading}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {activeTab === "create" && (
          <JobForm
            isEditing={isEditing}
            editingJob={editingJob}
            onSubmit={handleSubmit}
            onReset={resetForm}
            isSubmitting={isSubmitting}
            message={message}
          />
        )}

        {activeTab === "search" && (
          <JobAggregator
            onImportJob={handleImportJob}
            isSubmitting={isSubmitting}
          />
        )}

        {activeTab === "history" && (
          <SearchHistoryTab
            onImportJob={handleImportJob}
            isSubmitting={isSubmitting}
          />
        )}
        <Toast message={toast} onClose={() => setToast("")} />
      </div>
    </div>
  );
}
