import JSZip from "jszip";
import { saveAs } from "file-saver";
import { NoteMeta, SavedNote } from "../type.d";

export function zipIt(noteMeta: NoteMeta[], notes: Record<string, SavedNote>) {
  var zip = new JSZip();

  zip.file("notes", JSON.stringify(noteMeta));
  for (const id of Object.keys(notes)) {
    const savedNote = notes[id];
    const text = JSON.stringify(savedNote);
    zip.file(id, text);
  }
  zip.file(
    "meta",
    JSON.stringify({
      createdAt: new Date().getTime(),
    })
  );
  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, `backup-${new Date().getTime()}.zip`);
  });
}
