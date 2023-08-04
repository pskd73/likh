import { Descendant } from "slate";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { EditorContext } from "src/App/Context";
import { useMiddle } from "src/comps/useMiddle";
import { CustomEditor } from "src/App/Core/Core";
import classNames from "classnames";
import moment from "moment";
import { BiPlus } from "react-icons/bi";
import Button from "src/comps/Button";
import { scrollTo } from "src/App/scroll";
import { textToTitle } from "src/Note";
import { FiExternalLink } from "react-icons/fi";
import { SavedNote } from "src/App/type";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Event from "src/components/Event";
import { useTitle } from "src/comps/useTitle";
import NoteEditor from "./NoteEditor";

const RollPage = () => {
  const { setTitle } = useTitle();
  const { hashtag } = useParams();
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const {
    allNotes,
    note,
    updateNote,
    typewriterMode,
    newNote,
    setRollHashTag,
    setNoteIds,
    getHashtags,
    noteIds,
  } = useContext(EditorContext);
  const [loaded, setLoaded] = useState(false);
  const scroll = useMiddle(ref, [typewriterMode], {
    typeWriter: typewriterMode,
  });
  const notes = useMemo(
    () => Object.keys(noteIds).map((id) => allNotes[id]),
    [noteIds]
  );

  useEffect(() => {
    return () => {
      setNoteIds({});
      setRollHashTag("");
    };
  }, []);

  useEffect(() => {
    if (!loaded && hashtag && Object.keys(allNotes).length > 0) {
      setRollHashTag(decodeURIComponent(hashtag));
      const hashtags = getHashtags();
      const existingNotes = hashtags[hashtag] || [];
      const ids = existingNotes.map((note) => note.id);
      const _noteIds: Record<string, boolean> = {};
      ids.forEach((id) => {
        _noteIds[id] = true;
      });

      if (search.get("new")) {
        const now = moment(new Date());
        const shouldCreate =
          existingNotes.filter((note) =>
            moment(new Date(note.created_at)).isSame(now, "day")
          ).length === 0;

        if (shouldCreate) {
          Event.track("new_roll_note");
          const savedNote = newNote(
            {
              text: `${hashtag}\nWrite your journal ...`,
            },
            false
          );
          if (savedNote) {
            _noteIds[savedNote.id] = true;
          }
        }
      }

      setNoteIds(_noteIds);
      setLoaded(true);
    }
  }, [hashtag, allNotes]);

  useEffect(() => {
    if (hashtag) {
      setTitle(hashtag);
    } else if (note) {
      setTitle(textToTitle(note.text) || "RetroNote");
    }
  }, [note, hashtag]);

  useEffect(() => {
    setTimeout(() => {
      scroll.scroll({ force: true });
    }, 100);
  }, [notes, typewriterMode]);

  const handleChange = (
    id: string,
    {
      text,
      serialized,
      editor,
    }: {
      value: Descendant[];
      text: string;
      serialized: string;
      editor: CustomEditor;
    }
  ) => {
    const updatedNote = allNotes[id];
    updatedNote.text = text;
    updatedNote.serialized = serialized;
    updateNote(updatedNote);

    scroll.update();
    if (id === note?.id) {
      scroll.scroll({ editor });
    }
  };

  const handleNewRollNote = () => {
    Event.track("new_roll_note");
    const savedNote = newNote(
      {
        text: `${hashtag}\nWrite your journal ...`,
      },
      false
    );
    if (savedNote) {
      setNoteIds({ ...noteIds, [savedNote.id]: true });
      scrollTo({ noteId: savedNote!.id });
    }
  };

  const handleExpand = (note: SavedNote) => {
    navigate(`/write/note/${note.id}`);
  };

  if (!notes) return null;

  return (
    <div
      ref={ref}
      style={{ ...scroll.style }}
      className={classNames("space-y-6 md:px-20")}
    >
      {notes
        .sort((a, b) => a.created_at - b.created_at)
        .map((_note) => {
          const id = _note.id;
          return (
            <div
              className={classNames(
                `note-date-${moment(_note.created_at).format("YYYY-MM-DD")}`,
                `note-${id}`,
                "pt-2"
              )}
              key={id}
            >
              <div
                className={classNames(
                  "flex items-center justify-end text-sm",
                  "border-b border-primary mb-4 pb-2",
                  "border-opacity-10 opacity-50 space-x-2"
                )}
              >
                <Button lite onClick={() => handleExpand(_note)}>
                  <FiExternalLink />
                </Button>
                <span>
                  {moment(new Date(_note.created_at)).format(
                    "MMMM Do YYYY, h:mm:ss a"
                  )}
                </span>
              </div>
              <NoteEditor
                onChange={(v) => handleChange(id, v)}
                note={_note}
              />
            </div>
          );
        })}
      <div>
        <Button
          className="flex items-center space-x-1 text-sm"
          onClick={handleNewRollNote}
        >
          <BiPlus />
          <span>New note</span>
        </Button>
      </div>
    </div>
  );
};

export default RollPage;
