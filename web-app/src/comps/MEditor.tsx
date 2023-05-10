import classNames from "classnames";
import Prism from "prismjs";
import "prismjs/components/prism-markdown";
import { useCallback, useState } from "react";
import {
  createEditor,
  BaseEditor,
  NodeEntry,
  BaseRange,
  Range,
  Text,
} from "slate";
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
  // {
  //   type: "paragraph",
  //   children: [
  //     {
  //       text: "Slate is flexible enough to add **decorations** that can format text based on its content. For example, this editor has **Markdown** preview decorations on it, to make it _dead_ simple to make an editor with built-in Markdown previewing.",
  //     },
  //   ],
  // },
  // {
  //   type: "paragraph",
  //   children: [{ text: "## Try it out!" }],
  // },
  // {
  //   type: "paragraph",
  //   children: [{ text: "Try it out for yourself!" }],
  // },
  {
    type: "paragraph",
    children: [{ text: "**Hello!** How are you? *go*!" }],
  },
  {
    type: "paragraph",
    children: [{ text: "## This is title" }],
  },
];

const Leaf = ({ attributes, children, leaf }: any) => {
  console.log(leaf);
  return (
    <span
      {...attributes}
      className={classNames({
        "font-semibold": leaf.bold,
        italic: leaf.italic,
        "inline-block mt-6 mb-2": leaf.title,
        "text-xl": leaf.title && leaf.titleLevel === 1,
        "text-2xl": leaf.title && leaf.titleLevel === 2,
        "text-3xl": leaf.title && leaf.titleLevel === 3,
        "opacity-30": leaf.punctuation,
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
    const ranges: Range[] = [];

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
        if (Array.isArray(token.content)) {
          let _start = start;
          let titleLevel = token.type === "title" ? undefined : null;

          for (const item of token.content) {
            const _length = getLength(item);
            const _end = _start + _length;

            if (
              token.type === "title" &&
              (item as any).type === "punctuation" &&
              titleLevel === undefined
            ) {
              titleLevel = _length;
            }

            // console.log(item, _length, _start, _end);

            ranges.push({
              [token.type]: true,
              [(item as any).type]: true,
              titleLevel,
              anchor: { path, offset: _start },
              focus: { path, offset: _end },
            } as any);

            _start = _end;
          }
        } else {
          ranges.push({
            [token.type]: true,
            anchor: { path, offset: start },
            focus: { path, offset: end },
          });
        }
      }

      start = end;
    }

    return ranges;
  }, []);

  return (
    <div className="text-[20px] font-CourierPrime leading-8">
      <Slate editor={editor} value={initialValue as any}>
        <Editable decorate={decorate} renderLeaf={renderLeaf} />
      </Slate>
    </div>
  );
};

export default MEditor;
