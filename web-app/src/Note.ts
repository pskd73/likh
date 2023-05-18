import { Note } from "./type";

export const getNoteTitle = (note: Note) => {
  if (note.title) {
    return note.title;
  }
  if (note.text) {
    const MAX_LENGTH = 100;

    let cleaned = note.text;
    const titleMatch = cleaned.match(/^\n*#{1,3} (.*)\n*.*/);
    if (titleMatch) {
      cleaned = titleMatch[1];
    }
    return (
      cleaned.replaceAll("\n", " ").substring(0, MAX_LENGTH) +
      (cleaned.length > MAX_LENGTH ? "..." : "")
    );
  }
  return note.title;
};
