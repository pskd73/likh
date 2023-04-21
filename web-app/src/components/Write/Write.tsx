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
    <div>
      <div className="p-4 md:flex">
        <div className="flex-1 md:pr-20">
          {note && <Editor note={note} onChange={handleNoteChange} />}
        </div>
        {!focusMode && (
          <div className="hidden md:block w-full md:w-3/12">
            <SideBar />
          </div>
        )}
      </div>
      <div>
        <WriteToolbar />
      </div>
    </div>
  );
};

export default Write;
