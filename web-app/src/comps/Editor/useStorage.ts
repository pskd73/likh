import { useEffect, useMemo, useState } from "react";
import { NoteMeta, SavedNote } from "./type";
import { INTRO_TEXT } from "./Intro";
import * as Pouch from "./pouch";

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
  newNote: (text: string, date?: number) => SavedNote;
  getNote: (id: string) => Promise<SavedNote | undefined>;
  getRecentNote: () => Promise<SavedNote>;
  saveNote: (note: SavedNote) => void;
  search: (text: string) => Promise<SavedNote[]>;
  delete: (id: string) => void;
  pouch: Pouch.MyPouch;
};

const useStorage = (): Storage => {
  const pouch = useMemo(() => {
    return Pouch.MakePouch("mysecret", {
      username: "admin",
      password: "password",
    });
  }, []);
  const [notes, setNotes] = useState<NoteMeta[]>([]);

  useEffect(() => {
    (async () => {
      setNotes((await pouch.all()).rows);
    })();
  }, []);

  const saveNoteImmediate = (note: SavedNote) => {
    pouch.put(note.id, (doc) => {
      if (doc === undefined) {
        return { ...note, _id: note.id };
      }
      return {
        ...doc,
        text: note.text,
        serialized: note.serialized,
        reminder: note.reminder,
      };
    });
    lastSaved[note.id].time = new Date().getTime();
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
    }, 4 * 1000);
  };

  const newNote = (text: string, date?: number) => {
    const id = new Date().getTime().toString();
    const newNote = { id, text, created_at: date || new Date().getTime() };
    const newNotes = [
      ...notes,
      {
        id,
      },
    ];
    saveNote(newNote);
    setNotes(newNotes);
    return newNote;
  };

  const getRecentNote = async () => {
    const noteMetas = (await pouch.all()).rows;
    const note = noteMetas.length
      ? await pouch.get<SavedNote>(noteMetas[noteMetas.length - 1].id)
      : undefined;
    if (note) {
      return note;
    }
    return newNote(INTRO_TEXT);
  };

  const search = async (text: string) => {
    const metas = (await pouch.all()).rows;
    const notes: SavedNote[] = [];
    for (const nm of metas) {
      const note = await pouch.get<SavedNote>(nm.id);
      if (note) {
        notes.push(note);
      }
    }
    return notes.filter((note) => {
      return note.text.toLowerCase().includes(text.toLowerCase());
    });
  };

  const _delete = (id: string) => {
    const newNotes = [...notes];
    const idx = newNotes.findIndex((note) => note.id === id);
    if (idx === -1) return;
    newNotes.splice(idx, 1);
    setNotes(newNotes);
    pouch.del(id);
  };

  return {
    notes,
    newNote,
    getNote: pouch.get,
    getRecentNote,
    saveNote,
    search,
    delete: _delete,
    pouch,
  };
};

export default useStorage;
