import classNames from "classnames";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

const Clickable = ({
  children,
  lite,
  className,
  disabled,
  onClick,
  ...restProps
}: ComponentProps<"span"> & {
  lite?: boolean;
  disabled?: boolean;
}) => {
  return (
    <span
      className={twMerge(
        className,
        classNames({
          "hover:underline cursor-pointer decoration-2": !disabled,
          "opacity-50 hover:opacity-100": lite && !disabled,
          "opacity-30": disabled,
        })
      )}
      {...restProps}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </span>
  );
};

export default Clickable;
