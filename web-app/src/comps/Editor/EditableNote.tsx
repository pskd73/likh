import { Descendant } from "slate";
import Editor, { Suggestion } from "./Core/Slate/Editor";
import { useContext, useEffect, useRef } from "react";
import { EditorContext } from "./Context";
import { useMiddle } from "../useMiddle";
import { CustomEditor } from "./Core/Core";
import classNames from "classnames";
import moment from "moment";
import { BiPlus } from "react-icons/bi";
import Button from "../Button";
import { scrollTo } from "./scroll";
import { getImage } from "./db";
import { Themes } from "./Theme";
import { blobToB64 } from "../../util";
import { textToTitle } from "../../Note";
import { getGoogleCalendarLink } from "./Reminder";
import { FiExternalLink } from "react-icons/fi";
import { SavedNote } from "./type";
import { useNavigate, useParams } from "react-router-dom";
import Event from "../../components/Event";

const dtToIso = (dt: Date) => {
  return moment(dt).format("YYYY-MM-DDThh:mm:ss");
};

const EditableNote = () => {
  const { noteId, hashtag } = useParams();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const {
    notes,
    note,
    updateNote,
    typewriterMode,
    storage,
    setOrNewNote,
    isRoll,
    newNote,
    rollHashTag,
    searchTerm,
    themeName,
    setNote,
    getHashtags,
    setRollHashTag,
  } = useContext(EditorContext);
  const scroll = useMiddle(ref, [typewriterMode], {
    typeWriter: typewriterMode,
  });

  useEffect(() => {
    if (noteId) {
      setRollHashTag("");
      setNote({ id: noteId });
    }
    if (hashtag) {
      setRollHashTag(decodeURIComponent(hashtag));
    }
  }, [noteId, hashtag]);

  useEffect(() => {
    if (searchTerm) {
      setTimeout(() => {
        scroll.scrollTo({ className: "highlight" });
      }, 100);
      return;
    }

    if (!isRoll) {
      scroll.scrollToTop();
    } else {
      scroll.scroll({ force: true });
    }
  }, [note?.id, isRoll, searchTerm]);

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
    const updatedNote = { ...notes[id] };
    updatedNote.text = text;
    updatedNote.serialized = serialized;
    updateNote(updatedNote);

    scroll.update();
    if (id === note?.id) {
      scroll.scroll({ editor });
    }
  };

  const handleNoteLinkClick = async (title: string, id?: string) => {
    Event.track("new_linked_note");
    if (id) {
      const note = await storage.getNote(id);
      if (note) {
        navigate(`/write/note/${note.id}`);
        return;
      }
    }
    const note = await setOrNewNote(title);
    navigate(`/write/note/${note.id}`);
  };

  const handleNewRollNote = () => {
    Event.track("new_roll_note");
    const savedNote = newNote(
      {
        text: `${rollHashTag}\nWrite your journal ...`,
      },
      false
    );
    scrollTo({ noteId: savedNote!.id });
  };

  const getSuggestions = async (prefix: string, term: string) => {
    const suggestions: Suggestion[] = [];
    if (prefix === "[[") {
      for (const noteMeta of storage.notes) {
        if (noteMeta.id === note?.id) continue;
        const _note = await storage.getNote(noteMeta.id);
        if (_note) {
          const title = textToTitle(_note.text, 50);
          if (title.toLowerCase().includes(term.toLowerCase())) {
            const cleanedTitle = title.trim();
            suggestions.push({
              title: cleanedTitle,
              id: _note.id,
              replace: `[[${cleanedTitle}]](${_note.id}) `,
            });
          }
        }
      }
    } else if (prefix === "#") {
      Object.keys(getHashtags([note!.id])).forEach((hashtag) => {
        const tag = hashtag.replace("#", "");
        if (term === tag) return;
        if (tag.toLowerCase().includes(term.toLocaleLowerCase())) {
          suggestions.push({
            title: `${hashtag}`,
            replace: `${hashtag} `,
          });
        }
      });
    } else if (prefix === "@") {
      const amPmMatch = term.match(/(\d+)([ap]m)/);
      if (amPmMatch) {
        let tfHour = Number(amPmMatch[1]);
        if (amPmMatch[2] === "pm") {
          tfHour += 12;
        }
        const now = new Date();
        let dt = moment(now).hour(tfHour).minute(0).second(0);
        if (dt.isBefore(now)) {
          dt = dt.add(1, "days");
        }
        const iso = dtToIso(dt.toDate());
        suggestions.push({
          title: `Next ${term} - ${iso}`,
          replace: `@${iso} `,
        });
      }
      if ("tomorrow".startsWith(term.toLowerCase())) {
        const dt = moment(new Date()).add(1, "day");
        const iso = dtToIso(dt.toDate());
        suggestions.push({
          title: `Tomorrow - ${iso}`,
          replace: `@${iso} `,
        });
      }
      if (term.match(/\d{4}\-\d{2}\-\d{2}/)) {
        const dt = moment(term, "YYYY-MM-DD");
        const iso = dtToIso(dt.toDate());
        suggestions.push({
          title: `${iso}`,
          replace: `@${iso} `,
        });
      }
    }
    return suggestions;
  };

  const handleDatetimeClick = (date: Date, text?: string) => {
    if (note) {
      text = text || `Continue writing "${textToTitle(note.text)}"`;
      const link = getGoogleCalendarLink({
        text,
        date: date,
        location: "https://app.retronote.app/write",
      });
      window.open(link, "_blank");
    }
  };

  const handleExpand = (note: SavedNote) => {
    navigate(`/write/note/${note.id}`);
  };

  return (
    <div ref={ref} style={{ ...scroll.style }} className="space-y-6 md:px-20">
      {Object.values(notes)
        .sort((a, b) => a.created_at - b.created_at)
        .map((_note) => {
          const id = _note.id;
          return (
            <div
              className={classNames(
                `note-date-${moment(notes[id].created_at).format(
                  "YYYY-MM-DD"
                )}`,
                `note-${id}`,
                "pt-2"
              )}
              key={id}
            >
              {isRoll && (
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
                    {moment(new Date(notes[id].created_at)).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
                  </span>
                </div>
              )}
              <Editor
                containerClassName={`note-${id}`}
                onChange={(v) => handleChange(id, v)}
                initValue={notes[id].serialized}
                initText={notes[id].text}
                onNoteLinkClick={handleNoteLinkClick}
                getSuggestions={getSuggestions}
                highlight={searchTerm}
                contextMenuPrefixes={["[[", "#", "@"]}
                getSavedImg={async (attachmentId, imgType) => {
                  if (note && imgType === "attachment") {
                    const blob = await storage.pouch.attachment(
                      id,
                      attachmentId
                    );
                    const uri = await blobToB64(blob);
                    if (uri) {
                      return { id: attachmentId, uri: uri as string };
                    }
                  }
                  const img = await getImage(Number(attachmentId));
                  return { id: attachmentId, uri: img.uri };
                }}
                handleSaveImg={async (img) => {
                  if (note) {
                    const match = img.uri.match(/^data:(.+);base64,(.+)$/);
                    if (match) {
                      const id = new Date().getTime().toString();
                      await storage.pouch.attach(note.id, {
                        id,
                        data: match[2],
                        type: match[1],
                      });
                      return { id, uri: img.uri };
                    }
                  }
                }}
                theme={Themes[themeName] || Themes.Basic}
                onDatetimeClick={handleDatetimeClick}
              />
            </div>
          );
        })}
      {isRoll && (
        <div>
          <Button
            className="flex items-center space-x-1 text-sm"
            onClick={handleNewRollNote}
          >
            <BiPlus />
            <span>New note</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditableNote;
