import classNames from "classnames";
import Prism from "prismjs";
import {
  CSSProperties,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { createEditor, NodeEntry, Text, Descendant, Node } from "slate";
import { withHistory } from "slate-history";
import { Slate, Editable, withReact } from "slate-react";
import * as grammer from "./grammer";
import { useMiddle } from "./useMiddle";
import slugify from "slugify";
import { CustomEditor, focusEnd, CustomElement } from "./Editor/Core/Core";
import {
  ParsedListText,
  handleEnterForList,
  intend,
  parseListText,
} from "./Editor/Core/List";
import {
  codify,
  getCodeRanges,
  handleBackspaceForCode,
  handleEnterForCode,
  handleTabForCode,
} from "./Editor/Core/Code";
import { test, testCode } from "./Editor/Core/test";
import { getTokensRanges } from "./Editor/Core/Range";

test();
testCode();

const serialize = (value: Descendant[]) => {
  return value
    .map((n): string => {
      if ((n as CustomElement).type === "code-block") {
        return serialize((n as CustomElement).children);
      }
      return Node.string(n);
    })
    .join("\n");
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

const Leaf = ({ attributes, children, leaf, onCodify }: any) => {
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

    // code
    "opacity-30 mb-2 inline-block": leaf.codeBlock && leaf.language,
  });

  if (leaf.code) {
    const { text, code, ...rest } = leaf;
    return (
      <span {...attributes} className={classNames("token", rest)}>
        {children}
      </span>
    );
  }

  if (leaf.notelink) {
    return (
      <span {...attributes} className={className} onClick={onCodify}>
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

const MEditor = ({
  onChange,
  initValue,
  initText,
  typeWriter,
  editor: passedEditor,
  focus,
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
  focus?: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editor = useMemo(
    () => passedEditor || withHistory(withReact(createEditor())),
    [passedEditor]
  );
  const renderLeaf = useCallback(
    (props: any) => <Leaf onCodify={() => codify(editor)} {...props} />,
    []
  );
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
      codeBlock: grammer.codeBlock,
    });

    const codeRanges = getCodeRanges(editor, path);
    const ranges = getTokensRanges(editor, path, tokens, 0, []);

    return [...ranges, ...codeRanges];
  }, []);

  const renderElement = useCallback(
    ({
      attributes,
      children,
      element,
    }: {
      attributes: any;
      children: any;
      element: CustomElement;
    }) => {
      let text = "";
      for (const child of element.children) {
        text += child.text;
      }
      const imgMatch = text.match(grammer.imageRegex)
        ? text.match(grammer.link.pattern)
        : null;
      const imgUrl = imgMatch ? imgMatch[0] : null;
      const quote = text.match(grammer.quoteRegex);

      const style: CSSProperties = {};
      const parsed = parseListText(text);
      if (parsed) {
        style.marginLeft = 50 * (parsed.level + 1);
      }

      if (element.type === "code-block") {
        return (
          <pre
            {...attributes}
            className="mb-4 bg-primary-700 bg-opacity-5 p-4 rounded-md"
            spellCheck={false}
          >
            {children}
          </pre>
        );
      }

      return (
        <p
          {...attributes}
          className={classNames({
            "px-6 bg-primary-700 bg-opacity-10 py-2 italic": quote,
            "border-l-4 border-primary-700 border-opacity-30": quote,
            "flex flex-col items-center py-10": imgUrl,
            "mb-2": !quote,
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
    focusEnd(editor);
  }, [focus]);

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
    if (e.key === "Enter") {
      handleEnterForCode(editor, e);
      handleEnterForList(editor, e);
    } else if (e.key === "Tab") {
      e.preventDefault();
      intend(editor, !e.shiftKey);
      handleTabForCode(editor, e);
    } else if (e.key === "Backspace") {
      handleBackspaceForCode(editor, e);
    }
  };

  const handlePaste = () => {
    setTimeout(() => codify(editor), 200);
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
            onPaste={handlePaste}
          />
        </Slate>
      </div>
    </div>
  );
};

export default MEditor;
