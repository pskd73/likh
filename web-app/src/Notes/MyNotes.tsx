import { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../components/AppContext";
import Clickable from "../components/Clickable";
import useFetch from "../useFetch";
import { API_HOST, PUBLIC_HOST } from "../config";
import { Note } from "../type";
import moment from "moment";
import { Select } from "../comps/Form";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { FullLoader } from "../comps/Loading";
import { Helmet } from "react-helmet";
import { getNoteTitle } from "../Note";
import { Hashtag } from "../Home/Hashtags";
import {
  BiCaretDownCircle,
  BiCaretUpCircle,
  BiLink,
  BiTrash,
} from "react-icons/bi";
import { MdPublic, MdPublicOff } from "react-icons/md";
import Button from "../comps/Button";
import { Header } from "../comps/Typo";
import Calendar from "../comps/Calendar";

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

const Delete = ({ onConfirm }: { onConfirm: () => void }) => {
  const [confirm, setConfirm] = useState(false);

  const handleDelete = () => {
    setConfirm(true);
  };

  const handleConfirm = (confirm: boolean) => {
    if (confirm) {
      onConfirm();
    }
    setConfirm(false);
  };

  return !confirm ? (
    <Button lite onClick={handleDelete}>
      <BiTrash />
    </Button>
  ) : (
    <span className="space-x-2 text-xs px-2">
      <span className="opacity-50">Are you sure?</span>
      <Button onClick={() => handleConfirm(true)}>Yes</Button>
      <Button onClick={() => handleConfirm(false)}>No</Button>
    </span>
  );
};

const MyNotes = () => {
  const { user } = useContext(AppContext);
  const [notes, setNotes] = useState<Record<string, Note>>({});
  const deleteFetch = useFetch<Note>();
  const notesApi = useFetch<Note[]>();
  const visibilityApi = useFetch<Note>();
  const [params] = useSearchParams();
  const hashtag = useMemo(() => params.get("hashtag"), [params]);

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
      let url = `${API_HOST}/notes?`;
      if (hashtag) {
        url += `hashtag=${hashtag}&`;
      }
      notesApi.handle(
        fetch(url, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
      );
    }
  }, [user, hashtag]);

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
    copy(`${PUBLIC_HOST}/note/${noteId}`);
  };

  if (notesApi.loading) {
    return <FullLoader />;
  }

  return (
    <div>
      <Helmet>
        <title>My notes - Retro Note</title>
      </Helmet>
      {notes && <Calendar notes={Object.values(notes)} />}
      <div className="mb-2 flex items-center space-x-2">
        <Header>My notes</Header>
        {hashtag && <Hashtag hashtag={`#${hashtag}`} />}
      </div>

      {notes && (
        <ul>
          {Object.values(notes)
            .sort((a, b) => b.created_at - a.created_at)
            .map((note, i) => (
              <li key={i} className="flex">
                <div className="w-8">{i + 1}.</div>
                <div className="w-full">
                  <Clickable>
                    <Link to={`/write/${note.id}`}>{getNoteTitle(note)}</Link>
                  </Clickable>
                  <div>
                    <span className="opacity-50 text-sm">
                      Created {moment(new Date(note.created_at)).fromNow()}
                    </span>
                  </div>

                  <div className="text-sm mb-4 flex items-center space-x-1">
                    <Button
                      onClick={() =>
                        handleVisibilityChange(
                          note.id,
                          note.visibility === "private" ? "public" : "private"
                        )
                      }
                    >
                      {note.visibility === "private" ? (
                        <MdPublic />
                      ) : (
                        <MdPublicOff />
                      )}
                    </Button>
                    <Delete onConfirm={() => handleDeleteNote(note.id)} />
                    {note.visibility === "public" && (
                      <Button lite onClick={() => handleCopy(note.id)}>
                        <BiLink />
                      </Button>
                    )}
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
