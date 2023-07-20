import { Suggestion } from "../Core/Slate/Editor";
import { CustomGrammarValue } from "../grammer";
import { SavedNote } from "../type";
import { LeafMaker } from "../Core/Slate/Leaf";
import { EditorContextType } from "../Context";
import { BaseRange } from "slate";
import { ElementMaker } from "../Core/Slate/SlateElement";
import { Boundary } from "../Core/ContextMenu";

export type SuggestionConfig = {
  suggest: (
    prefix: string,
    word: string,
    note: SavedNote,
    range: BaseRange
  ) => Suggestion[];
};

export type RNPlugin = {
  version: number;
  name: string;
  init?: (editorState: EditorContextType) => void;
  onNoteChange?: (note: SavedNote) => void;
  suggestions?: Record<string, SuggestionConfig>;
  boundaries?: Boundary[];
  grammer?: (
    grammer: Record<string, CustomGrammarValue>
  ) => Record<string, CustomGrammarValue>;
  leafMaker?: LeafMaker;
  elementMaker?: ElementMaker;
};

export type RNPluginCreator = () => RNPlugin;
