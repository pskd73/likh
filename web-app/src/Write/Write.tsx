import { useContext, useEffect, useState } from "react";
import { AppContext } from "../components/AppContext";
import Editor from "../components/Write/Editor";
import { Note } from "../type";
import useFetch from "../useFetch";
import { API_HOST } from "../config";
import { useParams } from "react-router-dom";

const Write = () => {
  const noteApi = useFetch<Note>();
  const saveFetch = useFetch();
  const [note, setNote] = useState<Note>();
  const { user } = useContext(AppContext);
  const { noteId } = useParams();

  useEffect(() => {
    if (!noteId) {
      console.log("create note");
    }
  }, [noteId]);

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

  return (
    <div className="h-full">
      {note && <Editor note={note} onChange={handleNoteChange} />}
    </div>
  );
};

export default Write;
