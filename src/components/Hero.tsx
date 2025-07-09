import Link from "next/link";
import { ArrowRight, Plane } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden hero-gradient border-b border-[#E5EAF1]">
      {/* Círculo blur tech */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#0476D9]/20 rounded-full blur-3xl z-0" />
      <div className="absolute top-10 right-0 w-72 h-72 bg-[#0487D9]/10 rounded-full blur-2xl z-0" />
      {/* Linhas diagonais tech */}
      <svg
        className="absolute inset-0 w-full h-full z-0"
        width="100%"
        height="100%"
        fill="none"
      >
        <defs>
          <linearGradient id="line" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#011640" stopOpacity="0.2" />
            <stop offset="1" stopColor="#0476D9" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <line
          x1="0"
          y1="0"
          x2="100%"
          y2="100%"
          stroke="url(#line)"
          strokeWidth="2"
        />
        <line
          x1="100%"
          y1="0"
          x2="0"
          y2="100%"
          stroke="url(#line)"
          strokeWidth="2"
        />
      </svg>
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center z-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#0476D9] to-[#0487D9] rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 relative">
            <Plane className="w-8 h-8 text-white drop-shadow-[0_0_12px_#0487D9]" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4 leading-tight drop-shadow-[0_2px_8px_rgba(1,22,64,0.18)]">
          Your talent, ready for takeoff
        </h1>
        <p className="text-lg text-white/80 text-center mb-8 max-w-xl mx-auto font-normal">
          Discover jobs that launch your career. The premium job board for
          ambitious professionals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/jobs"
            className="btn-primary inline-flex items-center text-lg px-8 py-4"
          >
            Explore Jobs
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
