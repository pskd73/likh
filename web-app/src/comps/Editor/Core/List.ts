import { Editor, Transforms } from "slate";
import { CustomEditor, getNodeText } from "./Core";

export type ParsedListText = {
  text: string;
  level: number;
  type: "ordered" | "unordered";
  content: string;
  paddingText: string;
  serial?: number;
  symbol?: string;
};

export function parseListText(text: string): ParsedListText | undefined {
  const pattern = /^( *)([-\*\+]|([0-9]+)\.) (.*)$/;
  const match = text.match(pattern);
  if (!match) {
    return undefined;
  }
  // console.log(match);
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
  opts: { serial?: number; cursorToEnd?: boolean }
) {
  const parsed = parseListNode(editor, path);
  if (!parsed) return;

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

function getNextElementPath(at: number[]) {
  const [a] = at;
  return [a + 1, 0];
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
      updateListNode(editor, path, { serial: parsed.serial });
      prevParsed = parsed;
    }

    path = getNextElementPath(path);
  }
}
