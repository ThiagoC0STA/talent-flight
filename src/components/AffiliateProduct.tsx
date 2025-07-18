"use client";

import { BookOpen, Star, Clock, Users, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AffiliateProduct() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5EAF1] hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-[#0476D9] to-[#0487D9] rounded-xl flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#0476D9] uppercase tracking-wide">
            Interview Preparation
          </h3>
          <p className="text-xs text-[#010D26] opacity-75">
            Boost your interview success
          </p>
        </div>
      </div>

      {/* Product Image */}
      <div className="relative mb-4">
        <Image
          src="/product1.png"
          alt="10 Questions & Answers for the Cabin Crew interview"
          width={300}
          height={200}
          className="w-full rounded-xl shadow-md"
        />
        <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
          -28% OFF
        </div>
      </div>

      {/* Product Title */}
      <h4 className="font-bold text-[#011640] mb-3 text-lg leading-tight">
        10 Questions & Answers for the Cabin Crew interview
      </h4>

      {/* Description */}
      <p className="text-sm text-[#010D26] mb-4 leading-relaxed">
        Master the most common interview questions with proven strategies.
        Includes audio version and instant download.
      </p>

      {/* Features */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-xs text-[#010D26]">
          <Star className="w-3 h-3 text-yellow-500 fill-current" />
          <span>Proven Methods</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#010D26]">
          <Clock className="w-3 h-3 text-[#0476D9]" />
          <span>Quick Read</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#010D26]">
          <Users className="w-3 h-3 text-green-500" />
          <span>Includes Audio</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#010D26]">
          <BookOpen className="w-3 h-3 text-purple-500" />
          <span>eBook Format</span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl font-bold text-[#011640]">$18.00</span>
        <span className="text-sm text-gray-500 line-through">$25.00</span>
        <span className="text-xs text-green-600 font-semibold">Save $7</span>
      </div>

      {/* CTA Button */}
      <Link
        href="https://go.hotmart.com/B100903492J"
        target="_blank"
        rel="noopener noreferrer"
        className="group block w-full bg-gradient-to-r from-[#0476D9] to-[#0487D9] hover:from-[#011640] hover:to-[#0476D9] text-white py-3 px-4 rounded-xl font-semibold text-center transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
      >
        Get Interview Guide
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>

      {/* Trust indicators */}
      <div className="mt-4 pt-4 border-t border-[#E5EAF1]">
        <div className="flex items-center justify-center gap-3 text-xs text-[#010D26] opacity-60">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span>1000+ sold</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#0476D9]" />
            <span>Instant access</span>
          </div>
        </div>
      </div>
    </div>
  );
}
