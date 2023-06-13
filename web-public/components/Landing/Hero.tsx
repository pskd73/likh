import classNames from "classnames";
import { PropsWithChildren } from "react";
import { Courier } from "../font";

export function Highlight({ children }: PropsWithChildren) {
  return (
    <span
      className={classNames(Courier.className)}
      style={{ fontStyle: "italic" }}
    >
      {children}
    </span>
  );
}

export default function Hero() {
  return (
    <div className="flex justify-center flex-col items-center">
      <div className="text-lg text-center px-6 md:px-0">
        A simple, powerful, minimalistic, markdown based note taking and
        journaling app all that you need!
      </div>
      <h1
        className={classNames(
          Courier.className,
          "text-3xl md:text-5xl font-bold mt-10 mb-6"
        )}
      >
        Retro Note
      </h1>
      <a
        href="https://app.retronote.app/write"
        className={classNames(
          Courier.className,
          "bg-primary-700 text-white italic px-6 py-2 rounded-full text-3xl"
        )}
      >
        Start writing &rarr;
      </a>

      <div className="flex flex-col items-center space-y-10 max-w-[900px] mb-16 mt-16 px-6 md:px-0">
        <img src="/one.png" className={"shadow-2xl rounded-lg w-full"} />
      </div>
    </div>
  );
}
