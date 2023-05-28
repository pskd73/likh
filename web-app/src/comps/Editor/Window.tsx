import { Descendant, createEditor } from "slate";
import MEditor from "../MEditor";
import { EditorContext, useEditor } from "./Context";
import SidePanel from "./SidePanel/SidePanel";
import StatusBar from "./StatusBar";
import useStorage from "./useStorage";
import { serialize } from "v8";
import { useState } from "react";
import { SavedNote } from "./type";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";

const getNewEditor = () => withHistory(withReact(createEditor()));

const EditorWindow = ({
  onChange,
  initialValue,
  text,
}: {
  onChange: (val: {
    value: Descendant[];
    text: string;
    serialized: string;
  }) => void;
  initialValue: string;
  text: string;
}) => {
  const storage = useStorage();
  const editorState = useEditor({ storage });
  const [editor, setEditor] = useState(getNewEditor());

  const handleChange = ({
    text,
    serialized,
  }: {
    value: Descendant[];
    text: string;
    serialized: string;
  }) => {
    const updatedNote = { ...editorState.note };
    updatedNote.text = text;
    updatedNote.serialized = serialized;
    editorState.updateNote(updatedNote);
  };

  const handleNoteSelect = (note: SavedNote) => {
    editorState.updateNote(note);
    setEditor(getNewEditor());
  };

  return (
    <EditorContext.Provider value={editorState}>
      <div className="min-h-[100vh] bg-base text-primary-700 flex">
        <SidePanel onNoteSelect={handleNoteSelect} />
        <StatusBar text={text} />
        <div className="w-full p-4 py-8 flex justify-center">
          <div>
            <div className="max-w-[860px] md:w-[860px]">
              <MEditor
                onChange={handleChange}
                initValue={editorState.note.serialized}
                initText={editorState.note.text}
                typeWriter={editorState.typewriterMode}
                editor={editor}
              />
            </div>
          </div>
        </div>
      </div>
    </EditorContext.Provider>
  );
};

export default EditorWindow;
