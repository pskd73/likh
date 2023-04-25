import * as React from "react";
import { ChangeEventHandler, useEffect, useRef } from "react";
import { Note } from "../../type";

const Editor = ({
  note,
  onChange,
}: {
  note: Note;
  onChange: (note: Note) => void;
}) => {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    updateTextareaSize();

    window.addEventListener("resize", updateTextareaSize);
    return () => {
      window.removeEventListener("resize", updateTextareaSize);
    };
  }, []);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "0";
      titleRef.current.style.height = titleRef.current.scrollHeight + "px";
    }
    updateTextareaSize();
  }, [titleRef.current, note.title]);

  const handleTextChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    onChange({ ...note, text: e.target.value });
  };

  const handleTitleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    e.target.style.height = "0";
    e.target.style.height = e.target.scrollHeight + "px";

    onChange({ ...note, title: e.target.value });
  };

  const updateTextareaSize = () => {
    if (textRef.current) {
      const NAV_HEIGHT = 45;
      const MAX = 10000;
      const height = Math.min(
        MAX,
        window.innerHeight -
          NAV_HEIGHT -
          (titleRef.current?.scrollHeight || 0) -
          20
      );

      textRef.current.style.height = `${height}px`;
    }
  };

  return (
    <div className="flex flex-col">
      <textarea
        value={note.title}
        ref={titleRef}
        className="text-3xl outline-none w-full resize-none"
        onChange={handleTitleChange}
      />
      <textarea
        ref={textRef}
        value={note.text}
        onChange={handleTextChange}
        className="outline-none w-full scrollbar-hide text-lg overflow-y-scroll resize-none"
      />
    </div>
  );
};

export default Editor;
