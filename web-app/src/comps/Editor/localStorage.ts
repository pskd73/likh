import { NoteMeta, SavedNote } from "./type";
import * as Pouch from "./pouch";

export async function migrate() {
  const metas: NoteMeta[] = JSON.parse(localStorage.getItem("notes") || "[]");
  for (const meta of metas) {
    let raw = localStorage.getItem(`note/${meta.id}`);
    const note: (SavedNote & { moved?: boolean }) | undefined =
      raw && JSON.parse(raw);
    if (note && !note.moved) {
      await Pouch.put(note.id, () => ({ ...note, _id: note.id }));
      localStorage.setItem(
        `note/${note.id}`,
        JSON.stringify({ ...note, moved: true })
      );
    }
  }
}
