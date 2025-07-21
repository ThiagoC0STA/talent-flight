"use client";

import { useState } from "react";
import { createJobAlert } from "@/lib/jobAlerts";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { Bell, CheckCircle, Shield } from "lucide-react";

export default function JobAlertForm() {
  const [email, setEmail] = useState<any>("");
  const [keywords, setKeywords] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !keywords.trim()) {
      setError("Please fill in email and keywords");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const keywordsArray = keywords
        .split(",")
        .map((k: any) => k.trim())
        .filter((k: any) => k.length > 0);

      await createJobAlert({
        user_email: email,
        keywords: keywordsArray,
        is_active: true,
      });

      setSuccess(true);
      setEmail("");
      setKeywords("");
    } catch (err) {
      setError("Error creating alert. Please try again.");
      console.error("Error creating alert:", err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-green-600 text-2xl mb-2">✅</div>
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
        <p className="text-gray-600">
          Never miss the perfect opportunity
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-3 text-gray-700">
            Your Email
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-3 text-gray-700">
            Keywords (separated by comma)
          </label>
          <Input
            value={keywords}
            onChange={(e: any) => setKeywords(e.target.value)}
            placeholder="react, remote, senior, javascript"
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
          <p className="text-xs text-gray-500 mt-2">
            Ex: react, remote, senior, javascript, python
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading || !email || !keywords.trim()}
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
