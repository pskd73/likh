import classNames from "classnames";
import { parseListText, toggleCheckbox } from "../Core/List";
import { RNPluginCreator } from "./type";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";
import { NodeEntry, Transforms } from "slate";
import {
  CustomEditor,
  getNextElementPath,
  getNodeText,
  getPreviousElementPath,
} from "../Core/Core";
import { ReactEditor } from "slate-react";
import { isPointFocused } from "../Core/Range";

const getPrevPath = (path: number[]) => [getPreviousElementPath(path)[0]];
const getNextPath = (path: number[]) => [getNextElementPath(path)[0]];

const getParentItem = (
  editor: CustomEditor,
  path: number[],
  level: number
): null | NodeEntry => {
  const nodeEntry = editor.node(path);
  const text = getNodeText(nodeEntry[0]);
  const parsed = parseListText(text);

  if (!parsed) return null;

  if (parsed.level < level) return nodeEntry;
  path = getPrevPath(path);
  if (!editor.hasPath(path)) return null;
  return getParentItem(editor, path, level);
};

const isCollapsed = (
  editor: CustomEditor,
  path: number[],
  level: number
): boolean => {
  const parent = getParentItem(editor, path, level);
  if (!parent) return false;

  const [node, _path] = parent;
  if ((node as any).collapsed) return true;

  const parsed = parseListText(getNodeText(node));
  if (!parsed) return false;

  return isCollapsed(editor, _path, parsed.level);
};

const hasChildren = (
  editor: CustomEditor,
  currentLevel: number,
  path: number[]
) => {
  const nextPath = getNextPath(path);
  if (!editor.hasPath(nextPath)) return;
  const [node] = editor.node(nextPath);
  const text = getNodeText(node);
  const parsed = parseListText(text);
  if (!parsed) return;

  return currentLevel < parsed.level;
};

const updateChildren = (editor: CustomEditor, path: number[]) => {
  const [node] = editor.node(path);
  const text = getNodeText(node);
  const parsed = parseListText(text);
  if (!parsed) return null;

  path = getNextPath(path);
  while (editor.hasPath(path)) {
    const [_node] = editor.node(path);
    const _text = getNodeText(_node);
    const _parsed = parseListText(_text);

    if (!_parsed) return;

    if (_parsed.level <= parsed.level) return;

    if (_parsed.level >= parsed.level + 1) {
      Transforms.removeNodes(editor, { at: path });
      Transforms.insertNodes(
        editor,
        [{ ..._node, updatedAt: new Date().getTime() } as any],
        { at: path }
      );
    }

    path = getNextPath(path);
  }
};

const toggleItem = (editor: CustomEditor, path: number[], element: any) => {
  Transforms.removeNodes(editor, { at: path });
  Transforms.insertNodes(
    editor,
    [
      {
        ...element,
        collapsed: !(element as any).collapsed,
      } as any,
    ],
    { at: path }
  );
  updateChildren(editor, path);
};

const CollapseButton = ({
  editor,
  path,
  element,
  collapsed,
  checkbox
}: {
  editor: CustomEditor;
  path: number[];
  element: any;
  collapsed: boolean,
  checkbox: boolean,
}) => {
  return (
    <span
      className={classNames(
        "cursor-pointer absolute",
        "transition-all text-primary text-opacity-50 rounded-full",
        {
          "bg-primary bg-opacity-10": collapsed,
          "hover:bg-primary hover:bg-opacity-20": !collapsed,
          "hidden group-hover:inline": !collapsed,
          "mr-5": checkbox,
          "mr-4": !checkbox
        }
      )}
      style={{ marginTop: 5 }}
      onClick={(e) => {
        toggleItem(editor, path, element);
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      {(element as any).collapsed ? <BiChevronRight /> : <BiChevronDown />}
    </span>
  );
};

const MarkdownListsPlugin: RNPluginCreator = () => {
  return {
    name: "Markdown Lists",
    version: 1,
    grammer: () => ({
      bulletUnordered: {
        pattern: /^ *[-*+]( \[[ x]\])? /m,
        inside: {
          bullet: /^ *[-*+]( \[[ x]\])?/,
          space: / $/,
        },
      },
      bulletOrdered: {
        pattern: /^ *[\d]+\. /m,
        inside: {
          bullet: /^ *[\d]+\./,
          space: / $/,
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
                !parsed?.checkbox && <span contentEditable={false}>•</span>}

              {leaf.bulletUnordered &&
                !leaf.bulletFocused &&
                parsed?.checkbox && (
                  <span
                    onClick={(e) => {
                      toggleCheckbox(editor, leaf.path);
                      e.preventDefault();
                      e.stopPropagation();
                    }}
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
      if (leaf.space) {
        return <span {...attributes}>{children}</span>;
      }
    },
    elementMaker: ({ text, attributes, children, element, editor }) => {
      const parsed = parseListText(text);
      if (parsed) {
        const path = ReactEditor.findPath(editor, element);
        const collapsed = (element as any).collapsed;

        if (isPointFocused(editor, { path, start: 0, end: text.length })) {
          const parent = getParentItem(editor, path, parsed.level);
          parent && collapsed && toggleItem(editor, parent[1], parent[0]);
        }

        const isParent = hasChildren(editor, parsed.level, path);
        const spaces = Array.from(Array(parsed.level + 1));

        return (
          <p
            className={classNames("flex group", {
              hidden: isCollapsed(editor, path, parsed.level),
            })}
            {...attributes}
          >
            <span
              className="inline-flex h-full"
              style={{ wordBreak: "break-word" }}
            >
              {spaces.map((_, i) => (
                <span
                  key={i}
                  contentEditable={false}
                  style={{ width: 30 }}
                  className={classNames(
                    "flex-shrink-0 inline-flex justify-end items-start"
                  )}
                >
                  {i === parsed.level && isParent && (
                    <CollapseButton
                      editor={editor}
                      path={path}
                      element={element}
                      collapsed={collapsed}
                      checkbox={parsed.checkbox || false}
                    />
                  )}
                  {((isParent && !collapsed) || i < spaces.length - 1) && (
                    <span
                      className={classNames(
                        "bg-primary inline-block h-full bg-opacity-20"
                      )}
                      style={{
                        width: 1,
                        marginRight: 8,
                        marginTop: i === parsed.level ? 24 : 0,
                        height:
                          i === parsed.level ? "calc(100% - 24px)" : "100%",
                      }}
                    />
                  )}
                </span>
              ))}
              <span className="pb-2">
                {children}
                {collapsed && (
                  <span
                    contentEditable={false}
                    className="px-2 text-primary text-opacity-50"
                    onClick={() => toggleItem(editor, path, element)}
                  >
                    [...]
                  </span>
                )}
              </span>
            </span>
          </p>
        );
      }
    },
  };
};

export default MarkdownListsPlugin;
