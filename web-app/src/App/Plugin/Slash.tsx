import { EditorContextType } from "../Context";
import { Suggestion } from "../Core/Slate/Editor";
import { selectFile } from "../File";
import { RNPluginCreator } from "./type";

let editorState: EditorContextType | undefined = undefined;

const SlashPlugin: RNPluginCreator = () => {
  return {
    version: 1,
    name: "Slash Plugin",
    setContext: (_editorState) => {
      editorState = _editorState;
    },
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
            suggestions.push({
              title: "Divider",
              description: "---",
              onClick: async (editor) => {
                editor.insertText("---");
                editor.insertBreak();
                return {};
              },
            });
            suggestions.push({
              title: "Upload image",
              replace: "",
              description: "![Image]()",
              onClick: () => {
                return new Promise(async (resolve, reject) => {
                  if (!editorState || !note) return resolve({});
                  const file: Blob | null = await selectFile(
                    ".png,.jpg,.jpeg,.gif"
                  );
                  if (!file) return resolve({});

                  const reader = new FileReader();
                  reader.onload = async function (event) {
                    const uri = event.target?.result?.toString();
                    if (uri) {
                      const match = uri.match(/^data:(.+);base64,(.+)$/);
                      if (match) {
                        const id = new Date().getTime().toString();
                        await editorState!.storage.pouch.attach(note.id, {
                          id,
                          data: match[2],
                          type: match[1],
                        });
                        resolve({
                          replace: `![Image](attachment://${id})`,
                          anchorOffset: id.length + "](attachment://)".length,
                          focusOffset:
                            id.length +
                            "](attachment://)".length +
                            "Image".length,
                        });
                      }
                    }
                  };
                  reader.readAsDataURL(file);
                });
              },
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
          suggestions.push({
            title: "Hashtag",
            replace: "#;",
            description: "#;",
            anchorOffset: 1,
            focusOffset: 1,
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
