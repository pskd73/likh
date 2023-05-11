import { useContext, useMemo } from "react";
import { AppContext } from "../components/AppContext";
import { getNWords } from "../util";
import { Note } from "../type";

const goalToWordCount: Record<string, number> = {
  short: 200,
  medium: 500,
  long: 1000,
};

const GoalTracker = ({ note }: { note: Note }) => {
  const { settings } = useContext(AppContext);
  const pct = useMemo(() => {
    if (note && settings.goal) {
      const goalWords = goalToWordCount[settings.goal];
      const currentWords = getNWords(note.text);
      return Math.floor(Math.min(100, (currentWords / goalWords) * 100));
    }
  }, [note, settings.goal]);

  return pct !== undefined ? (
    <div className="flex items-center">
      <div className="w-[100px] bg-primary-700 bg-opacity-30 h-2 rounded overflow-hidden">
        <div
          className="h-full bg-primary-700 bg-opacity-70 rounded"
          style={{ width: `${pct}%` }}
        />
      </div>
      &nbsp;<span className="opacity-50 w-10 text-center">{pct}%</span>
    </div>
  ) : null;
};

export default GoalTracker;
