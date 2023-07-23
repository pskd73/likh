import { useContext, useMemo } from "react";
import Calendar from "src/App/Calendar";
import { SavedNote } from "src/App/type";
import { EditorContext } from "src/App/Context";
import moment from "moment";

const HomeCalendar = () => {
  const { allNotes } = useContext(EditorContext);

  const counts = useMemo(() => {
    const _map: Record<string, SavedNote[]> = {};
    Object.values(allNotes).forEach((note) => {
      const key = moment(note.created_at).format("YYYY-MM-DD");
      if (!_map[key]) {
        _map[key] = [];
      }
      _map[key].push(note);
    });

    const counts: Record<string, number> = {};
    Object.keys(_map).forEach((key) => {
      counts[key] = _map[key].length;
    });
    return counts;
  }, [allNotes]);

  return (
    <div>
      <Calendar counts={counts} onCellClick={console.log} />
    </div>
  );
};

export default HomeCalendar;
