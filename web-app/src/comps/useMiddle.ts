import { DependencyList, RefObject, useEffect, useMemo, useState } from "react";
import { BaseEditor, Editor } from "slate";
import { ReactEditor } from "slate-react";
import { CustomEditor } from "./Editor/Core/Core";

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
  }, [options.active, ...deps]);

  const update = () => {
    if (ref.current) {
      let clientHeight = ref.current.clientHeight;
      console.log(
        window
          .getComputedStyle(ref.current, null)
          .getPropertyValue("padding-top")
      );
      clientHeight -= Number(
        window
          .getComputedStyle(ref.current, null)
          .getPropertyValue("padding-top")
          .replace("px", "")
      );
      clientHeight -= Number(
        window
          .getComputedStyle(ref.current, null)
          .getPropertyValue("padding-bottom")
          .replace("px", "")
      );
      setPaddingTop(Math.max(0, height / 2 - clientHeight));
    }
  };

  const scroll = ({
    editor,
    force,
  }: {
    editor?: CustomEditor;
    force?: boolean;
  }) => {
    if (force || !editor || (editor && isCursorAtEnd(editor))) {
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

  const scrollToTop = () => {
    let element = document.getElementById("editor-container");
    if (!element) {
      element = document.body;
    }
    element.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return {
    update,
    scroll,
    scrollToTop,
    style: {
      paddingTop: options.active ? paddingTop : 0,
      paddingBottom: options.active ? height / 2 : 100,
    },
  };
};
