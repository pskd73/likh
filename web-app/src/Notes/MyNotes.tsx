import { useContext, useEffect, useState } from "react";
import { AppContext } from "../components/AppContext";
import Clickable from "../components/Clickable";
import useFetch from "../useFetch";
import { API_HOST, HOST } from "../config";
import { Note } from "../type";
import moment from "moment";
import { Select } from "../comps/Form";
import { Link } from "react-router-dom";
import { FullLoader } from "../comps/Loading";

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
  const { user } = useContext(AppContext);
  const [notes, setNotes] = useState<Record<string, Note>>({});
  const deleteFetch = useFetch<Note>();
  const notesApi = useFetch<Note[]>();
  const visibilityApi = useFetch<Note>();
  const [expandedNotes, setExpandedNotes] = useState<string[]>([]);

  useEffect(() => {
    if (notesApi.response) {
      const coll: Record<string, Note> = {};
      for (const note of notesApi.response) {
        coll[note.id] = note;
      }
      setNotes(coll);
    }
  }, [notesApi.response]);

  useEffect(() => {
    if (user) {
      notesApi.handle(
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
    }
  }, [deleteFetch.response]);

  useEffect(() => {
    if (visibilityApi.response) {
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
    copy(`${HOST}/note/${noteId}`);
  };

  const getNoteTitle = (note: Note) => {
    if (note.title) {
      return note.title;
    }
    if (note.text) {
      return (
        note.text.replaceAll("\n", " ").substring(0, 50) +
        (note.text.length > 50 ? "..." : "")
      );
    }
    return note.title;
  };

  if (notesApi.loading) {
    return <FullLoader />;
  }

  return (
    <div>
      {notes && (
        <ul className="space-y-2">
          {Object.values(notes)
            .sort((a, b) => b.created_at - a.created_at)
            .map((note, i) => (
              <li key={i} className="flex">
                <div className="w-8">{i + 1}.</div>
                <div className="w-full">
                  <Clickable>
                    <Link to={`/app/write/${note.id}`}>
                      {getNoteTitle(note)}
                    </Link>
                  </Clickable>

                  <div className="text-sm mb-4">
                    <span className="opacity-50">
                      Created {moment(new Date(note.created_at)).fromNow()}
                    </span>
                    <Divider />
                    <span className="opacity-50">
                      {note.visibility || "private"}
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
