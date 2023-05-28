import { useEffect, useMemo } from "react";
import { Paper } from "./comps/Layout";
import MEditor from "./comps/MEditor";
import Event from "./components/Event";
import { Descendant } from "slate";
import Button from "./comps/Button";

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
    <div className="min-h-[100vh] bg-base text-primary-700 py-10">
      <Paper>
        <div className="fixed bottom-0 right-0 p-2">
          <Button link href="https://retronote.app">
            Sign in for more &rarr;
          </Button>
        </div>
        <div className="text-[20px] font-CourierPrime leading-8">
          <MEditor
            onChange={handleChange}
            initValue={initalValue!}
            typeWriter
          />
        </div>
      </Paper>
    </div>
  );
};

export default OpenWrite;
