import { useCallback, useEffect } from "react";
import { EditorContextType } from "./Context";

const isWindowShortcut = (e: KeyboardEvent) => {
  return (e.metaKey || e.ctrlKey) && e.shiftKey;
};

const shortcuts: Record<string, (editor: EditorContextType) => void> = {
  l: (editor) => editor.toggleSideBar(),
  n: (editor) => editor.newNote({ text: "New note" }),
  ArrowLeft: (editor) => {
    const { storage } = editor;
    const idx = storage.notes.findIndex((note) => editor.note.id === note.id);
    const prevNote = storage.notes[idx - 1]
      ? storage.getNote(storage.notes[idx - 1].id)
      : undefined;
    if (prevNote) {
      editor.updateNote(prevNote);
    }
  },
  ArrowRight: (editor) => {
    const { storage } = editor;
    const idx = storage.notes.findIndex((note) => editor.note.id === note.id);
    const nextNote = storage.notes[idx + 1]
      ? storage.getNote(storage.notes[idx + 1].id)
      : undefined;
    if (nextNote) {
      editor.updateNote(nextNote);
    }
  },
};

const useShortcuts = (editor: EditorContextType) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isWindowShortcut(e)) {
        console.log(e);
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
