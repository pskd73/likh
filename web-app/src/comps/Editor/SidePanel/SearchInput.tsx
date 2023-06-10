import { useContext } from "react";
import { BiSearch, BiX } from "react-icons/bi";
import { EditorContext } from "../Context";

const SearchInput = () => {
  const { searchTerm, setSearchTerm } = useContext(EditorContext);

  return (
    <div className="flex items-center text-sm">
      <input
        type="text"
        placeholder="Search"
        className="w-full p-2 outline-none"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <span className="inline-flex p-2 opacity-50 items-center space-x-1 cursor-pointer">
        {searchTerm && <BiX onClick={() => setSearchTerm("")} />}
        <BiSearch />
      </span>
    </div>
  );
};

export default SearchInput;
