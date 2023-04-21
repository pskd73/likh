import { useContext } from "react";
import { AppContext } from "../AppContext";

const READ_WORDS_PER_MIN = 245;

const TextCount = () => {
  const { textMetricType, getEditingNote } = useContext(AppContext);

  const note = getEditingNote();
  const words = note?.text.replaceAll(/[\n ]+/g, " ").split(/[ \n]/).length || 0;
  const readTime = (words * 60) / READ_WORDS_PER_MIN;

  const pad = (n: number) => {
    return Math.abs(n) < 10 ? `0${n}` : String(n);
  };

  if (textMetricType === "words") {
    return <span>{words}w</span>;
  }
  if (textMetricType === "readTime") {
    return (
      <span>
        {pad(Math.floor(readTime / 60))}:{pad(Math.ceil(readTime % 60))}
      </span>
    );
  }
  return <span />;
};

export default TextCount;
