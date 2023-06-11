import { Descendant } from "slate";
import MEditor, { Suggestion } from "./MEditor";
import { useContext } from "react";
import { EditorContext } from "./Context";

const EditableNote = ({
  getSuggestions,
}: {
  getSuggestions: (prefix: string, term: string) => Suggestion[];
}) => {
  const { notes, updateNote, typewriterMode, storage, setOrNewNote } =
    useContext(EditorContext);

  const handleChange = (
    id: string,
    {
      text,
      serialized,
    }: {
      value: Descendant[];
      text: string;
      serialized: string;
    }
  ) => {
    const updatedNote = { ...notes[id] };
    updatedNote.text = text;
    updatedNote.serialized = serialized;
    updateNote(updatedNote);
  };

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
    <>
      {Object.keys(notes).map((id) => (
        <MEditor
          key={id}
          onChange={(v) => handleChange(id, v)}
          initValue={notes[id].serialized}
          initText={notes[id].text}
          typeWriter={typewriterMode}
          onNoteLinkClick={handleNoteLinkClick}
          getSuggestions={getSuggestions}
        />
      ))}
    </>
  );
};

export default EditableNote;
