import { NodeEntry, Transforms } from "slate";
import {
  CustomEditor,
  getNextElementPath,
  getNodeText,
  getPreviousElementPath,
} from "src/App/Core/Core";
import { parseListText } from "src/App/Core/List";

const getPrevPath = (path: number[]) => [getPreviousElementPath(path)[0]];
const getNextPath = (path: number[]) => [getNextElementPath(path)[0]];

export const getParentItem = (
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

export const isCollapsed = (
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

export const hasChildren = (
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

export const updateChildren = (editor: CustomEditor, path: number[]) => {
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

export const toggleItem = (
  editor: CustomEditor,
  path: number[],
  element: any
) => {
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
