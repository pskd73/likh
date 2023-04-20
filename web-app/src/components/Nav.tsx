import * as React from "react";
import { useContext } from "react";
import { AppContext } from "./AppContext";
import Clickable from "./Clickable";

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
    <div className="px-4 flex justify-between items-center h-[40px]">
      <div>
        <h1 className="opacity-50 text-xl">The retro writing</h1>
      </div>
      <div>
        <ul className="flex space-x-6">
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
