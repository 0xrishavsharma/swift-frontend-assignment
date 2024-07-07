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
import { useAuthStore } from "@/store";

const Comments = () => {
  const [originalData, setOriginalData] = useState<Comment[]>([]);
  const { userActivity, setUserActivity } = useAuthStore();

  // Sorting and Search(Filtering) state
  const [postIdSortMode, setPostIdSortMode] = useState<
    "ascending" | "descending" | "none"
  >(userActivity?.sortType === "postId" ? userActivity.sortMode : "none");
  const [nameSortMode, setNameSortMode] = useState<
    "ascending" | "descending" | "none"
  >(userActivity?.sortType === "name" ? userActivity.sortMode : "none");
  const [emailSortMode, setEmailSortMode] = useState<
    "ascending" | "descending" | "none"
  >(userActivity?.sortType === "email" ? userActivity.sortMode : "none");
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
    const nextPostIdSortMode =
      postIdSortMode === "none"
        ? "descending"
        : postIdSortMode === "descending"
          ? "ascending"
          : "none";
    setUserActivity({
      ...userActivity,
      sortType: "postId",
      sortMode: nextPostIdSortMode,
    });
  };

  // Name Sorting
  const handleNameSort = () => {
    setPostIdSortMode("none");
    setEmailSortMode("none");
    const nextNameSortMode =
      nameSortMode === "none"
        ? "descending"
        : nameSortMode === "descending"
          ? "ascending"
          : "none";
    setNameSortMode(nextNameSortMode);
    setUserActivity({
      ...userActivity,
      sortType: "name",
      sortMode: nextNameSortMode,
    });
  };

  // Email Sorting
  const handleEmailSort = () => {
    setNameSortMode("none");
    setPostIdSortMode("none");
    const nextNameSortMode =
      emailSortMode === "none"
        ? "descending"
        : nameSortMode === "descending"
          ? "ascending"
          : "none";
    setEmailSortMode(nextNameSortMode);
    setUserActivity({
      ...userActivity,
      sortType: "email",
      sortMode: nextNameSortMode,
    });
  };

  // Search and filtering
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserActivity({
      ...userActivity,
      searchQuery: e.target.value,
    });
    setSearchQuery(
      userActivity?.searchQuery ? userActivity.searchQuery : e.target.value,
    );
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
    // setCurrentPage(1); // Reset to first page when data changes
  }, [
    originalData,
    debouncedSearchQuery,
    postIdSortMode,
    nameSortMode,
    emailSortMode,
  ]);

  useEffect(() => {
    if (userActivity) {
      setSearchQuery(userActivity.searchQuery || "");
    }
  }, [userActivity]);

  return (
    <div className="flex flex-col gap-6">
      {/* Sorting and Search */}
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <button
            className={cn(
              postIdSortMode === "ascending" || postIdSortMode === "descending"
                ? " border-primary shadow-xl bg-gray-100"
                : "border-transparent bg-box-shadow ",
              "flex items-center gap-3 px-2 py-0.5 rounded-sm text-gray-600 border-2",
            )}
            onClick={handlePostIdSort}
            value={userActivity ? userActivity.sortMode : "none"}
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
            className={cn(
              nameSortMode === "ascending" || nameSortMode === "descending"
                ? " border-primary shadow-xl bg-gray-100"
                : "border-transparent bg-box-shadow",
              "flex items-center gap-3 px-2 py-0.5 rounded-sm text-gray-600 border-2 ",
            )}
            onClick={handleNameSort}
            value={userActivity ? userActivity.sortMode : "none"}
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
            className={cn(
              emailSortMode === "ascending" || emailSortMode === "descending"
                ? " border-primary shadow-xl bg-gray-100"
                : "border-transparent bg-box-shadow ",
              "flex items-center gap-3 px-2 py-0.5 rounded-sm text-gray-600 border-2",
            )}
            onClick={handleEmailSort}
            value={userActivity ? userActivity.sortMode : "none"}
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
