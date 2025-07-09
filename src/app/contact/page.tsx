import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from "lucide-react";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Contact - TalentFlight",
  description: "Get in touch with TalentFlight. We're here to help with your questions about career opportunities and recruitment.",
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
            We're here to help you find the best career opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0476D9] to-[#0487D9] rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#011640]">
                Send a Message
              </h2>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-[#011640] mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent transition-colors"
                    placeholder="Your first name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-[#011640] mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent transition-colors"
                    placeholder="Your last name"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#011640] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-[#011640] mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent transition-colors"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Question</option>
                  <option value="support">Technical Support</option>
                  <option value="partnership">Partnership</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#011640] mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full px-4 py-3 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent transition-colors resize-none"
                  placeholder="Tell us how we can help..."
                  required
                ></textarea>
              </div>

              <Button type="submit" className="w-full" size="lg">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Office Info */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-[#011640] mb-6">
                Contact Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#0476D9] to-[#0487D9] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#011640] mb-1">Email</h4>
                    <p className="text-[#010D26]">contact@talentflight.com</p>
                    <p className="text-[#010D26]">support@talentflight.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#011640] to-[#0476D9] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#011640] mb-1">Phone</h4>
                    <p className="text-[#010D26]">+55 (11) 99999-9999</p>
                    <p className="text-sm text-[#0476D9]">Monday to Friday, 9am to 6pm</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#0476D9] to-[#0487D9] rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#011640] mb-1">Address</h4>
                    <p className="text-[#010D26]">
                      Av. Paulista, 1000<br />
                      Bela Vista, São Paulo - SP<br />
                      CEP: 01310-100
                    </p>
                  </div>
                </div>
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
                  <span className="font-semibold text-[#0476D9]">9am to 6pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#010D26]">Saturday</span>
                  <span className="font-semibold text-[#0476D9]">9am to 2pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#010D26]">Sunday</span>
                  <span className="font-semibold text-[#0476D9]">Closed</span>
                </div>
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="bg-gradient-to-br from-[#011640] to-[#0476D9] text-white rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">
                Frequently Asked Questions
              </h3>
              <div className="space-y-3">
                <a href="#" className="block text-white/90 hover:text-white transition-colors">
                  • How does the application process work?
                </a>
                <a href="#" className="block text-white/90 hover:text-white transition-colors">
                  • How can companies post job openings?
                </a>
                <a href="#" className="block text-white/90 hover:text-white transition-colors">
                  • What are the service costs?
                </a>
                <a href="#" className="block text-white/90 hover:text-white transition-colors">
                  • How to protect my privacy?
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#011640] mb-6 text-center">
            Our Location
          </h2>
          <div className="bg-[#F3F7FA] rounded-xl h-64 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-[#0476D9] mx-auto mb-4" />
              <p className="text-[#010D26] font-medium">
                Av. Paulista, 1000 - Bela Vista, São Paulo - SP
              </p>
              <p className="text-[#0476D9] text-sm mt-2">
                Near Trianon-Masp Metro Station
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 