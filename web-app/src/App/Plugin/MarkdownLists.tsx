import classNames from "classnames";
import { parseListText, toggleCheckbox } from "../Core/List";
import { RNPluginCreator } from "./type";

const MarkdownListsPlugin: RNPluginCreator = () => {
  return {
    name: "Markdown Lists",
    version: 1,
    grammer: () => ({
      bulletUnordered: {
        pattern: /^ *[-*+]( \[[ x]\])? /m,
        inside: {
          bullet: /^ *[-*+]( \[[ x]\])?/,
        },
      },
      bulletOrdered: {
        pattern: /^ *[\d]+\. /m,
        inside: {
          bullet: /^ *[\d]+\./,
        },
      },
    }),
    leafMaker: ({ leaf, attributes, children, setSelection, editor }) => {
      if (leaf.bullet) {
        const parsed = parseListText(leaf.text + " ");
        const level = parsed?.level || 1;
        const width = level * 100;
        return (
          <span
            {...attributes}
            style={{ marginLeft: -width - 4, width }}
            className={"text-primary text-opacity-50 inline-block text-right"}
          >
            <span>
              {leaf.bulletUnordered &&
                !leaf.bulletFocused &&
                !parsed?.checkbox && (
                  <span
                    onFocus={() =>
                      setSelection({
                        anchor: {
                          path: leaf.path,
                          offset: leaf.text.length - 1,
                        },
                        focus: {
                          path: leaf.path,
                          offset: leaf.text.length - 1,
                        },
                      })
                    }
                    onClick={() =>
                      setSelection({
                        anchor: {
                          path: leaf.path,
                          offset: leaf.text.length - 1,
                        },
                        focus: {
                          path: leaf.path,
                          offset: leaf.text.length - 1,
                        },
                      })
                    }
                    contentEditable={false}
                  >
                    •
                  </span>
                )}

              {leaf.bulletUnordered &&
                !leaf.bulletFocused &&
                parsed?.checkbox && (
                  <span
                    onClick={() => toggleCheckbox(editor, leaf.path)}
                    contentEditable={false}
                  >
                    <input
                      type="checkbox"
                      checked={leaf.text.includes("x")}
                      readOnly
                      className="outline-none cursor-pointer"
                    />
                  </span>
                )}

              <span
                className={classNames({
                  hidden: !leaf.bulletFocused && leaf.bulletUnordered,
                })}
              >
                {children}
              </span>
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
              {Array.from(Array(parsed.level + 1)).map((_, i) => (
                <span
                  key={i}
                  contentEditable={false}
                  style={{ width: 20 }}
                  className={classNames("flex-shrink-0")}
                />
              ))}
              <span>{children}</span>
            </span>
          </p>
        );
      }
    },
  };
};

export default MarkdownListsPlugin;
