import { useContext, useMemo, useState } from "react";
import { getNWords } from "../util";
import { AppContext } from "../components/AppContext";
import { NoteCollection } from "../components/localStorage";
import { Header } from "../comps/Typo";
import moment from "moment";

const smooth = (min: number, max: number, num: number) => {
  let pct = num / max;
  if (Number.isNaN(pct)) {
    pct = 0;
  }
  return min + (max - min) * pct;
};

const getOpacity = (num: number, max: number) => {
  const smoothen = smooth(0, 1, num / max);
  if (smoothen === 0) return 0;
  if (smoothen < 0.25) return 0.25;
  if (smoothen < 0.5) return 0.5;
  if (smoothen < 0.75) return 0.75;
  return smoothen;
};

const dtToStr = (dt: Date) => moment(dt).format("MMM Do YY");

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
  return countsMap;
};

const StreakBox = ({ opacity }: { opacity: number }) => {
  return (
    <div className="w-[20px] h-[20px] border-primary-700 border rounded">
      <div className="bg-primary-700 w-full h-full" style={{ opacity }} />
    </div>
  );
};

const Streak = () => {
  const { notes } = useContext(AppContext);
  const counts = useMemo(() => getStreakCounts(notes, 7), [notes]);
  const [hovered, setHovered] = useState<{ dt: string; count: number }>();

  return (
    <div>
      <Header>My streak</Header>
      <div>
        <ul className="flex space-x-1 text-sm">
          {Object.keys(counts).map((dt, i) => (
            <li
              key={i}
              onMouseEnter={() => setHovered({ dt, count: counts[dt] })}
            >
              <StreakBox
                opacity={getOpacity(
                  counts[dt],
                  Math.max(...Object.values(counts))
                )}
              />
            </li>
          ))}
        </ul>
        <div className="pt-1 text-sm">
          {!hovered && <span className="opacity-50">Hover for info!</span>}
          {hovered && (
            <span>
              {hovered.dt} - {hovered.count} words!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Streak;
