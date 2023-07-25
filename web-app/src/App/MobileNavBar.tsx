import classNames from "classnames";
import { ComponentProps, useContext, useMemo } from "react";
import {
  BiCalendarHeart,
  BiHash,
  BiHomeHeart,
  BiMenu,
  BiPlus,
} from "react-icons/bi";
import { useLocation, useNavigate, useNavigation } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { EditorContext } from "./Context";

const MenuItem = ({
  children,
  className,
  active,
  ...restProps
}: ComponentProps<"div"> & { active?: boolean }) => {
  return (
    <div
      className={twMerge(
        classNames(
          "p-4 text-2xl flex-1 flex justify-center items-center",
          "text-primary hover:text-opacity-100",
          "cursor-pointer",
          "transition-all",
          {
            "text-opacity-30": !active,
            "text-opacity-100": active,
          }
        ),
        className
      )}
      {...restProps}
    >
      {children}
    </div>
  );
};

const MobileNavBar = () => {
  const { newNote } = useContext(EditorContext);
  const location = useLocation();
  const navigate = useNavigate();
  const activeMenu = useMemo(() => {
    if (location) {
      const { pathname } = location;
      if (pathname === "/write") {
        return "home";
      }
      if (pathname === "/write/tags") {
        return "tags";
      }
      if (pathname === "/write/timeline") {
        return "timeline";
      }
      if (pathname.startsWith("/write/settings")) {
        return "settings";
      }
    }
  }, [location?.pathname]);

  const handleNew = async () => {
    const note = newNote({
      text: `# A title for the note\nWrite your mind here ...`,
    });
    navigate(`/write/note/${note!.id}`);
  };

  return (
    <div
      className={classNames(
        "border-t border-primary border-opacity-10",
        "sticky bottom-0 bg-base rounded-t-lg",
        "flex"
      )}
      style={{ boxShadow: "rgb(136, 136, 136) 0px 5px 10px" }}
    >
      <MenuItem
        active={activeMenu === "tags"}
        onClick={() => navigate("/write/tags")}
      >
        <BiHash />
      </MenuItem>
      <MenuItem
        active={activeMenu === "timeline"}
        onClick={() => navigate("/write/timeline")}
      >
        <BiCalendarHeart />
      </MenuItem>
      <MenuItem
        active={activeMenu === "home"}
        onClick={() => navigate("/write")}
      >
        <BiHomeHeart />
      </MenuItem>
      <MenuItem onClick={handleNew}>
        <BiPlus />
      </MenuItem>
      <MenuItem
        active={activeMenu === "settings"}
        onClick={() => navigate("/write/settings/sync")}
      >
        <BiMenu />
      </MenuItem>
    </div>
  );
};

export default MobileNavBar;
