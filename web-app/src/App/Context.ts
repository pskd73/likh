import { createContext, useEffect, useMemo, useState } from "react";
import { Storage } from "./useStorage";
import { NewNote, SavedNote } from "./type";
import { isLinked, focus } from "src/Note";
import { LinkSuggestion, getLinkSuggestions } from "./Suggestion";
import { PersistedState } from "./usePersistedState";
import { Theme } from "./Theme";
import { PouchContextType } from "./PouchDB";
import { hashtag } from "./grammer";
import { isMobile } from "./device";
import { RNPlugin } from "./Plugin/type";

type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
type CountStatType = "words" | "readTime";
export type NoteSummary = {
  note: SavedNote;
  summary?: string;
  start?: number;
  end?: number;
  highlight?: string;
  todo?: {
    total: number;
    checked: number;
  };
};

export type EditorContextType = {
  storage: Storage;

  sideBar: string | undefined;
  setSideBar: StateSetter<string | undefined>;

  showStats: boolean;
  setShowStats: StateSetter<boolean>;

  typewriterMode: boolean;
  setTypewriterMode: StateSetter<boolean>;

  countStatType: CountStatType;
  setCountStatType: StateSetter<CountStatType>;

  note: SavedNote | undefined;
  setNote: (note: { id: string }, replace?: boolean) => Promise<void>;
  updateNote: (note: SavedNote) => void;

  notes: Record<string, SavedNote>;
  setNotes: StateSetter<Record<string, SavedNote>>;

  searchTerm: string;
  setSearchTerm: StateSetter<string>;

  notesToShow: NoteSummary[];
  newNote: (note: NewNote, replace?: boolean) => SavedNote | undefined;

  deleteNote: (noteId: string) => void;

  getNoteByTitle: (title: string) => void;
  setOrNewNote: (title: string) => Promise<SavedNote>;

  getHashtags: (exclude?: string[]) => Record<string, NoteSummary[]>;

  getLinkSuggestions: () => Promise<LinkSuggestion[]>;

  isRoll: boolean;
  rollHashTag: string;
  setRollHashTag: StateSetter<string>;

  themeName: string;
  setThemeName: StateSetter<string>;

  home: () => void;
  colorTheme: string;
  setColorTheme: StateSetter<string>;

  getTodoNotes: () => NoteSummary[];

  plugins: RNPlugin[];

  editorFocus?: number;
  setEditorFocus: StateSetter<number | undefined>;

  initiated: boolean;
  setInitiated: StateSetter<boolean>;
};

export const EditorContext = createContext<EditorContextType>(
  {} as EditorContextType
);

const { hook: useInitiated } = PersistedState<boolean>("initiated");
const { hook: useSideBar } = PersistedState("sideBar");
const { hook: useSearchTerm } = PersistedState("searchTerm");
const { hook: useTypewriterMode } = PersistedState("typewriterMode");
const { hook: useShowStats } = PersistedState("showStats");
const { hook: useCountStatType } =
  PersistedState<CountStatType>("countStatType");
const { hook: useThemeName } = PersistedState<Theme>("themeName");
const { hook: useColorTheme } = PersistedState<Theme>("colorTheme");

export const useEditor = ({
  storage,
  pdb,
  plugins,
}: {
  storage: Storage;
  pdb: PouchContextType;
  plugins: RNPlugin[];
}): EditorContextType => {
  const [initiated, setInitiated] = useInitiated<boolean>(false);
  const [sideBar, setSideBar] = useSideBar<string | undefined>("outline");
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
  const [rollHashTag, setRollHashTag] = useState<string>("");
  const [themeName, setThemeName] = useThemeName<string>("Basic");
  const [colorTheme, setColorTheme] = useColorTheme<string>("base");
  const [notesToShow, setNotesToShow] = useState<NoteSummary[]>([]);
  const [editorFocus, setEditorFocus] = useState<number>();

  useEffect(() => {
    (async () => {
      if (searchTerm) {
        const results = await storage.search(searchTerm);
        const nts = results.map((note) => {
          const idx = note.text.toLowerCase().indexOf(searchTerm.toLowerCase());
          const {
            focused: summary,
            start,
            end,
          } = focus(note.text, idx, searchTerm);
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
          .sort((a, b) => (b?.created_at || 0) - (a?.created_at || 0))
          .map((note) => ({
            note,
          })) as NoteSummary[]
      );
    })();
  }, [
    storage.notes,
    searchTerm,
    (note?.text.length || 0) <= 50 ? storage.lastSavedAt : undefined,
    note?.reminder,
  ]);

  useEffect(() => {
    const _notes = getHashTagNotes();
    if (_notes) {
      setNotes(_notes);
    }
  }, [rollHashTag]);

  useEffect(() => {
    if (pdb.pulled) {
      const pulledIds = pdb.pulled.split(",");
      const currentIds = Object.keys(notes);
      const intersection = pulledIds.filter((id) => currentIds.includes(id));
      if (intersection.length) {
        const newNotes: Record<string, SavedNote> = {};
        Object.keys(notes).forEach(async (id) => {
          const _note = await storage.getNote(id);
          if (_note) {
            newNotes[id] = _note;
          }
        });
        setNotes(newNotes);
      }
    }
  }, [pdb.pulled]);

  const getHashTagNotes = () => {
    if (rollHashTag) {
      const hashtags = getHashtags();
      if (hashtags[rollHashTag]) {
        const notes = hashtags[rollHashTag].sort(
          (a, b) => b.note.created_at - a.note.created_at
        );
        const notesMap: Record<string, SavedNote> = {};
        notes.forEach((noteSummary) => {
          notesMap[noteSummary.note.id] = noteSummary.note;
        });
        return notesMap;
      }
    }
  };

  const setNote = async (note: { id: string }, replace: boolean = true) => {
    const _note = await storage.getNote(note.id);
    if (!_note) return;
    let updatedNotes = { ...notes };
    if (replace) {
      updatedNotes = {};
    }
    updatedNotes[note.id] = _note;
    setNotes(updatedNotes);
  };

  const updateNote = (note: SavedNote) => {
    storage.saveNote(note);
    let updatedNotes = { ...notes };
    updatedNotes[note.id] = note;
    setNotes(updatedNotes);
  };

  const newNote = (note: NewNote, replace: boolean = true) => {
    const savedNote = storage.newNote(note.text, note.created_at, note.id);
    if (!savedNote) return;
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
          setNotes(updatedNotes);
          return note;
        }
      }
    }
    return newNote({
      text: `# ${title}\nWrite more here`,
    })!;
  };

  const getHashtags = (exclude?: string[]) => {
    exclude = exclude || [];
    const hashtagsMap: Record<string, Record<string, NoteSummary>> = {};
    for (const summary of notesToShow) {
      if (exclude.includes(summary.note.id)) continue;
      const re = new RegExp((hashtag as any).pattern, "g");
      const matches = summary.note.text.match(re);
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

  const getTodoNotes = () => {
    const summaries: NoteSummary[] = [];
    for (const summary of notesToShow) {
      let [total, checked] = [0, 0];
      for (const match of Array.from(
        summary.note.text.matchAll(/\n? *- \[([ x])\].*/g)
      )) {
        checked += match[1] === "x" ? 1 : 0;
        total += 1;
      }
      if (total) {
        summary.todo = {
          total,
          checked,
        };
        summaries.push(summary);
      }
    }
    return summaries;
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

  const home = () => {
    setNotes({});
    setRollHashTag("");
    if (isMobile) {
      setSideBar(undefined);
    }
  };

  return {
    storage,

    sideBar,
    setSideBar,

    showStats,
    setShowStats,
    typewriterMode,
    setTypewriterMode,

    countStatType,
    setCountStatType,

    note,
    updateNote,
    setNote,

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

    home,
    colorTheme,
    setColorTheme,

    getTodoNotes,
    plugins,

    editorFocus,
    setEditorFocus,

    initiated,
    setInitiated,
  };
};
