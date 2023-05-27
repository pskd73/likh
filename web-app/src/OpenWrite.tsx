import { useEffect, useMemo, useState } from "react";
import { Paper } from "./comps/Layout";
import MEditor from "./comps/MEditor";
import Event from "./components/Event";
import { Descendant } from "slate";
import Button from "./comps/Button";
import { BiSidebar } from "react-icons/bi";
import classNames from "classnames";

const newNote = JSON.stringify([
  { type: "paragraph", children: [{ text: "# Welcome!" }] },
  { type: "paragraph", children: [{ text: "" }] },
  {
    type: "paragraph",
    children: [
      {
        text: "Hello there! Glad you landed here. _Retro Note_ helps you in building writing habits. It has all the tools that will bring you back everyday to write about the topics you are interested in.",
      },
    ],
  },
  { type: "paragraph", children: [{ text: "" }] },
  {
    type: "paragraph",
    children: [
      {
        text: "This is the sample editor! No controls, no clumsy screen. You can write your mind here! Even though there are no controls, you can make use of all __markdown__ styling if you are handy with it",
      },
    ],
  },
  { type: "paragraph", children: [{ text: "" }] },
  {
    type: "paragraph",
    children: [
      {
        text: "This note is saved on your local PC! This note is retained even if you come back later! Happy writing :)",
      },
    ],
  },
]);

const OpenWrite = () => {
  const [sideBar, setSideBar] = useState(false);
  const initalValue = useMemo(() => {
    const storedNote = localStorage.getItem("open_note");
    return storedNote ? storedNote : newNote;
  }, []);

  useEffect(() => {
    Event.track("open_write");
  }, []);

  const handleChange = ({ value }: { value: Descendant[] }) => {
    localStorage.setItem("open_note", JSON.stringify(value));
  };

  return (
    <div className="min-h-[100vh] bg-base text-primary-700">
      <div
        className={classNames(
          "fixed transition-all bg-white z-10 top-0 w-[300px] h-[100vh] border-primary-700 border-opacity-30",
          {
            "left-0 border-r-2": sideBar,
            "-left-[274px]": !sideBar,
          }
        )}
      >
        <div className="flex justify-end p-1">
          <button
            className="curosr-pointer opacity-50 hover:opacity-100"
            onClick={() => setSideBar((b) => !b)}
          >
            <BiSidebar />
          </button>
        </div>
        <div className="p-2">Left</div>
      </div>
      <div>
        <MEditor onChange={handleChange} initValue={initalValue!} />
      </div>
      <div className="flex-1 hidden lg:block h-[100vh] bg-white border-l-2 border-primary-700 border-opacity-30">
        Right
      </div>
    </div>
  );
};

export default OpenWrite;
