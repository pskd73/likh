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
import { BiFile } from "react-icons/bi";

const NoteListItem = ({
  note,
  ...restProps
}: ComponentProps<"li"> & { note: SavedNote }) => {
  return (
    <List.Item className="text-sm" {...restProps}>
      <span className="font-semibold flex space-x-2">
        <span className="opacity-50 mt-1">
          <BiFile />
        </span>
        <span>{textToTitle(note.text, 50)}</span>
      </span>
      <div className="py-1 flex items-center space-x-1">
        <span className="opacity-50">
          {moment(new Date(note.created_at)).fromNow()}
        </span>
      </div>
    </List.Item>
  );
};

const Explorer = () => {
  const {
    note,
    storage,
    isSideMenuActive,
    toggleSideMenu,
    showStats,
    setShowStats,
    typewriterMode,
    setTypewriterMode,
    notesToShow,
    newNote,
    updateNote,
    setSideBar,
    getHashtags,
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
    setSideBar(undefined);
    updateNote(note);
  };

  return (
    <>
      <div
        className={classNames(
          "flex justify-end items-center space-x-2",
          "p-2 border-b border-primary-700 border-opacity-20"
        )}
      >
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

      <SearchInput />

      <Collapsible>
        <Collapsible.Item
          title="Notes"
          active={isSideMenuActive("notes")}
          onToggle={() => toggleSideMenu("notes")}
        >
          <div>
            <List>
              {notesToShow.map((note, i) => (
                <NoteListItem
                  key={i}
                  note={note}
                  onClick={() => handleNoteClick(note)}
                />
              ))}
            </List>
          </div>
          {hashtags.map((hashtag, i) => (
            <div key={i}>
              <div className="px-2 border-b border-primary-700 border-opacity-20 mt-6 pb-2">
                <span className="bg-primary-700 text-base text-xs p-1 px-2 rounded-full">
                  {hashtag.hashtag}
                </span>
              </div>
              <List>
                {hashtag.notes.map((noteMeta, i) => {
                  const note = storage.getNote(noteMeta.id);
                  return note ? (
                    <NoteListItem
                      key={i}
                      note={note}
                      onClick={() => {
                        if (note) {
                          handleNoteClick(note);
                        }
                      }}
                    />
                  ) : null;
                })}
              </List>
            </div>
          ))}
        </Collapsible.Item>
        <Collapsible.Item
          title="Settings"
          active={isSideMenuActive("settings")}
          onToggle={() => toggleSideMenu("settings")}
        >
          <div>
            <List>
              <List.Item className="flex justify-between items-center">
                <span>Stats</span>
                <Toggle
                  id="stats"
                  checked={showStats}
                  onChange={(e) => setShowStats(e.target.checked)}
                />
              </List.Item>
              <List.Item className="flex justify-between items-center">
                <span>Typewriter mode</span>
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
                <span>Introduction note</span>
              </List.Item>
            </List>
          </div>
        </Collapsible.Item>
      </Collapsible>
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
