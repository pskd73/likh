import classNames from "classnames";
import { useContext } from "react";
import { EditorContext } from "../Context";
import Outline from "./Outline/Outline";
import Shortcuts from "./Shortcuts";
import { isMobile } from "../device";
import RollOutline from "./Outline/RollOutline";
import Storage from "./Storage";

const SidePanel = () => {
  const { sideBar, setSideBar, isRoll } = useContext(EditorContext);

  return (
    <>
      {!isMobile && (
        <div
          className={classNames({
            "w-[0px]": !sideBar,
            "w-[300px] md:w-[300px] transition-all": sideBar,
          })}
        />
      )}
      {isMobile && sideBar && (
        <div
          className="bg-primary-700 bg-opacity-70 w-[100vw] h-[100vh] fixed top-0 left-0 z-20"
          onClick={() => setSideBar(undefined)}
        />
      )}
      <div
        className={classNames(
          "transition-all shadow-xl z-30 h-[100vh] overflow-y-scroll scrollbar-hide",
          "bg-white border-r border-primary-700 border-opacity-20",
          "fixed top-0",
          {
            "w-[0px]": !sideBar,
            "w-[300px]": sideBar,
          }
        )}
      >
        <div className="max-w-full overflow-hidden p-2">
          {sideBar === "outline" ? (
            isRoll ? (
              <RollOutline />
            ) : (
              <Outline />
            )
          ) : null}
          {sideBar === "shortcuts" && <Shortcuts />}
          {sideBar === "storage" && <Storage />}
        </div>
      </div>
    </>
  );
};

export default SidePanel;
