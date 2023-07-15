import { Suggestion } from "../Core/Slate/Editor";
import { RNPluginCreator } from "./type";

const SlashPlugin: RNPluginCreator = () => {
  return {
    version: 1,
    name: "Slash Plugin",
    suggestions: {
      "/": {
        suggest: (prefix, word, note, range) => {
          if (range.anchor.offset !== 0) return [];
          const suggestions: Suggestion[] = [];
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
            title: "Bullet list item",
            replace: "* ",
            description: "Unordered list item",
          });
          suggestions.push({
            title: "Numeric list item",
            replace: "1. ",
            description: "Numeric list item",
          });
          suggestions.push({
            title: "Checklist item",
            replace: "- [ ] ",
            description: "Insert a checkbox list item",
          });
          suggestions.push({
            title: "Quote",
            replace: "> ",
            description: "Block quote",
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
