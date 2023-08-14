import { BaseRange, Editor, Path } from "slate";
import {
  CustomEditor,
  getNextElementPath,
  getNodeText,
  getPreviousElementPath,
} from "../Core/Core";
import { RNPluginCreator } from "./type";
import { ReactEditor } from "slate-react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { isPointFocused } from "../Core/Range";
import ReactDOM from "react-dom/client";
import classNames from "classnames";

const getPrevPath = (path: number[]) => [getPreviousElementPath(path)[0]];
const getNextPath = (path: number[]) => [getNextElementPath(path)[0]];

const isTableRow = (text: string) => {
  const match = text.match(/\|?(.*\|)*\|?/);
  return match && text.includes("|");
};

const isTableNode = (editor: CustomEditor, path: number[]) => {
  const [node] = editor.node(path);
  const text = getNodeText(node);
  return isTableRow(text);
};

type Table = {
  start: Path;
  end: Path;
  paths: Path[];
  range: BaseRange;
};

const getTable = (editor: CustomEditor, path: number[]): Table | undefined => {
  if (!isTableNode(editor, path)) return;

  let start = path;
  let end = path;
  const prevPaths: number[][] = [path];
  const nextPaths: number[][] = [];

  while (Editor.hasPath(editor, start)) {
    const prevPath = getPrevPath(start);
    const isTable = isTableNode(editor, prevPath);
    if (!isTable) {
      break;
    }
    start = prevPath;
    prevPaths.push(start);
  }
  while (Editor.hasPath(editor, end)) {
    const nextPath = getNextPath(end);
    const isTable = isTableNode(editor, nextPath);
    if (!isTable) {
      break;
    }
    end = nextPath;
    nextPaths.push(end);
  }

  const range: BaseRange = {
    anchor: { path: [start[0], 0], offset: 0 },
    focus: Editor.end(editor, end),
  };

  return {
    start,
    end,
    paths: [...prevPaths.reverse(), ...nextPaths],
    range,
  };
};

const getTableText = (editor: CustomEditor, table: Table) => {
  return table.paths
    .map((path) => {
      const [node] = editor.node(path);
      return getNodeText(node);
    })
    .join("\n");
};

const updateRawVisibility = (
  editor: CustomEditor,
  table: Table,
  visible: boolean
) => {
  table.paths.forEach((path) => {
    const [node] = editor.node(path);
    try {
      const elem = ReactEditor.toDOMNode(editor, node);

      if (visible) {
        elem.classList.remove("hidden");
      } else {
        elem.classList.add("hidden");
      }
    } catch {}
  });
};

const viewTable = (editor: CustomEditor, table: Table) => {
  const id = `table-view-${table.start[0]}`;

  document.getElementById(id)?.remove();

  const raw = (
    <div className={classNames("table-view prose")}>
      <ReactMarkdown
        className="viewer"
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {getTableText(editor, table)}
      </ReactMarkdown>
    </div>
  );

  const div = document.createElement("div");
  div.id = id;
  div.contentEditable = "false";
  div.onclick = (e) => {
    editor.setSelection({
      anchor: table.range.anchor,
      focus: table.range.anchor,
    });
  };
  const root = (ReactDOM as any).createRoot(div);
  root.render(raw);
  const [node] = editor.node(table.end);
  const lastElement = ReactEditor.toDOMNode(editor, node);
  if (lastElement) {
    lastElement.parentNode?.insertBefore(div, lastElement.nextSibling);
  }
};

const hideTable = (table: Table) => {
  const id = `table-view-${table.start[0]}`;

  document.getElementById(id)?.remove();
};

const update = (editor: CustomEditor, table: Table, focused: boolean) => {
  if (!focused) {
    viewTable(editor, table);
    updateRawVisibility(editor, table, false);
  } else {
    hideTable(table);
    updateRawVisibility(editor, table, true);
  }
};

const TablesPlugin: RNPluginCreator = () => {
  return {
    name: "Tables",
    version: 1,
    onNoteChange: () => {},
    elementMaker: ({ element, text, editor }) => {
      try {
        if (isTableRow(text)) {
          const path = ReactEditor.findPath(editor, element);
          const table = getTable(editor, path);

          if (table) {
            const tableFocused = isPointFocused(editor, table.range);

            try {
              update(editor, table, !!tableFocused);
            } catch {
              setTimeout(() => {
                update(editor, table, !!tableFocused);
              }, 500);
            }
          }
        }
      } catch {}
      return undefined;
    },
  };
};

export default TablesPlugin;
