import classNames from "classnames";
import { useContext } from "react";
import { EditorContext } from "App/Context";
import Outline from "./Outline";
import { isMobile } from "App/device";
import RollOutline from "./RollOutline";
import { BiCog, BiHomeSmile, BiSidebar } from "react-icons/bi";
import Button from "Comps/Button";
import Browse from "App/Home/Browse";
import Links from "./Links";
import { WithTitle } from "./Common";
import { useNavigate } from "react-router-dom";
import { TbTimelineEvent } from "react-icons/tb";
import { TiDownload } from "react-icons/ti";
import { zipIt } from "App/File";
import { SavedNote } from "App/type";
import Search from "App/Home/Search";
import Notes from "App/Home/Notes";

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
  } = useContext(EditorContext);

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
              <Button
                lite
                className="py-2"
                onClick={() => setSideBar("outline")}
              >
                <BiSidebar />
              </Button>
              {note && (
                <Button lite className="py-2" onClick={handleHome}>
                  <BiHomeSmile />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Expanded */}
        {sideBar && (
          <div>
            <div
              className={classNames(
                "flex p-2 text-xl justify-end",
                "border-b border-primary border-opacity-10"
              )}
            >
              <Button lite onClick={handleZip}>
                <TiDownload />
              </Button>
              <Button lite onClick={() => navigate("/write/settings/sync")}>
                <BiCog />
              </Button>
              <Button lite onClick={() => navigate("/write/timeline")}>
                <TbTimelineEvent />
              </Button>
              <Button lite onClick={handleHome}>
                <BiHomeSmile />
              </Button>
              <Button lite onClick={() => setSideBar(undefined)}>
                <BiSidebar />
              </Button>
            </div>
            <div
              style={{ maxHeight: "calc(100vh - 50px)" }}
              className="overflow-scroll scrollbar-hide py-4 space-y-2"
            >
              <div className="p-4">
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
              <WithTitle title="Browse">
                <Browse
                  lite
                  onNoteClick={() => isMobile && setSideBar(undefined)}
                />
              </WithTitle>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SidePanel;
