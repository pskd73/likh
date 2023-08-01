import { BiFile, BiTrash, BiUndo } from "react-icons/bi";
import List from "../List";
import { textToTitle } from "src/Note";
import Button from "src/comps/Button";
import { useContext } from "react";
import { EditorContext } from "../Context";
import { SavedNote } from "../type";

const Trash = () => {
  const { trashedNotes, updateNote, deleteNote } = useContext(EditorContext);

  const handleUndelete = (note: SavedNote) => {
    updateNote({ ...note, deleted: false });
  };

  const handleDelete = (note: SavedNote) => {
    deleteNote(note.id, true);
  };
  return (
    <List>
      {Object.values(trashedNotes).map((note, i) => (
        <List.Item
          key={i}
          noHover
          className="flex items-center justify-between group"
        >
          <div className="flex items-center space-x-1">
            <BiFile />
            <span>{textToTitle(note.text, 13)}</span>
          </div>
          <div className="group-hover:flex items-center space-x-1 hidden">
            <Button onClick={() => handleUndelete(note)}>
              <BiUndo />
            </Button>
            <Button onClick={() => handleDelete(note)}>
              <BiTrash />
            </Button>
          </div>
        </List.Item>
      ))}
    </List>
  );
};

export default Trash;
