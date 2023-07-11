import { useContext, useMemo, useState } from "react";
import { EditorContext } from "src/App/Context";
import moment from "moment";
import Calendar, { CalenderDay } from "src/App/Calendar";
import Button from "src/comps/Button";
import { BiCalendarEvent, BiFile, BiHash, BiMap, BiPlus } from "react-icons/bi";
import List from "src/App/List";
import { SavedNote } from "src/App/type";
import { scrollTo } from "src/App/scroll";
import { textToTitle } from "src/Note";
import Event from "src/components/Event";

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
    scrollTo({ noteId: id });
  };

  const handleNew = () => {
    Event.track("new_roll_note");
    const savedNote = newNote(
      {
        text: `${rollHashTag}\nWrite your day ...`,
        created_at: date.dt.getTime(),
      },
      false
    );
    setTimeout(() => {
      scrollTo({ noteId: savedNote!.id });
    }, 100);
  };

  const handleDayChange = (day: CalenderDay) => {
    scrollTo({ date: day.dt });
    setDate(day);
  };

  const handleToday = () => {
    scrollTo({ date: new Date() });
    setDate({
      dt: new Date(),
      today: true,
      otherMonth: false,
      count: 0,
    });
  };

  return (
    <div className="text-sm px-4">
      <div className="mb-4 text-2xl">
        <span className="pb-2 flex space-x-2 items-center font-bold">
          <span>
            <BiHash />
          </span>
          <span>{rollHashTag.replace(/^#+/, "").split("/").pop()}</span>
        </span>
        <hr />
      </div>
      <Calendar
        counts={notesCounts}
        onCellClick={handleDayChange}
        active={date.dt}
      />
      <div className="my-4 mt-10 flex items-center justify-between">
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
          <List.Item key={i} onClick={() => handleClick(note.id)}>
            <div className="flex space-x-2 items-center">
              <span>
                <BiFile />
              </span>
              <span>
                {moment(new Date(note.created_at)).format("h:mm:ss a")}
              </span>
            </div>
            <List.Item.Description>
              {textToTitle(note.text, 100)}
            </List.Item.Description>
          </List.Item>
        ))}
      </List>
    </div>
  );
};

export default RollOutline;
