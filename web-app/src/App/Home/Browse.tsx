import { Fragment, ReactElement, useContext, useMemo, useState } from "react";
import List from "src/App/List";
import { ListContainer, Title } from "src/App/Home/Common";
import { EditorContext, NoteSummary } from "src/App/Context";
import { BiFile, BiFolder, BiFolderOpen, BiBook } from "react-icons/bi";
import { textToTitle } from "src/Note";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";

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
            <List.Item key={i} onClickKind={() => toggle(hashtag)}>
              <div className="flex items-center space-x-1">
                {exp ? <BiFolderOpen /> : <BiFolder />}
                <span>{hashtag.replace(/^#/, "").replace(/;$/, "")}</span>
              </div>
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

const Browse = ({
  onNoteClick,
}: {
  onNoteClick?: (noteSummary: NoteSummary) => void;
}) => {
  const navigate = useNavigate();
  const { notesToShow, note, getHashtags } = useContext(EditorContext);
  const hashtags = useMemo<Record<string, NoteSummary[]>>(() => {
    return getHashtags();
  }, [notesToShow, note]);

  const handleJournal = (hashtag: string) => {
    navigate(`/write/journal/${encodeURIComponent(hashtag)}`);
  };

  const handleNoteClick = (summary: NoteSummary) => {
    navigate(`/write/note/${summary.note.id}`);
  };

  return (
    <Folders
      onFileClick={handleNoteClick}
      map={hashtags}
      prefix={""}
      toTitle={(summary) => textToTitle(summary.note.text, 20)}
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
  );
};

export default Browse;
