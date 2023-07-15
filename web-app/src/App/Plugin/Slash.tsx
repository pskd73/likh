import { Suggestion } from "../Core/Slate/Editor";
import { RNPluginCreator } from "./type";

const SlashPlugin: RNPluginCreator = () => {
  return {
    version: 1,
    name: "Slash Plugin",
    suggestions: {
      "/": {
        suggest: (prefix, word, note, range) => {
          const suggestions: Suggestion[] = [];
          if (range.anchor.offset === 0) {
            suggestions.push({
              title: "Heading 1",
              replace: "# ",
              description: "Insert markdown for Heading 1",
            });
            suggestions.push({
              title: "Heading 2",
              replace: "## ",
              description: "Insert markdown for Heading 2",
            });
            suggestions.push({
              title: "Heading 3",
              replace: "### ",
              description: "Insert markdown for Heading 3",
            });
            suggestions.push({
              title: "Bullet list",
              replace: "* ",
              description: "Start unordered bullt list",
            });
            suggestions.push({
              title: "Number list",
              replace: "1. ",
              description: "Start ordered number list",
            });
            suggestions.push({
              title: "Check box",
              replace: "- [ ] ",
              description: "Start checkbox list",
            });
            suggestions.push({
              title: "Quote",
              replace: "> ",
              description: "Block quote",
            });
          }
          suggestions.push({
            title: "Timestamp",
            replace: "@",
            description: "Insert timestamp",
          });
          suggestions.push({
            title: "Note",
            replace: "[[",
            description: "Link another note",
          });
          return suggestions.filter((sug) =>
            sug.title.toLowerCase().includes(word)
          );
        },
      },
    },
  };
};

export default SlashPlugin;
