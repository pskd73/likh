import * as React from "react";
import { useContext, useEffect } from "react";
import { AppContext } from "./AppContext";
import Clickable from "./Clickable";

const SideBar = () => {
  const { collection, deleteNote, setEditingNoteId } = useContext(AppContext);

  return (
    <div className="w-96">
      My notes
      <br />
      -------
      {collection && (
        <ul className="space-y-2">
          {Object.values(collection).map((note, i) => (
            <li key={i} className="flex">
              <div className="mr-2">{i + 1}.</div>
              <div>
                <Clickable>
                  <span onClick={() => setEditingNoteId(note.id)}>
                    {note.title}
                  </span>
                </Clickable>
                <div className="py-1">
                  <Clickable>
                    <span
                      className="text-sm"
                      onClick={() => deleteNote(note.id)}
                    >
                      delete
                    </span>
                  </Clickable>
                  {note.hashtags.map((tag, j) => (
                    <span key={j} className="text-sm opacity-60">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SideBar;
