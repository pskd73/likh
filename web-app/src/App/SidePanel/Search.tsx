import classNames from "classnames";
import { BiSearch, BiX } from "react-icons/bi";

const Search = ({
  searchTerm,
  onChange,
}: {
  searchTerm: string;
  onChange: (term: string) => void;
}) => {
  return (
    <div
      className={classNames(
        "flex justify-between items-center",
        "border rounded border-primary border-opacity-20",
        "overflow-hidden py-1 px-2 bg-base"
      )}
    >
      <input
        id="search"
        type="text"
        placeholder="Search here"
        className={classNames(
          "placeholder-primary placeholder-opacity-40",
          "outline-none bg-base w-full"
        )}
        onChange={(e) => onChange(e.target.value)}
        value={searchTerm}
      />
      <div className="ml-2 opacity-50 flex space-x-2">
        {searchTerm && (
          <BiX
            onClick={() => onChange("")}
            onKeyUp={(e) => e.key === "Enter" && onChange("")}
            className="cursor-pointer"
            tabIndex={0}
          />
        )}
        <BiSearch />
      </div>
    </div>
  );
};

export default Search;
