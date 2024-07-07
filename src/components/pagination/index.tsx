import React from "react";
import { cn } from "@/lib/utils";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface PaginationProps {
  commentRange: [number, number];
  totalItems: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  totalPages: number;
  visiblePages: number[];
  prevPage: () => void;
  nextPage: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  commentRange,
  totalItems,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  totalPages,
  visiblePages,
  prevPage,
  nextPage,
  onPageChange,
  onPageSizeChange,
}) => {
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    onPageChange(page);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(e.target.value);
    setPageSize(newPageSize);
    setCurrentPage(1);
    onPageSizeChange(newPageSize);
  };

  return (
    <div className="flex items-center justify-end gap-3">
      <span>
        {commentRange[0]}-{commentRange[1]} of {totalItems} items
      </span>
      <div className="flex gap-3">
        <button
          className={cn(
            currentPage === 1 && "cursor-not-allowed text-gray-100",
          )}
          disabled={currentPage === 1}
          onClick={prevPage}
        >
          <IoIosArrowBack />
        </button>
        {visiblePages.map((page) =>
          page <= totalPages ? (
            <button
              key={page}
              className={cn(
                currentPage === page
                  ? "border-secondary border-2"
                  : "border-transparent",
                "px-2.5 py-0.5 rounded-sm border-2",
              )}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ) : null,
        )}
        <button
          className={cn(
            currentPage === totalPages && "cursor-not-allowed text-gray-100",
          )}
          disabled={currentPage === totalPages}
          onClick={nextPage}
        >
          <IoIosArrowForward />
        </button>
      </div>
      <div className="px-3 py-0.5 border-2 rounded-sm">
        <select
          onChange={handlePageSizeChange}
          className="hover:border-gray-400 focus:outline-none text-gray-700 bg-white border-gray-300 rounded-md"
          value={pageSize}
        >
          <option value="10">10 / Page</option>
          <option value="50">50 / Page</option>
          <option value="100">100 / Page</option>
        </select>
      </div>
    </div>
  );
};
