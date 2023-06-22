import classNames from "classnames";
import Prism from "prismjs";
import {
  CSSProperties,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
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
import slugify from "slugify";
import {
  CustomEditor,
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
import { PastedImg, SavedImg, useEditorPaste } from "./useEditorPaste";
import { Theme, Themes } from "./Theme";
import { isMobile } from "./device";

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
  theme,
}: {
  attributes: any;
  children: any;
  leaf: Record<string, any>;
  onCheckboxToggle(path: number[]): void;
  onNoteLinkClick(title: string, id?: string): void;
  text: string;
  theme: Theme;
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
      leaf.hidable && !leaf.focused && (leaf.punctuation || leaf.notelinkId),

    // generic punctuation
    "opacity-30": leaf.punctuation || leaf.blockquote,

    // title
    "md:inline-flex font-semibold": title && !leaf.hashes,
    "md:-ml-[50px] md:w-[50px] md:pr-[10px]": title && leaf.hashes,
    "md:inline-flex 1": title && leaf.hashes && leaf.focused,
    "hidden 1": title && leaf.hashes && !leaf.focused,
    "justify-end opacity-30": title && leaf.hashes,
    [theme.font.title1]: leaf.title1,
    [theme.font.title2]: leaf.title2,
    [theme.font.title3]: leaf.title3,

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

    // highlight
    "highlight bg-primary-700 bg-opacity-20": leaf.highlight,

    // image
    "hidden image": leaf.image && !leaf.alt && !leaf.focused,
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

  let id: string | undefined = undefined;
  if (leaf.highlight) {
    id = "highlight";
  }

  return (
    <span
      {...attributes}
      className={className}
      id={id}
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

const Editor = ({
  onChange,
  initValue,
  initText,
  editor: passedEditor,
  onNoteLinkClick,
  getSuggestions,
  highlight,
  handleSaveImg,
  getSavedImg,
  containerClassName,
  theme,
}: {
  onChange: (val: {
    value: Descendant[];
    text: string;
    serialized: string;
    editor: CustomEditor;
  }) => void;
  containerClassName: string;
  initValue?: string;
  initText?: string;
  editor?: CustomEditor;
  onNoteLinkClick?: (title: string, id?: string) => void;
  getSuggestions?: (prefix: string, term: string) => Promise<Suggestion[]>;
  highlight?: string;
  handleSaveImg?: (img: PastedImg) => Promise<SavedImg | undefined>;
  getSavedImg?: (id: string, imgType: string) => Promise<SavedImg>;
  theme?: Theme;
}) => {
  theme = theme || Themes.Basic;

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
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    (async () => {
      if (contextMenu.activePrefix) {
        let _suggestions: Suggestion[] = getSuggestions
          ? await getSuggestions(contextMenu.activePrefix, contextMenu.search)
          : [];
        contextMenu.setCount(_suggestions.length);
        return setSuggestions(_suggestions);
      }
      return setSuggestions([]);
    })();
  }, [contextMenu.search, contextMenu.activePrefix]);

  useEditorPaste({
    editor,
    handleSaveImg,
    container: document.querySelector(`.${containerClassName}`),
  });

  const renderLeaf = useCallback(
    (props: any) => (
      <Leaf
        {...props}
        onCheckboxToggle={(path) => toggleCheckbox(editor, path)}
        onNoteLinkClick={onNoteLinkClick || (() => {})}
        theme={theme}
      />
    ),
    []
  );
  const decorate = useCallback(
    ([node, path]: NodeEntry) => {
      if (!Text.isText(node)) {
        return [];
      }
      const newGrammer = Object.assign({}, grammer);
      if (highlight) {
        for (const key of Object.keys(newGrammer)) {
          if (["hashtag"].includes(key)) continue;
          (newGrammer[key] as any) = {
            ...(newGrammer[key] as any),
            inside: {
              ...(newGrammer[key] as any).inside,
              highlight: {
                pattern: RegExp(highlight, "i"),
              },
            },
          };
        }
        newGrammer.highlight = { pattern: RegExp(highlight, "i"), inside: {} };
      }
      const tokens = Prism.tokenize(node.text, newGrammer);

      let ranges: BaseRange[] = [];
      const [rootCodeNode] = getRootCodeNode(editor, path);
      if (!rootCodeNode) {
        ranges = [
          ...ranges,
          ...getTokensRanges(editor, path, tokens, 0, [], {}, newGrammer),
        ];
      } else {
        ranges = [...ranges, ...getCodeRanges(editor, path)];
      }
      return ranges.map((range) => ({ ...range, path }));
    },
    [highlight]
  );

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

      // image
      const imgMatch = text.match(imageRegex);
      const imgUrl = imgMatch ? imgMatch[1] : null;
      const localImgMatch = imgUrl?.match(/^((image)|(attachment)):\/\/(.+)$/);
      let imgUri: string | undefined = undefined;
      let imgRef: HTMLImageElement | null = null;
      if (getSavedImg && localImgMatch) {
        const imgId = Number(localImgMatch[4]);
        const imgType = localImgMatch[1];
        getSavedImg(imgId.toString(), imgType)
          .then((savedImg) => {
            if (imgRef) {
              imgRef.src = savedImg.uri;
            }
          })
          .catch((e) => {});
      }

      // quote
      const quote = text.match(quoteRegex);

      // title
      const titleMatch = text.match(/^(#{1,6}) .+/);
      const titleSlug = titleMatch ? slugify(text, { lower: true }) : undefined;
      const titleLavel = titleMatch ? titleMatch[1].length : undefined;

      const style: CSSProperties = {};
      const parsed = parseListText(text);
      if (parsed) {
        style.marginLeft = (isMobile ? 20 : 40) * (parsed.level + 1);
      }

      if (element.type === "code-block") {
        return (
          <pre
            {...attributes}
            className="mb-4 bg-primary-700 bg-opacity-5 p-4 rounded-md whitespace-break-spaces"
            spellCheck={false}
          >
            {children}
          </pre>
        );
      }

      return (
        <>
          {imgUrl && (
            <div
              style={{ userSelect: "none" }}
              contentEditable={false}
              className="flex flex-col items-center w-full"
            >
              <img
                ref={(r) => (imgRef = r)}
                src={imgUri || imgUrl}
                className="rounded-lg"
                alt="Retro Note"
              />
            </div>
          )}
          <p
            {...attributes}
            className={classNames({
              "px-6 bg-primary-700 bg-opacity-10 py-2 italic": quote,
              "border-l-4 border-primary-700 border-opacity-30": quote,
              "pb-10": imgUrl,
              "mb-2": !quote,
            })}
            style={style}
            data-title-level={titleLavel}
            data-title-slug={titleSlug}
          >
            <span
              className={classNames({
                "py-2 text-center text-sm block opacity-50 break-all": imgUrl,
              })}
            >
              {children}
            </span>
          </p>
        </>
      );
    },
    []
  );

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
      editor,
    });
    contextMenu.handleChange();
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
    <div id="editorContainer">
      <Slate
        editor={editor}
        value={getInitValue() as any}
        onChange={handleChange}
      >
        <Editable
          className={theme.font.base}
          decorate={decorate}
          renderLeaf={renderLeaf}
          renderElement={renderElement}
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
  );
};

export default Editor;
