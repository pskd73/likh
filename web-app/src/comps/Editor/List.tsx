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
  ...restProps
}: ComponentProps<"li"> & { active?: boolean; noHover?: boolean }) => {
  return (
    <li
      className={twMerge(
        classNames("py-1 px-2", "rounded text-sm last:mb-4", {
          "bg-opacity-10": active,
          "bg-opacity-0": !active,
          "bg-primary-700  transition-colors cursor-pointer": !noHover,
          "hover:bg-opacity-10 active:bg-opacity-20": !noHover,
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
  return <div className="text-xs py-1 ml-5 opacity-50">{children}</div>;
};

Item.Description = Description;
List.Item = Item;

export default List;
