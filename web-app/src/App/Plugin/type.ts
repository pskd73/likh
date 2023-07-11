import { Suggestion } from "../Core/Slate/Editor";
import { CustomGrammarValue } from "../grammer";
import { SavedNote } from "../type";
import { LeafMaker } from "../Core/Slate/Leaf";
import { EditorContextType } from "../Context";

export type SuggestionConfig = {
  suggest: (prefix: string, word: string, note: SavedNote) => Suggestion[];
};

export type RNPlugin = {
  version: number;
  name: string;
  init?: (editorState: EditorContextType) => void;
  onNoteChange?: (note: SavedNote) => void;
  suggestions?: Record<string, SuggestionConfig>;
  grammer?: Record<string, CustomGrammarValue>;
  leafMaker?: LeafMaker;
};

export type RNPluginCreator = () => RNPlugin;
