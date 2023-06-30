import { CSSProperties } from "react";
import { Theme } from "../../Theme";
import { ParsedListText, parseListText } from "../List";
import classNames from "classnames";
import slugify from "slugify";
import moment from "moment";
import { BiTimeFive } from "react-icons/bi";

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
    "bg-primary bg-opacity-20  w-[20px] h-[20px] font-bold":
      leaf.checkbox && !leaf.punctuation,
    "inline-flex justify-center items-center mx-1 cursor-pointer":
      leaf.checkbox && !leaf.punctuation,
    "rounded border-primary border-opacity-30":
      leaf.checkbox && !leaf.punctuation,
    border: leaf.checkbox && !leaf.punctuation && leaf.text === " ",
    "opacity-70": leaf.checkbox && !leaf.punctuation && leaf.text === "x",
    "line-through text-primary text-opacity-50":
      leaf.list && !leaf.checkbox && !leaf.bullet && leaf.payload.checked,

    // link
    "underline cursor-pointer": leaf.link,

    // hashtag
    "bg-primary bg-opacity-20 p-1 px-3 rounded-full": leaf.hashtag,

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

    // datetime
    "bg-primary bg-opacity-20 px-3 py-1 rounded-full inline-block mb-1 text-sm":
      leaf.datetime,
    "inline-flex items-center": leaf.datetime,
  });

  if (leaf.datetime) {
    return (
      <span {...attributes} className={className}>
        {!leaf.punctuation && (
          <span
            contentEditable={false}
            style={{ userSelect: "none" }}
            className="inline-flex items-center space-x-1"
          >
            <BiTimeFive />
            <span>
              {moment(leaf.text.replace("@", "")).fromNow()}
              {leaf.focused && " - "}
            </span>
          </span>
        )}
        <span className={classNames("opacity-50", { hidden: !leaf.focused })}>
          {children}
        </span>
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
      style={style}
      onClick={() => {
        if (leaf.checkbox) {
          onCheckboxToggle(leaf.path);
        }
      }}
      spellCheck={!leaf.hashtag}
    >
      {children}
    </span>
  );
}

export default Leaf;
