import { PropsWithChildren, useEffect, useState } from "react";
import { Paper } from "./Layout";
import classNames from "classnames";
import Clickable from "../components/Clickable";
import { Link, To, useLocation } from "react-router-dom";

const MenuLink = ({
  children,
  to,
  active,
}: PropsWithChildren<{ active?: boolean; to: To }>) => {
  return (
    <Link
      to={to}
      className={classNames("hover:opacity-100", {
        "opacity-100": active,
        "opacity-50": !active,
      })}
    >
      {children}
    </Link>
  );
};

export const Nav = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const page = location.pathname.split("/")[2];
    if (page !== undefined) {
      setActiveLink(page);
    }
  }, [location]);

  return (
    <div className="bg-primary-400 border-b-4 border-primary-500">
      <Paper>
        <div className="h-[46px] flex justify-between items-center mt-2">
          <h1 className="text-lg">
            <Link to="/v2/">Retro Note</Link>
          </h1>
          <div>
            <ul className="flex space-x-6">
              <li>
                <MenuLink to="/v2/" active={activeLink === ""}>
                  Home
                </MenuLink>
              </li>
              <li>
                <MenuLink to="/v2/notes" active={activeLink === "notes"}>
                  My notes
                </MenuLink>
              </li>
              <li>
                <MenuLink to="/v2/settings" active={activeLink === "settings"}>
                  Settings
                </MenuLink>
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
