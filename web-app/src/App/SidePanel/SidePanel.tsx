import classNames from "classnames";
import { useContext } from "react";
import { EditorContext } from "src/App/Context";
import Outline from "src/App/SidePanel/Outline";
import { isMobile } from "src/App/device";
import RollOutline from "./RollOutline";
import {
  BiCalendarHeart,
  BiCog,
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
import List from "../List";

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

  const handleHome = () => {
    home();
    navigate("/write/home");
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
                "flex p-2 text-xl justify-end",
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
              className="overflow-scroll scrollbar-hide py-4 space-y-4"
            >
              <div className="px-4 mb-4">
                <Search searchTerm={searchTerm} onChange={setSearchTerm} />
                {searchTerm && (
                  <div className="mt-4">
                    <Notes noToggle seeAll noTitle toggleSeeAll={() => {}} />
                  </div>
                )}
              </div>
              {isRoll && <RollOutline />}
              <Outline />
              <Links />
              <SidePanelBrowse />
              <Settings />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SidePanel;
