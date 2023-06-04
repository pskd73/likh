import { createContext, useMemo, useState } from "react";
import { Storage } from "./useStorage";
import { NewNote, SavedNote } from "./type";
import { getNoteTitle } from "../../Note";

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
      .filter((n) => !!n) as SavedNote[];
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
    const note = getNoteByTitle(title);
    if (!note) {
      newNote({
        text: `# ${title}\nWrite more here`,
      });
    } else {
      setNote(note);
    }
  };

  const getHashtags = () => {
    const hashtags: Record<string, SavedNote[]> = {};
    for (const noteMeta of notesToShow) {
      const note = storage.getNote(noteMeta.id);
      if (note) {
        const matches = note.text.match(/\B\#\w\w+\b/g);
        if (matches) {
          for (const hashtag of matches) {
            if (!hashtags[hashtag]) {
              hashtags[hashtag] = [];
            }
            hashtags[hashtag].push(note);
          }
        }
      }
    }
    return hashtags;
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

    getHashtags
  };
};
