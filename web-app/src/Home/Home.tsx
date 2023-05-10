import Clickable from "../components/Clickable";
import Goal from "./Goal";
import Streak from "./Streak";
import Suggestions from "./Suggestions";
import Topics from "./Topics";
import Event from "../components/Event";

const pad = (num: number) => {
  return num < 10 ? "0" + num : num;
};

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

const Home = () => {
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
    <div className="flex space-x-6">
      <div className="w-9/12 space-y-6">
        <Suggestions />
      </div>
      <div className="w-3/12 space-y-6">
        <div>
          <Clickable
            className="text-lg"
            lite
            onClick={handleAddToGoogleCalendar}
          >
            Add reminder &rarr;
          </Clickable>
        </div>
        <Streak />
        <Goal />
        <Topics />
      </div>
    </div>
  );
};

export default Home;
