import Link from 'next/link';
import { ArrowRight, Search, Briefcase, MapPin, Users, TrendingUp } from 'lucide-react';
import Hero from '@/components/Hero';
import JobCard from '@/components/JobCard';
import { jobsService } from '@/lib/jobs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "TalentFlight - Your talent, ready for takeoff",
  description: "Connect with exciting job opportunities. Your launchpad for professional growth. Find remote jobs, tech careers, and career opportunities.",
  keywords: "jobs, careers, opportunities, professional growth, recruitment, hiring, remote jobs, tech jobs, career opportunities",
  openGraph: {
    title: "TalentFlight - Your talent, ready for takeoff",
    description: "Connect with exciting job opportunities. Your launchpad for professional growth.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TalentFlight - Your talent, ready for takeoff",
    description: "Connect with exciting job opportunities. Your launchpad for professional growth.",
  },
  alternates: {
    canonical: "https://talentflight.com",
  },
};

export default async function HomePage() {
  const allJobs = await jobsService.getAllJobs();
  const jobs = allJobs.slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      {/* Latest Jobs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#011640] mb-4">
            Latest Opportunities
          </h2>
          <p className="text-xl text-[#0476D9] max-w-2xl mx-auto leading-relaxed">
            The most recent jobs posted on TalentFlight
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        <div className="text-center">
          <Link href="/jobs" className="btn-primary inline-flex items-center text-lg px-8 py-4">
            View All Jobs
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#011640] mb-4">
              Why Choose TalentFlight?
            </h2>
            <p className="text-xl text-[#0476D9] max-w-2xl mx-auto leading-relaxed">
              Join thousands of professionals who trust us for their career growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#011640] to-[#0476D9] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#011640] mb-2">378+</h3>
              <p className="text-[#0476D9]">Active Jobs</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#011640] to-[#0476D9] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#011640] mb-2">50+</h3>
              <p className="text-[#0476D9]">Countries</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#011640] to-[#0476D9] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#011640] mb-2">10K+</h3>
              <p className="text-[#0476D9]">Professionals</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#011640] to-[#0476D9] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#011640] mb-2">95%</h3>
              <p className="text-[#0476D9]">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-[#F3F7FA] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#011640] to-[#0476D9] rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <Search className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-4xl font-bold text-[#011640] mb-6">
            Stay ahead of the curve
          </h2>
          
          <p className="text-xl text-[#0476D9] mb-10 max-w-2xl mx-auto leading-relaxed">
            Get the most relevant opportunities delivered to your inbox. 
            No spam, just opportunities that matter to you.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-6 py-4 border border-[#E5EAF1] rounded-xl focus:ring-2 focus:ring-[#0476D9] focus:border-transparent text-lg shadow-sm"
            />
            <button
              type="submit"
              className="btn-primary whitespace-nowrap text-lg px-8 py-4"
            >
              Subscribe
            </button>
          </form>
          
          <p className="text-sm text-[#010D26] mt-6">
            You can unsubscribe at any time.
          </p>
        </div>
      </section>
    </div>
  );
}
