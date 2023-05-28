import { useCallback, useEffect } from "react";
import { EditorContextType } from "./Context";

const isWindowShortcut = (e: KeyboardEvent) => {
  return (e.metaKey || e.ctrlKey) && e.shiftKey;
};

const shortcuts: Record<string, (editor: EditorContextType) => void> = {
  l: (editor) => editor.toggleSideBar(),
  n: (editor) => editor.newNote({ text: "New note" }),
};

const useShortcuts = (editor: EditorContextType) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isWindowShortcut(e)) {
        if (shortcuts[e.key]) {
          e.preventDefault();
          shortcuts[e.key](editor);
        }
      }
    },
    [editor]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editor]);
};

export default useShortcuts;
