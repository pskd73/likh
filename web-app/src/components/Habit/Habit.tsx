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
    <div className="overflow-y-none">
      <div className="md:flex">
        <div className="p-4 md:w-8/12 overflow-y-scroll max-h-[90vh] scrollbar-hide">
          <Suggestions />
        </div>
        <div className="p-4 md:w-4/12 overflow-y-scroll max-h-[90vh] scrollbar-hide">
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
