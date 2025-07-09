'use client';

import Link from 'next/link';
import { Plane, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-[#E5EAF1] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#011640] to-[#0476D9] rounded-xl flex items-center justify-center shadow-lg">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-[#011640]">TalentFlight</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-[#011640] hover:text-[#0476D9] transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              href="/jobs" 
              className="text-[#011640] hover:text-[#0476D9] transition-colors font-medium"
            >
              Jobs
            </Link>
            <Link 
              href="/admin" 
              className="text-[#011640] hover:text-[#0476D9] transition-colors font-medium"
            >
              Post Job
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-[#F3F7FA] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-[#011640]" />
            ) : (
              <Menu className="w-6 h-6 text-[#011640]" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[#E5EAF1] py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-[#011640] hover:text-[#0476D9] transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/jobs" 
                className="text-[#011640] hover:text-[#0476D9] transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Jobs
              </Link>
              <Link 
                href="/admin" 
                className="text-[#011640] hover:text-[#0476D9] transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Post Job
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
