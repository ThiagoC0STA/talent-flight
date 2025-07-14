import type { Metadata } from "next";
import { Mail, MapPin, Clock, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact - TalentFlight",
  description:
    "Get in touch with TalentFlight. We're here to help with your questions about career opportunities and recruitment.",
  keywords: "contact, support, help, talentflight, recruitment, career",
  openGraph: {
    title: "Contact - TalentFlight",
    description: "Get in touch with TalentFlight. We're here to help.",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F3F7FA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#011640] mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-[#0476D9] max-w-2xl mx-auto">
            We&apos;re here to help you find the best career opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0476D9] to-[#0487D9] rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#011640]">
                Get in Touch
              </h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0476D9] to-[#0487D9] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#011640] mb-1">Email</h4>
                  <a
                    href="mailto:testflightsup@gmail.com"
                    className="text-[#0476D9] hover:text-[#0366C4] transition-colors"
                  >
                    testflightsup@gmail.com
                  </a>
                  <p className="text-sm text-[#010D26] mt-1">
                    We&apos;ll get back to you within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#011640] to-[#0476D9] rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#011640] mb-1">Address</h4>
                  <p className="text-[#010D26]">
                    1234 Innovation Drive
                    <br />
                    San Francisco, CA 94105
                    <br />
                    United States
                  </p>
                  <p className="text-sm text-[#0476D9] mt-1">
                    In the heart of Silicon Valley
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0476D9] to-[#0487D9] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#011640] mb-1">
                    Business Hours
                  </h4>
                  <p className="text-[#010D26]">
                    Monday to Friday: 9am to 6pm PST
                    <br />
                    Saturday: 10am to 2pm PST
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-6">
            {/* FAQ Quick Links */}
            <div className="bg-gradient-to-br from-[#011640] to-[#0476D9] text-white rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">
                Frequently Asked Questions
              </h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="block text-white/90 hover:text-white transition-colors"
                >
                  • How does the application process work?
                </a>
                <a
                  href="#"
                  className="block text-white/90 hover:text-white transition-colors"
                >
                  • How can companies post job openings?
                </a>
                <a
                  href="#"
                  className="block text-white/90 hover:text-white transition-colors"
                >
                  • What are the service costs?
                </a>
                <a
                  href="#"
                  className="block text-white/90 hover:text-white transition-colors"
                >
                  • How to protect my privacy?
                </a>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-[#0476D9]" />
                <h3 className="text-xl font-bold text-[#011640]">
                  Business Hours
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#010D26]">Monday to Friday</span>
                  <span className="font-semibold text-[#0476D9]">
                    9am to 6pm PST
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#010D26]">Saturday</span>
                  <span className="font-semibold text-[#0476D9]">
                    10am to 2pm PST
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#010D26]">Sunday</span>
                  <span className="font-semibold text-[#0476D9]">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
