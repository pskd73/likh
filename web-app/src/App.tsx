import React, { ReactElement, createElement, useEffect, useMemo } from "react";
import {
  AppContext,
  AppContextType,
  useAppContext,
} from "./components/AppContext";
import Tray from "./components/Tray";
import Write from "./components/Write/Write";
import Help from "./components/Help/Help";
import "./index.css";
import { getIntroNote } from "./components/Write/Intro";
import Habit from "./components/Habit/Habit";

const trays: Record<string, () => ReactElement> = {
  write: Write,
  habit: Habit,
  help: Help,
};

const keyBindings: Record<string, (context: AppContextType) => void> = {
  KeyF: (context: AppContextType) => context.setFocusMode((old) => !old),
  KeyN: (context: AppContextType) => {
    const note = context.newNote();
    context.setEditingNoteId(note.id);
    context.setActiveTray("write");
  },
};

function App() {
  const appContext = useAppContext();
  const traysToShow = useMemo(() => {
    if (!appContext.trayOpen) {
      return [trays[appContext.activeTray]];
    }
    const trays_ = [trays[appContext.activeTray]];
    for (const key of Object.keys(trays)) {
      if (key !== appContext.activeTray) {
        trays_.push(trays[key]);
      }
    }
    return trays_;
  }, [appContext.trayOpen, appContext.activeTray]);

  useEffect(() => {
    if (appContext.recentNote) {
      appContext.setEditingNoteId(appContext.recentNote.id);
    }
  }, [appContext.recentNote]);

  useEffect(() => {
    if (!appContext.recentNote) {
      appContext.saveNote(getIntroNote());
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.altKey) {
      if (keyBindings[e.code]) {
        keyBindings[e.code](appContext);

        e.preventDefault();
        e.stopPropagation();
      }
    }
  };

  return (
    <div className="font-SpecialElite text-slate-700 relative h-[100vh]">
      <AppContext.Provider value={appContext}>
        {traysToShow.map((tray, i) => (
          <Tray
            key={i}
            style={{
              zIndex: 20 - i,
              top: -45 * (traysToShow.length - i - 1),
            }}
          >
            {createElement(tray, {})}
          </Tray>
        ))}
      </AppContext.Provider>
    </div>
  );
}

export default App;
