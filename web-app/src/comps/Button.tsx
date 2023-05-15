import classNames from "classnames";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

const Button = ({
  children,
  className,
  lite,
  ...restProps
}: ComponentProps<"button"> & { lite?: boolean }) => {
  return (
    <button
      className={twMerge(
        className,
        classNames(
          "px-2 py-1 rounded bg-primary-700 transition-all",
          {
            "opacity-50 hover:opacity-100 hover:bg-opacity-10 bg-opacity-0 active:bg-opacity-20": lite,
            "bg-opacity-20 hover:bg-opacity-30 active:bg-opacity-40": !lite,
          }
        )
      )}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default Button;
