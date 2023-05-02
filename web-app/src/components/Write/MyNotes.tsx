import { useContext, useEffect, useMemo } from "react";
import { AppContext } from "../AppContext";
import Clickable from "../Clickable";
import useFetch from "../../useFetch";
import { API_HOST } from "../../config";
import { Note } from "../../type";

const MyNotes = () => {
  const { notes, setNote, user, setNotes } = useContext(AppContext);
  const deleteFetch = useFetch<Note>();

  useEffect(() => {
    if (deleteFetch.response) {
      const newNotes = { ...notes };
      delete newNotes[deleteFetch.response.id];
      setNotes(newNotes);
      setNote(Object.values(newNotes)[Object.keys(newNotes).length - 1]);
    }
  }, [deleteFetch.response]);

  const handleDeleteNote = (id: string) => {
    deleteFetch.handle(
      fetch(`${API_HOST}/delete-note`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user!.token}`,
        },
        body: JSON.stringify({
          note_id: id,
        }),
      })
    );
  };

  return (
    <div>
      My notes
      <br />
      -------
      {notes && (
        <ul className="space-y-2">
          {Object.values(notes).map((note, i) => (
            <li key={i} className="flex">
              <div className="mr-2">{i + 1}.</div>
              <div>
                <Clickable>
                  <span onClick={() => setNote(note)}>{note.title}</span>
                </Clickable>
                <div>
                  <Clickable lite>
                    <span
                      className="text-sm"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      delete
                    </span>
                  </Clickable>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyNotes;
