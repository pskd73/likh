import classNames from "classnames";
import { PropsWithChildren, useContext } from "react";
import { EditorContext } from "../Context";
import Outline from "./Outline";
import Shortcuts from "./Shortcuts";
import { isMobile } from "../device";
import RollOutline from "./RollOutline";
import Storage from "./Storage";
import {
  BiChevronLeft,
  BiChevronRight,
  BiHomeSmile,
  BiSidebar,
} from "react-icons/bi";
import Button from "../../Button";
import Browse from "../Home/Browse";
import Links from "./Links";
import { WithTitle } from "./Common";

const SidePanel = () => {
  const { sideBar, setSideBar, isRoll, home, note } = useContext(EditorContext);

  return (
    <>
      {!isMobile && (
        <div>
          <div
            className={classNames("transition-all", {
              "w-[30px]": !sideBar,
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
          "md:border-r border-primary border-opacity-10",
          "fixed top-0 w-[300px]",
          {
            "-left-[270px]": !sideBar,
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
                <Button lite className="py-2" onClick={home}>
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
              <Button lite>
                <BiChevronLeft />
              </Button>
              <Button lite>
                <BiChevronRight />
              </Button>
              <Button lite onClick={() => setSideBar(undefined)}>
                <BiSidebar />
              </Button>
            </div>
            <div
              style={{ maxHeight: "calc(100vh - 50px)" }}
              className="overflow-scroll scrollbar-hide"
            >
              <div className={classNames("max-w-full overflow-hidden")}>
                <Outline />
                <Links />
                {isRoll && <RollOutline />}
                {sideBar === "shortcuts" && <Shortcuts />}
                {sideBar === "storage" && <Storage />}
              </div>

              <WithTitle title="Browse">
                <Browse lite />
              </WithTitle>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SidePanel;
