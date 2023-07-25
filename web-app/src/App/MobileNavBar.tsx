import classNames from "classnames";
import { ComponentProps, useMemo } from "react";
import {
  BiCalendarHeart,
  BiHash,
  BiHomeHeart,
  BiMenu,
  BiPlus,
} from "react-icons/bi";
import { useLocation, useNavigation } from "react-router-dom";
import { twMerge } from "tailwind-merge";

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
  const location = useLocation();
  const activeMenu = useMemo(() => {
    if (location) {
      const { pathname } = location;
      if (pathname === "/write") {
        return "home";
      }
    }
  }, [location?.pathname]);

  return (
    <div
      className={classNames(
        "border-t border-primary border-opacity-10",
        "sticky bottom-0 bg-base rounded-t-lg",
        "flex"
      )}
      style={{ boxShadow: "rgb(136, 136, 136) 0px 5px 10px" }}
    >
      <MenuItem>
        <BiHash />
      </MenuItem>
      <MenuItem>
        <BiCalendarHeart />
      </MenuItem>
      <MenuItem active={activeMenu === "home"}>
        <BiHomeHeart />
      </MenuItem>
      <MenuItem>
        <BiPlus />
      </MenuItem>
      <MenuItem>
        <BiMenu />
      </MenuItem>
    </div>
  );
};

export default MobileNavBar;
