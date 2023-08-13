import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export const Input = ({ className, ...restProps }: ComponentProps<"input">) => {
  return (
    <input
      placeholder="Add topic"
      className={twMerge(
        "outline-none h-9 px-2 flex items-center bg-primary rounded bg-opacity-10 placeholder-primary-500",
        className
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
        "h-9 px-2 rounded bg-primary bg-opacity-10",
        className
      )}
      {...restProps}
    >
      {children}
    </select>
  );
};
