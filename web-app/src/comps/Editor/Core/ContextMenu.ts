import { useCallback, useEffect, useRef, useState } from "react";
import { CustomEditor } from "./Core";
import { Range, Editor } from "slate";
import { ReactEditor } from "slate-react";

escape.matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
function escape(str: string) {
  return str.replace(escape.matchOperatorsRe, "\\$&");
}

export function useContextMenu<T>(editor: CustomEditor, prefix: string) {
  const ref = useRef<HTMLUListElement>(null);
  const [target, setTarget] = useState<Range>();
  const [search, setSearch] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    document
      .getElementById("editor-container")
      ?.addEventListener("scroll", handleScroll);
    return () => {
      document
        .getElementById("editor-container")
        ?.removeEventListener("scroll", handleScroll);
    };
  }, [editor, prefix]);

  useEffect(() => {
    if (target) {
      const el = ref.current;
      if (!ReactEditor.hasRange(editor, target)) return;
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();
      if (el) {
        el.style.top = `${rect.top + window.pageYOffset + 24}px`;
        el.style.left = `${rect.left + window.pageXOffset}px`;
      }
    }
  }, [editor, index, search, target]);

  const handleScroll = useCallback(() => {
    console.log("here");
    setTarget(undefined);
    setSearch("");
    setIndex(0);
  }, []);

  const handleChange = useCallback(() => {
    const { selection } = editor;
    let showing = false;

    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection);
      const bfr = Editor.before(editor, start, {
        distance: prefix.length,
        unit: "character",
      });
      const bfrRange = bfr && Editor.range(editor, bfr, start);
      const bfrText = bfrRange && Editor.string(editor, bfrRange);

      if (bfrText === prefix) {
        setTarget(bfrRange);
        setIndex(0);
        setSearch("");
        showing = true;
      } else {
        const wordBefore = Editor.before(editor, start, { unit: "word" });
        const before =
          wordBefore &&
          Editor.before(editor, wordBefore, {
            distance: prefix.length,
            unit: "character",
          });
        const beforeRange = before && Editor.range(editor, before, start);
        const beforeText = beforeRange && Editor.string(editor, beforeRange);
        const beforeMatch =
          beforeText &&
          beforeText.match(new RegExp(`^${escape(prefix)}(\\w*)$`));


        if (beforeMatch) {
          setTarget(beforeRange);
          setIndex(0);
          showing = true;

          const after = Editor.after(editor, start);
          const afterRange = Editor.range(editor, start, after);
          const afterText = Editor.string(editor, afterRange);
          const afterMatch = afterText.match(/^(\s|$)/);

          if (afterMatch) {
            setSearch(beforeMatch[1]);
          }
        }
      }
    }

    if (!showing) {
      setTarget(undefined);
      setSearch("");
    }
  }, []);

  return {
    handleChange,
    ref,
    active: !!target,
  };
}
