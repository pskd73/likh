import moment from "moment";

export const scrollTo = ({
  noteId,
  date,
}: {
  noteId?: string;
  date?: Date;
}) => {
  let className: string | undefined = undefined;

  if (noteId) {
    className = `note-${noteId}`;
  }
  if (date) {
    className = `note-date-${moment(date).format("YYYY-MM-DD")}`;
  }

  if (className) {
    document
      .querySelector(`.${className}`)
      ?.scrollIntoView({ block: "start", behavior: "smooth" });
  }
};
