import { useContext } from "react";
import { AppContext } from "../AppContext";
import Clickable from "../Clickable";
import Toolbar from "../Toolbar";
import TrayExpandIcon from "../TrayExpandIcon";
import Topics from "./Topics";
import Suggestions from "./Suggestions";

const Habit = () => {
  const { trayOpen, setActiveTray, setTrayOpen } = useContext(AppContext);

  const handleTitleClick = () => {
    setActiveTray("habit");
    setTrayOpen(!trayOpen);
  };

  return (
    <div>
      <div className="p-4 flex space-x-6">
        <div className="w-1/2 overflow-y-scroll max-h-[90vh] scrollbar-hide">
          <Suggestions />
        </div>
        <div className="w-1/2">
          <Topics />
        </div>
      </div>
      <Toolbar className="bg-white">
        <Toolbar.Title>
          <Clickable>
            <span onClick={handleTitleClick}>
              <TrayExpandIcon />
              Habit
            </span>
          </Clickable>
        </Toolbar.Title>
      </Toolbar>
    </div>
  );
};

export default Habit;
