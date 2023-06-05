import { DependencyList, RefObject, useEffect, useMemo, useState } from "react";
import { BaseEditor, Editor } from "slate";
import { ReactEditor } from "slate-react";

const isCursorAtEnd = (editor: BaseEditor & ReactEditor) => {
  const { selection } = editor;

  let end = false;
  if (selection?.anchor) {
    end = !Editor.after(editor, selection.anchor);
  }
  if (selection?.focus) {
    end = !Editor.after(editor, selection.focus);
  }

  return end;
};

export const useMiddle = (
  ref: RefObject<HTMLDivElement>,
  deps: DependencyList,
  options?: {
    editor?: BaseEditor & ReactEditor;
    active?: boolean;
  }
) => {
  options = options || {
    active: true,
  };
  const height = useMemo(() => window.innerHeight, []);
  const [paddingTop, setPaddingTop] = useState(height / 2);

  useEffect(() => {
    update();
    scroll(true);
  }, [options.active, options.editor, ...deps]);

  const update = () => {
    if (ref.current) {
      setPaddingTop(Math.max(0, height / 2 - ref.current.clientHeight));
    }
  };

  const scroll = (force?: boolean) => {
    if (
      force ||
      !options?.editor ||
      (options.editor && isCursorAtEnd(options.editor))
    ) {
      let element = document.getElementById("editor-container");
      if (!element) {
        element = document.body;
      }
      element.scrollTo({
        top: 10000000,
        behavior: "smooth",
      });
    }
  };

  return {
    update,
    scroll,
    style: {
      paddingTop: options.active ? paddingTop : 0,
      paddingBottom: options.active ? height / 2 : 100,
    },
  };
};
