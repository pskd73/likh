import classNames from "classnames";
import { ComponentProps, ReactElement, cloneElement } from "react";
import { twMerge } from "tailwind-merge";

const Clickable = ({
  children,
  lite,
  className,
  ...restProps
}: ComponentProps<"span"> & {
  children: ReactElement;
  lite?: boolean;
}) => {
  return (
    <span
      className={twMerge(
        className,
        classNames("hover:underline cursor-pointer decoration-2", {
          "opacity-50 hover:opacity-100": lite,
        })
      )}
      {...restProps}
    >
      {children}
    </span>
  );
};

export default Clickable;
