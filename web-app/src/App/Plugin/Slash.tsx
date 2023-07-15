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
            replace: "# Heading 1",
            description: "Insert markdown for Heading 1",
          });
          suggestions.push({
            title: "Heading 2",
            replace: "## Heading 2",
            description: "Insert markdown for Heading 2",
          });
          suggestions.push({
            title: "Heading 3",
            replace: "### Heading 3",
            description: "Insert markdown for Heading 3",
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
