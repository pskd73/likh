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
  ...restProps
}: ComponentProps<"li"> & { active?: boolean }) => {
  return (
    <li
      className={twMerge(
        classNames(
          "py-1 px-2 last:border-b-0 border-primary-700 border-opacity-20",
          "bg-primary-700 hover:bg-opacity-10 active:bg-opacity-20 transition-colors",
          "cursor-pointer rounded text-sm last:mb-4",
          {
            "bg-opacity-10": active,
            "bg-opacity-0": !active,
          }
        ),
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
