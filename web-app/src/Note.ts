import { marked } from "marked";
import { Note } from "./type";
import { hashtag } from "./App/regex";

const MAX_FOCUS_LENGTH = 30;

export const textToTitle = (text: string, max?: number) => {
  const MAX_LENGTH = 100;
  max = max || MAX_LENGTH;

  let cleaned = text;
  const titleMatch = cleaned.match(/^\n*#{1,3} (.*)\n*.*/);
  if (titleMatch) {
    cleaned = titleMatch[1];
  }
  cleaned = cleaned.replaceAll(new RegExp(hashtag, "g"), "");
  cleaned = cleaned.trim().split("\n")[0];
  cleaned = marked
    .parse(cleaned, { mangle: false, headerIds: false })
    .replace(/<[^>]+>/g, "");

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

export const focus = (
  text: string,
  idx: number,
  term: string,
  max?: number
) => {
  max = max || MAX_FOCUS_LENGTH;
  const midIdx = idx + Math.floor(term.length / 2);
  const start = Math.max(0, midIdx - Math.floor(max / 2));
  const end = Math.min(text.length - 1, midIdx + Math.floor(max / 2));
  let focused = text.substring(start, end);
  if (start !== 0) {
    focused = "... " + focused;
  }
  if (end !== text.length - 1) {
    focused += " ...";
  }
  return { focused, start, end };
};
