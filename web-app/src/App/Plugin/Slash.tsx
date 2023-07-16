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
              description: "# Heading 1",
            });
            suggestions.push({
              title: "Heading 2",
              replace: "## ",
              description: "## Heading 2",
            });
            suggestions.push({
              title: "Heading 3",
              replace: "### ",
              description: "### Heading 3",
            });
            suggestions.push({
              title: "Bullet list",
              replace: "* ",
              description: "* Bullet point",
            });
            suggestions.push({
              title: "Number list",
              replace: "1. ",
              description: "1. Numeric point",
            });
            suggestions.push({
              title: "Check box",
              replace: "- [ ] ",
              description: "- [ ] Todo",
            });
            suggestions.push({
              title: "Quote",
              replace: "> ",
              description: "> Qutoation",
            });
          }
          suggestions.push({
            title: "Timestamp",
            replace: "@",
            description: "@9am",
          });
          suggestions.push({
            title: "Note",
            replace: "[[",
            description: "[[Another note]]",
          });
          suggestions.push({
            title: "Bold",
            replace: "**text**",
            description: "**bold**",
            anchorOffset: 2,
            focusOffset: 6,
          });
          suggestions.push({
            title: "Italic",
            replace: "*text*",
            description: "*italic*",
            anchorOffset: 1,
            focusOffset: 5,
          });
          suggestions.push({
            title: "Bold and Italic",
            replace: "***text***",
            description: "***bold & italic***",
            anchorOffset: 3,
            focusOffset: 7,
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
