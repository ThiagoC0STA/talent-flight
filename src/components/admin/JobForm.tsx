import { useState } from "react";
import { Save, Trash2 } from "lucide-react";
import Card from "@/components/ui/Card";
import JobCard from "@/components/JobCard";
import { Job } from "@/types/job";
import Image from "next/image";

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
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-8">
      {/* Form */}
      <Card className="xl:col-span-2 p-4 sm:p-6 lg:p-8 shadow-lg rounded-2xl border border-[#E5EAF1] bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#011640]">
            {isEditing ? "Edit Job" : "Create New Job"}
          </h2>
          <button
            onClick={onReset}
            className="text-[#0476D9] hover:text-[#0366C4] font-medium text-sm sm:text-base"
          >
            {isEditing ? "Cancel Edit" : "Clear Form"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-[#011640] mb-2">
                Job Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-sm sm:text-base"
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
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-sm sm:text-base"
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
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-sm sm:text-base"
            />
            {formData.company_logo && (
              <div className="mt-2">
                <Image
                  src={formData.company_logo}
                  alt="Logo Preview"
                  className="h-12 rounded-xl border border-[#E5EAF1] bg-white"
                  style={{ maxWidth: 120, objectFit: "contain" }}
                  width={120}
                  height={120}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-[#011640] mb-2">
                Location <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-sm sm:text-base"
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
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-sm sm:text-base"
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
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-sm sm:text-base"
                required
              >
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="fullstack">Fullstack</option>
                <option value="mobile">Mobile</option>
                <option value="devops">DevOps</option>
                <option value="data">Data</option>
                <option value="design">Design</option>
                <option value="product">Product</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-[#011640] mb-2">
                Experience Level
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-sm sm:text-base"
              >
                <option value="">Select Experience</option>
                <option value="intern">Intern</option>
                <option value="junior">Junior</option>
                <option value="junior-mid">Junior-Mid</option>
                <option value="mid">Mid</option>
                <option value="mid-senior">Mid-Senior</option>
                <option value="senior">Senior</option>
                <option value="between">Between Levels</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#011640] mb-2">
                Application URL <span className="text-red-600">*</span>
              </label>
              <input
                type="url"
                name="applicationUrl"
                value={formData.applicationUrl}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#011640] mb-2">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="React, TypeScript, Node.js"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Salary Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-[#011640] mb-2">
                Min Salary
              </label>
              <input
                type="number"
                name="salary_min"
                value={formData.salary_min}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#011640] mb-2">
                Max Salary
              </label>
              <input
                type="number"
                name="salary_max"
                value={formData.salary_max}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#011640] mb-2">
                Currency
              </label>
              <select
                name="salary_currency"
                value={formData.salary_currency}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-sm sm:text-base"
              >
                <option value="">Select Currency</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="BRL">BRL</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#011640] mb-2">
                Period
              </label>
              <select
                name="salary_period"
                value={formData.salary_period}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-sm sm:text-base"
              >
                <option value="">Select Period</option>
                <option value="hourly">Hourly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_remote"
                checked={formData.is_remote}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#0476D9] border-gray-300 rounded focus:ring-[#0476D9]"
              />
              <span className="text-sm font-medium text-[#011640]">Remote Job</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#0476D9] border-gray-300 rounded focus:ring-[#0476D9]"
              />
              <span className="text-sm font-medium text-[#011640]">Active Job</span>
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#011640] mb-2">
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={8}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-sm sm:text-base resize-vertical"
              placeholder="Write a detailed job description using Markdown..."
              required
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-[#011640] mb-2">
              Requirements
            </label>
            <div className="space-y-2">
              {formData.requirements.map((req, index) => (
                <input
                  key={index}
                  type="text"
                  value={req}
                  onChange={(e) => {
                    const newRequirements = [...formData.requirements];
                    newRequirements[index] = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      requirements: newRequirements,
                    }));
                  }}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-sm sm:text-base"
                  placeholder={`Requirement ${index + 1}`}
                />
              ))}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    requirements: [...prev.requirements, ""],
                  }))
                }
                className="text-[#0476D9] hover:text-[#0366C4] text-sm font-medium"
              >
                + Add Requirement
              </button>
            </div>
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-sm font-medium text-[#011640] mb-2">
              Benefits
            </label>
            <div className="space-y-2">
              {formData.benefits.map((benefit, index) => (
                <input
                  key={index}
                  type="text"
                  value={benefit}
                  onChange={(e) => {
                    const newBenefits = [...formData.benefits];
                    newBenefits[index] = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      benefits: newBenefits,
                    }));
                  }}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-sm sm:text-base"
                  placeholder={`Benefit ${index + 1}`}
                />
              ))}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    benefits: [...prev.benefits, ""],
                  }))
                }
                className="text-[#0476D9] hover:text-[#0366C4] text-sm font-medium"
              >
                + Add Benefit
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center justify-center gap-2 py-3 px-6 text-sm sm:text-base font-medium"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Saving..." : isEditing ? "Update Job" : "Create Job"}
            </button>
            {message && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {message}
              </div>
            )}
          </div>
        </form>
      </Card>

      {/* Preview */}
      <div className="xl:col-span-1">
        <Card className="p-4 sm:p-6 shadow-lg rounded-2xl border border-[#E5EAF1] bg-white">
          <h3 className="text-lg sm:text-xl font-bold text-[#011640] mb-4">
            Preview
          </h3>
          <div className="space-y-4">
            <JobCard job={previewJob} />
          </div>
        </Card>
      </div>
    </div>
  );
}
