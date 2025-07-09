import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import Hero from '@/components/Hero';
import JobCard from '@/components/JobCard';
import { jobsService } from '@/lib/jobs';

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
