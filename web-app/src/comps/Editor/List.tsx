import classNames from "classnames";
import { ComponentProps, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

const List = ({ children }: PropsWithChildren) => {
  return <ul className="max-h-[400px] overflow-y-auto">{children}</ul>;
};

const Item = ({ children, className, ...restProps }: ComponentProps<"li">) => {
  return (
    <li
      className={twMerge(
        classNames(
          "p-2 border-b last:border-b-0 border-primary-700 border-opacity-20",
          "bg-primary-700 bg-opacity-0 hover:bg-opacity-5 transition-colors",
          "cursor-pointer"
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
