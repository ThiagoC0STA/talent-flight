import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
      <div className="text-sm text-gray-600 order-2 sm:order-1">
        page <span className="font-bold">{currentPage}</span> of{" "}
        <span className="font-bold">{totalPages}</span>
      </div>
      <div className="flex gap-1 order-1 sm:order-2">
        <button
          className="px-2 sm:px-3 py-2 rounded-l-lg bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 text-sm"
          onClick={() => goTo(1)}
          disabled={currentPage === 1}
          title="Primeira página"
        >
          «
        </button>
        <button
          className="px-2 sm:px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 text-sm hidden sm:block"
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="px-2 sm:px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 text-sm hidden sm:block"
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <button
          className="px-2 sm:px-3 py-2 rounded-r-lg bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 text-sm"
          onClick={() => goTo(totalPages)}
          disabled={currentPage === totalPages}
          title="Última página"
        >
          »
        </button>
      </div>
    </div>
  );
}
