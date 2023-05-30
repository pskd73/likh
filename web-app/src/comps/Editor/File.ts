import { textToTitle } from "../../Note";
import { download } from "../../util";
import { SavedNote } from "./type";

export function saveNote(note: SavedNote) {
  const title = textToTitle(note.text, 30).replace(/\.+$/, "");
  const filename = `${title}-${new Date().getTime()}.md`;
  download(note.text, filename, "plain/text");
}

export function openFile(): Promise<string | null | ArrayBuffer> {
  return new Promise((resolve, reject) => {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = ".md,.txt";

    input.onchange = (e) => {
      if (!e || !e.target) return;
      var file = (e.target as any).files[0];

      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");

      reader.onload = (readerEvent) => {
        if (readerEvent.target) {
          resolve(readerEvent.target.result);
        }
      };
    };

    input.click();
  });
}
