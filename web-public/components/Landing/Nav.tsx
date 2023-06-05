import classNames from "classnames";
import { Courier } from "../font";
import { Highlight } from "./Hero";
import Link from "next/link";

export default function Nav() {
  return (
    <div className="flex justify-end py-10 px-4 md:px-16">
      <ul className="flex space-x-6 text-lg">
        {[
          { label: "Features", link: "#features" },
        ].map((item, i) => (
          <li key={i}>
            <Link href={item.link} className="underline">
              {item.label}
            </Link>
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
      Built with &#9829; by{" "}
      <Highlight>
        <a href="https://twitter.com/@pramodk73" target="_blank">
          @pramodk73
        </a>
      </Highlight>
    </div>
  );
}
