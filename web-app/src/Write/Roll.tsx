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
import { withHistory } from "slate-history";
import { withReact } from "slate-react";
import { createEditor } from "slate";
import { CustomEditor } from "../comps/MEditor";
import Button from "../comps/Button";
import { TbExternalLink } from "react-icons/tb";

const getEditor = () => withHistory(withReact(createEditor()));

type NoteState = {
  note: Note;
  editor: CustomEditor;
};

const Roll = () => {
  const { setFocusMode, user } = useContext(AppContext);
  const notesApi = useFetch<Note[]>();
  const [noteStates, setNotes] = useState<NoteState[]>([]);
  const [params] = useSearchParams();
  const hashtag = useMemo(() => params.get("hashtag"), [params]);
  const containerRef = useRef<HTMLDivElement>(null);
  const newApi = useFetch<Note>();
  const scroll = useMiddle(containerRef, [noteStates], {
    active: true,
    editor: noteStates.length
      ? noteStates[noteStates.length - 1].editor
      : undefined,
  });

  useEffect(() => {
    if (newApi.response) {
      addNotes([{ note: newApi.response, editor: getEditor() }]);
    }
  }, [newApi.response]);

  useEffect(() => {
    setFocusMode(true);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      setFocusMode(false);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [user]);

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
      addNotes(
        notesApi.response.map((note) => ({ note, editor: getEditor() }))
      );
    }
  }, [notesApi.response]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.metaKey && e.shiftKey && e.key === "n") {
      handleNew();
      e.preventDefault();
    }
  };

  const addNotes = (newNotes: NoteState[]) => {
    if (document.body.scrollTop === 0) {
      document.body.scrollTo({
        top: 1,
      });
    }
    setNotes((_notes) => {
      const allNotes = [..._notes, ...newNotes];
      allNotes.sort((a, b) => a.note.created_at - b.note.created_at);
      return allNotes;
    });
  };

  const handleLastNoteChange = () => {
    scroll.scroll();
  };

  const handleNew = () => {
    if (user) {
      let text = `My note - ${new Date().toLocaleString()}`;
      if (hashtag) {
        text = `#${hashtag}\n\n` + text;
      }
      newApi.handle(
        fetch(`${API_HOST}/note`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            title: "",
            text,
          }),
        })
      );
    }
  };

  return (
    <div style={{ ...scroll.style }}>
      <div ref={containerRef}>
        {noteStates.map((noteState, i) => (
          <div key={i} className="mb-10 group">
            <div
              className={classNames(
                "flex justify-end text-xs font-CourierPrime italic opacity-20 group-hover:opacity-50"
              )}
            >
              {moment(new Date(noteState.note.created_at)).format("MMM Do YY")}
            </div>
            <NoteWriter
              key={i}
              note={noteState.note}
              typeWriter={false}
              onNoteChange={
                i === noteStates.length - 1 ? handleLastNoteChange : undefined
              }
              editor={noteState.editor}
            />
            {
              <div
                className={classNames(
                  "invisible group-hover:visible flex items-center space-x-2"
                )}
              >
                <span className="opacity-10 ">•••</span>
                <Button
                  href={`/write/${noteState.note.id}`}
                  target="_blank"
                  lite
                  link
                >
                  <TbExternalLink />
                </Button>
              </div>
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roll;
