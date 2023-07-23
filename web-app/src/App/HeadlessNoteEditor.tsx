import { useContext } from "react";
import NoteEditor from "./NoteEditor";
import useMemoAsync from "./useMemoAsync";
import { EditorContext } from "./Context";
import { Descendant } from "slate";
import { CustomEditor } from "./Core/Core";

const HeadlessNoteEditor = ({
  noteId,
  scrollContainerId,
}: {
  noteId: string;
  scrollContainerId?: string;
}) => {
  const { storage } = useContext(EditorContext);
  const note = useMemoAsync(async () => {
    return storage.getNote(noteId);
  }, [noteId]);

  const handleChange = ({
    text,
    serialized,
    editor,
  }: {
    value: Descendant[];
    text: string;
    serialized: string;
    editor: CustomEditor;
  }) => {
    if (note) {
      const _note = { ...note };
      _note.serialized = serialized;
      _note.text = text;

      storage.saveNote(_note);
    }
  };

  if (!note) return null;

  return (
    <NoteEditor
      onChange={handleChange}
      note={note}
      scrollContainerId={scrollContainerId}
    />
  );
};

export default HeadlessNoteEditor;
