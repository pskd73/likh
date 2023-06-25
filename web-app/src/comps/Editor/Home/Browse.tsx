import { ReactElement, useContext, useMemo, useState } from "react";
import List from "../List";
import { ListContainer, Title } from "./Common";
import { EditorContext, NoteSummary } from "../Context";
import {
  BiFile,
  BiFolder,
  BiFolderOpen,
  BiMinus,
  BiPlus,
  BiBook,
} from "react-icons/bi";
import Button from "../../Button";
import { textToTitle } from "../../../Note";

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
          onClick={() => onClick(file)}
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
          <List.Item key={i} noHover className="last:mb-0">
            <div className="flex items-center space-x-1">
              <Button
                lite={!exp}
                onClick={(e) => toggle(hashtag)}
                className="w-4 h-4 p-0 flex justify-center items-center"
              >
                {exp ? <BiMinus /> : <BiPlus />}
              </Button>
              {exp ? <BiFolderOpen /> : <BiFolder />}
              <span>{hashtag.replaceAll("#", "")}</span>
            </div>
            {exp && (
              <div className="ml-2 pl-2 border-l border-primary border-opacity-30">
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
          </List.Item>
        );
      })}
    </List>
  );
};

const Browse = () => {
  const { notesToShow, note, getHashtags, setNote, setRollHashTag } =
    useContext(EditorContext);
  const hashtags = useMemo<Record<string, NoteSummary[]>>(() => {
    return getHashtags();
  }, [notesToShow, note]);

  const handleJournal = (hashtag: string) => {
    setRollHashTag(hashtag);
  };

  return (
    <div>
      <Title>Browse</Title>
      <ListContainer>
        <Folders
          onFileClick={(summary) => setNote(summary.note)}
          map={hashtags}
          prefix={""}
          toTitle={(summary) => textToTitle(summary.note.text, 20)}
          inject={(prefix, hashtag) => {
            if (prefix === "#journal/") {
              return (
                <List>
                  <List.Item
                    withIcon
                    onClick={() => handleJournal(prefix + hashtag)}
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
      </ListContainer>
    </div>
  );
};

export default Browse;
