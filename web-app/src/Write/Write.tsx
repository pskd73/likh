import { useContext, useEffect, useState } from "react";
import { AppContext } from "../components/AppContext";
import Editor from "../components/Write/Editor";
import { Note } from "../type";
import useFetch from "../useFetch";
import { API_HOST } from "../config";
import { useParams } from "react-router-dom";
import TextCounter from "./TextCounter";
import GoalTracker from "./GoalTracker";
import Clickable from "../components/Clickable";

const Write = () => {
  const noteApi = useFetch<Note>();
  const saveFetch = useFetch();
  const { user, focusMode, setFocusMode } = useContext(AppContext);
  const [note, setNote] = useState<Note>();
  const { noteId } = useParams();

  useEffect(() => {
    return () => setFocusMode(false);
  }, []);

  useEffect(() => {
    if (noteApi.response) {
      setNote(noteApi.response);
    }
  }, [noteApi.response]);

  useEffect(() => {
    if (user) {
      noteApi.handle(
        fetch(`${API_HOST}/note?note_id=${noteId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
      );
    }
  }, [noteId, user]);

  const handleNoteChange = (newNote: Note) => {
    setNote(newNote);
    saveFetch.handle(
      fetch(`${API_HOST}/note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user!.token}`,
        },
        body: JSON.stringify({
          id: newNote.id,
          title: newNote.title,
          text: newNote.text,
        }),
      })
    );
  };

  const handleFocus = () => {
    setFocusMode((f) => !f);
  };

  return (
    <div className="h-full">
      {note && (
        <>
          <Editor note={note} onChange={handleNoteChange} />
          <div className="fixed bottom-0 right-0 p-2 flex space-x-4">
            <GoalTracker note={note} />
            <span className="opacity-50">
              <TextCounter note={note} />
            </span>
            <Clickable lite onClick={handleFocus}>
              {focusMode ? "relax" : "focus"}
            </Clickable>
          </div>
        </>
      )}
    </div>
  );
};

export default Write;
