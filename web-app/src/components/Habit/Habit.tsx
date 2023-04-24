import { useContext } from "react";
import { AppContext } from "../AppContext";
import Clickable from "../Clickable";
import Toolbar from "../Toolbar";
import TrayExpandIcon from "../TrayExpandIcon";
import Topics from "./Topics";
import Suggestions from "./Suggestions";
import ScrollableCol from "../ScrollableCol";

const Habit = () => {
  const { trayOpen, setActiveTray, setTrayOpen } = useContext(AppContext);

  const handleTitleClick = () => {
    setActiveTray("habit");
    setTrayOpen(!trayOpen);
  };

  return (
    <div>
      <div className="flex">
        <ScrollableCol className="p-4 w-8/12">
          <Suggestions />
        </ScrollableCol>
        <ScrollableCol className="p-4 w-4/12">
          <Topics />
        </ScrollableCol>
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
