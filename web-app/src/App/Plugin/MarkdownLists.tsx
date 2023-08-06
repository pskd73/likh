import classNames from "classnames";
import { ParsedListText, parseListText, toggleCheckbox } from "../Core/List";
import { RNPluginCreator } from "./type";
import { BiChevronDown, BiChevronRight, BiX } from "react-icons/bi";
import { NodeEntry, Transforms } from "slate";
import {
  CustomEditor,
  getNextElementPath,
  getNodeText,
  getPreviousElementPath,
} from "../Core/Core";
import { ReactEditor } from "slate-react";
import { isPointFocused } from "../Core/Range";
import { PropsWithChildren } from "react";

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

const Checkbox = ({ parsed }: { parsed: ParsedListText }) => {
  if (parsed.checkboxType === "/") {
    return (
      <span className="inline-flex items-center justify-center">
        <BiX />
      </span>
    );
  }
  return (
    <input
      type="checkbox"
      checked={parsed.checkboxType === "x"}
      readOnly
      className="outline-none cursor-pointer"
    />
  );
};

const CollapseButton = ({
  editor,
  path,
  element,
  collapsed,
  leaf,
}: {
  editor: CustomEditor;
  path: number[];
  element: any;
  collapsed: boolean;
  leaf: any;
}) => {
  return (
    <span
      contentEditable={false}
      className={classNames(
        "cursor-pointer inline-block",
        "transition-all text-primary text-opacity-50 rounded-full",
        "select-none",
        {
          "bg-primary bg-opacity-10": collapsed,
          "hover:bg-primary hover:bg-opacity-20": !collapsed,
          hidden: leaf.bulletFocused,
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

const PlainBullet = ({
  children,
  parsed,
  leaf,
}: PropsWithChildren & { parsed: ParsedListText; leaf: any }) => {
  return (
    <span className="text-primary text-opacity-50">
      <span
        className={classNames("select-none", {
          hidden: leaf.bulletFocused,
        })}
        contentEditable={false}
      >
        •
      </span>
      <span className={classNames({ hidden: !leaf.bulletFocused })}>
        {children}
      </span>
    </span>
  );
};

const OrderedBullet = ({ children }: PropsWithChildren) => {
  return <span className="text-primary text-opacity-50">{children}</span>;
};

const CheckboxBullet = ({
  children,
  parsed,
  leaf,
  editor,
}: PropsWithChildren & {
  parsed: ParsedListText;
  leaf: any;
  editor: CustomEditor;
}) => {
  return (
    <span className="text-primary text-opacity-50">
      <span
        className={classNames("select-none", {
          hidden: leaf.bulletFocused,
        })}
        contentEditable={false}
        onClick={() => toggleCheckbox(editor, leaf.path)}
      >
        <input
          type="checkbox"
          checked={parsed.checkboxType === "x"}
          readOnly
          className="outline-none cursor-pointer"
        />
      </span>
      <span className={classNames({ hidden: !leaf.bulletFocused })}>
        {children}
      </span>
    </span>
  );
};

const Bullet = ({
  children,
  parsed,
  leaf,
  editor,
}: PropsWithChildren & {
  parsed: ParsedListText;
  leaf: any;
  editor: CustomEditor;
  collapsible?: boolean;
  element: any;
}) => {
  const getBullet = () => {
    if (parsed.type === "unordered" && !parsed.checkbox) {
      return (
        <PlainBullet parsed={parsed} leaf={leaf}>
          {children}
        </PlainBullet>
      );
    }
    if (parsed.type === "unordered" && parsed.checkbox) {
      return (
        <CheckboxBullet parsed={parsed} leaf={leaf} editor={editor}>
          {children}
        </CheckboxBullet>
      );
    }
    if (parsed.type === "ordered") {
      return <OrderedBullet>{children}</OrderedBullet>;
    }

    return <span>{children}</span>;
  };

  return (
    <span className="inline-flex items-center space-x-1">
      {/* {collapsible &&
        !leaf.bulletFocused &&
        !leaf.bulletFocused && (
          <span contentEditable={false} className={classNames("select-none")}>
            c
          </span>
        )} */}
      {getBullet()}
    </span>
  );
};

const MarkdownListsPlugin: RNPluginCreator = () => {
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
        const collapsed = (element as any).collapsed;

        if (isPointFocused(editor, { path, start: 0, end: text.length })) {
          const parent = getParentItem(editor, path, parsed.level);
          parent && collapsed && toggleItem(editor, parent[1], parent[0]);
        }

        const spaces = Array.from(Array(parsed.level + 1));

        return (
          <p
            {...attributes}
            className={classNames("flex", {
              hidden: isCollapsed(editor, path, parsed.level),
            })}
          >
            <span className="inline-flex" style={{ wordBreak: "break-word" }}>
              {spaces.map((_, i) => (
                <span
                  key={i}
                  contentEditable={false}
                  style={{ width: 40 }}
                  className={classNames(
                    "flex-shrink-0 inline-flex justify-end items-start"
                  )}
                >
                  {parsed.level > 0 && (
                    <span
                      className={classNames("bg-primary bg-opacity-20")}
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
            </span>
            {children}
          </p>
        );
      }
    },
  };
};

export default MarkdownListsPlugin;
