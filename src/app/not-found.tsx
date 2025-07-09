import Link from 'next/link';
import { Plane, Home, Search } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
          <Plane className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="text-8xl font-bold text-slate-900 mb-6">
          404
        </h1>
        
        <h2 className="text-3xl font-semibold text-slate-900 mb-6">
          Page not found
        </h2>
        
        <p className="text-xl text-slate-600 mb-12 max-w-md mx-auto leading-relaxed">
          Looks like you tried to access a page that doesn&apos;t exist. 
          How about exploring our available opportunities?
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary inline-flex items-center text-lg px-8 py-4">
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <Link href="/jobs" className="btn-secondary inline-flex items-center text-lg px-8 py-4">
            <Search className="w-5 h-5 mr-2" />
            Browse Jobs
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
} 