import { DependencyList, RefObject, useEffect, useMemo, useState } from "react";
import { BaseEditor, Editor } from "slate";
import { ReactEditor } from "slate-react";
import { CustomEditor } from "../App/Core/Core";

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
    typeWriter?: boolean;
    active?: boolean;
  }
) => {
  options = options || {
    typeWriter: true,
    active: true,
  };
  const height = useMemo(() => window.innerHeight, []);
  const [paddingTop, setPaddingTop] = useState(height / 2);

  useEffect(() => {
    update();
  }, [options.typeWriter, ...deps]);

  const getScrollElement = () => {
    let element = document.getElementById("editor-container");
    if (!element) {
      element = document.body;
    }
    return element;
  };

  const update = () => {
    if (ref.current) {
      let clientHeight = ref.current.clientHeight;
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
      const elem = getScrollElement();
      setTimeout(() => {
        elem.scrollTo({
          top: elem.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  const scrollToTop = () => {
    getScrollElement().scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollTo = ({ className }: { className?: string }) => {
    if (className) {
      document.querySelector(`.${className}`)?.scrollIntoView(true);
    }
  };

  return {
    update,
    scroll,
    scrollToTop,
    scrollTo,
    style: {
      paddingTop: options.active && options.typeWriter ? paddingTop : 0,
      paddingBottom: !options.active
        ? undefined
        : options.typeWriter
        ? height / 2
        : 100,
    },
  };
};
