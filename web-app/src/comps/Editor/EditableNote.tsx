import { Descendant } from "slate";
import MEditor, { Suggestion } from "./MEditor";
import { useContext, useEffect, useRef } from "react";
import { EditorContext } from "./Context";
import { useMiddle } from "../useMiddle";
import { CustomEditor } from "./Core/Core";

const EditableNote = ({
  getSuggestions,
}: {
  getSuggestions: (prefix: string, term: string) => Suggestion[];
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { notes, note, updateNote, typewriterMode, storage, setOrNewNote } =
    useContext(EditorContext);
  const scroll = useMiddle(ref, [], { active: true });

  useEffect(() => {
    scroll.scrollToTop();
  }, [note.id]);

  const handleChange = (
    id: string,
    {
      text,
      serialized,
      editor,
    }: {
      value: Descendant[];
      text: string;
      serialized: string;
      editor: CustomEditor;
    }
  ) => {
    const updatedNote = { ...notes[id] };
    updatedNote.text = text;
    updatedNote.serialized = serialized;
    updateNote(updatedNote);

    scroll.update();
    scroll.scroll({ editor });
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
    <div ref={ref} style={{ ...scroll.style }}>
      {Object.keys(notes).map((id) => (
        <MEditor
          key={id}
          onChange={(v) => handleChange(id, v)}
          initValue={notes[id].serialized}
          initText={notes[id].text}
          onNoteLinkClick={handleNoteLinkClick}
          getSuggestions={getSuggestions}
        />
      ))}
    </div>
  );
};

export default EditableNote;
