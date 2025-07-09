"use client";

import { useState, useEffect } from "react";
import { Save, Trash2, LogOut, Eye } from "lucide-react";
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
        <span className="text-[#011640] text-lg font-semibold animate-pulse">Loading...</span>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    tags: "",
    description: "",
    applicationUrl: "",
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
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => { listener.subscription.unsubscribe(); };
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      if (
        !formData.title ||
        !formData.company ||
        !formData.location ||
        !formData.description ||
        !formData.applicationUrl
      ) {
        throw new Error("All required fields must be filled");
      }
      // Converter Markdown para HTML e sanitizar
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
        type: 'full-time',
        category: 'other',
        experience: undefined,
        salary: undefined,
        description: safeHtml, // Salva HTML sanitizado!
        requirements: [],
        benefits: [],
        isRemote: false,
        isFeatured: false,
        isActive: true,
        applicationUrl: formData.applicationUrl,
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
        tags: "",
        description: "",
        applicationUrl: "",
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
    type: 'full-time',
    category: 'other',
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
      ? formData.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0)
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
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl space-y-6 border border-slate-100 animate-fade-in">
          <h2 className="text-2xl font-bold text-[#011640] mb-4 text-center">Admin Login</h2>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email</label>
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
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">Password</label>
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
          {loginError && <div className="text-red-600 text-sm text-center animate-fade-in">{loginError}</div>}
          <button
            type="submit"
            className="btn-primary w-full text-lg py-3 flex items-center justify-center"
            disabled={authLoading}
          >
            {authLoading ? 'Logging in...' : 'Login'}
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
            <h1 className="text-4xl font-bold text-[#011640] mb-2">Post a New Job</h1>
            <p className="text-lg text-[#0476D9]">Fill out the form below to publish a new opportunity</p>
          </div>
          <button onClick={handleLogout} className="btn-outline flex items-center gap-2 text-[#0476D9] border-[#0476D9] hover:bg-[#F3F7FA]">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Formulário */}
          <Card className="md:col-span-2 p-8 shadow-lg rounded-2xl border border-[#E5EAF1] bg-white animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-[#011640] mb-2">Job Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Senior Frontend Developer"
                    className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-lg"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-[#011640] mb-2">Company *</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="e.g. TechCorp"
                    className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-lg"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-[#011640] mb-2">Location *</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Remote, San Francisco, CA"
                    className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-lg"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-[#011640] mb-2">Skills (comma-separated)</label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="e.g. React, TypeScript, Remote, Frontend"
                    className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-lg"
                  />
                  <p className="text-xs text-[#0476D9] mt-1">Skills help candidates find your job more easily</p>
                </div>
                <div>
                  <label htmlFor="applicationUrl" className="block text-sm font-medium text-[#011640] mb-2">Application Link *</label>
                  <input
                    type="url"
                    id="applicationUrl"
                    name="applicationUrl"
                    value={formData.applicationUrl}
                    onChange={handleInputChange}
                    placeholder="https://your-company.com/careers/job"
                    className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-lg"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-[#011640] mb-2">Job Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={10}
                    placeholder={`# Job Title\n\nDescribe the opportunity and responsibilities...\n\n## Responsibilities:\n- Item 1\n- Item 2\n- Item 3\n\n## Requirements:\n- Item 1\n- Item 2\n- Item 3\n\n## Benefits:\n- Item 1\n- Item 2\n- Item 3`}
                    className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent font-mono text-sm"
                    required
                  />
                  <p className="text-xs text-[#0476D9] mt-1">Use Markdown to format the description. Supports headings, lists, bold text, etc.</p>
                </div>
              </div>
              {message && (
                <div className={`p-4 rounded-xl text-center mt-4 ${message.includes("successfully") ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"} animate-fade-in`}>
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
                      tags: "",
                      description: "",
                      applicationUrl: "",
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
            <h3 className="text-lg font-semibold text-[#011640] mb-4">Live Card Preview</h3>
            <JobCard job={previewJob} />
          </div>
        </div>
      </div>
    </div>
  );
}
