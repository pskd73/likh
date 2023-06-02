import { useContext } from "react";
import { EditorContext } from "../Context";
import TextCounter from "./TextCounter";
import Button from "../../Button";
import { BiMenu, BiSave, BiSpreadsheet } from "react-icons/bi";
import { saveNote } from "../File";
import Delete from "./Delete";
import classNames from "classnames";

const StatusBar = ({ text }: { text: string }) => {
  const { showStats, note, setSideBar } = useContext(EditorContext);

  const handleSave = () => {
    saveNote(note);
  };

  return (
    <div
      className={classNames(
        "bottom-0 w-full right-0 z-10 flex justify-between items-center",
        "bg-base shadow-2xl border-t border-primary-700 border-opacity-10",
        "h-[30px]"
      )}
    >
      <div className="flex justify-start space-x-2">
        <Button
          lite
          onClick={() =>
            setSideBar((b) => (b === "explorer" ? undefined : "explorer"))
          }
          // active={sideBar === "explorer"}
        >
          <BiMenu />
        </Button>
        <Button
          lite
          onClick={() =>
            setSideBar((b) => (b === "outline" ? undefined : "outline"))
          }
          // active={sideBar === "outline"}
        >
          <BiSpreadsheet />
        </Button>
      </div>
      <div className="flex justify-end space-x-2">
        <Delete />
        <Button lite onClick={handleSave}>
          <BiSave />
        </Button>
        {showStats && <TextCounter text={text} />}
      </div>
    </div>
  );
};

export default StatusBar;
