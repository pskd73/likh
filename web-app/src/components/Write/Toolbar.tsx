import * as React from "react";
import { useContext, useEffect } from "react";
import { AppContext } from "../AppContext";
import Clickable from "../Clickable";
import TextCount from "./TextCount";
import Toolbar from "../Toolbar";
import TrayExpandIcon from "../TrayExpandIcon";
import Event from "../Event";
import { supabase } from "../supabase";
import GoalTracker from "./GoalTracker";
import useFetch from "../../useFetch";
import { Note } from "../../type";
import { API_HOST } from "../../config";

const WriteToolbar = () => {
  const appContext = useContext(AppContext);
  const newFetch = useFetch<Note>();

  useEffect(() => {
    if (newFetch.response) {
      appContext.setNotes({
        ...appContext.notes,
        [newFetch.response.id]: newFetch.response,
      });
      appContext.setNote(newFetch.response);
      Event.track("new_note");
    }
  }, [newFetch.response]);

  const handleNewNote = async () => {
    newFetch.handle(
      fetch(`${API_HOST}/note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${appContext.user!.token}`,
        },
        body: JSON.stringify({
          title: `My new note - ${new Date().toISOString()}`,
          text: "Write here ...",
        }),
      })
    );
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
    appContext.setUser(undefined);
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
            {appContext.user?.email} &nbsp;
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
