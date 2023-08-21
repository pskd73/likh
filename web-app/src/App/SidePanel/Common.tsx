import classNames from "classnames";
import { PropsWithChildren, useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

export const WithTitle = ({
  title,
  children,
  active: initActive,
  noPadding,
}: PropsWithChildren & {
  title: string;
  active?: boolean;
  noPadding?: boolean;
}) => {
  const [active, setActive] = useState<boolean>(initActive || false);

  const expanded = active || initActive === undefined;

  return (
    <div>
      <div
        className={classNames(
          "text-xs font-bold text-primary text-opacity-40",
          "py-1 flex items-center space-x-1 px-4",
          "hover:bg-primary hover:bg-opacity-10 cursor-pointer"
        )}
        onClick={() => setActive((a) => !a)}
      >
        {initActive !== undefined && (
          <button
            className={classNames(
              "text-lg w-4 h-4 flex justify-center items-center transition-all"
            )}
          >
            {active ? <BiChevronUp /> : <BiChevronDown />}
          </button>
        )}
        <span>{title.toUpperCase()}</span>
      </div>
      <div
        className={classNames("overflow-hidden", {
          "max-h-0": !expanded,
          "max-h-[10000000px]": expanded,
        })}
      >
        {children}
      </div>
    </div>
  );
};
