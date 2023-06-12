import { ComponentProps, useContext, useMemo } from "react";
import List from "../List";
import { EditorContext, NoteSummary } from "../Context";
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
import {
  BiCog,
  BiCollapseVertical,
  BiFile,
  BiHash,
  BiInfoCircle,
  BiStats,
} from "react-icons/bi";
import { isMobile } from "../device";

const NoteListItem = ({
  summary,
  ...restProps
}: ComponentProps<"li"> & { summary: NoteSummary; active?: boolean }) => {
  return (
    <List.Item className="text-sm" {...restProps}>
      <span className="flex space-x-2">
        <span className="opacity-50 mt-1">
          <BiFile />
        </span>
        <span>{textToTitle(summary.note.text, 50)}</span>
      </span>
    </List.Item>
  );
};

const Explorer = () => {
  const {
    note,
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
    searchTerm,
  } = useContext(EditorContext);
  const { install, installable } = usePWA();

  const hashtags = useMemo<Record<string, NoteSummary[]>>(() => {
    return getHashtags();
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

  const handleRoll = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    hashtag: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const hashtags = getHashtags();
    const notes = hashtags[hashtag].sort(
      (a, b) => a.note.created_at - b.note.created_at
    );
    const notesMap: Record<string, SavedNote> = {};
    notes.forEach((noteSummary) => {
      notesMap[noteSummary.note.id] = noteSummary.note;
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
            className="w-8 opacity-80"
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
            onClick={() => {
              newNote({ text: "New note" });
              setRollHashTag("");
            }}
            className="h-full"
          >
            <FiPlus />
          </Button>
        </div>
      </div>

      <SearchInput />

      <Collapsible>
        {/* Notes */}
        <Collapsible.Item defaultActive={false} active={!!searchTerm}>
          <Collapsible.Item.Label>
            <span className="flex items-center space-x-1">
              <BiFile />
              <span>All notes</span>
            </span>
          </Collapsible.Item.Label>
          <Collapsible.Item.Content>
            <List>
              {notesToShow.map((_noteSummary, i) => (
                <NoteListItem
                  key={i}
                  summary={_noteSummary}
                  onClick={() => handleNoteClick(_noteSummary.note)}
                  active={note.id === _noteSummary.note.id}
                />
              ))}
            </List>
          </Collapsible.Item.Content>
        </Collapsible.Item>
        <br />

        {/* Hashtags */}
        {Object.keys(hashtags).map((hashtag, i) => {
          const summaries = hashtags[hashtag];
          return (
            <Collapsible.Item key={i} defaultActive={false}>
              <Collapsible.Item.Label>
                <span className="flex items-center space-x-2">
                  <Button
                    className="p-1"
                    onClick={(
                      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ) => handleRoll(e, hashtag)}
                  >
                    <BiHash />
                  </Button>
                  <span>{hashtag.replace("#", "")}</span>
                </span>
              </Collapsible.Item.Label>
              <Collapsible.Item.Content>
                <List>
                  {summaries.map((summary, i) => (
                    <NoteListItem
                      key={i}
                      summary={summary}
                      onClick={() => handleNoteClick(summary.note)}
                      active={note.id === summary.note.id}
                    />
                  ))}
                </List>
              </Collapsible.Item.Content>
            </Collapsible.Item>
          );
        })}
        <br />

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
