import { useContext } from "react";
import List from "../List";
import { EditorContext } from "../Context";
import { BiPlus } from "react-icons/bi";
import SearchInput from "./SearchInput";
import Collapsible from "../Collapsible";
import { textToTitle } from "../../../Note";
import Toggle from "../../Toggle";

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
  } = useContext(EditorContext);

  return (
    <>
      <List>
        <List.Item
          className="flex justify-between items-center"
          onClick={() => newNote({ text: "New note" })}
        >
          <span>New</span>
          <span>
            <BiPlus />
          </span>
        </List.Item>
      </List>

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
            </List>
          </div>
        </Collapsible.Item>
      </Collapsible>
    </>
  );
};

export default Explorer;
