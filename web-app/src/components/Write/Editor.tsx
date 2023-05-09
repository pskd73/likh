import * as React from "react";
import { ChangeEventHandler, useContext, useEffect, useRef } from "react";
import { Note } from "../../type";
import { AppContext } from "../AppContext";

const TITLE_MARGIN_BOTTOM = 16;
const audio = new Audio("/mixkit-typewriter-hit-1362_M410No0n.wav");

const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const Editor = ({
  note,
  onChange,
}: {
  note: Note;
  onChange: (note: Note) => void;
}) => {
  const { settings } = useContext(AppContext);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const keyAudioRef = useRef<HTMLAudioElement>(null);

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
    playType();
  };

  const handleTitleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    e.target.style.height = "0";
    e.target.style.height = e.target.scrollHeight + "px";

    onChange({ ...note, title: e.target.value });
    playType();
  };

  const playType = () => {
    if (keyAudioRef.current && settings.typeSounds) {
      const aud = audio.cloneNode() as HTMLAudioElement;
      aud.volume = 0.07;
      aud.playbackRate = random(5, 15) / 10;
      aud.play();
    }
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
          TITLE_MARGIN_BOTTOM -
          20
      );
      textRef.current.style.height = `${textRef.current?.scrollHeight}px`;
    }
  };

  return (
    <div className="flex flex-col">
      <audio ref={keyAudioRef} controls style={{ display: "none" }}>
        <source
          src="/mixkit-typewriter-hit-1362_M410No0n.wav"
          type="audio/mpeg"
        />
      </audio>
      <textarea
        value={note.title}
        ref={titleRef}
        className="text-[48px] outline-none w-full resize-none dark:bg-iblack"
        onChange={handleTitleChange}
        style={{ marginBottom: TITLE_MARGIN_BOTTOM }}
      />
      <textarea
        ref={textRef}
        value={note.text}
        onChange={handleTextChange}
        className="outline-none w-full scrollbar-hide overflow-y-scroll resize-none dark:bg-iblack"
      />
    </div>
  );
};

export default Editor;
