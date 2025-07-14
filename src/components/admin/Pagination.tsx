import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    <div className="flex items-center justify-between mt-6 gap-4 flex-wrap">
      <div className="text-sm text-gray-600">
        Página <span className="font-bold">{currentPage}</span> de <span className="font-bold">{totalPages}</span>
      </div>
      <div className="flex gap-1">
        <button
          className="px-3 py-2 rounded-l-lg bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50"
          onClick={() => goTo(1)}
          disabled={currentPage === 1}
        >
          «
        </button>
        <button
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50"
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <button
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50"
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Próxima
        </button>
        <button
          className="px-3 py-2 rounded-r-lg bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50"
          onClick={() => goTo(totalPages)}
          disabled={currentPage === totalPages}
        >
          »
        </button>
      </div>
    </div>
  );
} 