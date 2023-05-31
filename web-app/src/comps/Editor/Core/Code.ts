import { Editor, Path, Transforms } from "slate";
import { CustomEditor, getNodeText } from "./Core";

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

export function getCodeBlockRanges(editor: CustomEditor): BlockRange[] {
  let path = [0];

  const lines: Array<{ text: string; idx: number }> = [];
  while (Editor.hasPath(editor, path)) {
    const [node, _] = Editor.node(editor, { path, offset: 0 });
    if ((node as any).type !== "code-block") {
      console.log(node)
      lines.push({ text: getNodeText(node), idx: path[0] });
    }
    path = [path[0] + 1];
  }

  console.log({ lines });
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
  console.log({ element, text });
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
}

export function handleBackspaceForCode(
  editor: CustomEditor,
  e: React.KeyboardEvent<HTMLDivElement>
) {
  if (!editor.selection) return;
  const [_, path] = editor.node(editor.selection.anchor);
  const [element] = editor.node({ path: [path[0]], offset: 0 });
  const text = getNodeText(element);
  // console.log({ element, text });
  if ((element as any).type === "code-block" && text === "") {
    Transforms.setNodes(editor, { type: "paragraph" }, { at: [path[0]] });
  }
}
