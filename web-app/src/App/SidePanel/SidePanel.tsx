import classNames from "classnames";
import React, { useContext, useMemo } from "react";
import { EditorContext } from "src/App/Context";
import Outline from "src/App/SidePanel/Outline";
import { isMobile } from "src/App/device";
import RollOutline from "./RollOutline";
import {
  BiCalendarHeart,
  BiCog,
  BiGitRepoForked,
  BiHomeSmile,
  BiPlus,
  BiSidebar,
} from "react-icons/bi";
import Button from "src/comps/Button";
import Links from "src/App/SidePanel/Links";
import { useNavigate } from "react-router-dom";
import { TiDownload } from "react-icons/ti";
import { zipIt } from "src/App/File";
import { SavedNote } from "src/App/type";
import Search from "src/App/SidePanel/Search";
import Notes from "src/App/Home/Notes";
import Tooltip from "src/comps/Tooltip";
import { getShortcutText } from "../useShortcuts";
import SidePanelBrowse from "./SidePanelBrowse";
import Settings from "./Settings";
import { WithTitle } from "./Common";
import Trash from "../Home/Trash";
import List from "../List";
import { PluginContext } from "../Plugin/Context";

const SidePanel = () => {
  const navigate = useNavigate();
  const {
    sideBar,
    setSideBar,
    isRoll,
    home,
    note,
    storage,
    searchTerm,
    setSearchTerm,
    newNote,
  } = useContext(EditorContext);
  const { plugins } = useContext(PluginContext);
  const navigationItems = useMemo(() => {
    const btns = Object.values(plugins)
      .map((p) => p.navigationItems)
      .filter((items) => items?.length)
      .reduce((p, c) => [...p!, ...c!], []);
    return btns || [];
  }, [plugins]);

  const handleHome = () => {
    home();
    navigate("/write");
  };

  const handleZip = async () => {
    const notes: Record<string, SavedNote> = {};
    for (const meta of storage.notes) {
      const id = meta.id;
      const savedNote = await storage.getNote(id);
      if (savedNote) {
        notes[id] = savedNote;
      }
    }
    zipIt(storage.notes, notes, storage.pouch);
  };

  const handleNew = async () => {
    const note = newNote({
      text: `# A title for the note\nWrite your mind here ...`,
    });
    navigate(`/write/note/${note!.id}`);
  };

  if (isMobile) return null;

  return (
    <>
      {!isMobile && (
        <div>
          <div
            className={classNames("transition-all", {
              "w-[30px]": !sideBar && !isMobile,
              "w-[0px]": !sideBar && isMobile,
              "w-[300px]": sideBar,
            })}
          />
        </div>
      )}
      {isMobile && sideBar && (
        <div
          className="bg-primary bg-opacity-70 w-[100vw] h-[100vh] fixed top-0 left-0 z-20"
          onClick={() => setSideBar(undefined)}
        />
      )}
      <div
        className={classNames(
          "transition-all z-30 h-[100vh] overflow-y-scroll scrollbar-hide",
          "bg-base md:bg-primary md:bg-opacity-5",
          "border-r border-primary border-opacity-10",
          "fixed top-0 w-[300px]",
          {
            "-left-[270px]": !sideBar && !isMobile,
            "-left-[300px]": !sideBar && isMobile,
            "left-0": sideBar,
          }
        )}
      >
        {/* Minimized */}
        {!sideBar && (
          <div className="flex justify-end">
            <div className="w-[30px]">
              <Tooltip
                tip={
                  <span>
                    Sidemenu
                    <Tooltip.Shortcut>{getShortcutText("L")}</Tooltip.Shortcut>
                  </span>
                }
              >
                <Button
                  lite
                  className="py-2"
                  onClick={() => setSideBar("outline")}
                >
                  <BiSidebar />
                </Button>
              </Tooltip>
              <Tooltip
                tip={
                  <span>
                    New note
                    <Tooltip.Shortcut>{getShortcutText("N")}</Tooltip.Shortcut>
                  </span>
                }
              >
                <Button lite className="py-2" onClick={handleNew}>
                  <BiPlus />
                </Button>
              </Tooltip>
              {note && (
                <Tooltip
                  tip={
                    <span>
                      Home
                      <Tooltip.Shortcut>
                        {getShortcutText("H")}
                      </Tooltip.Shortcut>
                    </span>
                  }
                >
                  <Button lite className="py-2" onClick={handleHome}>
                    <BiHomeSmile />
                  </Button>
                </Tooltip>
              )}
            </div>
          </div>
        )}

        {/* Expanded */}
        {sideBar && (
          <>
            <div
              className={classNames(
                "flex px-2 text justify-end h-8 py-1",
                "border-b border-primary border-opacity-10"
              )}
            >
              <Tooltip
                tip={
                  <span>
                    Backup
                    <Tooltip.Shortcut>{getShortcutText("B")}</Tooltip.Shortcut>
                  </span>
                }
              >
                <Button lite onClick={handleZip}>
                  <TiDownload />
                </Button>
              </Tooltip>
              <Tooltip tip={"Settings"}>
                <Button lite onClick={() => navigate("/write/settings/sync")}>
                  <BiCog />
                </Button>
              </Tooltip>
              <Tooltip tip={"Timeline"}>
                <Button lite onClick={() => navigate("/write/timeline")}>
                  <BiCalendarHeart />
                </Button>
              </Tooltip>
              <Tooltip
                tip={
                  <span>
                    Home
                    <Tooltip.Shortcut>{getShortcutText("H")}</Tooltip.Shortcut>
                  </span>
                }
              >
                <Button lite onClick={handleHome}>
                  <BiHomeSmile />
                </Button>
              </Tooltip>
              <Tooltip
                tip={
                  <span>
                    New note
                    <Tooltip.Shortcut>{getShortcutText("N")}</Tooltip.Shortcut>
                  </span>
                }
              >
                <Button lite onClick={handleNew}>
                  <BiPlus />
                </Button>
              </Tooltip>
              <Tooltip
                tip={
                  <span>
                    Sidemenu
                    <Tooltip.Shortcut>{getShortcutText("L")}</Tooltip.Shortcut>
                  </span>
                }
              >
                <Button lite onClick={() => setSideBar(undefined)}>
                  <BiSidebar />
                </Button>
              </Tooltip>
            </div>
            <div
              style={{ maxHeight: "calc(100vh - 50px)" }}
              className="overflow-scroll scrollbar-hide py-4 space-y-1 pb-10"
            >
              <div className="px-4 mb-4">
                <Search searchTerm={searchTerm} onChange={setSearchTerm} />
                {searchTerm && (
                  <div className="mt-4">
                    <Notes />
                  </div>
                )}
              </div>
              {isRoll && <RollOutline />}
              <Outline />
              <Links />
              <SidePanelBrowse />
              <WithTitle title="Trash" active={false}>
                <Trash />
              </WithTitle>
              {navigationItems.length > 0 && (
                <WithTitle title="Navigation" active>
                  <List>
                    {navigationItems.map((item, i) => (
                      <React.Fragment key={i}>{item}</React.Fragment>
                    ))}
                  </List>
                </WithTitle>
              )}
              <Settings />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SidePanel;
