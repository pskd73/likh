import { useContext, useEffect, useRef } from "react";
import { EditorContext } from "src/App/Context";
import { useMiddle } from "src/comps/useMiddle";
import { CustomEditor } from "src/App/Core/Core";
import NoteEditor from "./NoteEditor";

const NoteTab = ({ noteId }: { noteId: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const {
    allNotes,
    updateNote,
    typewriterMode,
  } = useContext(EditorContext);
  const scroll = useMiddle(ref, [typewriterMode], {
    typeWriter: typewriterMode,
  });

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
    if (noteId) {
      const updatedNote = allNotes[noteId];
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

  if (!allNotes[noteId]) return null;

  return (
    <NoteEditor
      onChange={handleChange}
      note={allNotes[noteId]}
      scrollContainerId={"body"}
    />
  );
};

export default NoteTab;
