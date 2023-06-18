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

export const getGoogleCalendarLink = ({
  text,
  date,
  location,
}: {
  text: string;
  date: Date;
  location: string;
}) => {
  const dayStart = date;
  dayStart.setHours(0, 0, 0, 0);
  const start = dayStart.getTime() + 21 * 60 * 60 * 1000;
  const end = start + 60 * 60 * 1000;

  const parts = [
    "action=TEMPLATE",
    "dates=" + formatDate(new Date(start)) + "/" + formatDate(new Date(end)),
    "text=" + encodeURIComponent(text),
    "location=" + location,
    "recur=RRULE:FREQ%3DDAILY;INTERVAL%3D1",
  ];
  return "https://calendar.google.com/calendar/event?" + parts.join("&");
};
