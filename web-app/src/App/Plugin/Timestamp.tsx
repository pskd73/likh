import moment from "moment";
import { RNPluginCreator } from "./type";
import { Suggestion } from "../Core/Slate/Editor";
import classNames from "classnames";
import { parseListText } from "../Core/List";
import { BiBell, BiTimeFive } from "react-icons/bi";
import { SavedNote } from "../type";
import { getGoogleCalendarLink } from "../Reminder";
import { textToTitle } from "src/Note";

const dtToIso = (dt: Date) => {
  return moment(dt).format("YYYY-MM-DDTHH:mm:ss");
};

const datetime = {
  pattern: /@\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
};

let currentNote: SavedNote | undefined = undefined;

const handleClick = (date: Date, text?: string) => {
  if (currentNote) {
    text = text || `Continue writing "${textToTitle(currentNote.text)}"`;
    const link = getGoogleCalendarLink({
      text,
      date: date,
      location: "https://app.retronote.app/write",
    });
    window.open(link, "_blank");
  }
};

export const TimestampPlugin: RNPluginCreator = () => ({
  version: 1,
  name: "Timestamp",
  suggestions: {
    "@": {
      suggest: (prefix, word) => {
        const suggestions: Suggestion[] = [];
        const amPmMatch = word.match(/(\d+)([ap]m)/);
        if (amPmMatch) {
          let tfHour = Number(amPmMatch[1]);
          if (amPmMatch[2] === "pm") {
            tfHour += 12;
          }
          const now = new Date();
          let dt = moment(now).hour(tfHour).minute(0).second(0);
          if (dt.isBefore(now)) {
            dt = dt.add(1, "days");
          }
          const iso = dtToIso(dt.toDate());
          suggestions.push({
            title: `Next ${word} - ${iso}`,
            replace: `@${iso} `,
          });
        }
        if ("tomorrow".startsWith(word.toLowerCase())) {
          const dt = moment(new Date()).add(1, "day");
          const iso = dtToIso(dt.toDate());
          suggestions.push({
            title: `Tomorrow - ${iso}`,
            replace: `@${iso} `,
          });
        }
        if (word.match(/\d{4}\-\d{2}\-\d{2}/)) {
          const dt = moment(word, "YYYY-MM-DD");
          const iso = dtToIso(dt.toDate());
          suggestions.push({
            title: `${iso}`,
            replace: `@${iso} `,
          });
        }
        if (word === "now") {
          const iso = dtToIso(new Date());
          suggestions.push({
            title: `${iso}`,
            replace: `@${iso} `,
          });
        }
        return suggestions;
      },
    },
  },
  onNoteChange: (note) => {
    currentNote = note;
  },
  grammer: () => ({
    datetime,
  }),
  leafMaker: ({ attributes, children, leaf, text, className }) => {
    if (leaf.datetime) {
      const dt = moment(leaf.text.replace("@", ""));
      const future = dt.isAfter(new Date());
      return (
        <span
          {...attributes}
          className={classNames(
            className,
            "bg-primary bg-opacity-20 px-3 py-1 rounded-full inline-block mb-1 text-xs",
            "inline-flex items-center"
          )}
        >
          {!leaf.punctuation && (
            <span
              contentEditable={false}
              style={{ userSelect: "none" }}
              className="inline-flex items-center space-x-1"
            >
              <span
                className={classNames("text-primary text-opacity-50", {
                  "cursor-pointer hover:text-opacity-100 transition-all":
                    future,
                })}
                onClick={
                  future
                    ? () => {
                        const parsed = parseListText(text.text);
                        handleClick(
                          dt.toDate(),
                          parsed?.checkbox
                            ? text.text
                                .replace("- [ ] ", "")
                                .replace("- [x] ", "")
                            : undefined
                        );
                      }
                    : undefined
                }
              >
                {future ? <BiBell /> : <BiTimeFive />}
              </span>
              <span>
                {dt.fromNow()}
                {leaf.focused && " - "}
              </span>
            </span>
          )}
          <span className={classNames("opacity-50", { hidden: !leaf.focused })}>
            {children}
          </span>
        </span>
      );
    }
  },
});
