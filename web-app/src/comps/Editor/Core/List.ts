import { Editor, Transforms } from "slate";
import {
  CustomEditor,
  getNextElementPath,
  getNodeText,
  getPreviousElementPath,
} from "./Core";

export type ParsedListText = {
  text: string;
  level: number;
  type: "ordered" | "unordered";
  content: string;
  paddingText: string;
  serial?: number;
  symbol?: string;
};

export type ListBlock = {
  level: number;
};

export function parseListText(text: string): ParsedListText | undefined {
  const pattern = /^( *)([-\*\+]|([0-9]+)\.) (.*)$/;
  const match = text.match(pattern);
  if (!match) {
    return undefined;
  }
  const level = Math.floor(match[1].length / 4);
  const type = match[3] === undefined ? "unordered" : "ordered";
  const serial = type === "ordered" ? Number(match[3]) : undefined;
  const content = match[4];
  const symbol = match[2];
  const paddingText = match[1];
  return {
    text,
    level,
    type,
    serial,
    content,
    symbol,
    paddingText,
  };
}

export function getElementText(editor: CustomEditor, path: number[]) {
  if (!Editor.hasPath(editor, path)) return;

  const element = Editor.first(editor, path);
  if (!element) return;

  return getNodeText(element[0]);
}

export function parseListNode(editor: CustomEditor, path: number[]) {
  const text = getElementText(editor, path);
  if (!text) return;
  return parseListText(text);
}

export function updateListNode(
  editor: CustomEditor,
  path: number[],
  parsed: ParsedListText,
  opts: { serial?: number; cursorToEnd?: boolean }
) {
  Transforms.removeNodes(editor, { at: path });

  let updatedText = parsed.text;
  if (opts.serial) {
    if (parsed.type === "ordered") {
      updatedText = updatedText.replace(/^( *)([0-9]+)\./, `$1${opts.serial}.`);
    }
  }

  Transforms.insertText(editor, updatedText, { at: path });

  if (opts.cursorToEnd) {
    editor.setSelection({ anchor: { path, offset: updatedText.length } });
    editor.setSelection({ focus: { path, offset: updatedText.length } });
  }
}

export function adjustFollowingSerial(editor: CustomEditor, path: number[]) {
  const parsedNode = parseListNode(editor, path);
  if (!parsedNode) return;

  let prevParsed = parseListText(parsedNode.text);
  if (!prevParsed) return;

  path = getNextElementPath(path);

  while (true) {
    const _parsedNode = parseListNode(editor, path);
    if (!_parsedNode) break;

    const parsed = parseListText(_parsedNode.text);
    if (!parsed) break;

    if (prevParsed.serial === undefined) break;

    if (parsed.serial === undefined) break;

    if (prevParsed.level === parsed.level) {
      if (parsed.serial === prevParsed.serial + 1) break;

      parsed.serial = prevParsed.serial + 1;
      updateListNode(editor, path, parsed, { serial: parsed.serial });
      prevParsed = parsed;
    }

    path = getNextElementPath(path);
  }
}

export function getBlockStartPath(editor: CustomEditor, path: number[]) {
  let parsed = parseListNode(editor, path);
  if (!parsed) return;
  const level = parsed.level;

  let startPath = path;
  path = getPreviousElementPath(path);
  while (Editor.hasPath(editor, path)) {
    const nextParsed = parseListNode(editor, path);
    if (!nextParsed) break;
    if (nextParsed.level < level) {
      break;
    }
    if (nextParsed.level === level) {
      startPath = path;
    }
    path = getPreviousElementPath(path);
  }
  return startPath;
}

export function getListBlock(
  editor: CustomEditor,
  firstPath: number[]
): ListBlock | undefined {
  const parsed = parseListNode(editor, firstPath);
  if (!parsed) return;
  return {
    level: parsed.level,
  };
}

export function intend(editor: CustomEditor, asc = true) {
  if (editor.selection) {
    const point = Editor.before(editor, editor.selection.anchor);
    if (!point) return;

    const node = Editor.first(editor, point);
    const text = getNodeText(node[0]);

    const parsed = parseListText(text);
    if (!parsed) return;

    const prevLevelFirstPath = getBlockStartPath(
      editor,
      editor.selection.anchor.path
    );

    if (asc) {
      Transforms.insertText(editor, "    ", {
        at: { path: editor.selection.anchor.path, offset: 0 },
      });
    } else {
      if (parsed.level === 0) return;
      const { anchor, focus } = editor.selection;
      Transforms.removeNodes(editor);
      Transforms.insertNodes(editor, {
        type: "paragraph",
        children: [{ text: "" }],
      });
      const unTabbedText = text.replace(/^ {1,4}/, "");
      Transforms.insertText(editor, unTabbedText);
      Transforms.setSelection(editor, {
        anchor: { path: anchor.path, offset: Math.max(0, anchor.offset - 4) },
        focus: { path: focus.path, offset: Math.max(0, focus.offset - 4) },
      });
    }

    const { anchor, focus } = editor.selection;

    correctSerial(editor, editor.selection.anchor.path);
    if (prevLevelFirstPath) {
      correctSerial(editor, prevLevelFirstPath);
    }

    Transforms.setSelection(editor, { anchor, focus });
  }
}

export function correctSerial(editor: CustomEditor, path: number[]) {
  let _path = getBlockStartPath(editor, path);
  if (!_path) return;

  const parsed = parseListNode(editor, _path);
  if (!parsed) return;

  const level = parsed.level;

  let i = 1;
  while (Editor.hasPath(editor, _path)) {
    const parsed = parseListNode(editor, _path);
    if (!parsed) break;

    if (parsed.level === level) {
      updateListNode(editor, _path, parsed, { serial: i });

      i += 1;
    }
    if (parsed.level < level) break;

    _path = getNextElementPath(_path);
  }
}

export function handleEnterForList(
  editor: CustomEditor,
  e: React.KeyboardEvent<HTMLDivElement>
) {
  if (!editor.selection) return;
  const point = Editor.before(editor, editor.selection.anchor);
  if (!point) return;
  const node = Editor.first(editor, point);
  const text = getNodeText(node[0]);

  const parsed = parseListText(text);
  if (!parsed) return;

  if (editor.selection.anchor.offset !== 0) {
    e.preventDefault();
    if (parsed.content) {
      let prefix = `${parsed.paddingText}${parsed.symbol} `;
      if (parsed.serial !== undefined) {
        prefix = `${parsed.paddingText}${parsed.serial + 1}. `;
      }
      Transforms.insertNodes(editor, [
        { type: "paragraph", children: [{ text: "" }] },
      ]);
      Transforms.insertText(editor, prefix);
      if (parsed.type === "ordered") {
        adjustFollowingSerial(editor, editor.selection!.anchor.path);
      }
    } else {
      Transforms.removeNodes(editor);
      Transforms.insertNodes(editor, [
        { type: "paragraph", children: [{ text: "" }] },
      ]);
    }
  }
}
