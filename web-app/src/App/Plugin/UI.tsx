import classNames from "classnames";
import { ComponentProps } from "react";
import { Input, Select } from "src/comps/Form";
import { twMerge } from "tailwind-merge";

export const CustomInput = ({
  className,
  ...restProps
}: ComponentProps<"input">) => {
  return (
    <Input
      type="text"
      className={twMerge(
        classNames(
          "h-auto py-1 placeholder-primary placeholder-opacity-50",
          "border border-primary border-opacity-20",
          "max-w-sm w-full"
        ),
        className
      )}
      {...restProps}
    />
  );
};

export const CustomSelect = ({
  children,
  ...restProps
}: ComponentProps<"select">) => {
  return (
    <Select
      className={classNames(
        "h-auto px-2 py-1",
        "border border-primary border-opacity-20",
        "max-w-sm w-full"
      )}
      {...restProps}
    >
      {children}
    </Select>
  );
};
