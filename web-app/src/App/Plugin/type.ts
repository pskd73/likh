import { Suggestion } from "../Core/Slate/Editor";
import { CustomGrammarValue } from "../grammer";
import { SavedNote } from "../type";
import { LeafMaker } from "../Core/Slate/Leaf";
import { EditorContextType } from "../Context";
import { BaseRange } from "slate";
import { ElementMaker } from "../Core/Slate/SlateElement";
import { Boundary } from "../Core/ContextMenu";
import { ReactElement } from "react-markdown/lib/react-markdown";
import { NavigateFunction } from "react-router-dom";

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
  updateState?: (editorState: EditorContextType) => void;
  onNoteChange?: (note: SavedNote) => void;
  suggestions?: Record<string, SuggestionConfig>;
  boundaries?: Boundary[];
  grammer?: (
    grammer: Record<string, CustomGrammarValue>
  ) => Record<string, CustomGrammarValue>;
  leafMaker?: LeafMaker;
  elementMaker?: ElementMaker;
  page?: {
    url: string;
    element: ReactElement;
  };
  noteStatuBarIcons?: Record<
    string,
    (note: SavedNote) => {
      icon: ReactElement;
      tooltop: {
        text: string;
        force?: boolean;
      };
      onClick?: (
        e: React.MouseEvent<HTMLButtonElement>,
        navigate: NavigateFunction
      ) => void;
    }
  >;
};

export type RNPluginCreator = () => RNPlugin;
