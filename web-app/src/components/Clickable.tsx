import { ReactElement, cloneElement } from "react";
import { twMerge } from "tailwind-merge";

const Clickable = ({ children }: { children: ReactElement }) => {
  return cloneElement(children, {
    ...children.props,
    className: twMerge(
      "hover:underline cursor-pointer decoration-2",
      children.props.className
    ),
  });
};

export default Clickable;
