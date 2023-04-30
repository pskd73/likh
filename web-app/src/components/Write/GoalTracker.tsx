import { useContext, useMemo } from "react";
import { AppContext } from "../AppContext";
import { getNWords } from "../../util";

const goalToWordCount: Record<string, number> = {
  short: 200,
  medium: 500,
  long: 1000,
};

const GoalTracker = () => {
  const { getEditingNote, collection, editingNoteId, settings } =
    useContext(AppContext);
  const pct = useMemo(() => {
    const note = getEditingNote();
    if (note && settings.goal) {
      const goalWords = goalToWordCount[settings.goal];
      const currentWords = getNWords(note.text);
      return Math.floor(Math.min(100, (currentWords / goalWords) * 100));
    }
  }, [collection, editingNoteId, settings.goal]);

  return pct !== undefined ? (
    <div style={{ opacity: Math.max(pct / 100, 0.1) }}>{pct}%</div>
  ) : null;
};

export default GoalTracker;
