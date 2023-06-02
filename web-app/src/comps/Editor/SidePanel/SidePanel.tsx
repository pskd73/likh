import classNames from "classnames";
import { ComponentProps, PropsWithChildren, useContext } from "react";
import { EditorContext } from "../Context";
import { BiListUl, BiMenu, BiSidebar, BiSpreadsheet } from "react-icons/bi";
import Explorer from "./Explorer";
import Outline from "./Outline";
import Shortcuts from "./Shortcuts";

const PullButton = ({
  children,
  active,
  ...restProps
}: ComponentProps<"button"> & { active: boolean }) => {
  return (
    <button
      className={classNames("curosr-pointer hover:opacity-100 text-xl", {
        "opacity-100": active,
        "opacity-30": !active,
      })}
      {...restProps}
    >
      {children}
    </button>
  );
};

const SidePanel = () => {
  const { sideBar, setSideBar } = useContext(EditorContext);

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
          "transition-all shadow-xl z-10 h-[100vh]",
          "bg-white border-r border-primary-700 border-opacity-20",
          "fixed top-0",
          {
            "w-[0px]": !sideBar,
            "w-[300px]": sideBar,
          }
        )}
      >
        {/* <div className="absolute top-[12px] -right-[34px] flex flex-col space-y-4">
          <PullButton
            onClick={() =>
              setSideBar((b) => (b === "explorer" ? undefined : "explorer"))
            }
            active={sideBar === "explorer"}
          >
            <BiMenu />
          </PullButton>
          <PullButton
            onClick={() =>
              setSideBar((b) => (b === "outline" ? undefined : "outline"))
            }
            active={sideBar === "outline"}
          >
            <BiSpreadsheet />
          </PullButton>
        </div> */}
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
