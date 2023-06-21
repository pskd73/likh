import { NoteMeta, SavedNote } from "./type";
import * as Pouch from "./PouchDB";

export async function migrate(pouch: Pouch.MyPouch, key: string) {
  const metas: NoteMeta[] = JSON.parse(localStorage.getItem("notes") || "[]");
  for (const meta of metas) {
    let raw = localStorage.getItem(`note/${meta.id}`);
    const note: (SavedNote & { movedTo?: string[] }) | undefined =
      raw && JSON.parse(raw);
    if (note) {
      const movedTo = note.movedTo || [];
      if (!movedTo.includes(key)) {
        await pouch.put(note.id, () => ({ ...note, _id: note.id }));

        localStorage.setItem(
          `note/${note.id}`,
          JSON.stringify({ ...note, movedTo: [...movedTo, key] })
        );
      }
    }
  }
}
