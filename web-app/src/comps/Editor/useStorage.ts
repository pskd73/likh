import { useEffect, useState } from "react";
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

const getNoteMetas = async (): Promise<NoteMeta[]> => {
  return (await Pouch.all()).rows;
};

const saveNoteImmediate = (note: SavedNote) => {
  Pouch.put(note.id, (doc) => {
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

const getNote = (id: string): Promise<SavedNote | undefined> => {
  return Pouch.get(id);
};

const deleteNote = (id: string): Promise<void> => {
  return Pouch.del(id);
};

export type Storage = {
  notes: NoteMeta[];
  newNote: (text: string, date?: number) => SavedNote;
  getNote: (id: string) => Promise<SavedNote | undefined>;
  getRecentNote: () => Promise<SavedNote>;
  saveNote: (note: SavedNote) => void;
  search: (text: string) => Promise<SavedNote[]>;
  delete: (id: string) => void;
};

const useStorage = (): Storage => {
  const [notes, setNotes] = useState<NoteMeta[]>([]);

  useEffect(() => {
    (async () => {
      setNotes(await getNoteMetas());
    })();
  }, []);

  const newNote = (text: string, date?: number) => {
    const id = new Date().getTime().toString();
    const newNote = { id, text, created_at: date || new Date().getTime() };
    const newNotes = [
      ...notes,
      {
        id,
      },
    ];
    // setNoteMetas(newNotes);
    saveNote(newNote);
    setNotes(newNotes);
    return newNote;
  };

  const getRecentNote = async () => {
    const noteMetas = await getNoteMetas();
    const note = noteMetas.length
      ? await getNote(noteMetas[noteMetas.length - 1].id)
      : undefined;
    if (note) {
      return note;
    }
    return newNote(INTRO_TEXT);
  };

  const search = async (text: string) => {
    const metas = await getNoteMetas();
    const notes: SavedNote[] = [];
    for (const nm of metas) {
      const note = await getNote(nm.id);
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
    deleteNote(id);
    // setNoteMetas(newNotes);
  };

  return {
    notes,
    newNote,
    getNote,
    getRecentNote,
    saveNote,
    search,
    delete: _delete,
  };
};

export default useStorage;
