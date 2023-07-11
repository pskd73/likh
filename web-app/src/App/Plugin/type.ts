import { Suggestion } from "../Core/Slate/Editor";
import { SavedNote } from "../type";

export type SuggestionConfig = {
  suggest: (prefix: string, word: string, note: SavedNote) => Suggestion[];
};

export type RNPlugin = {
  name: string;
  init: () => void;
  onNoteChange?: (note: SavedNote) => void;
  suggestions?: Record<string, SuggestionConfig>;
};

export type RNPluginCreator = () => RNPlugin;
