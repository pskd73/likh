import { createContext, useMemo, useState } from "react";
import { Storage } from "./useStorage";
import { NewNote, SavedNote } from "./type";
import { isLinked } from "../../Note";
import { LinkSuggestion, getLinkSuggestions } from "./Suggestion";

type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
type CountStatType = "words" | "readTime";
export type NoteSummary = {
  note: SavedNote;
  summary?: string;
  start?: number;
  end?: number;
  highlight?: string;
};

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
  updateNote: (note: SavedNote, replace?: boolean) => void;

  notes: Record<string, SavedNote>;
  setNotes: StateSetter<Record<string, SavedNote>>;

  searchTerm: string;
  setSearchTerm: StateSetter<string>;

  notesToShow: NoteSummary[];
  newNote: (note: NewNote, replace?: boolean) => SavedNote;

  deleteNote: (noteId: string) => void;

  getNoteByTitle: (title: string) => void;
  setOrNewNote: (title: string) => void;

  getHashtags: () => Record<string, NoteSummary[]>;

  getLinkSuggestions: () => LinkSuggestion[];

  isRoll: boolean;
  rollHashTag: string;
  setRollHashTag: StateSetter<string>;
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
  const [notes, setNotes] = useState<Record<string, SavedNote>>({
    [storage.getRecentNote().id]: storage.getRecentNote(),
  });
  const note = useMemo(() => {
    const ids = Object.keys(notes);
    return notes[ids[ids.length - 1]];
  }, [notes]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [rollHashTag, setRollHashTag] = useState<string>("");

  const notesToShow = useMemo<NoteSummary[]>(() => {
    if (searchTerm) {
      const results = storage.search(searchTerm);
      const MAX_SUMMARY_LENGTH = 50;
      return results.map((note) => {
        const idx = note.text.toLowerCase().indexOf(searchTerm.toLowerCase());
        const midIdx = idx + Math.floor(searchTerm.length / 2);
        const expStartIdx = Math.max(
          0,
          midIdx - Math.floor(MAX_SUMMARY_LENGTH / 2)
        );
        const expEndIdx = Math.min(
          note.text.length - 1,
          midIdx + Math.floor(MAX_SUMMARY_LENGTH / 2)
        );
        return {
          note,
          summary: note.text.substring(expStartIdx, expEndIdx),
          highlight: searchTerm,
        };
      });
    }
    return storage.notes
      .map((nm) => storage.getNote(nm.id))
      .filter((n) => !!n)
      .sort((a, b) => a?.created_at || 0 - (b?.created_at || 0))
      .map((note) => ({
        note,
      })) as NoteSummary[];
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

  const updateNote = (note: SavedNote, replace: boolean = true) => {
    storage.saveNote(note);
    let updatedNotes = { ...notes };
    if (replace) {
      updatedNotes = {};
    }
    updatedNotes[note.id] = note;
    setNotes(updatedNotes);
  };

  const newNote = (note: NewNote, replace: boolean = true) => {
    const savedNote = storage.newNote(note.text);
    let updatedNotes = { ...notes };
    if (replace) {
      updatedNotes = {};
    }
    updatedNotes[savedNote.id] = savedNote;
    setNotes(updatedNotes);
    return savedNote;
  };

  const deleteNote = (noteId: string) => {
    storage.delete(noteId);
    if (notes[noteId]) {
      const newNotes = { ...notes };
      delete newNotes[noteId];

      if (Object.keys(newNotes).length === 0) {
        const recentNote = storage.getRecentNote();
        newNotes[recentNote.id] = recentNote;
      }

      setNotes(newNotes);
    }
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
          const updatedNotes = { ...notes };
          updatedNotes[note.id] = note;
          return setNotes(updatedNotes);
        }
      }
    }
    newNote({
      text: `# ${title}\nWrite more here`,
    });
  };

  const getHashtags = () => {
    const hashtagsMap: Record<string, Record<string, NoteSummary>> = {};
    for (const summary of notesToShow) {
      const matches = summary.note.text.match(/\B\#\w\w+\b/g);
      if (matches) {
        for (const hashtag of matches) {
          if (!hashtagsMap[hashtag]) {
            hashtagsMap[hashtag] = {};
          }
          hashtagsMap[hashtag][note.id] = summary;
        }
      }
    }
    const hashtags: Record<string, NoteSummary[]> = {};
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

    notes,
    setNotes,

    searchTerm,
    setSearchTerm,
    notesToShow,

    newNote,
    deleteNote,

    getNoteByTitle,
    setOrNewNote,

    getHashtags,

    getLinkSuggestions: _getLinkSuggestions,

    isRoll: !!rollHashTag,
    rollHashTag,
    setRollHashTag,
  };
};
