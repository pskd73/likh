import { CSSProperties, ReactElement } from "react";
import { Theme } from "src/App/Theme";
import { ParsedListText, parseListText } from "src/App/Core/List";
import classNames from "classnames";
import slugify from "slugify";
import { BiFolder } from "react-icons/bi";
import { BaseRange } from "slate";

export type LeafMaker = (props: {
  attributes: any;
  children: any;
  leaf: Record<string, any>;
  text: { text: string };
  className: string;
}) => ReactElement | undefined;

function Leaf({
  attributes,
  children,
  leaf,
  onCheckboxToggle,
  onNoteLinkClick,
  text,
  theme,
  leafMakers,
  placeholder,
  setSelection,
}: {
  attributes: any;
  children: any;
  leaf: Record<string, any>;
  onCheckboxToggle(path: number[]): void;
  onNoteLinkClick(title: string, id?: string): void;
  text: { text: string };
  theme: Theme;
  leafMakers: LeafMaker[];
  placeholder?: string;
  setSelection: (range: Partial<BaseRange>) => void;
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
    "font-semibold": leaf.bold || leaf.boldItalic,
    italic: leaf.italic || leaf.boldItalic,
    "line-through": leaf.strikethrough,
    hidden:
      leaf.hidable &&
      !leaf.focused &&
      (leaf.punctuation || leaf.notelinkId) &&
      !leaf.checkbox,

    // generic punctuation
    "opacity-30": leaf.punctuation || leaf.blockquote,

    // title
    "md:inline-flex font-semibold": title && !leaf.hashes,
    "md:inline-flex 1": title && leaf.hashes && leaf.focused,
    "hidden 1":
      title &&
      leaf.hashes &&
      !leaf.focused &&
      text.text.replaceAll("#", "").trim() !== "",
    "justify-end opacity-30": title && leaf.hashes,
    [theme.font.title1]: leaf.title1,
    [theme.font.title2]: leaf.title2,
    [theme.font.title3]: leaf.title3,

    // link
    "underline cursor-pointer": leaf.link,

    // notelink
    "underline cursor-pointer nl": leaf.notelink && !leaf.punctuation,
    notelink: leaf.notelink && !leaf.punctuation && !leaf.notelinkId,
    "opacity-30 nl": leaf.notelink && leaf.notelinkId,

    // inlineCode
    "font-CourierPrime bg-primary bg-opacity-20 px-1 rounded inline-flex items-center":
      leaf.inlineCode && !leaf.punctuation,

    // mdLink
    "mdLink underline cursor-pointer": leaf.mdLink,

    // highlight
    "highlight bg-primary bg-opacity-20": leaf.highlight,

    // image
    "hidden image": leaf.image && !leaf.alt && !leaf.focused,

    // hashtag
    "bg-primary bg-opacity-20 px-3 py-1 rounded-full inline-block mb-1 text-xs":
      leaf.hashtag,
    "inline-flex items-center": leaf.hashtag,
  });

  for (const maker of leafMakers || []) {
    const element = maker({ attributes, leaf, text, children, className });
    if (element) {
      return element;
    }
  }

  if (leaf.hr && !leaf.focused) {
    return (
      <span
        contentEditable={false}
        onClick={() =>
          setSelection({
            anchor: { path: leaf.path, offset: 3 },
            focus: { path: leaf.path, offset: 3 },
          })
        }
        className={classNames(
          "hover:bg-primary hover:bg-opacity-10 h-4",
          "inline-flex items-center w-full transition-all"
        )}
      >
        <span
          className={classNames(
            "border border-t border-primary",
            "border-opacity-30 w-full inline-block"
          )}
        />
      </span>
    );
  }

  if (leaf.hashtag) {
    return (
      <span {...attributes} className={className} spellCheck={false}>
        {!leaf.punctuation && (
          <span
            contentEditable={false}
            style={{ userSelect: "none" }}
            className="inline-flex items-center mr-1"
          >
            <span>
              <BiFolder />
            </span>
          </span>
        )}
        <span>{children}</span>
      </span>
    );
  }

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

  if (leaf.bulletUnordered || leaf.bulletOrdered) {
    const parsed = parseListText(leaf.text + " ");
    const width = (parsed?.level || 1) * 40;
    return (
      <span
        {...attributes}
        style={{ marginLeft: -width, width }}
        className={"text-primary text-opacity-50 inline-block text-right"}
        onFocus={() =>
          setSelection({
            anchor: { path: leaf.path, offset: leaf.text.length - 1 },
            focus: { path: leaf.path, offset: leaf.text.length - 1 },
          })
        }
        onClick={() =>
          setSelection({
            anchor: { path: leaf.path, offset: leaf.text.length - 1 },
            focus: { path: leaf.path, offset: leaf.text.length - 1 },
          })
        }
      >
        {leaf.bulletUnordered && !leaf.focused && (
          <span contentEditable={false}>•&nbsp;</span>
        )}
        <span
          className={classNames({
            hidden: !leaf.focused && leaf.bulletUnordered,
          })}
          style={{}}
        >
          {children}
        </span>
      </span>
    );
  }

  if (leaf.checkbox) {
    return (
      <span {...attributes}>
        {!leaf.focused && (
          <span
            onClick={() => onCheckboxToggle(leaf.path)}
            contentEditable={false}
          >
            <input
              type="checkbox"
              checked={leaf.text.includes("x")}
              readOnly
              className="outline-none cursor-pointer"
            />
          </span>
        )}
        <span className={classNames({ hidden: !leaf.focused })}>
          {children}
        </span>
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
      spellCheck={!leaf.hashtag}
    >
      {placeholder && leaf.newLine && (
        <span
          contentEditable={false}
          className="absolute text-primary text-opacity-40 pointer-events-none select-none"
        >
          {placeholder}
        </span>
      )}
      {children}
    </span>
  );
}

export default Leaf;
