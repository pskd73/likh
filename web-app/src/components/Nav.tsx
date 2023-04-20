import * as React from "react";
import { useContext } from "react";
import { AppContext } from "./AppContext";

type MenuItem = {
  key: string;
  label: string;
};

const menuItems: MenuItem[] = [
  { key: "new", label: "new" },
  { key: "focus", label: "focus" },
];

const Nav = () => {
  const appContext = useContext(AppContext);

  const handleMenuItemClick = (menuItem: MenuItem) => {
    if (menuItem.key === "new") {
      appContext.newNote();
    }
  };

  return (
    <div className="px-4 flex justify-between items-center h-[40px]">
      <div>
        <h1 className="opacity-50 text-xl">The retro writing</h1>
      </div>
      <div>
        <ul className="flex space-x-6">
          {menuItems.map((menuItem, i) => (
            <li
              key={i}
              className="opacity-50 hover:opacity-100 cursor-pointer"
              onClick={() => handleMenuItemClick(menuItem)}
            >
              {menuItem.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Nav;
