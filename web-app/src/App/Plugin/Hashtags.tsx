import classNames from "classnames";
import { RNPluginCreator } from "./type";
import { Suggestion } from "../Core/Slate/Editor";
import { EditorContextType } from "../Context";
import { SavedNote } from "../type";
import { hashtag } from "../regex";

let context: EditorContextType | undefined = undefined;

const Hashtags: RNPluginCreator = () => {
  const getHashtags = () => {
    const hashtagsMap: Record<string, Record<string, SavedNote>> = {};
    if (!context) return hashtagsMap;

    for (const summary of context.notesToShow) {
      const note = summary.note;
      const re = new RegExp(hashtag, "g");
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
        pattern: new RegExp(hashtag, "g"),
        inside: {
          htBoundary: {
            pattern: /^#|.$/,
            inside: {
              htStart: /^#/,
              htEnd: /.$/,
            },
          },
          htDivider: {
            pattern: /\//,
          },
          htWord: {
            pattern: /[\w_]+/,
          },
        },
      },
    }),
    suggestions: {
      "#": {
        suggest: (prefix, word, note, range) => {
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
                title: cleanedHashtag.replaceAll("/", " / "),
                replace: isBoundary ? cleanedHashtag : hashtag,
              });
            }
          }
          return suggestions;
        },
      },
    },
    leafMaker: ({ attributes, children, leaf, text }) => {
      if (leaf.hashtag) {
        const colon = leaf.text.includes(";");
        return (
          <span
            {...attributes}
            className={classNames(
              "bg-primary bg-opacity-20 py-1",
              "inline-block mb-1 text-xs",
              {
                "rounded-l-full pl-3": leaf.htStart,
                "rounded-r-full pr-3": leaf.htEnd,
                "px-1 font-extrabold text-primary text-opacity-20":
                  leaf.htDivider,
                "text-primary": leaf.htBoundary,
                "text-opacity-50": leaf.htStart || (leaf.htEnd && colon),
              }
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
