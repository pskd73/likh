import { useContext, useEffect, useMemo, useRef } from "react";
import { AppContext } from "../components/AppContext";
import { useState } from "react";
import { API_HOST } from "../config";
import { Note } from "../type";
import useFetch from "../useFetch";
import NoteWriter from "./NoteWriter";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import { useMiddle } from "../comps/useMiddle";
import classNames from "classnames";
import Button from "../comps/Button";
import { BiPlus } from "react-icons/bi";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";
import { createEditor } from "slate";

const Roll = () => {
  const { setFocusMode, user } = useContext(AppContext);
  const notesApi = useFetch<Note[]>();
  const [notes, setNotes] = useState<Note[]>([]);
  const [params] = useSearchParams();
  const hashtag = useMemo(() => params.get("hashtag"), [params]);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastEditor = useMemo(
    () => withHistory(withReact(createEditor())),
    [notes]
  );
  const newApi = useFetch<Note>();
  const scroll = useMiddle(containerRef, [notes], {
    active: true,
    editor: lastEditor,
  });

  useEffect(() => {
    if (newApi.response) {
      addNotes([newApi.response]);
    }
  }, [newApi.response]);

  useEffect(() => {
    setFocusMode(true);
    return () => setFocusMode(false);
  }, []);

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
  }, [user]);

  useEffect(() => {
    if (notesApi.response) {
      addNotes(notesApi.response);
    }
  }, [notesApi.response]);

  const addNotes = (newNotes: Note[]) => {
    if (document.body.scrollTop === 0) {
      document.body.scrollTo({
        top: 1,
      });
    }
    setNotes((_notes) => {
      const allNotes = [..._notes, ...newNotes];
      allNotes.sort((a, b) => a.created_at - b.created_at);
      return allNotes;
    });
  };

  const handleLastNoteChange = () => {
    scroll.scroll();
  };

  const handleNew = () => {
    if (user) {
      newApi.handle(
        fetch(`${API_HOST}/note`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            title: "",
            text: `My note - ${new Date().toLocaleString()}`,
          }),
        })
      );
    }
  };

  return (
    <div style={{ ...scroll.style }}>
      <div ref={containerRef}>
        {notes.map((note, i) => (
          <div key={i} className="mb-10 group">
            <div className="flex justify-end text-xs font-CourierPrime italic opacity-50">
              {moment(new Date(note.created_at)).format("MMM Do YY")}
            </div>
            <NoteWriter
              key={i}
              note={note}
              typeWriter={false}
              onNoteChange={
                i === notes.length - 1 ? handleLastNoteChange : undefined
              }
              editor={i === notes.length - 1 ? lastEditor : undefined}
            />
            <div
              className={classNames("opacity-10 invisible", {
                "group-hover:visible": i !== notes.length - 1,
              })}
            >
              •••
            </div>
            {i === notes.length - 1 && (
              <div className="flex justify-end">
                <Button lite onClick={handleNew}>
                  <BiPlus />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roll;
