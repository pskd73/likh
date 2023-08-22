import { useEffect } from "react";
import Event from "src/components/Event";
import { New } from "./New";
import { BiBook } from "react-icons/bi";

export const Page = () => {
  useEffect(() => {
    Event.track("ebook_page");
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2 flex items-center space-x-2">
        <BiBook />
        <span>Create Ebook</span>
      </h2>
      <hr />
      <New />
    </div>
  );
};
