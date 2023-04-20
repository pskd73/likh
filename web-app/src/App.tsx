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
    if (appContext.recentNote) {
      appContext.setEditingNoteId(appContext.recentNote.id);
    }
  }, [appContext.recentNote]);

  const handleNoteChange = (newNote: Note) => {
    appContext.saveNote(newNote);
  };

  const note = appContext.getEditingNote();

  return (
    <AppContext.Provider value={appContext}>
      <div className="font-SpecialElite text-slate-700">
        <div className="p-4 md:flex">
          <div className="flex-1 md:pr-20 max-w-[1000px]">
            {note && <Editor note={note} onChange={handleNoteChange} />}
          </div>
          {!appContext.focusMode && (
            <div className="hidden md:block w-full md:w-3/12">
              <SideBar />
            </div>
          )}
        </div>
        <div className="absolute w-full bottom-0">
          <Nav />
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
