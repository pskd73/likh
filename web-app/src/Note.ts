import { Note } from "./type";

export const textToTitle = (text: string, max?: number) => {
  const MAX_LENGTH = 100;
  max = max || MAX_LENGTH;

  let cleaned = text;
  const titleMatch = cleaned.match(/^\n*#{1,3} (.*)\n*.*/);
  if (titleMatch) {
    cleaned = titleMatch[1];
  }
  cleaned = cleaned.replaceAll(/\B(#[a-zA-Z_/]+)(?!;)/g, "");
  cleaned = cleaned.trim().split("\n")[0];
  return (
    cleaned.replaceAll("\n", " ").substring(0, max) +
    (cleaned.length > max ? "..." : "")
  );
};

export const getNoteTitle = (note: Note) => {
  if (note.title) {
    return note.title;
  }
  if (note.text) {
    return textToTitle(note.text);
  }
  return note.title;
};

export const isLinked = (phrase: string, text: string) => {
  const title = textToTitle(text);
  return title.toLowerCase().trim().startsWith(phrase.toLowerCase().trim());
};

export const titleCase = (text: string) => {
  var splitStr = text.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(" ");
};
