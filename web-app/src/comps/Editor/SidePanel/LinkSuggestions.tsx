import { useContext, useMemo, useState } from "react";
import { EditorContext } from "../Context";
import classNames from "classnames";
import { LinkSuggestion } from "../Suggestion";
import { isMobile } from "../device";
import { titleCase } from "../../../Note";
import { BiSearch } from "react-icons/bi";
import Button from "../../Button";

const BASE_FONT_SIZE = 12;
const MULTIPLIER = 3;

const LinkSuggestions = () => {
  const {
    getLinkSuggestions,
    setSideBar,
    setOrNewNote,
    note,
    setSearchTerm,
  } = useContext(EditorContext);
  const [update, setUpdate] = useState(new Date().getTime());
  const suggestions = useMemo(() => getLinkSuggestions(), [update, note.id]);

  const handleClick = (suggestion: LinkSuggestion) => {
    if (isMobile) {
      setSideBar(undefined);
    }
    setOrNewNote(titleCase(suggestion.text));
    setUpdate(new Date().getTime());
  };

  const handleSearch = (suggestion: LinkSuggestion) => {
    setSearchTerm(suggestion.text);
    setSideBar("explorer");
  };

  return (
    <div className="p-2 py-4">
      <ul className="flex gap-2 flex-wrap" style={{ fontSize: BASE_FONT_SIZE }}>
        {suggestions.map((suggestion) => (
          <li
            className={classNames(
              "bg-primary-700 bg-opacity-10 py-1 px-2 rounded-lg inline-block space-x-2",
              "flex items-center group"
            )}
            style={{
              fontSize:
                BASE_FONT_SIZE + (suggestion.occurances - 1) * MULTIPLIER,
            }}
          >
            <span
              className="hover:underline cursor-pointer"
              onClick={() => handleClick(suggestion)}
            >
              {suggestion.text}
            </span>
            <span className="opacity-50">({suggestion.occurances})</span>
            <span className="flex items-center">
              <Button
                lite
                className="rounded-lg"
                onClick={() => handleSearch(suggestion)}
              >
                <BiSearch />
              </Button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LinkSuggestions;
