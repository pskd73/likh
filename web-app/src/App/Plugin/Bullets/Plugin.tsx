import classNames from "classnames";
import { parseListText } from "../../Core/List";
import { RNPluginCreator } from "../type";
import { ReactEditor } from "slate-react";
import { hasChildren, isCollapsed } from "./utils";
import { Bullet, Space } from "./Components";

const BulletsPlugin: RNPluginCreator = () => {
  return {
    name: "Markdown Lists",
    version: 1,
    grammer: () => ({
      bullet: [/^ *[-*+]( \[[ x/]\])?/m, /^ *[\d]+\./m],
    }),
    leafMaker: ({ leaf, attributes, children, editor }) => {
      if (leaf.bullet || leaf.bullet) {
        const parsed = parseListText(leaf.text + " ");
        const level = parsed?.level || 0;
        const width = (level + 1) * 40;
        const _hasChildren = hasChildren(editor, parsed!.level, leaf.path);
        const [element]: any = editor.node([leaf.path[0]]);

        return (
          <span
            {...attributes}
            className={classNames("inline-flex justify-end")}
            style={{ marginLeft: -width - 4, width }}
          >
            <Bullet
              editor={editor}
              parsed={parsed!}
              leaf={leaf}
              element={element}
              collapsible={_hasChildren}
            >
              {children}
            </Bullet>
          </span>
        );
      }
    },
    elementMaker: ({ text, attributes, children, element, editor }) => {
      const parsed = parseListText(text + " ");
      if (parsed) {
        const path = ReactEditor.findPath(editor, element);
        const spaces = Array.from(Array(parsed.level + 1));

        return (
          <p
            {...attributes}
            className={classNames("flex", {
              hidden: isCollapsed(editor, path, parsed.level),
            })}
          >
            <span className="inline-flex">
              {spaces.map((_, i) => (
                <Space key={i} i={i} parsed={parsed} />
              ))}
            </span>
            <span className="pb-1" style={{ wordBreak: "break-word" }}>
              {children}
            </span>
          </p>
        );
      }
    },
  };
};

export default BulletsPlugin;
