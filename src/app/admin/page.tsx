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
  TrendingUp,
  MousePointer,
  CheckCircle,
  XCircle,
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
import { marked } from "marked";
import DOMPurify from "dompurify";

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
    <div className="fixed top-6 right-6 z-50 bg-[#0476D9] text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-4 animate-fade-in">
      <span>{message}</span>
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

  // Jobs state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Load jobs when user is authenticated
  useEffect(() => {
    if (user) {
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
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
    });
    if (error) {
      setLoginError(error.message);
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
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
  };

  const handleDelete = async (jobId: string) => {
    if (confirm("Are you sure you want to delete this job?")) {
      try {
        await jobsService.deleteJob(jobId);
        await loadJobs();
        setMessage("Job deleted successfully!");
      } catch (error) {
        setMessage("Error deleting job");
      }
    }
  };

  const handleToggleActive = async (job: Job) => {
    try {
      const updatedJob = { ...job, isActive: !job.isActive };
      await jobsService.updateJob(job.id, updatedJob);
      await loadJobs();
      setMessage(
        `Job ${job.isActive ? "deactivated" : "activated"} successfully!`
      );
    } catch (error) {
      setMessage("Error updating job status");
    }
  };

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    setMessage("");
    setToast("");
    try {
      if (
        !formData.title ||
        !formData.company ||
        !formData.location ||
        !formData.type ||
        !formData.category ||
        !formData.applicationUrl ||
        !formData.description
      ) {
        throw new Error("All required fields must be filled");
      }

      let rawHtml: string;
      const parsed = marked.parse(formData.description);
      if (parsed instanceof Promise) {
        rawHtml = await parsed;
      } else {
        rawHtml = parsed as string;
      }
      const safeHtml = DOMPurify.sanitize(rawHtml);

      const jobData = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        type: formData.type,
        category: formData.category,
        experience: formData.experience
          ? (formData.experience as any)
          : undefined,
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
        createdAt: new Date(formData.created_at + "T00:00:00"),
      };

      let result;
      if (isEditing && editingJob) {
        result = await jobsService.updateJob(editingJob.id, jobData);
        if (result) {
          setToast("Vaga atualizada com sucesso!");
          setActiveTab("jobs");
        } else {
          setToast("Erro ao atualizar vaga");
        }
      } else {
        result = await jobsService.createJob(jobData);
        if (result) {
          setToast("Vaga criada com sucesso!");
          setActiveTab("jobs");
        } else {
          setToast("Erro ao criar vaga");
        }
      }

      if (result) {
        resetForm();
        await loadJobs();
      }
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Erro ao salvar vaga");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F3F7FA] to-[#E5EAF1]">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl space-y-6 border border-slate-100 animate-fade-in"
        >
          <h2 className="text-2xl font-bold text-[#011640] mb-4 text-center">
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
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-lg"
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
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-lg"
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
            className="btn-primary w-full text-lg py-3 flex items-center justify-center"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#011640] mb-2">
              Admin Dashboard
            </h1>
            <p className="text-lg text-[#0476D9]">
              Manage jobs and view analytics
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-outline flex items-center gap-2 text-[#0476D9] border-[#0476D9] hover:bg-[#F3F7FA]"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/80 backdrop-blur-sm rounded-xl p-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              { id: "analytics", label: "Analytics", icon: TrendingUp },
              { id: "jobs", label: "All Jobs", icon: Briefcase },
              {
                id: "create",
                label: isEditing ? "Edit Job" : "Create Job",
                icon: Plus,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
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
          <div className="space-y-8">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {/* Recent Jobs */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-[#011640] mb-4">
                Recent Jobs
              </h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-[#0476D9] border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobs.slice(0, 6).map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#011640]">
                Analytics & Insights
              </h2>
              <div className="text-sm text-gray-600">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>

            {/* Click Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-[#0476D9] border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : (
              <AnalyticsCharts jobs={jobs} />
            )}
          </div>
        )}

        {activeTab === "jobs" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#011640]">
                All Jobs ({jobs.length})
              </h2>
              <button
                onClick={() => {
                  resetForm();
                  setActiveTab("create");
                }}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create New Job
              </button>
            </div>

            <JobTable
              jobs={jobs}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
              loading={loading}
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
        <Toast message={toast} onClose={() => setToast("")} />
      </div>
    </div>
  );
}
