import { ComponentProps, cloneElement, useContext, useMemo } from "react";
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
  BiAlarm,
  BiAlarmExclamation,
  BiBrush,
  BiCog,
  BiCollapseVertical,
  BiFile,
  BiHash,
  BiInfoCircle,
  BiStats,
} from "react-icons/bi";
import { isMobile } from "../device";
import { highlight, makeExtractor } from "../Marker";
import { Themes } from "../Theme";
import { twMerge } from "tailwind-merge";
import moment from "moment";

const Highligher = (word: string) =>
  makeExtractor(
    () => RegExp(word, "i"),
    (text: string) => ({
      type: "element",
      content: <span className="bg-primary-700 text-white">{text}</span>,
    })
  );

const NoteListItem = ({
  summary,
  ...restProps
}: ComponentProps<"li"> & { summary: NoteSummary; active?: boolean }) => {
  return (
    <List.Item {...restProps}>
      <div className="flex">
        <span className="opacity-50 mt-1 min-w-5 w-5">
          <BiFile />
        </span>
        <span>{textToTitle(summary.note.text, 20)}</span>
      </div>
      {summary.summary && (
        <List.Item.Description>
          {highlight(summary.summary, [Highligher(summary.highlight || "")])
            .map((it, i) => {
              if (typeof it === "string") {
                return <span>{it}</span>;
              }
              return it;
            })
            .map((it, i) => cloneElement(it, { key: i }))}
        </List.Item.Description>
      )}
    </List.Item>
  );
};

const ThemeBox = ({
  children,
  className,
  themeName,
  active,
  ...restProps
}: ComponentProps<"div"> & { themeName: string; active: boolean }) => {
  const theme = Themes[themeName];

  return (
    <div
      className={twMerge(
        classNames(
          theme.font.base,
          "px-3 h-8 border-primary-700 border-2 cursor-pointer",
          "rounded flex justify-center items-center",
          "hover:bg-primary-700 hover:bg-opacity-5 active:bg-opacity-10",
          "transition-all",
          {
            "border-opacity-30": !active,
            "border-opacity-80": active,
          }
        ),
        className
      )}
      {...restProps}
    >
      {children}
    </div>
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
    setRollHashTag,
    toggleSideMenu,
    isSideMenuActive,
    themeName,
    setThemeName,
  } = useContext(EditorContext);
  const { install, installable } = usePWA();

  const hashtags = useMemo<Record<string, NoteSummary[]>>(() => {
    return getHashtags();
  }, [notesToShow, note]);
  const reminderNotes = useMemo<NoteSummary[]>(() => {
    return notesToShow.filter((n) => !!n.note.reminder);
  }, [notesToShow]);

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
    setRollHashTag(hashtag);
    setSideBar("outline");
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
        <div className="flex space-x-2">
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
        <Collapsible.Item
          active={isSideMenuActive("notes")}
          handleToggle={() => toggleSideMenu("notes")}
        >
          <Collapsible.Item.Label>
            <span className="flex items-center space-x-2">
              <span className="p-1">
                <BiFile />
              </span>
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
                  active={note?.id === _noteSummary.note.id}
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
            <Collapsible.Item
              key={i}
              active={isSideMenuActive(hashtag)}
              handleToggle={() => toggleSideMenu(hashtag)}
            >
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
                      active={note?.id === summary.note.id}
                    />
                  ))}
                </List>
              </Collapsible.Item.Content>
            </Collapsible.Item>
          );
        })}
        <br />

        {/* Reminders */}
        <Collapsible.Item
          active={isSideMenuActive("reminders")}
          handleToggle={() => toggleSideMenu("reminders")}
        >
          <Collapsible.Item.Label>
            <span className="flex items-center space-x-2">
              <span className="p-1">
                <BiAlarm />
              </span>
              <span>Reminders ({reminderNotes.length})</span>
            </span>
          </Collapsible.Item.Label>
          <Collapsible.Item.Content>
            <List>
              {reminderNotes.map((summary, i) => (
                <List.Item
                  key={i}
                  className="text-sm"
                  onClick={() => handleNoteClick(summary.note)}
                >
                  <div className="flex">
                    <span className="opacity-50 mt-1 min-w-5 w-5">
                      <BiFile />
                    </span>
                    <div>
                      {textToTitle(summary.note.text, 20)}
                      <div className="flex items-center space-x-1 opacity-50">
                        <span>
                          <BiAlarmExclamation />
                        </span>
                        <span>
                          {moment(
                            new Date(summary.note.reminder!.date)
                          ).fromNow()}
                        </span>
                      </div>
                    </div>
                  </div>
                </List.Item>
              ))}
            </List>
          </Collapsible.Item.Content>
        </Collapsible.Item>
        <br />

        {/* Settings */}
        <Collapsible.Item
          active={isSideMenuActive("settings")}
          handleToggle={() => toggleSideMenu("settings")}
        >
          <Collapsible.Item.Label>
            <span className="flex items-center space-x-2">
              <span className="p-1">
                <BiCog />
              </span>
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
              <List.Item noHover>
                <div className="flex space-x-1">
                  <BiBrush className="mt-1" />
                  <div>
                    <div className="mb-2">Theme</div>
                    <div className="flex space-x-2">
                      <ThemeBox
                        themeName="Basic"
                        onClick={() => setThemeName("Basic")}
                        active={themeName === "Basic"}
                      >
                        Basic
                      </ThemeBox>
                      <ThemeBox
                        themeName="Serif"
                        onClick={() => setThemeName("Serif")}
                        active={themeName === "Serif"}
                      >
                        Serif
                      </ThemeBox>
                    </div>
                  </div>
                </div>
              </List.Item>
            </List>
          </Collapsible.Item.Content>
        </Collapsible.Item>
      </Collapsible>

      {/* Built by */}
      <div className="mt-2 text-xs px-2">
        <span className="opacity-40">Built by </span>
        <a
          className="opacity-40 hover:opacity-100 underline"
          href="https://twitter.com/@pramodk73"
          target="_blank"
          rel="noreferrer"
        >
          @pramodk73
        </a>
      </div>

      {/* Community */}
      <div className="mb-2 text-xs px-2">
        <span className="opacity-40">Join the </span>
        <a
          className="opacity-40 hover:opacity-100 underline"
          href="https://twitter.com/i/communities/1670013921598795778"
          target="_blank"
          rel="noreferrer"
        >
          community
        </a>
        <span className="opacity-40"> to make it better :)</span>
      </div>
    </>
  );
};

export default Explorer;
