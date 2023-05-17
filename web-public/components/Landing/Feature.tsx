import classNames from "classnames";
import { PropsWithChildren } from "react";

export default function Feature({
  children,
  bg,
}: PropsWithChildren & { bg?: boolean }) {
  return (
    <div
      className={classNames("flex justify-center", {
        "bg-primary-700 bg-opacity-10 border-t-8 border-primary-700 border-opacity-30":
          bg,
      })}
    >
      <div className="lg:w-[900px] lg:flex justify-between items-center py-10 px-4 lg:px-0">
        {children}
      </div>
    </div>
  );
}

function Content({ children }: PropsWithChildren) {
  return <div>{children}</div>;
}

function Demo({ children }: PropsWithChildren) {
  return <div className="flex justify-center py-10 lg:py-0 lg:pr-10">{children}</div>;
}

function Title({ children }: PropsWithChildren) {
  return <h3 className="text-4xl font-bold mb-10">{children}</h3>;
}

function Item({ children }: PropsWithChildren) {
  return (
    <li className="text-2xl border-l-4 border-primary-700 pl-4 font-light">
      {children}
    </li>
  );
}

function List({ children }: PropsWithChildren) {
  return <ul className="space-y-6">{children}</ul>;
}

function DemoImg({ children }: PropsWithChildren) {
  return (
    <div className="w-[400px] h-[400px] flex justify-center items-center">
      <div className="max-w-[400px] max-h-[400px] rounded-md shadow-xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}

Feature.Title = Title;
Feature.Content = Content;
Feature.Demo = Demo;
Feature.Item = Item;
Feature.List = List;
Feature.DemoImg = DemoImg;
