import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditorContext } from "src/App/Context";
import { DownloadableNote, getDownloadableNote } from "src/App/File";
import { SavedNote } from "src/App/type";
import { CustomInput, CustomSelect } from "../UI";
import List from "src/App/List";
import { textToTitle } from "src/Note";
import Button from "src/comps/Button";
import { make } from "./make";
import classNames from "classnames";
import { Preview } from "./Preview";
import useMemoAsync from "src/App/useMemoAsync";
import { saveAs } from "file-saver";

function unique<T>(value: T, index: number, array: T[]) {
  return array.indexOf(value) === index;
}

type OrderedSavedNote = {
  note: SavedNote;
  idx: number;
};

type CombinedNote = {
  downloadable: DownloadableNote;
  saved: SavedNote;
};

export const New = () => {
  const navigate = useNavigate();
  const { allNotes, getHashtags, storage } = useContext(EditorContext);
  const hashtags = useMemo(() => getHashtags(), [allNotes]);
  const tagsToShow = useMemo(
    () =>
      Object.keys(hashtags)
        .map((tag) => tag.split("/")[0])
        .filter(unique)
        .sort((a, b) => a.localeCompare(b))
        .filter((t) => !!t),
    [hashtags]
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [tag, setTag] = useState("");
  const [noHashtags, setNoHashtags] = useState(true);
  const [chapterLabel, setChapterLabel] = useState(true);

  const chapterNotes = useMemo(() => {
    if (!tag) return [];

    let notes: OrderedSavedNote[] = [];
    for (const _tag of Object.keys(hashtags)) {
      if (_tag.startsWith(tag)) {
        const match = _tag.split("/")[1]?.match(/^chapter_(\d+)$/);
        const idx = match ? Number(match[1]) : 10000000;
        notes = [...notes, ...hashtags[_tag].map((note) => ({ note, idx }))];
      }
    }
    return notes.sort((a, b) => a.idx - b.idx).map((n) => n.note);
  }, [tag, allNotes, hashtags]);

  const epub: any = useMemoAsync(async () => {
    const notes: CombinedNote[] = [];
    for (const saved of chapterNotes) {
      const downloadable = await getDownloadableNote(saved, storage.pouch);
      notes.push({ downloadable, saved });
    }
    return make({
      title,
      description,
      author,
      notes,
      noHashtags,
      chapterLabel,
    });
  }, [chapterNotes, title, description, author, noHashtags, chapterLabel]);

  const generate = async () => {
    if (!title || !description || !author) {
      return alert("Please enter title, description, and author names!");
    }
    if (epub) {
      saveAs(epub, `${title}.epub`);
    }
  };

  return (
    <div className={classNames("flex justify-between")}>
      <div className="space-y-2 mt-6 flex flex-col">
        <CustomSelect value={tag} onChange={(e) => setTag(e.target.value)}>
          <option disabled selected value={""}>
            Select tag
          </option>
          {tagsToShow.map((tag, i) => (
            <option key={i} value={tag}>
              {tag}
            </option>
          ))}
        </CustomSelect>
        {!!chapterNotes.length && (
          <div className="text-sm space-y-2 max-w-sm">
            <List>
              {chapterNotes.map((note, i) => (
                <List.Item
                  key={i}
                  onClick={() => navigate(`/write/note/${note.id}`)}
                >
                  {i + 1}. {textToTitle(note.text)}
                </List.Item>
              ))}
            </List>
          </div>
        )}
        <CustomInput
          type="text"
          placeholder="Book name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <CustomInput
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <CustomInput
          type="text"
          placeholder="Author name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <label className="space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={noHashtags}
            onChange={(e) => setNoHashtags(e.target.checked)}
          />
          <span>Remove hashtags</span>
        </label>
        <label className="space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={chapterLabel}
            onChange={(e) => setChapterLabel(e.target.checked)}
          />
          <span>Chapter labels</span>
        </label>
        <div className="pt-4 flex justify-end">
          <Button onClick={generate}>Download</Button>
        </div>
      </div>
      <div>
        <Preview epub={epub} />
      </div>
    </div>
  );
};
