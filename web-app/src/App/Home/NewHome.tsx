import moment from "moment";
import { useEffect, useRef, useState } from "react";

const DateTime = () => {
  const [time, setTime] = useState(new Date());
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const timer = useRef<NodeJS.Timer>();

  useEffect(() => {
    const now = new Date();
    timeout.current = setTimeout(() => {
      handleEveryMinute();
      timer.current = setInterval(handleEveryMinute);
    }, (60 - now.getSeconds()) * 1000);
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, []);

  const handleEveryMinute = () => {
    setTime(new Date());
  };

  const _moment = moment(time);
  const first = _moment.format("ddd, DD MMM hh:mm");
  const second = _moment.format("A");

  return (
    <div className="font-SourceSans3 text-4xl">
      {first} <span className="text-xl">{second}</span>
    </div>
  );
};

const NewHome = () => {
  return (
    <div>
      <div className="flex justify-end">
        <DateTime />
      </div>
    </div>
  );
};

export default NewHome;
