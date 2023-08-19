import classNames from "classnames";
import List, { ItemProps } from "./List";
import { Fragment, ReactElement, useMemo, useState } from "react";

const folderize = (paths: string[], prefix: string) => {
  return paths
    .filter((path) => path.startsWith(prefix))
    .map((path) => {
      const suffix = path.replace(prefix, "");
      return suffix.split("/")[0];
    })
    .filter((val, i, arr) => arr.indexOf(val) === i);
};

export const getPadding = (level: number) => {
  return classNames({
    "pl-4": level === 0,
    "pl-8": level === 1,
    "pl-12": level === 2,
    "pl-16": level === 3,
    "pl-20": level === 4,
    "pl-24": level === 5,
    "pl-28": level >= 6,
  });
};

const Lines = ({ level }: { level: number }) => {
  return (
    <div className="absolute h-full left-1 top-0">
      {Array.from(Array(level)).map((_, i) => (
        <span
          key={i}
          className={classNames(
            "w-4 border-r border-primary inline-block h-full",
            "border-opacity-30"
          )}
        />
      ))}
    </div>
  );
};

export const FolderItem = ({
  level,
  icon,
  label,
  ...restProps
}: ItemProps & {
  level: number;
  icon?: ReactElement;
  label: string | ReactElement;
}) => {
  return (
    <List.Item
      withIcon={!!icon}
      className={classNames("relative rounded-none", getPadding(level))}
      {...restProps}
    >
      <Lines level={level} />
      <List.Item.Icon style={{ marginLeft: 0 }}>{icon}</List.Item.Icon>
      <span>{label}</span>
    </List.Item>
  );
};

export type FileIconGetter = <T>(
  file: T,
  i: number
) => ReactElement | undefined;
export type FolderIconGetter = (
  folder: string,
  i: number
) => ReactElement | undefined;

const Files = <T extends unknown>({
  files,
  onClick,
  title,
  level,
  icon,
  sort,
}: {
  files: T[];
  onClick: (file: T) => void;
  title: (file: T) => string;
  level: number;
  icon: FileIconGetter;
  sort?: (a: T, b: T) => number;
}) => {
  const filesToShow: T[] = useMemo(() => {
    if (sort) {
      files.sort(sort);
    }
    return files;
  }, [files, sort]);

  return (
    <List>
      {filesToShow.map((file, i) => (
        <FolderItem
          key={i}
          label={title(file)}
          icon={icon(file, i)}
          level={level}
          onClickKind={() => onClick(file)}
        />
        // <List.Item
        //   key={i}
        //   withIcon
        //   className={classNames("relative", getPadding(level))}
        //   onClickKind={() => onClick(info.file)}
        // >
        //   <Lines level={level} />
        //   <List.Item.Icon style={{ marginLeft: 0 }}>
        //     <BiFile />
        //   </List.Item.Icon>
        //   <span>{info.title}</span>
        // </List.Item>
      ))}
    </List>
  );
};

export type FoldersProps<T> = {
  map: Record<string, T[]>;
  prefix: string;
  onFileClick: (file: T) => void;
  title: (file: T) => string;
  inject: (
    prefix: string,
    hashtag: string,
    level: number
  ) => ReactElement | null;
  level: number;
  fileIcon: FileIconGetter;
  folderIcon: FolderIconGetter;
};

export const Folders = <T extends unknown>({
  map,
  prefix,
  onFileClick,
  title,
  inject,
  level,
  fileIcon,
  folderIcon,
}: FoldersProps<T>) => {
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
              <FolderItem
                level={level}
                label={hashtag.replaceAll("#", "")}
                icon={folderIcon(hashtag, i)}
                onClickKind={() => toggle(hashtag)}
              />
              {/* <List.Item
                withIcon
                key={i}
                onClickKind={() => toggle(hashtag)}
                className={classNames("relative", getPadding(level))}
              >
                <Lines level={level} />
                <List.Item.Icon style={{ marginLeft: 0 }}>
                  <BiHash />
                </List.Item.Icon>
                <span>{hashtag.replaceAll("#", "")}</span>
              </List.Item> */}
              {exp && (
                <div>
                  {inject(prefix, hashtag, level + 1)}
                  <Folders
                    onFileClick={onFileClick}
                    map={map}
                    prefix={prefix + hashtag + "/"}
                    title={title}
                    inject={inject}
                    level={level + 1}
                    folderIcon={folderIcon}
                    fileIcon={fileIcon}
                  />
                  <Files
                    onClick={onFileClick}
                    files={map[prefix + hashtag] || []}
                    title={title}
                    level={level + 1}
                    icon={fileIcon}
                  />
                </div>
              )}
            </Fragment>
          );
        })}
    </List>
  );
};

export const FolderTree = <T extends unknown>(
  props: Omit<FoldersProps<T>, "level">
) => {
  const [tagged, untagged] = useMemo(() => {
    const tagged = props.map;
    const untagged = tagged[""] || [];
    delete tagged[""];
    return [tagged, untagged];
  }, [props.map]);

  return (
    <Fragment>
      <Folders {...props} map={tagged} level={0} />
      <Files
        onClick={props.onFileClick}
        files={untagged}
        title={props.title}
        level={0}
        icon={props.fileIcon}
      />
    </Fragment>
  );
};
