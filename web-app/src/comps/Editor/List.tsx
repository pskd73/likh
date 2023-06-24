import classNames from "classnames";
import { ComponentProps, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

const List = ({ children }: PropsWithChildren) => {
  return <ul>{children}</ul>;
};

const Item = ({
  children,
  className,
  active,
  noHover,
  withIcon,
  ...restProps
}: ComponentProps<"li"> & {
  active?: boolean;
  noHover?: boolean;
  withIcon?: boolean;
}) => {
  return (
    <li
      className={twMerge(
        classNames("py-1 px-2", "rounded text-sm", {
          "bg-opacity-10": active,
          "bg-opacity-0": !active,
          "bg-primary transition-colors cursor-pointer": !noHover,
          "hover:bg-opacity-10 active:bg-opacity-20": !noHover,
          "flex space-x-1": withIcon,
        }),
        className
      )}
      style={{ marginTop: 2 }}
      {...restProps}
    >
      {children}
    </li>
  );
};

const Description = ({ children }: PropsWithChildren) => {
  return (
    <div className="text-xs py-1 ml-5 opacity-50 overflow-hidden">
      {children}
    </div>
  );
};

const Icon = ({ children }: PropsWithChildren) => {
  return <span className="mt-1">{children}</span>;
};

Item.Icon = Icon;
Item.Description = Description;
List.Item = Item;

export default List;
