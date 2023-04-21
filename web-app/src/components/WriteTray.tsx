import { useContext } from "react";
import { AppContext } from "./AppContext";
import Editor from "./Editor";
import { Note } from "../type";
import SideBar from "./SideBar";
import Nav from "./Nav";

const WriteTray = () => {
  const { getEditingNote, saveNote, focusMode } = useContext(AppContext);

  const handleNoteChange = (newNote: Note) => {
    saveNote(newNote);
  };

  const note = getEditingNote();

  return (
    <>
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
        <Nav />
      </div>
    </>
  );
};

export default WriteTray;
