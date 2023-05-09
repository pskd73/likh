import { useContext, useEffect, useState } from "react";
import { AppContext } from "../components/AppContext";
import Clickable from "../components/Clickable";
import useFetch from "../useFetch";
import { API_HOST } from "../config";
import { Note } from "../type";
import moment from "moment";
import { Select } from "../comps/Form";
import { Link } from "react-router-dom";

function copy(text: string) {
  var input = document.createElement("textarea");
  input.innerHTML = text;
  document.body.appendChild(input);
  input.select();
  var result = document.execCommand("copy");
  document.body.removeChild(input);
  return result;
}

const Divider = () => <span className="opacity-50">&nbsp;•&nbsp;</span>;

const MyNotes = () => {
  const { notes, setNote, user, setNotes } = useContext(AppContext);
  const deleteFetch = useFetch<Note>();
  const notesFetch = useFetch<Note[]>();
  const visibilityApi = useFetch<Note>();
  const [expandedNotes, setExpandedNotes] = useState<string[]>([]);

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
    if (deleteFetch.response) {
      const newNotes = { ...notes };
      delete newNotes[deleteFetch.response.id];
      setNotes(newNotes);
      setNote(Object.values(newNotes)[Object.keys(newNotes).length - 1]);
    }
  }, [deleteFetch.response]);

  useEffect(() => {
    if (visibilityApi.response) {
      setNote(visibilityApi.response);
      setNotes({
        ...notes,
        [visibilityApi.response.id]: visibilityApi.response,
      });
    }
  }, [visibilityApi.response]);

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

  const handleMore = (noteId: string) => {
    setExpandedNotes((notes) => {
      const _notes = [...notes];
      if (notes.includes(noteId)) {
        _notes.splice(notes.indexOf(noteId), 1);
      } else {
        _notes.push(noteId);
      }
      return _notes;
    });
  };

  const handleVisibilityChange = (noteId: string, visibility: string) => {
    visibilityApi.handle(
      fetch(`${API_HOST}/note/visibility`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user!.token}`,
        },
        body: JSON.stringify({
          note_id: noteId,
          visibility,
        }),
      })
    );
  };

  const handleCopy = (noteId: string) => {
    copy(`https://retronote.app/note/${noteId}`);
  };

  return (
    <div>
      {notes && (
        <ul className="space-y-6">
          {Object.values(notes)
            .sort((a, b) => b.created_at - a.created_at)
            .map((note, i) => (
              <li key={i} className="flex">
                <div className="mr-2">{i + 1}.</div>
                <div className="w-full">
                  <Clickable>
                    <Link to={`/app/write/${note.id}`}>{note.title}</Link>
                  </Clickable>

                  <div className="text-sm mb-4">
                    <span className="opacity-50">
                      Created {moment(new Date(note.created_at)).fromNow()}
                    </span>
                    <Divider />
                    <Clickable
                      className="opacity-100"
                      lite
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      delete
                    </Clickable>
                    <Divider />
                    <Clickable lite onClick={() => handleMore(note.id)}>
                      {expandedNotes.includes(note.id) ? "less" : "more"}
                    </Clickable>
                  </div>

                  {expandedNotes.includes(note.id) && (
                    <div className="flex items-center mb-4">
                      <div className="mr-2">visibility</div>
                      <div className="space-x-2">
                        <Select
                          className="h-9 px-2 rounded bg-primary-700 bg-opacity-30"
                          value={note.visibility || "private"}
                          onChange={(e) =>
                            handleVisibilityChange(note.id, e.target.value)
                          }
                        >
                          <option value={"private"}>private</option>
                          <option value={"public"}>public</option>
                        </Select>
                        {note.visibility === "public" && (
                          <Clickable lite onClick={() => handleCopy(note.id)}>
                            copy link
                          </Clickable>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default MyNotes;
