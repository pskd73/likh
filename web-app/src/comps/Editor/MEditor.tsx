import classNames from "classnames";
import Prism, { TokenObject } from "prismjs";
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
  NodeEntry,
  Text,
  Descendant,
  BaseRange,
  Transforms,
} from "slate";
import { withHistory } from "slate-history";
import { Slate, Editable, withReact } from "slate-react";
import grammer, { imageRegex, quoteRegex } from "./grammer";
import { useMiddle } from "../useMiddle";
import slugify from "slugify";
import {
  CustomEditor,
  focusEnd,
  CustomElement,
  serialize,
  deserialize,
} from "./Core/Core";
import {
  ParsedListText,
  handleEnterForList,
  intend,
  parseListText,
  toggleCheckbox,
} from "./Core/List";
import {
  codify,
  getCodeRanges,
  getRootCodeNode,
  handleBackspaceForCode,
  handleEnterForCode,
  handleTabForCode,
} from "./Core/Code";
import { getTokensRanges } from "./Core/Range";
import {
  ContextMenu,
  ContextMenuList,
  useContextMenu,
} from "./Core/ContextMenu";

const defaultValue = [
  {
    type: "paragraph",
    children: [{ text: "New note" }],
  },
];

export type Suggestion = {
  title: string;
  replace: string;
  id?: string;
  description?: string;
};

function Leaf({
  attributes,
  children,
  leaf,
  onCheckboxToggle,
  onNoteLinkClick,
  text,
}: {
  attributes: any;
  children: any;
  leaf: Record<string, any>;
  onCheckboxToggle(path: number[]): void;
  onNoteLinkClick(title: string, id?: string): void;
  text: string;
}) {
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
    // decor
    "font-semibold": leaf.bold,
    italic: leaf.italic,
    "line-through": leaf.strikethrough,
    hidden:
      leaf.hidable &&
      !leaf.focused &&
      (leaf.punctuation || leaf.hashes || leaf.notelinkId),

    // generic punctuation
    "opacity-30": leaf.punctuation || leaf.blockquote,

    // title
    "inline-flex font-bold": title,
    "-ml-[50px] w-[50px] justify-end pr-[10px] opacity-30":
      title && leaf.hashes,
    "text-4xl": leaf.title1,
    "text-3xl": leaf.title2,
    "text-2xl": leaf.title3,
    "mb-6": leaf.title1 && !leaf.punctuation,
    "mb-4": leaf.title2 && !leaf.punctuation,
    "mb-2": leaf.title3 && !leaf.punctuation,
    "acc-title": title && !leaf.hashes,

    // list
    "opacity-30 inline-flex justify-end pr-[4px]": leaf.bullet,

    // checkbox
    "bg-primary-700 bg-opacity-20  w-[26px] h-[26px] font-bold":
      leaf.checkbox && !leaf.punctuation,
    "inline-flex justify-center items-center mx-1 cursor-pointer":
      leaf.checkbox && !leaf.punctuation,
    "rounded border-primary-700 border-opacity-30":
      leaf.checkbox && !leaf.punctuation,
    border: leaf.checkbox && !leaf.punctuation && leaf.text === " ",
    "opacity-50": leaf.checkbox && !leaf.punctuation && leaf.text === "x",

    // link
    "underline cursor-pointer": leaf.link,

    // hashtag
    "bg-primary-700 bg-opacity-20 p-1 px-3 rounded-full": leaf.hashtag,

    // notelink
    "underline cursor-pointer nl": leaf.notelink && !leaf.punctuation,
    notelink: leaf.notelink && !leaf.punctuation && !leaf.notelinkId,
    "opacity-30 nl": leaf.notelink && leaf.notelinkId,

    // inlineCode
    "font-CourierPrime bg-primary-700 bg-opacity-20 px-1 rounded inline-flex items-center":
      leaf.inlineCode && !leaf.punctuation,

    // mdLink
    "mdLink underline cursor-pointer": leaf.mdLink,
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
      <span
        {...attributes}
        className={className}
        onClick={() => {
          if (!leaf.punctuation) {
            onNoteLinkClick(leaf.text, leaf.payload.notelinkId);
          }
        }}
        id={
          !leaf.punctuation && !leaf.notelinkId
            ? slugify(leaf.text, { lower: true })
            : undefined
        }
      >
        {children}
      </span>
    );
  }

  if (leaf.link || leaf.mdLink) {
    return (
      <span
        {...attributes}
        className={className}
        onClick={() => {
          window.open(leaf.payload?.link || leaf.text, "_blank");
        }}
      >
        {children}
      </span>
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
      onClick={() => {
        if (leaf.checkbox) {
          onCheckboxToggle(leaf.path);
        }
      }}
    >
      {children}
    </span>
  );
}

const MEditor = ({
  onChange,
  initValue,
  initText,
  typeWriter,
  editor: passedEditor,
  onNoteLinkClick,
  getSuggestions,
  key,
}: {
  onChange: (val: {
    value: Descendant[];
    text: string;
    serialized: string;
  }) => void;
  key: number | string;
  initValue?: string;
  initText?: string;
  typeWriter?: boolean;
  editor?: CustomEditor;
  onNoteLinkClick?: (title: string, id?: string) => void;
  getSuggestions?: (prefix: string, term: string) => Suggestion[];
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editor = useMemo(
    () => passedEditor || withHistory(withReact(createEditor())),
    [passedEditor]
  );
  const contextMenu = useContextMenu(
    editor,
    ["[[", "#"],
    ({ index, target, prefix }) => {
      handleContextMenuSelect(index, target, prefix);
    }
  );
  const suggestions: Suggestion[] = useMemo(() => {
    if (contextMenu.activePrefix) {
      let _suggestions: Suggestion[] = getSuggestions
        ? getSuggestions(contextMenu.activePrefix, contextMenu.search)
        : [];
      contextMenu.setCount(_suggestions.length);
      return _suggestions;
    }
    return [];
  }, [contextMenu.search, contextMenu.activePrefix]);

  const renderLeaf = useCallback(
    (props: any) => (
      <Leaf
        {...props}
        onCheckboxToggle={(path) => toggleCheckbox(editor, path)}
        onNoteLinkClick={onNoteLinkClick || (() => {})}
      />
    ),
    []
  );
  const decorate = useCallback(([node, path]: NodeEntry) => {
    if (!Text.isText(node)) {
      return [];
    }

    const tokens = Prism.tokenize(node.text, grammer);

    let ranges: BaseRange[] = [];
    const [rootCodeNode] = getRootCodeNode(editor, path);
    if (!rootCodeNode) {
      ranges = [
        ...ranges,
        ...getTokensRanges(editor, path, tokens, 0, [], {}, grammer),
      ];
    } else {
      ranges = [...ranges, ...getCodeRanges(editor, path)];
    }
    return ranges.map((range) => ({ ...range, path }));
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
      const imgMatch = text.match(imageRegex)
        ? text.match((grammer.link as TokenObject).pattern)
        : null;
      const imgUrl = imgMatch ? imgMatch[0] : null;
      const quote = text.match(quoteRegex);

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
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
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
    scroll.scrollToTop();
  }, [key]);

  const handleContextMenuSelect = (
    index: number,
    target: BaseRange,
    prefix: string
  ) => {
    Transforms.select(editor, target);
    const suggestion = suggestions[index];
    Transforms.insertText(editor, suggestion.replace);
  };

  const handleChange = (value: Descendant[]) => {
    onChange({
      value,
      text: serialize(value),
      serialized: JSON.stringify(value),
    });
    if (typeWriter) {
      scroll.update();
    }
    contextMenu.handleChange();
  };

  const handleKeyUp: KeyboardEventHandler<HTMLDivElement> = (e) => {
    // scroll.scroll();
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    contextMenu.handleKeyDown(e);
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
            placeholder="Write your mind here ..."
            onPaste={handlePaste}
          />
          {contextMenu.active && suggestions && suggestions.length > 0 && (
            <ContextMenu
              ref={contextMenu.ref}
              style={{ top: -9999, right: -9999 }}
              className="text-sm"
            >
              <ContextMenuList>
                {suggestions.map((suggestion, i) => (
                  <ContextMenuList.Item
                    key={i}
                    idx={i}
                    hover={contextMenu.index === i}
                    onClick={(e) => contextMenu.handleItemClick(e, i)}
                  >
                    {suggestion.title}
                  </ContextMenuList.Item>
                ))}
              </ContextMenuList>
            </ContextMenu>
          )}
        </Slate>
      </div>
    </div>
  );
};

export default MEditor;
