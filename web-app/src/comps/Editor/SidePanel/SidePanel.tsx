import classNames from "classnames";
import { useContext } from "react";
import { EditorContext } from "../Context";
import { BiSidebar } from "react-icons/bi";
import Explorer from "./Explorer";

const SidePanel = () => {
  const { sideBar, setSideBar } = useContext(EditorContext);

  return (
    <>
      <div
        className={classNames({
          "w-[0px]": !sideBar,
          "w-[100px] md:w-[300px] transition-all": sideBar,
        })}
      />
      <div
        className={classNames(
          "transition-all shadow-xl z-10 h-[100vh]",
          "bg-white border-r border-primary-700 border-opacity-20",
          "fixed top-0",
          {
            "w-[0px]": !sideBar,
            "w-[300px]": sideBar,
          }
        )}
      >
        <div className="absolute top-[12px] -right-[34px]">
          <button
            className="curosr-pointer opacity-30 hover:opacity-100 text-xl"
            onClick={() => setSideBar((b) => (b ? undefined : "explorer"))}
          >
            <BiSidebar />
          </button>
        </div>
        <div className="max-w-full overflow-hidden">
          <Explorer />
        </div>
      </div>
    </>
  );
};

export default SidePanel;
