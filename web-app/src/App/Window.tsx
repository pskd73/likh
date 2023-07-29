import "src/App/db";
import { EditorContext, useEditor } from "src/App/Context";
import SidePanel from "src/App/SidePanel/SidePanel";
import StatusBar from "src/App/StatusBar/StatusBar";
import useStorage from "src/App/useStorage";
import { useEffect, useMemo, useState } from "react";
import useShortcuts from "src/App/useShortcuts";
import classNames from "classnames";
import "src/App/Core/test";
import { iOS, isMobile } from "src/App/device";
import { init } from "src/App/db";
import { migrate } from "src/App/localStorage";
import * as PouchDB from "src/App/PouchDB";
import { Outlet } from "react-router-dom";
import { enabledPlugins } from "./Plugin/List";
import MobileNavBar from "./MobileNavBar";

const STATUS_BAR_HEIGHT = 30;

const plugins = enabledPlugins.map((Plugin) => Plugin());

const EditorWindow = () => {
  const pdb = PouchDB.usePouchDb();
  const storage = useStorage(pdb);
  const editorState = useEditor({ storage, pdb, plugins });
  const statusBarPadding = useMemo(() => (iOS() ? 20 : 0), []);

  useShortcuts(editorState);

  useEffect(() => {
    plugins.forEach(
      (plugin) => plugin.updateState && plugin.updateState(editorState)
    );
  }, [editorState]);

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
              id="page-container"
              className="flex-1 p-4 py-8 flex justify-center"
              tabIndex={-1}
            >
              <div className={classNames("w-full max-w-[1000px]")}>
                <Outlet />
              </div>
            </div>
            {!isMobile ? (
              <StatusBar
                height={STATUS_BAR_HEIGHT}
                padding={statusBarPadding}
              />
            ) : (
              <MobileNavBar />
            )}
          </div>
        </div>
      </EditorContext.Provider>
    </PouchDB.PouchContext.Provider>
  );
};

export default EditorWindow;
