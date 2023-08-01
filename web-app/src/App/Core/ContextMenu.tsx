import {
  ComponentProps,
  KeyboardEventHandler,
  PropsWithChildren,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { CustomEditor } from "./Core";
import { Range } from "slate";
import { ReactEditor } from "slate-react";
import { twMerge } from "tailwind-merge";
import classNames from "classnames";
import { getCurrentBoundary, getCurrentWord } from "./Word";
import { escape } from "src/util";

const MENU_WIDTH = 300;
const MENU_HEIGHT = 300;

export type Boundary = { start: string; end: string };

export function useContextMenu(
  editor: CustomEditor,
  prefixes: string[],
  boundaries: Boundary[],
  onEnter: (opts: {
    index: number;
    target: Range;
    search: string;
    prefix: string;
  }) => void
) {
  const ref = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState<Range>();
  const [search, setSearch] = useState("");
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [activePrefix, setActivePrefix] = useState<string>();

  useEffect(() => {
    document.getElementById("body")?.addEventListener("scroll", handleScroll);
    return () => {
      document
        .getElementById("body")
        ?.removeEventListener("scroll", handleScroll);
    };
  }, [editor, prefixes]);

  useEffect(() => {
    window.addEventListener("click", handleBodyClick);
    return () => window.removeEventListener("click", handleBodyClick);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (target) {
      if (!ReactEditor.hasRange(editor, target)) return;
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();
      if (el) {
        const rawLeft = rect.left + window.pageXOffset;
        const menuPadX = 20;
        const left =
          rawLeft -
          Math.max(0, rawLeft + MENU_WIDTH + menuPadX - window.innerWidth);

        const menuPadY = 24;
        const lineHeight = 34;
        let top = rect.top + window.pageYOffset + menuPadY;
        const menuHeight =
          document.getElementById("context-menu")?.clientHeight || 0;
        if (top + menuHeight > window.innerHeight) {
          top -= menuHeight + lineHeight;
        }
        el.style.top = `${top}px`;
        el.style.left = `${left}px`;
      }
    }
  }, [editor, index, activePrefix, search, count, target]);

  const handleBodyClick = (e: MouseEvent) => {
    const contextMenu = document.getElementById("context-menu");
    if (!contextMenu?.contains(e.target as any)) {
      setTarget(undefined);
      setSearch("");
      setActivePrefix(undefined);
    }
  };

  const handleScroll = useCallback(() => {
    setActivePrefix(undefined);
    setTarget(undefined);
    setSearch("");
    setIndex(0);
  }, []);

  const handleChange = useCallback(() => {
    const { selection } = editor;
    if (!selection || !Range.isCollapsed(selection)) return;
    let showing = false;

    for (const boundary of boundaries) {
      if (editor.selection?.anchor.offset !== 0) {
        const { currentWord, currentRange } = getCurrentBoundary(
          editor,
          boundary
        );
        if (currentWord) {
          setTarget(currentRange);
          setIndex(0);
          showing = true;
          break;
        }
      }
    }

    if (!showing) {
      for (const prefix of prefixes) {
        if (editor.selection?.anchor.offset !== 0) {
          const { currentWord, currentRange } = getCurrentWord(editor);

          const beforeMatch =
            currentWord &&
            currentWord.match(new RegExp(`^${escape(prefix)}(.*)$`));

          if (beforeMatch) {
            setTarget(currentRange);
            setIndex(0);
            showing = true;
            setActivePrefix(prefix);
            setSearch(beforeMatch[1]);
            break;
          }
        }
      }
    }

    if (!showing) {
      setTarget(undefined);
      setSearch("");
      setActivePrefix(undefined);
    }
  }, [editor]);

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (target && count > 0) {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            e.stopPropagation();
            const prevIndex = index >= count - 1 ? 0 : index + 1;
            setIndex(prevIndex);
            updateListScroll(prevIndex);
            break;
          case "ArrowUp":
            e.preventDefault();
            e.stopPropagation();
            const nextIndex = index <= 0 ? count - 1 : index - 1;
            setIndex(nextIndex);
            updateListScroll(nextIndex);
            break;
          case "Tab":
          case "Enter":
            e.preventDefault();
            e.stopPropagation();
            onEnter({ index, target, search, prefix: activePrefix! });
            setTarget(undefined);
            break;
          case "Escape":
            e.preventDefault();
            e.stopPropagation();
            setTarget(undefined);
            setActivePrefix(undefined);
            setSearch("");
            setIndex(0);
            break;
        }
      }
    },
    [editor, count, target, index, search]
  );

  const handleItemClick = useCallback(
    (e: React.MouseEvent<HTMLLIElement, MouseEvent>, idx: number) => {
      if (target) {
        e.preventDefault();
        onEnter({ index: idx, target, search, prefix: activePrefix! });
        setTarget(undefined);
      }
    },
    [editor, count, target, index, search]
  );

  const updateListScroll = (idx: number) => {
    const list = document.getElementById("suggestion-list");
    const targetLi = document.getElementById(`suggestion-item-${idx}`);

    if (list && targetLi) {
      const targetRect = targetLi?.getBoundingClientRect();

      const after =
        targetLi.offsetTop + targetRect.height - (list.scrollTop + MENU_HEIGHT);
      const before = targetLi.offsetTop - list.scrollTop;

      if (after > 0) {
        list.scrollTop += after;
      } else if (before < 0) {
        list.scrollTop += before;
      }
    }
  };

  return {
    handleChange,
    handleKeyDown,
    ref,
    active: !!target,
    index,
    handleItemClick,
    search,
    setCount,
    activePrefix,
    target,
  };
}

export const ContextMenu = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ children, className, style, ...restProps }, ref) => {
    return (
      <div
        id="context-menu"
        ref={ref}
        className={twMerge(
          className,
          classNames(
            "absolute shadow-md rounded-lg overflow-hidden",
            "z-10 bg-base border border-primary border-opacity-10"
          )
        )}
        style={{ width: MENU_WIDTH, ...style }}
        {...restProps}
      >
        {children}
        <div className="bg-primary opacity-50 bg-opacity-20 py-1 px-2 text-xs">
          Use &larr; &uarr; &rarr; &darr; ↵ Esc
        </div>
      </div>
    );
  }
);

export const ContextMenuList = ({ children }: PropsWithChildren) => {
  return (
    <ul
      id="suggestion-list"
      className="overflow-y-scroll scrollbar-hide"
      style={{ maxHeight: MENU_HEIGHT }}
    >
      {children}
    </ul>
  );
};

const Item = ({
  children,
  hover,
  idx,
  ...restProps
}: ComponentProps<"li"> & { idx: number; hover?: boolean }) => {
  return (
    <li
      id={`suggestion-item-${idx}`}
      className={classNames(
        "p-2 hover:bg-primary hover:bg-opacity-5 cursor-pointer active:bg-opacity-10",
        "border-b border-primary border-opacity-10 last:border-b-0",
        { "bg-primary bg-opacity-5": hover }
      )}
      {...restProps}
    >
      {children}
    </li>
  );
};

const Description = ({
  children,
  className,
  ...restProps
}: ComponentProps<"div">) => {
  return (
    <div
      className={twMerge(classNames("text-xs mt-1 opacity-60"), className)}
      {...restProps}
    >
      {children}
    </div>
  );
};

Item.Description = Description;
ContextMenuList.Item = Item;
