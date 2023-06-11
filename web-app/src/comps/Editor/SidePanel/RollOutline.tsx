import { useContext } from "react";
import { EditorContext } from "../Context";
import moment from "moment";

const RollOutline = () => {
  const { notes } = useContext(EditorContext);

  const handleClick = (id: string) => {
    window.location.href = `#note-${id}`;
  };

  return (
    <div className="text-sm p-2">
      <ul className="list-disc pl-4 space-y-1">
        {Object.keys(notes).map((id) => (
          <li
            key={id}
            onClick={() => handleClick(id)}
            className="hover:underline cursor-pointer"
          >
            {moment(new Date(notes[id].created_at)).format(
              "MMMM Do YYYY, h:mm:ss a"
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RollOutline;
