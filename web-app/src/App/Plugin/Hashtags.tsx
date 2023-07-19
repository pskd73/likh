import classNames from "classnames";
import { RNPluginCreator } from "./type";
import { Suggestion } from "../Core/Slate/Editor";
import { EditorContextType } from "../Context";
import { SavedNote } from "../type";

let context: EditorContextType | undefined = undefined;

const Hashtags: RNPluginCreator = () => {
  const getHashtags = () => {
    const hashtagsMap: Record<string, Record<string, SavedNote>> = {};
    if (!context) return hashtagsMap;

    for (const summary of context.notesToShow) {
      const note = summary.note;
      const re = new RegExp(/#[\w/_]+(( [\w/_]+)*;)?/, "g");
      const matches = note.text.match(re);
      if (matches) {
        for (const hashtag of matches) {
          if (!hashtagsMap[hashtag]) {
            hashtagsMap[hashtag] = {};
          }
          hashtagsMap[hashtag][note.id] = note;
        }
      }
    }
    const hashtags: Record<string, SavedNote[]> = {};
    for (const hashtag of Object.keys(hashtagsMap)) {
      hashtags[hashtag] = Object.values(hashtagsMap[hashtag]);
    }
    return hashtags;
  };

  return {
    name: "Hashtags",
    version: 1,
    setContext: (_context) => {
      context = _context;
    },
    grammer: () => ({
      hashtag: {
        pattern: /#[\w/_]+(( [\w/_]+)*;)?/m,
      },
    }),
    suggestions: {
      "#": {
        suggest: (prefix, word, note, range) => {
          console.log({ word });
          const isBoundary = word.endsWith(";");
          const suggestions: Suggestion[] = [];
          const hashtags = getHashtags();

          for (const hashtag of Object.keys(hashtags)) {
            const cleanedHashtag = hashtag.replace(/^#/, "").replace(/;$/, "");
            const cleanedWord = word.replace(/^#/, "").replace(/;$/, "");
            if (cleanedWord === cleanedHashtag) continue;
            if (
              cleanedHashtag.toLowerCase().includes(cleanedWord.toLowerCase())
            ) {
              suggestions.push({
                title: hashtag,
                replace: isBoundary ? cleanedHashtag : hashtag,
              });
            }
          }
          return suggestions;
        },
      },
    },
    leafMaker: ({ attributes, children, leaf }) => {
      if (leaf.hashtag) {
        return (
          <span
            {...attributes}
            className={classNames(
              "bg-primary bg-opacity-20 px-2 py-1 rounded-full inline-block mb-1",
              "text-xs"
            )}
            spellCheck={false}
          >
            {children}
          </span>
        );
      }
    },
  };
};

export default Hashtags;
