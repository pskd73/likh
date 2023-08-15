import classNames from "classnames";
import { parseListText } from "../../Core/List";
import { RNPluginCreator } from "../type";
import { ReactEditor } from "slate-react";
import { hasChildren, isCollapsed } from "./utils";
import { Bullet, Space } from "./Components";
import { EditorContextType } from "src/App/Context";

let state: EditorContextType|undefined = undefined;

const BulletsPlugin: RNPluginCreator = () => {
  return {
    name: "Markdown Lists",
    version: 1,
    grammer: () => ({
      bulletUnordered: {
        pattern: /^ *[-*+]( \[[ a-zA-Z/]\])? /m,
        inside: {
          justBullet: /^ *[-*+]( \[[ a-zA-Z/]\])?/m,
          bulletSpace: / $/m,
        },
      },
      bulletOrdered: {
        pattern: /^ *[\d]+\. /m,
        inside: {
          justBullet: /^ *[\d]+\./m,
          bulletSpace: / $/m,
        },
      },
    }),
    updateState(editorState) {
      state = editorState;
    },
    leafMaker: ({ leaf, attributes, children, editor }) => {
      if (leaf.justBullet) {
        const parsed = parseListText(leaf.text + " ");
        const level = parsed?.level || 0;
        const width = (level + 1) * 100;
        const _hasChildren = hasChildren(editor, parsed!.level, leaf.path);
        const [element]: any = editor.node([leaf.path[0]]);
        const spaceWidth = state?.spaceWidth || 4;

        return (
          <span
            {...attributes}
            className={classNames("inline-flex justify-end")}
            style={{ marginLeft: -width - spaceWidth, width }}
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
      if (leaf.bulletSpace) {
        return <span {...attributes}>{children}</span>;
      }
    },
    elementMaker: ({ text, attributes, children, element, editor }) => {
      const parsed = parseListText(text);
      if (parsed) {
        const path = ReactEditor.findPath(editor, element);
        const spaces = Array.from(Array(parsed.level + 1));
        const isParent = hasChildren(editor, parsed.level, path);

        return (
          <p
            {...attributes}
            className={classNames("flex", {
              hidden: isCollapsed(editor, path, parsed.level),
            })}
          >
            <span className="inline-flex">
              {spaces.map((_, i) => (
                <Space
                  key={i}
                  i={i}
                  parsed={parsed}
                  isParent={isParent || false}
                  collapsed={(element as any).collapsed}
                  length={spaces.length}
                />
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
