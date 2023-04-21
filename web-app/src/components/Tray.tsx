import * as React from "react";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

const Tray = ({ children, className, ...restProps }: ComponentProps<"div">) => {
  return (
    <div
      className={twMerge(className, "absolute top-0 h-full w-full shadow-md bg-white")}
      {...restProps}
    >
      {children}
    </div>
  );
};

export default Tray;
