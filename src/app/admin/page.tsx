"use client";

import { useState, useEffect } from "react";
import { Save, Trash2, LogOut, BarChart3 } from "lucide-react";
import { Job } from "@/types/job";
import { jobsService } from "@/lib/jobs";
import { supabase } from "@/lib/supabase";
import JobCard from "@/components/JobCard";
import Card from "@/components/ui/Card";
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

export default function AdminPage() {
  // 1. Atualizar o state inicial do formData para incluir todos os campos necessários
  // Corrigir os tipos do formData para usar os tipos do Job
  type FormDataType = {
    title: string;
    company: string;
    location: string;
    type: import("@/types/job").JobType;
    category: import("@/types/job").JobCategory;
    experience: import("@/types/job").ExperienceLevel | "";
    salary_min: string;
    salary_max: string;
    salary_currency: string;
    salary_period: "hourly" | "monthly" | "yearly" | "";
    description: string;
    requirements: string[];
    benefits: string[];
    is_remote: boolean;
    is_active: boolean;
    applicationUrl: string;
    company_logo: string;
    tags: string;
  };

  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    company: "",
    location: "",
    type: "full-time",
    category: "other",
    experience: "",
    salary_min: "",
    salary_max: "",
    salary_currency: "",
    salary_period: "",
    description: "",
    requirements: [],
    benefits: [],
    is_remote: false,
    is_active: true,
    applicationUrl: "",
    company_logo: "",
    tags: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Auth state
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");

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

  // 2. Funções auxiliares para campos dinâmicos (requirements, benefits)
  const handleArrayChange = (
    field: "requirements" | "benefits",
    value: string,
    idx: number
  ) => {
    setFormData((prev) => {
      const arr = [...prev[field]];
      arr[idx] = value;
      return { ...prev, [field]: arr };
    });
  };
  const handleAddArrayItem = (field: "requirements" | "benefits") => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };
  const handleRemoveArrayItem = (
    field: "requirements" | "benefits",
    idx: number
  ) => {
    setFormData((prev) => {
      const arr = [...prev[field]];
      arr.splice(idx, 1);
      return { ...prev, [field]: arr };
    });
  };

  // 3. Atualizar handleInputChange para aceitar checkbox e outros tipos
  // Corrigir handleInputChange para checkbox
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // 4. Atualizar handleSubmit para enviar todos os campos
  // Corrigir o submit para enviar os tipos corretos
  type JobType = import("@/types/job").JobType;
  type JobCategory = import("@/types/job").JobCategory;
  type ExperienceLevel = import("@/types/job").ExperienceLevel;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
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
      const newJob: Omit<Job, "id" | "createdAt" | "updatedAt"> = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        type: formData.type as JobType,
        category: formData.category as JobCategory,
        experience: formData.experience
          ? (formData.experience as ExperienceLevel)
          : undefined,
        salary:
          formData.salary_min && formData.salary_max
            ? {
                min: Number(formData.salary_min),
                max: Number(formData.salary_max),
                currency: formData.salary_currency || undefined,
                period: formData.salary_period
                  ? formData.salary_period
                  : undefined,
              }
            : undefined,
        description: safeHtml,
        requirements: formData.requirements.filter((r) => r.trim().length > 0),
        benefits: formData.benefits.filter((b) => b.trim().length > 0),
        isRemote: formData.is_remote,
        isFeatured: false,
        isActive: formData.is_active,
        applicationUrl: formData.applicationUrl,
        companyLogo: formData.company_logo || undefined,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      };
      const createdJob = await jobsService.createJob(newJob);
      if (!createdJob) {
        throw new Error("Failed to create job");
      }
      setMessage("Job created successfully!");
      setFormData({
        title: "",
        company: "",
        location: "",
        type: "full-time",
        category: "other",
        experience: "",
        salary_min: "",
        salary_max: "",
        salary_currency: "",
        salary_period: "",
        description: "",
        requirements: [],
        benefits: [],
        is_remote: false,
        is_active: true,
        applicationUrl: "",
        company_logo: "",
        tags: "",
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error creating job");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Monta um objeto Job para preview
  const previewJob: Job = {
    id: "preview",
    title: formData.title || "Senior Frontend Developer",
    company: formData.company || "TechCorp",
    location: formData.location || "Remote",
    type: "full-time",
    category: "other",
    experience: undefined,
    salary: undefined,
    description: formData.description || "Job description preview...",
    requirements: [],
    benefits: [],
    isRemote: false,
    isFeatured: false,
    isActive: true,
    applicationUrl: formData.applicationUrl || "https://company.com/apply",
    tags: formData.tags
      ? formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : ["React", "TypeScript"],
    createdAt: new Date(),
    updatedAt: new Date(),
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

  // Painel admin melhorado
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3F7FA] to-[#E5EAF1]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[#011640] mb-2">
              Post a New Job
            </h1>
            <p className="text-lg text-[#0476D9]">
              Fill out the form below to publish a new opportunity
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/admin/analytics"
              className="btn-outline flex items-center gap-2 text-[#0476D9] border-[#0476D9] hover:bg-[#F3F7FA]"
            >
              <BarChart3 className="w-5 h-5" /> Analytics
            </a>
            <button
              onClick={handleLogout}
              className="btn-outline flex items-center gap-2 text-[#0476D9] border-[#0476D9] hover:bg-[#F3F7FA]"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Formulário */}
          <Card className="md:col-span-2 p-8 shadow-lg rounded-2xl border border-[#E5EAF1] bg-white animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 gap-6">
                {/* Título */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-[#011640] mb-2"
                  >
                    Job Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-lg"
                    required
                  />
                </div>
                {/* Empresa */}
                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-[#011640] mb-2"
                  >
                    Company <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-lg"
                    required
                  />
                </div>
                {/* Localização */}
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-[#011640] mb-2"
                  >
                    Location <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-lg"
                    required
                  />
                </div>
                {/* Tipo de vaga */}
                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-[#011640] mb-2"
                  >
                    Type <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-lg"
                    required
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
                {/* Categoria */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-[#011640] mb-2"
                  >
                    Category <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-lg"
                    required
                  >
                    <option value="engineering">Engineering</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="sales">Sales</option>
                    <option value="product">Product</option>
                    <option value="data">Data</option>
                    <option value="operations">Operations</option>
                    <option value="finance">Finance</option>
                    <option value="development">Development</option>
                    <option value="hr">HR</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                {/* Nível de experiência */}
                <div>
                  <label
                    htmlFor="experience"
                    className="block text-sm font-medium text-[#011640] mb-2"
                  >
                    Experience
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-lg"
                  >
                    <option value="">Select...</option>
                    <option value="entry">Entry</option>
                    <option value="junior">Junior</option>
                    <option value="mid">Mid</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>
                {/* Faixa salarial */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="salary_min"
                      className="block text-sm font-medium text-[#011640] mb-2"
                    >
                      Salary Min
                    </label>
                    <input
                      type="number"
                      id="salary_min"
                      name="salary_min"
                      value={formData.salary_min}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-lg"
                      min="0"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="salary_max"
                      className="block text-sm font-medium text-[#011640] mb-2"
                    >
                      Salary Max
                    </label>
                    <input
                      type="number"
                      id="salary_max"
                      name="salary_max"
                      value={formData.salary_max}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-lg"
                      min="0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="salary_period"
                      className="block text-sm font-medium text-[#011640] mb-2"
                    >
                      Period
                    </label>
                    <select
                      id="salary_period"
                      name="salary_period"
                      value={formData.salary_period}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-lg"
                    >
                      <option value="">Select...</option>
                      <option value="hourly">Hourly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  {/* currency permanece input texto */}
                  <div>
                    <label
                      htmlFor="salary_currency"
                      className="block text-sm font-medium text-[#011640] mb-2"
                    >
                      Currency
                    </label>
                    <input
                      type="text"
                      id="salary_currency"
                      name="salary_currency"
                      value={formData.salary_currency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-lg"
                      placeholder="e.g. USD, BRL"
                    />
                  </div>
                </div>
                {/* Requirements dinâmico */}
                <div>
                  <label className="block text-sm font-medium text-[#011640] mb-2">
                    Requirements
                  </label>
                  {formData.requirements.map((req, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) =>
                          handleArrayChange("requirements", e.target.value, idx)
                        }
                        className="flex-1 px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-lg"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveArrayItem("requirements", idx)
                        }
                        className="text-red-500 font-bold"
                      >
                        x
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddArrayItem("requirements")}
                    className="text-[#0476D9] text-sm font-medium mt-1"
                  >
                    + Add requirement
                  </button>
                </div>
                {/* Benefits dinâmico */}
                <div>
                  <label className="block text-sm font-medium text-[#011640] mb-2">
                    Benefits
                  </label>
                  {formData.benefits.map((ben, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={ben}
                        onChange={(e) =>
                          handleArrayChange("benefits", e.target.value, idx)
                        }
                        className="flex-1 px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveArrayItem("benefits", idx)}
                        className="text-red-500 font-bold"
                      >
                        x
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddArrayItem("benefits")}
                    className="text-[#0476D9] text-sm font-medium mt-1"
                  >
                    + Add benefit
                  </button>
                </div>
                {/* Remote e Ativa */}
                <div className="flex gap-6 items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_remote"
                      checked={formData.is_remote}
                      onChange={handleInputChange}
                      className="accent-[#0476D9] w-5 h-5"
                    />
                    Remote
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="accent-[#0476D9] w-5 h-5"
                    />
                    Active
                  </label>
                </div>
                {/* Logo da empresa */}
                <div>
                  <label
                    htmlFor="company_logo"
                    className="block text-sm font-medium text-[#011640] mb-2"
                  >
                    Company Logo URL
                  </label>
                  <input
                    type="url"
                    id="company_logo"
                    name="company_logo"
                    value={formData.company_logo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-lg"
                    placeholder="https://logo.com/image.png"
                  />
                </div>
                {/* Skills */}
                <div>
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium text-[#011640] mb-2"
                  >
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="e.g. React, TypeScript, Remote, Frontend"
                    className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-lg"
                  />
                  <p className="text-xs text-[#0476D9] mt-1">
                    Skills help candidates find your job more easily
                  </p>
                </div>
                {/* Link de candidatura */}
                <div>
                  <label
                    htmlFor="applicationUrl"
                    className="block text-sm font-medium text-[#011640] mb-2"
                  >
                    Application Link <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="url"
                    id="applicationUrl"
                    name="applicationUrl"
                    value={formData.applicationUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-lg"
                    required
                  />
                </div>
                {/* Descrição */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-[#011640] mb-2"
                  >
                    Job Description <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={10}
                    className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent font-mono text-sm"
                    required
                  />
                  <p className="text-xs text-[#0476D9] mt-1">
                    Use Markdown to format the description. Supports headings,
                    lists, bold text, etc.
                  </p>
                </div>
              </div>
              {message && (
                <div
                  className={`p-4 rounded-xl text-center mt-4 ${
                    message.includes("successfully")
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  } animate-fade-in`}
                >
                  {message}
                </div>
              )}
              <div className="flex items-center justify-between pt-8 border-t border-[#E5EAF1] mt-8 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      title: "",
                      company: "",
                      location: "",
                      type: "full-time",
                      category: "other",
                      experience: "",
                      salary_min: "",
                      salary_max: "",
                      salary_currency: "",
                      salary_period: "",
                      description: "",
                      requirements: [],
                      benefits: [],
                      is_remote: false,
                      is_active: true,
                      applicationUrl: "",
                      company_logo: "",
                      tags: "",
                    });
                    setMessage("");
                  }}
                  className="btn-secondary inline-flex items-center"
                  disabled={isSubmitting}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Form
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary inline-flex items-center text-lg px-8 py-4"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Publish Job
                    </>
                  )}
                </button>
              </div>
            </form>
          </Card>
          {/* Preview do Card */}
          <div className="hidden md:block">
            <h3 className="text-lg font-semibold text-[#011640] mb-4">
              Live Card Preview
            </h3>
            <JobCard job={previewJob} />
          </div>
        </div>
      </div>
    </div>
  );
}
