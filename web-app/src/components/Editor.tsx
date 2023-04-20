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
        className="text-3xl outline-none mb-10 w-full"
        onChange={handleTitleChange}
      />
      <textarea
        value={note.text}
        onChange={handleTextChange}
        className="outline-none w-full scrollbar-hide text-lg overflow-y-scroll h-[500px] resize-none"
      >
      </textarea>
    </div>
  );
};

export default Editor;
