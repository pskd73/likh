import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

const ScrollableCol = ({
  children,
  className,
  ...restProps
}: ComponentProps<"div">) => {
  return (
    <div
      className={twMerge(
        className,
        "max-h-[90vh] overflow-y-scroll scrollbar-hide"
      )}
      {...restProps}
    >
      {children}
    </div>
  );
};

export default ScrollableCol;
