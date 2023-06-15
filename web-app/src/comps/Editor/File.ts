import JSZip from "jszip";
import { textToTitle } from "../../Note";
import { download } from "../../util";
import { getImage } from "./db";
import { NoteMeta, SavedNote } from "./type";
import saveAs from "file-saver";

export type DownloadableNote = {
  text: string;
  filename: string;
  mime: string;
};

export async function getDownloadableNote(
  note: SavedNote
): Promise<DownloadableNote> {
  let text = note.text;

  const imagesMatch = text.matchAll(/image:\/\/([0-9]+)/g) || [];
  for (const match of Array.from(imagesMatch)) {
    const id = Number(match[1]);
    const img = await getImage(id);
    text = text.replaceAll(match[0], img.uri);
  }

  const title = textToTitle(note.text, 30).replace(/\.+$/, "");
  const filename = `${title}-${new Date().getTime()}.md`;

  return { text, filename, mime: "plain/text" };
}

export async function saveNote(note: SavedNote) {
  const { text, filename, mime } = await getDownloadableNote(note);
  download(text, filename, mime);
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

export async function zipIt(
  noteMeta: NoteMeta[],
  notes: Record<string, SavedNote>
) {
  var zip = new JSZip();

  zip.file("notes", JSON.stringify(noteMeta));
  for (const id of Object.keys(notes)) {
    const savedNote = notes[id];
    const downloadableNote = await getDownloadableNote(savedNote);
    savedNote.text = downloadableNote.text;
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
