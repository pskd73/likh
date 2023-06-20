import { createContext, useEffect, useMemo, useState } from "react";
import { Storage } from "./useStorage";
import { NewNote, SavedNote } from "./type";
import { isLinked } from "../../Note";
import { LinkSuggestion, getLinkSuggestions } from "./Suggestion";
import { PersistedState } from "./usePersistedState";
import { Theme, Themes } from "./Theme";

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
  setActiveSideMenus: StateSetter<string[]>;

  showStats: boolean;
  setShowStats: StateSetter<boolean>;

  typewriterMode: boolean;
  setTypewriterMode: StateSetter<boolean>;

  countStatType: CountStatType;
  setCountStatType: StateSetter<CountStatType>;

  note: SavedNote | undefined;
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

  getLinkSuggestions: () => Promise<LinkSuggestion[]>;

  isRoll: boolean;
  rollHashTag: string;
  setRollHashTag: StateSetter<string>;

  themeName: string;
  setThemeName: StateSetter<string>;
};

export const EditorContext = createContext<EditorContextType>(
  {} as EditorContextType
);

const { hook: useSideBar } = PersistedState("sideBar");
const { hook: useSearchTerm } = PersistedState("searchTerm");
const { hook: useTypewriterMode } = PersistedState("typewriterMode");
const { hook: useShowStats } = PersistedState("showStats");
const { hook: useNoteId, value: defaultNoteId } =
  PersistedState<string>("noteId");
const { hook: useRollHashtag, value: defaultRollHashtag } =
  PersistedState<string>("rollHashtag");
const { hook: useActiveSideMenus } = PersistedState("activeSideMenus");
const { hook: useCountStatType } =
  PersistedState<CountStatType>("countStatType");
const { hook: useThemeName } = PersistedState<Theme>("themeName");

export const useEditor = ({
  storage,
}: {
  storage: Storage;
}): EditorContextType => {
  const [sideBar, setSideBar] = useSideBar<string | undefined>(undefined);
  const [activeSideMenus, setActiveSideMenus] = useActiveSideMenus<string[]>([
    "notes",
    "settings",
  ]);
  const [showStats, setShowStats] = useShowStats(true);
  const [typewriterMode, setTypewriterMode] = useTypewriterMode(false);
  const [countStatType, setCountStatType] =
    useCountStatType<CountStatType>("words");
  const [notes, setNotes] = useState<Record<string, SavedNote>>({});
  const note = useMemo<SavedNote | undefined>(() => {
    const ids = Object.keys(notes);
    return notes[ids[ids.length - 1]];
  }, [notes]);
  const [searchTerm, setSearchTerm] = useSearchTerm<string>("");
  const [rollHashTag, setRollHashTag] = useRollHashtag<string>("");
  const [noteId, setNoteId] = useNoteId<string | undefined>(defaultNoteId);
  const [themeName, setThemeName] = useThemeName<string>("Basic");
  const [notesToShow, setNotesToShow] = useState<NoteSummary[]>([]);

  useEffect(() => {
    (async () => {
      if (defaultNoteId && !defaultRollHashtag) {
        const _note = await storage.getNote(defaultNoteId);
        if (_note) {
          return setNotes({ [defaultNoteId]: _note });
        }
      }
      const hashTagNotes = getHashTagNotes();
      if (hashTagNotes) {
        return setNotes(hashTagNotes);
      }
      const recentNote = await storage.getRecentNote();
      setNotes({ [recentNote.id]: recentNote });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (searchTerm) {
        const results = await storage.search(searchTerm);
        const MAX_SUMMARY_LENGTH = 50;
        const nts = results.map((note) => {
          const idx = note.text.toLowerCase().indexOf(searchTerm.toLowerCase());
          const midIdx = idx + Math.floor(searchTerm.length / 2);
          const start = Math.max(
            0,
            midIdx - Math.floor(MAX_SUMMARY_LENGTH / 2)
          );
          const end = Math.min(
            note.text.length - 1,
            midIdx + Math.floor(MAX_SUMMARY_LENGTH / 2)
          );
          let summary = note.text.substring(start, end);
          if (start !== 0) {
            summary = "... " + summary;
          }
          if (end !== note.text.length - 1) {
            summary += " ...";
          }
          return {
            note,
            summary,
            start,
            end,
            highlight: searchTerm,
          };
        });
        return setNotesToShow(nts);
      }

      let _notes: SavedNote[] = [];
      for (const meta of storage.notes) {
        const note = await storage.getNote(meta.id);
        if (note) {
          _notes.push(note);
        }
      }

      setNotesToShow(
        _notes
          .filter((n) => !!n)
          .sort((a, b) => a?.created_at || 0 - (b?.created_at || 0))
          .map((note) => ({
            note,
          })) as NoteSummary[]
      );
    })();
  }, [
    storage.notes,
    searchTerm,
    Math.min(note?.text.length || 0, 50),
  ]);

  useEffect(() => {
    if (note) {
      setNoteId(note.id);
    }
  }, [note]);

  useEffect(() => {
    const _notes = getHashTagNotes();
    if (_notes) {
      setNotes(_notes);
    }
  }, [rollHashTag]);

  const getHashTagNotes = () => {
    if (rollHashTag) {
      const hashtags = getHashtags();
      if (hashtags[rollHashTag]) {
        const notes = hashtags[rollHashTag].sort(
          (a, b) => a.note.created_at - b.note.created_at
        );
        const notesMap: Record<string, SavedNote> = {};
        notes.forEach((noteSummary) => {
          notesMap[noteSummary.note.id] = noteSummary.note;
        });
        return notesMap;
      }
    }
  };

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
    const savedNote = storage.newNote(note.text, note.created_at);
    let updatedNotes = { ...notes };
    if (replace) {
      updatedNotes = {};
    }
    updatedNotes[savedNote.id] = savedNote;

    let _notes = Object.values(updatedNotes);
    _notes = _notes.sort((a, b) => a.created_at - b.created_at);
    const sortedNotes: Record<string, SavedNote> = {};
    for (const note of _notes) {
      sortedNotes[note.id] = note;
    }

    setNotes(sortedNotes);
    return savedNote;
  };

  const deleteNote = async (noteId: string) => {
    await storage.delete(noteId);
    if (notes[noteId]) {
      const newNotes = { ...notes };
      delete newNotes[noteId];

      if (Object.keys(newNotes).length === 0) {
        const recentNote = await storage.getRecentNote();
        newNotes[recentNote.id] = recentNote;
      }

      setNotes(newNotes);
    }
  };

  const getNoteByTitle = async (title: string) => {
    for (const noteMeta of storage.notes) {
      const note = await storage.getNote(noteMeta.id);
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

  const setOrNewNote = async (title: string) => {
    for (const meta of storage.notes) {
      const note = await storage.getNote(meta.id);
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
          hashtagsMap[hashtag][summary.note.id] = summary;
        }
      }
    }
    const hashtags: Record<string, NoteSummary[]> = {};
    for (const hashtag of Object.keys(hashtagsMap)) {
      hashtags[hashtag] = Object.values(hashtagsMap[hashtag]);
    }
    return hashtags;
  };

  const _getLinkSuggestions = async () => {
    const notes: SavedNote[] = [];
    for (const meta of storage.notes) {
      const note = await storage.getNote(meta.id);
      if (note) {
        notes.push(note);
      }
    }
    return getLinkSuggestions(notes.filter((n) => !!n) as SavedNote[]);
  };

  return {
    storage,

    sideBar,
    setSideBar,

    activeSideMenus,
    toggleSideMenu,
    isSideMenuActive,
    setActiveSideMenus,

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

    themeName,
    setThemeName,
  };
};
