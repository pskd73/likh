import { useContext, useState } from "react";
import { EditorContext } from "../Context";
import Button from "src/comps/Button";
import moment from "moment";
import { isMobile } from "../device";

const CreatedTime = () => {
  const { note } = useContext(EditorContext);
  const [showCreatedTime, setShowCreatedTime] = useState(true);

  if (!note || isMobile) return null;

  return (
    <Button
      className="rounded-none text-xs"
      lite
      onClick={() => setShowCreatedTime((t) => !t)}
    >
      {showCreatedTime || !note.updated_at ? (
        <span>
          Created at{" "}
          {moment(new Date(note.created_at)).format("DD MMM, hh:mm A")}
        </span>
      ) : (
        <span>
          Edited at {moment(new Date(note.updated_at)).format("DD MMM, hh:mm A")}
        </span>
      )}
    </Button>
  );
};

export default CreatedTime;
