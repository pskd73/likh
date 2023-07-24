import { Fragment, ReactElement, useContext, useMemo, useState } from "react";
import List from "src/App/List";
import { EditorContext } from "src/App/Context";
import {
  BiFile,
  BiBook,
  BiTrash,
  BiUndo,
  BiHash,
} from "react-icons/bi";
import { textToTitle } from "src/Note";
import { useNavigate } from "react-router-dom";
import { SavedNote } from "../type";
import { isMobile } from "../device";
import Button from "src/comps/Button";

const folderize = (paths: string[], prefix: string) => {
  return paths
    .filter((path) => path.startsWith(prefix))
    .map((path) => {
      const suffix = path.replace(prefix, "");
      return suffix.split("/")[0];
    })
    .filter((val, i, arr) => arr.indexOf(val) === i);
};

const Files = <T extends unknown>({
  files,
  onClick,
  toTitle,
}: {
  files: T[];
  onClick: (file: T) => void;
  toTitle: (file: T) => string;
}) => {
  return (
    <List>
      {files.map((file, i) => (
        <List.Item
          key={i}
          withIcon
          className="last:mb-0"
          onClickKind={() => onClick(file)}
        >
          <List.Item.Icon>
            <BiFile />
          </List.Item.Icon>
          <span>{toTitle(file)}</span>
        </List.Item>
      ))}
    </List>
  );
};

const Folders = <T extends unknown>({
  map,
  prefix,
  onFileClick,
  toTitle,
  inject,
}: {
  map: Record<string, T[]>;
  prefix: string;
  onFileClick: (file: T) => void;
  toTitle: (file: T) => string;
  inject: (prefix: string, hashtag: string) => ReactElement | null;
}) => {
  const [expanded, setExpanded] = useState<string[]>([]);

  const toggle = (path: string) => {
    setExpanded((_expanded) => {
      const nExp = [..._expanded];
      if (nExp.includes(path)) {
        nExp.splice(nExp.indexOf(path), 1);
      } else {
        nExp.push(path);
      }
      return nExp;
    });
  };

  return (
    <List>
      {folderize(Object.keys(map), prefix).map((hashtag, i) => {
        const exp = expanded.includes(hashtag);
        return (
          <Fragment key={i}>
            <List.Item withIcon key={i} onClickKind={() => toggle(hashtag)}>
              <List.Item.Icon>
                <BiHash/>
              </List.Item.Icon>
              <span>{hashtag.replaceAll("#", "")}</span>
            </List.Item>
            {exp && (
              <div className="ml-3 pl-1 border-l border-primary border-opacity-30">
                {inject(prefix, hashtag)}
                <Folders
                  onFileClick={onFileClick}
                  map={map}
                  prefix={prefix + hashtag + "/"}
                  toTitle={toTitle}
                  inject={inject}
                />
                <Files
                  onClick={onFileClick}
                  files={map[prefix + hashtag] || []}
                  toTitle={toTitle}
                />
              </div>
            )}
          </Fragment>
        );
      })}
    </List>
  );
};

const Browse = () => {
  const navigate = useNavigate();
  const {
    allNotes,
    note,
    getHashtags,
    setSideBar,
    trashedNotes,
    updateNote,
    deleteNote,
  } = useContext(EditorContext);
  const [hashtags, untagged] = useMemo(() => {
    const all = getHashtags();
    const untagged = all[""];
    delete all[""];
    return [all, untagged];
  }, [allNotes, note]);
  const [trash, setTrash] = useState(false);

  const handleJournal = (hashtag: string) => {
    navigate(`/write/journal/${encodeURIComponent(hashtag)}`);
    isMobile && setSideBar(undefined);
  };

  const handleNoteClick = (note: SavedNote) => {
    navigate(`/write/note/${note.id}`);
    isMobile && setSideBar(undefined);
  };

  const handleUndelete = (note: SavedNote) => {
    updateNote({ ...note, deleted: false });
  };

  const handleDelete = (note: SavedNote) => {
    deleteNote(note.id, true);
  };

  const toTitle = (note: SavedNote) => textToTitle(note.text, 20);

  return (
    <>
      <Folders
        onFileClick={handleNoteClick}
        map={hashtags}
        prefix={""}
        toTitle={toTitle}
        inject={(prefix, hashtag) => {
          if (prefix.toLowerCase() === "#journal/") {
            return (
              <List>
                <List.Item
                  withIcon
                  onClickKind={() => handleJournal(prefix + hashtag)}
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
      <List>
        <List.Item withIcon onClickKind={() => setTrash((t) => !t)}>
          <List.Item.Icon>
            <BiTrash />
          </List.Item.Icon>
          <span>Trash</span>
        </List.Item>
        {trash && (
          <div className="ml-3 pl-1 border-l border-primary border-opacity-30">
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
          </div>
        )}
      </List>
      <Files
        onClick={handleNoteClick}
        files={untagged || []}
        toTitle={toTitle}
      />
    </>
  );
};

export default Browse;
