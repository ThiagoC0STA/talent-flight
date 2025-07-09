import Link from 'next/link';
import { Plane, Mail, Phone, MapPin, Linkedin, Twitter, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#011640] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-6 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0476D9] to-[#0487D9] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold group-hover:text-[#0476D9] transition-colors">
                TalentFlight
              </span>
            </Link>
            <p className="text-[#9CA3AF] mb-6 leading-relaxed">
              Connecting exceptional talent with extraordinary opportunities. 
              Your launchpad for professional growth and career success.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-[#0476D9] rounded-lg flex items-center justify-center hover:bg-[#0487D9] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#0476D9] rounded-lg flex items-center justify-center hover:bg-[#0487D9] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#0476D9] rounded-lg flex items-center justify-center hover:bg-[#0487D9] transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/jobs" 
                  className="text-[#9CA3AF] hover:text-white transition-colors duration-200"
                >
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-[#9CA3AF] hover:text-white transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-[#9CA3AF] hover:text-white transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin" 
                  className="text-[#9CA3AF] hover:text-white transition-colors duration-200"
                >
                  Post a Job
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-lg font-semibold mb-6">For Employers</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="/admin" 
                  className="text-[#9CA3AF] hover:text-white transition-colors duration-200"
                >
                  Post a Job
                </a>
              </li>
              <li>
                <a 
                  href="/contact" 
                  className="text-[#9CA3AF] hover:text-white transition-colors duration-200"
                >
                  Enterprise Solutions
                </a>
              </li>
              <li>
                <a 
                  href="/about" 
                  className="text-[#9CA3AF] hover:text-white transition-colors duration-200"
                >
                  Success Stories
                </a>
              </li>
              <li>
                <a 
                  href="/contact" 
                  className="text-[#9CA3AF] hover:text-white transition-colors duration-200"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-[#0476D9] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[#9CA3AF] text-sm">Email</p>
                  <a 
                    href="mailto:hello@talentflight.com" 
                    className="text-white hover:text-[#0476D9] transition-colors"
                  >
                    hello@talentflight.com
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-[#0476D9] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[#9CA3AF] text-sm">Phone</p>
                  <a 
                    href="tel:+15551234567" 
                    className="text-white hover:text-[#0476D9] transition-colors"
                  >
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#0476D9] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[#9CA3AF] text-sm">Address</p>
                  <p className="text-white">
                    123 Innovation Drive<br />
                    San Francisco, CA 94105
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#1F2937] mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-[#9CA3AF] text-sm">
              © 2024 TalentFlight. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link 
                href="/privacy" 
                className="text-[#9CA3AF] hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-[#9CA3AF] hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                href="/cookies" 
                className="text-[#9CA3AF] hover:text-white transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
