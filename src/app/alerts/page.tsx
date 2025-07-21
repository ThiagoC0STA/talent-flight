import { Metadata } from "next";
import JobAlertForm from "@/components/JobAlertForm";
import FAQItem from "@/components/FAQItem";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQStructuredData from "@/components/FAQStructuredData";
import {
  Bell,
  Search,
  Zap,
  Mail,
  MapPin,
  Users,
  Lightbulb,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Job Alerts - Get Email Notifications for New Tech Jobs | TalentFlight",
  description: "Set up personalized job alerts and get email notifications when new tech jobs matching your skills are posted. Never miss the perfect opportunity with our intelligent job matching system.",
  keywords: [
    "job alerts",
    "tech job notifications",
    "developer job alerts",
    "programmer job alerts",
    "software engineer alerts",
    "remote job notifications",
    "tech career alerts",
    "job matching",
    "career opportunities",
    "tech job search",
    "developer opportunities",
    "programming jobs",
    "software development jobs",
    "IT job alerts",
    "tech industry jobs"
  ],
  openGraph: {
    title: "Job Alerts - Get Email Notifications for New Tech Jobs",
    description: "Set up personalized job alerts and get email notifications when new tech jobs matching your skills are posted. Never miss the perfect opportunity.",
    url: "https://talentflight.com/alerts",
    siteName: "TalentFlight",
    images: [
      {
        url: "https://talentflight.com/og-job-alerts.jpg",
        width: 1200,
        height: 630,
        alt: "Job Alerts - TalentFlight",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Job Alerts - Get Email Notifications for New Tech Jobs",
    description: "Set up personalized job alerts and get email notifications when new tech jobs matching your skills are posted.",
    images: ["https://talentflight.com/og-job-alerts.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://talentflight.com/alerts",
  },
  other: {
    "google-site-verification": "your-verification-code",
  },
};

export default function AlertsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Job Alerts - Get Email Notifications for New Tech Jobs",
    "description": "Set up personalized job alerts and get email notifications when new tech jobs matching your skills are posted. Never miss the perfect opportunity with our intelligent job matching system.",
    "url": "https://talentflight.com/alerts",
    "mainEntity": {
      "@type": "Service",
      "name": "Job Alert Service",
      "description": "Personalized job alert service for tech professionals",
      "provider": {
        "@type": "Organization",
        "name": "TalentFlight",
        "url": "https://talentflight.com"
      },
      "serviceType": "Job Alert Service",
      "areaServed": "Worldwide",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Job Alert Features",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Email Notifications",
              "description": "Get automatic emails when we find jobs that match your profile"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Custom Filters",
              "description": "Use keywords to find exactly what you're looking for"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Instant Notifications",
              "description": "Be the first to know about new opportunities"
            }
          }
        ]
      }
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://talentflight.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Job Alerts",
          "item": "https://talentflight.com/alerts"
        }
      ]
    }
  };

    return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <FAQStructuredData />
      <div className="min-h-screen py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={[
              { label: "Job Alerts" }
            ]} 
          />
          
          {/* Header */}
          <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6 shadow-lg">
            <Bell className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Job Alerts</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get email notifications when new jobs matching your preferences are
            added to TalentFlight.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow text-center hover:shadow-lg transition-all duration-300">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4">
              <Mail className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              Email Notifications
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Get automatic emails when we find jobs that match your profile.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow text-center hover:shadow-lg transition-all duration-300">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
              <Search className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              Custom Filters
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Use keywords to find exactly what you&apos;re looking for.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow text-center hover:shadow-lg transition-all duration-300">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-100 rounded-full mb-4">
              <Zap className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              Instant Notifications
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Be the first to know about new opportunities.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="flex justify-center mb-16">
          <div className="w-full max-w-2xl">
            <JobAlertForm />
          </div>
        </div>

        {/* How it works */}
        <div className=" rounded-3xl shadow-lg p-6 mb-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get notified about the perfect job opportunities in just 4 simple
              steps
            </p>
          </div>

          <div className="relative">
            {/* Connection line */}

            <div className="grid lg:grid-cols-4 gap-8 relative z-10">
              <div className="text-center group">
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  Create Your Alert
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Enter your email and keywords that interest you. You can use
                  multiple keywords separated by commas.
                </p>
              </div>

              <div className="text-center group">
                <div className="relative">
                  <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  We Monitor Jobs
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our AI analyzes new jobs 24/7 looking for compatibility with
                  your keywords and preferences.
                </p>
              </div>

              <div className="text-center group">
                <div className="relative">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  We Find a Match
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  When a compatible job is found, you get an instant email
                  notification with job details.
                </p>
              </div>

              <div className="text-center group">
                <div className="relative">
                  <div className="bg-gradient-to-br from-pink-500 to-pink-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <span className="text-white font-bold text-xl">4</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  Apply Directly
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Click the email link and apply for the job immediately. Be the
                  first to apply!
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <div className="max-w-4xl mx-auto py-4">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4">
                  <Lightbulb className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900">
                  Pro Tips for Better Results
                </h4>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                  <h5 className="font-semibold text-blue-900 mb-3 flex items-center">
                    <Search className="w-5 h-5 mr-2" />
                    Use Specific Keywords
                  </h5>
                  <p className="text-blue-800 text-sm">
                    Instead of &quot;developer&quot;, try &quot;React
                    developer&quot; or &quot;Python backend&quot; for more
                    targeted results.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                  <h5 className="font-semibold text-green-900 mb-3 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Include Location Preferences
                  </h5>
                  <p className="text-green-800 text-sm">
                    Add &quot;remote&quot;, &quot;New York&quot;, or
                    &quot;London&quot; to your keywords for location-specific
                    jobs.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                  <h5 className="font-semibold text-purple-900 mb-3 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Specify Experience Level
                  </h5>
                  <p className="text-purple-800 text-sm">
                    Use &quot;senior&quot;, &quot;junior&quot;, or
                    &quot;lead&quot; in your search to match your experience
                    level.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
                  <h5 className="font-semibold text-orange-900 mb-3 flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Add Technology Names
                  </h5>
                  <p className="text-orange-800 text-sm">
                    Include &quot;React&quot;, &quot;Node.js&quot;,
                    &quot;AWS&quot;, or &quot;Docker&quot; to find jobs with
                    specific tech stacks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl shadow p-6 md:py-8 md:px-0">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Frequently Asked Questions
          </h2>

          <div className="max-w-4xl mx-auto">
            <FAQItem
              question="How often do I receive emails?"
              answer="You receive emails only when we find jobs that match your keywords. No spam - just relevant opportunities. Typically, you'll get 1-3 emails per week depending on your keyword specificity and job market activity."
            />

            <FAQItem
              question="Can I cancel the alerts?"
              answer="Yes! Each email has a link to cancel the alert. You can also contact us to remove your email from the list. Cancellation is immediate and you won't receive any more emails from that specific alert."
            />

            <FAQItem
              question="Is my email safe?"
              answer="Absolutely! Your email is only used to send job alerts. We don't share with third parties and you can cancel at any time. We follow strict privacy policies and never sell or share your personal information."
            />

            <FAQItem
              question="Can I create multiple alerts?"
              answer="Yes! You can create as many alerts as you want with different keywords to cover different interests or technologies. For example, you could have one for 'React developer' and another for 'Python backend'."
            />

            <FAQItem
              question="What keywords should I use?"
              answer="Be specific! Instead of just 'developer', try 'React developer', 'Python backend', or 'Senior frontend developer'. Include technologies (React, Node.js, AWS), locations (remote, New York), and experience levels (senior, junior, lead)."
            />

            <FAQItem
              question="How quickly do I get notified?"
              answer="We check for new jobs every hour and send notifications immediately when we find matches. You'll typically receive emails within 1-2 hours of a job being posted, giving you a competitive advantage."
            />

            <FAQItem
              question="Can I modify my alerts?"
              answer="Currently, you'll need to create a new alert with updated keywords. We're working on an alert management system where you can edit existing alerts. For now, you can cancel the old alert and create a new one."
            />

            <FAQItem
              question="Do you send international jobs?"
              answer="Yes! We monitor jobs from companies worldwide. You can include location keywords like 'remote', 'London', 'New York', or 'Berlin' to filter for specific locations or remote opportunities."
            />

            <FAQItem
              question="What if I don't receive any emails?"
              answer="This could mean your keywords are too specific or there aren't many jobs matching your criteria. Try broadening your keywords or adding alternative terms. You can also check our job board directly to see what's available."
            />

            <FAQItem
              question="Is this service free?"
              answer="Yes! Job alerts are completely free. We believe everyone should have access to great job opportunities without any cost. We may introduce premium features in the future, but basic alerts will always remain free."
            />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
