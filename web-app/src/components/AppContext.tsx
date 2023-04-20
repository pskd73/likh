import * as React from "react";
import {
  NoteCollection,
  getNoteCollection,
  saveNote as storageSaveNote,
  deleteNote as storageDeleteNote,
  getNextId,
} from "./localStorage";
import { createContext, useMemo, useState } from "react";
import { Note } from "../type";

export type TextMetricType = "words" | "readTime";

export type AppContextType = {
  collection?: NoteCollection;
  editingNoteId?: number;

  saveNote: (note: Note) => void;
  refresh: () => void;
  newNote: () => Note;
  deleteNote: (id: number) => void;
  setEditingNoteId: (id: number) => void;
  getEditingNote: () => undefined | Note;

  recentNote?: Note;

  focusMode: boolean;
  setFocusMode: (focusMode: boolean) => void;

  textMetricType: TextMetricType;
  setTextMetricType: (type: TextMetricType) => void;
  toggleTextMetricType: () => void;
};

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const useAppContext = (): AppContextType => {
  const [collection, setCollection] = useState<NoteCollection>(
    getNoteCollection()
  );
  const [editingNoteId, setEditingNoteId] = useState<number>();
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [textMetricType, setTextMetricType] = useState<TextMetricType>("words");
  const recentNote = useMemo(() => {
    if (collection && Object.keys(collection).length) {
      const keys = Object.keys(collection);
      return collection[keys[keys.length - 1]];
    }
  }, [Object.keys(collection).length]);

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

  const toggleTextMetricType = () => {
    if (textMetricType === "readTime") {
      setTextMetricType("words");
    }
    if (textMetricType === "words") {
      setTextMetricType("readTime");
    }
  };

  return {
    collection,
    editingNoteId,
    setEditingNoteId,

    saveNote,
    refresh,
    newNote,
    deleteNote,
    getEditingNote,
    recentNote,

    focusMode,
    setFocusMode,

    textMetricType,
    setTextMetricType,
    toggleTextMetricType
  };
};
