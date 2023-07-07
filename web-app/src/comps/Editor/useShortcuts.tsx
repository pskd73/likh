import { useCallback, useEffect } from "react";
import { EditorContextType } from "./Context";
import { openFile, saveNote, zipIt } from "./File";
import { SavedNote } from "./type";

const isWindowShortcut = (e: KeyboardEvent) => {
  const mac = e.metaKey && e.ctrlKey;

  return mac;
};

const shortcuts: Record<string, (editor: EditorContextType) => void> = {
  l: (editor) =>
    editor.setSideBar((b) => (b === "explorer" ? undefined : "explorer")),
  i: (editor) =>
    editor.setSideBar((b) => (b === "outline" ? undefined : "outline")),
  n: (editor) => {
    editor.newNote({ text: "New note" });
    editor.setRollHashTag("");
  },
  s: (editor) => editor.note && saveNote(editor.note, editor.storage.pouch),
  o: async (editor) => {
    const text = (await openFile()) as string;
    editor.newNote({ text });
  },
  b: async (editor) => {
    const notes: Record<string, SavedNote> = {};
    for (const meta of editor.storage.notes) {
      const id = meta.id;
      const savedNote = await editor.storage.getNote(id);
      if (savedNote) {
        notes[id] = savedNote;
      }
    }
    zipIt(editor.storage.notes, notes, editor.storage.pouch);
  },
};

const useShortcuts = (editor: EditorContextType) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isWindowShortcut(e)) {
        if (shortcuts[e.key]) {
          e.preventDefault();
          e.stopPropagation();
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
