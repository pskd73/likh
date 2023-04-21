import * as React from "react";
import { useContext } from "react";
import { AppContext } from "./AppContext";
import Clickable from "./Clickable";
import TextCount from "./TextCount";

const Nav = () => {
  const appContext = useContext(AppContext);

  const handleNewNote = () => {
    const note = appContext.newNote();
    appContext.setEditingNoteId(note.id);
  };

  const handleFocus = () => {
    appContext.setFocusMode(!appContext.focusMode);
  };

  return (
    <div className="absolute w-full bottom-0 px-4 flex justify-between items-center h-[40px]">
      <div>
        <h1 className="opacity-50 text-xl">Retro Note</h1>
      </div>
      <div>
        <ul className="flex space-x-6">
          <li>
            <Clickable lite>
              <span onClick={() => appContext.toggleTextMetricType()}>
                <TextCount />
              </span>
            </Clickable>
          </li>
          <li>
            <Clickable lite>
              <span onClick={() => appContext.setTrayOpen(!appContext.trayOpen)}>
                more
              </span>
            </Clickable>
          </li>
          <li onClick={handleNewNote}>
            <Clickable lite>
              <span>new</span>
            </Clickable>
          </li>
          <li onClick={handleFocus}>
            <Clickable lite>
              <span>{appContext.focusMode ? "relax" : "focus"}</span>
            </Clickable>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Nav;
