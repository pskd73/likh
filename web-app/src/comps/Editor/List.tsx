import classNames from "classnames";
import { ComponentProps, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

const List = ({ children }: PropsWithChildren) => {
  return <ul className="">{children}</ul>;
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
      {...restProps}
    >
      {children}
    </li>
  );
};

List.Item = Item;

export default List;
