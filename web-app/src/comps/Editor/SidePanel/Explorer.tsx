import { useContext, useMemo } from "react";
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

  return (
    <>
      <div
        className={classNames(
          "flex justify-end items-center space-x-2",
          "p-2 border-b border-primary-700 border-opacity-20"
        )}
      >
        <Button onClick={() => setSideBar("shortcuts")}>
          <BsKeyboard />
        </Button>
        <Button onClick={handleOpen}>
          <FiUpload />
        </Button>
        <Button onClick={() => newNote({ text: "New note" })}>
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
                <List.Item
                  key={i}
                  className="text-sm"
                  onClick={() => updateNote(note)}
                >
                  {textToTitle(note.text, 50)}
                </List.Item>
              ))}
            </List>
          </div>
          {hashtags.map((hashtag, i) => (
            <div>
              <div className="px-2 border-b border-primary-700 border-opacity-20 mt-6 pb-2">
                <span className="bg-primary-700 text-base text-xs p-1 px-2 rounded-full">
                  {hashtag.hashtag}
                </span>
              </div>
              <List>
                {hashtag.notes.map((noteMeta, i) => (
                  <List.Item
                    key={i}
                    className="text-sm"
                    onClick={() => {
                      const note = storage.getNote(noteMeta.id);
                      if (note) {
                        updateNote(note);
                      }
                    }}
                  >
                    {noteMeta.title}
                  </List.Item>
                ))}
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
    </>
  );
};

export default Explorer;
