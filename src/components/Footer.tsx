import Link from 'next/link';
import { Plane, Mail, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#F3F7FA] border-t border-[#E5EAF1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#011640] to-[#0476D9] rounded-xl flex items-center justify-center shadow-lg">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-[#011640]">TalentFlight</span>
            </Link>
            <p className="text-[#011640] mb-6 max-w-md leading-relaxed">
              Your launchpad for professional opportunities. We connect exceptional talent 
              with innovative companies that drive career growth.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[#0476D9] hover:text-[#011640] transition-colors p-2 rounded-lg hover:bg-white">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#0476D9] hover:text-[#011640] transition-colors p-2 rounded-lg hover:bg-white">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#0476D9] hover:text-[#011640] transition-colors p-2 rounded-lg hover:bg-white">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold text-[#011640] mb-4 uppercase tracking-wide">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/jobs" className="text-[#011640] hover:text-[#0476D9] transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-[#011640] hover:text-[#0476D9] transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <a href="#" className="text-[#011640] hover:text-[#0476D9] transition-colors">
                  Newsletter
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-[#011640] mb-4 uppercase tracking-wide">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-[#011640] hover:text-[#0476D9] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-[#011640] hover:text-[#0476D9] transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-[#011640] hover:text-[#0476D9] transition-colors">
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#E5EAF1] mt-12 pt-8">
          <p className="text-center text-[#010D26] text-sm">
            © 2024 TalentFlight. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
