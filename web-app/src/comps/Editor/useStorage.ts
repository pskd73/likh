import { useState } from "react";
import { NoteMeta, SavedNote } from "./type";
import { Note } from "../../type";

const getNoteMetas = (): NoteMeta[] => {
  return JSON.parse(localStorage.getItem("notes") || "[]");
};

const setNoteMetas = (notes: NoteMeta[]) => {
  localStorage.setItem("notes", JSON.stringify(notes));
};

const saveNote = (note: SavedNote) => {
  localStorage.setItem(`note/${note.id}`, JSON.stringify(note));
};

const getNote = (id: string): SavedNote | undefined => {
  const raw = localStorage.getItem(`note/${id}`);
  if (raw) {
    return JSON.parse(raw);
  }
};

export type Storage = {
  notes: NoteMeta[];
  newNote: (text: string) => void;
  getNote: (id: string) => SavedNote | undefined;
  getRecentNote: () => SavedNote;
  saveNote: (note: SavedNote) => void;
};

const useStorage = (): Storage => {
  const [notes, setNotes] = useState<NoteMeta[]>(getNoteMetas());

  const newNote = (text: string) => {
    const id = new Date().getTime().toString();
    const newNote = { id, text, created_at: new Date().getTime() };
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

  const getRecentNote = () => {
    const noteMetas = getNoteMetas();
    const note = noteMetas.length
      ? getNote(noteMetas[noteMetas.length - 1].id)
      : undefined;
    if (note) {
      return note;
    }
    return newNote("New note");
  };

  return {
    notes,
    newNote,
    getNote,
    getRecentNote,
    saveNote,
  };
};

export default useStorage;
