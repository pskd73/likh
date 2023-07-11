import { ComponentProps, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export const Title = ({ children }: PropsWithChildren) => {
  return <div className="mb-2 font-bold opacity-50">{children}</div>;
};

export const ListContainer = ({
  className,
  children,
  ...otherProps
}: ComponentProps<"div">) => {
  return (
    <div
      className={twMerge("bg-primary bg-opacity-5 p-2 rounded", className)}
      {...otherProps}
    >
      {children}
    </div>
  );
};
