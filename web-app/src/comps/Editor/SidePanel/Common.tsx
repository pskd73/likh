import classNames from "classnames";
import { PropsWithChildren, useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

export const WithTitle = ({
  title,
  children,
  active: initActive,
}: PropsWithChildren & { title: string; active?: boolean }) => {
  const [active, setActive] = useState<boolean>(initActive || false);

  const expanded = active || initActive === undefined;

  return (
    <div className="px-4">
      <div
        className={classNames(
          "text-xs font-bold text-primary text-opacity-40",
          "mb-1 flex items-center space-x-1"
        )}
      >
        <span>{title.toUpperCase()}</span>
        {initActive !== undefined && (
          <button
            className={classNames(
              "text-lg w-4 h-4 flex justify-center items-center transition-all",
              "hover:bg-primary hover:bg-opacity-20 rounded cursor-pointer"
            )}
            onClick={() => setActive((a) => !a)}
          >
            {active ? <BiChevronUp /> : <BiChevronDown />}
          </button>
        )}
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
