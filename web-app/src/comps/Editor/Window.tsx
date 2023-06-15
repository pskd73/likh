import "./db";
import { Suggestion } from "./MEditor";
import { EditorContext, useEditor } from "./Context";
import SidePanel from "./SidePanel/SidePanel";
import StatusBar from "./StatusBar/StatusBar";
import useStorage from "./useStorage";
import { useEffect, useMemo, useState } from "react";
import useShortcuts from "./useShortcuts";
import classNames from "classnames";
import "./Core/test";
import { textToTitle } from "../../Note";
import { iOS, isMobile } from "./device";
import EditableNote from "./EditableNote";
import { init } from "./db";

const STATUS_BAR_HEIGHT = 30;

const EditorWindow = () => {
  const storage = useStorage();
  const editorState = useEditor({ storage });
  const statusBarPadding = useMemo(() => (iOS() ? 20 : 0), []);
  const [dbInitiated, setDbInitiated] = useState(false);

  useShortcuts(editorState);

  useEffect(() => {
    (async () => {
      await init();
      setDbInitiated(true);
    })();
  }, []);

  const getSuggestions = (prefix: string, term: string) => {
    const suggestions: Suggestion[] = [];
    if (prefix === "[[") {
      editorState.storage.notes.forEach((noteMeta, i) => {
        if (noteMeta.id === editorState.note.id) return;
        const note = editorState.storage.getNote(noteMeta.id);
        if (note) {
          const title = textToTitle(note.text, 50);
          if (title.toLowerCase().includes(term.toLowerCase())) {
            const cleanedTitle = title.trim();
            suggestions.push({
              title: cleanedTitle,
              id: note.id,
              replace: `[[${cleanedTitle}]](${note.id}) `,
            });
          }
        }
      });
    } else if (prefix === "#") {
      Object.keys(editorState.getHashtags()).forEach((hashtag) => {
        const tag = hashtag.replace("#", "");
        if (term === tag) return;
        if (tag.toLowerCase().includes(term.toLocaleLowerCase())) {
          suggestions.push({
            title: `${hashtag}`,
            replace: `${hashtag} `,
          });
        }
      });
    }
    return suggestions;
  };

  if (!dbInitiated) {
    return null;
  }

  return (
    <EditorContext.Provider value={editorState}>
      <div className="min-h-[100vh] bg-base text-primary-700 flex">
        <SidePanel />
        <div
          style={{
            width:
              editorState.sideBar && !isMobile
                ? "calc(100vw - 300px)"
                : "100vw",
          }}
        >
          <div
            id="editor-container"
            className="flex-1 p-4 py-8 flex justify-center overflow-y-scroll"
            style={{
              height: `calc(100vh - ${STATUS_BAR_HEIGHT + statusBarPadding}px)`,
            }}
          >
            <div className={classNames("w-full max-w-[1000px] md:w-[1000px]")}>
              <EditableNote getSuggestions={getSuggestions} />
            </div>
          </div>
          <StatusBar
            text={editorState.note.text}
            height={STATUS_BAR_HEIGHT}
            padding={statusBarPadding}
          />
        </div>
      </div>
    </EditorContext.Provider>
  );
};

export default EditorWindow;
