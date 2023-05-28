import classNames from "classnames";
import { useContext } from "react";
import { EditorContext } from "../Context";
import { BiPlus, BiSidebar } from "react-icons/bi";
import Collapsible from "../Collapsible";
import List from "../List";
import Toggle from "../../Toggle";
import SearchInput from "./SearchInput";
import { SavedNote } from "../type";
import { textToTitle } from "../../../Note";

const SidePanel = ({
  onNoteSelect,
}: {
  onNoteSelect: (note: SavedNote) => void;
}) => {
  const {
    storage,
    sideBar,
    toggleSideBar,
    isSideMenuActive,
    toggleSideMenu,
    showStats,
    setShowStats,
    typewriterMode,
    setTypewriterMode,
    notesToShow,
    newNote,
  } = useContext(EditorContext);

  return (
    <>
      <div
        className={classNames({
          "w-[0px]": !sideBar,
          "w-[300px]": sideBar,
        })}
      />
      <div
        className={classNames(
          "transition-all shadow-xl z-10 h-[100vh]",
          "bg-white border-r border-primary-700 border-opacity-20",
          "fixed top-0",
          {
            "w-[0px]": !sideBar,
            "w-[300px]": sideBar,
          }
        )}
      >
        <div className="absolute top-1 -right-[26px]">
          <button
            className="curosr-pointer opacity-30 hover:opacity-100 text-xl"
            onClick={toggleSideBar}
          >
            <BiSidebar />
          </button>
        </div>
        <div className="max-w-full overflow-hidden">
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
                      onClick={() => onNoteSelect(note)}
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
        </div>
      </div>
    </>
  );
};

export default SidePanel;
