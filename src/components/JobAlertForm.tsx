"use client";

import { useState, useEffect, useRef } from "react";
import { createJobAlert } from "@/lib/jobAlerts";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { Bell, CheckCircle, Shield, X, ChevronDown } from "lucide-react";

export default function JobAlertForm() {
  const [email, setEmail] = useState<any>("");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const availableKeywords = [
    "React",
    "Vue",
    "Angular",
    "Node.js",
    "Python",
    "Java",
    "C++",
    "C#",
    "PHP",
    "Ruby",
    "Go",
    "Rust",
    "Swift",
    "Kotlin",
    "TypeScript",
    "JavaScript",
    "HTML",
    "CSS",
    "Sass",
    "Less",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "GCP",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Redis",
    "GraphQL",
    "REST API",
    "Microservices",
    "Machine Learning",
    "AI",
    "Data Science",
    "DevOps",
    "CI/CD",
    "Git",
    "Linux",
    "Windows",
    "macOS",
    "Mobile",
    "iOS",
    "Android",
    "Flutter",
    "React Native",
    "Senior",
    "Junior",
    "Lead",
    "Manager",
    "Architect",
    "Full Stack",
    "Frontend",
    "Backend",
    "Remote",
    "Hybrid",
    "On-site",
    "Contract",
    "Full-time",
    "Part-time",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || selectedKeywords.length === 0) {
      setError("Please fill in email and select at least one keyword");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createJobAlert({
        user_email: email,
        keywords: selectedKeywords,
        is_active: true,
      });

      setSuccess(true);
      setEmail("");
      setSelectedKeywords([]);
    } catch (err) {
      setError("Error creating alert. Please try again.");
      console.error("Error creating alert:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleKeyword = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(selectedKeywords.filter((k) => k !== keyword));
    } else {
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
  };

  const removeKeyword = (keyword: string) => {
    setSelectedKeywords(selectedKeywords.filter((k) => k !== keyword));
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center justify-center items-center flex flex-col">
        <div className="text-green-600 text-2xl mb-2">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Alert Created Successfully!
        </h3>
        <p className="text-green-700 mb-4">
          You will receive emails when we find compatible jobs.
        </p>
        <Button
          onClick={() => setSuccess(false)}
          className="bg-green-600 hover:bg-green-700"
        >
          Create Another Alert
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6 shadow">
          <Bell className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Get New Jobs by Email
        </h3>
        <p className="text-gray-600">Never miss the perfect opportunity</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-3 text-gray-700">
            Your Email
          </label>
          <Input
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="your@email.com"
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-3 text-gray-700">
            Select Keywords
          </label>

          {/* Selected Keywords Display */}
          {selectedKeywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedKeywords.map((keyword) => (
                <div
                  key={keyword}
                  className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  <span>{keyword}</span>
                  <button
                    type="button"
                    onClick={() => removeKeyword(keyword)}
                    className="hover:bg-blue-200 rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-left flex items-center justify-between"
            >
              <span
                className={
                  selectedKeywords.length === 0
                    ? "text-gray-500"
                    : "text-gray-900"
                }
              >
                {selectedKeywords.length === 0
                  ? "Select keywords..."
                  : `${selectedKeywords.length} keyword${
                      selectedKeywords.length === 1 ? "" : "s"
                    } selected`}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                <div className="p-2">
                  {availableKeywords.map((keyword) => (
                    <button
                      key={keyword}
                      type="button"
                      onClick={() => toggleKeyword(keyword)}
                      className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
                        selectedKeywords.includes(keyword)
                          ? "bg-blue-100 text-blue-800"
                          : "text-gray-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{keyword}</span>
                        {selectedKeywords.includes(keyword) && (
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Select multiple keywords that match your interests
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading || !email || selectedKeywords.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl shadow transition-all duration-200"
        >
          {loading ? "Creating..." : "Create Alert"}
        </Button>
      </form>

      <div className="mt-6 text-xs text-gray-500 text-center space-y-1">
        <p className="flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          We&apos;ll find new jobs and notify you by email!
        </p>
        <p className="flex items-center justify-center gap-2">
          <Shield className="w-4 h-4 text-blue-500" />
          Your email will only be used for alerts
        </p>
      </div>
    </div>
  );
}
