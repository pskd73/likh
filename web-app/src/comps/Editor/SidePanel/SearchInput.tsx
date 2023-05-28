import { BiSearch } from "react-icons/bi";

const SearchInput = () => {
  return (
    <div className="flex items-center">
      <input
        type="text"
        placeholder="Search"
        className="w-full p-2 outline-none"
      />
      <span className="inline-block p-2 opacity-50">
        <BiSearch />
      </span>
    </div>
  );
};

export default SearchInput;
