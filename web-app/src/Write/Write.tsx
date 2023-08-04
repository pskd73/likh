import { useContext, useEffect, useState } from "react";
import { AppContext } from "../components/AppContext";
import { Note } from "../type";
import useFetch from "../useFetch";
import { API_HOST } from "../config";
import { useParams } from "react-router-dom";
import TextCounter from "./TextCounter";
import GoalTracker from "./GoalTracker";
import { FullLoader } from "../comps/Loading";
import { Helmet } from "react-helmet";
import { getNoteTitle } from "../Note";
import {
  BiCool,
  BiCrosshair,
  BiTimeFive,
  BiVerticalCenter,
  BiVerticalTop,
} from "react-icons/bi";
import { VscWholeWord } from "react-icons/vsc";
import Button from "../comps/Button";
import classNames from "classnames";
import NoteWriter from "./NoteWriter";

const Write = () => {
  const noteApi = useFetch<Note>();
  const { user, focusMode, setFocusMode, setTextMetricType, textMetricType } =
    useContext(AppContext);
  const [note, setNote] = useState<Note>();
  const { noteId } = useParams();
  const [typeWriter, setTypeWriter] = useState(true);

  useEffect(() => {
    setFocusMode(true);
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

  const handleFocus = () => {
    setFocusMode((f) => !f);
  };

  if (noteApi.loading) {
    return <FullLoader />;
  }

  return (
    <div className="h-full">
      {note && (
        <>
          <Helmet>
            <title>{getNoteTitle(note)} - RetroNote</title>
          </Helmet>
          <NoteWriter
            note={note}
            onNoteChange={(note) => setNote(note)}
            typeWriter={typeWriter}
          />
          <div className="fixed bottom-0 right-0 px-4 py-2 flex space-x-2">
            <Button
              onClick={() => setTypeWriter((t) => !t)}
              className="text-sm"
              lite
            >
              {typeWriter ? <BiVerticalTop /> : <BiVerticalCenter />}
            </Button>
            <GoalTracker note={note} />
            <Button
              lite
              className={classNames(
                "flex items-center space-x-2 justify-center",
                {
                  "w-16": textMetricType === "words",
                  "w-20": textMetricType === "readTime",
                }
              )}
              onClick={() =>
                setTextMetricType((old) =>
                  old === "words" ? "readTime" : "words"
                )
              }
            >
              {textMetricType === "words" ? <VscWholeWord /> : <BiTimeFive />}{" "}
              <span className="text-sm">
                <TextCounter note={note} />
              </span>
            </Button>
            <Button lite onClick={handleFocus}>
              {focusMode ? <BiCool /> : <BiCrosshair />}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Write;
