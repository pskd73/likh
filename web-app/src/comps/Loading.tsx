import classNames from "classnames";
import { randomInt } from "../util";
import { useMemo } from "react";

const TextBlock = ({
  height,
  empty,
  start,
  width,
}: {
  height: number;
  empty: boolean;
  start?: boolean;
  width?: number;
}) => {
  return (
    <div
      className={classNames({ "pl-4": start })}
      style={{ width: width ? `${width}px` : "100%" }}
    >
      <div
        className={classNames("shine w-full bg-opacity-10 rounded-md mb-1", {
          "bg-primary": !empty,
        })}
        style={{ height }}
      />
    </div>
  );
};

export const Para = () => {
  const nLines = useMemo(() => randomInt(3, 5), []);
  const lastLineWidth = useMemo(() => randomInt(10, 80), []);

  const iS: number[] = [];
  for (let i = 0; i < nLines; i++) {
    iS.push(i);
  }
  return (
    <div className="w-full">
      {iS.map((i) => (
        <TextBlock
          key={i}
          height={10}
          empty={false}
          start={i === 0}
          width={i === nLines - 1 ? lastLineWidth : undefined}
        />
      ))}
    </div>
  );
};

export const Loader = () => {
  return (
    <div className="w-[100px] h-[100px] animate-pulse">
      <Para />
    </div>
  );
};

export const FullLoader = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Loader />
    </div>
  );
};
