import { useContext, useEffect, useMemo, useState } from "react";
import { EditorContext } from "../Context";
import classNames from "classnames";
import { LinkSuggestion } from "../Suggestion";
import { isMobile } from "../device";
import { titleCase } from "../../../Note";
import { BiSearch } from "react-icons/bi";
import Button from "../../Button";

const BASE_FONT_SIZE = 12;
const MULTIPLIER = 3;

const LinkSuggestions = ({
  suggestions,
}: {
  suggestions: LinkSuggestion[];
}) => {
  const { setSideBar, setOrNewNote, setSearchTerm } = useContext(EditorContext);

  const handleClick = (suggestion: LinkSuggestion) => {
    if (isMobile) {
      setSideBar(undefined);
    }
    setOrNewNote(titleCase(suggestion.text));
  };

  const handleSearch = (suggestion: LinkSuggestion) => {
    setSearchTerm(suggestion.text);
    setSideBar("explorer");
  };

  return (
    <ul style={{ fontSize: BASE_FONT_SIZE }} className="w-full space-y-2">
      {suggestions.map((suggestion, i) => (
        <li
          key={i}
          className={classNames(
            "bg-primary bg-opacity-10 px-4 py-1 rounded-lg inline-block space-x-2",
            "flex items-center group w-full"
          )}
          style={{
            fontSize: Math.min(
              BASE_FONT_SIZE + (suggestion.occurances - 1) * MULTIPLIER,
              27
            ),
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
  );
};

export default LinkSuggestions;
