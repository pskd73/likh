import { useCallback, useEffect } from "react";
import { EditorContextType } from "./Context";
import { openFile, saveNote, zipIt } from "./File";
import { SavedNote } from "./type";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { isMac, isWindows } from "./device";

const isWindowShortcut = (e: KeyboardEvent) => {
  const mac = e.metaKey && e.ctrlKey;
  const windows = e.altKey && e.ctrlKey;

  return mac || windows;
};

const shortcuts: Record<
  string,
  (editor: EditorContextType, navigate: NavigateFunction) => void
> = {
  l: (editor) =>
    editor.setSideBar((b) => (b === "explorer" ? undefined : "explorer")),
  n: (editor, navigate) => {
    const note = editor.newNote({
      text: `# A title for the note\nWrite your mind here ...`,
    });
    navigate(`/write/note/${note!.id}`);
  },
  s: (editor) => editor.note && saveNote(editor.note, editor.storage.pouch),
  o: async (editor, navigate) => {
    const text = (await openFile()) as string;
    const note = editor.newNote({ text });
    navigate(`/write/note/${note!.id}`);
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
  h: (editor, navigate) => navigate("/write"),
  v: (editor) => {
    editor.setSideBar((b) => "explorer");
    setTimeout(() => {
      document.getElementById("search")?.focus();
    }, 200);
  },
};

const useShortcuts = (editor: EditorContextType) => {
  const navigate = useNavigate();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isWindowShortcut(e)) {
        if (shortcuts[e.key]) {
          e.preventDefault();
          e.stopPropagation();
          shortcuts[e.key](editor, navigate);
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

export const getShortcutText = (key: string) => {
  let prefix = "";
  if (isMac()) {
    prefix = "⌘⌃";
  }
  if (isWindows()) {
    prefix = "Ctrl Alt ";
  }
  return prefix + key.toUpperCase();
};

export default useShortcuts;
