import { BiSave, BiTrash } from "react-icons/bi";
import List from "./List";
import { BsInputCursorText } from "react-icons/bs";
import { useContext, useMemo, useState } from "react";
import Button from "src/comps/Button";
import { EditorContext } from "./Context";
import { useNavigate } from "react-router-dom";
import { saveNote } from "./File";
import { PluginContext } from "./Plugin/Context";
import React from "react";

const NoteMenu = () => {
  const { deleteNote, note, storage, setTypewriterMode } =
    useContext(EditorContext);
  const { plugins } = useContext(PluginContext);
  const navigate = useNavigate();
  const pluginItems = useMemo(() => {
    const btns = Object.values(plugins)
      .map((p) => p.noteMenuItems)
      .filter((items) => items?.length)
      .reduce((p, c) => [...p!, ...c!], []);
    return btns || [];
  }, [plugins]);
  const [dlt, setDlt] = useState(false);

  const handleDelete = async () => {
    if (dlt && note) {
      await deleteNote(note.id);
      navigate("/write");
    } else {
      setDlt(true);
    }
  };

  const handleSave = () => {
    if (note) {
      saveNote(note, storage.pouch);
    }
  };

  const handleTypewriterMode = () => {
    setTypewriterMode((t) => !t);
    navigate("?");
  };

  return (
    <div>
      <List>
        <List.Item withIcon onClick={handleDelete} noHover={dlt}>
          <List.Item.Icon>
            <BiTrash />
          </List.Item.Icon>
          {dlt ? (
            <span className="flex flex-col">
              <span>Sure?</span>
              <span className="space-x-2">
                <Button className="text-xs" onClick={handleDelete}>
                  Yes
                </Button>
                <Button
                  className="text-xs"
                  onClick={(e) => {
                    setDlt(false);
                    e.stopPropagation();
                  }}
                >
                  No
                </Button>
              </span>
            </span>
          ) : (
            <span>Delete</span>
          )}
        </List.Item>
        <List.Item withIcon onClick={handleSave}>
          <List.Item.Icon>
            <BiSave />
          </List.Item.Icon>
          <span>Save</span>
        </List.Item>
        <List.Item withIcon onClick={handleTypewriterMode}>
          <List.Item.Icon>
            <BsInputCursorText />
          </List.Item.Icon>
          <span>Toggle typewriter mode</span>
        </List.Item>
        {pluginItems.map((item, i) => (
          <React.Fragment key={i}>{item}</React.Fragment>
        ))}
      </List>
    </div>
  );
};

export default NoteMenu;
