import classNames from "classnames";
import moment from "moment";
import { useMemo, useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import Button from "../Button";
import { SavedNote } from "./type";

export type CalenderDay = {
  dt: Date;
  today: boolean;
  otherMonth: boolean;
  notes: SavedNote[];
};

const now = new Date();

const Calendar = ({
  notes,
  onCellClick,
  active,
}: {
  notes: SavedNote[];
  onCellClick: (day: CalenderDay) => void;
  active?: Date;
}) => {
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const days = useMemo<Array<CalenderDay[]>>(() => {
    const firstDay = new Date(year, month, 1);
    const deltaDays = firstDay.getDay();
    const today = new Date();

    const rows: Array<CalenderDay[]> = [];
    for (let i in [...Array(6)]) {
      const cells: CalenderDay[] = [];
      for (let j in [...Array(7)]) {
        const date = new Date(year, month, Number(i) * 7 + Number(j) + 1);
        const dtMoment = moment(date).subtract(deltaDays, "days");

        const dt = dtMoment.toDate();
        cells.push({
          dt,
          today: dt.toDateString() === today.toDateString(),
          otherMonth: dt.getMonth() !== month,
          notes: notes.filter((note) =>
            dtMoment.isSame(new Date(note.created_at), "day")
          ),
        });
      }
      rows.push(cells);
    }
    return rows;
  }, [notes, year, month]);
  const monthName = useMemo<string>(
    () => moment(new Date(year, month, 1)).format("MMMM"),
    [year, month]
  );

  const handlePrev = () => {
    const currentDay = new Date(year, month, 1);
    const previousDay = moment(currentDay).subtract(1, "month");
    setYear(previousDay.year());
    setMonth(previousDay.month());
  };

  const handleNext = () => {
    const currentDay = new Date(year, month, 1);
    const nextDay = moment(currentDay).add(1, "month");
    setYear(nextDay.year());
    setMonth(nextDay.month());
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span>{year}</span>
        <div className="flex items-center">
          <Button lite onClick={handlePrev} className="text-lg">
            <BiChevronLeft />
          </Button>
          <div className="w-24 text-center">{monthName}</div>
          <Button lite onClick={handleNext} className="text-lg">
            <BiChevronRight />
          </Button>
        </div>
      </div>
      <div className="space-y-1 text-xs">
        {days.map((rows, i) => (
          <div key={i} className="flex space-x-1">
            {rows.map((cell, j) => (
              <div
                key={j}
                style={{ width: `${100 / 7}%` }}
                className={classNames(
                  "bg-primary-700 bg-opacity-10 rounded-md p-1 hover:shadow-md",
                  "cursor-pointer border-2 border-primary-700 transition-shadow",
                  "w-10 h-10",
                  {
                    "opacity-40": cell.otherMonth,
                    "border-opacity-0": !cell.today && active !== cell.dt,
                    "border-opacity-60": cell.today,
                    "border-opacity-80": active === cell.dt,
                  }
                )}
                onClick={() => onCellClick(cell)}
              >
                <div className="flex justify-end">{cell.dt.getDate()}</div>
                <div>
                  {cell.notes.map((_, i) => (
                    <span
                      key={i}
                      className="inline-block bg-opacity-80 rounded-full bg-primary-700"
                      style={{marginRight: 2, width: 6, height: 6}}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
