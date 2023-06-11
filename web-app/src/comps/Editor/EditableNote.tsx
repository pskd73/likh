import { Descendant } from "slate";
import MEditor, { Suggestion } from "./MEditor";
import { useContext, useEffect, useRef } from "react";
import { EditorContext } from "./Context";
import { useMiddle } from "../useMiddle";
import { CustomEditor } from "./Core/Core";
import classNames from "classnames";
import moment from "moment";
import { BiPlus } from "react-icons/bi";
import Button from "../Button";

const EditableNote = ({
  getSuggestions,
}: {
  getSuggestions: (prefix: string, term: string) => Suggestion[];
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const {
    notes,
    note,
    updateNote,
    typewriterMode,
    storage,
    setOrNewNote,
    isRoll,
    newNote,
    rollHashTag,
    setNotes,
  } = useContext(EditorContext);
  const scroll = useMiddle(ref, [typewriterMode], {
    typeWriter: typewriterMode,
  });

  useEffect(() => {
    if (!isRoll) {
      scroll.scrollToTop();
    } else {
      scroll.scroll({ force: true });
    }
  }, [note.id, isRoll]);

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
    updateNote(updatedNote, false);

    scroll.update();
    if (id === note.id) {
      scroll.scroll({ editor });
    }
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

  const handleNewRollNote = () => {
    newNote(
      {
        text: `${rollHashTag}\n\nWrite your journal ...`,
      },
      false
    );
  };

  return (
    <div ref={ref} style={{ ...scroll.style }} className="space-y-6">
      {Object.keys(notes).map((id) => (
        <div id={`note-${id}`}>
          {isRoll && (
            <div
              className={classNames(
                "flex justify-end text-sm",
                "border-b border-primary-700 mb-4 pb-2",
                "border-opacity-10 opacity-50"
              )}
            >
              {moment(new Date(notes[id].created_at)).format(
                "MMMM Do YYYY, h:mm:ss a"
              )}
            </div>
          )}
          <MEditor
            key={id}
            onChange={(v) => handleChange(id, v)}
            initValue={notes[id].serialized}
            initText={notes[id].text}
            onNoteLinkClick={handleNoteLinkClick}
            getSuggestions={getSuggestions}
          />
        </div>
      ))}
      {isRoll && (
        <div>
          <Button
            className="flex items-center space-x-1 text-sm"
            onClick={handleNewRollNote}
          >
            <BiPlus />
            <span>New note</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditableNote;
