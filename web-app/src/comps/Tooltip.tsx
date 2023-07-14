import classNames from "classnames";
import {
  ComponentProps,
  MouseEventHandler,
  PropsWithChildren,
  ReactElement,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";

type Position = { top: number; left: number; direction: "bottom" | "top" };

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
  const ref = useRef<HTMLDivElement>(null);
  const timeout = useRef<NodeJS.Timeout>();
  const [pos, setPos] = useState<Position>({
    top: -9999,
    left: -9999,
    direction: "bottom",
  });
  const [triangePos, setTrianglePos] = useState<Position>({
    top: -9999,
    left: -9999,
    direction: "bottom",
  });

  const getPosition = (
    rect: DOMRect,
    popup: { width: number; height: number },
    preferredDirection?: "bottom" | "top"
  ): Position => {
    let top = rect.top + rect.height;
    let left = rect.left;
    let direction: "bottom" | "top" = "bottom";

    const targetCenter = left + rect.width / 2;
    const halfWidthTarget = popup.width / 2;

    left = targetCenter - halfWidthTarget;
    if (left < 0) {
      left = 4;
    }
    if (left + popup.width > window.innerWidth - 4) {
      left -= left + popup.width - window.innerWidth + 4;
    }

    if (
      preferredDirection === "top" ||
      top + popup.height > window.innerHeight - 4
    ) {
      direction = "top";
      top = rect.top - popup.height;
    }

    return { top, left, direction };
  };

  const handleEnter = (div: HTMLDivElement) => {
    timeout.current = setTimeout(
      (
        (target: HTMLDivElement): any =>
        () => {
          if (ref.current) {
            const pos = getPosition(
              target.getBoundingClientRect(),
              ref.current!.getBoundingClientRect()
            );
            setPos({
              left: pos.left,
              top: pos.direction === "bottom" ? pos.top + 6 : pos.top - 6,
              direction: pos.direction,
            });

            const triPos = getPosition(
              target.getBoundingClientRect(),
              {
                width: 12,
                height: 6,
              },
              pos.direction
            );
            setTrianglePos({
              left: triPos.left,
              top: triPos.top,
              direction: pos.direction,
            });
          }
        }
      )(div),
      300
    );
  };

  const handleLeave = () => {
    setPos({ top: -9999, left: -9999, direction: "bottom" });
    setTrianglePos({ top: -9999, left: -9999, direction: "bottom" });
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  };

  return (
    <div className={twMerge(className, "group relative")} {...restProps}>
      <div
        onMouseEnter={(e) => handleEnter(e.currentTarget)}
        onMouseLeave={handleLeave}
        onFocus={(e) => handleEnter(e.currentTarget)}
        onBlur={handleLeave}
        className="flex h-full"
      >
        {children}
      </div>
      <div
        className={classNames(
          "w-0 h-0 border-l-[6px] border-l-transparent",
          "border-b-[6px] border-b-primary",
          "border-r-[6px] border-r-transparent",
          "mx-auto fixed z-50"
        )}
        style={{
          top: triangePos.top,
          left: triangePos.left,
          rotate: triangePos.direction === "bottom" ? "0deg" : "180deg",
        }}
      />
      <div
        ref={ref}
        className={classNames(
          "fixed text-xs bg-primary text-base rounded px-2 py-1 text-center",
          "shadow-md z-50"
        )}
        style={{ top: pos.top, left: pos.left }}
      >
        {tip}
      </div>
    </div>
  );
};

const Shortcut = ({ children }: PropsWithChildren) => (
  <span className="opacity-50 ml-1 inline-block">{children}</span>
);

Tooltip.Shortcut = Shortcut;

export default Tooltip;
