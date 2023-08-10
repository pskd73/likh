import classNames from "classnames";
import { ComponentProps, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

const Background = ({ children }: PropsWithChildren) => {
  return (
    <span
      className={classNames("absolute", "text-primary-700 text-opacity-30")}
      style={{ left: -3, bottom: 2.5 }}
    >
      {children}
    </span>
  );
};

const Highlight = ({
  className,
  children,
  bottom,
  ...restProps
}: ComponentProps<"span"> & { bottom?: number }) => {
  return (
    <span className={twMerge(className, classNames("relative"))} {...restProps}>
      {children}
      <Background>{children}</Background>
      <img
        src="/underline.png"
        className="max-w-full absolute left-0"
        style={{ bottom: bottom ? bottom : 0 }}
      />
    </span>
  );
};

const NavBtn = ({
  className,
  children,
  left,
  right,
  ...restProps
}: ComponentProps<"button"> & { left?: boolean; right?: boolean }) => {
  return (
    <button
      className={twMerge(
        className,
        classNames("inline-block text-primary-700 text-opacity-30", {
          "-mr-4": left,
          "-ml-4": right,
        })
      )}
      {...restProps}
    >
      {children}
    </button>
  );
};

Highlight.NavBtn = NavBtn;

export default Highlight;
