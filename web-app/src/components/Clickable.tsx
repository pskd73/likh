import classNames from "classnames";
import { ReactElement, cloneElement } from "react";
import { twMerge } from "tailwind-merge";

const Clickable = ({
  children,
  lite,
}: {
  children: ReactElement;
  lite?: boolean;
}) => {
  return cloneElement(children, {
    ...children.props,
    className: twMerge(
      classNames("hover:underline cursor-pointer decoration-2", {
        "opacity-50 hover:opacity-100": lite,
      }),
      children.props.className
    ),
  });
};

export default Clickable;
