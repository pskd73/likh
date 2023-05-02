import * as React from "react";
import { useContext, useMemo } from "react";
import { AppContext } from "../AppContext";
import Clickable from "../Clickable";

const SideBar = () => {
  const { collection, deleteNote, setEditingNoteId } = useContext(AppContext);
  const notes = useMemo(
    () => (collection ? Object.values(collection).reverse() : []),
    [collection]
  );

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
  };

  return (
    <div className="max-h-[90vh] overflow-y-scroll scrollbar-hide p-4">
      My notes
      <br />
      -------
      {collection && (
        <ul className="space-y-2">
          {notes.map((note, i) => (
            <li key={i} className="flex">
              <div className="mr-2">{i + 1}.</div>
              <div>
                <Clickable>
                  <span onClick={() => setEditingNoteId(note.id)}>
                    {note.title}
                  </span>
                </Clickable>
                <div>
                  <Clickable lite>
                    <span
                      className="text-sm"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      delete
                    </span>
                  </Clickable>
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
