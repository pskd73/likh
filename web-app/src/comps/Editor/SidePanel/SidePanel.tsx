import classNames from "classnames";
import { useContext } from "react";
import { EditorContext } from "../Context";
import Explorer from "./Explorer";
import Outline from "./Outline";
import Shortcuts from "./Shortcuts";

const SidePanel = () => {
  const { sideBar } = useContext(EditorContext);

  return (
    <>
      <div
        className={classNames({
          "w-[0px]": !sideBar,
          "w-[300px] md:w-[300px] transition-all": sideBar,
        })}
      />
      <div
        className={classNames(
          "transition-all shadow-xl z-10 h-[100vh] overflow-y-scroll scrollbar-hide",
          "bg-white border-r border-primary-700 border-opacity-20",
          "fixed top-0",
          {
            "w-[0px]": !sideBar,
            "w-[300px]": sideBar,
          }
        )}
      >
        <div className="max-w-full overflow-hidden">
          {sideBar === "explorer" && <Explorer />}
          {sideBar === "outline" && <Outline />}
          {sideBar === "shortcuts" && <Shortcuts />}
        </div>
      </div>
    </>
  );
};

export default SidePanel;
