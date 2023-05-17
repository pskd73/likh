import classNames from "classnames";
import { Courier } from "../font";
import { Highlight } from "./Hero";

export default function Nav() {
  return (
    <div className="flex justify-end py-10 md:px-16">
      <ul className="flex space-x-6 text-lg">
        {["Features", "Pricing"].map((text, i) => (
          <li key={i}>
            <a href="#" className="underline">
              {text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <div
      className={classNames(
        Courier.className,
        "text-center text-xl opacity-50 py-10"
      )}
    >
      Built with &#9829; by <Highlight>@pramodk73</Highlight>
    </div>
  );
}
