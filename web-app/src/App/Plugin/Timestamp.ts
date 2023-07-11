import moment from "moment";
import { RNPluginCreator } from "./type";
import { Suggestion } from "../Core/Slate/Editor";

const dtToIso = (dt: Date) => {
  return moment(dt).format("YYYY-MM-DDTHH:mm:ss");
};

export const TimestampPlugin: RNPluginCreator = () => ({
  name: "Timestamp",
  init: console.log,
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
        return suggestions;
      },
    },
  },
});
