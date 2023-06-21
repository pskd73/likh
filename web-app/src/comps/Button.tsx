import classNames from "classnames";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

const Button = ({
  children,
  className,
  lite,
  disabled,
  ...restProps
}: ComponentProps<"button"> & {
  lite?: boolean;
}) => {
  const _className = twMerge(
    classNames("px-2 py-1 rounded bg-primary-700 transition-all", {
      "opacity-50  bg-opacity-0": lite,
      "bg-opacity-10": !lite,
      "text-primary-700 text-opacity-50": disabled,
      "hover:opacity-100 hover:bg-opacity-10 active:bg-opacity-20":
        lite && !disabled,
      "hover:bg-opacity-20 active:bg-opacity-30": !lite && !disabled,
    }),
    className
  );
  return (
    <button className={_className} {...(restProps as ComponentProps<"button">)}>
      {children}
    </button>
  );
};

export default Button;
