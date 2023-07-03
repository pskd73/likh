import "./db";
import { EditorContext, useEditor } from "./Context";
import SidePanel from "./SidePanel/SidePanel";
import StatusBar from "./StatusBar/StatusBar";
import useStorage from "./useStorage";
import { useEffect, useMemo, useState } from "react";
import useShortcuts from "./useShortcuts";
import classNames from "classnames";
import "./Core/test";
import { iOS, isMobile } from "./device";
import { init } from "./db";
import { migrate } from "./localStorage";
import * as PouchDB from "./PouchDB";
import { Outlet } from "react-router-dom";

const STATUS_BAR_HEIGHT = 30;

const EditorWindow = () => {
  const pdb = PouchDB.usePouchDb();
  const storage = useStorage(pdb);
  const editorState = useEditor({ storage, pdb });
  const statusBarPadding = useMemo(() => (iOS() ? 20 : 0), []);
  const [dbInitiated, setDbInitiated] = useState(false);

  useShortcuts(editorState);

  useEffect(() => {
    (async () => {
      await init();
      setDbInitiated(true);
      migrate(storage.pouch, pdb.secret);
    })();
  }, []);

  if (!dbInitiated) {
    return null;
  }

  return (
    <PouchDB.PouchContext.Provider value={pdb}>
      <EditorContext.Provider value={editorState}>
        <div
          className={classNames("min-h-[100vh] bg-base text-primary flex", {
            "theme-base": editorState.colorTheme === "base",
            "theme-dark": editorState.colorTheme === "dark",
            "theme-accent": editorState.colorTheme === "accent",
            "theme-secondary": editorState.colorTheme === "secondary",
          })}
        >
          <SidePanel />
          <div
            style={{
              width:
                editorState.sideBar && !isMobile
                  ? "calc(100vw - 300px)"
                  : "100vw",
            }}
          >
            <div
              id="editor-container"
              className="flex-1 p-4 py-8 flex justify-center overflow-y-scroll"
              style={{
                height: `calc(100vh - ${
                  STATUS_BAR_HEIGHT + statusBarPadding
                }px)`,
              }}
            >
              <div
                className={classNames("w-full max-w-[1000px]")}
              >
                <Outlet />
              </div>
            </div>
            <StatusBar height={STATUS_BAR_HEIGHT} padding={statusBarPadding} />
          </div>
        </div>
      </EditorContext.Provider>
    </PouchDB.PouchContext.Provider>
  );
};

export default EditorWindow;
