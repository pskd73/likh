import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { Paper } from "./Layout";
import classNames from "classnames";
import Clickable from "../components/Clickable";
import { Link, To, useLocation } from "react-router-dom";
import { AppContext } from "../components/AppContext";
import { supabase } from "../components/supabase";

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
    <div className="bg-primary-400 border-b-4 border-primary-500 sticky top-0 z-10">
      <Paper>
        <div className="h-[46px] flex justify-between items-center mt-2">
          <h1 className="text-lg">
            <Link to="/v2/">Retro Note</Link>
          </h1>
          <div>
            <ul className="flex space-x-6">
              <li>
                <MenuLink to="/v2/write/new">new</MenuLink>
              </li>
              <li>
                <MenuLink to="/v2/notes" active={activeLink === "notes"}>
                  my notes
                </MenuLink>
              </li>
              <li>
                <MenuLink to="/v2/settings" active={activeLink === "settings"}>
                  settings
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
  const { user, setUser } = useContext(AppContext);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(undefined);
  };

  return (
    <Paper>
      <div className="flex flex-col justify-center text-center opacity-30 text-sm mb-10">
        {user && (
          <p>
            Logged in as {user.email} [
            <Clickable onClick={handleLogout}>
              logout
            </Clickable>
            ]
          </p>
        )}
        <p>
          Built with &lt;3 by&nbsp;
          <Clickable>
            <a
              href="https://twitter.com/@pramodk73"
              target="_blank"
              rel="noreferrer"
            >
              @pramodk73
            </a>
          </Clickable>
        </p>
      </div>
    </Paper>
  );
};
