import { BaseEditor, Descendant, Node, NodeEntry, Transforms } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;
export type CustomElement = {
  type: "paragraph" | "code-block";
  children: CustomText[];
};
export type CustomText = { text: string };
declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export function getNodeText(
  element: Node | CustomElement | CustomText | NodeEntry
): string {
  let text = "";
  if (typeof element === "string") {
    text += element;
  }
  if ((element as CustomText).text) {
    text += (element as CustomText).text;
  }
  if ((element as CustomElement).children) {
    for (const child of (element as CustomElement).children) {
      text += getNodeText(child);
    }
  }
  return text;
}

export function focusEnd(editor: CustomEditor) {
  setTimeout(() => {
    (document.querySelector("#editorContainer > div") as any).focus();
  }, 0);

  setTimeout(() => {
    try {
      const end = editor.end([]);
      Transforms.setSelection(editor, {
        anchor: end,
        focus: end,
      });
      document
        .getElementById("page-container")
        ?.scrollTo({ top: 100000000, behavior: "smooth" });
    } catch {
      console.warn("Unable to focus");
    }
  }, 100);
}

export function getNextElementPath(at: number[]) {
  const [a] = at;
  return [a + 1, 0];
}

export function getPreviousElementPath(at: number[]) {
  const [a] = at;
  return [a - 1, 0];
}

export const serialize = (value: Descendant[]) => {
  return value
    .map((n): string => {
      if ((n as CustomElement).type === "code-block") {
        return serialize((n as CustomElement).children);
      }
      return Node.string(n);
    })
    .join("\n");
};

export const deserialize = (str: string) => {
  return str.split("\n").map((line) => {
    return {
      children: [{ text: line }],
    };
  });
};
