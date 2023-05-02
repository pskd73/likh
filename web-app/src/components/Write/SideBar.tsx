import * as React from "react";
import MyNotes from "./MyNotes";
import Select from "../Select";
import Clickable from "../Clickable";
import { useContext } from "react";
import { AppContext } from "../AppContext";

const SideBar = () => {
  const { note } = useContext(AppContext);

  return note ? (
    <div className="max-h-[90vh] overflow-y-scroll scrollbar-hide p-4 space-y-6">
      <div>
        <div>
          Visibility
          <br />
          ---------
        </div>
        <div>
          <Select value={note.visibility} onValueChange={console.log}>
            <Select.Option value={"private"}>private</Select.Option>
            <Select.Option value={"public"}>public</Select.Option>
          </Select>
        </div>
      </div>
      <MyNotes />
    </div>
  ) : null;
};

export default SideBar;
