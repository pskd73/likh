import { Note } from "../type";

export type NoteCollection = Record<string, Note>;

const STORAGE_KEY_NOTES = "notes";
const STORAGE_KEY_IDS = "ids";

const saveNoteCollection = (collection: NoteCollection) => {
  localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(collection));
};

export const getNoteCollection = (): NoteCollection => {
  const raw = localStorage.getItem(STORAGE_KEY_NOTES);
  if (!raw) {
    return {};
  }
  return JSON.parse(raw);
};

export const saveNote = (note: Note) => {
  const collection = getNoteCollection();
  collection[note.id] = note;
  saveNoteCollection(collection);
};

export const getNote = (id: string) => {
  return getNoteCollection()[id];
};

export const deleteNote = (id: number) => {
  const collection = getNoteCollection();
  delete collection[id];
  saveNoteCollection(collection);
};

export const getNextId = (type: string): number => {
  let rawIds = localStorage.getItem(STORAGE_KEY_IDS);
  if (!rawIds) {
    rawIds = "{}";
  }
  const ids = JSON.parse(rawIds);
  const prev = ids[type] || 0;
  const next = prev + 1;
  ids[type] = next;
  localStorage.setItem(STORAGE_KEY_IDS, JSON.stringify(ids));
  return ids[type];
};
