import { cloneElement, useContext, useMemo } from "react";
import { EditorContext } from "../Context";
import { getImageAddresses, getTimeline } from "../Timeline";
import { textToTitle } from "../../../Note";
import moment from "moment";
import { BiFile, BiTimeFive } from "react-icons/bi";
import { SavedNote } from "../type";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import { highlight, makeExtractor } from "../Marker";
import { blobToB64, escape } from "../../../util";

const cachedImages: Record<string, any> = {};

const Highligher = (word: string) =>
  makeExtractor(
    () => RegExp(escape(word), "i"),
    (text: string) => ({
      type: "element",
      content: (
        <span
          className={classNames(
            "bg-primary bg-opacity-20",
            "border-b-2 border-opacity-70 border-primary"
          )}
        >
          {text}
        </span>
      ),
    })
  );

const Timeline = () => {
  const navigate = useNavigate();
  const { notesToShow, storage } = useContext(EditorContext);
  const timeline = useMemo(() => {
    return getTimeline(notesToShow);
  }, [notesToShow]);

  const handleNoteClick = (note: SavedNote) => {
    navigate(`/write/note/${note.id}`);
  };

  const loadImage = async (noteId: string, attachmentId: string) => {
    if (!cachedImages[`${noteId}-${attachmentId}`]) {
      cachedImages[`${noteId}-${attachmentId}`] = null;
      const blob = await storage.pouch.attachment(noteId, attachmentId);
      const uri = await blobToB64(blob);
      cachedImages[`${noteId}-${attachmentId}`] = uri;
    }

    const elems = document.querySelectorAll(
      `.timeline-img-${noteId}-${attachmentId}`
    );
    for (const elem of Array.from(elems)) {
      elem.setAttribute("src", cachedImages[`${noteId}-${attachmentId}`]!);
    }
  };

  if (!timeline) return null;

  return (
    <div>
      <ul className="space-y-2 pb-10">
        {timeline.map((item, i) => {
          const imgAddresses = getImageAddresses(item.summary.note.text);
          imgAddresses.forEach((addr) => loadImage(item.summary.note.id, addr));
          return (
            <li
              key={i}
              className="border-b last:border-b-0 border-primary border-opacity-10 py-4"
            >
              <div className="flex items-center justify-between mb-2">
                {/* Top section */}
                <span className="text-xs text-primary text-opacity-50 font-bold">
                  {moment(item.date).format("YYYY-MM-DD")}
                </span>
                <span
                  className={classNames(
                    "w-6 h-6 rounded-full bg-primary bg-opacity-20",
                    "flex justify-center items-center text-sm"
                  )}
                >
                  {item.type === "note" ? <BiFile /> : <BiTimeFive />}
                </span>
              </div>

              {/* Images */}
              <div className="flex space-x-2 mb-2">
                {imgAddresses.map((addr, i) => (
                  <div
                    key={i}
                    className={classNames(
                      "w-20 h-20 overflow-hidden rounded-md",
                      "border border-primary border-opacity-10"
                    )}
                  >
                    <img
                      className={classNames(
                        `timeline-img-${item.summary.note.id}-${addr}`,
                        "object-cover",
                        "w-full h-full"
                      )}
                      alt="Retro Note"
                    />
                  </div>
                ))}
              </div>

              {/* Mention */}
              {item.text && (
                <div className="text-normal">
                  {highlight(item.text, [Highligher(item.dateStr || "")])
                    .map((it, i) => {
                      if (typeof it === "string") {
                        return <span>{it}</span>;
                      }
                      return it;
                    })
                    .map((it, i) => cloneElement(it, { key: i }))}
                </div>
              )}

              {/* Footer */}
              <div
                className={classNames(
                  "mt-2 flex items-center space-x-1",
                  "text-primary hover:text-opacity-100 cursor-pointer",
                  {
                    "text-opacity-50 text-xs": item.type === "mention",
                  }
                )}
                onClick={() => handleNoteClick(item.summary.note)}
              >
                {item.type === "mention" && <span>Mentioned in - </span>}
                {item.type === "note" && <span>Wrote </span>}
                <BiFile />
                <span>{textToTitle(item.summary.note.text, 40)}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Timeline;
