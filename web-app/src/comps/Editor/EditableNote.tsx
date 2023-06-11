import { Descendant } from "slate";
import MEditor, { Suggestion } from "./MEditor";
import { useContext, useEffect, useState } from "react";
import { EditorContext } from "./Context";

const EditableNote = ({
  getSuggestions,
}: {
  getSuggestions: (prefix: string, term: string) => Suggestion[];
}) => {
  const { note, updateNote, typewriterMode, storage, setOrNewNote } =
    useContext(EditorContext);
  const [editorKey, setEditorKey] = useState<number>(new Date().getTime());

  const handleChange = ({
    text,
    serialized,
  }: {
    value: Descendant[];
    text: string;
    serialized: string;
  }) => {
    const updatedNote = { ...note };
    updatedNote.text = text;
    updatedNote.serialized = serialized;
    updateNote(updatedNote);
  };

  useEffect(() => {
    setEditorKey(new Date().getTime());
  }, [note.id]);

  const handleNoteLinkClick = (title: string, id?: string) => {
    if (id) {
      const note = storage.getNote(id);
      if (note) {
        updateNote(note);
        return;
      }
    }
    setOrNewNote(title);
  };

  return (
    <MEditor
      key={editorKey}
      onChange={handleChange}
      initValue={note.serialized}
      initText={note.text}
      typeWriter={typewriterMode}
      onNoteLinkClick={handleNoteLinkClick}
      getSuggestions={getSuggestions}
    />
  );
};

export default EditableNote;
