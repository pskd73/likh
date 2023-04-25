import React, {
  ReactElement,
  createElement,
  useEffect,
  useMemo,
  useRef,
} from "react";
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
import Clickable from "./components/Clickable";

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

let event: any = null;
const isApp =
  window.matchMedia("(display-mode: standalone)").matches ||
  window.location.hostname.startsWith("app") ||
  window.location.pathname.startsWith("/app");

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
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
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

  const handleBeforeInstall = (e: Event) => {
    event = e;
  };

  const handleInstall = async () => {
    if (event) {
      event.prompt();
      const { outcome } = await event.userChoice;
      if (outcome === "accepted") {
        event = null;
      }
    }
  };

  return (
    <div className="font-SpecialElite text-slate-700 relative h-[100vh]">
      <div className="hidden md:block">
        {isApp && (
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
        )}
        {!isApp && (
          <div className="flex h-[100vh] w-full justify-center items-center">
            <div className="w-1/2 text-center">
              Install the app{" "}
              <Clickable className="underline" onClick={handleInstall}>
                here
              </Clickable>{" "}
              to start building the habit of focused writing
            </div>
          </div>
        )}
      </div>
      <div className="md:hidden h-[100vh] w-full flex justify-center items-center">
        <div className="w-1/2 text-center">
          This is not supported on mobile! Please open it on a Mac/PC
        </div>
      </div>
    </div>
  );
}

export default App;
