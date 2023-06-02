import { useContext } from "react";
import { EditorContext } from "../Context";
import TextCounter from "./TextCounter";
import Button from "../../Button";
import { BiSave } from "react-icons/bi";
import { saveNote } from "../File";
import Delete from "./Delete";
import classNames from "classnames";

const StatusBar = ({ text }: { text: string }) => {
  const { showStats, note } = useContext(EditorContext);

  const handleSave = () => {
    saveNote(note);
  };

  return (
    <div
      className={classNames(
        "bottom-0 w-full right-0 z-10 flex justify-end space-x-2",
        "bg-base shadow-2xl border-t border-primary-700 border-opacity-10",
        "h-[30px]"
      )}
    >
      <Delete />
      <Button lite onClick={handleSave}>
        <BiSave />
      </Button>
      {showStats && <TextCounter text={text} />}
    </div>
  );
};

export default StatusBar;
