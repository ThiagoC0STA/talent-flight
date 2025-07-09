import type { Metadata } from "next";
import { FileText, AlertTriangle, CheckCircle, XCircle, Shield, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Use - TalentFlight",
  description: "Read our terms of use and conditions for using the TalentFlight platform. Learn about your rights and responsibilities.",
  keywords: "terms of use, conditions, legal, rights, responsibilities",
  openGraph: {
    title: "Terms of Use - TalentFlight",
    description: "Read our terms of use and conditions for using the TalentFlight platform.",
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F3F7FA]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#0476D9] to-[#0487D9] rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#011640]">
                Terms of Use
              </h1>
              <p className="text-[#0476D9] font-medium">
                Last updated: {new Date().toLocaleDateString("en-US")}
              </p>
            </div>
          </div>
          
          <p className="text-[#010D26] leading-relaxed">
            By using the TalentFlight platform, you agree to these terms of use. 
            Please read carefully before using our services.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Acceptance */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-6 h-6 text-[#0476D9]" />
              <h2 className="text-2xl font-bold text-[#011640]">
                Acceptance of Terms
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-[#010D26] leading-relaxed">
                By accessing and using the TalentFlight platform, you confirm that:
              </p>
              
              <ul className="list-disc list-inside text-[#010D26] space-y-2 ml-4">
                <li>You are at least 18 years old or have parental authorization</li>
                <li>You have legal capacity to enter into contracts</li>
                <li>You will provide true and accurate information</li>
                <li>You will not use the platform for illegal or inappropriate purposes</li>
                <li>You will respect the rights of other users</li>
              </ul>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-[#0476D9]" />
              <h2 className="text-2xl font-bold text-[#011640]">
                Our Services
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-[#011640] mb-3">
                  For Candidates
                </h3>
                <ul className="text-[#010D26] space-y-2">
                  <li>• Search and view job opportunities</li>
                  <li>• Create and manage profile</li>
                  <li>• Apply for positions</li>
                  <li>• Receive notifications</li>
                  <li>• Advanced search tools</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#011640] mb-3">
                  For Companies
                </h3>
                <ul className="text-[#010D26] space-y-2">
                  <li>• Post job openings</li>
                  <li>• Manage applications</li>
                  <li>• Recruitment tools</li>
                  <li>• Analytics and reports</li>
                  <li>• Specialized support</li>
                </ul>
              </div>
            </div>
          </div>

          {/* User Responsibilities */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-[#0476D9]" />
              <h2 className="text-2xl font-bold text-[#011640]">
                User Responsibilities
              </h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#011640] mb-3">
                  Accurate Information
                </h3>
                <p className="text-[#010D26] leading-relaxed">
                  You are responsible for providing true, accurate and up-to-date information. 
                  TalentFlight is not responsible for false or misleading information.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#011640] mb-3">
                  Appropriate Use
                </h3>
                <p className="text-[#010D26] leading-relaxed mb-3">
                  You agree not to:
                </p>
                <ul className="list-disc list-inside text-[#010D26] space-y-1 ml-4">
                  <li>Use the platform for illegal activities</li>
                  <li>Violate intellectual property rights</li>
                  <li>Transmit viruses or malicious code</li>
                  <li>Interfere with platform operation</li>
                  <li>Collect data from other users without authorization</li>
                  <li>Use bots or automated scripts</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#011640] mb-3">
                  Account Security
                </h3>
                <p className="text-[#010D26] leading-relaxed">
                  You are responsible for maintaining the confidentiality of your access credentials 
                  and for all activities performed in your account.
                </p>
              </div>
            </div>
          </div>

          {/* Prohibited Activities */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold text-[#011640]">
                Prohibited Activities
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-[#011640] mb-3">
                  For Candidates
                </h3>
                <ul className="text-[#010D26] space-y-2">
                  <li>• Submit false applications</li>
                  <li>• Use third-party information</li>
                  <li>• Spam or mass applications</li>
                  <li>• Harassment or inappropriate behavior</li>
                  <li>• Violation of employment contracts</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#011640] mb-3">
                  For Companies
                </h3>
                <ul className="text-[#010D26] space-y-2">
                  <li>• Post false job openings</li>
                  <li>• Illegal discrimination</li>
                  <li>• Spam or unauthorized contact</li>
                  <li>• Violation of labor laws</li>
                  <li>• Inappropriate use of candidate data</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#011640] mb-6">
              Intellectual Property
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#011640] mb-3">
                  TalentFlight Rights
                </h3>
                <p className="text-[#010D26] leading-relaxed">
                  The TalentFlight platform, including its design, features, content and technology, 
                  is protected by copyright, trademarks and other intellectual property laws.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#011640] mb-3">
                  License to Use
                </h3>
                <p className="text-[#010D26] leading-relaxed">
                  We grant you a limited, non-exclusive and revocable license to use the platform 
                  in accordance with these terms.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#011640] mb-3">
                  User Content
                </h3>
                <p className="text-[#010D26] leading-relaxed">
                  You retain rights to content you submit, but grant us license to use, 
                  modify and distribute that content to provide our services.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy and Data */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#011640] mb-6">
              Privacy and Data
            </h2>
            
            <div className="space-y-4">
              <p className="text-[#010D26] leading-relaxed">
                The processing of your personal data is governed by our Privacy Policy, 
                which is an integral part of these terms.
              </p>
              
              <div className="bg-[#F3F7FA] p-4 rounded-xl">
                <h4 className="font-semibold text-[#011640] mb-2">Key Points:</h4>
                <ul className="text-[#010D26] space-y-1 text-sm">
                  <li>• We collect only data necessary for our services</li>
                  <li>• We do not sell your personal data</li>
                  <li>• We implement adequate security measures</li>
                  <li>• You have rights over your data (GDPR)</li>
                  <li>• We may share data only with your consent</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Disclaimers */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-[#011640]">
                Limitations and Disclaimers
              </h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#011640] mb-3">
                  Service Availability
                </h3>
                <p className="text-[#010D26] leading-relaxed">
                  We strive to keep the platform available, but do not guarantee continuous 
                  availability. We may interrupt service for maintenance or updates.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#011640] mb-3">
                  Limitation of Liability
                </h3>
                <p className="text-[#010D26] leading-relaxed">
                  TalentFlight is not responsible for:
                </p>
                <ul className="list-disc list-inside text-[#010D26] space-y-1 ml-4 mt-2">
                  <li>Hiring decisions by companies</li>
                  <li>Information provided by users</li>
                  <li>Indirect or consequential damages</li>
                  <li>Technical issues from third parties</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#011640] mb-3">
                  Indemnification
                </h3>
                <p className="text-[#010D26] leading-relaxed">
                  You agree to indemnify and hold TalentFlight harmless from any claim, 
                  damage or expense arising from inappropriate use of the platform.
                </p>
              </div>
            </div>
          </div>

          {/* Termination */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#011640] mb-6">
              Termination
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#011640] mb-3">
                  Termination by User
                </h3>
                <p className="text-[#010D26] leading-relaxed">
                  You may terminate your account at any time through platform settings 
                  or by contacting us.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#011640] mb-3">
                  Termination by TalentFlight
                </h3>
                <p className="text-[#010D26] leading-relaxed">
                  We may suspend or terminate your account if you violate these terms or if 
                  we detect inappropriate activities.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#011640] mb-3">
                  Effects of Termination
                </h3>
                <p className="text-[#010D26] leading-relaxed">
                  After termination, you will lose access to the platform, but we may retain 
                  certain data in accordance with our privacy policy.
                </p>
              </div>
            </div>
          </div>

          {/* Changes to Terms */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#011640] mb-6">
              Changes to Terms
            </h2>
            
            <div className="space-y-4">
              <p className="text-[#010D26] leading-relaxed">
                We may update these terms periodically. We will notify you of significant changes 
                through the platform or by email.
              </p>
              
              <div className="bg-[#F3F7FA] p-4 rounded-xl">
                <h4 className="font-semibold text-[#011640] mb-2">Notification Process:</h4>
                <ul className="text-[#010D26] space-y-1 text-sm">
                  <li>• Platform notification for 30 days</li>
                  <li>• Email to active users</li>
                  <li>• Effective date clearly indicated</li>
                  <li>• Option to disagree and terminate account</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-br from-[#011640] to-[#0476D9] text-white rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Contact Us
            </h2>
            <p className="mb-6 leading-relaxed">
              If you have questions about these terms of use, please contact us.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p>legal@talentflight.com</p>
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