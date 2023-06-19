import { useEffect, useMemo, useState } from "react";
import { NoteMeta, SavedNote } from "./type";
import { INTRO_TEXT } from "./Intro";

const getNoteMetas = (): Promise<NoteMeta[]> => {
  return JSON.parse(localStorage.getItem("notes") || "[]");
};

const setNoteMetas = (notes: NoteMeta[]) => {
  localStorage.setItem("notes", JSON.stringify(notes));
};

const saveNote = (note: SavedNote) => {
  localStorage.setItem(`note/${note.id}`, JSON.stringify(note));
};

const getNote = (id: string): Promise<SavedNote | undefined> => {
  const raw = localStorage.getItem(`note/${id}`);
  if (raw) {
    return Promise.resolve(JSON.parse(raw));
  }
  return Promise.resolve(undefined);
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
    setNoteMetas(newNotes);
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
    setNoteMetas(newNotes);
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
