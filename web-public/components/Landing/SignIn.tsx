import classNames from "classnames";
import { Courier } from "../font";

export default function SginIn() {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className={classNames(
          Courier.className,
          "bg-primary-700 h-[46px] md:h-[62px] rounded-full flex items-center p-1 italic md:text-2xl"
        )}
      >
        <div className="bg-white flex-1 h-full rounded-l-full flex items-center justify-center px-4 outline-none">
          <input
            type="text"
            className="italic outline-none"
            placeholder="Enter email"
          />
        </div>
        <button className="text-white italic px-2 md:px-6">write &rarr;</button>
      </div>
      <a
        href="#"
        className={classNames(
          Courier.className,
          "italic md:text-xl opacity-50 underline"
        )}
      >
        try writing
      </a>
    </div>
  );
}
