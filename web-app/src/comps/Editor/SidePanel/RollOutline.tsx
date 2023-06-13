import { useContext, useMemo, useState } from "react";
import { EditorContext } from "../Context";
import moment from "moment";
import Calendar, { CalenderDay } from "../Calendar";
import Button from "../../Button";
import { BiCalendarEvent, BiFile, BiMap, BiPlus } from "react-icons/bi";
import List from "../List";
import { SavedNote } from "../type";

const scrollToClassName = (className: string) => {
  if (className) {
    document.querySelector(`.${className}`)?.scrollIntoView(true);
  }
};

const RollOutline = () => {
  const { notes, newNote, rollHashTag } = useContext(EditorContext);

  const notesMap = useMemo(() => {
    const _map: Record<string, SavedNote[]> = {};
    Object.values(notes).forEach((note) => {
      const key = moment(note.created_at).format("YYYY-MM-DD");
      if (!_map[key]) {
        _map[key] = [];
      }
      _map[key].push(note);
    });
    return _map;
  }, [notes]);

  const notesCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.keys(notesMap).forEach((key) => {
      counts[key] = notesMap[key].length;
    });
    return counts;
  }, [notesMap]);

  const [date, setDate] = useState<CalenderDay>({
    dt: new Date(),
    today: false,
    otherMonth: false,
    count: 0,
  });

  const notesToShow = useMemo(() => {
    return notesMap[moment(date.dt).format("YYYY-MM-DD")] || [];
  }, [date, notesMap]);

  const handleClick = (id: string) => {
    window.location.href = `#note-${id}`;
  };

  const handleNew = () => {
    newNote(
      {
        text: `${rollHashTag}\nWrite your day ...`,
        created_at: date.dt.getTime(),
      },
      false
    );
  };

  const handleDayChange = (day: CalenderDay) => {
    scrollToClassName(`note-date-${moment(day.dt).format("YYYY-MM-DD")}`);
    setDate(day);
  };

  const handleToday = () => {
    // setDay();
  };

  return (
    <div className="text-sm p-2">
      <Calendar
        counts={notesCounts}
        onCellClick={handleDayChange}
        active={date.dt}
      />
      <div className="my-4 mt-10 flex justify-between">
        <div className="text-lg flex items-center space-x-2">
          <span>
            <BiCalendarEvent />
          </span>
          <span>{moment(date.dt).format("MMMM Do YYYY")}</span>
        </div>
        <div className="space-x-1">
          {!date.today && (
            <Button onClick={handleToday} lite>
              <BiMap />
            </Button>
          )}
          {!date.today && (
            <Button onClick={handleNew}>
              <BiPlus />
            </Button>
          )}
        </div>
      </div>
      <List>
        {notesToShow.map((note, i) => (
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
