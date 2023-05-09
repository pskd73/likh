import { useContext, useMemo } from "react";
import { getNWords } from "../util";
import { AppContext } from "../components/AppContext";
import { NoteCollection } from "../components/localStorage";

const getOpacity = (num: number, max: number) => {
  let op = num / max;
  if (Number.isNaN(op)) {
    op = 0;
  }
  return Math.max(0.2, op);
};

const dtToStr = (dt: Date) =>
  `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;

const getStreakCounts = (notes: NoteCollection, n: number) => {
  const countsMap: Record<string, number> = {};
  const DAY = 24 * 60 * 60 * 1000;

  const now = new Date().getTime();
  for (let i = 0; i < n; i++) {
    countsMap[dtToStr(new Date(now - i * DAY))] = 0;
  }
  for (const note of Object.values(notes)) {
    const dt = new Date(note.created_at);
    const dtStr = dtToStr(dt);
    if (countsMap[dtStr] !== undefined) {
      countsMap[dtStr] += getNWords(note.text);
    }
  }
  return Object.values(countsMap);
};

const StreakBox = ({ opacity }: { opacity: number }) => {
  return (
    <div className="w-[30px] h-[30px] border-primary-700 border rounded">
      <div className="bg-primary-700 w-full h-full" style={{ opacity }} />
    </div>
  );
};

const Streak = () => {
  const { notes } = useContext(AppContext);
  const counts = useMemo(() => getStreakCounts(notes, 7), [notes]);

  return (
    <div>
      <h3 className="text-lg mb-1">My streak</h3>
      <div>
        <ul className="flex space-x-2 text-sm">
          {counts.map((count, i) => (
            <li key={i}>
              <StreakBox opacity={getOpacity(count, Math.max(...counts))} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Streak;
