import "src/App/db";
import { EditorContext, useEditor } from "src/App/Context";
import SidePanel from "src/App/SidePanel/SidePanel";
import StatusBar from "src/App/StatusBar/StatusBar";
import useStorage from "src/App/useStorage";
import { useEffect, useMemo } from "react";
import useShortcuts from "src/App/useShortcuts";
import classNames from "classnames";
import "src/App/Core/test";
import { iOS, isMobile } from "src/App/device";
import * as PouchDB from "src/App/PouchDB";
import { Outlet } from "react-router-dom";
import { enabledPlugins } from "./Plugin/List";
import MobileNavBar from "./MobileNavBar";
import { WithPlugins } from "./Plugin/Context";
import Tabs, { TabsContainer, TabsContext, useTabs } from "./Tabs";

const STATUS_BAR_HEIGHT = 30;

const plugins = enabledPlugins.map((Plugin) => Plugin());

const EditorWindow = () => {
  const pdb = PouchDB.usePouchDb();
  const storage = useStorage(pdb);
  const editorState = useEditor({ storage, pdb, plugins });
  const tabsState = useTabs();

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
        <WithPlugins>
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
              <TabsContext.Provider value={tabsState}>
                <Tabs />
                <div className="flex justify-center">
                  <div
                    id="page-container"
                    className={classNames("max-w-[1000px] w-full", {
                      "p-4 py-8": !editorState.fullPage,
                    })}
                  >
                    <TabsContainer />
                  </div>
                </div>
              </TabsContext.Provider>
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
        </WithPlugins>
      </EditorContext.Provider>
    </PouchDB.PouchContext.Provider>
  );
};

export default EditorWindow;
