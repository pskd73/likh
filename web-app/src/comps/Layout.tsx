import { ComponentProps, PropsWithChildren } from "react";
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
      <div className="w-[860px] p-4 md:p-0">{children}</div>
    </div>
  );
};

export const NoMobile = ({ children }: PropsWithChildren) => {
  if (window.innerWidth < 860) {
    return (
      <div className="w-full h-[100vh] flex justify-center items-center text-center">
        Not supported on this device! Log in from PC/Mac
      </div>
    );
  }
  return <>{children}</>;
};
