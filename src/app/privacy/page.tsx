import type { Metadata } from "next";
import { Shield, Lock, Eye, Database, Globe, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy - TalentFlight",
  description:
    "Learn how we protect your personal data and information. Our privacy policy details how we collect, use and protect your information.",
  keywords:
    "privacy policy, data protection, GDPR, privacy, personal data",
  openGraph: {
    title: "Privacy Policy - TalentFlight",
    description: "Learn how we protect your personal data and information.",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F3F7FA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#0476D9] to-[#0487D9] rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#011640]">
                Privacy Policy
              </h1>
              <p className="text-[#0476D9] font-medium">
                Last updated: {new Date().toLocaleDateString("en-US")}
              </p>
            </div>
          </div>
          
          <p className="text-[#010D26] leading-relaxed">
            TalentFlight is committed to protecting your privacy. This policy describes how we collect, 
            use and protect your personal information when you use our service.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Information We Collect */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-6 h-6 text-[#0476D9]" />
              <h2 className="text-2xl font-bold text-[#011640]">
                Information We Collect
              </h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#011640] mb-2">
                  Personal Information
                </h3>
                <ul className="list-disc list-inside text-[#010D26] space-y-1 ml-4">
                  <li>Full name and contact information</li>
                  <li>Professional information and experience</li>
                  <li>Profile data and work preferences</li>
                  <li>Location information</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#011640] mb-2">
                  Technical Information
                </h3>
                <ul className="list-disc list-inside text-[#010D26] space-y-1 ml-4">
                  <li>IP address and browsing data</li>
                  <li>Cookies and similar technologies</li>
                  <li>Device and browser information</li>
                  <li>Usage data and analytics</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Information */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-6 h-6 text-[#0476D9]" />
              <h2 className="text-2xl font-bold text-[#011640]">
                How We Use Your Information
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-[#011640] mb-3">
                  To Provide Our Services
                </h3>
                <ul className="text-[#010D26] space-y-2">
                  <li>• Connect candidates with opportunities</li>
                  <li>• Personalize job recommendations</li>
                  <li>• Facilitate the application process</li>
                  <li>• Improve user experience</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#011640] mb-3">
                  For Communication
                </h3>
                <ul className="text-[#010D26] space-y-2">
                  <li>• Send job notifications</li>
                  <li>• Application updates</li>
                  <li>• Newsletter and relevant content</li>
                  <li>• Customer support</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Protection */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-6 h-6 text-[#0476D9]" />
              <h2 className="text-2xl font-bold text-[#011640]">
                Data Protection
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-[#010D26] leading-relaxed">
                We implement technical and organizational security measures to protect your information:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#F3F7FA] p-4 rounded-xl">
                  <h4 className="font-semibold text-[#011640] mb-2">Encryption</h4>
                  <p className="text-sm text-[#010D26]">
                    All data is encrypted in transit and at rest using industry standards.
                  </p>
                </div>
                
                <div className="bg-[#F3F7FA] p-4 rounded-xl">
                  <h4 className="font-semibold text-[#011640] mb-2">Access Control</h4>
                  <p className="text-sm text-[#010D26]">
                    Restricted access to personal data only for authorized employees.
                  </p>
                </div>
                
                <div className="bg-[#F3F7FA] p-4 rounded-xl">
                  <h4 className="font-semibold text-[#011640] mb-2">Monitoring</h4>
                  <p className="text-sm text-[#010D26]">
                    Continuous monitoring to detect and prevent security breaches.
                  </p>
                </div>
                
                <div className="bg-[#F3F7FA] p-4 rounded-xl">
                  <h4 className="font-semibold text-[#011640] mb-2">Secure Backup</h4>
                  <p className="text-sm text-[#010D26]">
                    Regular and secure backup of all data in geographically distributed locations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Sharing */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-[#0476D9]" />
              <h2 className="text-2xl font-bold text-[#011640]">
                Data Sharing
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-[#010D26] leading-relaxed">
                We do not sell, rent or commercialize your personal information. We may share data only in specific situations:
              </p>
              
              <ul className="list-disc list-inside text-[#010D26] space-y-2 ml-4">
                <li>With partner companies to facilitate applications (only with your consent)</li>
                <li>With service providers who help us operate the platform</li>
                <li>When required by law or to protect our rights</li>
                <li>In case of merger or acquisition of the company</li>
              </ul>
            </div>
          </div>

          {/* Job Curation & Data Processing */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border-l-4 border-[#0476D9]">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-[#0476D9]" />
              <h2 className="text-2xl font-bold text-[#011640]">
                Job Curation & Data Processing
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-[#010D26] leading-relaxed">
                <strong>Important Notice:</strong> As a job curation platform, TalentFlight processes 
                data differently than traditional job boards. Here&apos;s how we handle your information:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#F3F7FA] p-4 rounded-xl">
                  <h4 className="font-semibold text-[#011640] mb-2">What We Do:</h4>
                  <ul className="text-[#010D26] space-y-2 text-sm">
                    <li>• Curate and rewrite job descriptions</li>
                    <li>• Store your search preferences</li>
                    <li>• Track job views and interactions</li>
                    <li>• Provide job recommendations</li>
                  </ul>
                </div>
                
                <div className="bg-[#F3F7FA] p-4 rounded-xl">
                  <h4 className="font-semibold text-[#011640] mb-2">What We Don&apos;t Do:</h4>
                  <ul className="text-[#010D26] space-y-2 text-sm">
                    <li>• Process job applications directly</li>
                    <li>• Store your application data</li>
                    <li>• Share your data with hiring companies</li>
                    <li>• Access your application submissions</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-[#010D26] leading-relaxed">
                When you apply for a job through our platform, you are redirected to the original 
                company&apos;s application system. We do not have access to or control over the data 
                you submit during the application process.
              </p>
            </div>
          </div>

          {/* Your Rights */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-6 h-6 text-[#0476D9]" />
              <h2 className="text-2xl font-bold text-[#011640]">
                Your Rights
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-[#011640] mb-3">
                  GDPR Rights
                </h3>
                <ul className="text-[#010D26] space-y-2">
                  <li>• Access to your personal data</li>
                  <li>• Correction of incorrect information</li>
                  <li>• Deletion of data (right to be forgotten)</li>
                  <li>• Data portability</li>
                  <li>• Objection to processing</li>
                  <li>• Withdrawal of consent</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#011640] mb-3">
                  How to Exercise Your Rights
                </h3>
                <p className="text-[#010D26] mb-4">
                  To exercise any of these rights, contact us:
                </p>
                <div className="bg-[#F3F7FA] p-4 rounded-xl">
                  <p className="text-sm text-[#010D26]">
                    <strong>Email:</strong> privacy@talentflight.com<br/>
                    <strong>Phone:</strong> +55 (11) 99999-9999<br/>
                    <strong>Address:</strong> São Paulo, SP, Brazil
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cookies */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#011640] mb-6">
              Cookie Policy
            </h2>
            
            <div className="space-y-4">
              <p className="text-[#010D26] leading-relaxed">
                We use cookies and similar technologies to improve your experience:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#F3F7FA] p-4 rounded-xl">
                  <h4 className="font-semibold text-[#011640] mb-2">Essential Cookies</h4>
                  <p className="text-sm text-[#010D26]">
                    Necessary for basic website functionality.
                  </p>
                </div>
                
                <div className="bg-[#F3F7FA] p-4 rounded-xl">
                  <h4 className="font-semibold text-[#011640] mb-2">Performance Cookies</h4>
                  <p className="text-sm text-[#010D26]">
                    Help us understand how you use the site.
                  </p>
                </div>
                
                <div className="bg-[#F3F7FA] p-4 rounded-xl">
                  <h4 className="font-semibold text-[#011640] mb-2">Marketing Cookies</h4>
                  <p className="text-sm text-[#010D26]">
                    Used to personalize ads and content.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-br from-[#011640] to-[#0476D9] text-white rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Contact Us
            </h2>
            <p className="mb-6 leading-relaxed">
              If you have questions about this privacy policy or how we handle your data, 
              please don&apos;t hesitate to contact us.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p>privacy@talentflight.com</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Phone</h3>
                <p>+55 (11) 99999-9999</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
