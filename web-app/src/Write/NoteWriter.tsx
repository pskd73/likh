import { useContext, useRef } from "react";
import { Note } from "../type";
import { AppContext } from "../components/AppContext";
import { API_HOST } from "../config";
import useFetch from "../useFetch";
import MEditor from "../comps/Editor/MEditor";
import { CustomEditor } from "../comps/Editor/Core/Core";

const useTimer = <T extends unknown>(callback: (state: T | null) => void) => {
  const ref = useRef<NodeJS.Timeout | null>(null);
  const state = useRef<T | null>(null);

  const update = (_state: T) => {
    state.current = _state;
    if (!ref.current) {
      ref.current = setTimeout(() => {
        callback(state.current);
        ref.current = null;
      }, 1000);
    }
  };

  return {
    update,
  };
};

const NoteWriter = ({
  note,
  onNoteChange,
  typeWriter,
  editor,
}: {
  note: Note;
  typeWriter: boolean;
  onNoteChange?: (note: Note) => void;
  editor?: CustomEditor;
}) => {
  const saveFetch = useFetch();
  const { user } = useContext(AppContext);

  const timer = useTimer<Note>((_note) => {
    if (_note) {
      saveFetch.handle(
        fetch(`${API_HOST}/note`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user!.token}`,
          },
          body: JSON.stringify({
            id: _note.id,
            title: _note.title,
            text: _note.text,
            slate_value: _note.slate_value,
          }),
        })
      );
    }
  });

  const handleChange = (serialized: string, text: string) => {
    if (note) {
      const newNote = { ...note, text, slate_value: serialized };
      timer.update(newNote);
      if (onNoteChange) {
        onNoteChange(newNote);
      }
    }
  };

  return (
    <div className="text-[20px] font-CourierPrime leading-8">
      <MEditor
        onChange={({ serialized, text }) => handleChange(serialized, text)}
        key={0}
        initValue={note.slate_value}
        initText={note.text}
        typeWriter={typeWriter}
        editor={editor}
      />
    </div>
  );
};

export default NoteWriter;
