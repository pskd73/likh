import { ComponentProps, useContext, useMemo } from "react";
import List from "../List";
import { EditorContext } from "../Context";
import SearchInput from "./SearchInput";
import Collapsible from "../Collapsible";
import { textToTitle } from "../../../Note";
import Toggle from "../../Toggle";
import Button from "../../Button";
import classNames from "classnames";
import { FiPlus, FiUpload } from "react-icons/fi";
import { BsKeyboard } from "react-icons/bs";
import { openFile } from "../File";
import { INTRO_TEXT } from "../Intro";
import { usePWA } from "../PWA";
import { MdInstallDesktop } from "react-icons/md";
import { SavedNote } from "../type";
import moment from "moment";
import {
  BiCog,
  BiCollapseVertical,
  BiFile,
  BiFilm,
  BiHash,
  BiInfoCircle,
  BiStats,
} from "react-icons/bi";
import { isMobile } from "../device";

const NoteListItem = ({
  note,
  ...restProps
}: ComponentProps<"li"> & { note: SavedNote; active?: boolean }) => {
  return (
    <List.Item className="text-sm" {...restProps}>
      <span className="flex space-x-2">
        <span className="opacity-50 mt-1">
          <BiFile />
        </span>
        <span>{textToTitle(note.text, 50)}</span>
      </span>
      {/* <div className="py-1 flex items-center space-x-1">
        <span className="opacity-50">
          {moment(new Date(note.created_at)).fromNow()}
        </span>
      </div> */}
    </List.Item>
  );
};

const Explorer = () => {
  const {
    note,
    storage,
    showStats,
    setShowStats,
    typewriterMode,
    setTypewriterMode,
    notesToShow,
    newNote,
    updateNote,
    setSideBar,
    getHashtags,
    setNotes,
    setRollHashTag,
  } = useContext(EditorContext);
  const { install, installable } = usePWA();

  const hashtags = useMemo(() => {
    const raw = getHashtags();
    const parsed: Record<string, { id: string; title: string }[]> = {};

    for (const tag of Object.keys(raw)) {
      const notes = raw[tag];
      parsed[tag] = [];
      for (const note of notes) {
        parsed[tag].push({ id: note.id, title: textToTitle(note.text, 50) });
      }
    }

    const flatten: Array<{
      hashtag: string;
      notes: { id: string; title: string }[];
    }> = [];
    for (const tag of Object.keys(parsed)) {
      flatten.push({
        hashtag: tag,
        notes: parsed[tag],
      });
    }
    return flatten;
  }, [notesToShow, note]);

  const handleOpen = async () => {
    const text = (await openFile()) as string;
    newNote({ text });
  };

  const handleNoteClick = (note: SavedNote) => {
    if (isMobile) {
      setSideBar(undefined);
    }
    updateNote(note);
    setRollHashTag("");
  };

  const handleRoll = (hashtag: string) => {
    const hashtags = getHashtags();
    const notes = hashtags[hashtag].sort((a, b) => a.created_at - b.created_at);
    const notesMap: Record<string, SavedNote> = {};
    notes.forEach((note) => {
      notesMap[note.id] = note;
    });
    setNotes(notesMap);
    setRollHashTag(hashtag);
  };

  return (
    <>
      <div className={classNames("flex justify-between items-center ", "p-2")}>
        <div>
          <img
            src="/icons/icon-128x128.png"
            alt="Retro Note"
            className="w-8 opacity-50"
          />
        </div>
        <div className="space-x-2">
          {installable && (
            <Button
              onClick={install}
              className="text-xs h-full flex space-x-1 items-center"
            >
              <MdInstallDesktop />
              <span>Install</span>
            </Button>
          )}
          <Button onClick={() => setSideBar("shortcuts")} className="h-full">
            <BsKeyboard />
          </Button>
          <Button onClick={handleOpen} className="h-full">
            <FiUpload />
          </Button>
          <Button
            onClick={() => newNote({ text: "New note" })}
            className="h-full"
          >
            <FiPlus />
          </Button>
        </div>
      </div>

      <SearchInput />

      <Collapsible>
        {/* Notes */}
        <Collapsible.Item>
          <Collapsible.Item.Label>
            <span className="flex items-center space-x-1">
              <BiFile />
              <span>Notes</span>
            </span>
          </Collapsible.Item.Label>
          <Collapsible.Item.Content>
            <List>
              {notesToShow.map((_note, i) => (
                <NoteListItem
                  key={i}
                  note={_note}
                  onClick={() => handleNoteClick(_note)}
                  active={note.id === _note.id}
                />
              ))}
            </List>
          </Collapsible.Item.Content>
        </Collapsible.Item>

        {/* Hashtags */}
        {hashtags.map((hashtag, i) => (
          <Collapsible.Item key={i} defaultActive={false}>
            <Collapsible.Item.Label>
              <span className="flex items-center space-x-1">
                <BiHash />
                <span>{hashtag.hashtag.replace("#", "")}</span>
              </span>
            </Collapsible.Item.Label>
            <Collapsible.Item.Content>
              <List>
                {hashtag.notes.map((noteMeta, i) => {
                  const _note = storage.getNote(noteMeta.id);
                  return _note ? (
                    <NoteListItem
                      key={i}
                      note={_note}
                      onClick={() => handleNoteClick(_note)}
                      active={note.id === _note.id}
                    />
                  ) : null;
                })}
                <List.Item onClick={() => handleRoll(hashtag.hashtag)}>
                  <div className="flex items-center space-x-2">
                    <span className="opacity-50">
                      <BiFilm />
                    </span>
                    <span>Roll</span>
                  </div>
                </List.Item>
              </List>
            </Collapsible.Item.Content>
          </Collapsible.Item>
        ))}

        {/* Settings */}
        <Collapsible.Item>
          <Collapsible.Item.Label>
            <span className="flex items-center space-x-1">
              <BiCog />
              <span>Settings</span>
            </span>
          </Collapsible.Item.Label>
          <Collapsible.Item.Content>
            <List>
              <List.Item className="flex justify-between items-center">
                <div className="flex items-center space-x-1">
                  <BiStats />
                  <span>Stats</span>
                </div>
                <Toggle
                  id="stats"
                  checked={showStats}
                  onChange={(e) => setShowStats(e.target.checked)}
                />
              </List.Item>
              <List.Item className="flex justify-between items-center">
                <div className="flex items-center space-x-1">
                  <BiCollapseVertical />
                  <span>Typewriter mode</span>
                </div>
                <Toggle
                  id="typewriterMode"
                  checked={typewriterMode}
                  onChange={(e) => setTypewriterMode(e.target.checked)}
                />
              </List.Item>
              <List.Item
                className="flex justify-between items-center"
                onClick={() => newNote({ text: INTRO_TEXT })}
              >
                <div className="flex items-center space-x-1">
                  <BiInfoCircle />
                  <span>Introduction note</span>
                </div>
              </List.Item>
            </List>
          </Collapsible.Item.Content>
        </Collapsible.Item>
      </Collapsible>

      {/* Built by */}
      <div className="p-2 text-xs">
        <span className="opacity-40">Built by </span>
        <a
          className="opacity-40 hover:opacity-100 hover:underline"
          href="https://twitter.com/@pramodk73"
          target="_blank"
          rel="noreferrer"
        >
          @pramodk73
        </a>
      </div>
    </>
  );
};

export default Explorer;
