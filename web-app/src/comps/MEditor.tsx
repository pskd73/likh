import classNames from "classnames";
import Prism from "prismjs";
import "prismjs/components/prism-markdown";
import { useCallback, useState } from "react";
import { createEditor, BaseEditor, NodeEntry, BaseRange, Text } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";

type CustomElement = { type: "paragraph"; children: CustomText[] };
type CustomText = { text: string };
declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const initialValue = [
  {
    type: "paragraph",
    children: [
      {
        text: "Slate is flexible enough to add **decorations** that can format text based on its content. For example, this editor has **Markdown** preview decorations on it, to make it _dead_ simple to make an editor with built-in Markdown previewing.",
      },
    ],
  },
  {
    type: "paragraph",
    children: [{ text: "## Try it out!" }],
  },
  {
    type: "paragraph",
    children: [{ text: "Try it out for yourself!" }],
  },
];

const Leaf = ({ attributes, children, leaf }: any) => {
  return (
    <span
      {...attributes}
      className={classNames({
        "font-bold": leaf.bold,
        italic: leaf.italic,
        "text-2xl inline-block mt-4 mb-2": leaf.title,
      })}
    >
      {children}
    </span>
  );
};

const MEditor = () => {
  const [editor] = useState(() => withReact(createEditor()));
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  const decorate = useCallback(([node, path]: NodeEntry) => {
    const ranges: BaseRange[] = [];

    if (!Text.isText(node)) {
      return ranges;
    }

    const getLength = (token: string | Prism.Token) => {
      if (typeof token === "string") {
        return token.length;
      } else if (typeof token.content === "string") {
        return token.content.length;
      } else {
        return (token.content as any).reduce(
          (l: any, t: any) => l + getLength(t),
          0
        );
      }
    };

    const tokens = Prism.tokenize(node.text, Prism.languages.markdown);
    let start = 0;

    for (const token of tokens) {
      const length = getLength(token);
      const end = start + length;

      if (typeof token !== "string") {
        ranges.push({
          [token.type]: true,
          anchor: { path, offset: start },
          focus: { path, offset: end },
        });
      }

      start = end;
    }

    return ranges;
  }, []);

  return (
    <Slate editor={editor} value={initialValue as any}>
      <Editable decorate={decorate} renderLeaf={renderLeaf} />
    </Slate>
  );
};

export default MEditor;
