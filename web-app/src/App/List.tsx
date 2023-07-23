import classNames from "classnames";
import {
  ComponentProps,
  KeyboardEventHandler,
  MouseEventHandler,
  PropsWithChildren,
} from "react";
import { twMerge } from "tailwind-merge";

const List = ({ children, className, ...restProps }: ComponentProps<"ul">) => {
  return (
    <ul className={className} {...restProps}>
      {children}
    </ul>
  );
};

const Item = ({
  children,
  className,
  active,
  noHover,
  withIcon,
  onClickKind,
  ...restProps
}: ComponentProps<"li"> & {
  active?: boolean;
  noHover?: boolean;
  withIcon?: boolean;
  onClickKind?: (
    type: "click" | "keyup",
    clickEvent?: React.MouseEvent<HTMLLIElement, MouseEvent>,
    keyUpEvent?: React.KeyboardEvent<HTMLLIElement>
  ) => void;
}) => {
  const handleClick: MouseEventHandler<HTMLLIElement> = (e) => {
    onClickKind && onClickKind("click", e);
  };

  const handleKeyUp: KeyboardEventHandler<HTMLLIElement> = (e) => {
    if (e.key === "Enter" || e.key === "Space") {
      onClickKind && onClickKind("keyup", undefined, e);
    }
  };

  return (
    <li
      onClick={handleClick}
      onKeyUp={handleKeyUp}
      tabIndex={0}
      className={twMerge(
        classNames("py-1 px-2", "rounded outline-none", {
          "bg-opacity-10": active,
          "bg-opacity-0": !active,
          "bg-primary transition-colors cursor-pointer": !noHover,
          "hover:bg-opacity-10 focus:bg-opacity-10 active:bg-opacity-20":
            !noHover,
          "flex space-x-2": withIcon,
        }),
        className
      )}
      {...restProps}
    >
      {children}
    </li>
  );
};

const Description = ({ children }: PropsWithChildren) => {
  return (
    <div className="text-xs py-1 opacity-50 overflow-hidden">
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
