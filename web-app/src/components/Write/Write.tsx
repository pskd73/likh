import { useContext, useEffect } from "react";
import { AppContext } from "../AppContext";
import Editor from "./Editor";
import { Note } from "../../type";
import SideBar from "./SideBar";
import WriteToolbar from "./Toolbar";
import useFetch from "../../useFetch";
import { API_HOST } from "../../config";

const Write = () => {
  const notesFetch = useFetch<Note[]>();
  const saveFetch = useFetch();
  const { note, setNote, focusMode, user, setNotes } =
    useContext(AppContext);

  useEffect(() => {
    if (user) {
      notesFetch.handle(
        fetch(`${API_HOST}/notes`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
      );
    }
  }, [user]);

  useEffect(() => {
    if (notesFetch.response) {
      const coll: Record<string, Note> = {};
      for (const note of notesFetch.response) {
        coll[note.id] = note;
      }
      setNotes(coll);
      setNote(notesFetch.response[notesFetch.response.length - 1]);
    }
  }, [notesFetch.response]);

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
      <div className="flex">
        <div className="flex-1 p-4">
          {note && <Editor note={note} onChange={handleNoteChange} />}
        </div>
        {!focusMode && (
          <div className="w-4/12">
            <SideBar />
          </div>
        )}
      </div>
      <WriteToolbar />
    </div>
  );
};

export default Write;
