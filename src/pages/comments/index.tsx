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
import { useEffect, useState } from "react";

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
    return [currentPage, Math.min(currentPage + 1, totalPages)];
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(e.target.value);
    const firstItemIndex = (currentPage - 1) * pageSize; // Calculating the index of the first item on the current page
    const newCurrentPage = Math.floor(firstItemIndex / newPageSize) + 1; // Calculating the new current page

    setPageSize(newPageSize);
    setCurrentPage(newCurrentPage); // Update the current page based on the new page size

    const newVisiblePages = calculateVisiblePages(newCurrentPage, totalPages);
    setVisiblePages(newVisiblePages);
  };

  useEffect(() => {
    setTotalPages(data ? Math.ceil(data.length / pageSize) : 0); // Recalculate total pages when data or pageSize changes
    const startNumber = (currentPage - 1) * pageSize + 1;
    const endNumber = startNumber + pageSize - 1;
    setCommentNumber([startNumber, Math.min(endNumber, data?.length || 0)]); // Adjust commentNumber based on the new currentPage and pageSize
  }, [data, pageSize, currentPage]);

  useEffect(() => {
    setTotalPages(data && Math.ceil(data.length / pageSize));
  }, [pageSize, data]);

  useEffect(() => {
    const startNumber = (currentPage - 1) * pageSize + 1;
    const endNumber = startNumber + pageSize - 1;
    setCommentNumber([startNumber, Math.min(endNumber, data?.length || 0)]);
  }, [currentPage, pageSize, data]);
  return (
    <div className="">
      {/* Sorting and Search */}
      <div className="flex justify-between"></div>
      {/* Comments table */}
      <div>
        <Table className={cn("bg-box-shadow", "rounded-lg")}>
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
                >
                  <option value="10" selected>
                    10 / Page
                  </option>
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
                  .slice(
                    currentPage * pageSize - pageSize,
                    currentPage * pageSize,
                  )
                  ?.map((comment: Comment) => {
                    return (
                      <TableRow key={comment.id} className="">
                        <TableCell>{comment.id}</TableCell>
                        <TableCell>{comment.name}</TableCell>
                        <TableCell>{comment.email}</TableCell>
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
