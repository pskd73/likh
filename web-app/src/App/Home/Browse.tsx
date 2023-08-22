import { useContext, useMemo } from "react";
import { EditorContext } from "src/App/Context";
import { BiFile, BiBook, BiHash } from "react-icons/bi";
import { textToTitle } from "src/Note";
import { useNavigate, useParams } from "react-router-dom";
import { SavedNote } from "../type";
import { isMobile } from "../device";
import { FolderItem, FolderTree } from "../Folders";

const Browse = () => {
  const navigate = useNavigate();
  const { noteId } = useParams();
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
      isFileActive={(note) => note.id === noteId}
      isFolderActive={() => false}
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
        }
        return null;
      }}
    />
  );
};

export default Browse;
