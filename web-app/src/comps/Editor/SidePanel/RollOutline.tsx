import { useContext, useState } from "react";
import { EditorContext } from "../Context";
import moment from "moment";
import Calendar, { CalenderDay } from "../Calendar";
import Button from "../../Button";
import { BiFile, BiPlus } from "react-icons/bi";
import List from "../List";

const scrollToClassName = (className: string) => {
  if (className) {
    document.querySelector(`.${className}`)?.scrollIntoView(true);
  }
};

const RollOutline = () => {
  const { notes, newNote, rollHashTag } = useContext(EditorContext);
  const [day, setDay] = useState<CalenderDay>({
    dt: new Date(),
    today: true,
    otherMonth: false,
    notes: [],
  });

  const handleClick = (id: string) => {
    window.location.href = `#note-${id}`;
  };

  const handleNew = () => {
    newNote(
      {
        text: `${rollHashTag}\nWrite your day ...`,
        created_at: day.dt.getTime(),
      },
      false
    );
  };

  const handleDayChange = (day: CalenderDay) => {
    scrollToClassName(`note-date-${moment(day.dt).format("YYYY-MM-DD")}`);
    setDay(day);
  };

  return (
    <div className="text-sm p-2">
      <Calendar
        notes={Object.values(notes)}
        onCellClick={handleDayChange}
        active={day.dt}
      />
      <div className="my-4 mt-10 flex justify-between">
        <span className="text-lg ">
          {moment(day.dt).format("MMMM Do YYYY")}
        </span>
        <span>
          {!day.today && (
            <Button onClick={handleNew}>
              <BiPlus />
            </Button>
          )}
        </span>
      </div>
      <List>
        {day.notes.map((note, i) => (
          <List.Item
            key={i}
            onClick={() => handleClick(note.id)}
            className="flex space-x-2 items-center"
          >
            <span>
              <BiFile />
            </span>
            <span>
              {moment(new Date(note.created_at)).format(
                "MMMM Do YYYY, h:mm:ss a"
              )}
            </span>
          </List.Item>
        ))}
      </List>
    </div>
  );
};

export default RollOutline;
