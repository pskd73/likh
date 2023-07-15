import { useContext, useState } from "react";
import Button from "src/comps/Button";
import { RiDeleteBinLine } from "react-icons/ri";
import { BiCheck, BiX } from "react-icons/bi";
import { EditorContext } from "src/App/Context";
import Tooltip from "src/comps/Tooltip";
import { useNavigate } from "react-router-dom";

const Delete = () => {
  const { deleteNote, note } = useContext(EditorContext);
  const [prompt, setPrompt] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (note) {
      deleteNote(note.id);
      setPrompt(false);
      navigate("/write");
    }
  };

  if (!prompt) {
    return (
      <Tooltip tip={"Delete"} direction="top">
        <Button className="rounded-none" lite onClick={() => setPrompt(true)}>
          <RiDeleteBinLine />
        </Button>
      </Tooltip>
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
