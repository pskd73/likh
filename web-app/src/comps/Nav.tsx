import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { Paper } from "./Layout";
import classNames from "classnames";
import Clickable from "../components/Clickable";
import { Link, To, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../components/AppContext";
import { supabase } from "../components/supabase";
import { BiCog, BiFilm, BiGridAlt, BiPlus } from "react-icons/bi";
import Logo from "./Logo";

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
    const page = location.pathname.split("/")[1];
    if (page !== undefined) {
      setActiveLink(page);
    }
  }, [location]);

  return (
    <div className="bg-primary-400 border-b-4 border-primary-500 sticky top-0 z-10">
      <Paper>
        <div className="h-[46px] flex justify-between items-center">
          <h1 className="text-2xl font-CourierPrime italic">
            <Link
              to="/"
              className="flex items-center space-x-2 opacity-100"
            >
              <div className="fill-primary-700 w-8 max-h-full">
                <Logo />
              </div>
              {/* <span className="block -mb-2">Retro Note</span> */}
            </Link>
          </h1>
          <div>
            <ul className="flex space-x-6 text-xl">
              <li className="flex items-center">
                <MenuLink to="/write/new">
                  <BiPlus />
                </MenuLink>
              </li>
              <li className="flex items-center">
                <MenuLink to="/roll">
                  <BiFilm />
                </MenuLink>
              </li>
              <li>
                <MenuLink to="/notes" active={activeLink === "notes"}>
                  <BiGridAlt />
                </MenuLink>
              </li>
              <li>
                <MenuLink to="/settings" active={activeLink === "settings"}>
                  <BiCog />
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
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(undefined);
    navigate("/");
  };

  return (
    <Paper>
      <div className="flex flex-col justify-center text-center opacity-40 text-sm mb-10">
        {user && (
          <p>
            Logged in as {user.email} [
            <Clickable onClick={handleLogout}>logout</Clickable>]
          </p>
        )}
        <p>
          <Clickable>
            <a href="/">Retro Note</a>
          </Clickable>
          &nbsp;•&nbsp;Built with &lt;3 by&nbsp;
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
