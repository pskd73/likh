import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export const Paper = ({
  children,
  className,
  ...restProps
}: ComponentProps<"div">) => {
  return (
    <div
      className={twMerge("flex justify-center text-primary-700", className)}
      {...restProps}
    >
      <div className="w-[860px]">{children}</div>
    </div>
  );
};
