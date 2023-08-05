import classNames from "classnames";
import { ComponentProps, useContext, useMemo } from "react";
import {
  BiCalendarHeart,
  BiCog,
  BiHomeHeart,
  BiMenu,
  BiPlus,
  BiPlusCircle,
  BiSearchAlt,
  BiX,
} from "react-icons/bi";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { EditorContext } from "./Context";
import { iOS, isMac, isPWA } from "./device";

const MenuItem = ({
  children,
  className,
  active,
  highlight,
  ...restProps
}: ComponentProps<"div"> & { active?: boolean; highlight?: boolean }) => {
  return (
    <div
      className={twMerge(
        classNames(
          "p-4 text-2xl flex-1 flex justify-center items-center",
          "hover:text-opacity-100",
          "cursor-pointer",
          "transition-all",
          {
            "text-opacity-30 text-primary": !active && !highlight,
            "text-opacity-100 text-primary": active,
            "text-4xl": highlight,
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
  const { newNote, note } = useContext(EditorContext);
  const [search] = useSearchParams();
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
      if (pathname.startsWith("/write/note-menu")) {
        return "note-menu";
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
        "fixed bottom-0 bg-base rounded-t-lg w-full",
        "flex",
        { "pb-4": iOS() }
      )}
      style={{ boxShadow: "rgb(136, 136, 136) 0px 5px 10px" }}
    >
      <MenuItem
        active={activeMenu === "home"}
        onClick={() => navigate("/write")}
      >
        <BiHomeHeart />
      </MenuItem>
      <MenuItem
        active={activeMenu === "tags"}
        onClick={() => navigate("/write/tags")}
      >
        <BiSearchAlt />
      </MenuItem>
      <MenuItem onClick={handleNew} highlight>
        <BiPlusCircle />
      </MenuItem>
      <MenuItem
        active={activeMenu === "timeline"}
        onClick={() => navigate("/write/timeline")}
      >
        <BiCalendarHeart />
      </MenuItem>
      {!note && (
        <MenuItem
          active={activeMenu === "settings"}
          onClick={() => navigate("/write/settings")}
        >
          <BiCog />
        </MenuItem>
      )}
      {note && (
        <MenuItem
          active={activeMenu === "note-menu"}
          onClick={() =>
            search.get("menu") ? navigate("?") : navigate("?menu=true")
          }
        >
          {search.get("menu") ? <BiX /> : <BiMenu />}
        </MenuItem>
      )}
    </div>
  );
};

export default MobileNavBar;
