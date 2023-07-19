import { ReactElement } from "react";
import { Theme } from "src/App/Theme";
import classNames from "classnames";
import slugify from "slugify";
import { BiFolder } from "react-icons/bi";
import { BaseRange } from "slate";
import { CustomEditor } from "../Core";

export type LeafMaker = (props: {
  attributes: any;
  children: any;
  leaf: Record<string, any>;
  text: { text: string };
  className: string;
  setSelection: (range: Partial<BaseRange>) => void;
  editor: CustomEditor;
}) => ReactElement | undefined;

function Leaf({
  attributes,
  children,
  leaf,
  onNoteLinkClick,
  text,
  theme,
  leafMakers,
  placeholder,
  setSelection,
  editor,
}: {
  attributes: any;
  children: any;
  leaf: Record<string, any>;
  onNoteLinkClick(title: string, id?: string): void;
  text: { text: string };
  theme: Theme;
  leafMakers: LeafMaker[];
  placeholder?: string;
  setSelection: (range: Partial<BaseRange>) => void;
  editor: CustomEditor;
}) {
  const title = leaf.title1 || leaf.title2 || leaf.title3;

  const className = classNames({
    // decor
    "font-semibold": leaf.bold || leaf.boldItalic,
    italic: leaf.italic || leaf.boldItalic,
    "line-through": leaf.strikethrough,
    hidden:
      leaf.hidable && !leaf.focused && (leaf.punctuation || leaf.notelinkId),

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
  });

  for (const maker of leafMakers || []) {
    const element = maker({
      attributes,
      leaf,
      text,
      children,
      className,
      setSelection,
      editor,
    });
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
