"use client";

import {
  MapPin,
  Clock,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Job } from "@/types/job";
import { formatSalary, formatDate, generateJobSlug } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// Estilos customizados para o Swiper
const swiperStyles = `
  .related-jobs-swiper {
    padding-bottom: 20px;
  }
  
  .related-jobs-swiper .swiper-slide {
    height: auto;
  }
`;

interface RelatedJobsProps {
  relatedJobs: Job[];
}

export default function RelatedJobs({ relatedJobs }: RelatedJobsProps) {
  const getExperienceColor = (experience?: string) => {
    const colors = {
      intern: "bg-green-100 text-green-800",
      junior: "bg-blue-100 text-blue-800",
      "junior-mid": "bg-cyan-100 text-cyan-800",
      mid: "bg-yellow-100 text-yellow-800",
      "mid-senior": "bg-orange-100 text-orange-800",
      senior: "bg-purple-100 text-purple-800",
      between: "bg-gray-100 text-gray-800",
    };
    if (!experience) return "bg-gray-100 text-gray-800";
    return (
      colors[experience as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const getTypeColor = (type: string) => {
    const colors = {
      "full-time": "bg-[#0476D9] text-white",
      "part-time": "bg-[#0487D9] text-white",
      contract: "bg-[#011640] text-white",
      internship: "bg-[#010D26] text-white",
      freelance: "bg-[#00070D] text-white",
    };
    return colors[type as keyof typeof colors] || "bg-gray-500 text-white";
  };

  if (!relatedJobs || relatedJobs.length === 0) {
    return null;
  }

  return (
    <>
      <style jsx global>
        {swiperStyles}
      </style>
      <div className="bg-white rounded-2xl p-6  shadow-sm animate-fade-in mt-8">
        <div className="flex items-center justify-between mb-6 md:mb-2">
          <h2 className="md:text-2xl text-xl font-bold text-[#011640]">
            Related Jobs
          </h2>
          <div className="flex items-center gap-2">
            <button className="related-jobs-prev bg-[#F3F7FA] hover:bg-[#0476D9] hover:text-white text-[#0476D9] p-2 rounded-lg transition-all duration-300">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="related-jobs-next bg-[#F3F7FA] hover:bg-[#0476D9] hover:text-white text-[#0476D9] p-2 rounded-lg transition-all duration-300">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          navigation={{
            nextEl: ".related-jobs-next",
            prevEl: ".related-jobs-prev",
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }}
          className="related-jobs-swiper md:!py-3 md:!px-2"
        >
          {relatedJobs.slice(0, 12).map((job) => (
            <SwiperSlide key={job.id}>
              <Link
                href={`/job/${generateJobSlug(job.title, job.company)}`}
                className="group block bg-white rounded-2xl p-6 hover:bg-gradient-to-br hover:from-[#F3F7FA] hover:to-white hover:shadow-xl transition-all duration-500 border border-[#E5EAF1] hover:border-[#0476D9] hover:scale-102 relative overflow-hidden"
              >
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-100/0 group-hover:from-blue-50/50 group-hover:to-blue-100/30 transition-all duration-500"></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Header with logo and company */}
                  <div className="flex items-start gap-4 mb-5">
                    {job.companyLogo && (
                      <div className="relative">
                        <Image
                          width={56}
                          height={56}
                          unoptimized
                          src={job.companyLogo}
                          alt={`${job.company} logo`}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-[#E5EAF1] group-hover:border-[#0476D9] transition-all duration-300 shadow-lg"
                        />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-[#0476D9] to-[#0487D9] rounded-full border-2 border-white"></div>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-[#011640] group-hover:text-[#0476D9] transition-colors line-clamp-2 mb-2 leading-tight">
                        {job.title}
                      </h3>
                      <p className="text-sm text-[#0476D9] font-semibold truncate">
                        {job.company}
                      </p>
                    </div>
                  </div>

                  {/* Job details */}
                  <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-3 text-sm text-[#010D26] bg-[#F3F7FA] rounded-xl p-3">
                      <MapPin className="w-4 h-4 text-[#0476D9] flex-shrink-0" />
                      <span className="truncate font-medium">
                        {job.location}
                      </span>
                      {job.isRemote && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex-shrink-0 font-semibold">
                          Remote
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#010D26] bg-[#F3F7FA] rounded-xl p-3">
                      <Clock className="w-4 h-4 text-[#0476D9] flex-shrink-0" />
                      <span className="capitalize font-medium">
                        {job.type.replace("-", " ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#010D26] bg-[#F3F7FA] rounded-xl p-3">
                      <DollarSign className="w-4 h-4 text-[#0476D9] flex-shrink-0" />
                      <span className="font-bold text-[#011640]">
                        {formatSalary(job.salary)}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-full ${getExperienceColor(
                        job.experience
                      )} shadow-sm`}
                    >
                      {job.experience
                        ? job.experience.charAt(0).toUpperCase() +
                          job.experience.slice(1)
                        : "N/A"}
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-full ${getTypeColor(
                        job.type
                      )} shadow-sm`}
                    >
                      {job.type.replace("-", " ")}
                    </span>
                    {job.isFeatured && (
                      <span className="bg-gradient-to-r from-[#0476D9] to-[#0487D9] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-[#E5EAF1] flex items-center justify-between">
                    <p className="text-xs text-[#010D26] opacity-75 font-medium">
                      Posted {formatDate(job.createdAt)}
                    </p>
                    <div className="flex items-center gap-1 text-[#0476D9] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs font-semibold">View Job</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
