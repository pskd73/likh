import classNames from "classnames";
import Prism from "prismjs";
import "prismjs/components/prism-markdown";
import { useCallback, useMemo } from "react";
import {
  createEditor,
  BaseEditor,
  NodeEntry,
  Range,
  Text,
  Descendant,
  Node,
} from "slate";
import {withHistory} from "slate-history"
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

const serialize = (value: Descendant[]) => {
  return value.map((n) => Node.string(n)).join("\n");
};

const deserialize = (str: string) => {
  return str.split("\n").map((line) => {
    return {
      children: [{ text: line }],
    };
  });
};

const defaultValue = [
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
  return (
    <span
      {...attributes}
      className={classNames({
        "font-semibold": leaf.bold,
        italic: leaf.italic,
        "block font-bold": leaf.title,
        "text-5xl mb-6": leaf.title && leaf.titleLevel === 2,
        "text-4xl mb-2": leaf.title && leaf.titleLevel === 3,
        "text-3xl mb-1": leaf.title && leaf.titleLevel === 4,
        "opacity-30": leaf.punctuation || leaf.list || leaf.blockquote,
        "mt-10": leaf.title && leaf.punctuation,
        "line-through": leaf.strike && !leaf.punctuation,
        "inline-block w-[30px]": leaf.list,
        "border-l-4 border-primary-700 mx-4 pl-4 inline-block": leaf.blockquote,
        "bg-primary-700 bg-opacity-20 p-1 px-3 rounded-full": leaf.hashtag
      })}
    >
      {children}
    </span>
  );
};

const MEditor = ({
  onChange,
  initValue,
  initText,
}: {
  onChange: (val: {
    value: Descendant[];
    text: string;
    serialized: string;
  }) => void;
  initValue?: string;
  initText?: string;
}) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
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

    const tokens = Prism.tokenize(node.text, {
      ...Prism.languages.markdown,
      title: {
        pattern: /(^\s*)#{1,3} .+$/m,
        inside: {
          punctuation: /^#{1,3} /m,
        }
      },
      hashtag: {
        pattern: /\B(#[a-zA-Z_]+\b)(?!;)/
      }
    });
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

  const handleChange = (value: Descendant[]) => {
    onChange({
      value,
      text: serialize(value),
      serialized: JSON.stringify(value),
    });
  };

  const getInitValue = () => {
    if (initValue) {
      return JSON.parse(initValue);
    }
    if (initText) {
      return deserialize(initText);
    }
    return JSON.stringify(defaultValue);
  };

  return (
    <div className="text-[20px] font-CourierPrime leading-8">
      <Slate
        editor={editor}
        value={getInitValue() as any}
        onChange={handleChange}
      >
        <Editable decorate={decorate} renderLeaf={renderLeaf} />
      </Slate>
    </div>
  );
};

export default MEditor;
