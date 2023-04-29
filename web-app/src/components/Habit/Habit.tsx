import { useContext } from "react";
import { AppContext } from "../AppContext";
import Clickable from "../Clickable";
import Toolbar from "../Toolbar";
import TrayExpandIcon from "../TrayExpandIcon";
import Topics from "./Topics";
import Suggestions from "./Suggestions";
import ScrollableCol from "../ScrollableCol";
import Event from "../Event";
import Streak from "./Streak";

const formatDate = (dateTime: Date) => {
  return [
    dateTime.getUTCFullYear(),
    pad(dateTime.getUTCMonth() + 1),
    pad(dateTime.getUTCDate()),
    "T",
    pad(dateTime.getUTCHours()),
    pad(dateTime.getUTCMinutes()) + "00Z",
  ].join("");
};

const pad = (num: number) => {
  return num < 10 ? "0" + num : num;
};

const Habit = () => {
  const { trayOpen, setActiveTray, setTrayOpen } = useContext(AppContext);

  const handleTitleClick = () => {
    setActiveTray("habit");
    setTrayOpen(!trayOpen);
  };

  const handleAddToCalendar = () => {
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);
    const start = dayStart.getTime() + 21 * 60 * 60 * 1000;
    const end = start + 60 * 60 * 1000;
    let url = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      "DTSTART:" + formatDate(new Date(start)),
      "DTEND:" + formatDate(new Date(end)),
      "SUMMARY:Write on Retro Note",
      "DESCRIPTION:Build writing habits",
      "LOCATION:On Retro Note",
      "RRULE:FREQ=DAILY;COUNT=3;INTERVAL=1",
      "BEGIN:VALARM",
      "TRIGGER:-PT15M",
      "REPEAT:1",
      "DURATION:PT15M",
      "ACTION:DISPLAY",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n");

    const uri = encodeURI("data:text/calendar;charset=utf8," + url);

    var downloadLink = document.createElement("a");
    downloadLink.href = uri;
    downloadLink.download = "Write event.ics";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleAddToGoogleCalendar = () => {
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);
    const start = dayStart.getTime() + 21 * 60 * 60 * 1000;
    const end = start + 60 * 60 * 1000;

    const parts = [
      "action=TEMPLATE",
      "dates=" + formatDate(new Date(start)) + "/" + formatDate(new Date(end)),
      "text=Write on Retro Note",
      "location=Retro Note",
      "recur=RRULE:FREQ%3DDAILY;INTERVAL%3D1",
    ];
    Event.track("add_to_calendar");
    window.open(
      "https://calendar.google.com/calendar/event?" + parts.join("&"),
      "_blank"
    );
  };

  return (
    <div>
      <div className="flex">
        <ScrollableCol className="p-4 w-8/12">
          <Suggestions />
        </ScrollableCol>
        <ScrollableCol className="p-4 w-4/12 space-y-6">
          <Streak />
          <Topics />
        </ScrollableCol>
      </div>
      <Toolbar className="bg-white">
        <Toolbar.Title>
          <Clickable>
            <span onClick={handleTitleClick}>
              <TrayExpandIcon />
              Habit
            </span>
          </Clickable>
        </Toolbar.Title>
        <Toolbar.MenuList>
          {/* <li>
            <Clickable lite onClick={handleAddToCalendar}>
              add to calendar &rarr;
            </Clickable>
          </li> */}
          <li>
            <Clickable lite onClick={handleAddToGoogleCalendar}>
              add to calendar &rarr;
            </Clickable>
          </li>
        </Toolbar.MenuList>
      </Toolbar>
    </div>
  );
};

export default Habit;
