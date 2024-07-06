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
import {
  BsSortAlphaDownAlt,
  BsSortAlphaUpAlt,
  BsSortNumericDownAlt,
  BsSortNumericUpAlt,
} from "react-icons/bs";

type Comment = {
  body: string;
  email: string;
  id: number;
  name: string;
  postId: number;
};

const Comments = () => {
  const [displayData, setDisplayData] = useState<Comment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(50);
  const [commentNumber, setCommentNumber] = useState([1, 10]);
  const [visiblePages, setVisiblePages] = useState([1, 2]);

  // Sorting state
  const [postIdSortMode, setPostIdSortMode] = useState("none");
  const [nameSortMode, setNameSortMode] = useState("none");
  const [emailSortMode, setEmailSortMode] = useState("none");

  const handleFetchComments = async () => {
    const res = await fetchComments();
    const data = res.data;
    console.log(data);
    return res.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: "comments",
    queryFn: handleFetchComments,
    onSuccess: (data) => {
      setDisplayData(data);
      console.log("displayData in place: ", displayData);
    },
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

  const handlePostIdSort = () => {
    const nextPostIdSortMode =
      postIdSortMode === "none"
        ? "ascending"
        : postIdSortMode === "ascending"
          ? "descending"
          : "none";
    setNameSortMode("none");
    setEmailSortMode("none");
    setPostIdSortMode(nextPostIdSortMode);
    let sortedData: Comment[];
    if (nextPostIdSortMode === "ascending") {
      sortedData = [...data]?.sort((a, b) => a.id - b.id);
    } else if (nextPostIdSortMode === "descending") {
      sortedData = [...data]?.sort((a, b) => b.id - a.id);
    } else {
      sortedData = [...data];
    }
    setDisplayData(sortedData);
  };

  const handleNameSort = () => {
    const nextNameSortMode =
      nameSortMode === "none"
        ? "ascending"
        : nameSortMode === "ascending"
          ? "descending"
          : "none";
    setPostIdSortMode("none");
    setEmailSortMode("none");
    setNameSortMode(nextNameSortMode);
    let sortedData: Comment[];
    if (nextNameSortMode === "ascending") {
      sortedData = [...displayData].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
    } else if (nextNameSortMode === "descending") {
      sortedData = [...displayData].sort((a, b) =>
        b.name.localeCompare(a.name),
      );
    } else {
      sortedData = [...data]; // Assuming 'data' is the original unsorted data
    }
    setDisplayData(sortedData);
  };

  const handleEmailSort = () => {
    const nextEmailSortMode =
      emailSortMode === "none"
        ? "ascending"
        : emailSortMode === "ascending"
          ? "descending"
          : "none";
    setNameSortMode("none");
    setPostIdSortMode("none");
    setEmailSortMode(nextEmailSortMode);
    let sortedData: Comment[];
    if (nextEmailSortMode === "ascending") {
      sortedData = [...displayData].sort((a, b) =>
        a.email.localeCompare(b.email),
      );
    } else if (nextEmailSortMode === "descending") {
      sortedData = [...displayData].sort((a, b) =>
        b.email.localeCompare(a.email),
      );
    } else {
      sortedData = [...data]; // Assuming 'data' is the original unsorted data
    }
    setDisplayData(sortedData);
  };
  return (
    <div className="flex flex-col gap-6">
      {/* Sorting and Search */}
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <button
            className="bg-box-shadow flex items-center gap-3 px-2 py-0.5 rounded-sm"
            onClick={handlePostIdSort}
          >
            Sort Post ID
            {postIdSortMode === "ascending" ? (
              <BsSortNumericUpAlt className="text-lg" />
            ) : postIdSortMode === "descending" ? (
              <BsSortNumericDownAlt className="text-lg" />
            ) : (
              <RxCaretSort className="text-lg" />
            )}
          </button>
          <button
            className="bg-box-shadow flex items-center gap-3 px-2 py-0.5 rounded-sm"
            onClick={handleNameSort}
          >
            Sort Name
            {nameSortMode === "ascending" ? (
              <BsSortAlphaUpAlt className="text-lg" />
            ) : nameSortMode === "descending" ? (
              <BsSortAlphaDownAlt className="text-lg" />
            ) : (
              <RxCaretSort className="text-lg" />
            )}
          </button>
          <button
            className="bg-box-shadow flex items-center gap-3 px-2 py-0.5 rounded-sm"
            onClick={handleEmailSort}
          >
            Sort Email
            {emailSortMode === "ascending" ? (
              <BsSortAlphaUpAlt className="text-lg" />
            ) : emailSortMode === "descending" ? (
              <BsSortAlphaDownAlt className="text-lg" />
            ) : (
              <RxCaretSort className="text-lg" />
            )}
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
              displayData?.length > 0 &&
                displayData
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
