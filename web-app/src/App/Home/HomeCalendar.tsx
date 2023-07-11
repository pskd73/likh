import { useContext, useMemo } from "react";
import Calendar from "src/App/Calendar";
import { SavedNote } from "src/App/type";
import { EditorContext } from "src/App/Context";
import moment from "moment";

const HomeCalendar = () => {
  const { notesToShow } = useContext(EditorContext);

  const counts = useMemo(() => {
    const _map: Record<string, SavedNote[]> = {};
    notesToShow.forEach((summary) => {
      const key = moment(summary.note.created_at).format("YYYY-MM-DD");
      if (!_map[key]) {
        _map[key] = [];
      }
      _map[key].push(summary.note);
    });

    const counts: Record<string, number> = {};
    Object.keys(_map).forEach((key) => {
      counts[key] = _map[key].length;
    });
    return counts;
  }, [notesToShow]);

  return (
    <div>
      <Calendar counts={counts} onCellClick={console.log} />
    </div>
  );
};

export default HomeCalendar;
