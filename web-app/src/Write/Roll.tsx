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

const Roll = () => {
  const { setFocusMode, user } = useContext(AppContext);
  const notesApi = useFetch<Note[]>();
  const [notes, setNotes] = useState<Note[]>([]);
  const [params] = useSearchParams();
  const hashtag = useMemo(() => params.get("hashtag"), [params]);
  const containerRef = useRef<HTMLDivElement>(null);
  const scroll = useMiddle(containerRef, []);

  useEffect(() => {
    setFocusMode(true);
    return () => setFocusMode(false);
  });

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
      setTimeout(() => {
        document.body.scrollTo({
          top: 10000000,
        });
      }, 10);
    }

    document.body.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [notesApi.response]);

  const handleScroll = () => {
    if (document.body.scrollTop < 500) {
      // const newEditors = [];
      // for (let i = 0; i < 100; i++) {
      //   newEditors.push({
      //     noteId: editors.length + i,
      //     editor: withHistory(withReact(createEditor())),
      //   });
      // }
      // handleAdd(newEditors);
      // fetch more here
    }
  };

  const addNotes = (newNotes: Note[]) => {
    if (document.body.scrollTop === 0) {
      document.body.scrollTo({
        top: 1,
      });
    }
    setNotes((_notes) => {
      const allNotes = [..._notes, ...newNotes];
      allNotes.sort((a, b) => b.created_at - a.created_at);
      return allNotes;
    });
  };

  return (
    <div style={{ ...scroll.style }}>
      <div ref={containerRef} className="flex flex-col-reverse">
        {notes.map((note, i) => (
          <div key={i} className="mb-10 group">
            <div className="flex justify-end text-xs font-CourierPrime italic opacity-50">
              {moment(new Date(note.created_at)).format("MMM Do YY")}
            </div>
            <NoteWriter key={i} note={note} typeWriter={false} />
            <div className="opacity-10 invisible group-hover:visible">•••</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roll;
