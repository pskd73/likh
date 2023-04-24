import { useContext } from "react";
import { AppContext } from "../AppContext";
import Editor from "./Editor";
import { Note } from "../../type";
import SideBar from "./SideBar";
import WriteToolbar from "./Toolbar";

const Write = () => {
  const { getEditingNote, saveNote, focusMode } = useContext(AppContext);

  const handleNoteChange = (newNote: Note) => {
    saveNote(newNote);
  };

  const note = getEditingNote();

  return (
    <div className="h-full">
      <div className="flex">
        <div className="flex-1 p-4">
          {note && <Editor note={note} onChange={handleNoteChange} />}
        </div>
        {!focusMode && (
          <div className="w-4/12">
            <SideBar />
          </div>
        )}
      </div>
      <WriteToolbar />
    </div>
  );
};

export default Write;
