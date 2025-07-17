"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import Button from "@/components/ui/Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  const getItemRange = () => {
    if (!totalItems || !itemsPerPage) return null;

    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);

    return { start, end, total: totalItems };
  };

  const itemRange = getItemRange();

  return (
    <div
      className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-[#E5EAF1] p-6 ${className}`}
    >
      {/* Items info */}
      {itemRange && (
        <div className="text-center mb-6">
          <p className="text-sm text-[#6B7280]">
            Showing{" "}
            <span className="font-semibold text-[#011640]">
              {itemRange.start}-{itemRange.end}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#011640]">
              {itemRange.total.toLocaleString()}
            </span>{" "}
            results
          </p>
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center justify-center gap-2">
        {/* Previous button */}
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className={`flex items-center gap-2 px-4 py-2 transition-all duration-200 ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#0476D9] hover:text-white hover:border-[#0476D9]"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline font-medium">Previous</span>
        </Button>

        {/* Numbers of pages */}
        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) => (
            <div key={index}>
              {page === "..." ? (
                <div className="flex items-center justify-center w-10 h-10 mx-1">
                  <MoreHorizontal className="w-4 h-4 text-[#9CA3AF]" />
                </div>
              ) : (
                <Button
                  onClick={() => onPageChange(page as number)}
                  variant={currentPage === page ? "primary" : "outline"}
                  size="sm"
                  className={`w-10 h-10 p-0 flex items-center justify-center font-medium transition-all duration-200 ${
                    currentPage === page
                      ? "bg-[#0476D9] text-white border-[#0476D9] shadow-lg"
                      : "hover:bg-[#F3F7FA] hover:border-[#0476D9] hover:text-[#0476D9]"
                  }`}
                >
                  {page}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Botão Próximo */}
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className={`flex items-center gap-2 px-4 py-2 transition-all duration-200 ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#0476D9] hover:text-white hover:border-[#0476D9]"
          }`}
        >
          <span className="hidden sm:inline font-medium">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Indicador de página atual */}
      <div className="text-center mt-4">
        <span className="text-xs text-[#9CA3AF]">
          Page {currentPage} of {totalPages}
        </span>
      </div>
    </div>
  );
}
