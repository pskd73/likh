import * as React from "react";
import {
  NoteCollection,
  TopicCollection,
  getTopics,
  addTopic as storageAddTopic,
  deleteTopic as storageDeleteTopic,
  getSuggestions as storageGetSuggestions,
  setSuggestions as storageSetSuggestions,
  saveSettings as storageSaveSettings,
  getSettings,
} from "./localStorage";
import { createContext, useEffect, useMemo, useState } from "react";
import { LoggedInUser, Note, Settings, Suggestion, Topic } from "../type";
import * as api from "./api";

export type TextMetricType = "words" | "readTime";

export type AppContextType = {
  collection?: NoteCollection;
  editingNoteId?: string;

  saveNote: (note: Note) => void;
  refresh: () => void;
  newNote: (title: string, text: string) => Promise<Note>;
  deleteNote: (id: string) => void;
  setEditingNoteId: (id: string) => void;
  getEditingNote: () => undefined | Note;

  recentNote?: Note;

  focusMode: boolean;
  setFocusMode: (focusMode: boolean | ((old: boolean) => boolean)) => void;

  textMetricType: TextMetricType;
  setTextMetricType: (type: TextMetricType) => void;
  toggleTextMetricType: () => void;

  trayOpen: boolean;
  activeTray: string;
  setTrayOpen: (open: boolean) => void;
  setActiveTray: (key: string) => void;

  topicCollection?: TopicCollection;
  addTopic: (topic: Topic) => void;
  deleteTopic: (name: string) => void;

  suggestions: Suggestion[];
  setSuggestions: (suggestions: Suggestion[]) => void;

  settings: Settings;
  saveSettings: (settings: Settings) => void;

  loggedInUser?: LoggedInUser;
  setLoggedInUser: (user?: LoggedInUser) => void;

  loading: boolean;
};

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const useAppContext = (): AppContextType => {
  const [collection, setCollection] = useState<NoteCollection>({});
  const [editingNoteId, setEditingNoteId] = useState<string>();
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [textMetricType, setTextMetricType] = useState<TextMetricType>("words");
  const [trayOpen, setTrayOpen] = useState(false);
  const [activeTray, setActiveTray] = useState("write");
  const [topicCollection, setTopicCollection] = useState<TopicCollection>(
    getTopics()
  );
  const [suggestions, setSuggestions] = useState<Suggestion[]>(
    storageGetSuggestions()
  );
  const [settings, setSettings] = useState<Settings>(getSettings());
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser>();
  const [loading, setLoading] = useState(true);

  const recentNote = useMemo(() => {
    if (collection && Object.keys(collection).length) {
      const keys = Object.keys(collection);
      return collection[keys[keys.length - 1]];
    }
  }, [Object.keys(collection).length]);

  useEffect(() => {
    (async () => {
      refresh();
    })();
  }, [loggedInUser]);

  const saveNote = (note: Note) => {
    setCollection({ ...collection, [note.id]: note });
    api.saveNote(loggedInUser!, note);
  };

  const refresh = async () => {
    if (loggedInUser) {
      setLoading(true);
      setCollection(await api.getNotes(loggedInUser));
      setLoading(false);
    }
  };

  const newNote = async (title: string, text: string) => {
    const note = await api.createNote(loggedInUser!, title, text);
    setCollection({ ...collection, [note.id]: note });
    return note;
  };

  const deleteNote = async (id: string) => {
    await api.deleteNote(loggedInUser!, id);
    const coll = { ...collection };
    delete coll[id];
    setCollection(coll);
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

  const addTopic = (topic: Topic) => {
    storageAddTopic(topic);
    setTopicCollection(getTopics());
  };

  const deleteTopic = (name: string) => {
    storageDeleteTopic(name);
    setTopicCollection(getTopics());
  };

  const setSuggestions_ = (suggestions: Suggestion[]) => {
    storageSetSuggestions(suggestions);
    setSuggestions(suggestions);
  };

  const saveSettings = (settings: Settings) => {
    storageSaveSettings(settings);
    setSettings(getSettings());
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
    toggleTextMetricType,

    trayOpen,
    setTrayOpen,
    activeTray,
    setActiveTray,

    topicCollection,
    addTopic,
    deleteTopic,

    suggestions,
    setSuggestions: setSuggestions_,

    settings,
    saveSettings,

    loggedInUser,
    setLoggedInUser,

    loading,
  };
};
