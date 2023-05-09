import { ComponentProps, PropsWithChildren } from "react";
import { Paper } from "./Layout";
import classNames from "classnames";
import Clickable from "../components/Clickable";

const MenuLink = ({
  children,
  active,
  ...restProps
}: ComponentProps<"a"> & { active?: boolean }) => {
  return (
    <a
      className={classNames("hover:opacity-100", {
        "opacity-100": active,
        "opacity-50": !active,
      })}
      {...restProps}
    >
      {children}
    </a>
  );
};

export const Nav = () => {
  return (
    <div className="bg-primary-400 border-b-4 border-primary-500">
      <Paper>
        <div className="h-[46px] flex justify-between items-center mt-2">
          <h1 className="text-lg">
            <a href="#">Retro Note</a>
          </h1>
          <div>
            <ul className="flex space-x-6">
              <li>
                <MenuLink href="#" active>
                  Home
                </MenuLink>
              </li>
              <li>
                <MenuLink href="#">My notes</MenuLink>
              </li>
              <li>
                <MenuLink href="#">Settings</MenuLink>
              </li>
            </ul>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export const Footer = () => {
  return (
    <Paper>
      <div className="flex justify-center text-center opacity-30 text-sm">
        Built with &lt;3 by&nbsp;
        <Clickable>
          <a href="#" target="_blank">
            @pramodk73
          </a>
        </Clickable>
      </div>
    </Paper>
  );
};
