import classNames from "classnames";
import Prism from "prismjs";
import "prismjs/components/prism-markdown";
import { useCallback, useMemo, useRef } from "react";
import {
  createEditor,
  BaseEditor,
  NodeEntry,
  Range,
  Text,
  Descendant,
  Node,
  Path,
} from "slate";
import { HistoryEditor, withHistory } from "slate-history";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import * as grammer from "./grammer";
import { randomInt } from "../util";
import { useMiddle } from "./useMiddle";

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;
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
    children: [{ text: "New note" }],
  },
];

const keySounds = [
  new Audio("/key_sounds/sound_1.mp3"),
  new Audio("/key_sounds/sound_2.mp3"),
  new Audio("/key_sounds/sound_3.mp3"),
  new Audio("/key_sounds/sound_4.mp3"),
  new Audio("/key_sounds/sound_5.mp3"),
];

const Leaf = ({ attributes, children, leaf }: any) => {
  const title = leaf.title1 || leaf.title2 || leaf.title3;

  const className = classNames({
    // decor
    "font-semibold": leaf.bold,
    italic: leaf.italic,
    "line-through": leaf.strikethrough,

    // generic punctuation
    "opacity-30": leaf.punctuation || leaf.blockquote,

    // title
    "font-bold": title,
    block: title && leaf.punctuation,
    "text-5xl": leaf.title1,
    "text-4xl": leaf.title2,
    "text-3xl": leaf.title3,
    "mb-6": leaf.title1 && !leaf.punctuation,
    "mb-2": leaf.title2 && !leaf.punctuation,
    "mb-1": leaf.title3 && !leaf.punctuation,

    // list
    "-ml-[24px] opacity-30": leaf.bullet,

    // link
    "underline cursor-pointer": leaf.link,

    // hashtag
    "bg-primary-700 bg-opacity-20 p-1 px-3 rounded-full": leaf.hashtag,
  });

  if (leaf.link) {
    return (
      <a
        href={leaf.text}
        {...attributes}
        className={className}
        onClick={() => {
          window.open(leaf.text, "_blank");
        }}
      >
        {children}
      </a>
    );
  }

  return (
    <span {...attributes} className={className}>
      {children}
    </span>
  );
};

type CustomRange = Range;

const getTokenLength = (token: string | Prism.Token) => {
  if (typeof token === "string") {
    return token.length;
  } else if (typeof token.content === "string") {
    return token.content.length;
  } else {
    return (token.content as any).reduce(
      (l: any, t: any) => l + getTokenLength(t),
      0
    );
  }
};

const getTokenRanges = (
  path: Path,
  token: string | Prism.Token,
  start: number,
  parentTokens: Array<Prism.Token>
): CustomRange[] => {
  if (typeof token === "string") {
    const range: any = {
      anchor: { path, offset: start },
      focus: { path, offset: start + getTokenLength(token) },
    };
    for (const pt of parentTokens) {
      range[pt.type as string] = true;
    }
    return [range];
  }

  if (Array.isArray(token.content)) {
    return getTokensRanges(path, token.content, start, [
      ...parentTokens,
      token,
    ]);
  }

  const range = {
    [token.type]: true,
    anchor: { path, offset: start },
    focus: { path, offset: start + getTokenLength(token) },
  };

  for (const pt of parentTokens) {
    range[pt.type] = true;
  }

  return [range];
};

const getTokensRanges = (
  path: Path,
  tokens: Array<string | Prism.Token>,
  start: number,
  parentTokens: Prism.Token[]
) => {
  let ranges: CustomRange[] = [];
  for (const _token of tokens) {
    const _parentTokens = [...parentTokens];
    if (typeof _token !== "string") {
      _parentTokens.push(_token);
    }
    const newRanges = getTokenRanges(path, _token, start, _parentTokens);
    ranges = [...ranges, ...newRanges];
    start = getRangesEnd(newRanges, start);
  }
  return ranges;
};

const getRangesEnd = (ranges: Range[], start: number) => {
  if (ranges.length > 0) {
    return ranges[ranges.length - 1].focus.offset;
  }
  return start;
};

const playType = () => {
  const aud = keySounds[randomInt(0, 4)].cloneNode() as HTMLAudioElement;
  aud.play();
};

const MEditor = ({
  onChange,
  initValue,
  initText,
  typeWriter,
  editor: passedEditor,
}: {
  onChange: (val: {
    value: Descendant[];
    text: string;
    serialized: string;
  }) => void;
  initValue?: string;
  initText?: string;
  typeWriter?: boolean;
  editor?: CustomEditor;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editor = useMemo(
    () => passedEditor || withHistory(withReact(createEditor())),
    [passedEditor]
  );
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  const decorate = useCallback(([node, path]: NodeEntry) => {
    let ranges: Range[] = [];

    if (!Text.isText(node)) {
      return ranges;
    }

    const tokens = Prism.tokenize(node.text, {
      strikethrough: grammer.strikethrough,
      italic: grammer.italic,
      bold: grammer.bold,
      title1: grammer.title1,
      title2: grammer.title2,
      title3: grammer.title3,
      list: grammer.list,
      link: grammer.link,
      quote: grammer.quote,
      hashtag: grammer.hashtag,
    });

    return getTokensRanges(path, tokens, 0, []);
  }, []);

  const renderElement = useCallback(
    ({ attributes, children, element }: any) => {
      let text = "";
      for (const child of element.children) {
        text += child.text;
      }
      return (
        <p
          {...attributes}
          className={classNames({
            "pl-[48px]": text.match(grammer.listRegex),
            "p-[24px] py bg-primary-700 bg-opacity-10 italic rounded my-6":
              text.match(grammer.quoteRegex),
          })}
        >
          {children}
        </p>
      );
    },
    []
  );
  const scroll = useMiddle(containerRef, [], {
    active: typeWriter,
    editor,
  });

  const handleChange = (value: Descendant[]) => {
    onChange({
      value,
      text: serialize(value),
      serialized: JSON.stringify(value),
    });
    if (typeWriter) {
      scroll.update();
    }
  };

  const handleKeyUp = () => {
    scroll.scroll();
  };

  const getInitValue = () => {
    if (initValue) {
      return JSON.parse(initValue);
    }
    if (initText) {
      return deserialize(initText);
    }
    return defaultValue;
  };

  return (
    <div
      className="text-[20px] font-CourierPrime leading-8"
      style={{ ...scroll.style }}
    >
      <div ref={containerRef}>
        <Slate
          editor={editor}
          value={getInitValue() as any}
          onChange={handleChange}
        >
          <Editable
            decorate={decorate}
            renderLeaf={renderLeaf}
            renderElement={renderElement}
            onKeyUp={handleKeyUp}
            placeholder="Write your mind here ..."
          />
        </Slate>
      </div>
    </div>
  );
};

export default MEditor;
