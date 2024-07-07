import { useState, useEffect } from "react";

interface UsePaginationProps {
  totalItems: number;
  initialPageSize?: number;
  initialPage?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  visiblePages: [number, number];
  commentRange: [number, number];
  setCurrentPage: (page: number) => void;
  prevPage: () => void;
  nextPage: () => void;
  setPageSize: (size: number) => void;
}

export const usePagination = ({
  totalItems,
  initialPageSize = 10,
  initialPage = 1,
}: UsePaginationProps): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(totalItems / pageSize),
  );
  const [visiblePages, setVisiblePages] = useState<[number, number]>([1, 2]);
  const [commentRange, setCommentRange] = useState<[number, number]>([
    1,
    pageSize,
  ]);

  useEffect(() => {
    setTotalPages(Math.ceil(totalItems / pageSize));
  }, [totalItems, pageSize]);

  useEffect(() => {
    const startNumber = (currentPage - 1) * pageSize + 1;
    const endNumber = Math.min(startNumber + pageSize - 1, totalItems);
    setCommentRange([startNumber, endNumber]);
  }, [currentPage, pageSize, totalItems]);

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const calculateVisiblePages = (
    current: number,
    total: number,
  ): [number, number] => {
    console.log(
      "Current: ",
      current,
      "Total: ",
      total,
      "Total Pages: ",
      totalPages,
    );
    if (total <= 1) return [1, Math.max(1, total)];
    if (current === 1) return [1, 2];
    if (current === total) return [total - 1, total];
    return [current, current + 1];
  };

  useEffect(() => {
    setVisiblePages(calculateVisiblePages(currentPage, totalPages));
  }, [currentPage, totalPages]);

  return {
    currentPage,
    pageSize,
    totalPages,
    visiblePages,
    commentRange,
    setCurrentPage,
    prevPage,
    nextPage,
    setPageSize,
  };
};
