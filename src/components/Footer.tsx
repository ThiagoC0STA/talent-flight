import Link from "next/link";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#F3F7FA] border-t border-[#E5EAF1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          {/* Brand */}
          <div className="md:col-span-2 mb-8 md:mb-0">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <Image
                src="/logo.png"
                alt="TalentFlight"
                width={140}
                height={200}
              />
            </Link>
            <p className="text-[#011640] max-w-lg leading-relaxed text-sm">
              Your launchpad for professional opportunities. We connect
              exceptional talent with innovative companies that drive career
              growth.
            </p>
            <p className="text-left text-[#010D26] text-xs mt-4">
              © 2024 TalentFlight. All rights reserved.
            </p>
          </div>

          {/* Agrupar Navigation + Legal em linha no mobile, colunas no desktop */}
          <div className="flex flex-row w-full gap-8 md:col-span-2">
            {/* Main Navigation */}
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-[#011640] mb-4 uppercase tracking-wide">
                Navigation
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/jobs"
                    className="text-[#011640] hover:text-[#0476D9] transition-colors"
                  >
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-[#011640] hover:text-[#0476D9] transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-[#011640] hover:text-[#0476D9] transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            {/* Legal & Support */}
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-[#011640] mb-4 uppercase tracking-wide">
                Legal & Support
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-[#011640] hover:text-[#0476D9] transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-[#011640] hover:text-[#0476D9] transition-colors"
                  >
                    Terms of Use
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-[#011640] hover:text-[#0476D9] transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
