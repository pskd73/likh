import { useContext, useState } from "react";
import Button from "../../Button";
import { RiDeleteBinLine } from "react-icons/ri";
import { BiCheck, BiX } from "react-icons/bi";
import { EditorContext } from "../Context";

const Delete = () => {
  const { deleteNote, note } = useContext(EditorContext);
  const [prompt, setPrompt] = useState(false);

  const handleConfirm = () => {
    deleteNote(note.id);
    setPrompt(false);
  };

  if (!prompt) {
    return (
      <Button className="rounded-none" lite onClick={() => setPrompt(true)}>
        <RiDeleteBinLine />
      </Button>
    );
  }
  return (
    <div className="text-sm flex items-center space-x-2">
      <span className="text-xs">Sure?</span>
      <div className="space-x-1">
        <Button onClick={handleConfirm}>
          <BiCheck />
        </Button>
        <Button onClick={() => setPrompt(false)}>
          <BiX />
        </Button>
      </div>
    </div>
  );
};

export default Delete;
