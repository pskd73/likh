import classNames from "classnames";
import { RNPluginCreator } from "./type";
import { Suggestion } from "../Core/Slate/Editor";
import { EditorContextType } from "../Context";
import { SavedNote } from "../type";
import Suggestions from "src/Home/Suggestions";

let context: EditorContextType | undefined = undefined;

const Hashtags: RNPluginCreator = () => {
  const getHashtags = () => {
    const hashtagsMap: Record<string, Record<string, SavedNote>> = {};
    if (!context) return hashtagsMap;

    for (const summary of context.notesToShow) {
      const note = summary.note;
      const re = new RegExp(/#\w+(( \w+)*;)?/, "g");
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
        pattern: /#\w+(( \w+)*;)?/m,
      },
    }),
    suggestions: {
      "#": {
        suggest: (prefix, word, note, range) => {
          console.log({ word });
          const suggestions: Suggestion[] = [];
          const hashtags = getHashtags();

          for (const hashtag of Object.keys(hashtags)) {
            if (word === hashtag.replace(/^#/, "").replace(/;$/, "")) continue;
            if (hashtag.toLowerCase().includes(word.toLowerCase())) {
              suggestions.push({
                title: hashtag,
                replace: hashtag + " ",
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
              "bg-primary bg-opacity-20 px-3 rounded-full inline-block mb-1"
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
