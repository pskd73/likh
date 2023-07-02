import { useContext, useMemo } from "react";
import { Title } from "./Common";
import { EditorContext } from "../Context";
import { getTimeline } from "../Timeline";
import { textToTitle } from "../../../Note";
import moment from "moment";
import { BiFile } from "react-icons/bi";
import { SavedNote } from "../type";

const Timeline = () => {
  const { notesToShow, setNote } = useContext(EditorContext);
  const timeline = useMemo(() => {
    return getTimeline(notesToShow);
  }, [notesToShow]);

  const handleNoteClick = (note: SavedNote) => {
    setNote(note);
  };

  if (!timeline) return null;

  return (
    <div>
      <Title>Timeline</Title>
      <ul className="space-y-2 max-h-[300px] overflow-y-scroll scrollbar-hide">
        {timeline.map((item, i) => (
          <li
            key={i}
            className="border border-primary border-opacity-20 rounded-md p-4"
          >
            <div className="text-xs text-primary text-opacity-50 font-bold flex items-center justify-between mb-2">
              <span>{moment(item.date).format("YYYY-MM-DD")}</span>
              <span className="whitespace-nowrap rounded-full bg-highlight bg-opacity-20 px-2.5 py-0.5 text-xs text-highlight text-opacity-80">
                {item.type.toUpperCase()}
              </span>
            </div>
            {item.text && <div className="text-xs">{item.text}</div>}
            <div
              className="text-xs mt-2 flex items-center space-x-1 text-primary text-opacity-50 hover:text-opacity-100 cursor-pointer"
              onClick={() => handleNoteClick(item.summary.note)}
            >
              <span>In - </span>
              <BiFile />
              <span>{textToTitle(item.summary.note.text)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Timeline;
