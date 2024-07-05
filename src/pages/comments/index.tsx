import React, { useState } from "react";
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

  const handleFetchComments = async () => {
    const res = await fetchComments();
    console.log(res.data);
    return res.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: "comments",
    queryFn: handleFetchComments,
    onSuccess: () => console.log("Data fetched successfully", data),
  });

  const totalItems = data?.totalItems || 500;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to first page with new page size
  };
  return (
    <div className="">
      {/* Sorting and Search */}
      <div className="flex justify-between"></div>
      {/* Comments table */}
      <div>
        <Table className={cn("bg-box-shadow", "rounded-lg")}>
          <TableCaption>
            {/* Pagination */}
            <div className="flex items-center justify-end gap-3">
              <span>{`${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, totalItems)} of ${totalItems} items`}</span>
              <div className="flex gap-3">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <IoIosArrowBack />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={
                      currentPage === i + 1
                        ? "border-secondary px-2.5 py-0.5 rounded-sm border-2"
                        : ""
                    }
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <IoIosArrowForward />
                </button>
              </div>
              {/* Page size Dropdown */}
              <div className="px-3 py-0.5 border-2 rounded-sm">
                <select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="hover:border-gray-400 focus:outline-none text-gray-700 bg-white border-gray-300 rounded-md"
                >
                  <option value="5">5 / Page</option>
                  <option value="10">10 / Page</option>
                  <option value="20">20 / Page</option>
                  <option value="50">50 / Page</option>
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
            {/* Data state */

            data?.slice(0, 10)?.map((comment: Comment) => {
              return (
                <TableRow key={comment.id} className="">
                  <TableCell>{comment.id}</TableCell>
                  <TableCell>{comment.name}</TableCell>
                  <TableCell>{comment.email}</TableCell>
                  <TableCell className="">{comment.body}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default Comments;
