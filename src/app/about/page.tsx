import { Users, Target, Award, Globe, Linkedin, ExternalLink } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Us - TalentFlight",
  description: "Learn about TalentFlight's mission to connect exceptional talent with extraordinary opportunities. Discover our values, impact, and commitment to career growth.",
  keywords: "about talentflight, mission, values, career growth, job opportunities, professional development",
  openGraph: {
    title: "About Us - TalentFlight",
    description: "Learn about TalentFlight's mission to connect exceptional talent with extraordinary opportunities.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us - TalentFlight",
    description: "Learn about TalentFlight's mission to connect exceptional talent with extraordinary opportunities.",
  },
  alternates: {
    canonical: "https://talentflight.com/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#011640] to-[#0476D9] text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 backdrop-blur-sm">
            <Target className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in leading-tight">
            About TalentFlight
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed animate-slide-in-left px-2">
            We&apos;re on a mission to connect exceptional talent with extraordinary opportunities, 
            making career growth accessible to everyone.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#011640] mb-4 sm:mb-6">
                Our Mission
              </h2>
              <p className="text-base sm:text-lg text-[#010D26] mb-4 sm:mb-6 leading-relaxed">
                TalentFlight was born from a simple belief: everyone deserves access to opportunities 
                that can transform their career. We&apos;re building the most trusted platform for 
                professionals to discover and connect with companies that share their values and ambitions.
              </p>
              <p className="text-base sm:text-lg text-[#010D26] leading-relaxed">
                Whether you&apos;re a seasoned professional looking for your next challenge or a recent 
                graduate starting your journey, we&apos;re here to help you take flight.
              </p>
            </div>
            <div className="animate-slide-in-right">
              <div className="bg-gradient-to-br from-[#0476D9] to-[#0487D9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white">
                <h3 className="text-xl sm:text-2xl font-bold mb-4">Why Choose TalentFlight?</h3>
                <ul className="space-y-3 sm:space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-sm sm:text-base">Curated job opportunities from top companies</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-sm sm:text-base">Advanced search and filtering capabilities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-sm sm:text-base">Transparent salary information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-sm sm:text-base">Focus on remote and flexible work options</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#F3F7FA] py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#011640] mb-3 sm:mb-4">
              Our Impact
            </h2>
            <p className="text-lg sm:text-xl text-[#0476D9] max-w-2xl mx-auto px-2">
              Numbers that tell our story of connecting talent with opportunity
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center animate-scale-in">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#0476D9] to-[#0487D9] rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#011640] mb-1 sm:mb-2">10K+</div>
              <div className="text-sm sm:text-base text-[#0476D9] font-medium">Active Job Seekers</div>
            </div>
            
            <div className="text-center animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#011640] to-[#0476D9] rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#011640] mb-1 sm:mb-2">500+</div>
              <div className="text-sm sm:text-base text-[#0476D9] font-medium">Partner Companies</div>
            </div>
            
            <div className="text-center animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#0476D9] to-[#0487D9] rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#011640] mb-1 sm:mb-2">2K+</div>
              <div className="text-sm sm:text-base text-[#0476D9] font-medium">Jobs Posted</div>
            </div>
            
            <div className="text-center animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#011640] to-[#0476D9] rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#011640] mb-1 sm:mb-2">50+</div>
              <div className="text-sm sm:text-base text-[#0476D9] font-medium">Countries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#011640] mb-3 sm:mb-4">
              Our Values
            </h2>
            <p className="text-lg sm:text-xl text-[#0476D9] max-w-2xl mx-auto px-2">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#0476D9] to-[#0487D9] rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Target className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#011640] mb-3 sm:mb-4">Excellence</h3>
              <p className="text-sm sm:text-base text-[#010D26] leading-relaxed px-2">
                We strive for excellence in everything we do, from the quality of job postings 
                to the user experience we provide.
              </p>
            </div>
            
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#011640] to-[#0476D9] rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#011640] mb-3 sm:mb-4">Community</h3>
              <p className="text-sm sm:text-base text-[#010D26] leading-relaxed px-2">
                We believe in building a supportive community where professionals can grow, 
                learn, and connect with like-minded individuals.
              </p>
            </div>
            
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#0476D9] to-[#0487D9] rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Award className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#011640] mb-3 sm:mb-4">Innovation</h3>
              <p className="text-sm sm:text-base text-[#010D26] leading-relaxed px-2">
                We continuously innovate to provide the best tools and features for job seekers 
                and employers alike.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Job Posting Process Section */}
      <section className="bg-[#F3F7FA] py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#011640] mb-3 sm:mb-4">
              How We Work
            </h2>
            <p className="text-lg sm:text-xl text-[#0476D9] max-w-2xl mx-auto px-2">
              Our process for curating and presenting job opportunities
            </p>
          </div>
          
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#011640] mb-4 sm:mb-6">
                  Job Post Curation Process
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#0476D9] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white font-bold text-xs sm:text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#011640] mb-1 text-sm sm:text-base">Source & Review</h4>
                      <p className="text-[#010D26] text-xs sm:text-sm">We source job postings from reputable companies and hiring platforms.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#0476D9] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white font-bold text-xs sm:text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#011640] mb-1 text-sm sm:text-base">Curate & Enhance</h4>
                      <p className="text-[#010D26] text-xs sm:text-sm">Our team reviews and enhances job descriptions for clarity and completeness.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#0476D9] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white font-bold text-xs sm:text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#011640] mb-1 text-sm sm:text-base">Present & Connect</h4>
                      <p className="text-[#010D26] text-xs sm:text-sm">We present enhanced job posts and connect candidates directly to the original source.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#F3F7FA] rounded-xl p-4 sm:p-6 border border-[#E5EAF1]">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#0476D9] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#011640] mb-2 text-sm sm:text-base">Important Disclaimer</h4>
                    <p className="text-[#010D26] text-xs sm:text-sm leading-relaxed">
                      <strong>Job Post Curation:</strong> All job posts on TalentFlight are curated and rewritten by our team to improve clarity and visibility. 
                      The original listings belong to the hiring companies or their representatives.
                    </p>
                    <p className="text-[#010D26] text-xs sm:text-sm leading-relaxed mt-2">
                      <strong>Application Process:</strong> All applications are redirected to the official source. 
                      We act as a bridge between candidates and employers, ensuring transparency throughout the process.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section className="bg-gradient-to-br from-[#011640] to-[#0476D9] text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Connect with Our Founder
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
            Meet the visionary behind TalentFlight and discover how we&apos;re revolutionizing the job search experience.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center">
                <Linkedin className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              TalentFlight Company
            </h3>
            <p className="text-white/90 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
              Your talent, ready to take off. We&apos;re not just another job board — we&apos;re a launchpad. 
              Connecting driven professionals to high-impact opportunities across tech, design, marketing, and beyond.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a 
                href="https://www.linkedin.com/company/talent-flight-jobs/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-[#0476D9] hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Linkedin className="w-5 h-5" />
                Follow TalentFlight
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a href="/jobs" className="btn-primary bg-white text-[#0476D9] hover:bg-gray-100 text-sm sm:text-base">
              Browse Jobs
            </a>
            <a href="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-[#0476D9] text-sm sm:text-base">
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 