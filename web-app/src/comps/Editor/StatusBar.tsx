import { useContext } from "react";
import { EditorContext } from "./Context";
import TextCounter from "./TextCounter";
import Button from "../Button";
import { BiSave } from "react-icons/bi";
import { saveNote } from "./File";

const StatusBar = ({ text }: { text: string }) => {
  const { showStats, note } = useContext(EditorContext);

  const handleSave = () => {
    saveNote(note);
  };

  return (
    <div className="fixed bottom-0 w-full right-0 z-10 flex justify-end p-1 space-x-2">
      {
        <Button lite onClick={handleSave}>
          <BiSave />
        </Button>
      }
      {showStats && <TextCounter text={text} />}
    </div>
  );
};

export default StatusBar;
