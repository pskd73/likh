import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export const Input = ({ className, ...restProps }: ComponentProps<"input">) => {
  return (
    <input
      placeholder="Add topic"
      className={twMerge(
        className,
        "outline-none h-9 px-2 flex items-center bg-primary-700 rounded bg-opacity-30 placeholder-primary-700"
      )}
      {...restProps}
    />
  );
};

export const Select = ({
  className,
  children,
  ...restProps
}: ComponentProps<"select">) => {
  return (
    <select
      className={twMerge(
        className,
        "h-9 px-2 rounded bg-primary-700 bg-opacity-30"
      )}
      {...restProps}
    >
      {children}
    </select>
  );
};
