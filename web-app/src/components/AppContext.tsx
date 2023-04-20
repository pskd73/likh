import * as React from "react";
import {
  NoteCollection,
  getNoteCollection,
  saveNote as storageSaveNote,
  deleteNote as storageDeleteNote,
  getNextId,
} from "./localStorage";
import { createContext, useState } from "react";
import { Note } from "../type";

type AppContextType = {
  collection?: NoteCollection;
  editingNoteId?: number;

  saveNote: (note: Note) => void;
  refresh: () => void;
  newNote: () => Note;
  deleteNote: (id: number) => void;
  setEditingNoteId: (id: number) => void;
  getEditingNote: () => undefined | Note;
  getRecentNote: () => undefined | Note;
};

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const useAppContext = (): AppContextType => {
  const [collection, setCollection] = useState<NoteCollection>(
    getNoteCollection()
  );
  const [editingNoteId, setEditingNoteId] = useState<number>();

  const saveNote = (note: Note) => {
    storageSaveNote(note);
    refresh();
  };

  const refresh = () => {
    setCollection(getNoteCollection());
  };

  const newNote = () => {
    const id = getNextId("note");
    const note: Note = {
      id,
      title: `My note #${id}`,
      text: "Write here ...",
      createdAt: new Date().getTime(),
      hashtags: [],
    };
    saveNote(note);
    return note;
  };

  const deleteNote = (id: number) => {
    storageDeleteNote(id);
    refresh();
  };

  const getEditingNote = () => {
    if (editingNoteId && collection) {
      return collection[editingNoteId];
    }
  };

  const getRecentNote = () => {
    if (collection && Object.keys(collection).length) {
      const keys = Object.keys(collection);
      return collection[keys[keys.length - 1]]
    }
  }

  return {
    collection,
    editingNoteId,
    setEditingNoteId,

    saveNote,
    refresh,
    newNote,
    deleteNote,
    getEditingNote,
    getRecentNote
  };
};
