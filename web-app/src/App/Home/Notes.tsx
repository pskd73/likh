import { cloneElement, useContext, useMemo } from "react";
import { EditorContext } from "src/App/Context";
import List from "src/App/List";
import {
  BiFile,
  BiInfoCircle,
} from "react-icons/bi";
import { textToTitle, focus } from "src/Note";
import { highlight, makeExtractor } from "src/App/Marker";
import { escape } from "src/util";
import { useNavigate } from "react-router-dom";
import { SavedNote } from "../type";

const Highligher = (word: string) =>
  makeExtractor(
    () => RegExp(escape(word), "i"),
    (text: string) => ({
      type: "element",
      content: <span className="bg-primary text-base text-xs">{text}</span>,
    })
  );

const Notes = () => {
  const navigate = useNavigate();
  const { allNotes, searchTerm } = useContext(EditorContext);
  const results = useMemo(() => {
    const results: Array<{
      note: SavedNote;
      summary: string;
      start: number;
      end: number;
    }> = [];
    for (const note of Object.values(allNotes)) {
      if (note.text.toLowerCase().includes(searchTerm.toLowerCase())) {
        const idx = note.text.toLowerCase().indexOf(searchTerm.toLowerCase());
        const {
          focused: summary,
          start,
          end,
        } = focus(note.text, idx, searchTerm);
        results.push({
          note,
          summary,
          start,
          end,
        });
      }
    }
    return results;
  }, [searchTerm, allNotes]);

  return (
    <>
      {results.length === 0 && (
        <div className="text-sm p-2 flex items-center space-x-2">
          <span className="opacity-50">
            <BiInfoCircle />
          </span>
          <span>No notes!</span>
        </div>
      )}
      <List>
        {results.map((result) => (
          <List.Item
            key={result.note.id}
            withIcon
            onClickKind={() => navigate(`/write/note/${result.note.id}`)}
            className="flex-col"
          >
            <div className="flex">
              <span className="opacity-50 mt-1 min-w-5 w-5">
                <BiFile />
              </span>
              <span>{textToTitle(result.note.text, 20)}</span>
            </div>
            {!searchTerm.startsWith("#") && (
              <List.Item.Description>
                {highlight(result.summary, [Highligher(searchTerm)])
                  .map((it, i) => {
                    if (typeof it === "string") {
                      return <span>{it}</span>;
                    }
                    return it;
                  })
                  .map((it, i) => cloneElement(it, { key: i }))}
              </List.Item.Description>
            )}
          </List.Item>
        ))}
      </List>
    </>
  );
};

export default Notes;
