import {
  cloneElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { EditorContext } from "src/App/Context";
import { getImageAddresses, getTimeline } from "src/App/Timeline";
import { textToTitle } from "src/Note";
import moment from "moment";
import { BiFile, BiSortAZ, BiSortZA, BiTimeFive } from "react-icons/bi";
import { SavedNote } from "src/App/type";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import { highlight, makeExtractor } from "src/App/Marker";
import { blobToB64, escape } from "src/util";
import useDelayedEffect from "src/App/useDelayedEffect";
import Button from "src/comps/Button";

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
  const [scrollElem, setScrollElem] = useState<Element>();
  const [timelineElems, setTimelineElems] = useState<Element[]>([]);
  const [focusDt, setFocusDt] = useState<string>();
  const focusDtRef = useRef<HTMLDivElement>(null);
  const [asc, setAsc] = useState(false);
  const timeline = useMemo(() => {
    let timeline = getTimeline(notesToShow);
    if (!asc) {
      timeline = timeline.reverse();
    }
    if (timeline.length) {
      setFocusDt(moment(timeline[0].date).format("YYYY MMMM DD"));
    }
    return timeline;
  }, [notesToShow, asc]);

  useEffect(() => {
    document
      .getElementById("page-container")
      ?.addEventListener("scrollend", handleScroll);
    document
      .getElementById("page-container")
      ?.addEventListener("touchend", handleScroll);
    return () => {
      document
        .getElementById("page-container")
        ?.removeEventListener("scrollend", handleScroll);
      document
        .getElementById("page-container")
        ?.removeEventListener("touchend", handleScroll);
    };
  }, [timelineElems]);

  useDelayedEffect(
    () => {
      setScrollElem(document.getElementById("page-container")!);
      const elems = document.querySelectorAll("li.timeline");
      setTimelineElems(Array.from(elems));
    },
    [],
    1000
  );

  // useEffect(() => {
  //   focusDtRef.current && (focusDtRef.current.style.scale = "1.2");
  //   setTimeout(() => {
  //     focusDtRef.current && (focusDtRef.current.style.scale = "1");
  //   }, 200);
  // }, [focusDt]);

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

  const getCurrentElem = () => {
    for (const elem of timelineElems) {
      if ((elem as any).offsetTop >= (scrollElem?.scrollTop || 0)) {
        setFocusDt(elem.getAttribute("data-date-str") || undefined);
        break;
      }
    }
  };

  const handleScroll = () => {
    setTimeout(getCurrentElem, 0);
  };

  if (!timeline) return null;

  return (
    <div>
      <div
        ref={focusDtRef}
        className={classNames(
          "sticky top-0",
          "flex items-center space-x-4 z-20",
          {
            hidden: !focusDt,
          }
        )}
      >
        <div
          className={classNames(
            "px-3 py-1 rounded-full shadow-lg transition-all",
            "bg-primary text-xl font-bold text-base",
            "inline-block"
          )}
        >
          {focusDt}
        </div>
        <div>
          <Button
            className={classNames(
              "rounded-full text-xl p-2 bg-primary text-base bg-opacity-100",
              "hover:bg-opacity-100 shadow-md hover:shadow-lg transition-all"
            )}
            onClick={() => setAsc((a) => !a)}
          >
            {asc ? <BiSortAZ /> : <BiSortZA />}
          </Button>
        </div>
      </div>
      <ul className="space-y-2 pb-10">
        {timeline.map((item, i) => {
          const imgAddresses = getImageAddresses(item.summary.note.text);
          imgAddresses.forEach((addr) => loadImage(item.summary.note.id, addr));
          return (
            <li
              key={i}
              data-date-str={moment(item.date).format("YYYY MMMM DD")}
              className={classNames(
                "border-b last:border-b-0 border-primary border-opacity-10 py-4",
                "timeline"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                {/* Top section */}
                <span className="text-primary text-opacity-50 font-bold">
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
              <div className="flex gap-2 mb-2 flex-wrap">
                {imgAddresses.map((addr, i) => (
                  <div
                    key={i}
                    className={classNames(
                      "w-40 h-40 overflow-hidden rounded-md",
                      "border border-primary border-opacity-10"
                    )}
                  >
                    <img
                      className={classNames(
                        `timeline-img-${item.summary.note.id}-${addr}`,
                        "object-cover",
                        "w-full h-full"
                      )}
                      src={cachedImages[`${item.summary.note.id}-${addr}`]}
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
                <BiFile />
                <span>{textToTitle(item.summary.note.text, 20)}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Timeline;
