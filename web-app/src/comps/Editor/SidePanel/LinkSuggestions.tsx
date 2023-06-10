import { useContext, useMemo, useState } from "react";
import { EditorContext } from "../Context";
import classNames from "classnames";
import Collapsible from "../Collapsible";
import { LinkSuggestion } from "../Suggestion";
import { isMobile } from "../device";
import { titleCase } from "../../../Note";

const BASE_FONT_SIZE = 12;
const MULTIPLIER = 3;

const LinkSuggestions = () => {
  const { getLinkSuggestions, setSideBar, setOrNewNote, note } =
    useContext(EditorContext);
  const [update, setUpdate] = useState(new Date().getTime());
  const suggestions = useMemo(() => getLinkSuggestions(), [update, note.id]);

  const handleClick = (suggestion: LinkSuggestion) => {
    if (isMobile) {
      setSideBar(undefined);
    }
    setOrNewNote(titleCase(suggestion.text));
    setUpdate(new Date().getTime());
  };

  return (
    <Collapsible>
      <Collapsible.Item title="Links to expand" active onToggle={() => {}}>
        <div className="p-2 py-4">
          <ul
            className="flex gap-2 flex-wrap"
            style={{ fontSize: BASE_FONT_SIZE }}
          >
            {suggestions.map((suggestion) => (
              <li
                className={classNames(
                  "bg-primary-700 bg-opacity-10 py-1 px-2 rounded-lg inline-block space-x-2",
                  "flex items-center"
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
              </li>
            ))}
          </ul>
        </div>
      </Collapsible.Item>
    </Collapsible>
  );
};

export default LinkSuggestions;
