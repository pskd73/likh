import classNames from "classnames";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { Courier } from "../font";

const Button = ({
  className,
  children,
  ...restProps
}: ComponentProps<"button">) => {
  return (
    <button
      className={twMerge(
        className,
        classNames("bg-primary-700 text-white py-4 px-8", "italic text-3xl rounded-full", Courier.className)
      )}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default Button;
