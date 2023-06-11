import { createContext, useMemo, useState } from "react";
import { Storage } from "./useStorage";
import { NewNote, SavedNote } from "./type";
import { getNoteTitle, isLinked } from "../../Note";
import { LinkSuggestion, getLinkSuggestions } from "./Suggestion";

type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
type CountStatType = "words" | "readTime";

export type EditorContextType = {
  storage: Storage;

  sideBar: string | undefined;
  setSideBar: StateSetter<string | undefined>;

  activeSideMenus: string[];
  toggleSideMenu: (key: string) => void;
  isSideMenuActive: (key: string) => boolean;

  showStats: boolean;
  setShowStats: StateSetter<boolean>;

  typewriterMode: boolean;
  setTypewriterMode: StateSetter<boolean>;

  countStatType: CountStatType;
  setCountStatType: StateSetter<CountStatType>;

  note: SavedNote;
  updateNote: (note: SavedNote) => void;

  searchTerm: string;
  setSearchTerm: StateSetter<string>;

  notesToShow: SavedNote[];
  newNote: (note: NewNote) => void;

  deleteNote: (noteId: string) => void;

  getNoteByTitle: (title: string) => void;
  setOrNewNote: (title: string) => void;

  getHashtags: () => Record<string, SavedNote[]>;

  getLinkSuggestions: () => LinkSuggestion[];
};

export const EditorContext = createContext<EditorContextType>(
  {} as EditorContextType
);

export const useEditor = ({
  storage,
}: {
  storage: Storage;
}): EditorContextType => {
  const [sideBar, setSideBar] = useState<string | undefined>();
  const [activeSideMenus, setActiveSideMenus] = useState<string[]>([
    "notes",
    "settings",
  ]);
  const [showStats, setShowStats] = useState(true);
  const [typewriterMode, setTypewriterMode] = useState(false);
  const [countStatType, setCountStatType] = useState<CountStatType>("words");
  const [note, setNote] = useState<SavedNote>(storage.getRecentNote());
  const [searchTerm, setSearchTerm] = useState<string>("");

  const notesToShow = useMemo<SavedNote[]>(() => {
    if (searchTerm) {
      return storage.search(searchTerm);
    }
    return storage.notes
      .map((nm) => storage.getNote(nm.id))
      .filter((n) => !!n)
      .sort((a, b) => a?.created_at || 0 - (b?.created_at || 0)) as SavedNote[];
  }, [storage.notes, searchTerm, note]);

  const toggleSideMenu = (key: string) => {
    setActiveSideMenus((items) => {
      const _items = [...items];
      if (_items.includes(key)) {
        _items.splice(items.indexOf(key), 1);
      } else {
        _items.push(key);
      }
      return _items;
    });
  };

  const isSideMenuActive = (key: string) => activeSideMenus.includes(key);

  const updateNote = (note: SavedNote) => {
    storage.saveNote(note);
    setNote(note);
  };

  const newNote = (note: NewNote) => {
    const savedNote = storage.newNote(note.text);
    setNote(savedNote);
  };

  const deleteNote = (noteId: string) => {
    storage.delete(noteId);
    setNote(storage.getRecentNote());
  };

  const getNoteByTitle = (title: string) => {
    for (const noteMeta of storage.notes) {
      const note = storage.getNote(noteMeta.id);
      if (note) {
        const match = note.text.match(/^ *#{1,3} (.*)$/m);
        if (match) {
          if (match[1].toLowerCase() === title.toLowerCase()) {
            return note;
          }
        }
      }
    }
  };

  const setOrNewNote = (title: string) => {
    for (const meta of storage.notes) {
      const note = storage.getNote(meta.id);
      if (note) {
        if (isLinked(title, note.text)) {
          return setNote(note);
        }
      }
    }
    newNote({
      text: `# ${title}\nWrite more here`,
    });
  };

  const getHashtags = () => {
    const hashtagsMap: Record<string, Record<string, SavedNote>> = {};
    for (const noteMeta of notesToShow) {
      const note = storage.getNote(noteMeta.id);
      if (note) {
        const matches = note.text.match(/\B\#\w\w+\b/g);
        if (matches) {
          for (const hashtag of matches) {
            if (!hashtagsMap[hashtag]) {
              hashtagsMap[hashtag] = {};
            }
            hashtagsMap[hashtag][note.id] = note;
          }
        }
      }
    }
    const hashtags: Record<string, SavedNote[]> = {};
    for (const hashtag of Object.keys(hashtagsMap)) {
      hashtags[hashtag] = Object.values(hashtagsMap[hashtag]);
    }
    return hashtags;
  };

  const _getLinkSuggestions = () => {
    const notes = storage.notes.map((meta) => storage.getNote(meta.id));
    return getLinkSuggestions(notes.filter((n) => !!n) as SavedNote[]);
  };

  return {
    storage,

    sideBar,
    setSideBar,

    activeSideMenus,
    toggleSideMenu,
    isSideMenuActive,

    showStats,
    setShowStats,
    typewriterMode,
    setTypewriterMode,

    countStatType,
    setCountStatType,

    note,
    updateNote,

    searchTerm,
    setSearchTerm,
    notesToShow,

    newNote,
    deleteNote,

    getNoteByTitle,
    setOrNewNote,

    getHashtags,

    getLinkSuggestions: _getLinkSuggestions,
  };
};
