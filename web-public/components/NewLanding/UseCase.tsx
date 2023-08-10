import classNames from "classnames";
import { ComponentProps, PropsWithChildren } from "react";

const Container = ({ children }: PropsWithChildren) => {
  return (
    <div className={classNames("max-w-[900px] w-full space-x-6 flex")}>
      {children}
    </div>
  );
};

const Column = ({ children }: PropsWithChildren) => {
  return <div className="w-1/2">{children}</div>;
};

const Items = ({ children }: PropsWithChildren) => {
  return <ul>{children}</ul>;
};

const Item = ({ children, active }: PropsWithChildren & {active?: boolean}) => {
  return (
    <div
      className={classNames(
        "flex bg-primary-700 bg-opacity-5 rounded-2xl p-4 space-x-4",
        "space-x-4 border-4 border-primary-700 cursor-pointer transition-all", 
        "mb-4", {
          "border-opacity-10": !active,
          "border-opacity-60": active,
          "shadow-md": active,
          "hover:bg-opacity-10": !active
        }
      )}
    >
      {children}
    </div>
  );
};

const Icon = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <div
        className={classNames(
          "text-3xl p-2 bg-primary-700 text-white rounded-full"
        )}
      >
        {children}
      </div>
    </div>
  );
};

const Title = ({ children }: PropsWithChildren) => {
  return <h2 className={classNames("text-xl mb-2")}>{children}</h2>;
};

const Content = ({ children }: PropsWithChildren) => {
  return <div>{children}</div>;
};

const Description = ({ children }: PropsWithChildren) => {
  return <p className="font-light">{children}</p>;
};

Item.Icon = Icon;
Item.Title = Title;
Item.Content = Content;
Item.Description = Description;

const UseCase = {
  Container,
  Column,
  Item,
  Items,
};

export default UseCase;
