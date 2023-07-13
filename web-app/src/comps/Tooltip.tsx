import classNames from "classnames";
import {
  ComponentProps,
  ReactElement,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";

const Tooltip = ({
  className,
  children,
  tip,
  direction = "bottom",
  multiline,
  ...restProps
}: ComponentProps<"div"> & {
  tip: ReactElement | string;
  direction?: "top" | "bottom";
  multiline?: boolean;
}) => {
  const [active, setActive] = useState(true);
  const ref = useRef<NodeJS.Timeout>();

  const handleEnter = () => {
    ref.current = setTimeout(() => {
      setActive(true);
    }, 500);
  };

  const handleLeave = () => {
    setActive(false);
    if (ref.current) {
      clearTimeout(ref.current);
    }
  };

  return (
    <div className={twMerge(className, "group relative")} {...restProps}>
      <div
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="flex h-full"
      >
        {children}
      </div>
      <div
        className={classNames(
          "absolute left-1/2 -translate-x-1/2",
          "-my-1 mx-auto z-40",
          {
            "inline-block": active,
            hidden: !active,
          },
          {
            "top-full mt-1": direction === "bottom",
            "bottom-full mb-1": direction === "top",
          }
        )}
      >
        {direction === "bottom" && (
          <div
            className={classNames(
              "w-0 h-0 border-l-[6px] border-l-transparent",
              "border-b-[6px] border-b-primary",
              "border-r-[6px] border-r-transparent",
              "mx-auto"
            )}
          />
        )}
        <div
          className={classNames(
            "text-xs bg-primary text-base rounded px-2 py-1 text-center",
            "shadow-md max-w-[150px]",
            {
              "whitespace-nowrap": !multiline,
              "w-32": multiline,
            }
          )}
        >
          {tip}
        </div>
        {direction === "top" && (
          <div
            className={classNames(
              "w-0 h-0 border-l-[6px] border-l-transparent",
              "border-b-[6px] border-b-primary",
              "border-r-[6px] border-r-transparent",
              "mx-auto rotate-180"
            )}
          />
        )}
      </div>
    </div>
  );
};

export default Tooltip;
