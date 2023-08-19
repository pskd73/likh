import { Fragment, ReactElement, useContext, useMemo, useState } from "react";
import List from "src/App/List";
import { EditorContext } from "src/App/Context";
import { BiFile, BiBook, BiHash } from "react-icons/bi";
import { textToTitle } from "src/Note";
import { useNavigate } from "react-router-dom";
import { SavedNote } from "../type";
import { isMobile } from "../device";
import classNames from "classnames";
import { FolderItem, FolderTree, Folders, getPadding } from "../Folders";

const Browse = () => {
  const navigate = useNavigate();
  const { allNotes, note, getHashtags, setSideBar } = useContext(EditorContext);
  const hashtags = useMemo(() => getHashtags(), [allNotes, note]);

  const handleJournal = (hashtag: string) => {
    navigate(`/write/journal/${encodeURIComponent(hashtag)}`);
    isMobile && setSideBar(undefined);
  };

  const handleNoteClick = (note: SavedNote) => {
    navigate(`/write/note/${note.id}`);
    isMobile && setSideBar(undefined);
  };

  const toTitle = (note: SavedNote) => textToTitle(note.text, 20);

  return (
    <FolderTree<SavedNote>
      onFileClick={handleNoteClick}
      map={hashtags}
      prefix={""}
      title={toTitle}
      fileIcon={() => <BiFile />}
      folderIcon={() => <BiHash />}
      inject={(prefix, hashtag, level) => {
        if (prefix.toLowerCase() === "#journal/") {
          return (
            <FolderItem
              icon={<BiBook />}
              level={level}
              label={
                <span className="font-CrimsonText italic">
                  Journal it &rarr;
                </span>
              }
              onClickKind={() => handleJournal(prefix + hashtag)}
            />
          );
          return (
            <List>
              <List.Item
                withIcon
                onClickKind={() => handleJournal(prefix + hashtag)}
                className={classNames(getPadding(level))}
              >
                <List.Item.Icon>
                  <BiBook />
                </List.Item.Icon>
                <span className="font-CrimsonText italic">
                  Journal it &rarr;
                </span>
              </List.Item>
            </List>
          );
        }
        return null;
      }}
    />
  );
};

export default Browse;
