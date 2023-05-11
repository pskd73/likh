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
import { createContext, useState } from "react";
import { User, Note, Settings, Suggestion, Topic } from "../type";

export type TextMetricType = "words" | "readTime";

export type AppContextType = {
  notes: NoteCollection;
  setNotes: (notes: NoteCollection) => void;

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

  user?: User | null;
  setUser: (
    user?: User | null | ((old?: User | null) => User | null | undefined)
  ) => void;
};

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const useAppContext = (): AppContextType => {
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
  const [user, setUser] = useState<User | null>();
  const [notes, setNotes] = useState<NoteCollection>({});

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

    user,
    setUser,

    notes,
    setNotes,
  };
};
