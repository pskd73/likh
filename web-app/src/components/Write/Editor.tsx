import * as React from "react";
import { ChangeEventHandler, FormEventHandler, useEffect, useRef } from "react";
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
    if (textRef.current) {
      const NAV_HEIGHT = 40;
      const TITLE_HEIGHT = 80;
      const MAX = 10000; // 500
      const height = Math.min(
        MAX,
        window.innerHeight - NAV_HEIGHT - TITLE_HEIGHT
      );

      textRef.current.style.height = `${height}px`;
    }
  }, []);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "0";
      titleRef.current.style.height = titleRef.current.scrollHeight + "px";
    }
  }, [titleRef.current, note.title]);

  // useEffect(() => {
  //   if (textRef.current) {
  //     textRef.current.style.height = "0";
  //     textRef.current.style.height = textRef.current.scrollHeight + "px";
  //   }
  // }, [textRef.current, note.title]);

  const handleTextChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    onChange({ ...note, text: e.target.value });
  };

  const handleTitleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    e.target.style.height = "0";
    e.target.style.height = e.target.scrollHeight + "px";

    onChange({ ...note, title: e.target.value });
  };

  const handleTitleChange_: FormEventHandler<HTMLDivElement> = (e) => {
    onChange({ ...note, title: e.currentTarget.innerText });
  };

  return (
    <div>
      <textarea
        // type="text"
        // rows={1}
        value={note.title}
        ref={titleRef}
        className="text-3xl outline-none w-full pb-2 resize-none"
        onChange={handleTitleChange}
      />
      {/* <div
        className="text-3xl outline-none w-full pb-2 resize-none"
        contentEditable
        onInput={handleTitleChange_}
      >
        {note.title}
      </div> */}
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
