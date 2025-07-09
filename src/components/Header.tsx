"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Plane } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white border-b border-[#E5EAF1] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0476D9] to-[#0487D9] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#011640] group-hover:text-[#0476D9] transition-colors">
              TalentFlight
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/jobs"
              className="text-[#010D26] hover:text-[#0476D9] font-medium transition-colors duration-200"
            >
              Jobs
            </Link>
            <Link
              href="/about"
              className="text-[#010D26] hover:text-[#0476D9] font-medium transition-colors duration-200"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-[#010D26] hover:text-[#0476D9] font-medium transition-colors duration-200"
            >
              Contact
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-[#010D26] hover:bg-[#F3F7FA] transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[#E5EAF1] animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/jobs"
                className="block px-3 py-2 text-[#010D26] hover:text-[#0476D9] hover:bg-[#F3F7FA] rounded-lg font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Jobs
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-[#010D26] hover:text-[#0476D9] hover:bg-[#F3F7FA] rounded-lg font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-[#010D26] hover:text-[#0476D9] hover:bg-[#F3F7FA] rounded-lg font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/admin"
                className="block px-3 py-2 bg-[#0476D9] text-white hover:bg-[#011640] rounded-lg font-medium transition-colors mt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Post a Job
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
