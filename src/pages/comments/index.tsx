import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchComments } from "@/http/api";
import { cn } from "@/lib/utils";
import { useQuery } from "react-query";

// icons
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { RxCaretSort } from "react-icons/rx";
import { Button } from "@/components/ui/button";

type Comment = {
  body: string;
  email: string;
  id: number;
  name: string;
  postId: number;
};

const Comments = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(50);
  const [commentNumber, setCommentNumber] = useState([1, 10]);
  const [visiblePages, setVisiblePages] = useState([1, 2]);

  const handleFetchComments = async () => {
    const res = await fetchComments();
    const data = res.data;
    console.log(data);
    return res.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: "comments",
    queryFn: handleFetchComments,
    onSuccess: () => console.log("Data fetched successfully", data),
    staleTime: 5 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
  });

  const prevPageHandler = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      if (currentPage <= visiblePages[0]) {
        setVisiblePages((prev) => [prev[0] - 1, prev[1] - 1]);
      }
    }
  };

  const nextPageHandler = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      if (currentPage >= visiblePages[1]) {
        setVisiblePages((prev) => [prev[0] + 1, prev[1] + 1]);
      }
    }
  };

  const calculateVisiblePages = (
    currentPage: number,
    totalPages: number,
  ): [number, number] => {
    // Handle case where there are less than 2 total pages
    if (totalPages <= 1) {
      return [1, Math.max(1, totalPages)];
    }

    // If on the first page, show the first two pages
    if (currentPage === 1) {
      return [1, 2];
    }

    // If on the last page, show the last two pages
    if (currentPage === totalPages) {
      return [totalPages - 1, totalPages];
    }

    // For all other cases, show the current and next page
    // return [currentPage, Math.min(currentPage + 1, totalPages)];
    return [currentPage, currentPage + 1];
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(e.target.value);
    const newCurrentPage = 1;

    setPageSize(newPageSize);
    setCurrentPage(1); // resetting the currentPage

    const newVisiblePages = calculateVisiblePages(newCurrentPage, totalPages);
    setVisiblePages(newVisiblePages);
  };

  useEffect(() => {
    setTotalPages(data && Math.ceil(data.length / pageSize));
  }, [pageSize, data]);

  useEffect(() => {
    const startNumber = (currentPage - 1) * pageSize + 1;
    const endNumber = startNumber + pageSize - 1;
    setCommentNumber([startNumber, Math.min(endNumber, data?.length || 0)]);
  }, [currentPage, pageSize, data]);

  const handlePostIdSort = () => {};

  // Example sorting function
  const arr: number[] = [3, 2, 7, 1, 0, 1, 7, 8, 3, 9, 2, 34, 9, 12, 2];
  type SortingFun = (arr: number[]) => number[];
  const sortingFun: SortingFun = (arr): number[] => {
    if (arr.length <= 1) return arr;

    const pivot = arr[0];
    const left: number[] = [];
    const right: number[] = [];

    for (let i = 1; i <= arr.length; i++) {
      if (arr[i] < pivot) left.push(arr[i]);
      if (arr[i] > pivot) right.push(arr[i]);
    }

    return [...sortingFun(left), pivot, ...sortingFun(right)];
  };

  const handleExampleSort = () => {
    console.log("Array before sorting: ", arr);
    const res = sortingFun(arr);
    console.log("Sorted Array: ", res);
  };
  return (
    <div className="">
      {/* Sorting and Search */}
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <button
            className="bg-box-shadow flex items-center gap-3"
            onClick={handlePostIdSort}
          >
            Sort Post ID <RxCaretSort />
          </button>
          <button className="bg-box-shadow flex items-center gap-3">
            Sort Name <RxCaretSort />
          </button>
          <button className="bg-box-shadow flex items-center gap-3">
            Sort Email <RxCaretSort />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search comments"
            className="focus:outline-none px-3 py-1 border-gray-300 rounded-md"
          />
          <button className="bg-primary px-4 py-1 text-white rounded-md">
            Search
          </button>
        </div>
      </div>
      {/* Comments table */}
      <div>
        <Table className={cn("bg-box-shadow", "rounded-lg")}>
          <Button onClick={handleExampleSort}>Handle Example Sort</Button>
          <TableCaption>
            {/* Pagination Controls*/}
            <div className="flex items-center justify-end gap-3">
              <span className="">
                {commentNumber[0]}-{commentNumber[1]} of 500 items
              </span>
              <div className="flex gap-3">
                <button
                  className={cn(
                    currentPage === 1 && "cursor-not-allowed text-gray-100",
                  )}
                  disabled={currentPage === 1}
                  onClick={() => prevPageHandler()}
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
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ) : null,
                )}
                <button
                  className={cn(
                    currentPage === totalPages &&
                      "cursor-not-allowed text-gray-100",
                  )}
                  disabled={currentPage === totalPages}
                  onClick={() => nextPageHandler()}
                >
                  <IoIosArrowForward />
                </button>
              </div>
              {/* Page size Dropdown */}
              <div className="px-3 py-0.5 border-2 rounded-sm">
                <select
                  onChange={handlePageSizeChange}
                  className="hover:border-gray-400 focus:outline-none text-gray-700 bg-white border-gray-300 rounded-md"
                  defaultValue={10}
                >
                  <option value="10">10 / Page</option>
                  <option value="50">50 / Page</option>
                  <option value="100">100 / Page</option>
                </select>
              </div>
            </div>
          </TableCaption>
          <TableHeader className="text-primary ">
            <TableRow className="h-16">
              <TableHead className="w-[100px] text-primary font-bold rounded-tl-lg bg-gray-400/70">
                Post ID
              </TableHead>
              <TableHead className="text-primary bg-gray-400/70 font-bold">
                Name
              </TableHead>
              <TableHead className="text-primary bg-gray-400/70 font-bold">
                Email
              </TableHead>
              <TableHead className="text-primary bg-gray-400/70 font-bold rounded-tr-lg">
                Comment
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              /* Loading state */
              isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              )
            }
            {
              /* Error state */
              isError && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Error fetching comments
                  </TableCell>
                </TableRow>
              )
            }
            {
              /* Data state */
              data?.length > 0 &&
                data
                  ?.slice(
                    currentPage * pageSize - pageSize,
                    currentPage * pageSize,
                  )
                  ?.map((comment: Comment) => {
                    return (
                      <TableRow key={comment.id} className="">
                        <TableCell>{comment.id}</TableCell>
                        <TableCell>{comment.name}</TableCell>
                        <TableCell>{comment.email.toLowerCase()}</TableCell>
                        <TableCell className="">{comment.body}</TableCell>
                      </TableRow>
                    );
                  })
            }
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default Comments;
