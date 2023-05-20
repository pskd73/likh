import classNames from "classnames";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

const Button = ({
  children,
  className,
  lite,
  link,
  ...restProps
}: (ComponentProps<"button"> | ComponentProps<"a">) & {
  lite?: boolean;
  link?: boolean;
}) => {
  const _className = twMerge(
    className,
    classNames("px-2 py-1 rounded bg-primary-700 transition-all", {
      "opacity-50 hover:opacity-100 hover:bg-opacity-10 bg-opacity-0 active:bg-opacity-20":
        lite,
      "bg-opacity-10 hover:bg-opacity-20 active:bg-opacity-30": !lite,
    })
  );
  if (link) {
    return (
      <a className={_className} {...(restProps as ComponentProps<"a">)}>
        {children}
      </a>
    );
  }
  return (
    <button className={_className} {...(restProps as ComponentProps<"button">)}>
      {children}
    </button>
  );
};

export default Button;
