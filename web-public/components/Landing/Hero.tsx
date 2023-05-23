import classNames from "classnames";
import { PropsWithChildren } from "react";
import { Courier } from "../font";
import SginIn from "./SignIn";

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
      <div className="text-2xl md:text-3xl">It doesn{"'"}t have to be</div>
      <div className="text-4xl md:text-8xl md:-mt-2 text-center">
        crazy to <span className="font-bold">write!</span>
      </div>
      <h1
        className={classNames(
          Courier.className,
          "text-3xl md:text-5xl font-bold mt-10 mb-6"
        )}
      >
        Retro Note
      </h1>
      <div
        className="text-2xl md:text-3xl text-center md:w-2/4 mb-6"
        style={{ lineHeight: 1.4 }}
      >
        lets you write in a <Highlight>distraction free</Highlight> environment,
        build <Highlight>daily writing habits</Highlight>, and{" "}
        <Highlight>build a blog</Highlight> quickly!
      </div>
      <SginIn />
    </div>
  );
}
