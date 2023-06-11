import { useCallback, useEffect } from "react";
import { EditorContextType } from "./Context";
import { openFile, saveNote } from "./File";
import { zipIt } from "./Backup/Zip";
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
  s: (editor) => saveNote(editor.note),
  o: async (editor) => {
    const text = (await openFile()) as string;
    editor.newNote({ text });
  },
  b: (editor) => {
    const notes: Record<string, SavedNote> = {};
    for (const meta of editor.storage.notes) {
      const id = meta.id;
      const savedNote = editor.storage.getNote(id);
      if (savedNote) {
        notes[id] = savedNote;
      }
    }
    zipIt(editor.storage.notes, notes);
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
