import { CiSearch } from "react-icons/ci";
import { CgCloseO } from "react-icons/cg";
import React, { useRef } from "react";
import { useAuthStore } from "@/store";

interface SearchProps {
  handleSearchInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Search: React.FC<SearchProps> = ({ handleSearchInput }) => {
  const { userActivity, setUserActivity } = useAuthStore();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleClearSearchInput = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
      setUserActivity({ ...userActivity, searchQuery: "" });
    }
    handleSearchInput({
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>);
  };
  return (
    <div className="bg-box-shadow md:w-80 flex items-center gap-3 px-5 py-2 rounded-md">
      <CiSearch />
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Search name, email, comments"
        className="focus:outline-none placeholder:text-sm w-full border-gray-300"
        value={userActivity.searchQuery}
        onChange={handleSearchInput}
      />
      <button>
        <CgCloseO
          className=" text-primary text-xs"
          onClick={handleClearSearchInput}
        />
      </button>
    </div>
  );
};
export default Search;
