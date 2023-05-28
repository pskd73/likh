import { createContext, useMemo, useState } from "react";
import { Storage } from "./useStorage";
import { SavedNote } from "./type";

type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
type CountStatType = "words" | "readTime";

export type EditorContextType = {
  storage: Storage;

  sideBar: boolean;
  toggleSideBar: () => void;

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
};

export const EditorContext = createContext<EditorContextType>(
  {} as EditorContextType
);

export const useEditor = ({
  storage,
}: {
  storage: Storage;
}): EditorContextType => {
  const [sideBar, setSideBar] = useState(true);
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

  const toggleSideBar = () => setSideBar((b) => !b);

  const toggleSideMenu = (key: string) => {
    setActiveSideMenus((items) => {
      const _items = [...items];
      if (items.includes(key)) {
        items.splice(items.indexOf(key), 1);
      } else {
        items.push(key);
      }
      return _items;
    });
  };

  const isSideMenuActive = (key: string) => activeSideMenus.includes(key);

  const updateNote = (note: SavedNote) => {
    storage.saveNote(note);
    setNote(note);
  };

  return {
    storage,

    sideBar,
    toggleSideBar,

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
  };
};
