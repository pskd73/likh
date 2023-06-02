import { Descendant } from "slate";
import MEditor from "./MEditor";
import { EditorContext, useEditor } from "./Context";
import SidePanel from "./SidePanel/SidePanel";
import StatusBar from "./StatusBar/StatusBar";
import useStorage from "./useStorage";
import { MouseEventHandler, useEffect, useState } from "react";
import useShortcuts from "./useShortcuts";
import classNames from "classnames";
import "./Core/test";

const isSlateDOM = (node: any) => {
  return !!node.attributes["data-slate-node"];
};

const EditorWindow = () => {
  const storage = useStorage();
  const editorState = useEditor({ storage });
  const [editorKey, setEditorKey] = useState<number>(new Date().getTime());
  const [focus, setFocus] = useState<number>(new Date().getTime());

  useShortcuts(editorState);

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

  useEffect(() => {
    setEditorKey(new Date().getTime());
  }, [editorState.note.id]);

  const handleSectionClick: MouseEventHandler<HTMLDivElement> = (e) => {
    const target = e.target as any;
    let isEditor =
      isSlateDOM(target) ||
      isSlateDOM(target.parentNode) ||
      isSlateDOM(target.parentNode.parentNode);
    if (!isEditor) {
      setFocus(new Date().getTime());
    }
  };

  return (
    <EditorContext.Provider value={editorState}>
      <div className="min-h-[100vh] bg-base text-primary-700 flex">
        <SidePanel />
        <StatusBar text={editorState.note.text} />
        <div
          className="flex-1 p-4 py-8 flex justify-center overflow-y-scroll"
          onClick={handleSectionClick}
          style={{maxHeight: "calc(100vh - 37px)"}}
        >
          <div className={classNames("w-full max-w-[860px] md:w-[860px]")}>
            <MEditor
              key={editorKey}
              onChange={handleChange}
              initValue={editorState.note.serialized}
              initText={editorState.note.text}
              typeWriter={editorState.typewriterMode}
              focus={focus}
            />
          </div>
        </div>
      </div>
    </EditorContext.Provider>
  );
};

export default EditorWindow;
