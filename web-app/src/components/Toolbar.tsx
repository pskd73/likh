import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

const Toolbar = ({
  children,
  className,
  ...restProps
}: ComponentProps<"div">) => {
  return (
    <div
      className={twMerge(
        className,
        "absolute w-full bottom-0 px-4 flex justify-between items-center h-[40px]"
      )}
      {...restProps}
    >
      {children}
    </div>
  );
};

const Title = ({
  children,
  className,
  ...restProps
}: ComponentProps<"div">) => {
  return (
    <div className={className} {...restProps}>
      <h1 className="opacity-50 text-xl">{children}</h1>
    </div>
  );
};

const MenuList = ({ children }: ComponentProps<"ul">) => {
  return <ul className="flex space-x-6">{children}</ul>;
};

Toolbar.Title = Title;
Toolbar.MenuList = MenuList;

export default Toolbar;
