import { createContext, useEffect, useState } from "react";
import { Storage } from "./useStorage";
import { NewNote, SavedNote } from "./type";
import { isLinked } from "src/Note";
import { getLinkSuggestions } from "./Suggestion";
import { PersistedState } from "./usePersistedState";
import { Theme } from "./Theme";
import { PouchContextType } from "./PouchDB";
import { isMobile } from "./device";
import { RNPlugin } from "./Plugin/type";
import Prism, { Token } from "prismjs";
import grammer from "./grammer";

type CountStatType = "words" | "readTime";

export type EditorContextType = ReturnType<typeof useEditor>;

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
const { hook: usePluginsState } =
  PersistedState<Record<string, any>>("pluginState");

export const useEditor = ({
  storage,
  pdb,
  plugins,
}: {
  storage: Storage;
  pdb: PouchContextType;
  plugins: RNPlugin[];
}) => {
  const [initiated, setInitiated] = useInitiated<boolean>(false);
  const [sideBar, setSideBar] = useSideBar<string | undefined>("outline");
  const [showStats, setShowStats] = useShowStats(true);
  const [typewriterMode, setTypewriterMode] = useTypewriterMode(false);
  const [countStatType, setCountStatType] =
    useCountStatType<CountStatType>("words");
  const [noteIds, setNoteIds] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useSearchTerm<string>("");
  const [rollHashTag, setRollHashTag] = useState<string>("");
  const [themeName, setThemeName] = useThemeName<string>("Basic");
  const [colorTheme, setColorTheme] = useColorTheme<string>("base");
  const [allNotes, setAllNotes] = useState<Record<string, SavedNote>>({});
  const [trashedNotes, setTrashedNotes] = useState<Record<string, SavedNote>>(
    {}
  );
  const [editorFocus, setEditorFocus] = useState<number>();
  const [pluginsState, setPluginsState] = usePluginsState<Record<string, any>>(
    {}
  );
  const [fullPage, setFullPage] = useState(false);

  useEffect(() => {
    (async () => {
      let _notes: Record<string, SavedNote> = {};
      let _trashed: Record<string, SavedNote> = {};
      for (const meta of storage.notes) {
        const note = await storage.getNote(meta.id);
        if (note) {
          if (!note.deleted) {
            _notes[meta.id] = note;
          } else {
            _trashed[meta.id] = note;
          }
        }
      }
      setAllNotes(_notes);
      setTrashedNotes(_trashed);
    })();
  }, [storage.notes]);

  useEffect(() => {
    if (pdb.pulled) {
      const pulledIds = pdb.pulled.split(",");
      const currentIds = Object.keys(noteIds);
      const intersection = pulledIds.filter((id) => currentIds.includes(id));
      if (intersection.length) {
        const newNotes = { ...allNotes };
        Object.keys(noteIds).forEach(async (id) => {
          const _note = await storage.getNote(id);
          if (_note) {
            newNotes[id] = _note;
          }
        });
        setAllNotes(newNotes);
      }
    }
  }, [pdb.pulled]);

  const setNote = async (note: { id: string }, replace: boolean = true) => {
    let updatedNotes = { ...noteIds };
    if (replace) {
      updatedNotes = {};
    }
    updatedNotes[note.id] = true;
    setNoteIds(updatedNotes);
  };

  const updateNote = (note: SavedNote) => {
    note = { ...note, updated_at: new Date().getTime() };
    storage.saveNote(note);
    setAllNotes({ ...allNotes, [note.id]: note });
    if (trashedNotes[note.id] && !note.deleted) {
      const _trashed = { ...trashedNotes };
      delete _trashed[note.id];
      setTrashedNotes(_trashed);
    }
    plugins.forEach(
      (plugin) => plugin.onNoteChange && plugin.onNoteChange(note)
    );
  };

  const newNote = (note: NewNote, replace: boolean = true) => {
    const savedNote = storage.newNote(note.text, note.created_at, note.id);
    if (!savedNote) return;
    setAllNotes({ ...allNotes, [savedNote.id]: savedNote });
    return savedNote;
  };

  const deleteNote = async (noteId: string, hard = false) => {
    if (hard) {
      if (allNotes[noteId]) {
        const newNotes = { ...allNotes };
        delete newNotes[noteId];
        setAllNotes(newNotes);
      }
      if (noteIds[noteId]) {
        const newNotes = { ...noteIds };
        delete newNotes[noteId];
        setNoteIds(newNotes);
      }
      await storage.delete(noteId);
    } else {
      updateNote({ ...allNotes[noteId], deleted: true });
      setTrashedNotes({ ...trashedNotes, [noteId]: allNotes[noteId] });
      if (allNotes[noteId]) {
        const newNotes = { ...allNotes };
        delete newNotes[noteId];
        setAllNotes(newNotes);
      }
      if (noteIds[noteId]) {
        const newNotes = { ...noteIds };
        delete newNotes[noteId];
        setNoteIds(newNotes);
      }
    }
  };

  const getNoteByTitle = async (title: string) => {
    for (const note of Object.values(allNotes)) {
      if (isLinked(title, note.text)) {
        return note;
      }
    }
  };

  const setOrNewNote = async (title: string) => {
    for (const note of Object.values(allNotes)) {
      if (isLinked(title, note.text)) {
        return note;
      }
    }
    return newNote({
      text: `# ${title}\nWrite more here`,
    })!;
  };

  const getHashtags = (exclude?: string[]) => {
    exclude = exclude || [];
    const hashtagsMap: Record<string, Record<string, SavedNote>> = { "": {} };
    for (const note of Object.values(allNotes || [])) {
      if (exclude.includes(note.id)) continue;
      let added = false;

      const tokens = Prism.tokenize(note.text, {
        hashtag: grammer.hashtag,
      }).filter((t) => typeof t === "object") as Token[];
      for (const token of tokens) {
        const hashtag = token.content as string;
        if (!hashtagsMap[hashtag]) {
          hashtagsMap[hashtag] = {};
        }
        hashtagsMap[hashtag][note.id] = note;
        added = true;
      }

      if (!added) {
        hashtagsMap[""][note.id] = note;
      }
    }
    const hashtags: Record<string, SavedNote[]> = {};
    for (const hashtag of Object.keys(hashtagsMap)) {
      hashtags[hashtag] = Object.values(hashtagsMap[hashtag]);
    }
    return hashtags;
  };

  const getTodoNotes = () => {
    const todoNotes: Array<{
      note: SavedNote;
      total: number;
      checked: number;
    }> = [];
    for (const note of Object.values(allNotes || [])) {
      let [total, checked] = [0, 0];
      for (const match of Array.from(
        note.text.matchAll(/\n? *- \[([ x])\].*/g)
      )) {
        checked += match[1] === "x" ? 1 : 0;
        total += 1;
      }
      if (total) {
        todoNotes.push({
          note,
          total,
          checked,
        });
      }
    }
    return todoNotes;
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
    setNoteIds({});
    setRollHashTag("");
    if (isMobile) {
      setSideBar(undefined);
    }
  };

  const updatePluginState = (name: string, state: any) => {
    setPluginsState({ ...pluginsState, [name]: state });
  };

  const getPluginState = (name: string) => {
    return pluginsState[name];
  };

  const usePluginState = <T>(name: string): [T, (val: T) => void] => {
    return [
      (getPluginState(name) || {}) as T,
      (val: T) => updatePluginState(name, val),
    ];
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

    updateNote,
    setNote,

    noteIds,
    setNoteIds,

    searchTerm,
    setSearchTerm,

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

    note: Object.keys(noteIds).length
      ? allNotes[Object.keys(noteIds).slice(-1)[0]]
      : undefined,

    allNotes,
    trashedNotes,

    usePluginState,
    pluginsState,

    fullPage,
    setFullPage,
  };
};
