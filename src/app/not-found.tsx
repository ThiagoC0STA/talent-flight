import Link from "next/link";
import { Metadata } from "next";
import { Search, Home, Briefcase } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found - 404 | TalentFlight",
  description: "The page you're looking for doesn't exist. Find job opportunities and career growth at TalentFlight.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F3F7FA] flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-[#011640] to-[#0476D9] rounded-full flex items-center justify-center mx-auto shadow-xl">
            <Search className="w-16 h-16 text-white" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-6xl font-bold text-[#011640] mb-4">404</h1>
        <h2 className="text-3xl font-bold text-[#011640] mb-6">
          Page Not Found
        </h2>
        <p className="text-xl text-[#0476D9] mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. 
          Don't worry, you can still find amazing job opportunities!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="btn-primary inline-flex items-center justify-center px-8 py-4 text-lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Link>
          <Link
            href="/jobs"
            className="btn-secondary inline-flex items-center justify-center px-8 py-4 text-lg"
          >
            <Briefcase className="w-5 h-5 mr-2" />
            Browse Jobs
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-[#011640] mb-6">
            Popular Pages
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/jobs"
              className="text-[#0476D9] hover:text-[#011640] transition-colors duration-200"
            >
              Find Jobs
            </Link>
            <Link
              href="/about"
              className="text-[#0476D9] hover:text-[#011640] transition-colors duration-200"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-[#0476D9] hover:text-[#011640] transition-colors duration-200"
            >
              Contact
            </Link>
            <Link
              href="/privacy"
              className="text-[#0476D9] hover:text-[#011640] transition-colors duration-200"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 