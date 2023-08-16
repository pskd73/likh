import { Fragment, ReactElement, useContext, useMemo, useState } from "react";
import List from "src/App/List";
import { EditorContext } from "src/App/Context";
import { BiFile, BiBook, BiHash } from "react-icons/bi";
import { textToTitle } from "src/Note";
import { useNavigate } from "react-router-dom";
import { SavedNote } from "../type";
import { isMobile } from "../device";

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
      {files
        .map((file) => ({ title: toTitle(file), file }))
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((info, i) => (
          <List.Item
            key={i}
            withIcon
            className="last:mb-0"
            onClickKind={() => onClick(info.file)}
          >
            <List.Item.Icon>
              <BiFile />
            </List.Item.Icon>
            <span>{info.title}</span>
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
      {folderize(Object.keys(map), prefix)
        .sort((a, b) => a.localeCompare(b))
        .map((hashtag, i) => {
          const exp = expanded.includes(hashtag);
          return (
            <Fragment key={i}>
              <List.Item withIcon key={i} onClickKind={() => toggle(hashtag)}>
                <List.Item.Icon>
                  <BiHash />
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
  const { allNotes, note, getHashtags, setSideBar } = useContext(EditorContext);
  const [hashtags, untagged] = useMemo(() => {
    const all = getHashtags();
    const untagged = all[""];
    delete all[""];
    return [all, untagged];
  }, [allNotes, note]);

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
      <Files
        onClick={handleNoteClick}
        files={untagged || []}
        toTitle={toTitle}
      />
    </>
  );
};

export default Browse;
