"use client";

import { useState } from "react";
import { Save, Trash2 } from "lucide-react";
import { Job } from "@/types/job";

export default function AdminPage() {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    tags: "",
    description: "",
    applyUrl: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

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
      // Validate required fields
      if (
        !formData.title ||
        !formData.company ||
        !formData.location ||
        !formData.description ||
        !formData.applyUrl
      ) {
        throw new Error("All required fields must be filled");
      }

      // Create new job object
      const newJob: Omit<Job, "id" | "createdAt" | "slug"> = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
        description: formData.description,
        applyUrl: formData.applyUrl,
      };

      // In a real app, this would be an API call
      console.log("New job to be saved:", newJob);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMessage("Job created successfully!");

      // Reset form
      setFormData({
        title: "",
        company: "",
        location: "",
        tags: "",
        description: "",
        applyUrl: "",
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error creating job");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Post a New Job
          </h1>
          <p className="text-xl text-slate-600">
            Fill out the form below to publish a new opportunity
          </p>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-700 mb-3"
              >
                Job Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Senior Frontend Developer"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent text-lg"
                required
              />
            </div>

            {/* Company and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-slate-700 mb-3"
                >
                  Company *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="e.g. TechCorp"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent text-lg"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-slate-700 mb-3"
                >
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. San Francisco, CA"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent text-lg"
                  required
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-slate-700 mb-3"
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
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent text-lg"
              />
              <p className="text-sm text-slate-500 mt-2">
                Skills help candidates find your job more easily
              </p>
            </div>

            {/* Apply URL */}
            <div>
              <label
                htmlFor="applyUrl"
                className="block text-sm font-medium text-slate-700 mb-3"
              >
                Application Link *
              </label>
              <input
                type="url"
                id="applyUrl"
                name="applyUrl"
                value={formData.applyUrl}
                onChange={handleInputChange}
                placeholder="https://your-company.com/careers/job"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent text-lg"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-700 mb-3"
              >
                Job Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={16}
                placeholder={`# Job Title

Describe the opportunity and responsibilities...

## Responsibilities:
- Item 1
- Item 2
- Item 3

## Requirements:
- Item 1
- Item 2
- Item 3

## Benefits:
- Item 1
- Item 2
- Item 3`}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent font-mono text-sm"
                required
              />
              <p className="text-sm text-slate-500 mt-2">
                Use Markdown to format the description. Supports headings,
                lists, bold text, etc.
              </p>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`p-6 rounded-xl ${
                  message.includes("successfully")
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-8 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    title: "",
                    company: "",
                    location: "",
                    tags: "",
                    description: "",
                    applyUrl: "",
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
        </div>

        {/* Help Section */}
        <div className="mt-12 card">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">
            Tips for a great job description
          </h3>
          <ul className="space-y-3 text-slate-600">
            <li>• Be clear about responsibilities and requirements</li>
            <li>• Mention company benefits and differentiators</li>
            <li>• Use relevant skills to help with search</li>
            <li>• Include information about contract type and work mode</li>
            <li>• Keep a professional but welcoming tone</li>
          </ul>
        </div>
      </div>

    </div>
  );
}
