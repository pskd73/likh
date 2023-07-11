import moment from "moment";

export const scrollTo = ({
  noteId,
  date,
  title
}: {
  noteId?: string;
  date?: Date;
  title?: string
}) => {
  let className: string | undefined = undefined;
  let selector: string | undefined = undefined;

  if (noteId) {
    selector = `.note-${noteId}`;
  }
  if (date) {
    selector = `.note-date-${moment(date).format("YYYY-MM-DD")}`;
  }
  if (title) {
    selector = `[data-title-slug=${title}]`
  }

  if (selector) {
    document
      .querySelector(selector)
      ?.scrollIntoView({ block: "start", behavior: "smooth" });
  }
};
