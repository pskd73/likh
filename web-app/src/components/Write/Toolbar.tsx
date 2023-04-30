import * as React from "react";
import { useContext } from "react";
import { AppContext } from "../AppContext";
import Clickable from "../Clickable";
import TextCount from "./TextCount";
import Toolbar from "../Toolbar";
import TrayExpandIcon from "../TrayExpandIcon";
import Event from "../Event";
import { supabase } from "../supabase";
import GoalTracker from "./GoalTracker";

const WriteToolbar = () => {
  const appContext = useContext(AppContext);

  const handleNewNote = () => {
    const note = appContext.newNote();
    appContext.setEditingNoteId(note.id);
    Event.track("new_note");
  };

  const handleFocus = () => {
    appContext.setFocusMode(!appContext.focusMode);
  };

  const handleTitleClick = () => {
    appContext.setActiveTray("write");
    appContext.setTrayOpen(!appContext.trayOpen);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    appContext.setLoggedInUser(undefined);
  };

  return (
    <Toolbar>
      <Toolbar.Title>
        <Clickable>
          <span onClick={handleTitleClick}>
            <TrayExpandIcon />
            Retro Note
          </span>
        </Clickable>
        {!appContext.focusMode && (
          <span className="text-base ml-4">
            {appContext.loggedInUser?.email} &nbsp;
            <Clickable lite onClick={handleLogout}>
              logout
            </Clickable>
          </span>
        )}
      </Toolbar.Title>

      <Toolbar.MenuList>
        {!appContext.focusMode && (
          <>
            <li>
              <GoalTracker />
            </li>
            <li>
              <Clickable lite>
                <span onClick={() => appContext.toggleTextMetricType()}>
                  <TextCount />
                </span>
              </Clickable>
            </li>
            <li>
              <Clickable lite onClick={() => appContext.setActiveTray("habit")}>
                suggest
              </Clickable>
            </li>
            <li onClick={handleNewNote}>
              <Clickable lite>
                <span>new</span>
              </Clickable>
            </li>
          </>
        )}
        <li onClick={handleFocus}>
          <Clickable lite>
            <span>{appContext.focusMode ? "relax" : "focus"}</span>
          </Clickable>
        </li>
      </Toolbar.MenuList>
    </Toolbar>
  );
};

export default WriteToolbar;
