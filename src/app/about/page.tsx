import { Users, Target, Award, Globe } from 'lucide-react';
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
      <section className="bg-gradient-to-br from-[#011640] to-[#0476D9] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <Target className="w-10 h-10" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            About TalentFlight
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed animate-slide-in-left">
            We&apos;re on a mission to connect exceptional talent with extraordinary opportunities, 
            making career growth accessible to everyone.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-4xl font-bold text-[#011640] mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-[#010D26] mb-6 leading-relaxed">
                TalentFlight was born from a simple belief: everyone deserves access to opportunities 
                that can transform their career. We&apos;re building the most trusted platform for 
                professionals to discover and connect with companies that share their values and ambitions.
              </p>
              <p className="text-lg text-[#010D26] leading-relaxed">
                Whether you&apos;re a seasoned professional looking for your next challenge or a recent 
                graduate starting your journey, we&apos;re here to help you take flight.
              </p>
            </div>
            <div className="animate-slide-in-right">
              <div className="bg-gradient-to-br from-[#0476D9] to-[#0487D9] rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Why Choose TalentFlight?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>Curated job opportunities from top companies</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>Advanced search and filtering capabilities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>Transparent salary information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>Focus on remote and flexible work options</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#F3F7FA] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#011640] mb-4">
              Our Impact
            </h2>
            <p className="text-xl text-[#0476D9] max-w-2xl mx-auto">
              Numbers that tell our story of connecting talent with opportunity
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center animate-scale-in">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0476D9] to-[#0487D9] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-[#011640] mb-2">10K+</div>
              <div className="text-[#0476D9] font-medium">Active Job Seekers</div>
            </div>
            
            <div className="text-center animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-[#011640] to-[#0476D9] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-[#011640] mb-2">500+</div>
              <div className="text-[#0476D9] font-medium">Partner Companies</div>
            </div>
            
            <div className="text-center animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-[#0476D9] to-[#0487D9] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-[#011640] mb-2">2K+</div>
              <div className="text-[#0476D9] font-medium">Jobs Posted</div>
            </div>
            
            <div className="text-center animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-[#011640] to-[#0476D9] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-[#011640] mb-2">50+</div>
              <div className="text-[#0476D9] font-medium">Countries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#011640] mb-4">
              Our Values
            </h2>
            <p className="text-xl text-[#0476D9] max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 bg-gradient-to-br from-[#0476D9] to-[#0487D9] rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#011640] mb-4">Excellence</h3>
              <p className="text-[#010D26] leading-relaxed">
                We strive for excellence in everything we do, from the quality of job postings 
                to the user experience we provide.
              </p>
            </div>
            
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-[#011640] to-[#0476D9] rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#011640] mb-4">Community</h3>
              <p className="text-[#010D26] leading-relaxed">
                We believe in building a supportive community where professionals can grow, 
                learn, and connect with like-minded individuals.
              </p>
            </div>
            
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-[#0476D9] to-[#0487D9] rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#011640] mb-4">Innovation</h3>
              <p className="text-[#010D26] leading-relaxed">
                We continuously innovate to provide the best tools and features for job seekers 
                and employers alike.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#011640] to-[#0476D9] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Take Flight?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of professionals who have found their dream jobs through TalentFlight.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/jobs" className="btn-primary bg-white text-[#0476D9] hover:bg-gray-100">
              Browse Jobs
            </a>
            <a href="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-[#0476D9]">
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 