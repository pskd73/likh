import { useEffect, useState } from "react";
import { NoteMeta, SavedNote } from "./type";
import * as Pouch from "./PouchDB";

const lastSaved: Record<string, { time: number; timeout?: NodeJS.Timeout }> =
  {};

const shouldSave = (id: string) => {
  if (!lastSaved[id]) {
    return true;
  }
  if (new Date().getTime() - lastSaved[id].time > 4 * 1000) {
    return true;
  }
};

export type Storage = {
  notes: NoteMeta[];
  newNote: (text: string, date?: number, id?: string) => SavedNote | undefined;
  getNote: (id: string) => Promise<SavedNote | undefined>;
  getRecentNote: () => Promise<SavedNote | undefined>;
  saveNote: (note: SavedNote) => void;
  search: (text: string) => Promise<SavedNote[]>;
  delete: (id: string) => Promise<void>;
  pouch: Pouch.MyPouch;
  lastSavedAt: number;
};

const useStorage = (pdb: Pouch.PouchContextType): Storage => {
  const [notes, setNotes] = useState<NoteMeta[]>([]);
  const [lastSavedAt, setLastSavedAt] = useState(new Date().getTime());

  useEffect(() => {
    (async () => {
      setNotes((await pdb.db.all()).rows);
    })();
  }, [pdb.pulled]);

  const saveNoteImmediate = async (note: SavedNote) => {
    await pdb.db.put(note.id, (doc) => {
      if (doc === undefined) {
        return { ...note, _id: note.id };
      }
      return {
        ...doc,
        text: note.text,
        serialized: note.serialized,
        reminder: note.reminder,
        updated_at: note.updated_at,
        deleted: note.deleted,
      };
    });
    setNotes((_notes) => [..._notes, { id: note.id }]);
    lastSaved[note.id].time = new Date().getTime();
    setLastSavedAt(lastSaved[note.id].time);
  };

  const saveNote = (note: SavedNote) => {
    if (!lastSaved[note.id]) {
      lastSaved[note.id] = { time: -1 };
    }
    if (lastSaved[note.id].timeout) {
      clearTimeout(lastSaved[note.id].timeout);
    }
    if (shouldSave(note.id)) {
      return saveNoteImmediate(note);
    }
    lastSaved[note.id].timeout = setTimeout(() => {
      saveNoteImmediate(note);
    }, 1.5 * 1000);
  };

  const newNote = (text: string, date?: number, id?: string) => {
    id = id || new Date().getTime().toString();
    if (notes.filter((n) => n.id === id).length) return;
    const newNote = { id, text, created_at: date || new Date().getTime() };
    saveNote(newNote);
    return newNote;
  };

  const getRecentNote = async () => {
    const noteMetas = (await pdb.db.all()).rows;
    for (const meta of noteMetas) {
      const note = noteMetas.length
        ? await pdb.db.get<SavedNote>(meta.id)
        : undefined;
      if (note) {
        return note;
      }
    }
  };

  const search = async (text: string) => {
    const metas = (await pdb.db.all()).rows;
    const notes: SavedNote[] = [];
    for (const nm of metas) {
      const note = await pdb.db.get<SavedNote>(nm.id);
      if (note) {
        notes.push(note);
      }
    }
    return notes.filter((note) => {
      return note.text.toLowerCase().includes(text.toLowerCase());
    });
  };

  const _delete = async (id: string): Promise<void> => {
    const newNotes = [...notes];
    const idx = newNotes.findIndex((note) => note.id === id);
    if (idx === -1) return;
    await pdb.db.del(id);
    newNotes.splice(idx, 1);
    setNotes(newNotes);
  };

  return {
    notes,
    newNote,
    getNote: pdb.db.get,
    getRecentNote,
    saveNote,
    search,
    delete: _delete,
    pouch: pdb.db,
    lastSavedAt,
  };
};

export default useStorage;
