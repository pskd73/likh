import { useContext, useEffect, useRef, useState } from "react";
import { EditorContext } from "src/App/Context";
import { useMiddle } from "src/comps/useMiddle";
import { CustomEditor } from "src/App/Core/Core";
import { textToTitle } from "src/Note";
import { useTitle } from "src/comps/useTitle";
import NoteEditor from "./NoteEditor";
import { SavedNote } from "./type";
import { TabsContext } from "./Tabs";

const NoteTab = ({ noteId }: { noteId: string }) => {
  const { setTitle } = useTitle();
  const { setTitle: setTabTitle } = useContext(TabsContext);
  const ref = useRef<HTMLDivElement>(null);
  const [note, setNote] = useState<SavedNote | null>();
  const {
    allNotes,
    updateNote,
    typewriterMode,
  } = useContext(EditorContext);
  const scroll = useMiddle(ref, [typewriterMode], {
    typeWriter: typewriterMode,
  });

  useEffect(() => {
    if (!note && noteId) {
      const note = allNotes[noteId];
      if (note) {
        setNote(note);
        const title = textToTitle(note.text);
        setTabTitle(window.location.pathname, title);
      }
    }
  }, [noteId, allNotes]);

  useEffect(() => {
    if (typewriterMode) {
      scroll.scroll({ force: true });
    }
  }, [typewriterMode]);

  const handleChange = ({
    text,
    serialized,
    editor,
  }: {
    text: string;
    serialized: string;
    editor: CustomEditor;
  }) => {
    if (note) {
      const updatedNote = allNotes[note.id];
      const changed = updatedNote.text.length !== text.length;
      updatedNote.text = text;
      updatedNote.serialized = serialized;
      updateNote(updatedNote);

      scroll.update();
      if (changed) {
        scroll.scroll({ editor });
      }
    }
  };

  if (!note) return null;

  return (
    <NoteEditor
      onChange={handleChange}
      note={note}
      scrollContainerId={"body"}
    />
  );
};

export default NoteTab;
