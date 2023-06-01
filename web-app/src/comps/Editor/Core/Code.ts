import { Editor, Path, Transforms } from "slate";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-python";
import "prismjs/components/prism-php";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-java";
import "prismjs/components/prism-cshtml";
import "prismjs/components/prism-json";
import { CustomEditor, CustomElement, getNodeText } from "./Core";
import Prism from "prismjs";
import { getTokensRanges } from "./Range";

const LANGUAGES: Record<string, string> = {
  javascript: "javascript",
  js: "javascript",

  jsx: "jsx",

  typescript: "typescript",
  ts: "typescript",

  tsx: "tsx",

  markdown: "markdown",
  md: "markdown",

  python: "python",
  php: "php",
  sql: "sql",
  java: "java",

  html: "cshtml",
  json: "json",
};

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
    if (line.text.match(/^``` ?[a-zA-Z0-9]+$/)) {
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
    text.match(/^``` ?[a-zA-Z0-9]+$/)
  ) {
    codify(editor);
  }
  if (
    (element as any).type === "code-block" &&
    text.match(/^``` ?[a-zA-Z0-9]+$/)
  ) {
    if (editor.selection.anchor.offset === 0) {
      e.preventDefault();
      Transforms.insertNodes(
        editor,
        {
          type: "paragraph",
          children: [{ text: "" }],
        },
        {
          at: [editor.selection.anchor.path[0]],
        }
      );
      Transforms.setSelection(editor, {
        anchor: { path: [editor.selection.anchor.path[0] - 1, 0], offset: 0 },
        focus: { path: [editor.selection.anchor.path[0] - 1, 0], offset: 0 },
      });
    }
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

export function getRootCodeNode(
  editor: CustomEditor,
  path: number[]
): [CustomElement | undefined, number[] | undefined] {
  const rootPath = [path[0]];
  if (editor.hasPath(path)) {
    const [rootNode] = Editor.node(editor, { path: rootPath, offset: 0 }) as [
      CustomElement,
      any
    ];
    if (rootNode.type === "code-block") {
      return [rootNode, rootPath];
    }
  }
  return [undefined, undefined];
}

export function getCodeRanges(editor: CustomEditor, path: number[]) {
  const [rootNode, rootPath] = getRootCodeNode(editor, path);
  if (!rootNode || !rootPath) return [];

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
  const match = initLineText.match(/``` ?([a-zA-Z0-9]+)/);
  const language =
    match && Object.keys(LANGUAGES).includes(match[1]) ? match[1] : undefined;
  if (!language) return [];

  const tokens = Prism.tokenize(text, Prism.languages[LANGUAGES[language]]);
  return getTokensRanges(editor, path, tokens, 0, []).map((range) => ({
    ...range,
    code: true,
  }));
}

export function handleTabForCode(
  editor: CustomEditor,
  e: React.KeyboardEvent<HTMLDivElement>
) {
  if (!editor.selection) return;

  const [rootNode] = getRootCodeNode(editor, editor.selection.anchor.path);
  if (!rootNode) return;

  e.preventDefault();
  if (!e.shiftKey) {
    Transforms.insertText(editor, "    ");
  }
}
