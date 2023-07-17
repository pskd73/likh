import classNames from "classnames";
import { parseListText, toggleCheckbox } from "../Core/List";
import { RNPluginCreator } from "./type";

const MarkdownListsPlugin: RNPluginCreator = () => {
  return {
    name: "Markdown Lists",
    version: 1,
    grammer: () => ({
      bulletUnordered: {
        pattern: /^ *[-*+] (\[[ x]\])?/m,
      },
      bulletOrdered: {
        pattern: /^ *[\d]+. /m,
      },
    }),
    leafMaker: ({ leaf, attributes, children, setSelection, editor }) => {
      if (leaf.bulletUnordered || leaf.bulletOrdered) {
        const parsed = parseListText(leaf.text + " ");
        const width = (parsed?.level || 1) * 100;
        return (
          <span
            {...attributes}
            style={{ marginLeft: -width, width }}
            className={"text-primary text-opacity-50 inline-block text-right"}
          >
            {leaf.bulletUnordered && !leaf.focused && !parsed?.checkbox && (
              <span
                contentEditable={false}
                onFocus={() =>
                  setSelection({
                    anchor: { path: leaf.path, offset: leaf.text.length - 1 },
                    focus: { path: leaf.path, offset: leaf.text.length - 1 },
                  })
                }
                onClick={() =>
                  setSelection({
                    anchor: { path: leaf.path, offset: leaf.text.length - 1 },
                    focus: { path: leaf.path, offset: leaf.text.length - 1 },
                  })
                }
              >
                •&nbsp;
              </span>
            )}

            {/* checkbox */}
            {parsed?.checkbox && !leaf.focused && (
              <span
                onClick={() => toggleCheckbox(editor, leaf.path)}
                contentEditable={false}
              >
                <input
                  type="checkbox"
                  checked={leaf.text.includes("x")}
                  readOnly
                  className="outline-none cursor-pointer"
                />&nbsp;
              </span>
            )}
            <span
              className={classNames({
                hidden: !leaf.focused && leaf.bulletUnordered,
              })}
            >
              {children}
            </span>
          </span>
        );
      }
    },
    elementMaker: ({ text, attributes, children }) => {
      const parsed = parseListText(text);
      if (parsed) {
        return (
          <p {...attributes}>
            <span className="inline-flex">
              <span
                contentEditable={false}
                style={{ width: 20 * (parsed.level + 1) }}
                className="flex-shrink-0"
              />
              <span>{children}</span>
            </span>
          </p>
        );
      }
    },
  };
};

export default MarkdownListsPlugin;
