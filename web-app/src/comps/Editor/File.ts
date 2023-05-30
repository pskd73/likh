import { textToTitle } from "../../Note";
import { download } from "../../util";
import { SavedNote } from "./type";

export function saveNote(note: SavedNote) {
  const title = textToTitle(note.text, 30).replace(/\.+$/, "");
  const filename = `${title}-${new Date().getTime()}.md`;
  download(note.text, filename, "plain/text");
}
