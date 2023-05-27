import { Descendant } from "slate";
import MEditor from "../MEditor";
import { EditorContext, useEditor } from "./Context";
import SidePanel from "./SidePanel";

const EditorWindow = ({
  onChange,
  initialValue,
}: {
  onChange: (val: {
    value: Descendant[];
    text: string;
    serialized: string;
  }) => void;
  initialValue: string;
}) => {
  const editorState = useEditor();

  return (
    <EditorContext.Provider value={editorState}>
      <div className="min-h-[100vh] bg-base text-primary-700 flex">
        <SidePanel />
        <div className="w-full p-4 py-8 flex justify-center">
          <div className="max-w-[860px]">
            <MEditor
              onChange={onChange}
              initValue={initialValue!}
              typeWriter={editorState.typewriterMode}
            />
          </div>
        </div>
      </div>
    </EditorContext.Provider>
  );
};

export default EditorWindow;
