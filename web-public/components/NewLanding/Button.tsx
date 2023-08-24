import classNames from "classnames";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { Courier } from "../font";

const LinkButton = ({
  className,
  children,
  ...restProps
}: ComponentProps<"a">) => {
  return (
    <a
      className={twMerge(
        className,
        classNames(
          "bg-primary-700 text-white py-4 px-8",
          "italic text-3xl rounded-full",
          "block",
          Courier.className
        )
      )}
      {...restProps}
    >
      {children}
    </a>
  );
};

export default LinkButton;
