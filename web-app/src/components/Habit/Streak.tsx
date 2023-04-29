import { useContext, useMemo } from "react";
import { getNWords, numberWithCommas } from "../../util";
import { AppContext } from "../AppContext";
import { NoteCollection } from "../localStorage";

const numToTxt = (num: number) => {
  if (num === 0) {
    return ":(";
  }
  return numberWithCommas(num);
};

const getOpacity = (num: number, max: number) => {
  const op = num / max;
  return Math.max(0.2, op);
};

const dtToStr = (dt: Date) =>
  `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;

const getStreakCounts = (collection: NoteCollection, n: number) => {
  const countsMap: Record<string, number> = {};
  const DAY = 24 * 60 * 60 * 1000;

  const now = new Date().getTime();
  for (let i = 0; i < n; i++) {
    countsMap[dtToStr(new Date(now - i * DAY))] = 0;
  }
  for (const note of Object.values(collection)) {
    const dt = new Date(note.createdAt);
    const dtStr = dtToStr(dt);
    if (countsMap[dtStr] !== undefined) {
      countsMap[dtStr] += getNWords(note.text);
    }
  }
  return Object.values(countsMap);
};

const Streak = () => {
  const { collection } = useContext(AppContext);
  const counts = useMemo(
    () => (collection ? getStreakCounts(collection, 7) : []),
    [collection]
  );

  return (
    <div>
      Streak (w)
      <br />
      ~~~~~~
      <div>
        <ul className="flex space-x-4 text-sm">
          {counts.map((count, i) => (
            <li
              key={i}
              style={{ opacity: getOpacity(count, Math.max(...counts)) }}
            >
              {numToTxt(count)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Streak;
