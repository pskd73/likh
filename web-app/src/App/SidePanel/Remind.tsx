import { BiAlarm } from "react-icons/bi";
import List from "App/List";
import moment from "moment";
import { ChangeEventHandler, useContext } from "react";
import { getGoogleCalendarLink } from "App/Reminder";
import { textToTitle } from "src/Note";
import { EditorContext } from "App/Context";

const Remind = () => {
  const { note, updateNote, storage } = useContext(EditorContext);

  const handleReminder: ChangeEventHandler<HTMLSelectElement> = (e) => {
    if (!e.target.value) return;

    if (!note) return;

    const updatedNote = { ...note };

    if (e.target.value === "clear") {
      updatedNote.reminder = undefined;
      return updateNote(updatedNote);
    }

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
      <List.Item withIcon noHover>
        <List.Item.Icon>
          <BiAlarm />
        </List.Item.Icon>
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between">
            <span>Remind me</span>
            <select
              className="p-1 px-2 rounded cursor-pointer"
              onChange={handleReminder}
            >
              <option value={""}>
                {note?.reminder
                  ? moment(new Date(note.reminder.date)).fromNow()
                  : "Select .."}
              </option>
              <option value={"tonight"}>Tonight</option>
              <option value={"tomorrow"}>Tomorrow</option>
              <option value={"2 days"}>After 2 days</option>
              <option value={"a week"}>After a week</option>
              {note?.reminder && <option value={"clear"}>Clear</option>}
            </select>
          </div>
        </div>
      </List.Item>
    </List>
  );
};

export default Remind;
