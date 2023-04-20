import * as React from "react";
import { ChangeEventHandler, useEffect, useRef } from "react";
import { Note } from "../type";

const Editor = ({
  note,
  onChange,
}: {
  note: Note;
  onChange: (note: Note) => void;
}) => {
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const NAV_HEIGHT = 40;
      const TITLE_HEIGHT = 150;
      const height = Math.min(500, window.innerHeight - NAV_HEIGHT - TITLE_HEIGHT);

      console.log({ height });

      textRef.current.style.height = `${height}px`;
    }
  }, []);

  const handleTextChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    onChange({ ...note, text: e.target.value });
  };

  const handleTitleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange({ ...note, title: e.target.value });
  };

  return (
    <div>
      <input
        type="text"
        value={note.title}
        className="text-3xl outline-none w-full pb-2"
        onChange={handleTitleChange}
      />
      <textarea
        ref={textRef}
        value={note.text}
        onChange={handleTextChange}
        className="outline-none w-full pt-6 scrollbar-hide text-lg overflow-y-scroll resize-none"
      ></textarea>
    </div>
  );
};

export default Editor;
