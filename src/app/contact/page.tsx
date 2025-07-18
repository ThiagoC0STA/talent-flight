import type { Metadata } from "next";
import { Mail, Phone, Clock, AlertTriangle, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us - TalentFlight",
  description: "Get in touch with TalentFlight. We're here to help with any questions about our job platform, support, or content removal requests.",
  keywords: "contact talentflight, support, help, content removal, job platform",
  openGraph: {
    title: "Contact Us - TalentFlight",
    description: "Get in touch with TalentFlight for support or content removal requests.",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F3F7FA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#0476D9] to-[#0487D9] rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#011640]">
                Contact Us
              </h1>
              <p className="text-[#0476D9] font-medium">
                We&apos;re here to help you
              </p>
            </div>
          </div>
          
          <p className="text-[#010D26] leading-relaxed">
            Have questions about our platform, need support, or want to report an issue? 
            We&apos;re here to help. Choose the best way to reach us below.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#0476D9] rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#011640]">Email Support</h3>
            </div>
            <p className="text-[#010D26] mb-3">
              For general inquiries and support
            </p>
            <a href="mailto:support@talentflight.com" className="text-[#0476D9] font-medium hover:underline">
              support@talentflight.com
            </a>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#0476D9] rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#011640]">Phone Support</h3>
            </div>
            <p className="text-[#010D26] mb-3">
              Available during business hours
            </p>
            <a href="tel:+5511999999999" className="text-[#0476D9] font-medium hover:underline">
              +55 (11) 99999-9999
            </a>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#0476D9] rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#011640]">Business Hours</h3>
            </div>
            <p className="text-[#010D26] mb-3">
              Monday to Friday
            </p>
            <p className="text-[#0476D9] font-medium">
              9:00 AM - 6:00 PM (BRT)
            </p>
          </div>
        </div>

        {/* Content Removal Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border-l-4 border-orange-500 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-[#011640]">
              Content Removal Requests
            </h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-[#010D26] leading-relaxed">
              <strong>Important:</strong> If you are a content owner and want to request removal of your 
              job posting or company information from our platform, please contact us immediately.
            </p>
            
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
              <h4 className="font-semibold text-[#011640] mb-2">For Content Owners:</h4>
              <ul className="text-[#010D26] space-y-2 text-sm">
                <li>• Email: <strong>legal@talentflight.com</strong></li>
                <li>• Include: Company name, job title, and reason for removal</li>
                <li>• We will respond within 24-48 hours</li>
                <li>• Content will be removed promptly upon verification</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-[#011640] mb-2">Our Commitment:</h4>
              <ul className="text-[#010D26] space-y-2 text-sm">
                <li>• We respect intellectual property rights</li>
                <li>• We operate in good faith and fair use</li>
                <li>• We will promptly address legitimate removal requests</li>
                <li>• We maintain transparency in our content curation process</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Legal Contact */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border-l-4 border-red-500">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold text-[#011640]">
              Legal & Privacy Inquiries
            </h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-[#010D26] leading-relaxed">
              For legal matters, privacy concerns, or data protection requests, please contact our legal team.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                <h4 className="font-semibold text-[#011640] mb-2">Legal Team</h4>
                <p className="text-[#010D26] text-sm mb-2">
                  For legal matters and copyright issues:
                </p>
                <a href="mailto:legal@talentflight.com" className="text-red-600 font-medium hover:underline">
                  legal@talentflight.com
                </a>
              </div>
              
              <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                <h4 className="font-semibold text-[#011640] mb-2">Privacy Team</h4>
                <p className="text-[#010D26] text-sm mb-2">
                  For GDPR and data protection requests:
                </p>
                <a href="mailto:privacy@talentflight.com" className="text-red-600 font-medium hover:underline">
                  privacy@talentflight.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
