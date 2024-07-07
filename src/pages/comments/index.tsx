import { useEffect, useMemo, useState } from "react";

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
import useDebounce from "@/hooks/useDebounce";
import useSearchAndHighlight from "@/hooks/useSearchAndHighlight";
import DOMPurify from "dompurify";
import { Comment } from "@/types";
import { Pagination } from "@/components/pagination";
import { usePagination } from "@/hooks/usePagination";
import Search from "@/components/search";

// React icons
import { RxCaretSort } from "react-icons/rx";
import {
  BsSortAlphaDownAlt,
  BsSortAlphaUpAlt,
  BsSortNumericDownAlt,
  BsSortNumericUpAlt,
} from "react-icons/bs";

const Comments = () => {
  const [originalData, setOriginalData] = useState<Comment[]>([]);

  // Sorting and Search(Filtering) state
  const [postIdSortMode, setPostIdSortMode] = useState("none");
  const [nameSortMode, setNameSortMode] = useState("none");
  const [emailSortMode, setEmailSortMode] = useState("none");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<Comment[]>([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const memoizedSearchAndFilterKeys = useMemo(
    () => ["id", "name", "email", "body"] as (keyof Comment)[],
    [],
  );
  const highlightedData = useSearchAndHighlight(
    filteredData,
    debouncedSearchQuery,
    {
      query: debouncedSearchQuery,
      keys: memoizedSearchAndFilterKeys,
    },
  );

  const {
    currentPage,
    pageSize,
    totalPages,
    visiblePages,
    commentRange,
    setCurrentPage,
    prevPage,
    nextPage,
    setPageSize,
  } = usePagination({
    totalItems: filteredData?.length,
  });

  const handleFetchComments = async () => {
    const res = await fetchComments();
    return res.data;
  };

  const { isLoading, isError } = useQuery({
    queryKey: "comments",
    queryFn: handleFetchComments,
    onSuccess: (data) => {
      setOriginalData(data);
      setFilteredData(data);
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
  });

  const handlePageSizeChange = (_newPageSize: number) => {
    setPageSize(_newPageSize);
    setCurrentPage(1);
  };

  // Post Id Sorting
  const handlePostIdSort = () => {
    setNameSortMode("none");
    setEmailSortMode("none");
    setPostIdSortMode((prevPostIdSortMode) => {
      return prevPostIdSortMode === "none"
        ? "ascending"
        : prevPostIdSortMode === "ascending"
          ? "descending"
          : "none";
    });
  };

  // Name Sorting
  const handleNameSort = () => {
    setPostIdSortMode("none");
    setEmailSortMode("none");
    setNameSortMode((prevEmailSortMode) => {
      return prevEmailSortMode === "none"
        ? "ascending"
        : prevEmailSortMode === "ascending"
          ? "descending"
          : "none";
    });
  };

  // Email Sorting
  const handleEmailSort = () => {
    setNameSortMode("none");
    setPostIdSortMode("none");
    setEmailSortMode((prevEmailSortMode) => {
      return prevEmailSortMode === "none"
        ? "ascending"
        : prevEmailSortMode === "ascending"
          ? "descending"
          : "none";
    });
  };

  // Search and filtering
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    let newFilteredData = [...originalData];

    // Apply search filter
    if (debouncedSearchQuery.length > 2) {
      newFilteredData = newFilteredData.filter((comment: Comment) => {
        return (
          comment.name
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          comment.email
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          comment.body
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase())
        );
      });
    }

    // Apply sorting
    if (postIdSortMode !== "none") {
      newFilteredData.sort((a, b) =>
        postIdSortMode === "ascending" ? a.id - b.id : b.id - a.id,
      );
    } else if (nameSortMode !== "none") {
      newFilteredData.sort((a, b) => {
        const compare = a.name.localeCompare(b.name);
        return nameSortMode === "ascending" ? compare : -compare;
      });
    } else if (emailSortMode !== "none") {
      newFilteredData.sort((a, b) => {
        const compare = a.email.localeCompare(b.email);
        return emailSortMode === "ascending" ? compare : -compare;
      });
    }

    setFilteredData(newFilteredData);
    setCurrentPage(1); // Reset to first page when data changes
  }, [
    originalData,
    debouncedSearchQuery,
    postIdSortMode,
    nameSortMode,
    emailSortMode,
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Sorting and Search */}
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <button
            className="bg-box-shadow flex items-center gap-3 px-2 py-0.5 rounded-sm text-gray-600"
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
            className="bg-box-shadow flex items-center gap-3 px-2 py-0.5 rounded-sm text-gray-600"
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
            className="bg-box-shadow flex items-center gap-3 px-2 py-0.5 rounded-sm text-gray-600"
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
        {/* Search and Filter results */}
        <Search handleSearchInput={handleSearchInput} />
      </div>
      {/* Comments table */}
      <div>
        <Table className={cn("bg-box-shadow", "rounded-lg")}>
          <TableCaption>
            {/* Pagination Controls*/}
            <Pagination
              commentRange={commentRange}
              currentPage={currentPage}
              setPageSize={setPageSize}
              setCurrentPage={setCurrentPage}
              totalItems={highlightedData?.length || 500}
              totalPages={totalPages}
              visiblePages={visiblePages}
              prevPage={prevPage}
              nextPage={nextPage}
              onPageChange={setCurrentPage}
              onPageSizeChange={handlePageSizeChange}
              pageSize={pageSize}
            />
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
              highlightedData?.length > 0 ? (
                highlightedData
                  ?.slice(
                    currentPage * pageSize - pageSize,
                    currentPage * pageSize,
                  )
                  ?.map((comment: Comment) => {
                    const sanitizedName = DOMPurify.sanitize(comment.name);
                    const sanitizedEmail = DOMPurify.sanitize(comment.email);
                    const sanitizedBody = DOMPurify.sanitize(comment.body);
                    return (
                      <TableRow key={comment.id} className="">
                        <TableCell>{comment.id}</TableCell>
                        <TableCell
                          dangerouslySetInnerHTML={{ __html: sanitizedName }}
                        />
                        <TableCell
                          dangerouslySetInnerHTML={{
                            __html: sanitizedEmail.toLowerCase(),
                          }}
                        />
                        <TableCell
                          dangerouslySetInnerHTML={{ __html: sanitizedBody }}
                        />
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No comments found matching your search
                  </TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default Comments;
