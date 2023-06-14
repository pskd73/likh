import { ChangeEventHandler, useContext } from "react";
import { BiSearch, BiX } from "react-icons/bi";
import { EditorContext } from "../Context";

const SearchInput = () => {
  const {
    searchTerm,
    setSearchTerm,
    isSideMenuActive,
    toggleSideMenu,
  } = useContext(EditorContext);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value) {
      if (!isSideMenuActive("notes")) {
        toggleSideMenu("notes");
      }
    } else {
      if (isSideMenuActive("notes")) {
        toggleSideMenu("notes");
      }
    }
  };

  return (
    <div className="flex items-center text-sm">
      <input
        type="text"
        placeholder="Search"
        className="w-full p-2 outline-none"
        value={searchTerm}
        onChange={handleChange}
      />
      <span className="inline-flex p-2 opacity-50 items-center space-x-1 cursor-pointer">
        {searchTerm && <BiX onClick={() => setSearchTerm("")} />}
        <BiSearch />
      </span>
    </div>
  );
};

export default SearchInput;
