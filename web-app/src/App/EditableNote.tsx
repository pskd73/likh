import { BaseRange, Descendant } from "slate";
import Editor, { Suggestion } from "src/App/Core/Slate/Editor";
import { useContext, useEffect, useRef, useState } from "react";
import { EditorContext } from "src/App/Context";
import { useMiddle } from "src/comps/useMiddle";
import { CustomEditor, focusEnd } from "src/App/Core/Core";
import classNames from "classnames";
import moment from "moment";
import { BiPlus } from "react-icons/bi";
import Button from "src/comps/Button";
import { scrollTo } from "src/App/scroll";
import { getImage } from "src/App/db";
import { Themes } from "src/App/Theme";
import { blobToB64 } from "src/util";
import { textToTitle } from "src/Note";
import { FiExternalLink } from "react-icons/fi";
import { SavedNote } from "src/App/type";
import { useNavigate, useParams } from "react-router-dom";
import Event from "src/components/Event";
import { useTitle } from "src/comps/useTitle";
import grammer from "./grammer";

const EditableNote = () => {
  const { setTitle } = useTitle();
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
    plugins,
    editorFocus,
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
    if (hashtag) {
      setTitle(hashtag);
    } else if (note) {
      setTitle(textToTitle(note.text) || "Retro Note");
    }
  }, [note, hashtag]);

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

  useEffect(() => {
    if (typewriterMode) {
      scroll.scroll({ force: true });
    }
  }, [typewriterMode]);

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

    plugins.forEach(
      (plugin) => plugin.onNoteChange && plugin.onNoteChange(updatedNote)
    );

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

  const getSuggestions = async (
    prefix: string,
    term: string,
    range: BaseRange
  ) => {
    const suggestions: Suggestion[] = [];

    plugins.forEach((plugin) => {
      if (plugin.suggestions && plugin.suggestions[prefix]) {
        const config = plugin.suggestions[prefix];
        for (const sugg of config.suggest(prefix, term, note!, range)) {
          suggestions.push(sugg);
        }
      }
    });

    if (prefix === "[[") {
      const addedLinks: Record<string, boolean> = {};
      for (const noteMeta of storage.notes) {
        const _note = await storage.getNote(noteMeta.id);
        if (_note) {
          for (const match of Array.from(
            _note.text.matchAll(/\[\[([^\[]+)\]\]/g)
          )) {
            if (
              !addedLinks[match[1]] &&
              match[1].toLowerCase().includes(term.toLowerCase())
            ) {
              suggestions.push({
                title: match[1],
                id: _note.id,
                replace: `[[${match[1]}]] `,
              });
              addedLinks[match[1]] = true;
            }
          }

          if (noteMeta.id === note?.id) continue;
          const title = textToTitle(_note.text, 50);
          if (title.toLowerCase().includes(term.toLowerCase())) {
            const cleanedTitle = title.trim();
            suggestions.push({
              title: cleanedTitle,
              id: _note.id,
              replace: `[[${cleanedTitle}]] `,
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
    }
    return suggestions;
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
                focus={(note?.created_at || 0) + (editorFocus || 0)}
                contextMenuPrefixes={[
                  "[[",
                  "#",
                  ...plugins
                    .filter((p) => p.suggestions)
                    .map((p) => Object.keys(p.suggestions!))
                    .reduce((prev, cur) => [...prev, ...cur], []),
                ]}
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
                grammer={plugins
                  .filter((p) => p.grammer)
                  .map((p) => p.grammer!)
                  .reduce((prev, cur) => ({ ...prev, ...cur(prev) }), grammer)}
                leafMakers={plugins
                  .filter((p) => p.leafMaker)
                  .map((p) => p.leafMaker!)}
                elementMakers={plugins
                  .filter((p) => p.elementMaker)
                  .map((p) => p.elementMaker!)}
                blockPlaceholder={`Type "/" for options`}
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
