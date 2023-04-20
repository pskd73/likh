import * as React from "react";

const Nav = () => {
  return (
    <div className="p-4 flex justify-between items-center">
      <div>
        <h1 className="font-SpecialElite text-3xl">The retro writing</h1>
      </div>
      <div>
        <ul className="text-sm">
          <li className="opacity-50 hover:opacity-100">
            full screen
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Nav;
