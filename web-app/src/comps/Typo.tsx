import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export const Header = ({
  className,
  children,
  ...restProps
}: ComponentProps<"h3">) => {
  return (
    <h3 className={twMerge(className, "text-lg font-bold mb-1")} {...restProps}>
      {children}
    </h3>
  );
};
