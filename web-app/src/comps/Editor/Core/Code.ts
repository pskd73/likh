import { BaseRange, Editor, Path, Transforms } from "slate";
import { CustomEditor, CustomElement, getNodeText } from "./Core";
import Prism from "prismjs";
import { getTokensRanges } from "./Range";

type BlockRange = {
  start: Path;
  end: Path;
};

export function parseLines(
  lines: Array<{ text: string; idx: number }>
): BlockRange[] {
  const locations: Array<number[]> = [];
  let started = false;
  for (const line of lines) {
    if (line.text.match(/^```[a-zA-Z0-9]+$/)) {
      started = true;
      locations.push([line.idx, line.idx]);
    }
    if (started) {
      locations[locations.length - 1] = [
        locations[locations.length - 1][0],
        line.idx,
      ];
      if (line.text.match(/^```$/)) {
        started = false;
      }
    }
  }

  return locations.map((loc) => ({ start: [loc[0], 0], end: [loc[1], 0] }));
}

export function getNewCodeBlockRanges(editor: CustomEditor): BlockRange[] {
  let path = [0];

  const lines: Array<{ text: string; idx: number }> = [];
  while (Editor.hasPath(editor, path)) {
    const [node, _] = Editor.node(editor, { path, offset: 0 });
    if ((node as any).type !== "code-block") {
      lines.push({ text: getNodeText(node), idx: path[0] });
    }
    path = [path[0] + 1];
  }
  return parseLines(lines);
}

export function handleEnterForCode(
  editor: CustomEditor,
  e: React.KeyboardEvent<HTMLDivElement>
) {
  if (!editor.selection) return;
  const [node, path] = editor.node(editor.selection.anchor);
  const text = getNodeText(node);
  const [element] = editor.node({ path: [path[0]], offset: 0 });
  if ((element as any).type === "code-block" && text.match(/^``` *$/)) {
    e.preventDefault();
    const insertPath = [path[0] + 1];
    Transforms.insertNodes(
      editor,
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
      { at: insertPath }
    );
    Transforms.setSelection(editor, {
      anchor: { path: [...insertPath, 0], offset: 0 },
      focus: { path: [...insertPath, 0], offset: 0 },
    });
  }
  if (
    (element as any).type !== "code-block" &&
    text.match(/^```[a-zA-Z0-9]+$/)
  ) {
    codify(editor);
  }
}

export function handleBackspaceForCode(
  editor: CustomEditor,
  e: React.KeyboardEvent<HTMLDivElement>
) {
  if (!editor.selection) return;
  const [_, path] = editor.node(editor.selection.anchor);
  const [element] = editor.node({ path: [path[0]], offset: 0 });
  const text = getNodeText(element);
  if ((element as any).type === "code-block" && text === "") {
    Transforms.setNodes(editor, { type: "paragraph" }, { at: [path[0]] });
  }
}

export function codify(editor: CustomEditor) {
  const ranges = getNewCodeBlockRanges(editor);
  for (const range of ranges) {
    Transforms.wrapNodes(
      editor,
      { type: "code-block", children: [{ text: "" }] } as any,
      {
        at: {
          anchor: { path: range.start, offset: 0 },
          focus: { path: range.end, offset: 2 },
        },
      }
    );
  }
}

export function getCodeRanges(editor: CustomEditor, path: number[]) {
  const rootPath = [path[0]];
  if (!editor.hasPath(path)) return [];
  const [rootNode] = Editor.node(editor, { path: rootPath, offset: 0 }) as [
    CustomElement,
    any
  ];
  if (rootNode.type !== "code-block") return [];
  const [node] = Editor.node(editor, { path, offset: 0 }) as [
    CustomElement,
    any
  ];
  const text = getNodeText(node);
  if (text.match(/^```/)) return [];

  const [initLineNode] = Editor.node(editor, {
    path: [...rootPath, 0],
    offset: 0,
  }) as [CustomElement, any];
  const initLineText = getNodeText(initLineNode);
  const match = initLineText.match(/```([a-zA-Z0-9]+)/);
  const language =
    match && ["python", "typescript"].includes(match[1]) ? match[1] : undefined;
  if (!language) return [];

  const tokens = Prism.tokenize(text, Prism.languages[language]);
  return getTokensRanges(editor, path, tokens, 0, []).map((range) => ({
    ...range,
    code: true,
  }));
}
