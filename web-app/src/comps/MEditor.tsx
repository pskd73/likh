import classNames from "classnames";
import Prism from "prismjs";
import "prismjs/components/prism-markdown";
import {
  CSSProperties,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  createEditor,
  BaseEditor,
  NodeEntry,
  Range,
  Text,
  Descendant,
  Node,
  Path,
  Editor,
  Transforms,
} from "slate";
import { withHistory } from "slate-history";
import { Slate, Editable, withReact } from "slate-react";
import * as grammer from "./grammer";
import { useMiddle } from "./useMiddle";
import slugify from "slugify";
import { CustomEditor, getNodeText, focus } from "./Editor/Core/Core";
import {
  ParsedListText,
  adjustFollowingSerial,
  getBlockStartPath,
  intend,
  parseListNode,
  parseListText,
} from "./Editor/Core/List";

// test();

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

  let parsed: ParsedListText | undefined = undefined;
  if (leaf.bullet) {
    parsed = parseListText(leaf.text + " ");
  }

  const style: CSSProperties = {};
  if (parsed) {
    style.marginLeft = -200;
    style.width = 200;
  }

  const className = classNames({
    // accessors
    "acc-title": title && !leaf.punctuation,

    // decor
    "font-semibold": leaf.bold,
    italic: leaf.italic,
    "line-through": leaf.strikethrough,
    hidden: leaf.punctuation && leaf.hidable && !leaf.focused,

    // generic punctuation
    "opacity-30": leaf.punctuation || leaf.blockquote,

    // title
    "inline-flex font-bold": title,
    "-ml-[50px] w-[50px] justify-end pr-[10px]": title && leaf.punctuation,
    "text-4xl": leaf.title1,
    "text-3xl": leaf.title2,
    "text-2xl": leaf.title3,
    "mb-6": leaf.title1 && !leaf.punctuation,
    "mb-4": leaf.title2 && !leaf.punctuation,
    "mb-2": leaf.title3 && !leaf.punctuation,

    // list
    "opacity-30 inline-flex justify-end pr-[4px]": leaf.bullet,

    // link
    "underline cursor-pointer": leaf.link,

    // hashtag
    "bg-primary-700 bg-opacity-20 p-1 px-3 rounded-full": leaf.hashtag,

    // notelink
    "underline cursor-pointer ": leaf.notelink && !leaf.punctuation,
  });

  if (leaf.notelink) {
    return (
      <span {...attributes} className={className} onClick={console.log}>
        {children}
      </span>
    );
  }

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
    <span
      {...attributes}
      className={className}
      id={
        title && !leaf.punctuation
          ? slugify(leaf.text, { lower: true })
          : undefined
      }
      data-title-level={classNames({
        title1: leaf.title1,
        title2: leaf.title2,
        title3: leaf.title3,
      })}
      style={style}
    >
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
  editor: BaseEditor,
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
    return getTokensRanges(editor, path, token.content, start, [
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

const hidable: string[] = [
  "italic",
  "bold",
  "title1",
  "title2",
  "title3",
  "notelink",
];

const getTokensRanges = (
  editor: BaseEditor,
  path: Path,
  tokens: Array<string | Prism.Token>,
  start: number,
  parentTokens: Prism.Token[]
) => {
  let ranges: CustomRange[] = [];
  for (const _token of tokens) {
    const _parentTokens = [...parentTokens];
    if (typeof _token !== "string") {
      if (hidable.includes(_token.type)) {
        _parentTokens.push({ type: "hidable" } as any);
        const focused = isPointFocused(editor, {
          path,
          start,
          end: start + _token.length,
        });
        if (focused) {
          _parentTokens.push({ type: "focused" } as any);
        }
      }
      _parentTokens.push(_token);
    }
    const newRanges = getTokenRanges(
      editor,
      path,
      _token,
      start,
      _parentTokens
    );
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

const isPointFocused = (
  editor: BaseEditor,
  point: { path: number[]; start: number; end: number }
) => {
  if (!editor.selection) return false;
  const startPath =
    JSON.stringify(editor.selection.anchor.path) === JSON.stringify(point.path);
  const endPath =
    JSON.stringify(editor.selection?.focus.path) === JSON.stringify(point.path);

  if (startPath) {
    if (
      point.start <= editor.selection.anchor.offset &&
      point.end >= editor.selection.anchor.offset
    ) {
      return true;
    }
  }

  if (endPath) {
    if (
      point.start <= editor.selection.focus.offset &&
      point.end >= editor.selection.focus.offset
    ) {
      return true;
    }
  }

  if (startPath && endPath) {
    if (
      point.start >= editor.selection.anchor.offset &&
      point.end <= editor.selection.focus.offset
    ) {
      return true;
    }
    if (
      point.start >= editor.selection.focus.offset &&
      point.end <= editor.selection.anchor.offset
    ) {
      return true;
    }
  }

  return false;
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
    if (!Text.isText(node)) {
      return [];
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
      image: grammer.image,
      notelink: grammer.notelink,
    });

    const ranges = getTokensRanges(editor, path, tokens, 0, []);
    return ranges;
  }, []);

  const renderElement = useCallback(
    ({ attributes, children, element }: any) => {
      let text = "";
      for (const child of element.children) {
        text += child.text;
      }
      const imgMatch = text.match(grammer.imageRegex)
        ? text.match(grammer.link.pattern)
        : null;
      const imgUrl = imgMatch ? imgMatch[0] : null;

      const style: CSSProperties = {};
      const parsed = parseListText(text);
      if (parsed) {
        style.marginLeft = 50 * (parsed.level + 1);
      }

      return (
        <p
          {...attributes}
          className={classNames("mb-2", {
            "p-[24px] py bg-primary-700 bg-opacity-10 italic rounded my-6":
              text.match(grammer.quoteRegex),
            "flex flex-col items-center py-10": imgUrl,
          })}
          style={style}
        >
          {imgUrl && <img src={imgUrl} />}
          <span
            className={classNames({
              "py-2 text-center text-sm block opacity-50": imgUrl,
            })}
          >
            {children}
          </span>
        </p>
      );
    },
    []
  );
  const scroll = useMiddle(containerRef, [], {
    active: typeWriter,
    editor,
  });

  useEffect(() => {
    focus(editor);
  }, []);

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

  const handleKeyUp: KeyboardEventHandler<HTMLDivElement> = (e) => {
    scroll.scroll();
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (!editor.selection) return;
    if (e.key === "Enter") {
      const point = Editor.before(editor, editor.selection!.anchor);
      if (!point) return;
      const node = Editor.first(editor, point);
      const text = getNodeText(node[0]);

      const parsed = parseListText(text);
      if (!parsed) return;

      if (editor.selection.anchor.offset !== 0) {
        e.preventDefault();
        if (parsed.content) {
          let prefix = `${parsed.paddingText}${parsed.symbol} `;
          if (parsed.serial !== undefined) {
            prefix = `${parsed.paddingText}${parsed.serial + 1}. `;
          }
          Transforms.insertNodes(editor, [
            { type: "paragraph", children: [{ text: "" }] },
          ]);
          Transforms.insertText(editor, prefix);
          if (parsed.type === "ordered") {
            adjustFollowingSerial(editor, editor.selection!.anchor.path);
          }
        } else {
          Transforms.removeNodes(editor);
          Transforms.insertNodes(editor, [
            { type: "paragraph", children: [{ text: "" }] },
          ]);
        }
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      intend(editor, !e.shiftKey);
    }
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

  const handleMouseUp = () => {
    if (editor.selection) {
      const parsed = parseListNode(editor, editor.selection.anchor.path);
      if (parsed) {
        const startPath = getBlockStartPath(
          editor,
          editor.selection.anchor.path
        );
        // console.log(startPath);
        // if (startPath) {
        //   console.log(getListBlock(editor, startPath));
        // }
      }
    }
  };

  return (
    <div style={{ ...scroll.style }}>
      <div ref={containerRef} id="editorContainer">
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
            onKeyDown={handleKeyDown}
            onMouseUp={handleMouseUp}
            placeholder="Write your mind here ..."
          />
        </Slate>
      </div>
    </div>
  );
};

export default MEditor;
