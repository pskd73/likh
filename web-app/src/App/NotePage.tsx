import { useContext, useEffect, useRef } from "react";
import { EditorContext } from "src/App/Context";
import { useMiddle } from "src/comps/useMiddle";
import { CustomEditor } from "src/App/Core/Core";
import classNames from "classnames";
import { textToTitle } from "src/Note";
import { useParams } from "react-router-dom";
import { useTitle } from "src/comps/useTitle";
import NoteEditor from "./NoteEditor";

const NotePage = () => {
  const { setTitle } = useTitle();
  const { noteId } = useParams();
  const ref = useRef<HTMLDivElement>(null);
  const {
    allNotes,
    note,
    updateNote,
    typewriterMode,
    isRoll,
    searchTerm,
    setNote,
    setNoteIds,
  } = useContext(EditorContext);
  const scroll = useMiddle(ref, [typewriterMode], {
    typeWriter: typewriterMode,
  });

  useEffect(() => {
    if (noteId) {
      const container = document.getElementById("page-container");
      container!.style.transition = "opacity 0.1s";
      container!.style.opacity = "0";
      setTimeout(() => {
        setNote({ id: noteId });
      }, 100);
      setTimeout(() => {
        container!.style.opacity = "1";
      }, 400);
    }

    return () => {
      setNoteIds({});
    };
  }, [noteId]);

  useEffect(() => {
    if (note) {
      setTitle(textToTitle(note.text) || "RetroNote");
    }
  }, [note]);

  useEffect(() => {
    if (searchTerm) {
      setTimeout(() => {
        scroll.scrollTo({ className: "highlight" });
      }, 100);
      return;
    }

    if (!isRoll) {
      scroll.scrollToTop();
    } else {
      scroll.scroll({ force: true });
    }
  }, [note?.id, isRoll, searchTerm]);

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
    <div
      ref={ref}
      key={note.id}
      style={{ ...scroll.style }}
      className={classNames("space-y-6 md:px-20")}
    >
      <NoteEditor
        onChange={handleChange}
        note={note}
        scrollContainerId={"body"}
      />
    </div>
  );
};

export default NotePage;
