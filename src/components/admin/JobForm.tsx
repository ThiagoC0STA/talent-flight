import { useState } from "react";
import { Save, Trash2 } from "lucide-react";
import Card from "@/components/ui/Card";
import JobCard from "@/components/JobCard";
import { Job } from "@/types/job";

interface JobFormProps {
  isEditing: boolean;
  editingJob: Job | null;
  onSubmit: (formData: any) => Promise<void>;
  onReset: () => void;
  isSubmitting: boolean;
  message: string;
}

export default function JobForm({
  isEditing,
  editingJob,
  onSubmit,
  onReset,
  isSubmitting,
  message,
}: JobFormProps) {
  const [formData, setFormData] = useState({
    title: editingJob?.title || "",
    company: editingJob?.company || "",
    location: editingJob?.location || "",
    type: editingJob?.type || "full-time",
    category: editingJob?.category || "other",
    experience: editingJob?.experience || "",
    salary_min: editingJob?.salary?.min?.toString() || "",
    salary_max: editingJob?.salary?.max?.toString() || "",
    salary_currency: editingJob?.salary?.currency || "",
    salary_period: editingJob?.salary?.period || "",
    description: editingJob?.description || "",
    requirements: editingJob?.requirements || [],
    benefits: editingJob?.benefits || [],
    is_remote: editingJob?.isRemote || false,
    is_active: editingJob?.isActive ?? true,
    applicationUrl: editingJob?.applicationUrl || "",
    company_logo: editingJob?.companyLogo || "",
    tags: editingJob?.tags?.join(", ") || "",
    created_at: editingJob
      ? new Date(editingJob.createdAt).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const previewJob: Job = {
    id: "preview",
    title: formData.title || "Senior Frontend Developer",
    company: formData.company || "TechCorp",
    location: formData.location || "Remote",
    type: formData.type as any,
    category: formData.category as any,
    experience: formData.experience as any,
    salary:
      formData.salary_min && formData.salary_max
        ? {
            min: Number(formData.salary_min),
            max: Number(formData.salary_max),
            currency: formData.salary_currency,
            period: formData.salary_period as any,
          }
        : undefined,
    description: formData.description || "Job description preview...",
    requirements: formData.requirements.filter((r) => r.trim().length > 0),
    benefits: formData.benefits.filter((b) => b.trim().length > 0),
    isRemote: formData.is_remote,
    isFeatured: false,
    isActive: formData.is_active,
    applicationUrl: formData.applicationUrl || "https://company.com/apply",
    companyLogo: formData.company_logo || undefined,
    tags: formData.tags
      ? formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : ["React", "TypeScript"],
    createdAt: new Date(formData.created_at),
    updatedAt: new Date(),
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form */}
      <Card className="lg:col-span-2 p-8 shadow-lg rounded-2xl border border-[#E5EAF1] bg-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#011640]">
            {isEditing ? "Edit Job" : "Create New Job"}
          </h2>
          <button
            onClick={onReset}
            className="text-[#0476D9] hover:text-[#0366C4] font-medium"
          >
            {isEditing ? "Cancel Edit" : "Clear Form"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#011640] mb-2">
                Job Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#011640] mb-2">
                Company <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent"
                required
              />
            </div>
          </div>
          {/* Company Logo */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-[#011640] mb-2">
              Company Logo URL
            </label>
            <input
              type="text"
              name="company_logo"
              value={formData.company_logo}
              onChange={handleInputChange}
              placeholder="https://..."
              className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent"
            />
            {formData.company_logo && (
              <div className="mt-2">
                <img
                  src={formData.company_logo}
                  alt="Logo Preview"
                  className="h-12 rounded-xl border border-[#E5EAF1] bg-white"
                  style={{ maxWidth: 120, objectFit: 'contain' }}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#011640] mb-2">
                Location <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#011640] mb-2">
                Type <span className="text-red-600">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent"
                required
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#011640] mb-2">
                Category <span className="text-red-600">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent"
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
          </div>

          {/* Created Date */}
          <div>
            <label className="block text-sm font-medium text-[#011640] mb-2">
              Created Date <span className="text-gray-500">(for SEO)</span>
            </label>
            <input
              type="date"
              name="created_at"
              value={formData.created_at}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent"
            />
          </div>

          {/* Salary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#011640] mb-2">
                Salary Min
              </label>
              <input
                type="number"
                name="salary_min"
                value={formData.salary_min}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#011640] mb-2">
                Salary Max
              </label>
              <input
                type="number"
                name="salary_max"
                value={formData.salary_max}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#011640] mb-2">
                Currency
              </label>
              <input
                type="text"
                name="salary_currency"
                value={formData.salary_currency}
                onChange={handleInputChange}
                placeholder="USD"
                className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#011640] mb-2">
                Period
              </label>
              <select
                name="salary_period"
                value={formData.salary_period}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent"
              >
                <option value="">Select...</option>
                <option value="hourly">Hourly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#011640] mb-2">
              Job Description <span className="text-red-600">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={8}
              className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent font-mono text-sm"
              required
            />
            <p className="text-xs text-[#0476D9] mt-1">
              Use Markdown to format the description
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-[#011640] mb-2">
              Skills/Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="React, TypeScript, Remote, Frontend"
              className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent"
            />
          </div>

          {/* Application URL */}
          <div>
            <label className="block text-sm font-medium text-[#011640] mb-2">
              Application URL <span className="text-red-600">*</span>
            </label>
            <input
              type="url"
              name="applicationUrl"
              value={formData.applicationUrl}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent"
              required
            />
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6">
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

          {message && (
            <div
              className={`p-4 rounded-xl text-center ${
                message.includes("successfully")
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              } animate-fade-in`}
            >
              {message}
            </div>
          )}

          <div className="flex items-center justify-between pt-6 border-t border-[#E5EAF1]">
            <button
              type="button"
              onClick={onReset}
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
                  {isEditing ? "Updating..." : "Publishing..."}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  {isEditing ? "Update Job" : "Publish Job"}
                </>
              )}
            </button>
          </div>
        </form>
      </Card>

      {/* Preview */}
      <div className="hidden lg:block">
        <h3 className="text-lg font-semibold text-[#011640] mb-4">
          Live Preview
        </h3>
        <JobCard job={previewJob} />
      </div>
    </div>
  );
}
