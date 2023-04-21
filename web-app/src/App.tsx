import React, { ReactElement, createElement, useEffect, useMemo } from "react";
import Nav from "./components/Write/Toolbar";
import { AppContext, useAppContext } from "./components/AppContext";
import Tray from "./components/Tray";
import Write from "./components/Write/Write";
import "./index.css";
import Settings from "./components/Settings/Settings";
import Help from "./components/Help/Help";

const trays: Record<string, () => ReactElement> = {
  write: Write,
  // settings: Settings,
  help: Help,
};

function App() {
  const appContext = useAppContext();
  const traysToShow = useMemo(() => {
    if (!appContext.trayOpen) {
      return [trays[appContext.activeTray]];
    }
    return Object.values(trays);
  }, [appContext.trayOpen]);

  useEffect(() => {
    if (appContext.recentNote) {
      appContext.setEditingNoteId(appContext.recentNote.id);
    }
  }, [appContext.recentNote]);

  return (
    <div className="font-SpecialElite text-slate-700 relative h-[100vh]">
      <AppContext.Provider value={appContext}>
        {traysToShow.map((tray, i) => (
          <Tray
            key={i}
            style={{
              zIndex: 20 - i,
              top: -50 * (traysToShow.length - i - 1),
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
