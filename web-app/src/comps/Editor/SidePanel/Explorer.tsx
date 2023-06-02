import { useContext } from "react";
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
  } = useContext(EditorContext);

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
                  {textToTitle(note.text, 20)}
                </List.Item>
              ))}
            </List>
          </div>
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
