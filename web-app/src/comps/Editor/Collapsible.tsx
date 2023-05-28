import classNames from "classnames";
import { PropsWithChildren } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

const Collapsible = ({ children }: PropsWithChildren) => {
  return <div className="">{children}</div>;
};

const Item = ({
  children,
  title,
  active,
  onToggle,
}: PropsWithChildren & {
  title: string;
  active?: boolean;
  onToggle: () => void;
}) => {
  return (
    <div>
      <div
        className={classNames(
          "bg-primary-700 bg-opacity-10 p-2",
          "flex justify-between items-center",
          "border-y border-primary-700 border-opacity-20",
          "shadow-md cursor-pointer"
        )}
        onClick={onToggle}
      >
        <span>{title}</span>
        <span className="text-xl">
          {active ? <BiChevronUp /> : <BiChevronDown />}
        </span>
      </div>
      <div
        className={classNames("overflow-hidden transition-all", {
          "max-h-0": !active,
          "max-h-[1000px]": active,
        })}
      >
        {children}
      </div>
    </div>
  );
};

Collapsible.Item = Item;

export default Collapsible;
