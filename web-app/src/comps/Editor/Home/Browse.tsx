import { useContext, useMemo, useState } from "react";
import List from "../List";
import { ListContainer, Title } from "./Common";
import { EditorContext, NoteSummary } from "../Context";
import {
  BiFile,
  BiFolder,
  BiFolderOpen,
  BiMinus,
  BiPlus,
} from "react-icons/bi";
import Button from "../../Button";
import { textToTitle } from "../../../Note";

const folderize = (paths: string[], prefix: string) => {
  return paths
    .filter((path) => path.startsWith(prefix))
    .map((path) => {
      const suffix = path.replace(prefix, "");
      return suffix.split("/")[0];
    });
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
}: {
  map: Record<string, T[]>;
  prefix: string;
  onFileClick: (file: T) => void;
  toTitle: (file: T) => string;
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
                <Folders
                  onFileClick={onFileClick}
                  map={map}
                  prefix={prefix + hashtag + "/"}
                  toTitle={toTitle}
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
  const { notesToShow, note, getHashtags, setNote } = useContext(EditorContext);
  const hashtags = useMemo<Record<string, NoteSummary[]>>(() => {
    return getHashtags();
  }, [notesToShow, note]);

  return (
    <div>
      <Title>Browse</Title>
      <ListContainer>
        <Folders
          onFileClick={(summary) => setNote(summary.note)}
          map={hashtags}
          prefix={""}
          toTitle={(summary) => textToTitle(summary.note.text, 20)}
        />
      </ListContainer>
    </div>
  );
};

export default Browse;
