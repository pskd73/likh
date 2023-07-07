import JSZip from "jszip";
import { textToTitle } from "../../Note";
import { blobToB64, download } from "../../util";
import { getImage } from "./db";
import { NoteMeta, SavedNote } from "./type";
import saveAs from "file-saver";
import { MyPouch } from "./PouchDB";

export type DownloadableNote = {
  text: string;
  filename: string;
  mime: string;
};

export async function getDownloadableNote(
  note: SavedNote,
  pouch: MyPouch
): Promise<DownloadableNote> {
  let text = note.text;

  const imagesMatch = text.matchAll(/attachment:\/\/([0-9]+)/g) || [];
  for (const match of Array.from(imagesMatch)) {
    const id = match[1];
    const blob = await pouch.attachment(note.id, id);
    const uri = await blobToB64(blob);
    if (uri) {
      // text = text.replaceAll(match[0], uri as string);
    }
  }

  const title = textToTitle(note.text, 30).replace(/\.+$/, "");
  const filename = `${title}-${new Date().getTime()}.md`.replaceAll("/", "");

  return { text, filename, mime: "plain/text" };
}

export async function saveNote(note: SavedNote, pouch: MyPouch) {
  const { text, filename, mime } = await getDownloadableNote(note, pouch);
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
  notes: Record<string, SavedNote>,
  pouch: MyPouch
) {
  var zip = new JSZip();

  zip.file("notes", JSON.stringify(noteMeta));
  let i = 0;
  const limit = (window as any).limit || 10000;
  for (const id of Object.keys(notes)) {
    const savedNote = notes[id];
    const downloadableNote = await getDownloadableNote(savedNote, pouch);
    zip.file(downloadableNote.filename, downloadableNote.text);
    if (i >= limit) {
      break;
    }
    i++;
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
