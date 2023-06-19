import { BiAlarm, BiAlarmExclamation } from "react-icons/bi";
import List from "../../List";
import moment from "moment";
import { ChangeEventHandler, useContext } from "react";
import { getGoogleCalendarLink } from "../../Reminder";
import { textToTitle } from "../../../../Note";
import { EditorContext } from "../../Context";

const Remind = () => {
  const { note, updateNote } = useContext(EditorContext);

  const handleReminder: ChangeEventHandler<HTMLSelectElement> = (e) => {
    let date = moment(new Date());
    if (e.target.value === "tonight") {
      date = date.hours(21).minutes(0);
    } else if (e.target.value === "tomorrow") {
      date = date.add(1, "days");
    } else if (e.target.value === "2 days") {
      date = date.add(2, "days");
    } else if (e.target.value === "a week") {
      date = date.add(7, "days");
    }

    const updatedNote = { ...note };
    updatedNote.reminder = {
      date: date.toDate().getTime(),
    };
    updateNote(updatedNote);

    const link = getGoogleCalendarLink({
      text: `Continue writing "${textToTitle(note.text)}"`,
      date: date.toDate(),
      location: "https://app.retronote.app/write",
    });
    window.open(link, "_blank");
  };

  return (
    <List>
      {note.reminder && (
        <List.Item withIcon noHover>
          <List.Item.Icon>
            <BiAlarmExclamation />
          </List.Item.Icon>
          <div>
            Reminder{" "}
            <span className="font-bold">
              {moment(new Date(note.reminder.date)).fromNow()}
            </span>
          </div>
        </List.Item>
      )}
      <List.Item withIcon noHover>
        <List.Item.Icon>
          <BiAlarm />
        </List.Item.Icon>
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between">
            <span>Remind at</span>
            <select
              className="p-1 rounded cursor-pointer"
              onChange={handleReminder}
            >
              <option value={""}>Select ...</option>
              <option value={"tonight"}>Tonight</option>
              <option value={"tomorrow"}>Tomorrow</option>
              <option value={"2 days"}>After 2 days</option>
              <option value={"a week"}>After a week</option>
            </select>
          </div>
        </div>
      </List.Item>
    </List>
  );
};

export default Remind;
