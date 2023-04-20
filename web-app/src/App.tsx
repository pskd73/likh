import React, { useEffect, useState } from "react";
import Editor from "./components/Editor";
import Nav from "./components/Nav";
import SideBar from "./components/SideBar";
import "./index.css";
import { AppContext, useAppContext } from "./components/AppContext";
import { Note } from "./type";

function App() {
  const appContext = useAppContext();

  useEffect(() => {
    if (!appContext.editingNoteId) {
      const recentNote = appContext.getRecentNote();
      if (recentNote) {
        appContext.setEditingNoteId(recentNote.id);
      }
    }
  }, []);

  const handleNoteChange = (newNote: Note) => {
    appContext.saveNote(newNote);
  };

  const note = appContext.getEditingNote();

  return (
    <AppContext.Provider value={appContext}>
      <div className="font-SpecialElite text-slate-700">
        <div className="p-4 flex">
          <div className="flex-1 pr-20">
            {note && <Editor note={note} onChange={handleNoteChange} />}
          </div>
          <SideBar />
        </div>
        <div className="absolute w-full bottom-0">
          <Nav />
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
