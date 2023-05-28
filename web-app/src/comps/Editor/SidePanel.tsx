import classNames from "classnames";
import { useContext } from "react";
import { EditorContext } from "./Context";
import { BiSidebar } from "react-icons/bi";
import Collapsible from "./Collapsible";
import List from "./List";
import Toggle from "../Toggle";

const SidePanel = () => {
  const {
    sideBar,
    toggleSideBar,
    isSideMenuActive,
    toggleSideMenu,
    showStats,
    setShowStats,
    typewriterMode,
    setTypewriterMode,
  } = useContext(EditorContext);

  return (
    <div
      className={classNames(
        "transition-all relative shadow-xl z-10 h-[100vh]",
        "bg-white border-r border-primary-700 border-opacity-20",
        "sticky top-0",
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
        <Collapsible>
          <Collapsible.Item
            title="Notes"
            active={isSideMenuActive("notes")}
            onToggle={() => toggleSideMenu("notes")}
          >
            <div>
              <List>
                <List.Item>Note 1</List.Item>
                <List.Item>Note 2</List.Item>
                {[...Array(100)].map((_, i) => (
                  <List.Item key={i}>Note 2</List.Item>
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
  );
};

export default SidePanel;
