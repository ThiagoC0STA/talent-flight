"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Briefcase, Info, Mail } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white border-b border-[#E5EAF1] sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-22">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <Image
              src="/logos/logo.png"
              alt="TalentFlight"
              width={200}
              height={200}
              quality={100}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/jobs"
              className="flex items-center gap-2 text-[#010D26] hover:text-[#0476D9] font-medium transition-colors duration-200"
            >
              <Briefcase className="w-4 h-4" />
              Jobs
            </Link>
            <Link
              href="/alerts"
              className="flex items-center gap-2 text-[#010D26] hover:text-[#0476D9] font-medium transition-colors duration-200"
            >
              Job Alerts
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2 text-[#010D26] hover:text-[#0476D9] font-medium transition-colors duration-200"
            >
              <Info className="w-4 h-4" />
              About
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 text-[#010D26] hover:text-[#0476D9] font-medium transition-colors duration-200"
            >
              <Mail className="w-4 h-4" />
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
                className="flex items-center gap-3 px-3 py-2 text-[#010D26] hover:text-[#0476D9] hover:bg-[#F3F7FA] rounded-lg font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Briefcase className="w-4 h-4" />
                Jobs
              </Link>
              <Link
                href="/alerts"
                className="flex items-center gap-3 px-3 py-2 text-[#010D26] hover:text-[#0476D9] hover:bg-[#F3F7FA] rounded-lg font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Job Alerts
              </Link>
              <Link
                href="/about"
                className="flex items-center gap-3 px-3 py-2 text-[#010D26] hover:text-[#0476D9] hover:bg-[#F3F7FA] rounded-lg font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Info className="w-4 h-4" />
                About
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-3 px-3 py-2 text-[#010D26] hover:text-[#0476D9] hover:bg-[#F3F7FA] rounded-lg font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Mail className="w-4 h-4" />
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
