import classNames from "classnames";
import moment from "moment";
import { useMemo, useState } from "react";
import { Note } from "../type";
import { BiArrowBack, BiChevronLeft, BiChevronRight } from "react-icons/bi";
import Button from "./Button";

type CalenderDay = {
  dt: Date;
  today: boolean;
  otherMonth: boolean;
  notes: Note[];
};

const now = new Date();

const Calendar = ({
  notes,
  onCellClick,
  active,
}: {
  notes: Note[];
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
    <div className="mb-10">
      <div className="text-4xl font-CourierPrime italic flex justify-between mb-4">
        <div>{year}</div>
        <div className="flex items-center space-x-4">
          <Button lite onClick={handlePrev}>
            <BiChevronLeft />
          </Button>
          <div>{monthName}</div>
          <Button lite onClick={handleNext}>
            <BiChevronRight />
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        {days.map((rows, i) => (
          <div key={i} className="flex space-x-2">
            {rows.map((cell, j) => (
              <div
                key={j}
                style={{ width: `${100 / 7}%` }}
                className={classNames(
                  "bg-primary-700 bg-opacity-10 rounded-md p-2 hover:shadow-md cursor-pointer border-2 border-primary-700",
                  {
                    "opacity-40": cell.otherMonth,
                    "border-opacity-0": !cell.today && active !== cell.dt,
                    "border-opacity-30": cell.today,
                    "border-opacity-80": active === cell.dt,
                  }
                )}
                onClick={() => onCellClick(cell)}
              >
                <div className="flex justify-end font-CourierPrime text-lg italic">
                  <span
                    className={classNames(
                      "w-8 h-8 flex justify-center items-center",
                      {
                        "bg-primary-700 bg-opacity-20 rounded-full": false,
                      }
                    )}
                  >
                    {cell.dt.getDate()}
                  </span>
                </div>
                <div>
                  <span
                    className={classNames(
                      "text-xs px-1 bg-primary-700 text-white rounded",
                      { invisible: !cell.notes.length }
                    )}
                  >
                    {cell.notes.length || 0}
                  </span>
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
