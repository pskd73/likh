import { ReactElement } from "react";
import { Suggestion } from "../Core/Slate/Editor";
import { CustomGrammarValue } from "../grammer";
import { SavedNote } from "../type";

export type SuggestionConfig = {
  suggest: (prefix: string, word: string, note: SavedNote) => Suggestion[];
};

export type RNPlugin = {
  name: string;
  init?: () => void;
  onNoteChange?: (note: SavedNote) => void;
  suggestions?: Record<string, SuggestionConfig>;
  grammer?: Record<string, CustomGrammarValue>;
  leafElement?: (props: {
    attributes: any;
    children: any;
    leaf: Record<string, any>;
    text: { text: string };
  }) => ReactElement | undefined;
};

export type RNPluginCreator = () => RNPlugin;
